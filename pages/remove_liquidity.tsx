// swap.tsx
import { FC } from 'react';
import { Center, Box, Heading, Flex } from "@chakra-ui/react";
import type { NextPage } from "next";
import Head from "next/head";
import { AppBar } from "../components/AppBar";
import { SwapToken } from "../components/Swap";
import { WithdrawSingleTokenType } from "../components/Withdraw"
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
                backgroundColor="gray.900"
            >

                {/* Horizontal Form Container */}
                <Flex
                    bg="gray.800"
                    p={8}
                    borderRadius="lg"
                    boxShadow="lg"
                    justify="center"
                    width="100%"
                    height="50%"
                    flexWrap="wrap"
                >
                    {/* Centered Airdrop Form Component */}
                    <Box width="100%" maxW="600px" p={2} boxShadow="0px 4px 12px rgba(0, 0, 0, 0.2)"> {/* Adjusted width and max-width */}
                        <WithdrawSingleTokenType />
                    </Box>
                </Flex>
            </Flex>
        </div>
    );
};

export default SwapPage;