import { useContract, useContractMetadata, useClaimNFT } from "@thirdweb-dev/react";
import { FARMER_ADDRESS } from "../const/addresses";
import { Box, Container, Flex, Heading } from "@chakra-ui/react";

export function ClaimFarmer() {
    // 获取合约实例
    const { contract } = useContract(FARMER_ADDRESS);

    // 获取合约元数据
    const { data: metadata } = useContractMetadata(contract);

    // 使用新的 ClaimNFT 钩子
    const { mutate: claimNFT, isLoading } = useClaimNFT(contract);

    const handleClaim = () => {
        claimNFT({
            to: "0xYourWalletAddressHere", // 替换为用户地址或者动态获取
            tokenId: 0,                   // NFT 的 tokenId
            quantity: 1                   // 领取的数量
        });
    };

    return (
        <Container maxW={"1200px"}>
            <Flex direction={"column"} alignItems={"center"} justifyContent={"center"} h={"50vh"}>
                <Heading>Claim Farmer to start farming</Heading>
                <Box borderRadius={"8px"} overflow={"hidden"} my={10}>
                    <img
                        src={metadata?.image || ""}
                        alt={metadata?.name || "NFT"}
                        height="300px"
                        width="300px"
                    />
                </Box>
                
                <button
                    onClick={handleClaim}
                    disabled={isLoading}
                    style={{
                        padding: "10px 20px",
                        fontSize: "16px",
                        cursor: "pointer",
                        backgroundColor: isLoading ? "#ccc" : "#007bff",
                        color: "#fff",
                        border: "none",
                        borderRadius: "5px",
                    }}
                >
                    {isLoading ? "Claiming..." : "Claim Farmer"}
                </button>
            </Flex>
        </Container>
    );
}