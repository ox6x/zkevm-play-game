import type { AppProps } from "next/app";
import { ThirdwebProvider } from "@thirdweb-dev/react";
import { BinanceTestnet } from "@thirdweb-dev/chains";
import { ChakraProvider } from "@chakra-ui/react";
import NavBar from "../components/NavBar";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ThirdwebProvider 
      clientId={process.env.NEXT_PUBLIC_CLIENT_ID}
      activeChain={BinanceTestnet}
    >
      <ChakraProvider>
        <NavBar />
        <Component {...pageProps} />
      </ChakraProvider>
    </ThirdwebProvider>
  );
}

export default MyApp;