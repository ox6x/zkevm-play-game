import { MediaRenderer, useContract, useContractMetadata, useAddress } from "@thirdweb-dev/react";
import { useSendTransaction } from "thirdweb/react";
import { claimTo } from "thirdweb/extensions/erc1155";
import { FARMER_ADDRESS } from "../const/addresses";
import { Box, Container, Flex, Heading, Button } from "@chakra-ui/react";

export function ClaimFarmer() {
    const { contract } = useContract(FARMER_ADDRESS);
    const { data: metadata } = useContractMetadata(contract);
    const address = useAddress();
    const { mutate: sendTransaction } = useSendTransaction();

    const onClick = () => {
        if (!address) {
            alert("请先连接钱包");
            return;
        }
        if (!contract) {
            alert("合约未找到");
            return;
        }
        const transaction = claimTo({
            contract,
            to: address,
            amount: 1,
            tokenId: 0,
        });
        sendTransaction(transaction);
    };

    return (
        <Container maxW={"1200px"}>
            <Flex direction={"column"} alignItems={"center"} justifyContent={"center"} h={"50vh"}>
                <Heading>Claim Farmer to start farming</Heading>
                <Box borderRadius={"8px"} overflow={"hidden"} my={10}>
                    <MediaRenderer
                        src={metadata?.image}
                        height="300px"
                        width="300px"
                    />
                </Box>
                
                <Button onClick={onClick}>Claim Farmer</Button>
            </Flex>
        </Container>
    );
}