import "../styles/globals.css"
import type { AppProps } from "next/app"
import { ChakraProvider } from "@chakra-ui/react"
import WalletContextProvider from "../components/WalletContextProvider"
import { AnimatePresence, motion } from 'framer-motion';

function MyApp({ Component, pageProps, router }: AppProps) {
    return (
        <ChakraProvider>
            <WalletContextProvider>
                {/* Wrap the component in AnimatePresence */}
                <AnimatePresence exitBeforeEnter>
                    {/* Animate the page transition */}
                    <motion.div
                        key={router.route} // Unique key for each route
                        initial={{ opacity: 0, y: 0 }} // Initial state (start)
                        animate={{ opacity: 1, y: 0 }}  // Animate to state (end)
                        exit={{ opacity: 0, y: 0 }}     // Exit state (when leaving)
                        transition={{ duration: 0.3 }}  // Transition duration
                    >
                        <Component {...pageProps} />
                    </motion.div>
                </AnimatePresence>
            </WalletContextProvider>
        </ChakraProvider>
    );
}

export default MyApp;
