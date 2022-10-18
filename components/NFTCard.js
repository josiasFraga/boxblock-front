import { useEffect, useState } from 'react'
import Router from 'next/router'

import { BiHeart } from 'react-icons/bi'
import { style } from './NFTCard.style.js'
import { ethers } from 'ethers'

const NFTCard = ({ nftItem, name, title }) => {
  return (
    <div
      className={style.wrapper}
      onClick={() => {
        Router.push({
          pathname: `/nft/${nftItem.contractAddress}/${nftItem.tokenId}`,
          //query: { isListed: isListed },
        })
      }}
    >
      <div className={style.imgContainer}>
        <img src={nftItem.url} alt={name} className={style.nftImg} />
      </div>
      <div className={style.details}>
        <div className={style.info}>
          <div className={style.infoLeft}>
            <div className={style.collectionName}>{title}</div>
            <div className={style.assetName}>{name} #{nftItem.tokenId}</div>
          </div>
          {nftItem.onMarketplace == "Y" && nftItem.sold == "N" && nftItem.type == "list" && (
            <div className={style.infoRight}>
              <div className={style.priceTag}>Preço</div>
              <div className={style.priceValue}>
                <img
                  src="https://ethereum.org/static/6b935ac0e6194247347855dc3d328e83/6ed5f/eth-diamond-black.webp"
                  alt="eth"
                  className={style.ethLogo}
                />
                {nftItem.price}
              </div>
            </div>
          )}
          {nftItem.onMarketplace == "Y" && nftItem.sold == "N" && nftItem.type == "auction" && (
            <div className={style.infoRight}>
              <div className={style.priceTag}>Lance Atual</div>
              <div className={style.priceValue}>
                <img
                  src="https://ethereum.org/static/6b935ac0e6194247347855dc3d328e83/6ed5f/eth-diamond-black.webp"
                  alt="eth"
                  className={style.ethLogo}
                />
                {parseFloat(nftItem.price) + parseFloat(nftItem.minBid)}
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
