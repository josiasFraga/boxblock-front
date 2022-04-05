import { IoMdSnow } from 'react-icons/io'
import { AiOutlineHeart } from 'react-icons/ai'

import { style } from './NFTImage.style.js'


const NFTImage = ({ selectedNft }) => {
  return (
    <div>
      <div className={style.topBar}>
        <div className={style.topBarContent}>
          <IoMdSnow />
          <div className={style.likesCounter}>
            <AiOutlineHeart /> 2.3K
          </div>
        </div>
      </div>
      <img src='https://ipfs.thirdweb.com/ipfs/QmXc3Pf13GVp7eceyhcdMSRzV1ui9y7cLz2EeswywKK9oY/0.png' />
    </div>
  )
}

export default NFTImage
