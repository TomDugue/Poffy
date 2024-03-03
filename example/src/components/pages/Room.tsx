import { Box, Heading, HStack,Input, useColorModeValue, Text, Grid, Stack, Progress, Image, Skeleton, VStack } from "@chakra-ui/react";
import { Suspense, useEffect, useState, VFC } from "react";
import { ErrorBoundary } from "../shared/ErrorBoundary";
import { Header } from "../shared/Header";
import { PageFallback } from "../shared/PageFallback";
import { WithHeader } from "../shared/WithHeader";
import { useSocket, useRoom } from "../../hooks/room";
import { PlayerPanel } from "../shared/PlayerPanel";
import { useIsMobileSize } from "../../hooks/useIsMobileSize";
import { WithPlaybackState } from "../shared/WithPlaybackState";
import { formatDurationMS } from "../../lib/formatDurationMS";

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
          <Box><RoomPlayGround/></Box>
          {!ismobile && <Box overflow="auto"><PlayerPanel/></Box> }
          </Grid>
    </WithHeader>
  );
};


const RoomPlayGround: VFC = () => {
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
  const [playlist, setPlaylist] = useState<{id:string, name:string, image:string} | undefined>(undefined);

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
    if (typeof room?.playlist?.id === "string"
      && typeof room?.playlist?.name === "string"
      && typeof room?.playlist?.image === "string") {
      setPlaylist({
        id:room.playlist.id,
        name:room.playlist.name,
        image:room.playlist.image
      });
    }
  }, [room]);

  return (
    <Stack mt={16} spacing={5}>
          {// [ ] Noémie | Put in copyboard the link to the room
          status === "waiting" && (
            <HStack px="4" mx="auto">
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
          
          <HStack px="4" mx="auto">
            <VStack
            borderRadius="lg"
            p="5"
            mx="auto"
            bgColor={useColorModeValue("gray.100", "gray.700")}>
              { // [x] Tom | Display the playlist
                playlist !== undefined ? (
                  <>
                    <Box height="32" width="32">
                      <Image
                        height="32"
                        width="32"
                        src={playlist.image}
                        alt={playlist.name}
                        borderRadius="xl"
                      />
                    </Box>
                    <Text as="span" fontWeight="bold" noOfLines={1} wordBreak="break-all">
                      {playlist.name}
                    </Text>
                  </>
              ):(
                <>
                  <Skeleton 
                      height="32"
                      width="32"
                      borderRadius="xl"
                      startColor='green.500' endColor='green.400'
                    />
                  <Text as="span" fontWeight="bold" noOfLines={1} wordBreak="break-all">
                    Playlist not selected
                  </Text>
                </>
              )}
            </VStack>
          </HStack>
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
              <WithPlaybackState
                render={(state) => (
                  <HStack w="full">
                    <Text as="span" fontSize="xs">
                      {formatDurationMS(state?.position ?? 0)}
                    </Text>
                    <Progress w="full" value={state?.position ?? 0} max={state?.duration ?? 0} />
                    <Text as="span" fontSize="xs">
                      {formatDurationMS(state?.duration ?? 0)}
                    </Text>
                  </HStack>
                )}
              />
              {/*Show if the artist or the title is correct*/}
              <Box p={5}>
              {successArtist && (
                <HStack>
                  <svg height={16} viewBox="0 0 24 24" focusable="false"><path fill="green" d="M12,0A12,12,0,1,0,24,12,12.014,12.014,0,0,0,12,0Zm6.927,8.2-6.845,9.289a1.011,1.011,0,0,1-1.43.188L5.764,13.769a1,1,0,1,1,1.25-1.562l4.076,3.261,6.227-8.451A1,1,0,1,1,18.927,8.2Z"></path></svg>
                  <Text mt={4}> 
                    Artist : {curentArtist}
                  </Text>
                </HStack>
              )}
              {successTitle && (
                <HStack>
                  <svg height={16} viewBox="0 0 24 24" focusable="false"><path fill="green" d="M12,0A12,12,0,1,0,24,12,12.014,12.014,0,0,0,12,0Zm6.927,8.2-6.845,9.289a1.011,1.011,0,0,1-1.43.188L5.764,13.769a1,1,0,1,1,1.25-1.562l4.076,3.261,6.227-8.451A1,1,0,1,1,18.927,8.2Z"></path></svg>
                  <Text mt={4}> 
                    Title : {currentTitle}
                  </Text>
                </HStack>
              )}
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
        </Stack>
  );
};