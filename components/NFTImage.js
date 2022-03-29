import { IoMdSnow } from 'react-icons/io'
import { AiOutlineHeart } from 'react-icons/ai'


const style = {
  topBar: `bg-[#303339] p-2 rounded-t-lg border-[#151c22] border mb-4`,
  topBarContent: `flex items-center`,
  likesCounter: `flex-1 flex items-center justify-end`,
}

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
