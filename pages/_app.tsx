import { useEffect } from 'react'
import type { AppProps } from 'next/app'
import { ThirdwebWeb3Provider } from '@3rdweb/hooks'

import '../styles/globals.css'


const supportedChainIds = [1, 4, 137, 1337]
const connectors = { injected: {} }

function MyApp({ Component, pageProps }: AppProps) {
  return (

    <ThirdwebWeb3Provider
      supportedChainIds={supportedChainIds}
      connectors={connectors}
    >

      <Component {...pageProps} />
    </ThirdwebWeb3Provider>
  )
}

export default MyApp
