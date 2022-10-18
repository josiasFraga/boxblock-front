
import type { NextPage } from 'next'
import toast, { Toaster } from 'react-hot-toast'
import bgHeader from '../assets/images/bg_header.png'

import Header from '../components/Header.js'
import MainBanner from '../components/MainBanner.js'
import SliderNfts from '../components/SliderNfts.js'

const style = {
  wrapper: ``,
  walletConnectWrapper: `flex flex-col justify-center items-center h-screen w-screen bg-[#3b3d42] `,
  button: `bg-[#2081e2] p-[0.8rem] text-lg font-semibold rounded-lg cursor-pointer text-black`,
  details: `text-lg text-center text-white font-semibold mt-4`,
}

const Home: NextPage = () => {

  return (
    <div className='h-auto min-h-screen' style={{backgroundImage: `url(${bgHeader.src})`, backgroundPosition: "center -150px", backgroundSize: "auto 100%"}}>
        <Toaster position="top-center" reverseOrder={false} />
        <div className="min-h-screen flex flex-col">
          <Header />
          <MainBanner />
        </div>

        <SliderNfts title="Últimas experiências" />
    </div>
  )
}

export default Home
