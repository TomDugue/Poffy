import React, { ReactNode, VFC, useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import { removeUndefined } from '../lib/removeUndefined';
import { useToast } from '@chakra-ui/react';
import { usePlayerDevice } from 'react-spotify-web-playback-sdk';
import { useSpotifyClient } from './spotify-client';

// "undefined" means the URL will be computed from the `window.location` object
const URL:string | undefined = process.env.NODE_ENV === 'production' ? undefined : 'http://localhost:4000';
const socket = URL === undefined ? io() : io(URL);
const SocketContext = React.createContext<typeof socket | undefined>(undefined);
const RoomContext = React.createContext<any | undefined>(undefined);

// [x] Tom | When start, the current song is not actualisate wet
export const RoomContextProvider: VFC<{ children: ReactNode }> = ({ children }) => {
  const [room, setRoom] = useState<any>({});
  const spotifyClient = useSpotifyClient();
  
  const thisDevice = usePlayerDevice();
  
  const toast = useToast()
  
  const handleRoomUpdate = (newroom:any) => {
    console.log("Room update");
    if(newroom?.version <= room?.version) return;
    setRoom(newroom);
    console.log("Room update: ", newroom);
  };
  
  const handleRoundStart = async (newroom: any) => {
    console.log("Round Start");
    handleRoomUpdate((newroom))
    
    await spotifyClient.play(
      removeUndefined({
        device_id: thisDevice?.device_id,
        uris: [newroom.rounds[newroom.roundNumber].uri],
      })
    );
  };
  
  const handleRoundStop = async (newroom: any) => {
    console.log("Round Stop");
    handleRoomUpdate((newroom))
    await spotifyClient.pause();
  };
  
  const handleError = (error: any) => {
    toast({
      title: 'Nope !',
      description: error,
      status: 'error',
      duration: 2500,
      isClosable: true,
    })
  };
  
  useEffect(() => {
    // subscribe to socket events
    socket.on("ROOM_UPDATE", handleRoomUpdate);
    socket.on("START_ROUND", handleRoundStart);
    socket.on("STOP_ROUND", handleRoundStop);
    socket.on("ERROR", handleError);
  
    return () => {
      // before the component is destroyed
      // unbind all event handlers used in this component
      socket.off("ROOM_UPDATE", handleRoomUpdate);
      socket.off("START_ROUND", handleRoundStart);
      socket.off("STOP_ROUND", handleRoundStop);
      socket.off("ERROR", handleError);
    };
  }, [handleRoomUpdate, handleRoundStart, handleRoundStop, handleError]);
        
  return (
    <SocketContext.Provider value={socket}>
      <RoomContext.Provider value={room}>
        {children}
      </RoomContext.Provider>
    </SocketContext.Provider>
  );
};

export const useSocket = () => {
  const context = React.useContext(SocketContext);
  if (context === undefined) {
    throw new Error('useSocket must be used within a RoomContextProvider');
  }
  return context;
}

export const useRoom = () => {
  const context = React.useContext(RoomContext);
  if (context === undefined) {
    throw new Error('useRoom must be used within a RoomContextProvider');
  }
  return context;
}
