import Search from './MainBanner/Search.js'

const MainBanner = () => {
    return (
    <div className='flex flex-1 justfy-center place-content-center flex-col items-center'>
        <div className='max-w-full w-10/12 items-center'>
            <p className="text-lg font-normal text-gray-500 text-sm dark:text-gray-400 text-center font-sora">NON FUNGIBLE TOKENS</p>
            <h1 className="font-extrabold text-5xl pr-16 tracking-tight leading-none text-gray-900 md:text-7xl xl:text-8xl dark:text-white text-center font-sora sm:pr-32 ">Experiências</h1>
            <h1 className="font-extrabold text-5xl pl-16 tracking-tight leading-none text-gray-900 md:text-7xl xl:text-8xl dark:text-white text-center font-sora sm:pl-32 mb-4">em blockchain</h1>
            <p className="mb-2 text-lg font-normal text-gray-500 text-xl dark:text-gray-400 text-center">Descubra e viva as experiências</p>
        </div>
        <div className='w-full flex content-center place-content-center'>
            <Search />
        </div>
    </div>
    )
}

export default MainBanner