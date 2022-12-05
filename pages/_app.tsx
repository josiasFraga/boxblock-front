import { useEffect } from 'react'
import type { AppProps } from 'next/app'
import { ThirdwebWeb3Provider } from '@3rdweb/hooks'
import Head from 'next/head'

import '../styles/globals.css'

//const supportedChainIds = [1, 4, 137, 1337];
const supportedChainIds = [5];
const connectors = { injected: {} }

function MyApp({ Component, pageProps }: AppProps) {
  const AnyComponent = Component as any;
  return (

    <ThirdwebWeb3Provider
      supportedChainIds={supportedChainIds}
      connectors={connectors}
    >
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0,user-scalable=0" />
      </Head>

      <AnyComponent {...pageProps} />
    </ThirdwebWeb3Provider>
  )
}

export default MyApp
