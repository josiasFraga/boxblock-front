import { useEffect, useState } from "react";
import { Modal, Spinner } from "flowbite-react";
import { client } from '../../lib/sanityClient.js'
import { useRouter } from 'next/router';

const ModalShowNft = ({ show, setShow, nftToShow, setNftToShow }) => {

    const router = useRouter();

    const [nftInfo, setNftInfo] = useState({})

    const fetchNftData = async (sanityClient = client) => {
        if ( !show || nftToShow == "" ){
            return false;

        }

        const query = `*[_type == "marketTokens" && _id == "${nftToShow}"] {
            tokenId,
            contractAddress,
            url,
            "collectionNftName": collection->tokenName,
        }`;
  
        const userInfo = await sanityClient.fetch(query)
        setNftInfo(userInfo[0]);
    }

    useEffect(function() {
        fetchNftData();
    },[show]);

    return (
        <Modal show={show} size="md" popup={true} onClose={() => {
                setNftToShow("");
                setNftInfo({});
                router.push({
                    pathname: `/perfil`,
                });
            }}>
            <Modal.Header />
            <Modal.Body>
            <div className="space-y-6 px-6 pb-4 lg:px-0">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white font-sora">
                Visualização
                </h3>
            </div>

            <div className="flex justify-center">
                <img src={nftInfo?.url ? nftInfo.url : null} width="100%" className="rounded-lg" />
            </div>

            <h4 className="text-lg text-gray-900 dark:text-white font-sora mt-4">
                {nftInfo?.collectionNftName} #{nftInfo?.tokenId}
            </h4>

            <div className='flex justify-end w-full flex-col text-xs'>
                <div className='flex justify-end w-full flex-row w-20 justify-center self-end'>
                    <AiFillStar color="#ffea00" size={25} />
                </div>
                <div className='flex justify-end w-full flex-row w-20 justify-center self-end'>
                    Comum
                </div>
            </div>
        
            </Modal.Body>
        </Modal>
    );
};

export default ModalShowNft;