import { useEffect, useState, useMemo } from 'react'

import { useWeb3 } from '@3rdweb/hooks'
import { ThirdwebSDK } from '@3rdweb/sdk'
import { useRouter } from 'next/router'

import Header from '../../components/Header.js'
import Web3Modal from "web3modal";
import { ethers } from 'ethers'


import {
  marketplaceAddress,
  paymentAddress
} from '../../config'

const providerOptions = {
};

import BoxBlockPaymentEth from '../../artifacts/contracts/BoxBlockPaymentEth.sol/BoxBlockPaymentEth.json'

const style = {
    wrapper: ``,
    walletConnectWrapper: `flex flex-col justify-center items-center h-screen w-screen bg-[#3b3d42] `,
    button: `bg-[#2081e2] p-[0.8rem] text-lg font-semibold rounded-lg cursor-pointer text-black`,
    details: `text-lg text-center text-white font-semibold mt-4`,
  }

const Admin = () => {
  const { address, provider } = useWeb3()
  const router = useRouter()

  const martkeplaceSupply = ethers.utils.parseUnits('0.5', 'ether');
  

  const transferEtherToMarketplace = async() => {

    console.log("Tranferindo Ethers");

    const web3Modal = new Web3Modal({
        network: "localhost", // optional
        cacheProvider: true, // optional
        providerOptions // required
    });
  
    const instance = await web3Modal.connect();
    const provider = new ethers.providers.Web3Provider(instance);
    const signer = provider.getSigner();

    let payment = new ethers.Contract(paymentAddress, BoxBlockPaymentEth.abi, signer);

    const approve = await payment.approve(marketplaceAddress, martkeplaceSupply);
    await approve.wait();
    const approve2 = await payment.approve(address, martkeplaceSupply);
    await approve2.wait();
    console.log(approve);
    console.log(address);
    await payment.transferFrom(address, marketplaceAddress, martkeplaceSupply);

  }


  useEffect(() => {
    
  }, [])


  return (
    <div>
      <Header />
      <div className={style.wrapper}>
      <div className={style.walletConnectWrapper}>
          <button
            className={style.button}
            onClick={transferEtherToMarketplace}
          >
            Transferir 0.5 Eth para o marketplace
          </button>
          <div className={style.details}>
            You need Chrome to be able to run this app.
          </div>
        </div>
      </div>
    </div>
  )
}

export default Admin
