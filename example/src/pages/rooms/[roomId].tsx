import { NextPage } from "next";
import { useRouter } from "next/router";
import { RoomPage } from "../../components/pages/Room";
import { withAuth } from "../../lib/withAuth";

const Page: NextPage = () => {
  const router = useRouter();
  const roomId = router.query.roomId as string;
  console.log(roomId);
  return <RoomPage roomId={roomId} />;
};

export default withAuth(Page);