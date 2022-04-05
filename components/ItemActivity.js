import { useState } from 'react'

import { AiOutlineDown, AiOutlineUp } from 'react-icons/ai'
import { CgArrowsExchangeV } from 'react-icons/cg'

import { dummyEvents } from '../static/dummy.js'
import EventItem from './EventItem.js'

import { style } from './ItemActivity.style.js'


const ItemActivity = () => {
  const [toggle, setToggle] = useState(false)

  return (
    <div className={style.wrapper}>
      <div className={style.title} onClick={() => setToggle(!toggle)}>
        <div className={style.titleLeft}>
          <span className={style.titleIcon}>
            <CgArrowsExchangeV />
          </span>
          Item Activity
        </div>
        <div className={style.titleRight}>
          {toggle ? <AiOutlineUp /> : <AiOutlineDown />}
        </div>
      </div>
      {toggle && (
        <div className={style.activityTable}>
          <div className={style.filter}>
            <div className={style.filterTitle}>Filter</div>
            <div className={style.filterIcon}>
              <AiOutlineDown />
            </div>
          </div>
          <div className={style.tableHeader}>
            <div className={`${style.tableHeaderElement} flex-[2]`}>Event</div>
            <div className={`${style.tableHeaderElement} flex-[2]`}>Price</div>
            <div className={`${style.tableHeaderElement} flex-[3]`}>From</div>
            <div className={`${style.tableHeaderElement} flex-[3]`}>To</div>
            <div className={`${style.tableHeaderElement} flex-[2]`}>Date</div>
          </div>
          {dummyEvents.map((event, id) => {
            return <EventItem key={id} event={event} />
          })}
        </div>
      )}
    </div>
  )
}

export default ItemActivity
