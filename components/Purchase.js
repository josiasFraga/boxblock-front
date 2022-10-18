import { useEffect, useState } from 'react'
import toast, { Toaster } from 'react-hot-toast'
import { ethers } from 'ethers'
import { useRouter } from 'next/router'
import { useWeb3 } from '@3rdweb/hooks'

import { HiTag } from 'react-icons/hi'
import { IoMdWallet } from 'react-icons/io'
import { AiOutlineStop } from "react-icons/ai";
import Web3Modal from "web3modal";
import { format, compareAsc } from 'date-fns'
import Countdown from 'react-countdown';

import {
  marketplaceAddress,
  paymentAddress,
} from '../config'


import { client } from '../lib/sanityClient.js'

import 'react-block-ui/style.css';

import { style } from './Purchase.style.js'
import ModalPrice from './Purchase/ModalPrice'

import BoxBlockNFTMarketplace from '../artifacts/contracts/BoxBlock.sol/BoxBlockNFTMarketplace.json'

const providerOptions = {
};

const Purchase = ({ nftData, collectionId, nftId }) => {
  const { address } = useWeb3();
  const router = useRouter();
  const [showNodal, setShowModal] = useState(false);

  if ( !nftData )
    return false;


  const userIsLogged = address && address != null;
  const isOwner = nftData?.isOwner;
  const nftType = nftData?.type;
  let nftSold = true;

  if ( (nftType == "list" && !nftData.marketplace_data.sold) || (nftType == "auction" && !nftData.marketplace_data.success) ) {
    nftSold = false;
  }

  const updateContractNegociatedValue = async (value, sanityClient = client) => {


    console.log("buscando os dados do contrato");

    const query = `*[_type == "marketItems" && _id == "${collectionId}"] {volumeTraded}`

    const collectionData = await sanityClient.fetch(query)

    console.log("atualizando o valor negociado do contrato");

    const sum_values = parseFloat(collectionData[0]["volumeTraded"]) + parseFloat(value);

    const result = await sanityClient.patch(collectionId) // Document ID to patch
    .set({"volumeTraded": sum_values.toFixed(6) }) // Shallow merge
    .commit();
    console.log("contrato atualizado");

    return result;
  }

  const buyItemDb = async (sanityClient = client) => {

    console.log("buscando os dados do registro do token");

    const query = `*[_type == "marketTokens" && contractAddress == "${collectionId}" && tokenId == ${nftId}] {_id}`

    const tokenData = await sanityClient.fetch(query)

    console.log("atualizando o dono do token");

    const result = await client.patch(tokenData[0]["_id"]) // Document ID to patch
    .set({
      "owner": {
        _type: 'reference',
        _ref: address
      },
      "type": "", 
      "sold": "Y", 
      "price": 0, 
      "onMarketplace" : "N"
    }) // Shallow merge
    .commit();
    console.log("token atualizado");

    return result;
  }

  const cancelSellDb = async (sanityClient = client) => {

    console.log("buscando os dados do registro do token");

    const query = `*[_type == "marketTokens" && contractAddress == "${collectionId}" && tokenId == ${nftId}] {_id}`

    const tokenData = await sanityClient.fetch(query)

    console.log("atualizando o dono do token");

    const result = await client.patch(tokenData[0]["_id"]) // Document ID to patch
    .set({
      "type": "", 
      "sold": "Y", 
      "price": 0, 
      "onMarketplace" : "N"
    }) // Shallow merge
    .commit();
    console.log("token atualizado");

    return result;
  }

  const putToSellDb = async (price, sanityClient = client) => {

    console.log("buscando os dados do registro do token");

    const query = `*[_type == "marketTokens" && contractAddress == "${collectionId}" && tokenId == ${nftId}] {_id}`

    const tokenData = await sanityClient.fetch(query)

    console.log("atualizando os dados do token");

    const result = await client.patch(tokenData[0]["_id"]) // Document ID to patch
    .set({
      "type": "list", 
      "sold": "N", 
      "price": parseFloat(price), 
      "onMarketplace" : "Y"
    }) // Shallow merge
    .commit();
    console.log("token atualizado");

    return result;
  }

  const putToAuctionDb = async (price, minBid, sanityClient = client) => {

    console.log("buscando os dados do registro do token");

    const query = `*[_type == "marketTokens" && contractAddress == "${collectionId}" && tokenId == ${nftId}] {_id}`

    const tokenData = await sanityClient.fetch(query)

    console.log("atualizando os dados do token");

    const result = await client.patch(tokenData[0]["_id"]) // Document ID to patch
    .set({
      "type": "auction", 
      "sold": "N", 
      "price": parseFloat(price), 
      "minBid": parseFloat(minBid), 
      "onMarketplace" : "Y"
    }) // Shallow merge
    .commit();
    console.log("token atualizado");

    return result;
  }

  const putToSell = async (preco) => {
    const nftPrice = ethers.utils.parseUnits(preco, 'ether');

    console.log("Colocando NFT a Venda");

    const web3Modal = new Web3Modal({
      network: "localhost", // optional
      cacheProvider: true, // optional
      providerOptions // required
    });

    try{
      const instance = await web3Modal.connect();
      const provider = new ethers.providers.Web3Provider(instance);
      const signer = provider.getSigner();

      let market = new ethers.Contract(marketplaceAddress, BoxBlockNFTMarketplace.abi, signer);
      const createSell = await market.createSell(collectionId,nftId,paymentAddress,nftPrice);

      await createSell.wait(); //wait complete transation
      await putToSellDb(preco);

      console.log("NFT colocado a venda");

      router.reload();

    } catch(e) {
      console.log("Erro ao colocar o item a venda");
    }


  }

  const putToAuction = async (preco, minBid) => {
    const nftPrice = ethers.utils.parseUnits(preco, 'ether');
    const nftMinBid = ethers.utils.parseUnits(minBid, 'ether');

    console.log("Colocando NFT a Leilão [start]");

    const web3Modal = new Web3Modal({
      network: "localhost", // optional
      cacheProvider: true, // optional
      providerOptions // required
    });

    try{
      const instance = await web3Modal.connect();
      const provider = new ethers.providers.Web3Provider(instance);
      const signer = provider.getSigner();

      let today = new Date();
      let end_auction = new Date();
      end_auction.setDate(today.getDate()+14)

      let market = new ethers.Contract(marketplaceAddress, BoxBlockNFTMarketplace.abi, signer);
      const createAuction = await market.createAuction(collectionId, nftId, paymentAddress,nftPrice, nftMinBid, today.getTime(), end_auction.getTime());
    
      await createAuction.wait(); //wait complete transation
      await putToAuctionDb(preco, minBid);

      console.log("NFT colocado a Leilão");
      router.reload();
    } catch (e) {
      console.log('Erro ao colocar o item para leilão');
      console.log(e);
    }
  }

  const cancelSell = async () => {

    console.log("Cancelando NFT a Venda");

    const web3Modal = new Web3Modal({
      network: "localhost", // optional
      cacheProvider: true, // optional
      providerOptions // required
    });
  
    const instance = await web3Modal.connect();
    const provider = new ethers.providers.Web3Provider(instance);
    const signer = provider.getSigner();

    let market = new ethers.Contract(marketplaceAddress, BoxBlockNFTMarketplace.abi, signer);

    if ( nftType == "list" ) {
      const createSell = await market.cancelListedNFT(collectionId,nftId);
      await createSell.wait(); //wait complete transation
      console.log("NFT cancelando a venda");
    }
    else if ( nftType == "auction" ) {
      const cancelAuction = await market.cancelAuction(collectionId,nftId);
      await cancelAuction.wait(); //wait complete transation
      console.log("NFT cancelando o leilão");
    }

    await cancelSellDb();
    router.reload();

  }

  const buyItem = async (nftPrice) => {

    console.log("Comprando NFT");

    const web3Modal = new Web3Modal({
      network: "localhost", // optional
      cacheProvider: true, // optional
      providerOptions // required
    });
  
    const instance = await web3Modal.connect();
    const provider = new ethers.providers.Web3Provider(instance);
    const signer = provider.getSigner();

    let market = new ethers.Contract(marketplaceAddress, BoxBlockNFTMarketplace.abi, signer);

    const createBuy = await market.buy(collectionId,nftId,paymentAddress,nftPrice, {value: nftPrice});
    await createBuy.wait(); //wait complete transation

    await buyItemDb();
    await updateContractNegociatedValue(ethers.utils.formatEther(nftPrice) );

    console.log("NFT Comprado");
    router.reload();

  }

  const placeBid = async (nftPrice) => {

    console.log("Fazendo oferta NFT");

    const web3Modal = new Web3Modal({
      network: "localhost", // optional
      cacheProvider: true, // optional
      providerOptions // required
    });
  
    const instance = await web3Modal.connect();
    const provider = new ethers.providers.Web3Provider(instance);
    const signer = provider.getSigner();

    let market = new ethers.Contract(marketplaceAddress, BoxBlockNFTMarketplace.abi, signer);


    const createBid = await market.placeBid(collectionId,nftId,nftPrice);
    await createBid.wait(); //wait complete transation

    //await updateTokenValue();

    console.log("Oferta realizada");
    router.reload();

  }

  return (

    <>
      <div className="flex flex-col h-auto w-full rounded-lg border border-[#eee] bg-[#f7f7f7] px-8 py-8">

        <ModalPrice setShow={setShowModal} show={showNodal} putToSell={putToSell} putToAuction={putToAuction} />

        <div className='flex flex-row'>

          <div className='flex flex-col flex-1'>
            <div className={style.infoTitle}>
              {(nftType == "owned" || nftSold) && ("-")}
              {nftType  == "auction" && !nftSold && ("Lance Atual") }
              {nftType  == "list" && !nftSold && ("Preço") }
            </div>
            <div className='mt-3 mb-3 flex flex-row items-center content-center'>
              <div className='text-[#303339] text-4xl font-bold'>
                {nftType  == "auction" && !nftSold && (ethers.utils.formatEther( BigInt(nftData.marketplace_data.heighestBid) + BigInt(nftData.marketplace_data.minBid) ))}
                {nftType  == "list" && !nftSold && (ethers.utils.formatEther( nftData.marketplace_data.price ))} 
                {(nftType == "mined" || nftSold) && ("-")}
                <span className='text-sm align-baseline inline-block'>{" "}ETH</span>
              </div>
            </div>
          </div>
          {userIsLogged && !isOwner  && nftType == "auction" && !nftData.marketplace_data.success && 
            <div className='flex flex-col flex-1'>
              <div className={style.infoTitle}>
                Tempo Restante
              </div>
              <div className='mt mb flex flex-row items-center content-center'>
                <div className='text-[#303339] font-bold font-sora text-xl'>
                  <Countdown date={nftData.marketplace_data.endTime.toNumber()} />
                </div>
              </div>
              <div className={style.infoTitle}>
                ({format(new Date(nftData.marketplace_data.endTime.toNumber()), "yyyy.MM.dd H:ii")})
              </div>
            </div>
          }

        </div>
        {
          isOwner && (nftType == "mined" || nftSold)  && 
          <div className={`${style.button} bg-[#2081e2] hover:bg-[#42a0ff]`} onClick={()=>{ setShowModal(true); }}>
            <IoMdWallet className={style.buttonIcon} />
            <div className={style.buttonText}>Colocar a Venda</div>
          </div>
          
        }
        {
          isOwner && !nftSold &&  nftType != "mined" &&
          <div className={`${style.button} bg-[#2081e2] hover:bg-[#42a0ff]`} onClick={()=>{ cancelSell() }}>
            <AiOutlineStop className={style.buttonIcon} />
            <div className={style.buttonText}>Cancelar a Venda</div>
          </div>
        }
        {
          userIsLogged && !isOwner  && nftType == "list" && !nftSold && 
          <div
            onClick={() => {
              buyItem(nftData.marketplace_data.price);
            }}
            className={`${style.button} bg-[#2081e2] hover:bg-[#42a0ff]`}
          >
            <IoMdWallet className={style.buttonIcon} />
            <div className={style.buttonText}>Comprar Item</div>
          </div>
        }
        {
          userIsLogged && !isOwner  && nftType == "auction" && !nftData.marketplace_data.success && 
          <div
            onClick={() => {
              buyItem(nftData.marketplace_data.price);
            }}
            className={`${style.button} bg-[#2081e2] hover:bg-[#42a0ff]`}
          >
            <IoMdWallet className={style.buttonIcon} />
            <div className={style.buttonText}>Fazer Oferta</div>
          </div>
        }
        {
          !userIsLogged && 
          <>
          <div
            onClick={async () => {
              const web3Modal = new Web3Modal()
              const connection = await web3Modal.connect()
              const provider = new ethers.providers.Web3Provider(connection)
            }}
            className={`${style.button} bg-[#2081e2] hover:bg-[#42a0ff]`}
          >
            <IoMdWallet className={style.buttonIcon} />
            <div className={style.buttonText}>Conecte-se para interagir</div>
          </div>
          </>
        }

      </div>
    </>
  )
}

export default Purchase
