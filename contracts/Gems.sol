//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";
import "@openzeppelin/contracts/utils/cryptography/draft-EIP712.sol";

contract Gems is ERC1155, EIP712 {
    uint256 constant DOUBLOON = 0;
    uint256 constant EMERALD = 1;
    uint256 constant RUBY = 2;
    uint256 constant DIAMOND = 3;
    uint256 constant AMETHYST = 4;
    uint256 constant GOLD_RING = 5;
    uint256 constant GOLD_NECKLACE = 6;

    uint256 tokenId = 7;

    mapping(uint256 => string) public itemNames;
    mapping(uint256 => bool) public isJewelery;
    mapping(uint256 => bool) public isGem;

    address public owner;

    struct SignedItemData {
        uint256 gemId;
        uint256 jeweleryId;
    }

    event NewItemCreated(string itemName, uint256 tokenId, bool isGem);
    event JeweleryEncrusted(
        uint256 gemId,
        uint256 jeweleryId,
        uint256 encrustedId,
        address owner
    );

    constructor()
        ERC1155("https://cdn.yaytso.art/gems/metadata/{id}.json")
        EIP712("frogass", "1.0")
    {
        owner = msg.sender;
        _mint(msg.sender, DOUBLOON, 10**18, "");
        _mint(msg.sender, EMERALD, 1000, "");
        _mint(msg.sender, RUBY, 1000, "");
        _mint(msg.sender, DIAMOND, 1000, "");
        _mint(msg.sender, AMETHYST, 1000, "");
        _mint(msg.sender, GOLD_RING, 1000, "");
        _mint(msg.sender, GOLD_NECKLACE, 1000, "");

        isJewelery[GOLD_RING] = true;
        isJewelery[GOLD_NECKLACE] = true;

        isGem[EMERALD] = true;
        isGem[RUBY] = true;
        isGem[DIAMOND] = true;
        isGem[AMETHYST] = true;

        itemNames[DOUBLOON] = "doubloon";
        itemNames[EMERALD] = "emerald";
        itemNames[RUBY] = "ruby";
        itemNames[DIAMOND] = "diamond";
        itemNames[AMETHYST] = "amethyst";
        itemNames[GOLD_RING] = "gold-ring";
        itemNames[GOLD_NECKLACE] = "gold-necklace";
    }

    function createNewItem(string memory itemName, bool isGemType) public {
        require(msg.sender == owner, "Must be owner");
        _mint(msg.sender, tokenId, 1, "");
        if (isGemType) {
            isGem[tokenId] = true;
        } else {
            isJewelery[tokenId] = true;
        }
        itemNames[tokenId] = itemName;
        emit NewItemCreated(itemName, tokenId, isGemType);
        tokenId++;
    }

    function encrustJewelery(uint256 _gemId, uint256 _jeweleryId) public {
        // I think burn takes care of this
        // require(balanceOf(msg.sender, _gemId) > 0, "You must own the gem");
        // require(
        //     balanceOf(msg.sender, _jeweleryId) > 0,
        //     "You must own the jewelery"
        // );
        require(isGem[_gemId], "Provided token must be a gem");
        require(isJewelery[_jeweleryId], "Provided token must be jewelery");
        _burn(msg.sender, _gemId, 1);
        _burn(msg.sender, _jeweleryId, 1);
        _mint(msg.sender, tokenId, 1, "");
        emit JeweleryEncrusted(_gemId, _jeweleryId, tokenId, msg.sender);
        tokenId++;
    }

    function _hash(SignedItemData calldata itemData)
        internal
        view
        returns (bytes32)
    {
        bytes32 digest = _hashTypedDataV4(
            keccak256(
                abi.encode(
                    keccak256(
                        "SignedItemData(uint256 gemId,uint256 jeweleryId)"
                    ),
                    keccak256(abi.encodePacked(itemData.gemId)),
                    keccak256(abi.encodePacked(itemData.jeweleryId))
                )
            )
        );
        return digest;
    }

    function _validateSignature(bytes32 digest, bytes memory signature)
        internal
        view
        returns (bool)
    {
        address signer = ECDSA.recover(digest, signature);
        return (owner == signer);
    }
}
