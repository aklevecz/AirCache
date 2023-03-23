//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;
import "erc721a/contracts/ERC721A.sol";
import "@openzeppelin/contracts/utils/cryptography/draft-EIP712.sol";
import "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract MagicMap is ERC721A, EIP712, Ownable {
    string public baseURI;
    address public oracle;

    mapping(uint256 => uint8) tokenIdToType;

    struct SignedNFTData {
        uint8 tokenType;
    }

    constructor(
        string memory givenBaseURI,
        address givenOracle
    ) ERC721A("MagicMap", "MAGMAP") EIP712("teh-raptor", "1.0") {
        baseURI = givenBaseURI;
        oracle = givenOracle;
    }

    function discover(
        SignedNFTData calldata nft,
        bytes calldata signature
    ) public payable returns (uint256) {
        require(_validateSignature(_hash(nft), signature), "Invalid signature");
        uint256 _newTokenId = _nextTokenId();
        _mint(msg.sender, 1);
        tokenIdToType[_newTokenId] = nft.tokenType;
        return _newTokenId;
    }

    function _hash(SignedNFTData calldata nft) internal view returns (bytes32) {
        bytes32 digest = _hashTypedDataV4(
            keccak256(
                abi.encode(
                    keccak256("SignedNFTData(uint8 tokenType)"),
                    nft.tokenType
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
        return (owner() == signer);
    }

    function tokenURI(
        uint256 tokenId
    ) public view virtual override returns (string memory) {
        if (!_exists(tokenId)) revert URIQueryForNonexistentToken();

        return
            bytes(baseURI).length != 0
                ? string(
                    abi.encodePacked(
                        baseURI,
                        _toString(tokenIdToType[tokenId]),
                        ".json"
                    )
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
}
