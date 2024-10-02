import { Box, Button, Flex, Text } from "@chakra-ui/react";
import { FC } from "react";
import Head from "next/head";
import { AppBar } from "../components/AppBar";
import styles from "../styles/Home.module.css";
import { useRouter } from "next/router";

const LiquidityPage: FC = () => {
    const router = useRouter();

    const handleNavigation = (path: string) => {
        router.push(path);  // This will navigate to the new page
    };
    return (
        <div className={styles.App}>
            <Head>
                <title>Holis Liquidity</title>
            </Head>

            {/* Navigation Bar */}
            <AppBar />

            {/* Main Content Area */}
            <Flex direction="column"
                justify="center"
                minHeight="calc(100vh - 80px)"
                padding={2}
                backgroundColor="gray.800"
            >

                {/* Add Liquidity Button */}
                <Flex  direction="row" justifyContent="space-between" align="center" position="relative" p={4} marginTop="10">
                <Text></Text>
                <Text></Text>
                <Text></Text>
                <Text></Text>
                <Text></Text>
                <Text></Text>
                <Text></Text>
                <Text></Text>
                <Text></Text>
                <Text></Text>
                <Text></Text>
                <Text></Text>
                <Text></Text>
                <Text></Text>
                <Text></Text>
                <Text></Text>
                <Text></Text>
                <Text></Text>
                <Text></Text>
                <Text></Text>
                <Text></Text>
                    <Button
                        onClick={() => handleNavigation("/remove_liquidity")}
                        bgGradient="linear(to-r, purple.400, orange.400)"
                        color="gray.800"
                        fontSize="m" // Adjusting font size to make the button smaller
                        p={6} // Adjusting padding to make the button smaller
                    >
                        Remove Liquidity
                    </Button>
                    <Button
                        onClick={() => handleNavigation("/add_liquidity")}
                        bgGradient="linear(to-r, purple.400, orange.400)"
                        color="gray.800"
                        fontSize="m" // Adjusting font size to make the button smaller
                        p={6} // Adjusting padding to make the button smaller
                    >
                        Add Liquidity
                    </Button>
                    <Text></Text>
                </Flex>

                <Flex
                    direction="row"
                    justify="center"
                    minHeight="calc(100vh - 80px)"
                    backgroundColor="gray.800"
                >
                    {/* Pool Stats */}
                    <Box
                        bg="gray.900"
                        p={6}
                        color="white"
                        borderRadius="lg"
                        boxShadow="lg"
                        flex="1"
                        maxWidth="30%"
                        m={4}
                    >
                        <Text fontSize="xl" fontWeight="bold" mb={2} color="white">
                            Pool Stats
                        </Text>
                        <Text fontSize="lg">TVL: $157,960,337</Text>
                        <Text fontSize="lg">APR for LPs: 3.67%</Text>
                        <Text fontSize="lg">Fees (24h): $26.47k</Text>
                        <Text fontSize="lg">Weekly Incentives: $0.00</Text>
                    </Box>

                    {/* Liquidity Overview */}
                    <Box
                        bg="gray.900"
                        p={6}
                        borderRadius="lg"
                        boxShadow="lg"
                        flex="2"
                        m={4}
                        maxWidth="60%"
                    >
                        <Text fontSize="xl" fontWeight="bold" mb={2} color="white">
                            Liquidity Overview
                        </Text>
                        {/* Replace this with an actual chart component */}
                        <Box height="300px" bg="gray.800" p={4} borderRadius="lg" color="white">
                            Graph Placeholder
                        </Box>
                    </Box>
                </Flex>


            </Flex>
        </div>
    );
};

export default LiquidityPage;