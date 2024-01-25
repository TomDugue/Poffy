import { Box, Heading, HStack, Stack, useColorModeValue, Text, Icon, Circle, Center, Button, Editable, EditableInput, EditablePreview, PinInput, PinInputField } from "@chakra-ui/react";
import { memo, Suspense, VFC } from "react";
import {
  useFollowedArtists,
  useFeaturedPlaylists,
  useMyTopArtists,
  useMyTopTracks,
  useMe,
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
import { RoomPageContent } from "./Room";

export const RoomMasterPage: VFC = () => {
  // [ ] Tom | Create a room
  //  Verify if the user already has a room
  //  If not, create a new room
  //  If yes, redirect to the room
  // const data = useMe();

  const roomId = "123456";
  return (
    <ErrorBoundary>
      <Suspense fallback={<PageFallback />}>
        <Layout side={<SideNavigation />} bottom={<ResponsiveBottom />}>
            <RoomPageContent roomId={roomId} />
        </Layout>
      </Suspense>
    </ErrorBoundary>
  );
};