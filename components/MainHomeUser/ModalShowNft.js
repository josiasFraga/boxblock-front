import { useEffect, useState } from "react";
import { Modal, Spinner } from "flowbite-react";
import { client } from '../../lib/sanityClient.js'

const ModalShowNft = ({ show, setShow, nftToShow, setNftToShow }) => {


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
        
            </Modal.Body>
        </Modal>
    );
};

export default ModalShowNft;