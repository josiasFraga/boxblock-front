import { IoMdSnow } from 'react-icons/io'
import { AiOutlineHeart } from 'react-icons/ai'
import { style } from './NFTImage.style.js'

const NFTImage = ({ nftData }) => {
  return (
    <div>
        <img src={nftData?.url} />
    </div>
  )
}

export default NFTImage
