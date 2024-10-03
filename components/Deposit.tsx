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
} from "@chakra-ui/react";
import { FC, useState, } from "react";
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
    poolBalance,
    scroogeUserAccount,
    kryptUserAccount,
} from "../utils/constants";
import { TokenSwap, TOKEN_SWAP_PROGRAM_ID } from "@solana/spl-token-swap";
import * as token from "@solana/spl-token";

export const DepositSingleTokenType: FC = (props: {
    onInputChange?: (val: number) => void;
    onMintChange?: (account: string) => void;
}) => {
    const [poolTokenAmount, setAmount] = useState(0);
    const [poolWalletBalance, setPoolWalletBalance] = useState(0); // State to store the wallet balance
    const [walletScroogeBalance, setScroogeWalletBalance] = useState(0); // State to store the wallet balance
    const [walletKryptBalance, setKryptWalletBalance] = useState(0); // State to store the wallet balance
    const [colorScroogeState, setScroogeColorState] = useState("red");
    const [colorKryptState, setKryptColorState] = useState("red");

    const { connection } = useConnection();
    const { publicKey, sendTransaction } = useWallet();

    let expectedAmountA = 0;
    let expectedAmountB = 0;

    // useEffect to fetch wallet balance when the component mounts or when the public key changes
    const fetchPoolBalance = async () => {
        if (publicKey) {
            try {
                let balance = await connection.getTokenAccountBalance(poolBalance);
                setPoolWalletBalance(Number(balance.value.amount) / 100);
                let scroogeBalance = await connection.getTokenAccountBalance(scroogeUserAccount);
                setScroogeWalletBalance(Number(scroogeBalance.value.amount) / 10 ** 9);
                let kryptBalance = await connection.getTokenAccountBalance(kryptUserAccount);
                setKryptWalletBalance(Number(kryptBalance.value.amount) / 10 ** 9);

                if (walletScroogeBalance == 0) {
                    setScroogeColorState("red")
                } else {
                    setScroogeColorState("green")
                }

                if (walletKryptBalance == 0) {
                    setKryptColorState("red")
                } else {
                    setKryptColorState("green")
                }

            } catch (error) {
                console.error("Failed to fetch balance:", error);
            }
        }
    };

    fetchPoolBalance();

    function calculate_amount(poolTokenAmount: number, poolBalance: number, walletBalance: number) {
        if (walletBalance != 0) {
            const expectedAmount = (poolTokenAmount / poolBalance) * walletBalance;
            return expectedAmount * 10 
        } else {
            return 0;
        }
    }

    expectedAmountA = calculate_amount(poolTokenAmount, poolWalletBalance, walletScroogeBalance);
    expectedAmountB = calculate_amount(poolTokenAmount, poolWalletBalance, walletKryptBalance);

    const handleSubmit = (event: any) => {
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

        const poolMintInfo = await token.getMint(connection, poolMint);

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

        const instruction = TokenSwap.depositAllTokenTypesInstruction(
            tokenSwapStateAccount,
            swapAuthority,
            publicKey,
            kryptATA,
            scroogeATA,
            poolKryptAccount,
            poolScroogeAccount,
            poolMint,
            tokenAccountPool,
            TOKEN_SWAP_PROGRAM_ID,
            token.TOKEN_PROGRAM_ID,
            poolTokenAmount * 10 ** poolMintInfo.decimals,
            100e9,
            100e9
        );

        transaction.add(instruction);

        const blockhashResponse = await connection.getLatestBlockhashAndContext();
        transaction.recentBlockhash = blockhashResponse.value.blockhash;
        transaction.feePayer = publicKey;

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
    };

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
                Add liquidity
            </Text>

            {/* Pool Tokens and Input */}
            <FormControl mb={4}>
                <FormLabel color="gray.400" fontSize="sm">Wallet Balance</FormLabel>
                <Box marginTop={2}>
                    <Text color="gray.300" fontSize={"sm"}>
                        &nbsp;&nbsp;&nbsp;&nbsp; Holis: {/* Display wallet balance here */}
                    </Text>
                    <Text color={colorScroogeState} fontWeight="bold">
                        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{walletScroogeBalance} Tokens {/* Display wallet balance here */}
                    </Text>
                </Box>
                <Box marginTop={2}>
                    <Text color="gray.300" fontSize={"sm"}>
                        &nbsp;&nbsp;&nbsp;&nbsp; Opsy: {/* Display wallet balance here */}
                    </Text>
                    <Text color={colorKryptState} fontWeight="bold">
                        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{walletKryptBalance} Tokens {/* Display wallet balance here */}
                    </Text>
                </Box>
            </FormControl>
            <Text color="gray.100" fontSize="m" mb={2} >I would like to recieve:</Text>
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
            <Text color="gray.100" fontSize="m" mb={2} >I would have to pay:</Text>
            <Box border="1px solid grey" borderRadius="lg" p={4} mb={4} width="100%">
                <Text color="gray.100" fontSize="lg" mb={2}>
                    Holis <Text as="span" color="gray.400">20%</Text>
                </Text>

                <Text color="gray.100" fontSize="m" mb={2} marginLeft={4} marginTop={5}>
                    {expectedAmountA}
                </Text>

            </Box>
            <Box border="1px solid grey" borderRadius="lg" p={4} mb={4} width="100%">
                <Text color="gray.100" fontSize="lg" mb={2}>
                    Opsy <Text as="span" color="gray.400">20%</Text>
                </Text>

                <Text color="gray.100" fontSize="m" mb={2} marginLeft={4} marginTop={5}>
                    {expectedAmountB}
                </Text>

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
                onSubmit={handleSubmit}
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
                    Add Liquidity
                </Button>
            </form>
        </Flex>
    );
}

/*
<Button 
width="full" 
mt={4} 
bgGradient="linear(to-r, orange.400, pink.400)" 
color="white"
_hover={{ bgGradient: "linear(to-l, orange.400, pink.400)" }}
type="submit" // Ensure the button is of submit type
>
Add Liquidity
</Button>
*/
