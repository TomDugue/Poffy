import { ChakraProvider } from "@chakra-ui/react";
import type { AppProps } from "next/app";
import Head from "next/head";
import { chakraTheme } from "../common/chakra-theme";
import { SpotifyClientProvider } from "../hooks/spotify-client";
import { SocketContext, socket } from '../lib/socket';
import { useCallback, useEffect, useState } from "react";

function MyApp(this: any, { Component, pageProps }: AppProps) {
  const [room, setRoom] = useState<any>({});

  const handleRoomUpdate = useCallback((newroom) => {
    setRoom(newroom);
    console.log("Room update: ", newroom);
  }, []);
  
  useEffect(() => {

    // subscribe to socket events
    socket.on("ROOM_UPDATE", handleRoomUpdate); 

    return () => {
      // before the component is destroyed
      // unbind all event handlers used in this component
      socket.off("ROOM_UPDATE", handleRoomUpdate);
    };
  }, [handleRoomUpdate]);


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
          <SocketContext.Provider value={{socket, room}}>
            <Component {...pageProps} />
          </SocketContext.Provider>
        </SpotifyClientProvider>
      </ChakraProvider>
    </>
  );
}

export default MyApp;
