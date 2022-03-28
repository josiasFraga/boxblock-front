import { useEffect, useState, useMemo } from 'react'
import { useWeb3 } from '@3rdweb/hooks'
import { ThirdwebSDK } from '@3rdweb/sdk'
import { useRouter } from 'next/router'

import Header from '../../components/Header.js'
import NFTImage from '../../components/NFTImage.js'
import GeneralDetails from '../../components/GeneralDetails.js'
import ItemActivity from '../../components/ItemActivity.js'


const style = {
  wrapper: `flex flex-col items-center container-lg text-[#e5e8eb]`,
  container: `container p-6`,
  topContent: `flex`,
  nftImgContainer: `flex-1 mr-4`,
  detailsContainer: `flex-[2] ml-10`,
}


const Nft = () => {
  const { provider } = useWeb3()
  const router = useRouter()

  const [selectedNft, setSelectedNft] = useState()
  const [listings, setListings] = useState([])


  const nftModule = useMemo(() => {
    if (!provider) return

    const market = '0x93A771F7ce845C33381f677489cF21a5964EDD0b'
    const url = 'https://rinkeby.infura.io/v3/BGCbYsNijEj8yuoqWm6Srd8ybug3zlzi'

    const sdk = new ThirdwebSDK(provider.getSigner(), url)
    return sdk.getNFTModule(market)
  }, [provider])

  useEffect(() => {
    if (!nftModule) return
    ;(async () => {
      const nfts = await nftModule.getAll()
      const selectedNftItem = nfts.find((nft) => nft.id === router.query.nftId)
      setSelectedNft(selectedNftItem)
    })()
  }, [nftModule])


  const marketPlaceModule = useMemo(() => {
    if (!provider) return

    const market = '0x93A771F7ce845C33381f677489cF21a5964EDD0b'
    const url = 'https://rinkeby.infura.io/v3/BGCbYsNijEj8yuoqWm6Srd8ybug3zlzi'

    const sdk = new ThirdwebSDK(provider.getSigner(), url)
    return sdk.getMarketplaceModule(market)
  }, [provider])

  useEffect(() => {
    if (!marketPlaceModule) return
    ;(async () => {
      setListings(await marketPlaceModule.getAllListings())
    })()
  }, [marketPlaceModule])

  
  return (
    <div>
      <Header />
      <div className={style.wrapper}>
        <div className={style.container}>
          <div className={style.topContent}>
            <div className={style.nftImgContainer}>
              <NFTImage selectedNft={selectedNft} />
            </div>
            <div className={style.detailsContainer}>
              <GeneralDetails selectedNft={selectedNft} />
            </div>
          </div>
          <ItemActivity />
        </div>
      </div>
    </div>
  )
}

export default Nft
