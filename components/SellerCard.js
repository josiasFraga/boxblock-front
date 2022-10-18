import { useEffect, useState } from 'react'
import Router from 'next/router'

import { BiHeart } from 'react-icons/bi'

import { style } from './SellerCard.style.js'

const SellerCard = ({ userName, walletAddress, profileImage, bannerImageUrl }) => {

  return (
    <div
      className={style.wrapper}
      onClick={() => {
        Router.push({
          pathname: `/colecoes/${walletAddress}`,
        })
      }}
    >
      <div className={style.bannerContainer}>
          <img 
              src={ bannerImageUrl && bannerImageUrl != null && typeof(bannerImageUrl) == 'string' ? bannerImageUrl : "https://fakeimg.pl/640x360/"} 
              alt={userName} 
              className={style.bannerImg}
          />
          <div className="relative">
              <img
                  className={style.profileImg}
                  src={profileImage ? profileImage : "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png"}
                  alt="profile image"
              />
          </div>
      </div>
      <div className={style.nameContainer}>
          {userName}
      </div>
    </div>
  )
}

export default SellerCard
