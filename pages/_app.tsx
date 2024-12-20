import type { AppProps } from "next/app";
import { ThirdwebProvider } from "@thirdweb-dev/react";
import { BinanceTestnet } from "@thirdweb-dev/chains";
import { ChakraProvider } from "@chakra-ui/react";
import NavBar from "../components/NavBar";

interface MyAppProps extends AppProps {
  pageProps: {
    clientId?: string;
  };
}

function MyApp({ Component, pageProps }: MyAppProps) {
  const clientId = process.env.NEXT_PUBLIC_CLIENT_ID;
  const CLIENT_ID = process.env.NEXT_PUBLIC_CLIENT_ID as string;

  return (
    <ThirdwebProvider activeChain={BinanceTestnet}>
      <ChakraProvider>
        <NavBar clientId={clientId} />
        <Component {...pageProps} clientId={clientId} />
      </ChakraProvider>
    </ThirdwebProvider>
  );
}

export default MyApp;
