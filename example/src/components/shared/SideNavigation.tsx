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
} from "@chakra-ui/react";
import NextLink, { LinkProps as NextLinkProps } from "next/link";
import { useRouter } from "next/router";
import { useCallback, useContext, useEffect, useState, VFC } from "react";
import { IconType } from "react-icons";
import { useUserPlaylists } from "../../hooks/spotify-api";
import { useSecondaryTextColor } from "../../hooks/useSecondaryTextColor";
import { pagesPath } from "../../lib/$path";
import { range } from "../../lib/range";
import { SocketContext } from "../../lib/socket";

const useLinkColor = (isActive: boolean) => {
  const primaryColor = useColorModeValue("gray.900", "gray.100");
  const secondaryColor = useSecondaryTextColor();
  return isActive ? primaryColor : secondaryColor;
};

export const SideNavigation: VFC = () => {
  const router = useRouter();
  //@ts-ignore
  const {socket, room} = useContext(SocketContext);
  
  const [playlist, setPlaylist] = useState<{id:string, name:string, image:string} | undefined>(undefined);

  useEffect(() => {
    if (typeof room?.playlist?.id === "string"
      && typeof room?.playlist?.name === "string"
      && typeof room?.playlist?.image === "string") {
      // @ts-ignore
      setPlaylist({
        id:room.playlist.id,
        name:room.playlist.name,
        image:room.playlist.image
      });
    }
  }, [room]);

  return (
    <Box h="full" w="80" bgColor={useColorModeValue(undefined, "gray.900")} p="5">
      <Text as="span" fontWeight="bold" fontSize={28}>
        Parameters
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
    </Box>
  );
};

const PlaylistLink: VFC<{
  playlist: SpotifyApi.PlaylistObjectSimplified;
}> = ({ playlist }) => {
  const router = useRouter();
  const href = pagesPath.playlists._playlistId(playlist.id).$url();

  const isActive =
    router.pathname === href.pathname &&
    router.query.playlistId === href.query.playlistId;

  return (
    <NextLink href={href} passHref>
      <Link
        noOfLines={1}
        color={useLinkColor(isActive)}
        fontWeight={isActive ? "bold" : undefined}>
        {playlist.name}
      </Link>
    </NextLink>
  );
};


// [ ] Tom | Please make this component
const Playlist: VFC<{ playlist: {id:string, name:string, image:string} }> = ({ playlist }) => {
  const router = useRouter();
  //@ts-ignore
  const {socket, room} = useContext(SocketContext);

  const [status, setStatus] = useState<string>("waiting");

  const handleGameStart = () => {

    socket.emit("NEXT_ROUND", room);
  }

  const handleNextRound = () => {
    socket.emit("NEXT_ROUND", room);
  }

  useEffect(() => {
    if (typeof room?.status === "string") {
      setStatus(room?.status);
    }
  }, [room]);

  return (
    <>
      <Stack
        borderRadius="lg"
        p="6"
        bgColor={useColorModeValue("gray.100", "gray.700")}>
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
      </Stack>
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