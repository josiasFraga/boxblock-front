import { BsFillCartFill } from 'react-icons/bs'

import { style } from './EventItem.style.js'


const EventItem = ({ event }) => {
  return (
    <div className={style.eventItem}>
      <div className={`${style.event} flex-[2]`}>
        <div className={style.eventIcon}>
          <BsFillCartFill />
        </div>
        <div className={style.eventName}>{event.event}</div>
      </div>
      <div className={`${style.eventPrice} flex-[2] items-center justfy-center`}>
        <img
          src="https://ethereum.org/static/6b935ac0e6194247347855dc3d328e83/6ed5f/eth-diamond-black.webp"
          alt="eth"
          className={style.ethLogo}
        />
        <div className={style.eventPriceValue}>{event.price}</div>
      </div>
      <div className={`${style.accent} flex-[3]`}>{event.from}</div>
      <div className={`${style.accent} flex-[3]`}>{event.to}</div>
      <div className={`${style.accent} flex-[2] text-center`}>{event.date}</div>
    </div>
  )
}

export default EventItem
