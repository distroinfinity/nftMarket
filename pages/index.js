/* pages/index.js */
import { ethers } from "ethers";
import { useEffect, useState, useCallback } from "react";
import axios from "axios";
import Web3Modal from "web3modal";
import Modal from "../components/Modall";

import { nftaddress, nftmarketaddress } from "../config";
import NFT from "../artifacts/contracts/NFT.sol/NFT.json";
import Market from "../artifacts/contracts/NFTMarket.sol/NFTMarket.json";

export default function Home() {
  const [nfts, setNfts] = useState([]);
  const [loadingState, setLoadingState] = useState("not-loaded");
  useEffect(() => {
    loadNFTs();
  }, []);
  async function loadNFTs() {
    /* create a generic provider and query for unsold market items */
    const provider = new ethers.providers.JsonRpcProvider(
      "https://rpc-mumbai.maticvigil.com"
    );
    const tokenContract = new ethers.Contract(nftaddress, NFT.abi, provider);
    const marketContract = new ethers.Contract(
      nftmarketaddress,
      Market.abi,
      provider
    );
    const data = await marketContract.fetchMarketItems();
    console.log("data ", data);

    /*
     *  map over items returned from smart contract and format
     *  them as well as fetch their token metadata
     */
    const items = await Promise.all(
      data.map(async (i) => {
        const tokenUri = await tokenContract.tokenURI(i.tokenId);
        console.log(tokenUri);

        const meta = await axios.get(tokenUri, { crossdomain: true });
        // const meta = await fetch(tokenUri, { mode: "no-cors" });
        console.log(meta);
        let price = ethers.utils.formatUnits(i.price.toString(), "ether");
        let item = {
          price,
          tokenId: i.tokenId.toNumber(),
          seller: i.seller,
          owner: i.owner,
          image: meta.data.image,
          name: meta.data.name,
          description: meta.data.description,
        };
        return item;
      })
    );
    setNfts(items);
    setLoadingState("loaded");
  }

  const [showModal, setShowModal] = useState(false);
  const handleShowModal = useCallback(() => {
    setShowModal(!showModal);
  }, [showModal]);
  const handleCloseModal = useCallback(() => {
    setShowModal(false);
  }, []);

  async function buyNft(nft) {
    /* needs the user to sign the transaction, so will use Web3Provider and sign it */
    const web3Modal = new Web3Modal();
    const connection = await web3Modal.connect();
    const provider = new ethers.providers.Web3Provider(connection);
    const signer = provider.getSigner();
    const contract = new ethers.Contract(nftmarketaddress, Market.abi, signer);

    /* user will be prompted to pay the asking process to complete the transaction */
    const price = ethers.utils.parseUnits(nft.price.toString(), "ether");
    const transaction = await contract.createMarketSale(
      nftaddress,
      nft.tokenId,
      {
        value: price,
      }
    );
    await transaction.wait();
    setShowModal(true);
    loadNFTs();
  }

  if (loadingState === "loaded" && !nfts.length)
    return (
      <div>
        <h1 className="px-20 py-10 text-3xl">No items in marketplace</h1>
      </div>
    );

  return (
    <div className="flex flex-col justify-center">
      {loadingState !== "loaded" ? (
        <div className="flex justify-center items-center">
          <div
            className="
      animate-spin
      rounded-full
      h-32
      w-32
      border-t-2 border-b-2 border-purple-500
    "
          ></div>
        </div>
      ) : (
        <div className="px-4" style={{ maxWidth: "1600px" }}>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-4">
            {nfts.map((nft, i) => (
              <div
                key={i}
                className="border hover:shadow-lg rounded-lg overflow-hidden"
              >
                <img
                  src={nft.image}
                  style={{ height: "200px", width: "auto" }}
                  className="rounded-lg overflow-hidden mx-auto m-4"
                />
                <div className="p-4">
                  <p
                    style={{ height: "64px" }}
                    className="text-2xl font-semibold"
                  >
                    {nft.name}
                  </p>
                  <div style={{ height: "70px", overflow: "hidden" }}>
                    <p className="text-gray-400">{nft.description}</p>
                  </div>
                </div>
                <div className="p-4 bg-black">
                  <p className="text-2xl mb-4 font-bold text-white">
                    {nft.price} MATIC
                  </p>
                  <button
                    className="w-full bg-purple-500 text-white font-bold py-2 px-12 rounded"
                    onClick={() => buyNft(nft)}
                  >
                    Buy
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      {showModal && <Modal title="Congrats...." onConfirm={handleCloseModal} />}
    </div>
  );
}
