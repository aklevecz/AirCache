//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;
import "erc721a/contracts/ERC721A.sol";

contract HiFiHoodies is ERC721A {
    string public baseURI;
    address owner;

    constructor(string memory givenBaseURI) ERC721A("HiFiHoodies", "HIFIH") {
        baseURI = givenBaseURI;
        owner = msg.sender;
        _mint(msg.sender, 20);
    }

    function stitch(uint256 quantity) external {
        _mint(msg.sender, quantity);
    }

    function tokenURI(
        uint256 tokenId
    ) public view virtual override returns (string memory) {
        if (!_exists(tokenId)) revert URIQueryForNonexistentToken();

        string memory baseURI = _baseURI();
        return
            bytes(baseURI).length != 0
                ? string(abi.encodePacked(baseURI, _toString(tokenId), ".json"))
                : "";
    }

    function _startTokenId() internal view virtual override returns (uint256) {
        return 1;
    }

    function changeBaseURI(string memory newBaseURI) public {
        require(msg.sender == owner, "only owner");
        baseURI = newBaseURI;
    }

    function _baseURI() internal view virtual override returns (string memory) {
        return baseURI;
    }
}
