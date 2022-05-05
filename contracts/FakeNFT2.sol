//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";

contract FakeNFT2 is ERC1155 {
    constructor() ERC1155("uri") {
        _mint(msg.sender, 1, 1, "");
        _mint(msg.sender, 2, 1, "");
        _mint(msg.sender, 3, 1, "");
    }

    function makeFake(uint256 tokenId) public {
        _mint(msg.sender, tokenId, 1, "");
    }
}
