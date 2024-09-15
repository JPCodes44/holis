import {
    Box,
    Select,
    Button,
    FormControl,
    FormLabel,
    NumberInput,
    NumberInputField,
    IconButton,
    Text,
    Flex,
    Input,
    useToast,
    Link,
} from "@chakra-ui/react";
import { FC, useState, useEffect } from "react";
import { ArrowDownIcon } from "@chakra-ui/icons"; // For the arrow button
import * as Web3 from "@solana/web3.js";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import {
    kryptMint,
    ScroogeCoinMint,
    tokenSwapStateAccount,
    swapAuthority,
    poolKryptAccount,
    poolScroogeAccount,
    poolMint,
    feeAccount,
} from "../utils/constants";
import { TokenSwap, TOKEN_SWAP_PROGRAM_ID } from "@solana/spl-token-swap";
import * as token from "@solana/spl-token";
import { TOKEN_PROGRAM_ID } from "@solana/spl-token";

export const SwapToken: FC = () => {
    const [amount, setAmount] = useState(0);
    const [fromToken, setFromToken] = useState("option1"); // State for "From" token
    const [toToken, setToToken] = useState("option2"); // State for "To" token
    const [kryptMintInfo, setKryptMintInfo] = useState<any>(null);
    const [scroogeCoinMintInfo, setScroogeCoinMintInfo] = useState<any>(null);

    const { connection } = useConnection();
    const { publicKey, sendTransaction } = useWallet();

    // Fetch mint information when the component mounts
    useEffect(() => {
        const fetchMintInfo = async () => {
            const kryptInfo = await token.getMint(connection, kryptMint);
            const scroogeInfo = await token.getMint(connection, ScroogeCoinMint);
            setKryptMintInfo(kryptInfo);
            setScroogeCoinMintInfo(scroogeInfo);
        };

        fetchMintInfo();
    }, [connection]);



    // Handle swapping the tokens when the arrow is clicked
    const handleTokenSwap = () => {
        const tempToken = fromToken;
        setFromToken(toToken);
        setToToken(tempToken);
    };

    const handleSwapSubmit = (event: any) => {
        event.preventDefault();
        handleTransactionSubmit();
    };

    const toast = useToast(); // Initialize Chakra UI's toast
    

    const handleTransactionSubmit = async () => {
        if (!publicKey) {
            alert("Please connect your wallet!");
            return;
        }

        const kryptATA = await token.getAssociatedTokenAddress(kryptMint, publicKey);
        const scroogeATA = await token.getAssociatedTokenAddress(ScroogeCoinMint, publicKey);
        const tokenAccountPool = await token.getAssociatedTokenAddress(poolMint, publicKey);

        const transaction = new Web3.Transaction();

        let account = await connection.getAccountInfo(tokenAccountPool);

        if (account == null) {
            const createATAInstruction =
                token.createAssociatedTokenAccountInstruction(
                    publicKey,
                    tokenAccountPool,
                    publicKey,
                    poolMint
                );
            transaction.add(createATAInstruction);
        }

        if (fromToken === "option1" && toToken === "option2" && kryptMintInfo) {
            const instruction = TokenSwap.swapInstruction(
                tokenSwapStateAccount,
                swapAuthority,
                publicKey,
                kryptATA,
                poolKryptAccount,
                poolScroogeAccount,
                scroogeATA,
                poolMint,
                feeAccount,
                null,
                TOKEN_SWAP_PROGRAM_ID,
                TOKEN_PROGRAM_ID,
                amount * 10 ** kryptMintInfo.decimals,
                0
            );
            transaction.add(instruction);
        } else if (fromToken === "option2" && toToken === "option1" && scroogeCoinMintInfo) {
            const instruction = TokenSwap.swapInstruction(
                tokenSwapStateAccount,
                swapAuthority,
                publicKey,
                scroogeATA,
                poolScroogeAccount,
                poolKryptAccount,
                kryptATA,
                poolMint,
                feeAccount,
                null,
                TOKEN_SWAP_PROGRAM_ID,
                TOKEN_PROGRAM_ID,
                amount * 10 ** scroogeCoinMintInfo.decimals,
                0
            );
            transaction.add(instruction);
        } else {
            // Display a toast notification with a clickable link
            toast({
                title: "Invalid swap destination.",
                description: ("Swap to another coin."),
                status: "error",
                duration: 9000, // How long the toast will be visible
                isClosable: true,
                position: "bottom-right", // Displays at the bottom right
            });
            return
        }

        // Get recent blockhash
        const blockhashResponse = await connection.getLatestBlockhashAndContext();
        transaction.recentBlockhash = blockhashResponse.value.blockhash;
        transaction.feePayer = publicKey; // Fee payer is the wallet's public key

        try {
            const signature = await sendTransaction(transaction, connection);
            await connection.confirmTransaction(signature, 'confirmed');

            const txLink = `https://explorer.solana.com/tx/${signature}?cluster=devnet`;

            // Display a toast notification with a clickable link
            toast({
                title: "Transaction complete!",
                description: (
                    <Link href={txLink} isExternal color="white">
                        View transaction on Solana Explorer.
                    </Link>
                ),
                status: "success",
                duration: 9000, // How long the toast will be visible
                isClosable: true,
                position: "bottom-right", // Displays at the bottom right
            });

        } catch (e) {
            toast({
                title: "Transaction failed.",
                description: `${e}`,
                status: "error",
                duration: 9000,
                isClosable: true,
                position: "bottom-right",
            });
        }
    };

    return (
        <Box
            p={6}
            display={{ md: "flex" }}
            flexDirection="column"
            maxWidth="32rem"
            margin="auto"
            justifyContent="center"
            border="1px solid #2D3748"
            borderRadius="lg"
            bg="gray.900"
            boxShadow="lg"
        >
            <form onSubmit={handleSwapSubmit}>
                {/* From Section */}
                <Box mb={4} p={4} bg="gray.800" borderRadius="md" boxShadow="md" position="relative">
                    <FormControl>
                        <Text fontWeight="bold" color="gray.200">From</Text>
                        <Flex alignItems="center" justifyContent="space-between" mt={2}>
                            <Select
                                value={fromToken} // Link to the state
                                onChange={(e) => setFromToken(e.target.value)} // Update "From" token
                                color="white"
                                bg="gray.900"
                                width="30%"
                                borderRadius="md"
                                boxShadow="md"
                                border="none"
                            >
                                <option value="option1" style={{ color: "#282c34" }}>HOLIS</option>
                                <option value="option2" style={{ color: "#282c34" }}>OPSY</option>
                            </Select>

                            <Box position="relative" width="40%" textAlign="right">
                                <Input
                                    value={amount}
                                    onChange={(e) => setAmount(parseFloat(e.target.value) || 0)}
                                    placeholder="0.0"
                                    color="white"
                                    bg="transparent"
                                    border="none"
                                    fontSize="3xl"
                                    textAlign="right"
                                    focusBorderColor="none"
                                />
                                <Text fontSize="sm" color="gray.500" mt={1} position="absolute" right="0" top="100%">
                                    ~${amount * 128} {/* You can replace the logic with actual price data */}
                                </Text>
                            </Box>
                        </Flex>
                    </FormControl>
                </Box>

                {/* Arrow Button */}
                <Flex justifyContent="center" mb={4}>
                    <IconButton
                        aria-label="swap"
                        icon={<ArrowDownIcon />}
                        borderRadius="full"
                        size="lg"
                        colorScheme="blue"
                        bg="blue.600"
                        onClick={handleTokenSwap} // Handle token swapping
                    />
                </Flex>

                {/* To Section */}
                <Box mb={4} p={4} bg="gray.800" borderRadius="md" boxShadow="md" position="relative">
                    <FormControl>
                        <Text fontWeight="bold" color="gray.200">To</Text>
                        <Flex alignItems="center" justifyContent="space-between" mt={2}>
                            <Select
                                value={toToken} // Link to the state
                                onChange={(e) => setToToken(e.target.value)} // Update "To" token
                                color="white"
                                bg="gray.900"
                                width="30%"
                                borderRadius="md"
                                boxShadow="md"
                                border="none"
                            >
                                <option value="option1" style={{ color: "#282c34" }}>HOLIS</option>
                                <option value="option2" style={{ color: "#282c34" }}>OPSY</option>
                            </Select>

                            <Box position="relative" width="40%" textAlign="right">
                                <Text
                                    fontSize="3xl"
                                    color="white"
                                    textAlign="right"
                                >
                                    {amount}
                                </Text>
                                <Text fontSize="sm" color="gray.500" mt={1} position="absolute" right="0" top="100%">
                                    ~${amount * 128} {/* You can replace the logic with actual price data */}
                                </Text>
                            </Box>
                        </Flex>
                    </FormControl>
                </Box>

                <Button
                    type="submit"
                    width="full"
                    colorScheme="cyan"
                    bg="cyan.500"
                    mt={4}
                    _hover={{ bg: "cyan.600" }}
                    boxShadow="lg"
                >
                    Swap
                </Button>
            </form>
        </Box>
    );
};