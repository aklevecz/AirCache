//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

contract FakeNFT is ERC721 {
    constructor() ERC721("FakeNFT", "FAKE") {
        _mint(msg.sender, 1);
        _mint(msg.sender, 2);
    }

    function makeFake(uint256 tokenId) public {
        _mint(msg.sender, tokenId);
    }

    function _baseURI() internal view virtual override returns (string memory) {
        return "https://cdn.yaytso.art/";
    }
}
