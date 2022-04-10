import { useEffect, useState } from 'react'
import Router from 'next/router'

import { BiHeart } from 'react-icons/bi'

import { style } from './NFTCard.style.js'


const NFTCard = ({ nftItem, title, listings }) => {
  const [isListed, setIsListed] = useState(false)
  const [price, setPrice] = useState(0)

  useEffect(() => {
    const listing = listings.find((listing) => listing.asset.id === nftItem.id)
    if (Boolean(listing)) {
      setIsListed(true)
      setPrice(listing.buyoutCurrencyValuePerToken.displayValue)
    }
  }, [listings, nftItem])

  return (
    <div
      className={style.wrapper}
      onClick={() => {
        Router.push({
          pathname: `/nfts/${nftItem.id}`,
          query: { isListed: isListed },
        })
      }}
    >
      <div className={style.imgContainer}>
        <img src={nftItem.image} alt={nftItem.name} className={style.nftImg} />
      </div>
      <div className={style.details}>
        <div className={style.info}>
          <div className={style.infoLeft}>
            <div className={style.collectionName}>{title}</div>
            <div className={style.assetName}>{nftItem.name}</div>
          </div>
          {isListed && (
            <div className={style.infoRight}>
              <div className={style.priceTag}>Price</div>
              <div className={style.priceValue}>
                <img
                  src="https://storage.opensea.io/files/6f8e2979d428180222796ff4a33ab929.svg"
                  alt="eth"
                  className={style.ethLogo}
                />
                {price}
              </div>
            </div>
          )}
        </div>
        <div className={style.likes}>
          <span className={style.likeIcon}>
            <BiHeart />
          </span>{' '}
          {nftItem.likes}
        </div>
      </div>
    </div>
  )
}

export default NFTCard
