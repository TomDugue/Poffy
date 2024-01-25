import { Button, Center, Image } from "@chakra-ui/react";
import { VFC } from "react";
import { staticPath } from "../../lib/$path";

export const LoginPage: VFC = () => {
  // [ ] Syndelle | Complete LoginPage component

  return (
    <Center position="fixed" inset={0}>
      <div className="card p-4">
        <div className="masthead-heading "> Welcome to Poffy </div>
        <div className="masthead-subheading text-uppercase"> Do you want to play Poffy? </div>
        <Button
          as="a"
          href="/api/login"
          variant="ghost"
          size="lg"
          fontSize="2xl"
          fontWeight="bold"
          rightIcon={
            <Image h="8" src={staticPath.assets.Spotify_Logo_RGB_Green_png} alt="Spotify" />
          }>
          Sign in with
        </Button>
      </div>
    </Center>
  );
};
