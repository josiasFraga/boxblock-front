import Link from 'next/link'
import { AiFillHeart } from 'react-icons/ai'
import { MdRefresh } from 'react-icons/md'
import { GiShare } from 'react-icons/gi'

import { RiShareBoxLine } from 'react-icons/ri'
import { FiMoreVertical } from 'react-icons/fi'

import { style } from './GeneralDetails.style.js'


const GeneralDetails = ({ collection, nftId, ownerData, collectionData }) => {
  return (
    <div className={style.wrapper}>
      <div className={style.infoContainer}>
        <div className={style.nftTitle}>{collection?.tokenName} #{nftId}</div>
        <div className={style.collectionInfo}>
          {collectionData?.description}  
        </div>
        <div className={style.creatorCard}>
          <div className={style.creatorImageContainer}>
            <img src={collectionData?.creatorImage} className={style.creatorImage} />
          </div>
          <div className={style.creatorNameContainer}>
            <div className={style.creatorNameTitle}>Criador</div>
            <div className={style.creatorName}>{collectionData?.creator}</div>
          </div>
        </div>

      </div>
      {1==2 && <div className={style.infoContainer}>
        <div className={style.accent}>
          <Link href={collection.contractAddress ? "/colecao/" + collection.contractAddress : ""}>
            {collection.title ? collection.title : "-"}
          </Link>
        </div>
        <div className={style.otherInfo}>
          <div className={style.ownedBy}>
            Propriedade de <span className={style.accent}>{ownerData?.userName}</span>
          </div>
          <div className={style.likes}>
            <AiFillHeart className={style.likeIcon} /> 0 favoritos
          </div>
        </div>
      </div>}
      {1==2 && <div className={style.actionButtonsContainer}>
        <div className={style.actionButtons}>
          <div className={`${style.actionButton} ml-2`}>
            <MdRefresh className='text-[#303339]' />
          </div>
          <div className={style.divider} />
          <div className={style.actionButton}>
            <RiShareBoxLine className='text-[#303339]' />
          </div>
          <div className={style.divider} />
          <div className={style.actionButton}>
            <GiShare className='text-[#303339]' />
          </div>
          <div className={style.divider} />
          <div className={`${style.actionButton} mr-2`}>
            <FiMoreVertical className='text-[#303339]' />
          </div>
        </div>
      </div>}
    </div>
  )
}

export default GeneralDetails
