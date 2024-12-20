import { MediaRenderer, Web3Button, useContract, useContractMetadata } from "@thirdweb-dev/react";
import { FARMER_ADDRESS } from "../const/addresses";
import { Box, Container, Flex, Heading, Text } from "@chakra-ui/react";
import { useState } from "react";

export function ClaimFarmer() {
    const { contract } = useContract(FARMER_ADDRESS);
    const { data: metadata } = useContractMetadata(contract);
    const [errorMessage, setErrorMessage] = useState("");
    const [successMessage, setSuccessMessage] = useState("");

    return (
        <Container maxW={"1200px"}>
            <Flex direction={"column"} alignItems={"center"} justifyContent={"center"} h={"60vh"}>
                <Heading>Claim Farmer to start farming</Heading>

                {metadata && (
                    <Box borderRadius={"8px"} overflow={"hidden"} my={10}>
                        <MediaRenderer
                            src={metadata?.image}
                            height="300px"
                            width="300px"
                        />
                    </Box>
                )}

                <Web3Button
                    contractAddress={FARMER_ADDRESS}
                    action={async (contract) => {
                        try {
                            setErrorMessage(""); // Reset error message
                            setSuccessMessage(""); // Reset success message

                            // Call the claim function
                            await contract.erc1155.claim(0, 1);
                            setSuccessMessage("Claim successful!"); // Set success message
                        } catch (error) {
                            console.error("Claim failed:", error);
                            // Extract and display error message
                            setErrorMessage(error?.message || "An unknown error occurred.");
                        }
                    }}
                >
                    Claim Farmer
                </Web3Button>

                {/* Display error or success messages */}
                {errorMessage && (
                    <Text color="red.500" mt={4}>
                        {errorMessage}
                    </Text>
                )}
                {successMessage && (
                    <Text color="green.500" mt={4}>
                        {successMessage}
                    </Text>
                )}
            </Flex>
        </Container>
    );
}