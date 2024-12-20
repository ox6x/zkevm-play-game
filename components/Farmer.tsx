import { MediaRenderer, Web3Button, useContract, useContractMetadata } from "@thirdweb-dev/react";
import { FARMER_ADDRESS } from "../const/addresses";
import { Box, Container, Flex, Heading } from "@chakra-ui/react";

// 组件：用于显示标题和说明
function Header() {
    return (
        <Heading>Claim Farmer to start farming</Heading>
    );
}

// 组件：用于显示农民的媒体内容
function FarmerMedia({ metadata }) {
    return (
        <Box borderRadius={"8px"} overflow={"hidden"} my={10}>
            <MediaRenderer
                src={metadata?.image}
                height="300px"
                width="300px"
            />
        </Box>
    );
}

// 组件：用于处理 Claim 功能的按钮
function ClaimButton() {
    return (
        <Web3Button
            contractAddress={FARMER_ADDRESS}
            action={(contract) => contract.erc1155.claim(0, 1)}
        >
            Claim Farmer
        </Web3Button>
    );
}

// 主组件：组合所有子组件
export function ClaimFarmer() {
    const { contract } = useContract(FARMER_ADDRESS);
    const { data: metadata } = useContractMetadata(contract);

    return (
        <Container maxW={"1200px"}>
            <Flex direction={"column"} alignItems={"center"} justifyContent={"center"} h={"50vh"}>
                <Header />
                <FarmerMedia metadata={metadata} />
                <ClaimButton />
            </Flex>
        </Container>
    );
}