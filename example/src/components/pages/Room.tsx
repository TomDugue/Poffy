import { Box, Heading, HStack,Input, useColorModeValue, Text, Center, Grid, Stack } from "@chakra-ui/react";
import { Suspense, useEffect, useState, VFC } from "react";
import { ErrorBoundary } from "../shared/ErrorBoundary";
import { Header } from "../shared/Header";
import { PageFallback } from "../shared/PageFallback";
import { WithHeader } from "../shared/WithHeader";
import { useSocket, useRoom } from "../../hooks/room";
import { PlayerPanel } from "../shared/PlayerPanel";
import { useIsMobileSize } from "../../hooks/useIsMobileSize";

export const RoomPage: VFC<{ Id: string }> = ({ Id }) => {
  const socket = useSocket();
  const room = useRoom();

  // use the room id and if the user is the room master provided by the context
  const [roomId, setRoomId] = useState<string | undefined>(undefined);
  
  useEffect(() => {
    if (typeof room?.id === "string") {
      setRoomId(room.id);
    }
  }, [room]);
  
  // try to join the room
  useEffect(() => {
    if (roomId === undefined) {
      socket.emit("JOIN_ROOM", Id);
      console.log("JOIN_ROOM", Id);
    }
  }, [socket]);

  // [ ] Tom | Manage if the room is full or not available
  return (
    <ErrorBoundary>
      <Suspense fallback={<PageFallback />}>
        { roomId !== undefined && (<RoomPageContent/>)}
      </Suspense>
    </ErrorBoundary>
  );
};

export const RoomPageContent:VFC = () => {
  const ismobile = useIsMobileSize();

  // [ ] Syndelle | This is the page to access the room
  return (
    <WithHeader header={<Header bgColor={useColorModeValue("white", "gray.800")} />}>
        <Grid
          h="full"
          templateColumns="1fr auto"
          >
          <Box><RoomPlayeGround/></Box>
          {!ismobile && <Box overflow="auto"><PlayerPanel/></Box> }
          </Grid>
    </WithHeader>
  );
};


const RoomPlayeGround: VFC = () => {
  const socket = useSocket();
  const room = useRoom();

  // use the room id and if the user is the room master provided by the context
  const [status, setStatus] = useState<string>("waiting");
  const [roundNumber, setRound] = useState<number>(0);
  const [roundsNumber, setRounds] = useState<number>(5);
  const [roomId, setRoomId] = useState<string>("000000");
  const [scoreValue, setScoreValue] = useState<number>(0);
  const [successArtist, setSuccessArtist] = useState<boolean>(false);
  const [successTitle, setSuccessTitle] = useState<boolean>(false);
  const [curentArtist, setCurrentArtist] = useState<string>("");
  const [currentTitle, setCurrentTitle] = useState<string>("");

  useEffect(() => {
    if (typeof room?.status === "string") {
      setStatus(room?.status);
    }
    if (typeof room?.roundNumber === "number") {
      setRound(room?.roundNumber + 1);
    }
    if (typeof room?.roundsNumber === "number") {
      setRounds(room?.roundsNumber);
    }
    if (typeof room?.id === "string") {
      setRoomId(room?.id);
    }
    if (typeof room?.me === "string" && Array.isArray(room?.players)) {
      const player = room?.players.find((player: any) => player.id === room?.me);
      setScoreValue(player.score);
      setSuccessArtist(player.success.artist);
      setSuccessTitle(player.success.name);
    }
    if (Array.isArray(room?.rounds) && typeof room?.roundNumber === "number" && room.roundNumber >= 0 && room.roundNumber < room.rounds.length) {
      setCurrentArtist(room?.rounds[room?.roundNumber].artist);
      setCurrentTitle(room?.rounds[room?.roundNumber].name);
    }

  }, [room]);

  return (
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
            <Stack px="4" marginTop="16" paddingBottom="24" alignItems="flex-start" spacing="5">
              <Heading fontSize='xl'>Round {roundNumber} of {roundsNumber}</Heading>
              <Input
                placeholder='Enter the title or the singer'
                size='lg'
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    socket.emit("TRY_SONG", e.currentTarget.value );
                  }
                }}
              />
              {/*Show if the artist or the title is correct*/}
              <Box p={5} shadow='md'
                  borderRadius="lg"
                  bgColor={useColorModeValue("gray.100", "gray.700")}>
                  <Heading fontSize='xl'>Success</Heading>
                  <Text mt={4}>
                    {successArtist && "You find the artist : " + curentArtist}
                  </Text>
                  <Text mt={4}>
                    {successTitle && "You find the title : " + currentTitle}</Text>
              </Box>
            </Stack>
          )}
          {// [ ] Noémie | Display the score
          status === "finished" && ( // [ ] Tom | voir pour la déclaration de scoreValue
            <HStack px="4" marginTop="16" paddingBottom="24" alignItems="flex-start" spacing="5">
            <Box p={5} shadow='md'>
              <Box mt={4}>
                <Text fontWeight="bold">Score:</Text>
                <Text>{scoreValue}</Text>
              </Box>
            </Box>
            </HStack>
          )}
        </Center>
  );
};