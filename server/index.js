const { Server } = require("socket.io");
const { distance } = require('fastest-levenshtein');

const io = new Server({ /* options */ });


let rooms = {};
// rooms[roomid].id = "roomid"
// rooms[roomid].players = [{id:socketid, score:0, success:{name:true, artist:true}}, {id:socketid, score:0, success:{name:true, artist:true}}, ...]
// rooms[roomid].master = socketid
// rooms[roomid].status = "waiting" | "playing" | "finished"
// rooms[roomid].playlist.Id = "playlistid"
// rooms[roomid].playlist.Name = "playlistname"
// rooms[roomid].rounds[roundnumber].uri = "songURI"
// rooms[roomid].rounds[roundnumber].name = "songName"
// rooms[roomid].rounds[roundnumber].artist = "artistName"
// rooms[roomid].roundNumber = 0
// rooms[roomid].roundsNumber = 3
// rooms[roomid].playersMax = 5

// rooms[roomid].me = socketid

let players = {};
// players[socketid] = roomid

io.on("connection", (socket) => {
    console.log(`[Connection] ${socket.id}`);

    /* CREATE ROOM
    * create a new room and add the player as the master to it
    */
    socket.on('CREATE_ROOM', () => {
        if (players[socket.id]) {
            sendRoom(socket.id);
            return;
        }

        let roomid;
        do {
            roomid = makeid(6);
        } while (rooms[roomid]);
        console.log(`[CREATE_ROOM] ${roomid}`);

        rooms[roomid] = {
            id: roomid,
            version: 0,
            players: [{id:socket.id, name: "Master", score: 0, success: {name: false, artist: false}}],
            master: socket.id,
            status: "waiting",
            playlist: {
                id: null,
                name: null,
                image: null
            },
            rounds: null,
            roundNumber: -1,
            roundsNumber: 3,
            playersNumber: 5
        };
        players[socket.id] = roomid;
        sendRoom(socket.id);
    });

    /* UPDATE PARAMETERS
    * room.playlist = {id: "playlistid", name: "playlistname", image: "playlistimage"}
    * room.roundsNumber = 3
    * room.playersMax = 5
    * room.rounds = [{uri: "songURI", name: "songname", artist: "artistname"}, ...]
    */
    socket.on('UPDATE_PARAMETERS', (room) => {
        // Check Authorization ////////////////////////////////////////
        if (!players[socket.id]) {
            sendError(socket.id, 'You are not in any room');
            return;
        }
        const roomid = players[socket.id];
        console.log(`[UPDATE_PARAMETERS] ${roomid}`);
        if (rooms[roomid].master !== socket.id) {
            sendError(socket.id, 'You are not the master of this room');
            return;
        }
        if(room.playlist === undefined && room.roundsNumber === undefined && room.playersMax === undefined && room.rounds === undefined) {
            sendError(socket.id, 'No parameters to update')
            return;
        }

        // Update parameters //////////////////////////////////////////

        // room.playlist = {id: "playlistid", name: "playlistname", image: "playlistimage"}
        if(room.playlist !== undefined) {
            rooms[roomid].playlist.id = room.playlist.id;
            rooms[roomid].playlist.name = room.playlist.name;
            rooms[roomid].playlist.image = room.playlist.image;
            console.log(`[UPDATE_PARAMETERS] ${roomid} playlist: ${room.playlist.name}`);
        }

        // room.roundsNumber = 3
        if(room.roundsNumber !== undefined) {
            rooms[roomid].roundsNumber = room.roundsNumber;
            console.log(`[UPDATE_PARAMETERS] ${roomid} roundsNumber: ${room.roundsNumber}`);
        }

        // room.playersMax = 5
        if(room.playersMax !== undefined) {
            rooms[roomid].playersMax = room.playersMax;
            console.log(`[UPDATE_PARAMETERS] ${roomid} playersMax: ${room.playersMax}`);
        }

        // room.rounds = [{uri: "songURI", name: "songname", artist: "artistname"}, ...]
        if(room.rounds !== undefined) {
            try {
                const rounds = room.rounds.map((round) => {
                    if (typeof round.uri !== "string" || typeof round.name !== "string" || typeof round.artist !== "string") {
                        throw new Error("Invalid round");
                    }
                    return {
                        uri: round.uri,
                        name: round.name,
                        artist: round.artist
                    };
                });
                rooms[roomid].rounds = rounds;
                console.log(`[UPDATE_PARAMETERS] ${roomid} rounds: ${room.rounds.length}`);
            } catch (error) {
                sendError(socket.id, 'Invalid rounds');
            }
        }
        // Send update to all players /////////////////////////////////
        sendRoomUpdate(roomid);
    });

    // [x] Tom | Verify if track are set
    // NEW ROUND
    socket.on('NEXT_ROUND', () => {
        if (!players[socket.id]) {
            sendError(socket.id, 'You are not in any room');
            return;
        }
        const roomid = players[socket.id];
        console.log(`[NEXT_ROUND] ${roomid} by ${socket.id}`);
        if (rooms[roomid].master !== socket.id) {
            sendError(socket.id, 'You are not the master of this room');
            return;
        }
        console.log(`[NEXT_ROUND] 2 ${roomid}`);
        rooms[roomid].version += 1;
        rooms[roomid].roundNumber += 1;
        rooms[roomid].status = "playing";
        rooms[roomid].players.forEach(player => player = {...player, success: {name: false, artist: false}});

        if (rooms[roomid].roundNumber >= rooms[roomid].roundsNumber) {
            rooms[roomid].status = "finished";
            rooms[roomid].players.forEach(player => {
                sendRoom(player.id, 'STOP_ROUND');
            });
            return;
        }
        rooms[roomid].players.forEach(player => {
            sendRoom(player.id, 'START_ROUND');
        });
        return;
    });

    // JOIN ROOM [roomid]
    socket.on('JOIN_ROOM', (roomid) => {
        // [x] Tom | manage the case where the player is already in a room
        console.log(`[JOIN_ROOM] ${roomid} by ${socket.id}`);
        if (players[socket.id]) {
            handleDisconnect(socket);
        }

        if (!rooms[roomid]) {
            sendError(socket.id, 'Room does not exist');
            return;
        }

        if (rooms[roomid].players.length >= rooms[roomid].playersMax) {
            sendError(socket.id, 'Room is full');
            return;
        }

        if (rooms[roomid].status !== "waiting") {
            sendError(socket.id, 'Room is not waiting');
            return;
        }

        rooms[roomid].players.push({id:socket.id, name: `player${rooms[roomid].players.length}`, score: 0, success: {name: false, artist: false}});
        players[socket.id] = roomid;
        sendRoomUpdate(roomid);
    });

    // CHANGE NAME
    socket.on('CHANGE_NAME', (name) => {
        if (!players[socket.id]) {
            sendError(socket.id, 'You are not in any room');
            return;
        }
        const roomid = players[socket.id];
        
        console.log(`[CHANGE_NAME] ${socket.id} to ${name}`);
        changePlayer(socket.id, (p) => ({...p, name}));
        sendRoomUpdate(roomid);
    });

    // GET ROOM
    socket.on('GET_ROOM', () => {
        console.log(`[GET_ROOM] ${socket.id}`);
        if (!players[socket.id]) {
            sendError(socket.id, 'You are not in any room');
            return;
        }
        sendRoom(socket.id);
    });

    // TRY SONG
    socket.on('TRY_SONG', (s) => {
        console.log(`[TRY_SONG] ${socket.id} with ${s}`);
        if (!players[socket.id]) {
            sendError(socket.id, 'You are not in any room');
            return;
        }
        const roomid = players[socket.id];
        if (rooms[roomid].status !== "playing") {
            sendError(socket.id, 'Room is not playing');
            return;
        }
        if (rooms[roomid].roundNumber === -1) {
            sendError(socket.id, 'No round started');
            return;
        }

        const cRound = rooms[roomid].rounds[rooms[roomid].roundNumber];
        let changed = true;

        changePlayer(socket.id, (p) => {
            const {score, success} = test(s, p.success, cRound.name, cRound.artist);
            if (score === 0) {
                changed = false;
                sendError(socket.id, 'No match');
                return p;
            }
            return {...p, score: p.score + score, success};
        });

        if (changed) sendRoomUpdate(roomid);
    });

    // LEAVE ROOM
    socket.on('disconnect', () => {
        handleDisconnect(socket);
    });
});

