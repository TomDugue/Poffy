import { Text, Box, Heading, useColorModeValue, HStack, Popover, PopoverTrigger, IconButton, Icon, PopoverContent, PopoverArrow, PopoverHeader, PopoverBody, Slider, SliderTrack, SliderFilledTrack, SliderThumb, Stack, Flex, Spacer } from "@chakra-ui/react";
import { VFC, useState, useEffect, useCallback, useRef } from "react";
import { MdDevices, MdVolumeOff, MdVolumeMute, MdVolumeDown, MdVolumeUp } from "react-icons/md";
import { useSpotifyPlayer, usePlaybackState } from "react-spotify-web-playback-sdk";
import useSWR from "swr";
import { useSocket, useRoom } from "../../hooks/room";
import { useMyDevices } from "../../hooks/spotify-api";
import { useIsMobileSize } from "../../hooks/useIsMobileSize";
import { MyDevices } from "./MyDevices";

/*
    This component is the player panel, it shows the current players in the room and the volume control
    */
export const PlayerPanel: VFC = () => {
    const socket = useSocket();
    const room = useRoom();
  
    const [players, setPlayers] = useState<any[]>([]);
    const [masterId, setMasterId] = useState<string>('');
    const [status, setStatus] = useState<string>("waiting");
  
    useEffect(() => {
        if (typeof room?.master === "string") {
            setMasterId(room.master);
        }
        if (Array.isArray(room?.players)) {
            setPlayers(room.players);
        }
        if (typeof room?.status === "string") {
            setStatus(room.status);
        }
    }, [room]);
  
    return (
        <Flex flexDirection="column" h="full" w="80" bgColor={useColorModeValue(undefined, "gray.900")} >
            <Heading as="h2" size="lg" textAlign="center" mt="20">Players</Heading>
            <Box>
            {players.map((player) => (
                <Flex key={player.id} m={3} p={5} shadow='md' borderRadius="lg" bgColor={useColorModeValue("gray.100", "gray.700")}>
                    <Text fontWeight="bold">{player.name + (player.id === masterId ? ' 👑' : '')}</Text>
                    <Spacer />
                    { status !== "waiting" && (
                    <Text>{player.score}</Text>
                    )}
                </Flex>
            ))}
            </Box>
            <Spacer />
            <HStack justifySelf="flex-end" justifyContent="center" my={5}>
                <Popover>{({ isOpen }) => <DevicesPopoverContent isOpen={isOpen} />}</Popover>
                <VolumeSeekBar />
            </HStack>
        </Flex>
    );
  }
  
  const DevicesPopoverContent: VFC<{ isOpen: boolean }> = ({ isOpen }) => {
    const { mutate } = useMyDevices();
  
    useEffect(() => {
      if (isOpen) mutate();
    }, [isOpen, mutate]);
  
    return (
      <>
        <PopoverTrigger>
          <IconButton
            aria-label="open devices drawer"
            icon={<Icon as={MdDevices} fontSize="lg" />}
            variant="ghost"
            size="sm"
          />
        </PopoverTrigger>
        <PopoverContent>
          <PopoverArrow />
          <PopoverHeader py="4">
            <Heading as="h3" fontSize="xl" textAlign="center">
              Connect devices
            </Heading>
          </PopoverHeader>
          <PopoverBody>
            <MyDevices />
          </PopoverBody>
        </PopoverContent>
      </>
    );
  };
  
  const VolumeSeekBar: VFC = () => {
    const spotifyPlayer = useSpotifyPlayer();
    const playbackState = usePlaybackState();
  
    const { data = 0, mutate } = useSWR(["PlaybackVolume", playbackState], () =>
      spotifyPlayer?.getVolume(),
    );
  
    const setVolume = useCallback(
      (volume: number) => {
        spotifyPlayer?.setVolume(volume);
        mutate(volume);
      },
      [mutate, spotifyPlayer],
    );
  
    const beforeMuteRef = useRef<number>();
    const toggleMute = useCallback(() => {
      if (beforeMuteRef.current === undefined) {
        setVolume(0);
        beforeMuteRef.current = data;
      } else {
        setVolume(beforeMuteRef.current);
        beforeMuteRef.current = undefined;
      }
    }, [data, setVolume]);
  
    return (
      <HStack spacing="1" minW="40">
        <IconButton
          aria-label="toggle mute"
          isDisabled={!playbackState}
          size="sm"
          variant="ghost"
          icon={
            <Icon
              fontSize="lg"
              as={
                !data
                  ? MdVolumeOff
                  : data < 0.33
                  ? MdVolumeMute
                  : data < 0.66
                  ? MdVolumeDown
                  : MdVolumeUp
              }
            />
          }
          onClick={toggleMute}
        />
        <Slider
          aria-label="seek playback"
          isDisabled={!playbackState}
          size="sm"
          colorScheme="green"
          value={data}
          min={0}
          max={1}
          step={0.01}
          focusThumbOnChange={false}
          onChange={setVolume}>
          <SliderTrack>
            <SliderFilledTrack />
          </SliderTrack>
          <SliderThumb w="2" h="2" />
        </Slider>
      </HStack>
    );
  };