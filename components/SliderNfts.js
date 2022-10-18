import React, { useEffect, useState } from "react";
import Router from 'next/router'
import { client } from '../lib/sanityClient.js'
import Slider from "react-slick";

import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css";

import { style } from './SliderNfts.style'

const SliderNfts = (props) => {
    const [nfts, setNfts] = useState([]);
    const title = props.title;

    const settings = {
        dots: false,
        infinite: false,
        speed: 500,
        slidesToShow: 5,
        slidesToScroll: 1,
        initialSlide: 0,
        responsive: [
            {
            breakpoint: 1024,
            settings: {
                slidesToShow: 3,
                slidesToScroll: 3,
                infinite: false,
                dots: false
            }
            },
            {
            breakpoint: 600,
            settings: {
                slidesToShow: 2,
                slidesToScroll: 2,
                infinite: false,
                dots: false
            }
            },
            {
            breakpoint: 480,
            settings: {
                slidesToShow: 1,
                slidesToScroll: 1,
                infinite: false,
                dots: false
            }
            }
        ]
    };

    useEffect(() => {
       fetchNfts();
    }, [])

    const fetchNfts = async(sanityClient = client) => {

        console.log("buscando ultimos NFTs");

        let query = `*[_type == "marketTokens" && sold == "N" && onMarketplace == "Y"`
        if ( props.collectionId && props.collectionId != '' ) {
            query += ` && contractAddress == "` + props.collectionId + `" `
        }
        query += `] {
            tokenId,
            contractAddress,
            price,
            url,
            "collectionNftName": collection->tokenName,
            minBid,
            type,
        } | order(_createdAt desc)[0..19]`;


        const tokens = await sanityClient.fetch(query)
        setNfts(tokens);
        
  
    }

    return (
        <div className={style.wrapper}>
        <h2 className="text-center mb-16 text-4xl font-sora"> {title} </h2>
        {nfts.length > 0 &&
        <Slider {...settings}>
            {nfts.map((item, index) => {
                let price = item.price;
                if ( item.type == "auction" ) {
                    price += item.minBid;
                }
                return (
                    <div className="h-96 px-2 cursor-pointer" key={index} onClick={()=>{
                        Router.push({
                            pathname: `/nft/${item.contractAddress}/${item.tokenId}`,
                            //query: { isListed: isListed },
                          })
                        }}
                    >
                        <div className="h-5/6">
                            <img src={item.url} className="rounded-xl object-cover h-full"  />
                        </div>
                        <div className="h-1/6">
                            <div className="flex flex-row pt-1 content-center items-center">
                                <div className="flex flex-1">
                                    <h3 className="">{item.collectionNftName} #{item.tokenId}</h3>
                                </div>
                                <div>
                                    <div className="text-[#2a27c9] text-xs bg-[#2a27c91a] h-6 w-20 text-center rounded leading-loose font-sora">
                                        {price} ETH
                                    </div>
                                </div>
                            </div>
                            {item.type == "auction" && <div>aaa</div>}
                            {item.type != "auction" && <div>{"-"}</div>}
                            <hr className="my-8 h-px bg-gray-200 border-0 dark:bg-gray-700"></hr>

                        </div>
                    </div>
                )
            })}
        </Slider>
        }
        </div>
    );
      
}

export default SliderNfts