import { style } from './Hero.style.js'


const Hero = () => {
  return (
    <div className={style.wrapper}>
      <div className={style.container}>
        <div className={style.contentWrapper}>
          <div className={style.copyContainer}>
            <div className={style.title}>
              Discover, collect and sell extraordinary NFTs
            </div>
            <div className={style.description}>
              Opensea is the world&apos; first and largest NFT marketplace
            </div>
            <div className={style.ctaContainer}>
              <button className={style.accentedButton}>Explore</button>
              <button className={style.button}>Create</button>
            </div>
          </div>
          <div className={style.cardContainer}>
            <img
              className="rounded-t-lg"
              src="https://lh3.googleusercontent.com/C0K1INFhIXcsRwalRPr_3SkYpk_esO039M9veydGwcrrNFks737CZW2ZPKNNpev5oXuS68NbjTQyvw_P7J8-02Otlf5VWXSYMwYJ9w=s550"
              alt="Man without face"
            />
            <div className={style.infoContainer}>
              <img
                className="h-[2.25rem] rounded-full"
                src="https://lh3.googleusercontent.com/F4vhQWbtsXWrdkeYt189xQWqy5IqIwLo6f7JaMoJXtNlkIuCyWMTyPYgNmPGgmaBrR-AdNirde9MaCFhG9jckHt9FxjHNuuwutXjLw=s80"
                alt="Man without face"
              />
              <div className={style.author}>
                <div className={style.name}>Man Without a Face</div>
                <a
                  className="text-[#1868b7]"
                  href="https://opensea.io/assets/0x495f947276749ce646f68ac8c248420045cb7b5e/10935686519463649066893755243917080523517573366192681490676511568628646150145"
                >
                  SpasiSohrani
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Hero
