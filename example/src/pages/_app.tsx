import { ChakraProvider, useToast } from "@chakra-ui/react";
import type { AppProps } from "next/app";
import Head from "next/head";
import { chakraTheme } from "../common/chakra-theme";
import { SpotifyClientProvider } from "../hooks/spotify-client";
import { SocketContext, socket } from '../lib/socket';
import { useCallback, useEffect, useState } from "react";

function MyApp(this: any, { Component, pageProps }: AppProps) {
  const [room, setRoom] = useState<any>({});

  const handleRoomUpdate = useCallback((newroom) => {
    if(newroom?.version <= room?.version) return;
    setRoom(newroom);
    console.log("Room update: ", newroom);
  }, []);

  const handleError = useCallback((error) => {
    const toast = useToast()
    toast({
      title: 'Nope !',
      description: error,
      status: 'error',
      duration: 2500,
      isClosable: true,
    })
  }, []);
  
  useEffect(() => {

    // subscribe to socket events
    socket.on("ROOM_UPDATE", handleRoomUpdate); 
    socket.on("ERROR", handleError);

    return () => {
      // before the component is destroyed
      // unbind all event handlers used in this component
      socket.off("ROOM_UPDATE", handleRoomUpdate);
      socket.off("ERROR", handleError);
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
