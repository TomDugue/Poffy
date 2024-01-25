import { Box, Heading, HStack, Stack, useColorModeValue, Text, Icon, Circle, Center, Button, Editable, EditableInput, EditablePreview, PinInput, PinInputField } from "@chakra-ui/react";
import { memo, Suspense, VFC } from "react";
import {
  useFollowedArtists,
  useFeaturedPlaylists,
  useMyTopArtists,
  useMyTopTracks,
} from "../../hooks/spotify-api";
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

export const RoomPage: VFC<{ roomId: string }> = ({ roomId }) => {
  return (
    <ErrorBoundary>
      <Suspense fallback={<PageFallback />}>
        <RoomPageContent roomId={roomId} />
      </Suspense>
    </ErrorBoundary>
  );
};

export const RoomPageContent: VFC<{ roomId: string }> = ({ roomId }) => {
  // [ ] Syndelle | This is the page to access the room
  return (
    <WithHeader header={<Header bgColor={useColorModeValue("white", "gray.800")} />}>
        <Center inset={0}>
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
        </Center>
    </WithHeader>
  );
};
