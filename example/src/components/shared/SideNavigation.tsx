import {
  Box,
  HStack,
  Icon,
  Stack,
  Text,
  useColorModeValue,
  Link,
  SkeletonText,
  Slider,
  SliderTrack,
  SliderFilledTrack,
  SliderThumb,
  Tooltip,
} from "@chakra-ui/react";
import NextLink, { LinkProps as NextLinkProps } from "next/link";
import { useRouter } from "next/router";
import { useState, VFC } from "react";
import { IconType } from "react-icons";
import { useUserPlaylists } from "../../hooks/spotify-api";
import { useSecondaryTextColor } from "../../hooks/useSecondaryTextColor";
import { pagesPath } from "../../lib/$path";
import { range } from "../../lib/range";

const useLinkColor = (isActive: boolean) => {
  const primaryColor = useColorModeValue("gray.900", "gray.100");
  const secondaryColor = useSecondaryTextColor();
  return isActive ? primaryColor : secondaryColor;
};

export const SideNavigation: VFC = () => {
  const router = useRouter();
  
  const [sliderValue, setSliderValue] = useState(5)
  const [showTooltip, setShowTooltip] = useState(false)

  return (
    <Box h="full" w="80" bgColor={useColorModeValue(undefined, "gray.900")} p="5">
      <Text as="span" fontWeight="bold" fontSize={28}>
        Parameters
      </Text>
      
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
