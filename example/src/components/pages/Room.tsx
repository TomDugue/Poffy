import { Box, Heading, HStack, useColorModeValue, Text, Center, Button, Editable, EditableInput, EditablePreview, PinInput, PinInputField } from "@chakra-ui/react";
import { Suspense, useEffect, useState, VFC, useContext } from "react";
import { ErrorBoundary } from "../shared/ErrorBoundary";
import { Header } from "../shared/Header";
import { PageFallback } from "../shared/PageFallback";
import { SocketContext } from "../../lib/socket";
import { WithHeader } from "../shared/WithHeader";

export const RoomPage: VFC<{ roomId: string }> = ({ roomId }) => {
  return (
    <ErrorBoundary>
      <Suspense fallback={<PageFallback />}>
        <RoomPageContent roomIdAsked={roomId} />
      </Suspense>
    </ErrorBoundary>
  );
};

export const RoomPageContent: VFC<{ roomIdAsked: string }> = ({ roomIdAsked }) => {
  //@ts-ignore
  const {socket, room} = useContext(SocketContext);

  // use the room id and if the user is the room master provided by the context
  const [roomId, setRoomId] = useState<string | undefined>(undefined);
  const [isRoomMaster, setIsRoomMaster] = useState<boolean>(false);
  const [status, setStatus] = useState<string>("waiting");

  useEffect(() => {
    if (typeof room?.id === "string") {
      setRoomId(room.id);
    }
    if (typeof room?.master === "string") {
      setIsRoomMaster(room?.master === socket.id);
    }
    if (typeof room?.status === "string") {
      setStatus(room?.status);
    }
  }, [room]);
  
  // try to join the room
  useEffect(() => {
    if (roomId === undefined) {
      socket.emit("JOIN_ROOM", roomIdAsked);
    }
  }, [socket]);

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
            
          )}
          {// [ ] Noémie | Display the score
          status === "finished" && (
            
          )}
        </Center>
        {isRoomMaster && (
        <Center inset={0}>
        { // [ ] Tom | Manage start game
        status === "waiting" && (
          
        )}
        { // [ ] Tom | Manage next round
        status === "playing" && (

        )}
        { // [ ] Tom | Restart the game
        status === "finished" && (
          
        )}
        </Center>
        )}
    </WithHeader>
  );
};
