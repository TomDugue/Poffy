import { Suspense, useCallback, useContext, useEffect, useState, VFC } from "react";
import { ErrorBoundary } from "../shared/ErrorBoundary";
import { Layout } from "../shared/Layout";
import { PageFallback } from "../shared/PageFallback";
import { ResponsiveBottom } from "../shared/ResponsiveBottom";
import { SideNavigation } from "../shared/SideNavigation";
import { RoomPageContent } from "./Room";
import { SocketContext } from "../../lib/socket";

export const RoomMasterPage: VFC = () => {
  //@ts-ignore
  const {socket, room} = useContext(SocketContext);
  // [x] Tom | Create a room
  // [ ] Tom | Detect if the user is already in a room

  const [roomId, setRoomId] = useState<string | undefined>(undefined);

  useEffect(() => {
    if (typeof room?.id === "string") {
      setRoomId(room.id);
    }
  }, [room]);
  
  useEffect(() => {
    if (roomId === undefined) {
      socket.emit("CREATE_ROOM");
    }
  }, [socket]);
  
  return (
    <ErrorBoundary>
      <Suspense fallback={<PageFallback />}>
        <Layout side={<SideNavigation/>} bottom={<ResponsiveBottom />}>
          { !(roomId === undefined) && (<RoomPageContent roomId={roomId} />)}
        </Layout>
      </Suspense>
    </ErrorBoundary>
  );
};