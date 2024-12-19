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

interface EquippedProps {
    tokenId: number;
};

export const Equipped = (props: EquippedProps) => {
    const address = useAddress();

    const { contract: toolContract } = useContract(TOOLS_ADDRESS);
    const { data: nft } = useNFT(toolContract, props.tokenId);

    const { contract: stakingContract } = useContract(STAKING_ADDRESS);

    const { data: claimableRewards } = useContractRead(
        stakingContract,
        "getStakeInfoForToken",
        [props.tokenId, address]
    );

    const [quantity, setQuantity] = useState(1);

    const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = parseInt(e.target.value);
        setQuantity(isNaN(value) || value < 1 ? 1 : value); // Prevent invalid values
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
                                    setQuantity(1); // Reset quantity after unequip
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
        </Box>
    );
};