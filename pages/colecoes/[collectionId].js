import { useEffect, useMemo, useState } from 'react'

import { useRouter } from 'next/router'
import { useWeb3 } from '@3rdweb/hooks'
import { ThirdwebSDK } from '@3rdweb/sdk'

import Header from '../../components/Header.js'
import NFTCard from '../../components/NFTCard.js'

import { client } from '../../lib/sanityClient.js'

import { AiOutlineInstagram, AiOutlineTwitter } from 'react-icons/ai'
import { HiDotsVertical } from 'react-icons/hi'
import { CgWebsite } from 'react-icons/cg'


import { style } from './styles.js'

const Collection = () => {
  const router = useRouter()

  const { walletAddressId } = router.query
  const { provider } = useWeb3()

  const [listings, setListings] = useState([])
  const [collection, setCollection] = useState({})
  const [nfts, setNfts] = useState([])
  const [sellerData, setSellerData] = useState({})


  console.log(walletAddressId);


  const fetchSellerData = async (sanityClient = client) => {
    const query = `*[_type == "users" && walletAddress == "${walletAddressId}" ] {
      "profileImage": profileImage.asset->url,
      "bannerImageUrl": bannerImage.asset->url,
      userName,
    }`

    const sellerDataReturn = await sanityClient.fetch(query)
    setSellerData(sellerDataReturn[0])
  }


  const fetchCollectionData = async (sanityClient = client) => {
    const query = `*[_type == "marketItems" && contractAddress == "${walletAddressId}" ] {
      "imageUrl": profileImage.asset->url,
      "bannerImageUrl": bannerImage.asset->url,
      volumeTraded,
      createdBy,
      contractAddress,
      "creator": createdBy->userName,
      title, floorPrice,
      description
    }`

    const collectionData = await sanityClient.fetch(query)
    setCollection(collectionData[0])
  }

  useEffect(() => {
    fetchSellerData()
  }, [walletAddressId])

  return (
    <div className="overflow-hidden">
      <Header />
      <div className={style.bannerImageContainer}>
        <img
          className={style.bannerImage}
          src={
            collection?.bannerImageUrl
              ? collection.bannerImageUrl
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
              collection?.imageUrl
                ? collection.imageUrl
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
                  <CgWebsite />
                </div>
                <div className={style.divider} />
                <div className={style.socialIcon}>
                  <AiOutlineInstagram />
                </div>
                <div className={style.divider} />
                <div className={style.socialIcon}>
                  <AiOutlineTwitter />
                </div>
                <div className={style.divider} />
                <div className={style.socialIcon}>
                  <HiDotsVertical />
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
            Created by{' '}
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
                {collection?.allOwners ? collection.allOwners.length : ''}
              </div>
              <div className={style.statName}>owners</div>
            </div>
            <div className={style.collectionStat}>
              <div className={style.statValue}>
                <img
                  src="https://storage.opensea.io/files/6f8e2979d428180222796ff4a33ab929.svg"
                  alt="eth"
                  className={style.ethLogo}
                />
                {collection?.floorPrice}
              </div>
              <div className={style.statName}>floor price</div>
            </div>
            <div className={style.collectionStat}>
              <div className={style.statValue}>
                <img
                  src="https://storage.opensea.io/files/6f8e2979d428180222796ff4a33ab929.svg"
                  alt="eth"
                  className={style.ethLogo}
                />
                {collection?.volumeTraded}.5K
              </div>
              <div className={style.statName}>volume traded</div>
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
            listings={listings}
          />
        ))}
      </div>
    </div>
  )
}

export default Collection