io.listen(4000);

function makeid(length) {
    let result = '';
    const characters = '0123456789';
    const charactersLength = characters.length;
    let counter = 0;
    while (counter < length) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
      counter += 1;
    }
    return result;
}

// [ ] Tom | Implement the distance function
// convert all text to upercase, remove all special characters
function test(s, success, name, artist) {
    let score = 0;
    if (success === undefined) {
        success = {name: false, artist: false};
    }
    if (success.name !== true) {
        if(distance(s, name) <= name.length*0.25) {
            score += 1;
            success.name = true;
        }
    }
    if (success.artist !== true) {
        if(distance(s, artist) <= artist.length*0.25) {
            score += 1;
            success.artist = true;
        }
    }
    return {score, success}
}

function handleDisconnect(socket) {
    
    console.log(`[disconnect] ${socket.id}`);
    if (!players[socket.id]) {
        // socket.id is not in any room
        return;
    }
    const roomid = players[socket.id];
    delete players[socket.id];
    
    rooms[roomid].players = rooms[roomid].players.filter(player => player !== socket.id);
    if (rooms[roomid].master === socket.id) {
        rooms[roomid].players.forEach(player => {
            sendError(player.id, 'Master left the room');
            delete players[player];
        });
        delete rooms[roomid];
    } else {
        sendRoomUpdate(roomid);
    }
}

function sendRoomUpdate (roomid) {
    rooms[roomid].version += 1;
    rooms[roomid].players.forEach(player => sendRoom(player.id));
}

function sendRoom (socketid, event = 'ROOM_UPDATE') {
    if (!players[socketid]) {
        throw new Error('Socket is not in any room');
    }
    const roomid = players[socketid];
    io.to(socketid).emit(event, {...rooms[roomid], me: socketid});
}

function sendError (socketid, error) {
    io.to(socketid).emit('ERROR', error);
}

function changePlayer (socketid, changer) {
    rooms[players[socketid]].players = rooms[players[socketid]].players.map(p => {
        if (p.id === socketid) {
            return changer(p);
        }
        return p;
    });
};