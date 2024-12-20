import {
    MediaRenderer,
    Web3Button,
    useAddress,
    useContract,
    useContractRead,
    useNFT
} from "@thirdweb-dev/react";
import { STAKING_ADDRESS, TOOLS_ADDRESS } from "../const/addresses";
import { ethers } from "ethers";
import { Text, Box, Card, Stack, Flex, Button, Input, HStack } from "@chakra-ui/react";
import { useState } from "react";
import { prepareContractCall } from "thirdweb";
import { useSendTransaction } from "thirdweb/react";

interface EquippedProps {
    tokenId: number;
};

export const Equipped = (props: EquippedProps) => {
    const address = useAddress();

    const { contract: toolContract } = useContract(TOOLS_ADDRESS);
    const { data: nft } = useNFT(toolContract, props.tokenId);

    const { contract: stakingContract } = useContract(STAKING_ADDRESS);

    // 单独的 NFT 的质押奖励信息
    const { data: claimableRewards } = useContractRead(
        stakingContract,
        "getStakeInfoForToken",
        [props.tokenId, address]
    );

    // 获取所有质押 NFT 奖励总额
    const { data: totalRewards } = useContractRead(
        stakingContract,
        "getTotalRewards",
        [address] // Assuming the contract supports fetching total rewards
    );

    // 支持发送交易
    const { mutate: sendTransaction } = useSendTransaction();

    const [quantity, setQuantity] = useState(1);

    const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = parseInt(e.target.value);
        setQuantity(isNaN(value) || value < 1 ? 1 : value); // 防止无效输入
    };

    const claimAllRewards = () => {
        const transaction = prepareContractCall({
            contract: stakingContract,
            method: "withdrawRewardTokens",
            params: [totalRewards], // Pass total rewards amount
        });
        sendTransaction(transaction, {
            onSuccess: () => {
                alert("All rewards claimed successfully!");
            },
            onError: (error) => {
                console.error(error);
                alert("Error claiming all rewards.");
            },
        });
    };

    return (
        <Box>
            {nft && (
                <Card p={5}>
                    <Flex>
                        <Box>
                            <MediaRenderer
                                src={nft.metadata.image}
                                height="80%"
                                width="80%"
                            />
                        </Box>
                        <Stack spacing={1}>
                            <Text fontSize={"2xl"} fontWeight={"bold"}>{nft.metadata.name}</Text>
                            <Text>Equipped: {ethers.utils.formatUnits(claimableRewards?.[0] || 0, 0)}</Text>
                            <HStack>
                                <Button onClick={() => setQuantity(Math.max(1, quantity - 1))}>-</Button>
                                <Input
                                    type="number"
                                    value={quantity}
                                    onChange={handleQuantityChange}
                                    textAlign="center"
                                    width="70px"
                                />
                                <Button onClick={() => setQuantity(quantity + 1)}>+</Button>
                            </HStack>
                            <Web3Button
                                contractAddress={STAKING_ADDRESS}
                                action={(contract) => contract.call("withdraw", [props.tokenId, quantity])}
                                onSuccess={() => {
                                    setQuantity(1); // 解绑后重置数量
                                    alert("Unequip successful!");
                                }}
                            >{`Unequip ${quantity > 1 ? `${quantity} Items` : "Item"}`}</Web3Button>
                        </Stack>
                    </Flex>
                    <Box mt={5}>
                        <Text>Claimable $CARROT:</Text>
                        <Text>{ethers.utils.formatUnits(claimableRewards?.[1] || 0, 18)}</Text>
                        <Web3Button
                            contractAddress={STAKING_ADDRESS}
                            action={(contract) => contract.call("claimRewards", [props.tokenId])}
                            onSuccess={() => alert("$CARROT claimed successfully!")}
                        >Claim $CARROT</Web3Button>
                    </Box>
                </Card>
            )}
            {/* 添加一次性领取所有奖励的功能 */}
            {totalRewards && (
                <Box mt={5} textAlign="center">
                    <Text>Total Claimable $CARROT:</Text>
                    <Text>{ethers.utils.formatUnits(totalRewards, 18)}</Text>
                    <Button onClick={claimAllRewards}>Claim All $CARROT</Button>
                </Box>
            )}
        </Box>
    );
};