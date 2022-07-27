//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;
import "@openzeppelin/contracts/utils/Strings.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "hardhat/console.sol";

contract PizzaCity is ERC721, Ownable {
    using Strings for uint256;
    using Counters for Counters.Counter;
    Counters.Counter public tokenId;
    Counters.Counter public pizzaIndex;
    string private _baseUri;

    address airCacheAddress = 0x7800f1db3e103cB534f77B9d66A4E2061a79F9df;

    uint256 constant WORD_ID = 99;

    uint256[] PIZZA = [16, 9, 26, 26, 1];

    mapping(uint256 => uint256) public tokenToLetter;
    mapping(address => uint256[][]) public hunterToPizza;
    mapping(address => uint256) public pizzaOwners;

    mapping(uint256 => uint256) public pizzaIndexToTokenId;
    mapping(uint256 => uint256) public tokenIdToPizzaIndex;

    mapping(address => bool) public accountHasPizza;

    event PizzaWon(address indexed winner);

    constructor(string memory baseURI, address _airCacheAddress)
        ERC721("PIZZA CITY", "PC")
    {
        _baseUri = baseURI;
        airCacheAddress = _airCacheAddress;
    }

    function getUsersGuesses(address user)
        public
        view
        returns (uint256[] memory)
    {
        return hunterToPizza[user][pizzaIndex.current()];
    }

    // A "letter" of 99 is a word
    function mintLetter(address recipient, uint8 letter) public onlyOwner {
        tokenId.increment();
        uint256 _tokenId = tokenId.current();
        tokenToLetter[_tokenId] = letter;
        _safeMint(recipient, _tokenId);
    }

    function mintPizza(address recipient) public onlyOwner {
        tokenId.increment();
        pizzaIndexToTokenId[pizzaIndex.current()] = tokenId.current();
        tokenIdToPizzaIndex[tokenId.current()] = pizzaIndex.current();
        _safeMint(recipient, tokenId.current());
    }

    function _beforeTokenTransfer(
        address from,
        address to,
        uint256 _tokenId
    ) internal virtual override {
        if (from != owner()) {
            console.log("must be from owner");
            return;
        }
        require(accountHasPizza[to] == false, "You may only play once!");
        if (tokenIdToPizzaIndex[_tokenId] > 0) {
            console.log("this is a word");
            return;
        }

        if (to == owner() || to == airCacheAddress) {
            console.log(
                "This is the owner doing something or the aircache transfer"
            );
            //
        } else {
            uint256 _guessIndex = pizzaIndex.current();
            uint256 _letter = tokenToLetter[_tokenId];
            // initialize hunter & letter
            if (hunterToPizza[to].length == 0) {
                console.log("hunter init");
                hunterToPizza[to].push([_letter]);
            } else if (hunterToPizza[to].length <= _guessIndex) {
                console.log("hunt init");
                hunterToPizza[to].push([_letter]);
            } else {
                console.log("hunt continue");
                hunterToPizza[to][_guessIndex].push(_letter);
            }
            uint256[] storage _hunterPizza = hunterToPizza[to][_guessIndex];
            console.log("checking");
            if (
                keccak256(abi.encode(_hunterPizza)) ==
                keccak256(abi.encode(PIZZA))
            ) {
                console.log("match");
                mintPizza(to);
                accountHasPizza[to] = true;
                emit PizzaWon(to);
                pizzaIndex.increment();
            } else {
                console.log("no match");
            }
        }
    }

    function isLetter(uint256 _tokenId) private view returns (bool) {
        return tokenToLetter[_tokenId] > 0;
    }

    function tokenURI(uint256 _tokenId)
        public
        view
        virtual
        override
        returns (string memory)
    {
        require(
            _exists(_tokenId),
            "ERC721Metadata: URI query for nonexistent token"
        );
        if (isLetter(_tokenId)) {
            console.log("is letter");
            return
                string(
                    abi.encodePacked(
                        _baseUri,
                        tokenToLetter[_tokenId].toString(),
                        ".json"
                    )
                );
        }
        console.log("is NOT letter");
        return string(abi.encodePacked(_baseUri, "pizza.json"));
        // return string(abi.encodePacked(_baseUri, _tokenId.toString(), ".json"));
    }

    function setBaseURI(string memory newURI) public onlyOwner {
        _baseUri = newURI;
    }

    function setAirCacheAddress(address _newAirCacheAddress) public onlyOwner {
        airCacheAddress = _newAirCacheAddress;
    }
}
