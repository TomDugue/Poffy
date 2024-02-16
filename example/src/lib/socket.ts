import React from 'react';
import { io } from 'socket.io-client';

// "undefined" means the URL will be computed from the `window.location` object
const URL:string | undefined = process.env.NODE_ENV === 'production' ? undefined : 'http://localhost:4000';

export const socket = URL === undefined ? io() : io(URL);
export const SocketContext = React.createContext<{socket:typeof socket,room:any}|undefined>(undefined);