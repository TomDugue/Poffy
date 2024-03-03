import { Flex, HStack, Heading, Icon, IconButton, useColorModeValue } from "@chakra-ui/react";
import { Suspense, VFC } from "react";
import { useCategory, useCategoryPlaylists } from "../../hooks/spotify-api";
import { ErrorBoundary } from "../shared/ErrorBoundary";
import { Header } from "../shared/Header";
import { Layout } from "../shared/Layout";
import { PageFallback } from "../shared/PageFallback";
import { PlaylistCard } from "../shared/PlaylistCard";
import { ResponsiveBottom } from "../shared/ResponsiveBottom";
import { SideNavigation } from "../shared/SideNavigation";
import { WithHeader } from "../shared/WithHeader";
import NextLink from "next/link";
import { pagesPath } from "../../lib/$path";
import { MdArrowBack } from "react-icons/md";

export const CategoryPage: VFC<{ categoryId: string }> = ({ categoryId }) => {
  return (
    <ErrorBoundary>
      <Layout side={<SideNavigation />} bottom={<ResponsiveBottom />}>
        <Suspense fallback={<PageFallback />}>
          <CategoryPageContent categoryId={categoryId} />
        </Suspense>
      </Layout>
    </ErrorBoundary>
  );
};

const CategoryPageContent: VFC<{ categoryId: string }> = ({ categoryId }) => {
  const { data: category } = useCategory([categoryId, { country: "from_token" }]);
  const { data: playlists } = useCategoryPlaylists([categoryId, { limit: 50 }]);

  return (
    <WithHeader
      header={
        <Header bgColor={useColorModeValue("white", "gray.800")}>
          <HStack>
            <NextLink href={pagesPath.search.$url()} passHref>
              <IconButton
                as="a"
                variant="ghost"
                size="sm"
                borderRadius="full"
                aria-label="Back to search page"
                icon={<Icon as={MdArrowBack} fontSize="xl" />}
                fontSize="xl"
              />
            </NextLink>
            <Heading as="h1" fontSize="xl">
              Categories: {category?.name}
            </Heading>
          </HStack>
        </Header>
      }>
      <Flex px="4" gap="4" pt="20" pb="24" wrap="wrap" justifyContent="center">
        {playlists?.playlists.items.map((playlist) => (
          <PlaylistCard key={playlist.id} playlist={playlist} />
        ))}
      </Flex>
    </WithHeader>
  );
};
