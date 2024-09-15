import {
    Box,
    Button,
    FormControl,
    FormLabel,
    NumberInput,
    NumberInputField,
    Text,
    Flex,
    Divider,
    useToast,
    Link
} from "@chakra-ui/react"
import { FC, useEffect, useState } from "react"
import * as Web3 from "@solana/web3.js"
import { useConnection, useWallet } from "@solana/wallet-adapter-react"
import {
    kryptMint,
    ScroogeCoinMint,
    tokenSwapStateAccount,
    swapAuthority,
    poolKryptAccount,
    poolScroogeAccount,
    poolMint,
    feeAccount,
    poolBalance,
} from "../utils/constants"
import { TokenSwap, TOKEN_SWAP_PROGRAM_ID } from "@solana/spl-token-swap"
import * as token from "@solana/spl-token"
import { TOKEN_PROGRAM_ID } from "@solana/spl-token"

export const WithdrawSingleTokenType: FC = (props: {
    onInputChange?: (val: number) => void
    onMintChange?: (account: string) => void
}) => {
    const [poolTokenAmount, setAmount] = useState(0)
    const [walletBalance, setWalletBalance] = useState(0); // State to store the wallet balance
    const [colorState, setColorState] = useState("red");
    const { connection } = useConnection()
    const { publicKey, sendTransaction } = useWallet()

    const handleWithdrawSubmit = (event: any) => {
        event.preventDefault()
        handleTransactionSubmit()
    }

    const fetchPoolBalance = async () => {
        if (publicKey) {
            try {
                let balance = await connection.getTokenAccountBalance(poolBalance);
                setWalletBalance(Number(balance.value.amount) / 100);
                if (walletBalance / 100 == 0) {
                    setColorState("red")
                } else {
                    setColorState("green")
                }
            } catch (error) {
                console.error("Failed to fetch balance:", error);
            }
        }
    };

    fetchPoolBalance();

    const toast = useToast(); // Initialize Chakra UI's toast

    const handleTransactionSubmit = async () => {
        if (!publicKey) {
            alert("Please connect your wallet!")
            return
        }

        const poolMintInfo = await token.getMint(connection, poolMint)

        const kryptATA = await token.getAssociatedTokenAddress(
            kryptMint,
            publicKey
        )
        const scroogeATA = await token.getAssociatedTokenAddress(
            ScroogeCoinMint,
            publicKey
        )
        const tokenAccountPool = await token.getAssociatedTokenAddress(
            poolMint,
            publicKey
        )

        const transaction = new Web3.Transaction()

        let account = await connection.getAccountInfo(tokenAccountPool)

        if (account == null) {
            const createATAInstruction =
                token.createAssociatedTokenAccountInstruction(
                    publicKey,
                    tokenAccountPool,
                    publicKey,
                    poolMint
                )
            transaction.add(createATAInstruction)
        }

        const instruction = TokenSwap.withdrawAllTokenTypesInstruction(
            tokenSwapStateAccount,
            swapAuthority,
            publicKey,
            poolMint,
            feeAccount,
            tokenAccountPool,
            poolKryptAccount,
            poolScroogeAccount,
            kryptATA,
            scroogeATA,
            TOKEN_SWAP_PROGRAM_ID,
            TOKEN_PROGRAM_ID,
            poolTokenAmount * 10 ** poolMintInfo.decimals,
            0,
            0
        )

        transaction.add(instruction)
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

            fetchPoolBalance();
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
        <Flex
            direction="column"
            align="left"
            bg="gray.800"
            p={6}
            borderRadius="lg"
            boxShadow="lg"
            width="100%"
            maxWidth="600px"
            margin="0 auto"
        >
            {/* Top Row with Title */}
            <Text fontSize="2xl" fontWeight="bold" color="gray.100" mb={4}>
                Remove liquidity
            </Text>

            {/* Pool Tokens and Input */}
            <FormControl mb={4}>
                <FormLabel color="gray.400" fontSize="sm">Available pool tokens</FormLabel>
                <Text color={colorState} fontWeight="bold">
                    {walletBalance} Tokens {/* Display wallet balance here */}
                </Text>
            </FormControl>

            <Box border="1px solid grey" borderRadius="lg" p={4} mb={4} width="100%">
                <Text color="gray.100" fontSize="lg" mb={2}>
                    holOPS <Text as="span" color="gray.400">20%</Text>
                </Text>

                {/* Borderless Input for Amount */}
                <NumberInput
                    onChange={(valueString) => setAmount(parseInt(valueString) || 0)}
                    value={poolTokenAmount}
                    focusBorderColor="transparent" // Removes the border on focus
                >
                    <NumberInputField
                        id="amount"
                        placeholder="$" // Placeholder for input
                        color="gray.200"
                        border="none" // Removes input border
                        _focus={{ border: "none" }} // Keeps border off when focused
                    />
                </NumberInput>

            </Box>

            {/* Price Impact and Pool Share Details */}
            <Box bg="gray.800" p={4} borderRadius="lg" mb={4} width="100%">
                <Flex justify="space-between">
                    <Text color="gray.400">Price impact</Text>
                    <Text color="gray.200">0.40%</Text>
                </Flex>
                <Flex justify="space-between">
                    <Text color="gray.400">Max slippage</Text>
                    <Text color="gray.200">0.50%</Text>
                </Flex>
                <Flex justify="space-between">
                    <Text color="gray.400">Share of pool</Text>
                    <Text color="gray.200">0% → &lt;0.01%</Text>
                </Flex>
            </Box>

            <Divider borderColor="gray.600" mb={4} />

            {/* Total */}
            <Flex justify="space-between" width="100%" mb={4}>
                <Box>
                    <Text color="gray.400" fontSize="sm">Total</Text>
                    <Text color="gray.100" fontSize="xl">$5,677.11</Text>
                </Box>
                <Box>
                    <Text color="gray.400" fontSize="sm">Potential weekly yield</Text>
                    <Text color="orange.400" fontSize="xl">$5.14</Text>
                </Box>
            </Flex>

            {/* Form wrapper added */}
            <form
                onSubmit={handleWithdrawSubmit}
                style={{ width: '100%' }} // Force the form to take full width
            >
                {/* Submit Button */}
                <Button
                    width="100%"  // Ensure the button takes 100% of the form's width
                    mt={4}
                    bgGradient="linear(to-r, orange.400, pink.400)"
                    color="white"
                    _hover={{ bgGradient: "linear(to-l, orange.400, pink.400)" }}
                    type="submit"
                >
                    Remove Liquidity
                </Button>
            </form>
        </Flex>
    );
}
