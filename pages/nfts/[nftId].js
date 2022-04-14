import { useEffect, useState, useMemo } from 'react'

import { useWeb3 } from '@3rdweb/hooks'
import { ThirdwebSDK } from '@3rdweb/sdk'
import { useRouter } from 'next/router'

import Header from '../../components/Header.js'
import NFTImage from '../../components/NFTImage.js'
import GeneralDetails from '../../components/GeneralDetails.js'
import ItemActivity from '../../components/ItemActivity.js'
import Purchase from '../../components/Purchase.js'

import { style } from './styles.js'


const Nft = () => {
  const [selectedNft, setSelectedNft] = useState()
  const [listings, setListings] = useState([])

  const router = useRouter()
  const { provider } = useWeb3()


  const nftModule = useMemo(() => {
    if (!provider) return

    const NftAddr = '0x0872556dbe86EB0acd7c7eA8b887c1B490d6f91b'
    const url =
      'https://eth-rinkeby.alchemyapi.io/v2/BGCbYsNijEj8yuoqWm6Srd8ybug3zlzi'

    const sdk = new ThirdwebSDK(provider.getSigner(), url)
    return sdk.getNFTModule(NftAddr)
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

    const marketAddr = '0x93A771F7ce845C33381f677489cF21a5964EDD0b'
    const url =
      'https://eth-rinkeby.alchemyapi.io/v2/BGCbYsNijEj8yuoqWm6Srd8ybug3zlzi'

    const sdk = new ThirdwebSDK(provider.getSigner(), url)
    return sdk.getMarketplaceModule(marketAddr)
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
              <Purchase
                isListed={router.query.isListed}
                selectedNft={selectedNft}
                listings={listings}
                marketPlaceModule={marketPlaceModule}
              />
            </div>
          </div>
          <ItemActivity />
        </div>
      </div>
    </div>
  )
}

export default Nft
