import { useEffect, useState, useMemo } from 'react'

import { useWeb3 } from '@3rdweb/hooks'
import { ThirdwebSDK } from '@3rdweb/sdk'
import { useRouter } from 'next/router'
import _ from 'lodash';
import { client } from '../../../lib/sanityClient.js'

import Header from '../../../components/Header.js'
import NFTImage from '../../../components/NFTImage.js'
import GeneralDetails from '../../../components/GeneralDetails.js'
import ItemActivity from '../../../components/ItemActivity.js'
import Purchase from '../../../components/Purchase.js'
import Web3Modal from "web3modal";
import { ethers } from 'ethers'

import SliderNfts from '../../../components/SliderNfts.js'

import { style } from './styles.js'

import {
  marketplaceAddress
} from '../../../config'

const providerOptions = {
};

import BoxBlockNFT from '../../../artifacts/contracts/BoxBlock.sol/BoxBlockNFT.json'
import BoxBlockNFTMarketplace from '../../../artifacts/contracts/BoxBlock.sol/BoxBlockNFTMarketplace.json'

const Nft = () => {
  const { address } = useWeb3()
  const router = useRouter()

  const { collectionId } = router.query
  const { nftId } = router.query
  const [ownerData, setOwnerData] = useState([])
  const [collection, setCollection] = useState([]);
  const selectedNft = "";
  const [nft, setNft] = useState([])

  const getNftData = async() => {

    if ( !collectionId || collectionId == null || !nftId || nftId == null ) {
      return false;
    }

    console.log('buscando os dados do nft');

    const provider = new ethers.providers.JsonRpcProvider();

    let marketplace = new ethers.Contract(marketplaceAddress, BoxBlockNFTMarketplace.abi, provider);
    let token = new ethers.Contract(collectionId, BoxBlockNFT.abi, provider);

    let nft_marketplace = await marketplace.getListedNFT(collectionId, nftId);
    let nft_marketplace_bid = await marketplace.getAuctionedNFT(collectionId, nftId);

    let checkIsListed = nft_marketplace.seller != "0x0000000000000000000000000000000000000000" && ( !nft_marketplace.sold || nft_marketplace_bid.success );
    let checkIsAuctioned = nft_marketplace_bid.creator != "0x0000000000000000000000000000000000000000";

    let nft_data = [];

    if ( checkIsListed ) {
      nft_data["type"] = "list";
      nft_data["isOwner"] = false;
      nft_data["marketplace_data"] = nft_marketplace;
      console.log("é do marketplace venda");
      if ( nft_marketplace.sold ) {
        console.log("[SOLD]");
        const owner_address = await token.ownerOf(nftId);
        nft_data["owner_address"] = owner_address;
        fetchOwnerData(owner_address);
        
      } else {
        console.log("[NOT SOLD]");
        fetchOwnerData(nft_marketplace.seller);
        nft_data["owner_address"] = nft_marketplace.seller;
      }
    } else if ( checkIsAuctioned ) {
      nft_data["type"] = "auction";
      nft_data["isOwner"] = false;
      nft_data["marketplace_data"] = nft_marketplace_bid;
      console.log("é do marketplace leilão");
      if ( nft_marketplace_bid.success ) {
        console.log("[SOLD]");
        const owner_address = await token.ownerOf(nftId);
        nft_data["owner_address"] = owner_address;
        fetchOwnerData(owner_address);
        
      } else {
        console.log("[NOT SOLD]");
        fetchOwnerData(nft_marketplace_bid.creator);
        nft_data["owner_address"] = nft_marketplace_bid.creator;
      }
      console.log("é leilão");
    } else {
      nft_data["type"] = "mined";
      nft_data["isOwner"] = false;
      const owner_address = await token.ownerOf(nftId);
      nft_data["owner_address"] = owner_address;
      fetchOwnerData(owner_address);
      console.log("é próprio");
    }
    
    nft_data["url"] = await token.tokenURI(nftId);

    setNft(nft_data);

  }

  const fetchCollectionData = async (sanityClient = client) => {

    if ( !collectionId || collectionId == null ) {
      return false;
    }

    const query = `*[_type == "marketItems" && _id == "${collectionId}" ] {
      volumeTraded,
      createdBy,
      tokenName,
      contractAddress,
      "creator": createdBy->userName,
      "creatorImage": createdBy->profileImage,
      title, floorPrice,
      description,
      profileImage,
      bannerImage
    }`

    const collectionData = await sanityClient.fetch(query)
    setCollection(collectionData[0])
  }

  const fetchOwnerData = async (user_address) => {

    if ( !collectionId || collectionId == null || (ownerData && ownerData.length > 0) ) {
      return false;
    }

    console.log("Buscando dados do dono " + user_address);
    const query = `*[_type == "users" && _id == "${user_address}" ] {
      userName,
    }`;

    const userData = await client.fetch(query)
    setOwnerData(userData[0])
    console.log("terminou de buscar os dados do dono");
  }

  const checkIsNftOwner = async() => {
   
    if ( !nft["owner_address"] || !address || address == null ) {
      return false;
    }

    let _nft_data = nft;
    _nft_data["isOwner"] = address == nft["owner_address"];

  }

  useEffect(() => {
    getNftData();
  }, [collectionId, nftId])

  useEffect(() => {
    checkIsNftOwner();
  }, [nft, address])

  useEffect(() => {
    fetchCollectionData();
  }, [collectionId])


  return (
    <div>
      <Header />
      <div className={style.wrapper}>
        <div className={style.container}>
          <div className={style.topContent}>
            <div className={style.nftImgContainer}>
              <NFTImage nftData={nft} />
            </div>
            <div className={style.detailsContainer}>
              <GeneralDetails 
                selectedNft={selectedNft}
                collection={collection}
                nftId={nftId}
                ownerData={ownerData}
                collectionData={collection}
              />
              <Purchase
                nftData={nft}
                collectionId={collectionId}
                floorPrice={collection?.floorPrice}
                nftId={nftId}
              />
            </div>
          </div>

          <div className='text-center text-gray-400'>SUGESTÕES</div>
          {collectionId && <SliderNfts title="Mais desse criador" collectionId={collectionId} />}
          {1==2 && <ItemActivity collectionId={collectionId} nftId={nftId} />}
        </div>
      </div>
    </div>
  )
}

export default Nft
