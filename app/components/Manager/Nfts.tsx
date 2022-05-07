import { ethers } from "ethers";
import { abis, AIRCACHE_ADDRESS_MATIC } from "../../libs/constants";
import managerApi from "../../libs/managerApi";
import { Web3Wallet } from "../../libs/types";

type Props = {
  onGetNfts: () => void;
  nfts: any;
  selectedNft: any;
  setSelectedNft: any;
  web3Wallet: Web3Wallet;
};

export default function Nfts({
  onGetNfts,
  nfts,
  selectedNft,
  setSelectedNft,
  web3Wallet,
}: Props) {
  return (
    <div className="my-10">
      <button onClick={onGetNfts}>get NFTs</button>
      {nfts &&
        nfts.map((nft: any) => (
          <div
            key={nft.contract.address + nft.id.tokenId}
            onClick={() => {
              setSelectedNft(nft);
            }}
            style={{
              backgroundColor:
                selectedNft &&
                selectedNft.contract.address + selectedNft.id.tokenId ===
                  nft.contract.address + nft.id.tokenId
                  ? "red"
                  : "black",
            }}
          >
            <div>
              {nft.contract.address} - {parseInt(nft.id.tokenId)}
            </div>
          </div>
        ))}
      <button
        onClick={() => {
          const nftAddress = selectedNft.contract.address;
          const tokenContract = new ethers.Contract(
            nftAddress,
            [abis.approve, abis.setApprovalForAll],
            web3Wallet.metaMask.provider!
          );
          const signer = tokenContract.connect(
            web3Wallet.metaMask.provider!.getSigner()
          );
          try {
            const tokenContract = new ethers.Contract(
              nftAddress,
              [abis.setApprovalForAll],
              web3Wallet.metaMask.provider!
            );
            const signer = tokenContract.connect(
              web3Wallet.metaMask.provider!.getSigner()
            );
            signer.approve(AIRCACHE_ADDRESS_MATIC, selectedNft.id.tokenId);
          } catch (e) {
            signer.setApprovalForAll(AIRCACHE_ADDRESS_MATIC, true);
          }
        }}
      >
        APPROVE
      </button>
    </div>
  );
}
