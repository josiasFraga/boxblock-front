import LoginCpf from './MainHome/LoginCpf.js'

const MainHome = () => {
    return (
    <div className='px-2'>
        <div className='flex flex-1 justfy-center flex-col items-center mt-6'>
            <div className='container flex flex-col mx-auto'>
                <h1 className="font-extrabold text-xl pr-16 tracking-tight leading-none text-gray-900 md:text-1=2xl xl:text-3xl dark:text-white font-sora">Seja bem-vindo!</h1>
                <p className=" text-gray-500 mb-4">Gorumê Colecionáveis NFT</p>

                <LoginCpf />
            </div>
        </div>
    </div>
    )
}

export default MainHome