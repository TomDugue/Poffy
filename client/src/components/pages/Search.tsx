import {
  Box,
  Grid,
  Heading,
  HStack,
  Icon,
  IconButton,
  Image,
  Input,
  InputGroup,
  InputLeftElement,
  InputRightElement,
  Skeleton,
  Stack,
  Text,
  useColorModeValue,
  Wrap,
  WrapItem,
} from "@chakra-ui/react";
import NextLink from "next/link";
import Router, { useRouter } from "next/router";
import { memo, Suspense, useEffect, useState, VFC } from "react";
import { MdArrowBack, MdClose, MdSearch } from "react-icons/md";
import { useCategories, useSearch } from "../../hooks/spotify-api";
import { useDebounceValue } from "../../hooks/useDebounceValue";
import { pagesPath } from "../../lib/$path";
import { ErrorBoundary } from "../shared/ErrorBoundary";
import { Header } from "../shared/Header";
import { Layout } from "../shared/Layout";
import { PageFallback } from "../shared/PageFallback";
import { PlaylistCard } from "../shared/PlaylistCard";
import { ResponsiveBottom } from "../shared/ResponsiveBottom";
import { SideNavigation } from "../shared/SideNavigation";
import { WithHeader } from "../shared/WithHeader";

export const SearchPage: VFC = () => {
  return (
    <ErrorBoundary>
      <Layout side={<SideNavigation />} bottom={<ResponsiveBottom />}>
        <Suspense fallback={<PageFallback />}>
          <SearchPageContent />
        </Suspense>
      </Layout>
    </ErrorBoundary>
  );
};

const SearchPageContent: VFC = () => {
  const router = useRouter();

  const initialSearchQuery = Array.isArray(router.query.q)
    ? router.query.q[0]
    : router.query.q ?? "";

  const [searchQuery, setSearchQuery] = useState(initialSearchQuery);

  const debouncedQuery = useDebounceValue(searchQuery, 300);

  useEffect(() => {
    Router.replace(pagesPath.search.$url({ query: { q: debouncedQuery } }), undefined, {
      shallow: true,
    });
  }, [debouncedQuery]);

  return (
    <WithHeader
      header={
        <Header bgColor={useColorModeValue("white", "gray.800")}>
          <HStack>
            <NextLink href={pagesPath.master.$url()} passHref>
              <IconButton
                as="a"
                variant="ghost"
                size="sm"
                borderRadius="full"
                aria-label="Back to room page"
                icon={<Icon as={MdArrowBack} fontSize="xl" />}
                fontSize="xl"
              />
            </NextLink>
            <InputGroup maxW="80">
              <InputLeftElement pointerEvents="none">
                <Icon as={MdSearch} fontSize="xl" />
              </InputLeftElement>
              <Input
                type="text"
                placeholder="Search"
                aria-label="Search playlists."
                variant="filled"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                borderRadius="full"
              />
              <InputRightElement>
                <IconButton
                  aria-label="clear text"
                  variant="ghost"
                  size="sm"
                  borderRadius="full"
                  onClick={() => setSearchQuery("")}
                  icon={<Icon as={MdClose} fontSize="xl" />}
                />
              </InputRightElement>
            </InputGroup>
          </HStack>
        </Header>
      }>
      <Box px="4" marginTop="16" marginBottom="24">
        {debouncedQuery ? (
          <Suspense fallback={<PageFallback />}>
            <SearchResult query={debouncedQuery} />
          </Suspense>
        ) : (
          <Suspense fallback={null}>
            <NoSearching />
          </Suspense>
        )}
      </Box>
    </WithHeader>
  );
};

const NoSearching: VFC = memo(() => {
  const { data } = useCategories([{ limit: 50, country: "from_token" }]);

  return (
    <Stack>
      <Heading>Categories</Heading>
      <Grid
        templateColumns="repeat(auto-fill, minmax(132px, 1fr))"
        templateRows="repeat(auto-fill, minmax(132px, 1fr))"
        gap="4">
        {data?.categories.items.map((category) => (
          <NextLink
            key={category.id}
            href={pagesPath.categories._categoryId(category.id).$url()}
            passHref>
            <Box
              as="a"
              position="relative"
              boxShadow="md"
              bgColor="lightblue"
              w="full"
              h="full">
              <Image
                src={category.icons[0].url}
                alt=""
                loading="eager"
                fallback={<Skeleton w="full" h="full" />}
              />
              <Text
                fontWeight="bold"
                position="absolute"
                bottom="2"
                left="0"
                px="2"
                w="full"
                color="white">
                {category.name}
              </Text>
            </Box>
          </NextLink>
        ))}
      </Grid>
    </Stack>
  );
});

const SearchResult: VFC<{ query: string }> = memo(({ query }) => {
  const { data: searched } = useSearch(
    query ? [query, [ "playlist" ], { limit: 50 }] : null,
  );

  return searched?.playlists?.total === 0 ? (
    <Box p="8">
      <Heading>No results found for &quot;{query}&quot;.</Heading>
    </Box>
  ) : (
    <Wrap spacing="3">
      {searched?.playlists?.items.map((playlist) => (
          <WrapItem key={playlist.id}>
            <PlaylistCard playlist={playlist} />
          </WrapItem>
      ))}
    </Wrap>
  );
});

if (process.env.NODE_ENV === "development") {
  NoSearching.displayName = "NoSearching";
  SearchResult.displayName = "SearchResult";
}
