
import { useEffect, useState } from 'react'

import type { NextPage } from 'next'
import toast, { Toaster } from 'react-hot-toast'
//import bgHeader from '../assets/images/bg_header.png'

import Header from '../components/Header.js'
import Footer from '../components/Footer.js'
import MainHome from '../components/MainHome.js'
import MainHomeUser from '../components/MainHomeUser.js'

const style = {
  wrapper: ``,
  walletConnectWrapper: `flex flex-col justify-center items-center h-screen w-screen bg-[#3b3d42] `,
  button: `bg-[#2081e2] p-[0.8rem] text-lg font-semibold rounded-lg cursor-pointer text-black`,
  details: `text-lg text-center text-white font-semibold mt-4`,
}

const Home: NextPage = () => {

  const [userCpf, setUserCpf] = useState("")

  useEffect(function() {
      const us_cpf = window.localStorage.getItem("us_cpf");
      if ( us_cpf ){
          setUserCpf(us_cpf);
      }
  },[]);

  return (
    <div className='h-auto min-h-screen' style={{backgroundColor: "#fff"}}>
        <Toaster position="top-center" reverseOrder={false} />
        <div className="min-h-screen flex flex-col">
          <Header />
          {userCpf == "" && <MainHome />}
          {userCpf != "" && <MainHomeUser cpf={userCpf} />}
          <div className='flex flex-1 flex-col justify-end'>
              <Footer />
          </div>
        </div>
    </div>
  )
}

export default Home
