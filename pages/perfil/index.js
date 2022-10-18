import { useEffect, useState } from 'react'
import { client } from '../../lib/sanityClient.js'

import Header from '../../components/Header.js'
import Footer from '../../components/Footer.js'
import ImageProfile from './Index/ImageProfile'
import InfoProfile from './Index/InfoProfile'
import NftsProfile from './Index/NftsProfile'

const Perfil = () => {
    const [userInfo, setUserInfo] = useState({});
    const [nfts, setNfts] = useState([]);

    useEffect(() => {
        const us_cpf = window.localStorage.getItem("us_cpf");
 
        if ( us_cpf ){
            fetchUserInfo(us_cpf);
        }
    }, []);

    const fetchUserInfo = async(us_cpf, sanityClient = client) => {

        console.log("buscando informações do usuário - " + us_cpf);

        let query = `*[_type == "users" && _id == "${us_cpf}"] {
            _id,
            userName,
            walletAddress,
            saldo,
            profileImage,
            igHandle,
            fbHandle,
            phoneHandle,
            email,
            "nfts": *[_type=="marketTokens" && references(^._id)] {
                tokenId,
                contractAddress,
                url,
                "collectionNftName": collection->tokenName,
            }
        }`;


        const user_info = await sanityClient.fetch(query)
        
        setUserInfo(user_info[0]);
        setNfts(user_info[0].nfts);
    }

    return (
        <div className='h-auto min-h-screen' style={{backgroundColor: "#fff"}}>
            <div className="min-h-screen flex flex-col">
              <Header />
              <ImageProfile user={userInfo} />
              <InfoProfile user={userInfo} />
              <NftsProfile nfts={nfts} />

              <div className='flex flex-1 flex-col justify-end'>
                  <Footer />
              </div>
            </div>
        </div>
    )
}

export default Perfil