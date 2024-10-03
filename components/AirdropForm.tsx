import {
    Box,
    Button,
    FormControl,
    FormLabel,
    NumberInput,
    NumberInputField,
    Heading,
    Text,
    Stack,
    Grid,
    useToast,
    Link,
} from "@chakra-ui/react";
import { FC, useState } from "react";
import * as Web3 from "@solana/web3.js";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { AirdropSchema } from "../models/Airdrop";
import {
    kryptMint,
    ScroogeCoinMint,
    airdropPDA,
    airdropProgramId,
    tokenSwapStateAccount,
    poolMint,
} from "../utils/constants";
import * as token from "@solana/spl-token";
import { TOKEN_SWAP_PROGRAM_ID } from "@solana/spl-token-swap";

export const Airdrop: FC = () => {
    const [amount, setAmount] = useState(0)

    const { connection } = useConnection();
    const { publicKey, sendTransaction } = useWallet()

    const getSwapAuthority = async () => {
        const [swap, bump] = await Web3.PublicKey.findProgramAddress(
            [tokenSwapStateAccount.toBuffer()],
            TOKEN_SWAP_PROGRAM_ID,
        );
        alert(swap);
    };

    const getFeeAccount = async () => {
        const feeOwner = new Web3.PublicKey('HfoTxFR1Tm6kGmWgYWD6J7YHVy1UwqSULUGVLXkJqaKN');

        let tokenFeeAccountAddress = await token.getAssociatedTokenAddress(
            poolMint, // mint
            feeOwner, // owner
            true // allow owner off curve
        );

        alert(tokenFeeAccountAddress);
    };

    const handleKryptSubmit = (event: any) => {
        event.preventDefault()
        const airdrop = new AirdropSchema(amount)
        handleKryptTransactionSubmit(airdrop)
    }

    const toast = useToast(); // Initialize Chakra UI's toast

    const handleKryptTransactionSubmit = async (airdrop: AirdropSchema) => {
        if (!publicKey) {
            alert("Please connect your wallet!")
            return
        }
        const transaction = new Web3.Transaction()

        const userATA = await token.getAssociatedTokenAddress(
            kryptMint,
            publicKey
        )
        let account = await connection.getAccountInfo(userATA)

        if (account == null) {
            const createATAIX =
                await token.createAssociatedTokenAccountInstruction(
                    publicKey,
                    userATA,
                    publicKey,
                    kryptMint
                )
            transaction.add(createATAIX)
        }

        const buffer = airdrop.serialize()

        const airdropIX = new Web3.TransactionInstruction({
            keys: [
                {
                    pubkey: publicKey,
                    isSigner: true,
                    isWritable: true,
                },
                {
                    pubkey: userATA,
                    isSigner: false,
                    isWritable: true,
                },
                {
                    pubkey: kryptMint,
                    isSigner: false,
                    isWritable: true,
                },
                {
                    pubkey: airdropPDA,
                    isSigner: false,
                    isWritable: false,
                },
                {
                    pubkey: token.TOKEN_PROGRAM_ID,
                    isSigner: false,
                    isWritable: false,
                },
            ],
            data: buffer,
            programId: airdropProgramId,
        })

        transaction.add(airdropIX)

        // Get recent blockhash
        const blockhashResponse = await connection.getLatestBlockhashAndContext();
        transaction.recentBlockhash = blockhashResponse.value.blockhash;
        transaction.feePayer = publicKey; // Fee payer is the wallet's public key

        try {
            getSwapAuthority();
            getFeeAccount();
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

    }

    const handleScroogeSubmit = (event: any) => {
        event.preventDefault()
        const airdrop = new AirdropSchema(amount)
        handleScroogeTransactionSubmit(airdrop)
    }

    const handleScroogeTransactionSubmit = async (airdrop: AirdropSchema) => {
        if (!publicKey) {
            alert("Please connect your wallet!")
            return
        }
        const transaction = new Web3.Transaction()

        const userATA = await token.getAssociatedTokenAddress(
            ScroogeCoinMint,
            publicKey
        )
        let account = await connection.getAccountInfo(userATA)

        if (account == null) {
            const createATAIX =
                await token.createAssociatedTokenAccountInstruction(
                    publicKey,
                    userATA,
                    publicKey,
                    ScroogeCoinMint
                )
            transaction.add(createATAIX)
        }

        const buffer = airdrop.serialize()

        const airdropIX = new Web3.TransactionInstruction({
            keys: [
                {
                    pubkey: publicKey,
                    isSigner: true,
                    isWritable: true,
                },
                {
                    pubkey: userATA,
                    isSigner: false,
                    isWritable: true,
                },
                {
                    pubkey: ScroogeCoinMint,
                    isSigner: false,
                    isWritable: true,
                },
                {
                    pubkey: airdropPDA,
                    isSigner: false,
                    isWritable: false,
                },
                {
                    pubkey: token.TOKEN_PROGRAM_ID,
                    isSigner: false,
                    isWritable: false,
                },
            ],
            data: buffer,
            programId: airdropProgramId,
        })

        transaction.add(airdropIX)

        // Get recent blockhash
        const blockhashResponse = await connection.getLatestBlockhashAndContext();
        transaction.recentBlockhash = blockhashResponse.value.blockhash;
        transaction.feePayer = publicKey; // Fee payer is the wallet's public key

        try {
            const signature = await sendTransaction(transaction, connection);
            await connection.confirmTransaction(signature, 'confirmed');

            const txLink = `https://explorer.solana.com/tx/${signature}?cluster=devnet`;

            // Display a toast notification with a clickable link
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
    }

    return (
        <Box
            p={{ base: 4, md: 6 }}       // Responsive padding for smaller and larger screens
            maxWidth="800px"
            bg="gray.800"
            borderRadius="md"
            boxShadow="lg"
        >
            {/* Airdrop Title */}
            <Heading fontSize={{ base: "md", md: "lg" }} color="white" mb={4} textAlign="center">
                Holis & Opsy Airdrop
            </Heading>

            <Text color="gray.400" mb={6} textAlign="center">
                Participate in the airdrop of Holis and Opsy tokens. Input the number of tokens you want to claim, and click the respective button to start the transaction.
            </Text>

            {/* Displaying stats */}
            <Grid templateColumns={{ base: "1fr", md: "repeat(2, 1fr)" }} gap={6} mb={6}>
                <Box bg="gray.700" p={4} borderRadius="md" textAlign="center">
                    <Text color="gray.400">Total Transactions</Text>
                    <Text fontSize={{ base: "xl", md: "2xl" }} color="white">236</Text>
                </Box>
                <Box bg="gray.700" p={4} borderRadius="md" textAlign="center">
                    <Text color="gray.400">Volume</Text>
                    <Text fontSize={{ base: "lg", md: "2xl" }} color="white">$535.19k</Text>
                </Box>
            </Grid>

            {/* Airdrop Forms */}
            <Stack direction={{ base: "column", md: "row" }} spacing={6}>
                <Box bg="gray.700" p={4} borderRadius="md" flex={1}>
                    <form onSubmit={handleKryptSubmit}>
                        <FormControl>
                            <FormLabel color="gray.200">Holis</FormLabel>
                            <NumberInput
                                max={10000}
                                min={1}
                                onChange={(valueString) => setAmount(parseInt(valueString, 10))}
                            >
                                <NumberInputField id="amount" color="gray.400" />
                            </NumberInput>
                        </FormControl>
                        <Button width="full" mt={4} colorScheme="blue" type="submit">
                            Airdrop Holis
                        </Button>
                    </form>
                </Box>

                <Box bg="gray.700" p={4} borderRadius="md" flex={1}>
                    <form onSubmit={handleScroogeSubmit}>
                        <FormControl>
                            <FormLabel color="gray.200">Opsy</FormLabel>
                            <NumberInput
                                max={1000}
                                min={1}
                                onChange={(valueString) => setAmount(parseInt(valueString))}
                            >
                                <NumberInputField id="amount" color="gray.400" />
                            </NumberInput>
                        </FormControl>
                        <Button width="full" mt={4} colorScheme="green" type="submit">
                            Airdrop Opsy
                        </Button>
                    </form>
                </Box>
            </Stack>
        </Box>
    );
}
