import {
  Box,
  HStack,
  Icon,
  Stack,
  Text,
  useColorModeValue,
  Link,
  SkeletonText,
  Button,
  Image,
  Input,
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
} from "@chakra-ui/react";
import NextLink, { LinkProps as NextLinkProps } from "next/link";
import { useRouter } from "next/router";
import { useCallback, useContext, useEffect, useState, VFC } from "react";
import { IconType } from "react-icons";
import { useRoom, useSocket } from "../../hooks/room";
import { usePlaylist, useUserPlaylists } from "../../hooks/spotify-api";
import { useSecondaryTextColor } from "../../hooks/useSecondaryTextColor";
import { pagesPath } from "../../lib/$path";

const useLinkColor = (isActive: boolean) => {
  const primaryColor = useColorModeValue("gray.900", "gray.100");
  const secondaryColor = useSecondaryTextColor();
  return isActive ? primaryColor : secondaryColor;
};

export const SideNavigation: VFC = () => {
  const router = useRouter();
  const room = useRoom();
  const socket = useSocket();
  
  const [playlist, setPlaylist] = useState<{id:string, name:string, image:string} | undefined>(undefined);
  const [playerMax, setPlayerMax] = useState<number>(5);
  const [songsNumber, setSongsNumber] = useState<number>(3);

  const handleChangeRounds = (valueString: string) => {
    const value = parseInt(valueString, 10);
    if (value > 15) {
      setSongsNumber(15);
    } else if (value < 3) {
      setSongsNumber(3);
    } else {
      socket.emit("UPDATE_PARAMETERS", {roundsNumber: value});
    }

  }

  const handleChangePlayerMax = (valueString: string) => {
    const value = parseInt(valueString, 10);
    if (value > 10) {
      setPlayerMax(10);
    } else if (value < 1) {
      setPlayerMax(1);
    } else {
      socket.emit("UPDATE_PARAMETERS", {playersMax: value});
    }
  }

  useEffect(() => {
    if (typeof room?.playlist?.id === "string"
      && typeof room?.playlist?.name === "string"
      && typeof room?.playlist?.image === "string") {
      setPlaylist({
        id:room.playlist.id,
        name:room.playlist.name,
        image:room.playlist.image
      });
    }
    if (typeof room?.playersMax === "number") {
      setPlayerMax(room.playersMax);
    }
    if (typeof room?.roundsNumber === "number") {
      setSongsNumber(room.roundsNumber);
    }
  }, [room]);

  return (
    <Box h="full" w="80" bgColor={useColorModeValue(undefined, "gray.900")} p="5">
      <Text as="span" fontWeight="bold" fontSize={28}>
        Parameters
      </Text>
      <Stack mt="4">
        <Text as="span" fontWeight="bold">
          Players number
        </Text>
        <NumberInput onChange={handleChangePlayerMax} step={1} defaultValue={playerMax} min={1} max={10}>
          <NumberInputField />
          <NumberInputStepper>
            <NumberIncrementStepper />
            <NumberDecrementStepper />
          </NumberInputStepper>
        </NumberInput>
      </Stack>
      <Stack mt="4">
        <Text as="span" fontWeight="bold">
          Round number
        </Text>
        <NumberInput onChange={handleChangeRounds} step={1} defaultValue={songsNumber} min={3} max={15}>
          <NumberInputField />
          <NumberInputStepper>
            <NumberIncrementStepper />
            <NumberDecrementStepper />
          </NumberInputStepper>
        </NumberInput>
      </Stack>
      <Stack mt="4">
        <Text as="span" fontWeight="bold">
          Playlist
        </Text>
        { playlist === undefined ? (
          <Button
            mt="4"
            onClick={() => router.push(pagesPath.search.$url())}
            colorScheme="blue"
            variant="outline"
          >
            Set the Playlist
          </Button>
        ) : (
          <Playlist playlist={playlist}/>
        )}
      </Stack>
    </Box>
  );
};


// [ ] Tom | Please make this component
const Playlist: VFC<{ playlist: {id:string, name:string, image:string} }> = ({ playlist }) => {
  const router = useRouter();
  const socket = useSocket();
  const room = useRoom();

  const [status, setStatus] = useState<string>("waiting");
  
  const { data: playlistdata } = usePlaylist([room.playlist.id]);

  const handleGameStart = () => {
    if (playlistdata === undefined) {
      throw new Error("The playlist data is not loaded yet.");
    }
    const rounds = playlistdata.tracks.items
      .filter((playlistTrack) => playlistTrack.track.type === "track")
      .map((playlistTrack) => {
        const track = (playlistTrack.track as SpotifyApi.TrackObjectFull);
        return {uri:track.uri, name:track.name, artist:track.artists[0].name}
      })
      // [ ] Tom | Find a better way to shuffle the array @see: https://dev.to/codebubb/how-to-shuffle-an-array-in-javascript-2ikj
      .sort(() => Math.random() - 0.5)
      .slice(0, room.roundsNumber);
    if (rounds.length !== room.roundsNumber) {
      throw new Error(`Their is only ${room.rounds.length} tracks in the playlist, you can't play ${room.roundsNumber} rounds.`);
    }
    socket.emit("UPDATE_PARAMETERS", {rounds: rounds});
    handleNextRound();
  }

  const handleNextRound = () => {
    socket.emit("NEXT_ROUND");
  }

  useEffect(() => {
    if (typeof room?.status === "string") {
      setStatus(room?.status);
    }
  }, [room]);

  return (
    <>
      <Button
        mt="4"
        onClick={() => {if(status === "waiting") router.push(pagesPath.search.$url())}}
        disabled={status !== "waiting"}
        colorScheme="blue"
        variant="outline">
        Change the playlist
      </Button>
      
      {status === "waiting" && (
      <Button
        mt="4"
        onClick={handleGameStart}
        colorScheme="blue"
        variant="outline">
        Start the game
      </Button>
      )}
      {status === "playing" && (
      <Button
        mt="4"
        onClick={handleNextRound}
        colorScheme="blue"
        variant="outline">
        Next round
      </Button>
      )}
    </>
  );
}