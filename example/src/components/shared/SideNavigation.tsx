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
          <Button
            mt="4"
            onClick={() => router.push(pagesPath.search.$url())}
            colorScheme="blue"
            variant="outline">
            Change the playlist
          </Button>
        </Stack>
      )}
    </Box>
  );
};

const NavigationLink: VFC<{
  icon: IconType;
  isActive: boolean;
  href: NextLinkProps["href"];
  label: string;
}> = ({ href, isActive, icon, label }) => {
  return (
    <NextLink href={href} passHref>
      <HStack
        as="a"
        color={useLinkColor(isActive)}
        transition="color 0.2s ease"
        _hover={{ color: useColorModeValue("gray.900", "gray.100") }}>
        <Icon as={icon} fontSize="3xl" />
        <Text as="span" fontWeight={isActive ? "bold" : undefined}>
          {label}
        </Text>
      </HStack>
    </NextLink>
  );
};

const PlaylistLinks: VFC = () => {
  const { data: playlists } = useUserPlaylists([]);

  return (
    <Stack>
      {playlists?.items.map((playlist) => (
        <PlaylistLink key={playlist.id} playlist={playlist} />
      ))}
    </Stack>
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

const PlaylistLinksFallback: VFC = () => {
  return (
    <Stack spacing="4">
      {[...range(0, 5)].map((i) => (
        <SkeletonText key={i} noOfLines={1} />
      ))}
    </Stack>
  );
};