// swap.tsx
import { FC } from 'react';
import { Center, Box, Heading, Flex } from "@chakra-ui/react";
import type { NextPage } from "next";
import Head from "next/head";
import { AppBar } from "../components/AppBar";
import { SwapToken } from "../components/Swap";
import styles from "../styles/Home.module.css";

const SwapPage: FC = () => {
    return (
        <div className={styles.App}>
            <Head>
                <title>Holis Swap</title>
            </Head>

            {/* Navigation Bar */}
            <AppBar />

            {/* Main Content Area */}
            <Flex
                direction="column"
                align="center"
                justify="center"
                minHeight="calc(100vh - 80px)" // Leaving space for the AppBar
                padding={8}
                backgroundColor="gray.800"
            >

                {/* Horizontal Form Container */}
                <Flex
                    bg="gray.900"
                    p={8}
                    borderRadius="lg"
                    boxShadow="lg"
                    justify="center"
                    width="100%"
                    maxW="1200px" // Width for larger screen sizes
                    flexWrap="wrap"
                >
                    {/* Centered Airdrop Form Component */}
                    <Box width="100%" maxW="600px" p={2}> {/* Adjusted width and max-width */}
                       <SwapToken/>
                    </Box>
                </Flex>
            </Flex>
        </div>
    );
};

export default SwapPage;