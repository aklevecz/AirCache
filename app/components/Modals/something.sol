// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;


// standard imports
import "@openzeppelin/contracts/access/Ownable.sol";
// interfaces
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";




contract StakeSO_TestV26 is Ownable {


    uint256 public totalStaked;

    // initStaking variable
    bool _init;

    // SO NFT and DSGNToken
    IERC20 public rewardsToken;
    IERC721 public stakeNFT;

    // mapping of a staker to its current properties
    mapping(address => Staker) public stakers;

    // mapping from rarity to rate
    mapping(uint256 => uint256) rarityToRate;

    // mapping form rarity to slots
    mapping(uint256 => uint256) rarityToSlots;

    // array of all stakers to loop through
    address[] stakerAddresses;

    struct Staker {
        // tokenIds staked for this Staker and corresponding points in time staked
        uint256[] tokenIds;
        uint256[] timestamps;
        // stores rate at time of staking
        uint256[] idRates;
        address tokenOwner;
        // if nft is unstaked without claiming tokens, remaining claimable tokens are written here
        uint256 unclaimedTokens;
        // boolean whether Staker already has staked
        bool created;
    }

    /*-------------  MODIFIERS ------------- */
    
    modifier lockContract() {
        require(compareUnclaimedToRemaining(), "Not enough Tokens in contract remaining");
        _;
    }
    
     

     /*-------------  Initialisation ------------- */



    /**
    Single gateway to intialize the staking contract after deploying
    Sets the contract with the SO NFT and DSGN reward token 
     */
    function initStaking(
        IERC20 _rewardsToken,
        IERC721 _NFT
    )
        external
    {
        require(!_init, "Already initialised");
        rewardsToken = _rewardsToken;
        stakeNFT = _NFT;
        _init = true;
    }



 /*-------------  Staking, Unstaking & Claiming -------------*/
    
    /*
    Stake ERC771 specified by Token ID
    */
    // staking not possible if not enough tokens in contract
    function stake(uint256 _tokenId) public lockContract{
        require(_tokenId <= 10000, "invalid tokenID");
        require(_tokenId > 0, "invalid tokenID");

        // staker needs to own tokenId
        require(stakeNFT.ownerOf(_tokenId) == msg.sender, "you don't own this NFT, screenshots do not count");
        // slots need to be available 
        uint256 rarity = getRarity(_tokenId);
        uint256[] memory allRemainingSlots = getRemainingSlots();
        uint256 remainingForRarity = allRemainingSlots[rarity];
        require(remainingForRarity > 0, "no more slots available!");

        // transfer NFT to contract
        stakeNFT.transferFrom(msg.sender, address(this), _tokenId);

        // get staker struct, if it does not exists, creates new one
        Staker storage staker = stakers[msg.sender];
        if(!staker.created) {
            // set token owner
            staker.tokenOwner = msg.sender;
            // toggle boolean created
            staker.created = true;
            // add address to arraay of addresses
            stakerAddresses.push(msg.sender);
        }

        // push newly staked token to array
        staker.tokenIds.push(_tokenId);
        // push current timestamp to array
        staker.timestamps.push(block.timestamp);
        // TODO: CHECK CORRECTNESS
        // push current rate of staked tokenId corresponding to rarity
        uint256 rate = getCurrentRatio(rarity);
        staker.idRates.push(rate);
        // increase number of staked nfts
        totalStaked = totalStaked += 1;
    }


    /*
    Stake multiple tokens in one transaction specified by token IDs(input: [7,9,12,35,...,420])
    */
    function batchStaking(uint256[] calldata _tokenIds) public {
        for(uint256 i = 0; i < _tokenIds.length; i++) {
            stake(_tokenIds[i]);
        }
    }


    /*
    Unstake Token specified by tokenId
    When unstaking one (of possibly multiple NFTs staked), all earned ERC20-
    tokens are send to unstaker as well as ERC721-token specified as parameter
    */
    function unstakeAndClaim(uint256 _tokenId) public {
        require(_tokenId <= 10000, "invalid TokenId");
        require(_tokenId > 0, "invalid TokenId");

        // get staker struct
        Staker storage unstaker = stakers[msg.sender]; 
        // unstaker needs to be owner of tokenId
        require(unstaker.tokenOwner == msg.sender, "invalid tokenId");

        // send earned tokens to unstaker (timestamps are updated)
        uint256 amountEarned = calculateEarnedTokens(unstaker) * (10**18);
        rewardsToken.transfer(msg.sender, amountEarned);

        // get last index of array tokenIds
        uint256 lastIndex = unstaker.tokenIds.length - 1;
        // get (key)value of last index of tokenIds and idRates
        uint256 lastIndexKeyTokenId = unstaker.tokenIds[lastIndex];
        uint256 lastIndexKeyIdRate = unstaker.idRates[lastIndex];
        // get index of token to unstake
        uint256 tokenIdIndex = getIndexForTokenId(_tokenId);

        // replace unstaked tokenId & idRate with last stored tokenId 
        // (order does not matter for timestamps since all have been updated during withdrawal)
        unstaker.tokenIds[tokenIdIndex] = lastIndexKeyTokenId;
        unstaker.idRates[tokenIdIndex] = lastIndexKeyIdRate;

        // pop last value of array tokenIds, timestamps & idRates
        unstaker.tokenIds.pop();
        unstaker.timestamps.pop();
        unstaker.idRates.pop();

        // send back unstaked NFT
        stakeNFT.transferFrom(address(this), msg.sender, _tokenId);
        // set unstaker.unclaimed to zero
        unstaker.unclaimedTokens = 0;
        // decrease totalStaked by one
        totalStaked = totalStaked -= 1;
    }


    /*
    this function lets a user unstake multiple (specified) tokens and
    claim all earned tokens (input: [7,9,12,35,...,420])
    */
    function batchUnstakeAndClaim(uint256[] calldata _tokenIds) public {
        for(uint256 i = 0; i < _tokenIds.length; i++) {
            // since unstakeAndClaim claims tokens earned by all staked NFTs, just call once
            if(i == 0) {
                unstakeAndClaim(_tokenIds[i]);
            }
            // else call unstakeWithoutClaim, such that no unnecessary zero
            // token transfers are made
            else {
                unstakeWithoutClaim(_tokenIds[i]);
            }
        }
    }

    // UNTESTED
    // unstakes all NFTs of staker
    function unstakeAll() public {
        Staker storage staker = stakers[msg.sender];
        for(uint256 i = 0; i < (staker.tokenIds).length; i++) {
            if(i == 0) {
                unstakeAndClaim(staker.tokenIds[i]);
            }
            else {
                unstakeWithoutClaim(staker.tokenIds[i]);
            }
            
        }
    }


    /*
    Allows stakers to claim the amount of tokens earned (by ALL staked NFTs)
    without unstaking tokens
    */
    function claim() public {

        // get staker struct object of claimer
        Staker storage claimer = stakers[msg.sender];

        // check whether mapping and struct address match
        require(claimer.tokenOwner == msg.sender, "weird error");

        // get rewards earned
        uint256 amount = calculateEarnedTokens(claimer) * (10**18);

        // rewards earned have to be larger than zero (else the caller wastes gas)
        require(amount > 0, "No tokens earned");
        
        // set all timestamps to current timestamp
        for(uint256 i = 0; i < claimer.timestamps.length; i++) {
            claimer.timestamps[i] = block.timestamp;
        }

        // transfer tokens from contract to msg.sender
        rewardsToken.transfer(msg.sender, amount);

        // set unclaimed tokens from previously unclaimed (when unstaked without claiming) to zero
        claimer.unclaimedTokens = 0;
    }


    /*
    Lets users unstake without claiming the earned tokens
    */
    function unstakeWithoutClaim(uint256 _tokenId) public {
        require(_tokenId <= 10000, "invalid TokenId");
        require(_tokenId > 0, "invalid TokenId");
        // get staker struct
        Staker storage staker = stakers[msg.sender];
        // get earned tokens of specific nft
        uint256 earnedByToken = calculateSingleEarning(_tokenId, msg.sender);
        // add unclaimed tokens to struct staker
        staker.unclaimedTokens += earnedByToken;

        // get last index of array
        uint256 lastIndex = staker.tokenIds.length - 1;
        // get (key)value of last index
        uint256 lastIndexKeyTokenId = staker.tokenIds[lastIndex];
        uint256 lastIndexKeyTimestamp = staker.timestamps[lastIndex];
        uint256 lastIndexKeyIdRate = staker.idRates[lastIndex];
        // get index of token to unstake
        uint256 tokenIdIndex = getIndexForTokenId(_tokenId);


        // replace unstaked tokenId with last stored tokenId 
        // (order does not matter since timestamps have been updated during withdrawal)
        staker.tokenIds[tokenIdIndex] = lastIndexKeyTokenId;
        staker.timestamps[tokenIdIndex] = lastIndexKeyTimestamp;
        staker.idRates[tokenIdIndex] = lastIndexKeyIdRate;

        // pop last value of array tokenIds, timestamps & idRates
        staker.tokenIds.pop();
        staker.timestamps.pop();
        staker.idRates.pop();
        
        // unstake NFT
        stakeNFT.transferFrom(address(this), msg.sender, _tokenId);
        totalStaked -= 1;
    }


    /*
    this function lets a user unstake multiple tokens
    without claiming earned tokens (input: [7,9,12,35,...,420])
    */
    function batchUnstakeWithoutClaim(uint256[] calldata _tokenIds) public {
        for(uint256 i = 0; i < _tokenIds.length; i++) {
            unstakeWithoutClaim(_tokenIds[i]);
        }
    }


/*------------- Calculation, Logics -------------*/

    /*
    this function returns the earnings of one single NFT
    */
    function calculateSingleEarning(uint256 _tokenId, address _staker) public view returns(uint256) {
        require(_tokenId <= 10000, "invalid TokenId");
        require(_tokenId > 0, "invalid TokenId");
        // get staker struct
        Staker storage staker = stakers[_staker];
        uint256 amount = 0;
        require(staker.tokenIds.length > 0, "no token staked");
        // get specific amount earned by token
        for(uint256 i = 0; i < staker.tokenIds.length; i++) {
            if(staker.tokenIds[i] == _tokenId) {
                uint256 stakedAt = staker.timestamps[i];
                // Calculate based on time period staked times ratio
                uint256 timeNow = block.timestamp;
                uint256 rate =  staker.idRates[i];
                amount = (rate * (timeNow - stakedAt)) / (86400);
                return amount;
            }
        }
        return amount;
    }



    /*
    Calculates amount of tokens earned by the staker,
    called internally when claiming
    */ 
    function calculateEarnedTokens(Staker storage _staker) internal view returns(uint256) {
        // amount earned
        uint256 amount = 0;

        // get amount of NFTs staked
        uint256 NFTsStaked = _staker.tokenIds.length;

        // time at the moment of withdrawal
        uint256 timeNow = block.timestamp;

        // calculate amount earned per NFT and sum up
        for(uint256 i = 0; i < NFTsStaked; i++) {
            uint256 staketAtTime = _staker.timestamps[i];
            // divided by amount of seconds per day - e.g. if staked one day, 
            // difference should be > 86400, divided by 86400 = 1,
            //  times tokenRatio = earned tokens
            uint256 rate = _staker.idRates[i];
            amount += (rate * (timeNow - staketAtTime)) / (86400);  
        }
        // include unclaimed tokens from already unstaked nfts
        if(_staker.created) {
            amount += _staker.unclaimedTokens;
        }
        return amount;
    }



    /*
    Read only function: returns amount of tokens earned until moment function has been called
    */ 
    function returnEarnedInterest(address _earner) public view returns(uint256) {
        Staker storage staker = stakers[_earner];
        uint256 amount = 0;

        // get amount of NFTs staked
        uint256 NFTsStaked = staker.tokenIds.length;

        // time at the moment of withdrawal
        uint256 timeNow = block.timestamp;

        // calculate amount earned per NFT and sum up
        for(uint256 i = 0; i < NFTsStaked; i++) {
            uint256 staketAtTime = staker.timestamps[i];
            // divided by amount of seconds per day - e.g. if staked one day, difference should be > 86400, divided by 86400 = 1, times tokenratio = earned tokens
            uint256 rate = staker.idRates[i];
            amount += (rate * (timeNow - staketAtTime)) / (86400);
        }
        // include unclaimed tokens from already unstaked nfts
        if(staker.created) {
            amount += staker.unclaimedTokens;
        }
        return amount;
    }



    /*
    Returns the index of the token ID in a stakers struct array of tokenIds,
    reverts if queried tokenId not in array
    */
    function getIndexForTokenId(uint256 _tokenId) internal view returns(uint256) {
        require(_tokenId <= 10000, "invalid TokenId");
        require(_tokenId > 0, "invalid TokenId");
        Staker storage _staker = stakers[msg.sender];
        for(uint256 i = 0; i < _staker.tokenIds.length; i++) {
            if(_staker.tokenIds[i] == _tokenId) {
                return i;
            }
        }
        revert();
    }



    /*------------- Administrative -------------*/

    /* 
    Lets owner withdraw contract if contract balance not too small
    Can't remove more tokens if remaining amount smaller than unclaimed amount
    */
    function adminWithdraw(uint256 _amount) public onlyOwner lockContract {
        uint256 unclaimedTokens = getTotalUnclaimedTokens();
        uint256 remaining = rewardsToken.balanceOf(address(this));
        // amount remaining after withdrawal has to be larger than amount of unclaimed tokens
        require(remaining - _amount > unclaimedTokens, "not enough tokens remaining");
        rewardsToken.transfer(msg.sender, _amount);
        
    }


    /*
    This function sets the interest rate per rarity - 
    from common to legendary, e.g. [100, 200, ..., 500]
     - only by contract owner
    Tokenratio in form of tokens earned per day (?),
    e.g. TokenRatio = 500 * 10^18 <==> 500 FloTokens per day
    */ 
    function setTokenRatio(uint256[] calldata  _tokenRatios) public onlyOwner {
        uint256 length = _tokenRatios.length;
        require(length < 6, 'only 5 rarities');
        for(uint256 i = 0; i < length; i++) {
            rarityToRate[i] = _tokenRatios[i];
        }
    }

    /*
    This function sets the number of slots per rarity - 
    from common to legendary, e.g. [1000, 300, ..., 3]
    */
    function setSlots(uint256[] calldata _numberOfSlots) public onlyOwner {
        require(_numberOfSlots.length == 5, "Set slot size for every rarity");
        uint256[] memory currentAmount = getAllSlotSizes();
        uint256[] memory maxSlots = new uint256[](5);
        maxSlots[0] = 4500;
        maxSlots[1] = 3500;
        maxSlots[2] = 1500;
        maxSlots[3] = 490;
        maxSlots[4] = 10;
        // cant set slot size to smaller number than amount staked currently
        // cant set slot size to larger number than amount existing per rarity
        uint256[] memory remainingAmount = getRemainingSlots();
        for(uint256 i = 0; i < _numberOfSlots.length; i++) {
            uint256 stakedPerRarity = currentAmount[i] - remainingAmount[i];
            require(_numberOfSlots[i] - stakedPerRarity > 0, "More staked than set");
            require(_numberOfSlots[i] <= maxSlots[i], "Slotnumber exceeds tokens");
        }
    

        uint256 length = _numberOfSlots.length;
        for(uint256 i = 0; i < length; i++) {
            rarityToSlots[i] = _numberOfSlots[i];
        }
    }

    // Sets NFT address
    function setNFT(IERC721 _NFT) public onlyOwner {
        stakeNFT = _NFT;
    }

    // Sets Reward token address
    function setRewardsToken(IERC20 _rewardsToken) public onlyOwner {
        rewardsToken = _rewardsToken;
    }

    /*------------- Read Only functions -------------*/


    /* 
    Returns rarity based on token ID:
    legendary = 4, epic = 3, ultra rare = 2, rare = 1, common = 0
     */
    function getRarity(uint256 _tokenId) public pure returns(uint256) {
        require(_tokenId <= 10000, "invalid TokenId");
        require(_tokenId > 0, "invalid TokenId");
        if(_tokenId >= 5501) {
            return 0;
        }
        else if(_tokenId >= 2001) {
            return 1;
        }
        else if(_tokenId >= 501) {
            return 2;
        }
        else if(_tokenId >= 11) {
            return 3;
        }
        else return 4;
    }

    /*
    Gets rate (DSIGN per second) for a specific rarity
    rarity has to be in intervall [0-4]
    */
    function getCurrentRatio(uint256 _rarity) public view returns(uint256) {
        require(_rarity <= 4, "invalid rarity");
        require(_rarity >= 0, "invalid rarity");
        uint256 rate = rarityToRate[_rarity];
        return rate;
    }


    /*
    Gets slots for a specific rarity
    */
    function getNumberSlots(uint256 _rarity) public view returns(uint256) {
        require(_rarity <= 4, "invalid rarity");
        require(_rarity >= 0, "invalid rarity");
        uint256 numberOfSlots = rarityToSlots[_rarity];
        return numberOfSlots;
    }


    /*
    Returns current contract balance
    */
    function getContractBalance() public view returns(uint256) {
        return rewardsToken.balanceOf(address(this));
    }

    /*
    Returns the amount of tokens unclaimed by all stakers
    */
    function getTotalUnclaimedTokens() public view returns(uint256) {
        uint256 totalAmount = 0;
        for(uint256 i = 0; i < stakerAddresses.length; i++) {
            // Loop through all addresses, get struct staker, calc unclaimed tokens, add to total
            totalAmount += calculateEarnedTokens(stakers[stakerAddresses[i]]);
            totalAmount += stakers[stakerAddresses[i]].unclaimedTokens;
        }
        return totalAmount;
    }

    /*
    Returns true if the contract balance is higher than amount of unclaimed tokens 
    */
    function compareUnclaimedToRemaining() public view returns(bool) {
        // get remaining tokens in contract
        uint256 _contractBalance = getContractBalance();
        // get unclaimed tokens amount
        uint256 unclaimedTokens = getTotalUnclaimedTokens();
        if(_contractBalance < unclaimedTokens) {
            // if more unclaimedTokens than contractBalance, return false, else true
            return false;
        }
        return true;
    }


    /*
    Returns current consumption rate due to staked NFTS
    */
    function getConsumptionRate() public view returns(uint256) {
        uint256 consumptionRatePerDay = 0;
        for(uint256 i = 0; i < stakerAddresses.length; i++) {
            Staker storage staker = stakers[stakerAddresses[i]];
            uint256 NFTsStaked = staker.tokenIds.length;
            for(uint256 j = 0; j< NFTsStaked; j++) {
                consumptionRatePerDay += staker.idRates[j];
            }

        }
        return consumptionRatePerDay;
    }
    //
    function daysLeft() public view returns(uint256) {
        uint256 consumptionRatePerDay = getConsumptionRate();
        uint256 balance = rewardsToken.balanceOf(address(this))/(10**18);
        // If no NFT staked at all, consumption rate is zero & infinte days left
        require(consumptionRatePerDay > 0, "consumption rate is zero, infinite days left");
        return balance/consumptionRatePerDay;
    }
    
    // get number of slots remaining free 
    function getRemainingSlots() public view returns(uint256[] memory) {
        uint256[] memory slots = new uint256[](5);
        for(uint256 i = 0; i < 5; i++) {
            slots[i] = rarityToSlots[i];
        }
        uint256 leng = stakerAddresses.length;
        for(uint256 i = 0; i < leng; i++) {
            Staker storage staker = stakers[stakerAddresses[i]];
            uint256 amountTokens = staker.tokenIds.length;
            for(uint256 j = 0; j < amountTokens; j++) {
                uint256 rarity = getRarity(staker.tokenIds[j]);
                slots[rarity] -= 1;
            }
        }
        return slots;
    }

    // Returns all tokens which _staker has staked 
    function getTokenIdsForAddress(address _staker) public view returns(uint256[] memory) {
        Staker storage staker = stakers[_staker];
        uint256[] memory tokens = staker.tokenIds;
        uint256 leng = staker.tokenIds.length;
        uint256[] memory ids = new uint256[](leng);
        
        for(uint256 i = 0; i < leng; i++) {
            ids[i] = tokens[i];
        }
        //return staker.tokenIds;
        return ids;
    }

    // Returns rates at which a staker staked initially
    function getRatesOfStaker(address _staker) public view returns(uint256[] memory) {
        Staker storage staker = stakers[_staker];
        uint256[] memory tokenRates = staker.idRates;
        uint256 leng = staker.idRates.length;
        uint256[] memory rates = new uint256[](leng);
        
        for(uint256 i = 0; i < leng; i++) {
            rates[i] = tokenRates[i];
        }
        //return staker.tokenIds;
        return rates;
    }

    // Returns array with all slotsizes
    function getAllSlotSizes() public view returns(uint256[] memory) {
        uint256[] memory slotSizes = new uint256[](5);
        for(uint256 i = 0; i < 5; i++) {
            slotSizes[i] = rarityToSlots[i];
        }
    return slotSizes;
    }
    
}