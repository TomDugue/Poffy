import { ChakraProvider } from "@chakra-ui/react";
import type { AppProps } from "next/app";
import Head from "next/head";
import { chakraTheme } from "../common/chakra-theme";
import { SpotifyClientProvider } from "../hooks/spotify-client";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <title>Spotify Clone App</title>
        <meta name="description" content="Your spotify blind test app." />
        <meta property="og:description" content="Your spotify blind test app." />
        <meta property="og:title" content="Poffy" />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="Poffy" />
      </Head>
      <ChakraProvider theme={chakraTheme}>
        <SpotifyClientProvider>
          <Component {...pageProps} />
        </SpotifyClientProvider>
      </ChakraProvider>
    </>
  );
}

export default MyApp;
