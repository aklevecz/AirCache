//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;
import "erc721a/contracts/ERC721A.sol";
import "@openzeppelin/contracts/utils/cryptography/draft-EIP712.sol";
import "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract MagicMap is ERC721A, EIP712, Ownable {
    string public baseURI;
    address public oracle;

    mapping(uint256 => string) public tokenIdToType;
    mapping(address => string[]) public ownerToTokenTypes;
    mapping(address => uint256[]) public ownerToTokenIds;
    // This is not right, but maybe does not matter bc custodial for making sure they don't mint more than one
    //mapping(address => uint256) ownerToToken;

    struct SignedNFTData {
        string tokenType;
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

        // owner to token types
        string[] storage collectedTypes = ownerToTokenTypes[msg.sender];
        collectedTypes.push(nft.tokenType);
        ownerToTokenTypes[msg.sender] = collectedTypes;

        // owner to token ids
        uint256[] storage collectedIds = ownerToTokenIds[msg.sender];
        collectedIds.push(_newTokenId);
        ownerToTokenIds[msg.sender] = collectedIds;

        return _newTokenId;
    }

    function _hash(SignedNFTData calldata nft) internal view returns (bytes32) {
        bytes32 digest = _hashTypedDataV4(
            keccak256(
                abi.encode(
                    keccak256("SignedNFTData(string tokenType)"),
                    keccak256(bytes(nft.tokenType))
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
                    abi.encodePacked(baseURI, tokenIdToType[tokenId], ".json")
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

    function getOwnerTokenTypes(
        address owner
    ) public view returns (string[] memory) {
        string[] memory tokenTypes = ownerToTokenTypes[owner];
        return tokenTypes;
    }

    function getOwnerTokenIds(
        address owner
    ) public view returns (uint256[] memory) {
        uint256[] memory tokenIds = ownerToTokenIds[owner];
        return tokenIds;
    }
}
