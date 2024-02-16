import { Box, Heading, HStack,Stack,Input, useColorModeValue, Text, Center, Button, Editable, EditableInput, EditablePreview, PinInput, PinInputField } from "@chakra-ui/react";
import { Suspense, useEffect, useState, VFC, useContext } from "react";
import { ErrorBoundary } from "../shared/ErrorBoundary";
import { Header } from "../shared/Header";
import { PageFallback } from "../shared/PageFallback";
import { SocketContext } from "../../lib/socket";
import { WithHeader } from "../shared/WithHeader";

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
  const [isRoomMaster, setIsRoomMaster] = useState<boolean>(false);
  const [status, setStatus] = useState<string>("waiting");

  useEffect(() => {
    if (typeof room?.master === "string") {
      setIsRoomMaster(room?.master === socket.id);
    }
    if (typeof room?.status === "string") {
      setStatus(room?.status);
    }
  }, [room]);

  const setAnswer = () => {
    // Check if the answer is not empty before sending it to the server
    if (answer.trim() === "") {
      // Handle empty answer case, you may want to display an error message
      console.error("Answer cannot be empty");
      return;
    }

    // Send the answer to the server
    socket.emit("TRY_SONG", { answer });

    // redirect to the room page
    router.push(pagesPath.master.$url());
  };
  

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
            <Stack>
            <Input
              placeholder='Enter the title or the singer'
              size='lg'
              value={answer}
            />
            <Button onClick={setAnswer}>Submit Answer</Button>
          </Stack>
            
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
        {isRoomMaster && (
        <Center inset={0}>
        { // [ ] Tom | Manage start game
        status === "waiting" && ( //truc en attente pour ne pas faire beug
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
        { // [ ] Tom | Manage next round
        status === "playing" && ( //truc en attente pour ne pas faire beug
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
        { // [ ] Tom | Restart the game
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
        )}
    </WithHeader>
  );
};
