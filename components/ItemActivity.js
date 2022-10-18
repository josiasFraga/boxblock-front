import { useEffect, useState } from 'react'

import EventItem from './EventItem.js'
import { useWeb3 } from '@3rdweb/hooks'

import { AiOutlineDown, AiOutlineUp } from 'react-icons/ai'
import { CgArrowsExchangeV } from 'react-icons/cg'
import { client } from '../lib/sanityClient.js'
import { ethers } from 'ethers'
import { format } from 'date-fns'


import { style } from './ItemActivity.style.js'

import BoxBlockNFT from '../artifacts/contracts/BoxBlock.sol/BoxBlockNFT.json'

import {
  marketplaceAddress
} from '../config'

const ItemActivity = ({collectionId, nftId}) => {
  const [toggle, setToggle] = useState(true)
  const [eventsHistoric, setEventsHistoric] = useState([])

  const getNftData = async() => {

    if ( !collectionId || collectionId == null || !nftId || nftId == null || eventsHistoric[0] ) {
      return false;
    }

    console.log('buscando o histórico do nft');
    const provider = new ethers.providers.JsonRpcProvider();

    let token = new ethers.Contract(collectionId, BoxBlockNFT.abi, provider);

    const logs = await token.queryFilter(
      token.filters.Transfer(null, null, nftId),
    );

    let events = [];

    await Promise.all(logs.map(async (log) => {

      let transationData = await log.getTransaction();
      await transationData.wait();
      let blockData = await log.getBlock();

      let from = await fetchUserData(log.args.from);
      let to = await fetchUserData(log.args.to);

      let event_name = "";
    
      if ( log.args.from == "0x0000000000000000000000000000000000000000" ) {
        event_name = "Minerado";
      }
      if ( log.args.to == marketplaceAddress ) {
        event_name = "Listado";
      }
    
      if ( log.args.from == marketplaceAddress ) {
        event_name = "Venda";
      }
    
			events.push({
        "event" : event_name,
        "price" : ethers.utils.formatEther( transationData.value ),
        "from" : from,
        "to" : to,
        "date" : format(new Date(blockData.timestamp*1000), 'dd/MM/yyyy'),
        "timest" : blockData.timestamp
      });
		}));


    let lastOwner = "";
    events = events.sort((a, b) => b.timest - a.timest );
    events = events.map((event)=>{
      if (event.name == "Listado"){
        event.from = lastOwner;
        lastOwner = event.from;
      }

      return event;
    })
    setEventsHistoric(events);
    
  }

  const fetchUserData = async (user_address) => {

    if ( user_address == "0x0000000000000000000000000000000000000000" ) {
      return "";
    }

    const query = `*[_type == "users" && _id == "${user_address}" ] {
      userName,
    }`;

    const userData = await client.fetch(query);

    return userData[0] ? userData[0]["userName"] : "BoxBlock";
  }

  useEffect(() => {
    getNftData();
  }, [collectionId, nftId])

  return (
    <div className={style.wrapper}>
      <div className={style.title} onClick={() => setToggle(!toggle)}>
        <div className={style.titleLeft}>
          <span className={style.titleIcon}>
            <CgArrowsExchangeV />
          </span>
          Atividade do Item
        </div>
        <div className={style.titleRight}>
          {toggle ? <AiOutlineUp /> : <AiOutlineDown />}
        </div>
      </div>
      {toggle && (
        <div className={style.activityTable}>
          <div className={style.filter}>
            <div className={style.filterTitle}>Filtrar</div>
            <div className={style.filterIcon}>
              {' '}
              <AiOutlineDown />{' '}
            </div>
          </div>
          <div className={style.tableHeader}>
            <div className={`${style.tableHeaderElement} flex-[2]`}>Evento</div>
            <div className={`${style.tableHeaderElement} flex-[2] text-center`}>Preço</div>
            <div className={`${style.tableHeaderElement} flex-[3]`}>De</div>
            <div className={`${style.tableHeaderElement} flex-[3]`}>Para</div>
            <div className={`${style.tableHeaderElement} flex-[2] text-center`}>Data</div>
          </div>
          {eventsHistoric.map((event, id) => (
            <EventItem key={id} event={event} />
          ))}
        </div>
      )}
    </div>
  )
}

export default ItemActivity
