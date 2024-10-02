import { FC } from "react";
import { Flex, Box, Spacer } from "@chakra-ui/react";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import Image from "next/image";
import { useRouter } from "next/router";

export const AppBar: FC = () => {
    const router = useRouter();

    const handleNavigation = (path: string) => {
        router.push(path);  // This will navigate to the new page
    };

    return (
        <Box>
            <Flex
                as="nav"
                bg="black"
                padding="1rem"
                alignItems="center"
                justifyContent="space-between"
            >
                {/* Left section: Logo */}
                <Flex align="center">
                    <Image
                        alt="Solana logo"
                        src="/solanaLogo.png"
                        height={30}
                        width={200}
                    />
                </Flex>

                <Spacer />

                {/* Center: Token Swap text */}
                <Flex align="center" color="white">
                    <Box
                        onClick={() => handleNavigation("/")}  // Link to the new Swap page
                        cursor="pointer"
                        color="white"
                        transition="all 0.3s ease"
                        _hover={{
                            color: "white",
                            transform: "scale(0.9)",
                        }}
                        px={3}
                        py={1}
                        borderRadius="md"
                        fontSize="2xl"
                        fontWeight="bold"
                        ml={`100px`}
                    >
                        Holis
                    </Box>
                </Flex>

                <Spacer />

                {/* Right section: Navigation and Wallet button */}
                <Flex align="center" gap={6}>
                    <Box
                        onClick={() => handleNavigation("/swap")}  // Link to the new Swap page
                        cursor="pointer"
                        color="white"
                        transition="all 0.3s ease"
                        _hover={{
                            transform: "scale(0.9)",
                        }}
                        px={3}
                        py={1}
                        borderRadius="md"
                    >
                        Swap
                    </Box>
                    <Box
                        onClick={() => handleNavigation("/liquidity")}  // Link to portfolio
                        cursor="pointer"
                        color="white"
                        transition="all 0.3s ease"
                        _hover={{
                            transform: "scale(0.9)",
                        }}
                        px={3}
                        py={1}
                        borderRadius="md"
                    >
                        Liquidity
                    </Box>
                    <WalletMultiButton />
                </Flex>
            </Flex>
        </Box>
    );
};