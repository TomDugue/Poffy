import { Box, Heading, HStack, Stack, useColorModeValue, Text, Icon, Circle, Center, Button, Editable, EditableInput, EditablePreview, PinInput, PinInputField } from "@chakra-ui/react";
import { memo, Suspense, useState, VFC } from "react";
import {
  useFollowedArtists,
  useFeaturedPlaylists,
  useMyTopArtists,
  useMyTopTracks,
} from "../../hooks/spotify-api";
import NextLink from "next/link";
import { pagesPath } from "../../lib/$path";
import { range } from "../../lib/range";
import { ArtistCard, ArtistCardSkeleton } from "../shared/ArtistCard";
import { ErrorBoundary } from "../shared/ErrorBoundary";
import { Header } from "../shared/Header";
import { HScrollable } from "../shared/HScrollable";
import { Layout } from "../shared/Layout";
import { PageFallback } from "../shared/PageFallback";
import { PlaylistCard, PlaylistCardSkeleton } from "../shared/PlaylistCard";
import { ResponsiveBottom } from "../shared/ResponsiveBottom";
import { SideNavigation } from "../shared/SideNavigation";
import { Track, TrackSkeleton } from "../shared/Track";
import { WithHeader } from "../shared/WithHeader";

export const HomePage: VFC = () => {
  return (
    <ErrorBoundary>
      <Suspense fallback={<PageFallback />}>
        <HomePageContent />
      </Suspense>
    </ErrorBoundary>
  );
};

const HomePageContent: VFC = () => {
  // [ ] Syndelle | This is the page to chose between master or invitee
  return (
    <WithHeader header={<Header bgColor={useColorModeValue("white", "gray.800")} />}>
      <Center position="fixed" inset={0}>
        <HStack px="4" marginTop="16" paddingBottom="24" alignItems="flex-start" spacing="5">
          <CreateRoom/>
          <JoinRoom/>
        </HStack>
      </Center>
    </WithHeader>
  );
};

const CreateRoom: VFC = memo(() => {
  return (
  <Box p={5} shadow='md'
    borderRadius="lg"
    bgColor={useColorModeValue("gray.100", "gray.700")}>
    <Heading fontSize='xl'>Create your own room</Heading>
    <Text mt={4}>
      Create your own room and invite your friends to join you.
    </Text>
     
    <Center height="32" inset={0}>
      <NextLink href={pagesPath.master.$url()} passHref>
        <Button
          as="div"
          variant="ghost"
          size="lg"
          fontSize="2xl"
          fontWeight="bold">
          Create
        </Button>
      </NextLink>
    </Center>
  </Box>
  )
});

const JoinRoom: VFC = memo(() => {
  // [ ] Syndelle | Complete JoinRoom component
  // [x] Tom | Add a text input to enter the room id
  // [ ] Tom | Verify if the room exists
  // [ ] Tom | If the room exists, redirect to /room/[roomId]7
  const [roomid, setRoomId] = useState("000000");
  return (
    <Box p={5} shadow='md'
      borderRadius="lg"
      bgColor={useColorModeValue("gray.100", "gray.700")}>
      <Heading fontSize='xl'>Join a room</Heading>
      <Text mt={4}>
        Join a room and listen to music with your friends.
      </Text>
       
      <Center height="32" inset={0}>
        <Stack spacing={4} align="center">
          <HStack>
            <PinInput placeholder="0" onChange={(v) => (setRoomId(v))}>
              <PinInputField />
              <PinInputField />
              <PinInputField />
              <PinInputField />
              <PinInputField />
              <PinInputField />
            </PinInput>
          </HStack>
          
          <NextLink href={pagesPath.rooms._roomId(roomid).$url()} passHref>
            <Button
              as="div"
              variant="ghost"
              size="lg"
              fontSize="2xl"
              fontWeight="bold">
              Join
            </Button>
          </NextLink>
        </Stack>
      </Center>
    </Box>
  )
});

const FollowedArtists: VFC = memo(() => {
  const { data: followedArtists } = useFollowedArtists([{ limit: 10 }]);

  return (
    <>
      {followedArtists?.artists.items.map((item) => (
        <ArtistCard key={item.id} artist={item} />
      ))}
    </>
  );
});

const FollowedArtistsFallback: VFC = memo(() => {
  return (
    <>
      {[...range(0, 10)].map((i) => (
        <ArtistCardSkeleton key={i} />
      ))}
    </>
  );
});

const FeaturedPlaylists: VFC = memo(() => {
  const { data: featuredPlaylists } = useFeaturedPlaylists([]);

  return (
    <>
      {featuredPlaylists?.playlists.items.map((item) => (
        <PlaylistCard key={item.id} playlist={item} />
      ))}
    </>
  );
});

const FeaturedPlaylistsFallback: VFC = memo(() => {
  return (
    <>
      {[...range(0, 5)].map((i) => (
        <PlaylistCardSkeleton key={i} />
      ))}
    </>
  );
});

const MyTopArtists: VFC = memo(() => {
  const { data: myTopArtists } = useMyTopArtists([]);

  return (
    <>
      {myTopArtists?.items.map((item) => (
        <ArtistCard key={item.id} artist={item} />
      ))}
    </>
  );
});

const MyTopArtistsFallback: VFC = memo(() => {
  return (
    <>
      {[...range(0, 5)].map((i) => (
        <ArtistCardSkeleton key={i} />
      ))}
    </>
  );
});

const MyTopTracks: VFC = memo(() => {
  const { data: myTopTracks } = useMyTopTracks([]);

  return (
    <>
      {myTopTracks?.items.map((item, index) => (
        <Track key={item.id} track={item} index={index} />
      ))}
    </>
  );
});

const MyTopTracksFallback: VFC = memo(() => {
  return (
    <>
      {[...range(0, 20)].map((i) => (
        <TrackSkeleton hasThumbnail key={i} />
      ))}
    </>
  );
});

if (process.env.NODE_ENV === "development") {
  FollowedArtists.displayName = "FollowedArtists";
  FollowedArtistsFallback.displayName = "FollowedArtistsFallback";
  FeaturedPlaylists.displayName = "FeaturedPlaylists";
  FeaturedPlaylistsFallback.displayName = "FeaturedPlaylistsFallback";
  MyTopArtists.displayName = "MyTopArtists";
  MyTopArtistsFallback.displayName = "MyTopArtistsFallback";
  MyTopTracks.displayName = "MyTopTracks";
  MyTopTracksFallback.displayName = "MyTopTracksFallback";
}
