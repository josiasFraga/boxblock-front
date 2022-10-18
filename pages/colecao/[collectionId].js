import { useEffect, useMemo, useState } from 'react'

import { useRouter } from 'next/router'
import { useWeb3 } from '@3rdweb/hooks'
import { ethers } from 'ethers'
import Web3Modal from "web3modal";

import Header from '../../components/Header.js'
import NFTCard from '../../components/NFTCard.js'

import { client } from '../../lib/sanityClient.js'

import { AiOutlineInstagram, AiOutlineTwitter } from 'react-icons/ai'
import { HiDotsVertical } from 'react-icons/hi'
import { CgWebsite } from 'react-icons/cg'

import { style } from './styles.js'

import BoxBlockNFT from '../../artifacts/contracts/BoxBlock.sol/BoxBlockNFT.json'
import BoxBlockNFTMarketplace from '../../artifacts/contracts/BoxBlock.sol/BoxBlockNFTMarketplace.json'

import {
  marketplaceAddress
} from '../../config'

const providerOptions = {
};

const Collection = () => {
  const router = useRouter()

  const { collectionId } = router.query
  const { address } = useWeb3();

  const [collection, setCollection] = useState({})
  const [nfts, setNfts] = useState([])
  const [floorPrice, setFloorPrice] = useState("0")
  const [owners, setOwners] = useState([])

  const fetchNfts = async (sanityClient = client) => {

    if ( !collectionId || collectionId == null )
      return false;

    const query = `*[_type == "marketTokens" && contractAddress == "${collectionId}" ] {
      contractAddress,
      url,
      tokenId,
      "creator": createdBy->userName,
      "holder": owner->userName,
      onMarketplace,
      type,
      sold,
      price,
      minBid,
    } | order(tokenId)`


    const collectionData = await sanityClient.fetch(query)
    setNfts(collectionData)
  }

  const fetchFloorPrice = async (sanityClient = client) => {

    if ( !collectionId || collectionId == null )
      return false;

    const query = `*[_type == "marketTokens" && contractAddress == "${collectionId}" && sold == "N" && onMarketplace == "Y" ] {
      price,
    } | order(price)`


    const floorPriceData = await sanityClient.fetch(query)
 
    setFloorPrice(floorPriceData[0]?.price)
  }

  const fetchCollectionData = async (sanityClient = client) => {
    if ( !collectionId || collectionId == null )
      return false;

    const query = `*[_type == "marketItems" && _id == "${collectionId}" ] {
      volumeTraded,
      createdBy,
      tokenName,
      contractAddress,
      "creator": createdBy->userName,
      title, floorPrice,
      description,
      profileImage,
      bannerImage
    }`

    const collectionData = await sanityClient.fetch(query)
    setCollection(collectionData[0])
  }

  const fetchNOwners = async(sanityClient = client) => {
    if ( !collectionId || collectionId == null )
      return false;

    const query = `*[_type == "marketTokens" && contractAddress == "${collectionId}" && owner->walletAddress != createdBy->walletAddress] {"owner": owner->walletAddress}`

    const ownersData = await sanityClient.fetch(query)

    setOwners(ownersData)
    
    
  }

  useEffect(() => {
    fetchCollectionData()
    fetchNfts();
    fetchFloorPrice();
    fetchNOwners();
  }, [collectionId])

  return (
    <div className="overflow-hidden">
      <Header />
      <div className={style.bannerImageContainer}>
        <img
          className={style.bannerImage}
          src={
            collection?.bannerImage
              ? collection.bannerImage
              : 'https://via.placeholder.com/200'
          }
          alt="banner"
        />
      </div>
      <div className={style.infoContainer}>
        <div className={style.midRow}>
          <img
            className={style.profileImg}
            src={
              collection?.profileImage
                ? collection.profileImage
                : 'https://via.placeholder.com/200'
            }
            alt="profile image"
          />
        </div>
        <div className={style.endRow}>
          <div className={style.socialIconsContainer}>
            <div className={style.socialIconsWrapper}>
              <div className={style.socialIconsContent}>
                <div className={style.socialIcon}>
                  <CgWebsite  className='text-[#303339]' />
                </div>
                <div className={style.divider} />
                <div className={style.socialIcon}>
                  <AiOutlineInstagram  className='text-[#303339]' />
                </div>
                <div className={style.divider} />
                <div className={style.socialIcon}>
                  <AiOutlineTwitter  className='text-[#303339]' />
                </div>
                <div className={style.divider} />
                <div className={style.socialIcon}>
                  <HiDotsVertical  className='text-[#303339]' />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className={style.midRow}>
          <div className={style.title}>{collection?.title}</div>
        </div>
        <div className={style.midRow}>
          <div className={style.createdBy}>
            Criada Por{' '}
            <span className="text-[#2081e2]">{collection?.creator}</span>
          </div>
        </div>
        <div className={style.midRow}>
          <div className={style.statsContainer}>
            <div className={style.collectionStat}>
              <div className={style.statValue}>{nfts.length}</div>
              <div className={style.statName}>items</div>
            </div>
            <div className={style.collectionStat}>
              <div className={style.statValue}>
                {owners.length}
              </div>
              <div className={style.statName}>proprietários</div>
            </div>
            <div className={style.collectionStat}>
              <div className={style.statValue}>
                <img
                  src="https://ethereum.org/static/6b935ac0e6194247347855dc3d328e83/6ed5f/eth-diamond-black.webp"
                  alt="eth"
                  className={style.ethLogo}
                />
                {floorPrice}
              </div>
              <div className={style.statName}>preço mínimo</div>
            </div>
            <div className={style.collectionStat}>
              <div className={style.statValue}>
                <img
                  src="https://ethereum.org/static/6b935ac0e6194247347855dc3d328e83/6ed5f/eth-diamond-black.webp"
                  alt="eth"
                  className={style.ethLogo}
                />
                {collection?.volumeTraded}
              </div>
              <div className={style.statName}>negociado</div>
            </div>
          </div>
        </div>
        <div className={style.midRow}>
          <div className={style.description}>{collection?.description}</div>
        </div>
      </div>
      <div className="flex flex-wrap ">
        {nfts.map((nftItem, id) => (
          <NFTCard
            key={id}
            nftItem={nftItem}
            title={collection?.title}
            name={collection?.tokenName}
          />
        ))}
      </div>
    </div>
  )
}

export default Collection
