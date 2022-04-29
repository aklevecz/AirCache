//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "hardhat/console.sol";

contract AirYaytso is Ownable {
    using Counters for Counters.Counter;
    Counters.Counter public cacheId;

    mapping(uint256 => Cache) public caches;

    struct Cache {
        bytes32 lat;
        bytes32 lng;
        uint256 id;
        uint256 tokenId;
        address tokenAddress;
    }

    event NFTHeld(
        uint256 cacheId,
        address indexed tokenAddress,
        uint256 tokenId
    );
    event NFTDropped(
        uint256 cacheId,
        address indexed winner,
        address indexed tokenAddress,
        uint256 tokenId
    );

    constructor() {}

    function createCache(bytes32 lat, bytes32 lng) public {
        cacheId.increment();
        uint256 newCacheId = cacheId.current();
        Cache memory newCache = Cache(lat, lng, newCacheId, 0, address(0));
        caches[newCacheId] = newCache;
    }

    function holdNFT(
        address tokenAddress,
        uint256 tokenId,
        uint256 _cacheId
    ) public {
        Cache memory _cache = caches[_cacheId];
        require(_cache.id == _cacheId, "Cache does not exist");
        require(_cache.tokenId == 0, "Cache is being used");
        (bool success, bytes memory returnData) = address(tokenAddress).call(
            abi.encodeWithSignature(
                "transferFrom(address,address,uint256)",
                msg.sender,
                address(this),
                tokenId
            )
        );
        require(success, "Token transfer failed");
        _cache.tokenAddress = tokenAddress;
        _cache.tokenId = tokenId;
        caches[_cacheId] = _cache;
        emit NFTHeld(_cache.id, tokenAddress, tokenId);
    }

    function dropNFT(uint256 _cacheId, address _winner) public onlyOwner {
        Cache memory _cache = caches[_cacheId];
        (bool success, bytes memory returnData) = address(_cache.tokenAddress)
            .call(
                abi.encodeWithSignature(
                    "transferFrom(address,address,uint256)",
                    address(this),
                    _winner,
                    _cache.tokenId
                )
            );
        require(success);
        emit NFTDropped(_cacheId, _winner, _cache.tokenAddress, _cache.tokenId);

        // clear the cache
        _cache.tokenId = 0;
        _cache.tokenAddress = address(0);
        caches[_cacheId] = _cache;
    }
}
