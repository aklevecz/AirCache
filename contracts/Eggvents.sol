//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;
import "erc721a/contracts/ERC721A.sol";
import "@openzeppelin/contracts/utils/cryptography/draft-EIP712.sol";
import "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract Eggvents is ERC721A, EIP712, Ownable {
    string public baseURI;
    address public oracle;

    mapping(uint256 => string) public eggIdToType;
    mapping(address => string[]) public ownerToEggTypes;
    mapping(address => uint256[]) public ownerToEggIds;
    // This is not right, but maybe does not matter bc custodial for making sure they don't mint more than one
    //mapping(address => uint256) ownerToToken;

    struct Voucher {
        string tokenType;
        address receiver;
    }

    constructor(
        string memory givenBaseURI,
        address givenOracle
    ) ERC721A("Eggvents", "EGGVNTS") EIP712("teh-raptor", "1.0") {
        baseURI = givenBaseURI;
        oracle = givenOracle;
    }

    function discover(
        Voucher calldata voucher,
        bytes calldata signature
    ) public payable returns (uint256) {
        require(
            _validateSignature(_hash(voucher), signature),
            "Invalid signature"
        );
        uint256 _newTokenId = _nextTokenId();
        _mint(voucher.receiver, 1);
        eggIdToType[_newTokenId] = voucher.tokenType;

        // owner to token types
        string[] storage collectedTypes = ownerToEggTypes[voucher.receiver];
        collectedTypes.push(voucher.tokenType);
        ownerToEggTypes[voucher.receiver] = collectedTypes;

        // owner to token ids
        uint256[] storage collectedIds = ownerToEggIds[voucher.receiver];
        collectedIds.push(_newTokenId);
        ownerToEggIds[voucher.receiver] = collectedIds;

        return _newTokenId;
    }

    function _hash(Voucher calldata voucher) internal view returns (bytes32) {
        bytes32 digest = _hashTypedDataV4(
            keccak256(
                abi.encode(
                    keccak256("Voucher(string tokenType,address receiver)"),
                    keccak256(bytes(voucher.tokenType)),
                    voucher.receiver
                )
            )
        );
        return digest;
    }

    function _validateSignature(
        bytes32 digest,
        bytes memory signature
    ) internal view returns (bool) {
        address signer = ECDSA.recover(digest, signature);
        return (oracle == signer);
    }

    function tokenURI(
        uint256 tokenId
    ) public view virtual override returns (string memory) {
        if (!_exists(tokenId)) revert URIQueryForNonexistentToken();

        return
            bytes(baseURI).length != 0
                ? string(
                    abi.encodePacked(baseURI, eggIdToType[tokenId], ".json")
                )
                : "";
    }

    function _startTokenId() internal view virtual override returns (uint256) {
        return 1;
    }

    function changeBaseURI(string memory newBaseURI) public onlyOwner {
        baseURI = newBaseURI;
    }

    function changeOracle(address newOracle) public onlyOwner {
        oracle = newOracle;
    }

    function getOwnerEggTypes(
        address owner
    ) public view returns (string[] memory) {
        string[] memory tokenTypes = ownerToEggTypes[owner];
        return tokenTypes;
    }

    function getOwnerEggIds(
        address owner
    ) public view returns (uint256[] memory) {
        uint256[] memory tokenIds = ownerToEggIds[owner];
        return tokenIds;
    }
}
