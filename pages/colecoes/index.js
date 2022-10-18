import { useEffect, useMemo, useState } from 'react'
import CollectionCard from '../../components/CollectionCard.js'


import Header from '../../components/Header.js'
import { client } from '../../lib/sanityClient.js'

import { style } from './styles.js'

const Colecoes = () => {

  const [listings, setListings] = useState([])

  const fetchSellers = async (sanityClient = client) => {
    const query = `*[_type == "marketItems"] {
      volumeTraded,
      createdBy,
      contractAddress,
      "creator": createdBy->userName,
      title, floorPrice,
      description,
      profileImage,
      bannerImage
    }`

    const collectionData = await sanityClient.fetch(query)
    setListings(collectionData)

    console.log(collectionData);
  }

  useEffect(() => {
    fetchSellers()
  }, [])

  return (
    <div className="overflow-hidden">
      <Header />
      <div className="flex flex-wrap justify-center">
      {listings.map((item, id) => (     
			<CollectionCard
				key={id}
				title={item.title}
				contractAddress={item.contractAddress}
				profileImage={item.profileImage}
				bannerImageUrl={item.bannerImage}
			/>
      ))}
      </div>
    </div>
  )
}

export default Colecoes
