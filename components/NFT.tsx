import { Text, Card, Button, Input, HStack } from "@chakra-ui/react";
import { MediaRenderer, Web3Button, useActiveClaimCondition, useContract } from "@thirdweb-dev/react";
import { NFT } from "@thirdweb-dev/sdk";
import { TOOLS_ADDRESS } from "../const/addresses";
import { ethers } from "ethers";
import { useState } from "react";

type Props = {
    nft: NFT;
};

export default function NFTComponent({ nft }: Props) {
    const { contract } = useContract(TOOLS_ADDRESS);
    const { data, isLoading } = useActiveClaimCondition(
        contract,
        nft.metadata.id, // Token ID required for ERC1155 contracts here.
    );

    const [quantity, setQuantity] = useState(1);

    const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = parseInt(e.target.value);
        setQuantity(isNaN(value) || value < 1 ? 1 : value); // Prevent invalid values
    };

    return (
        <Card key={nft.metadata.id} overflow={"hidden"}>
            <MediaRenderer
                src={nft.metadata.image}
                height="100%"
                width="100%"
            />
            <Text fontSize={"2xl"} fontWeight={"bold"} my={5} textAlign={"center"}>
                {nft.metadata.name}
            </Text>
            {!isLoading && data ? (
                <>
                    <Text textAlign={"center"} my={5}>
                        Cost per item: {ethers.utils.formatEther(data?.price)}{" " + data?.currencyMetadata.symbol}
                    </Text>
                    <HStack justify={"center"} my={3}>
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
                    <Text textAlign={"center"} my={3}>
                        Total: {(quantity * parseFloat(ethers.utils.formatEther(data?.price))).toFixed(4)}{" " + data?.currencyMetadata.symbol}
                    </Text>
                </>
            ) : (
                <Text>Loading...</Text>
            )}
            <Web3Button
                contractAddress={TOOLS_ADDRESS}
                action={(contract) => contract.erc1155.claim(nft.metadata.id, quantity)}
                onSuccess={() => {
                    setQuantity(1); // Reset quantity after successful claim
                    alert("NFT claimed successfully!");
                }}
            >
                {`Buy ${quantity > 1 ? `${quantity} NFTs` : "NFT"}`}
            </Web3Button>
        </Card>
    );
}