//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;
import "@openzeppelin/contracts/utils/Strings.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

//https://cdn.yaytso.art/pixeltross/metadata/
contract Pixeltross is ERC721, Ownable {
    using Strings for uint256;
    string private _baseUri;

    constructor(string memory baseURI) ERC721("Pixeltrosses", "TROSS") {
        _baseUri = baseURI;
    }

    function createTross(address recipient, uint256 tokenId) public onlyOwner {
        _safeMint(recipient, tokenId);
    }

    // function _baseURI() internal view virtual override returns (string memory) {
    //     return _baseURI;
    // }

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

        // string memory baseURI = _baseURI();
        return string(abi.encodePacked(_baseUri, tokenId.toString(), ".json"));
    }

    function setBaseURI(string memory newURI) public onlyOwner {
        _baseUri = newURI;
    }
}
