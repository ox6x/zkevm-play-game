import { PropsWithChildren } from "react";
import { ThirdwebProvider } from "@thirdweb-dev/react";
import { ChakraProvider, Box } from "@chakra-ui/react";
import NavBar from "../components/NavBar";
import "./globals.css"; // 确保全局样式文件在此引入
import Head from "next/head";

const CLIENT_ID = process.env.NEXT_PUBLIC_CLIENT_ID as string;

export default function RootLayout({ children }: PropsWithChildren) {
  return (
    <html lang="en">
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>Crypto Farm</title>
      </Head>
      <body>
        <ThirdwebProvider
          clientId={CLIENT_ID}
          activeChain={{
            chainId: 97, // BSC Testnet
            rpc: ["https://97.rpc.thirdweb.com"],
            nativeCurrency: {
              name: "Binance Smart Chain Testnet",
              symbol: "tBNB",
              decimals: 18,
            },
            name: "BSC Testnet",
            chain: "bsc-testnet",
            shortName: "tBNB",
            testnet: true,
            slug: "bsc-testnet",
          }}
        >
          <ChakraProvider>
            <NavBar /> {/* 全局导航栏 */}
            <Box minH="100vh" p={4}>
              {children} {/* 渲染每个页面的内容 */}
            </Box>
          </ChakraProvider>
        </ThirdwebProvider>
      </body>
    </html>
  );
}