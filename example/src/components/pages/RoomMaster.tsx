import { Suspense, useCallback, useContext, useEffect, useState, VFC } from "react";
import { ErrorBoundary } from "../shared/ErrorBoundary";
import { Layout } from "../shared/Layout";
import { PageFallback } from "../shared/PageFallback";
import { ResponsiveBottom } from "../shared/ResponsiveBottom";
import { SideNavigation } from "../shared/SideNavigation";
import { RoomPageContent } from "./Room";
import { SocketContext } from "../../lib/socket";

export const RoomMasterPage: VFC = () => {
  // [X] Tom | Create a room
  // [ ] Tom | Detect if the user is already in a room
  const socket = useContext(SocketContext);
  const [roomId, setRoomId] = useState<string | undefined>(undefined);

  const handleRoomUpdate = useCallback((room) => {
    setRoomId(room.id);
    console.log("Room created: ", room.id);
  }, []);

  useEffect(() => {
    // as soon as the component is mounted, do the following tasks:

    // emit USER_ONLINE event
    if (roomId === undefined) socket.emit("CREATE_ROOM"); 

    // subscribe to socket events
    socket.on("ROOM_CREATION", handleRoomUpdate); 

    return () => {
      // before the component is destroyed
      // unbind all event handlers used in this component
      socket.off("ROOM_CREATION", handleRoomUpdate);
    };
  }, [socket, roomId]);
  
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