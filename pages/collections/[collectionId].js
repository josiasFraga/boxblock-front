import { useEffect, useMemo, useState } from 'react'

import { useRouter } from 'next/router'
import { useWeb3 } from '@3rdweb/hooks'
import { ThirdwebSDK } from '@3rdweb/sdk'

import Header from '../../components/Header.js'
import NFTCard from '../../components/NFTCard.js'

import { client } from '../../lib/sanityClient.js'

import { CgWebsite } from 'react-icons/cg'
import { AiOutlineInstagram, AiOutlineTwitter } from 'react-icons/ai'
import { HiDotsVertical } from 'react-icons/hi'

import { style } from './styles.js'


const Collection = () => {
  const ethImg = 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/05/Ethereum_logo_2014.svg/1257px-Ethereum_logo_2014.svg.png'

  const router = useRouter()
  const { provider } = useWeb3()

  const { collectionId } = router.query

  const [collection, setCollection] = useState({})
  const [nfts, setNfts] = useState([])
  const [listings, setListings] = useState([])


  const nftModule = useMemo(() => {
    if (!provider) return

    const sdk = new ThirdwebSDK(provider.getSigner())
    return sdk.getNFTModule(collectionId)
  }, [provider])

  useEffect(() => {
    if (!nftModule) return
    ;(async () => {
      const nfts = await nftModule.getAll()
      setNfts(nfts)
    })()
  }, [nftModule])


  const marketPlaceModule = useMemo(() => {
    if (!provider) return

    const marketAddr = '0x93A771F7ce845C33381f677489cF21a5964EDD0b'

    const sdk = new ThirdwebSDK(provider.getSigner())
    return sdk.getMarketplaceModule(marketAddr)
  }, [provider])

  useEffect(() => {
    if (!marketPlaceModule) return
    ;(async () => {
      setListings(await marketPlaceModule.getAllListings())
    })()
  }, [marketPlaceModule])

  
  const fetchCollectionData = async (sanityClient = client) => {
    const query = `*[_type == "marketItems" && contractAddress == "${collectionId}" ] {
      "imageUrl": profileImage.asset->url,
      "bannerImageUrl": bannerImage.asset->url,
      volumeTraded,
      createdBy,
      contractAddress,
      "creator": createdBy->userName,
      title, floorPrice,
      "allOwners": owners[]->,
      description
    }`

    const collectionData = await sanityClient.fetch(query)
    await setCollection(collectionData[0])
  }

  useEffect(() => {
    fetchCollectionData()
  }, [collectionId])

  return (
    <div className="overflow-hidden">
      <Header />
      <div className={style.bannerImageContainer}>
        <img
          src={
            collection?.bannerImageUrl
              ? collection.bannerImageUrl
              : 'https://www.thewindowsclub.com/wp-content/uploads/2021/03/Etherium.png'
          }
          alt="Banner"
        />
      </div>
      <div className={style.infoContainer}>
        <div className={style.midRow}>
          <img
            className={style.profileImg}
            src={
              collection?.imageUrl
                ? collection.imageUrl
                : 'https://ipfs.thirdweb.com/ipfs/QmXc3Pf13GVp7eceyhcdMSRzV1ui9y7cLz2EeswywKK9oY/0.png'
            }
            alt="Profile image"
          />
        </div>
        <div className={style.endRow}>
          <div className={style.socialIconsContainer}>
            <div className={style.socialIconsWrapper}>
              <div className={style.socialIconsContent}>
                <div className={style.socialIcon}>
                  <CgWebsite />
                </div>
                <div className={style.socialIcon}>
                  <AiOutlineInstagram />
                </div>
                <div className={style.socialIcon}>
                  <AiOutlineTwitter />
                </div>
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
            Created by {' '}
            <span className="text-[#2081e2]">
              Ville Pakarinen
              {/* {collection?.creator} */}
            </span>
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
                1
                {/* {collection?.allOwners ? collection.allOwners.length : ''} */}
              </div>
              <div className={style.statName}>owners</div>
            </div>
            <div className={style.collectionStat}>
              <div className={style.statValue}>
                <img
                  className={style.ethLogo}
                  src={ethImg}
                  alt="ETH logo"
                />
                8
                {/* {collection?.floorPrice} */}
              </div>
              <div className={style.statName}>floor price</div>
            </div>
            <div className={style.collectionStat}>
              <div className={style.statValue}>
                <img
                  className={style.ethLogo}
                  src={ethImg}
                  alt="ETH logo"
                />
                800
                {/* {collection?.volumeTraded}.5K */}
              </div>
              <div className={style.statName}>volume traded</div>
            </div>
          </div>
        </div>
        <div className={style.midRow}>
          <div className={style.description}>
            The Bored Ape Yacht Club is a collection of unique Bored Ape NFTs
            {/* {collection?.description} */}
          </div>
        </div>
        <div className="flex flex-wrap">
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
    </div>
  )
}

export default Collection
