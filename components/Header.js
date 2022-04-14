import Link from 'next/link'
import Image from 'next/image'

import { MdOutlineAccountBalanceWallet } from 'react-icons/md'
import { AiOutlineSearch } from 'react-icons/ai'
import { CgProfile } from 'react-icons/cg'

import openSeaLogo from '../assets/images/opensea.png'

import { style } from './Header.style.js'


const Header = () => {
  return (
    <div className={style.wrapper}>
      <Link href="/">
        <div className={style.logoContainer}>
          <Image src={openSeaLogo} height={40} width={40} />
          <div className={style.logoText}>Opensea</div>
        </div>
      </Link>
      <div className={style.searchBar}>
        <div className={style.searchIcon}>
          <AiOutlineSearch />
        </div>
        <input
          className={style.searchInput}
          placeholder="Search items, collections, and accounts"
        />
      </div>
      <div className={style.headerItems}>
        <Link href="/collections/0x0872556dbe86EB0acd7c7eA8b887c1B490d6f91b">
          <div className={style.headerItem}> Collections </div>
        </Link>
        <div className={style.headerItem}>Stats</div>
        <div className={style.headerItem}>Resources</div>
        <div className={style.headerItem}>Create</div>
        <div className={style.headerIcon}>
          <CgProfile />
        </div>
        <div className={style.headerIcon}>
          <MdOutlineAccountBalanceWallet />
        </div>
      </div>
    </div>
  )
}

export default Header
