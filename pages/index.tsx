import { Center, Box, Heading, Flex } from "@chakra-ui/react";
import type { NextPage } from "next";
import Head from "next/head";
import { AppBar } from "../components/AppBar";
import { Airdrop } from "../components/AirdropForm";
import styles from "../styles/Home.module.css";

const Home: NextPage = () => {
    return (
        <div className={styles.App}>
            <Head>
                <title>Holis Airdrop</title>
            </Head>

            {/* Navigation Bar */}
            <AppBar />

            {/* Main Content Area */}

            <Flex
                direction="column"
                align="center"
                justify="center"
                minHeight="100vh" // Full viewport height to avoid gaps
                padding={8}
                backgroundColor="gray.800"
            >
                {/* Full Width Dark Box */}
                <Flex
                    bg="gray.900"
                    p={8}
                    borderRadius="lg"
                    boxShadow="lg"
                    justifyContent="center"
                    alignItems="center"
                    width="auto" // Full width
                    minHeight="auto" // Ensure the dark box stretches vertically to almost full viewport height
                    flexWrap="wrap"
                >
                    <Flex
                        direction="row"
                        align="center"
                        justify="center"
                        minHeight="auto" // Full viewport height to avoid gaps
                        padding={8}>
                        {/* Centered Airdrop Form Component */}
                        <Box> {/* Keep the Airdrop form centered */}
                            <Airdrop />
                        </Box>
                    </Flex>
                </Flex>
            </Flex>
        </div>
    );
};

export default Home;

