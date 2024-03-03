import { Button, Center, Image, Stack,Text } from "@chakra-ui/react";
import { VFC } from "react";
import { staticPath } from "../../lib/$path";

export const LoginPage: VFC = () => {
  // [x] Syndelle | Complete LoginPage component

  return (
    <Center position="fixed" inset={0}>
      <Stack align="center" className="card p-4">
        <Image src={staticPath.assets.poffy_favicon_png} alt="Logo Poffy" />
        <Button
          as="a"
          href="/api/login"
          variant="outline"
          size="lg"
          fontSize="2xl"
          fontWeight="bold"
          rightIcon={
            <Image h="8" src={staticPath.assets.Spotify_Logo_RGB_Green_png} alt="Spotify" />
          }>
          Sign in with
        </Button>
      </Stack>
    </Center>
  );
};
