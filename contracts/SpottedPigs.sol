//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

contract SpottedPigs is ERC721 {
    constructor(address wallet) ERC721("Spotted Pigs", "SPIGS") {
        for (uint256 i = 1; i <= 100; i++) {
            _mint(wallet, i);
        }
    }

    function _baseURI() internal view virtual override returns (string memory) {
        return "ipfs://QmPqK1VGjTQNv89uyGYyP4kuyogJDq6Dt5qw84MQtqcyoX/";
    }
}
