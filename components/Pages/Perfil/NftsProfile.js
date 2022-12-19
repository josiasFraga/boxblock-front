import { AiFillStar } from 'react-icons/ai';
const NftsProfile = (props) => {
    const nfts = props.nfts;

    return (
        <div className="px-2">
            <div className="container flex flex-wrap justify-between items-center mx-auto">
                <h3 className="text-lg font-sora">Meus Colecionáveis</h3>
                <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6">
                    {nfts.map((nft, index) => {
                        return(
                        <div className='bg-white sm:mr-4 md:mr-4 lg:mr-4 xl:mr-4 p-2 shadow-lg rounded-lg mb-8 pb-8' key={index}>

                            <div className="flex justify-center w-full">
                                <img src={nft.url} width="100%" />
                            </div>
                            <h4 className="text-lg text-gray-900 dark:text-white font-sora mt-4">
                                {nft.collectionNftName} #{nft.tokenId}
                            </h4>
                            <div className='flex justify-end w-full flex-col text-xs'>
                                <div className='flex justify-end w-full flex-row w-20 justify-center self-end'>
                                    <AiFillStar color="#ffea00" size={25} />
                                </div>
                                <div className='flex justify-end w-full flex-row w-20 justify-center self-end'>
                                    Comum
                                </div>
                            </div>
                        </div>
                        )
                    })}
                </div>
            </div>
        </div>
    )
}

export default NftsProfile