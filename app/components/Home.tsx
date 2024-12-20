import { useAddress, useContract, useContractRead, useOwnedNFTs, MediaRenderer } from "@thirdweb-dev/react";
import { FARMER_ADDRESS, REWARDS_ADDRESS, STAKING_ADDRESS, TOOLS_ADDRESS } from "../const/addresses";
import { ClaimFarmer } from "./ClaimFarmer";
import { Inventory } from "./Inventory";
import { Equipped } from "./Equipped";
import { BigNumber, ethers } from "ethers";
import { Text, Box, Card, Container, SimpleGrid, Skeleton, Spinner, Heading, Flex } from "@chakra-ui/react";
import Login from "./Login";

const Home = () => {
  const address = useAddress();

  const { contract: farmercontract } = useContract(FARMER_ADDRESS);
  const { contract: toolsContract } = useContract(TOOLS_ADDRESS);
  const { contract: stakingContract } = useContract(STAKING_ADDRESS);
  const { contract: rewardContract } = useContract(REWARDS_ADDRESS);

  const { data: ownedFarmers, isLoading: loadingOwnedFarmers } = useOwnedNFTs(farmercontract, address);
  const { data: ownedTools, isLoading: loadingOwnedTools } = useOwnedNFTs(toolsContract, address);

  const { data: equippedTools } = useContractRead(stakingContract, "getStakeInfo", address ? [address] : []);
  const { data: rewardBalance } = useContractRead(rewardContract, "balanceOf", address ? [address] : []);

  if (!address) {
    return <Login />;
  }

  if (loadingOwnedFarmers) {
    return (
      <Container maxW={"1200px"}>
        <Flex h={"100vh"} justifyContent={"center"} alignItems={"center"}>
          <Spinner />
        </Flex>
      </Container>
    );
  }

  if (ownedFarmers?.length === 0) {
    return (
      <Container maxW={"1200px"}>
        <ClaimFarmer />
      </Container>
    );
  }

  return (
    <Container maxW={"1200px"}>
      <SimpleGrid columns={2} spacing={10}>
        <Card p={5}>
          <Heading>Farmer:</Heading>
          <SimpleGrid columns={2} spacing={10}>
            <Box>
              {ownedFarmers?.map((nft) => (
                <div key={nft.metadata.id}>
                  <MediaRenderer 
                    src={nft.metadata.image} 
                    height="100%"
                    width="100%"
                  />
                </div>
              ))}
            </Box>
            <Box>
              <Text fontSize={"small"} fontWeight={"bold"}>$CARROT Balance:</Text>
              {rewardBalance && (
                <p>{ethers.utils.formatUnits(rewardBalance, 18)}</p>
              )}
            </Box>
          </SimpleGrid>
        </Card>
        <Card p={5}>
          <Heading>Inventory:</Heading>
          <Skeleton isLoaded={!loadingOwnedTools}>
            <Inventory
              nft={ownedTools}
            />     
          </Skeleton>
        </Card>
      </SimpleGrid>
      <Card p={5} my={10}>
        <Heading mb={"30px"}>Equipped Tools:</Heading>
        <SimpleGrid columns={3} spacing={10}>
          {equippedTools &&
            equippedTools[0].map((nft: BigNumber) => (
              <Equipped
                key={nft.toNumber()}
                tokenId={nft.toNumber()}
              />
            ))}
        </SimpleGrid>
      </Card>
    </Container>
  );
};

export default Home;
