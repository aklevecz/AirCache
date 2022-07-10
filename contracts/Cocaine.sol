//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;
import "@openzeppelin/contracts/utils/Strings.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

contract Cocaine is ERC721, Ownable {
    using Strings for uint256;
    string _tokenURI;

    constructor() ERC721("Cocaine", "COCA") {
        _tokenURI = "https://cdn.yaytso.art/narcos/metadata/cocaine.json";
        for (uint256 i = 1; i <= 9; i++) {
            _safeMint(msg.sender, i);
        }
    }

    function mintCocaine(address recipient, uint256 tokenId) public onlyOwner {
        _safeMint(recipient, tokenId);
    }

    function tokenURI(uint256 tokenId)
        public
        view
        virtual
        override
        returns (string memory)
    {
        require(
            _exists(tokenId),
            "ERC721Metadata: URI query for nonexistent token"
        );

        return _tokenURI;
    }

    function setTokenURI(string memory newURI) public onlyOwner {
        _tokenURI = newURI;
    }
}
