//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;
import "@openzeppelin/contracts/utils/Strings.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "hardhat/console.sol";

//   1: "A",
//   2: "B",
//   3: "C",
//   4: "D",
//   5: "E",
//   6: "F",
//   7: "G",
//   8: "H",
//   9: "I",
//   10: "J",
//   11: "K",
//   12: "L",
//   13: "M",
//   14: "N",
//   15: "O",
//   16: "P",
//   17: "Q",
//   18: "R",
//   19: "S",
//   20: "T",
//   21: "U",
//   22: "V",
//   23: "W",
//   24: "X",
//   25: "Y",
//   26: "Z",

// Just make a pizza version
contract AlphabetCity is ERC721, Ownable {
    using Strings for uint256;
    using Counters for Counters.Counter;
    Counters.Counter public tokenId;
    Counters.Counter public wordIndex;
    string private _baseUri;

    address AIRCACHE_ADDRESS = 0xe6510B59d6AA01b6198B84B2f8276F163Fb77cC4;

    uint256 constant WORD_ID = 99;

    // uint256[] pizza = [16, 9, 26, 26, 1];
    // uint256[] lemon = [12, 5, 13, 15, 14];
    // uint256[] joker = [10, 15, 11, 5, 18];
    // uint256[] a = [1];
    // uint256[] public word;

    uint256[][] words = [[0]];

    mapping(uint256 => uint256) public tokenToLetter;
    mapping(address => uint256[][]) public hunterToWord;
    mapping(address => uint256) public wordOwners;

    mapping(uint256 => uint256) public wordIndexToTokenId;
    mapping(uint256 => uint256) public tokenIdToWordIndex;

    mapping(address => bool) public accountHasWord;

    event WordWon(address indexed winner, uint256 tokenId);

    constructor(string memory baseURI) ERC721("ALPHABET CITY", "ALPH") {
        hunterToWord[msg.sender] = [[0]];
        wordIndex.increment();
        _baseUri = baseURI;
        // word = pizza;
        // for (uint256 i = 1; i <= words.length; i++) {
        // mintLetter(msg.sender, 1);
        // mintWord(msg.sender, a);
        // mintWord(msg.sender, joker);
        // mintWord(msg.sender, lemon);
        // }
    }

    function getWord() public view returns (uint256[] memory) {
        return words[wordIndex.current()];
    }

    function getUsersGuesses(address user)
        public
        view
        returns (uint256[] memory)
    {
        return hunterToWord[user][wordIndex.current() - 1];
    }

    // A "letter" of 99 is a word
    function mintLetter(address recipient, uint8 letter) public onlyOwner {
        tokenId.increment();
        uint256 _tokenId = tokenId.current();
        tokenToLetter[_tokenId] = letter;
        _safeMint(recipient, _tokenId);
    }

    function mintWord(address recipient, uint256[] memory _word)
        public
        onlyOwner
    {
        tokenId.increment();
        words.push(_word);
        wordIndexToTokenId[words.length - 1] = tokenId.current();
        tokenIdToWordIndex[tokenId.current()] = words.length - 1;
        _safeMint(recipient, tokenId.current());
    }

    function _beforeTokenTransfer(
        address from,
        address to,
        uint256 _tokenId
    ) internal virtual override {
        // this interaction only needs to happen if it comes from a claim which originates from the owner
        require(to == owner(), "Must be from owner");
        require(accountHasWord[to] == false, "You may only play once!");
        if (tokenIdToWordIndex[_tokenId] > 0) {
            console.log("this is a word");
            return;
        }

        if (to == owner() || to == AIRCACHE_ADDRESS) {
            console.log(
                "This is the owner doing something or the aircache transfer"
            );
            //
        } else {
            console.log("looking for match");
            uint256 _guessIndex = wordIndex.current() - 1;
            uint256[] storage _hunterWord = hunterToWord[to][_guessIndex];
            uint256 _letter = tokenToLetter[_tokenId];
            _hunterWord.push(_letter);
            if (
                keccak256(abi.encode(_hunterWord)) ==
                keccak256(abi.encode(words[wordIndex.current()]))
            ) {
                console.log("match");
                // Because index starts at 0 and word tokenId starts from 1
                uint256 _wordWon = wordIndexToTokenId[wordIndex.current()];
                safeTransferFrom(owner(), to, _wordWon);
                accountHasWord[to] = true;
                // Now the next word is active
                emit WordWon(to, _wordWon);
                wordIndex.increment();
            } else {
                console.log("no match");
            }
        }
    }

    // function getUsersWord(address user) {
    //     return hunterToWord
    // }

    // function _baseURI() internal view virtual override returns (string memory) {
    //     return _baseURI;
    // }

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
                        "letter-",
                        tokenToLetter[_tokenId].toString(),
                        ".json"
                    )
                );
        }
        console.log("is NOT letter");

        return string(abi.encodePacked(_baseUri, _tokenId.toString(), ".json"));
    }

    function setBaseURI(string memory newURI) public onlyOwner {
        _baseUri = newURI;
    }
}
