import { Box, Heading, HStack,Stack,Input, useColorModeValue, Text, Center, Button, Editable, EditableInput, EditablePreview, PinInput, PinInputField } from "@chakra-ui/react";
import { Suspense, useEffect, useState, VFC, useContext } from "react";
import { ErrorBoundary } from "../shared/ErrorBoundary";
import { Header } from "../shared/Header";
import { PageFallback } from "../shared/PageFallback";
import { SocketContext } from "../../lib/socket";
import { WithHeader } from "../shared/WithHeader";
import { useIsomorphicCurrentTrack } from "../../hooks/useIsomorphicCurrentTrack";
import { usePlayerController } from "../../hooks/usePlayerController";
import { usePlaylist } from "../../hooks/spotify-api";
import { usePlayContextURI } from "../../hooks/usePlayContextURI";

export const RoomPage: VFC<{ Id: string }> = ({ Id }) => {
  //@ts-ignore
  const {socket, room} = useContext(SocketContext);
  // use the room id and if the user is the room master provided by the context
  const [roomId, setRoomId] = useState<string | undefined>(undefined);
  
  if (typeof room?.id === "string") {
    setRoomId(room.id);
  }
  
  // try to join the room
  useEffect(() => {
    if (roomId === undefined) {
      socket.emit("JOIN_ROOM", Id);
    }
  }, [socket]);

  // [ ] Tom | Manage if the room is full or not available
  return (
    <ErrorBoundary>
      <Suspense fallback={<PageFallback />}>
        { roomId !== undefined && (<RoomPageContent roomId={roomId} />)}
      </Suspense>
    </ErrorBoundary>
  );
};

export const RoomPageContent: VFC<{ roomId: string }> = ({ roomId }) => {
  //@ts-ignore
  const {socket, room} = useContext(SocketContext);

  // use the room id and if the user is the room master provided by the context
  const [status, setStatus] = useState<string>("waiting");
  const [round, setRound] = useState<number>(0);
  const [rounds, setRounds] = useState<number>(5);

  useEffect(() => {
    if (typeof room?.status === "string") {
      setStatus(room?.status);
    }
    if (typeof room?.round === "number") {
      setRound(room?.round);
    }
    if (typeof room?.rounds === "number") {
      setRounds(room?.rounds);
    }
  }, [room]);
  
  const {
    playerIsActive,
    isPlaying,
    togglePlay,
    skipToNext,
    skipToPrevious,
    repeatMode,
    changeRepeatMode,
    shuffleState,
    toggleShuffleState,
  } = usePlayerController();
  
  // const { data: playlist } = usePlaylist([room.playlist.id]);
  // const { isPlayingContextURI, togglePlayContextURI } = usePlayContextURI(
  //   playlist?.uri ?? "",
  // );
  
  // const currentTrack = useIsomorphicCurrentTrack();

  const handleStartGame = () => {
    // [ ] Tom | Manage start game
    // togglePlayContextURI();

    // if (shuffleState !== true) toggleShuffleState();
    
    // currentTrack?.album?.images[0].url
    // socket.emit("NEXT_ROUND", {...room, currentTrack:{id:currentTrack?.id, name:currentTrack?.name, artist:currentTrack?.artists}})
  } 
  

  // [ ] Syndelle | This is the page to access the room
  return (
    <WithHeader header={<Header bgColor={useColorModeValue("white", "gray.800")} />}>
        <Center inset={0}>
          {// [ ] Noémie | Put in copyboard the link to the room
          status === "waiting" && (
            <HStack px="4" marginTop="16" paddingBottom="24" alignItems="flex-start" spacing="5">
              <Box p={5} shadow='md'
                  borderRadius="lg"
                  bgColor={useColorModeValue("gray.100", "gray.700")}>
                  <Heading fontSize='xl'>Room {roomId}</Heading>
                  <Text mt={4}>
                    This is the room {roomId}. You can invite your friends to join you.
                  </Text>
              </Box>
            </HStack>
          )}
          {// [ ] Noémie | Display the input and send it to the server
          status === "playing" && (
            <HStack px="4" marginTop="16" paddingBottom="24" alignItems="flex-start" spacing="5">
              <Input
                placeholder='Enter the title or the singer'
                size='lg'
                value=""
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    socket.emit("TRY_SONG", e.currentTarget.value );
                  }
                }}
              />
            </HStack>
          )}
          {// [ ] Noémie | Display the score
          status === "finished" && ( //truc en attente pour ne pas faire beug
            <HStack px="4" marginTop="16" paddingBottom="24" alignItems="flex-start" spacing="5">
              <Box p={5} shadow='md'
                  borderRadius="lg"
                  bgColor={useColorModeValue("gray.100", "gray.700")}>
                  <Heading fontSize='xl'>Room {roomId}</Heading>
                  <Text mt={4}>
                    This is the room {roomId}. You can invite your friends to join you.
                  </Text>
              </Box>
            </HStack>
          )}
        </Center>
    </WithHeader>
  );
};
