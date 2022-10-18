import { useEffect, useState } from 'react'
import Router from 'next/router'

import { BiHeart } from 'react-icons/bi'

import { style } from './ImageRadio.style.js'

const ImageRadio = ({ title, contractAddress, profileImage, formik}) => {
    const isChecked = contractAddress == formik.values.collectionAddress;
    const classActive = isChecked ? "border-blue-500 border-2 box-border" : "bg-stone-50 opacity-70";
    return (
        <div
        className={"m-2 pt-4 w-40 whitespace-nowrap justfy-center p-2 cursor-pointer shadow-md rounded-sm " + classActive + " bg-white"}
        onClick={() => {
            formik.setFieldValue('collectionAddress', contractAddress);
        }}
        >
        <div className='relative'>
            <div className={'absolute w-4 h-4 z-10 right-1.5 top-1.5 shadow rounded-full border-white border-2 bg-white ' + classActive}>
            </div>
        </div>
            <div className='w-full'>
                <img 
                    src={ profileImage && profileImage != null && typeof(profileImage) == 'string' ? profileImage : "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png"} 
                    alt={title} 
                    className={"w-full rounded-sm "}
                />

            </div>
            <div className='w-full whitespace-nowrap text-ellipsis overflow-hidden p-1 text-sm'>
                {title}
            </div>
        </div>
    )
}

export default ImageRadio
