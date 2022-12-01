import { useEffect, useState } from 'react'

import { client } from '../lib/sanityClient.js'
import ModalMintNft from './MainHomeUser/ModalMintNft'
import ModalShowNft from './MainHomeUser/ModalShowNft'

import ModalChangeUserInfo from './ModalChangeUserInfo';

const MainHomeUser = (props) => {

    const [userInfo, setUserInfo] = useState({})
    const [nftToShow, setNftToShow] = useState("")
    const [showNodalMintNft, setShowModalMintNft] = useState(false)
    const [showNodalShowNft, setShowNodalShowNft] = useState(true)
    const [showModalSetPassword, setShowModalSetPassword] = useState(false)
    const [changing, setChanging] = useState("password");

    let userCpf = props.cpf;

    const fetchUserInfo = async (sanityClient = client) => {
      const query = `*[_type == "users" && _id == "${userCpf}"] {
        _id,
        userName,
        walletAddress,
        saldo,
        senha,
      }`
  
      const user_Info = await sanityClient.fetch(query)
  
      setUserInfo(user_Info[0]);
    }

    useEffect(function() {
        fetchUserInfo();
    },[]);

    useEffect(function() {
        if ( typeof(userInfo.senha) != "undefined" && (userInfo.senha == null || userInfo.senha == "") ) {
            setShowModalSetPassword(true);
        }
    
        if ( typeof(userInfo.senha) != "undefined" && userInfo.senha != null && userInfo.userName == "Sem Nome" ) {
            setChanging("wizard");
            setShowModalSetPassword(true);
        }
    },[userInfo]);

    useEffect(function() {
        if (nftToShow == "" && showNodalShowNft) {
            setShowNodalShowNft(false);
        }
    
        if (nftToShow != "" && !showNodalShowNft) {
            setShowNodalShowNft(true);
        }
        fetchUserInfo();
    },[nftToShow]);
    return (
    <div className='px-2'>

        <ModalMintNft setShow={setShowModalMintNft} show={showNodalMintNft} cpf={userCpf} setNftToShow={setNftToShow} />
        <ModalShowNft setShow={setShowNodalShowNft} show={showNodalShowNft} nftToShow={nftToShow} setNftToShow={setNftToShow} />
        <ModalChangeUserInfo setShow={setShowModalSetPassword} changing={changing} show={showModalSetPassword} user={userInfo} />

        <div className='flex flex-1 justfy-center flex-col items-center mt-6'>
            <div className='container flex flex-col mx-auto'>
                <h1 className="font-extrabold text-xl pr-16 tracking-tight leading-none text-gray-900 md:text-1=2xl xl:text-3xl dark:text-white font-sora">Olá, {userInfo.userName}</h1>
                <p className=" text-gray-500 mb-12">Você possui o total de:</p>
                <div className='flex flex-row items-center justify-center'>
                    <div className="font-extrabold text-xl tracking-tight leading-none text-gray-900 md:text-1=2xl xl:text-3xl font-sora block px-4 py-4 w-full bg-white rounded-lg border border-gray-800 justify-center flex w-8/12">
                        {(userInfo.saldo == null ? 0 : userInfo.saldo)} pontos
                    </div>
                </div>

                <div className='mt-16'>

                    <button type='button' onClick={()=>{ setShowModalMintNft(true); }} disabled={userInfo.saldo == null || parseInt(userInfo.saldo) < 300 } className="bg-blue-700 w-full hover:bg-blue-900 disabled:bg-gray-500 disabled:border-gray-500 text-white font-bold py-4 px-4 border border-blue-700 rounded">
                    Cunhar NFT
                    </button>
                    <p className='text-center mt-2'>Serão necessários 300 pontos</p>

                </div>
            </div>
        </div>
    </div>
    )
}

export default MainHomeUser