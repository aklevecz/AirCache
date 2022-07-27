//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;
import "@openzeppelin/contracts/utils/Strings.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

contract GemsPass is ERC721, Ownable {
    using Strings for uint256;

    uint256 tokenId = 0;
    string _tokenURI;

    constructor() ERC721("GemsPass", "GP") {
        _tokenURI = "https://cdn.yaytso.art/only-gems/metadata/gems-pass-v1.json";
    }

    function mintManyPasses(address recipient, uint256 amount)
        public
        onlyOwner
    {
        for (uint256 i = 0; i < amount; i++) {
            tokenId++;
            _safeMint(recipient, tokenId);
        }
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

        return _tokenURI;
    }

    function setTokenURI(string memory newURI) public onlyOwner {
        _tokenURI = newURI;
    }
}
