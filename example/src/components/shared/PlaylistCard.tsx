import { Box, Image, Skeleton, Stack, Text, useColorModeValue } from "@chakra-ui/react";
import { VFC } from "react";

export const PlaylistCard: VFC<{ playlist: SpotifyApi.PlaylistBaseObject }> = ({
  playlist,
}) => {
  return (
    <Stack
      width="44"
      as="a"
      borderRadius="lg"
      p="6"
      bgColor={useColorModeValue("gray.100", "gray.700")}
      onClick={(e) => {}}
      _hover={{ bgColor: useColorModeValue("gray.200", "gray.600") }}>
      <Box height="32" width="32">
        <Image
          height="32"
          width="32"
          src={playlist.images[0]?.url}
          alt={playlist.name}
          borderRadius="xl"
        />
      </Box>
      <Text as="span" fontWeight="bold" noOfLines={1} wordBreak="break-all">
        {playlist.name}
      </Text>
      <Text as="span" noOfLines={1} fontSize="sm">
        Playlist
      </Text>
    </Stack>
  );
};

export const PlaylistCardSkeleton: VFC = () => {
  return (
    <Stack borderRadius="lg" p="6" bgColor={useColorModeValue("gray.100", "gray.700")}>
      <Skeleton height="32" width="32" />
      <Skeleton height="6" />
      <Skeleton height="5" />
    </Stack>
  );
};
