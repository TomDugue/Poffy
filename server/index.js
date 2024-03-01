const { Server } = require("socket.io");
const { distance } = require('fastest-levenshtein')

const io = new Server({ /* options */ });


let rooms = {};
// rooms[roomid].id = "roomid"
// rooms[roomid].players = [socketid1, socketid2, ...]
// rooms[roomid].master = socketid
// rooms[roomid].status = "waiting" | "playing" | "finished"
// rooms[roomid].playlist.Id = "playlistid"
// rooms[roomid].playlist.Name = "playlistname"
// rooms[roomid].rounds[roundnumber].uri = "songURI"
// rooms[roomid].rounds[roundnumber].name = "songName"
// rooms[roomid].rounds[roundnumber].artist = "artistName"
// rooms[roomid].score = {socketid1: 0, socketid2: 0, ...}
// rooms[roomid].success = {socketid1: {name:true, artist:true}, socketid2: {name:true, artist:true}, ...}
// rooms[roomid].name = {socketid1: "name1", socketid2: "name2", ...}
// rooms[roomid].roundNumber = 0
// rooms[roomid].roundsNumber = 3
// rooms[roomid].playersMax = 5

let players = {};
// players[socketid] = roomid

io.on("connection", (socket) => {
    console.log(`[Connection] ${socket.id}`);

    /* CREATE ROOM
    * create a new room and add the player as the master to it
    */
    socket.on('CREATE_ROOM', () => {
        if (players[socket.id]) {
            io.to(socket.id).emit('ROOM_UPDATE', rooms[players[socket.id]]);
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
            players: [{id:socket.id, name: "Tom"}],
            master: socket.id,
            status: "waiting",
            playlist: {
                id: null,
                name: null,
                image: null
            },
            rounds: null,
            score: {},
            name: {},
            success: {},
            roundNumber: -1,
            roundsNumber: 3,
            playersNumber: 5
        };
        players[socket.id] = roomid;
        io.to(socket.id).emit('ROOM_UPDATE', rooms[roomid]);
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
            socket.emit('ERROR', 'You are not in any room');
            return;
        }
        const roomid = players[socket.id];
        console.log(`[UPDATE_PARAMETERS] ${roomid}`);
        if (rooms[roomid].master !== socket.id) {
            socket.emit('ERROR', 'You are not the master of this room');
            return;
        }
        if(room.playlist === undefined && room.roundsNumber === undefined && room.playersMax === undefined && room.rounds === undefined) {
            socket.emit('ERROR', 'No parameters to update');
            return;
        }

        // Update parameters //////////////////////////////////////////
        rooms[roomid].version += 1;

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
            } catch (error) {
                console.log(error);
                socket.emit('ERROR', 'Invalid rounds');
            }
            console.log(`[UPDATE_PARAMETERS] ${roomid} rounds: ${room.rounds.length}`);
        }
        // Send update to all players /////////////////////////////////
        rooms[roomid].players.forEach(player => {
            io.to(player.id).emit('ROOM_UPDATE', rooms[roomid]);
        });
    });

    // NEW ROUND
    socket.on('NEXT_ROUND', () => {
        if (!players[socket.id]) {
            socket.emit('ERROR', 'You are not in any room');
            return;
        }
        const roomid = players[socket.id];
        console.log(`[NEXT_ROUND] ${roomid} by ${socket.id}`);
        if (rooms[roomid].master !== socket.id) {
            socket.emit('ERROR', 'You are not the master of this room');
            return;
        }
        console.log(`[NEXT_ROUND] 2 ${roomid}`);
        rooms[roomid].version += 1;
        rooms[roomid].roundNumber += 1;
        rooms[roomid].status = "playing";
        rooms[roomid].success = {};

        if (rooms[roomid].roundNumber > rooms[roomid].roundsNumber) {
            rooms[roomid].status = "finished";
            rooms[roomid].players.forEach(player => {
                io.to(player.id).emit('GAME_OVER', rooms[roomid]);
            });
            return;
        }
        rooms[roomid].players.forEach(player => {
            io.to(player.id).emit('ROUND_START', rooms[roomid]);
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
            socket.emit('ERROR', 'Room not found');
            return;
        }

        if (rooms[roomid].players.length >= rooms[roomid].playersMax) {
            socket.emit('ERROR', 'Room is full');
            return;
        }

        if (rooms[roomid].status !== "waiting") {
            socket.emit('ERROR', 'Room is not available');
            return;
        }

        rooms[roomid].version += 1;
        rooms[roomid].players.push(socket.id);
        players[socket.id] = roomid;
        rooms[roomid].players.forEach(player => {
            io.to(player.id).emit('PLAYER_JOIN', socket.id);
        });
    });

    // CHANGE NAME
    socket.on('CHANGE_NAME', (name) => {
        if (!players[socket.id]) {
            socket.emit('ERROR', 'You are not in any room');
            return;
        }
        const roomid = players[socket.id];
        
        rooms[roomid].version += 1;
        console.log(`[CHANGE_NAME] ${socket.id} to ${name}`);
        rooms[roomid].name[socket.id] = name;
        rooms[roomid].players.forEach(player => {
            io.to(player.id).emit('ROOM_UPDATE', rooms[roomid]);
        });
    });

    // GET ROOM
    socket.on('GET_ROOM', () => {
        console.log(`[GET_ROOM] ${socket.id}`);
        if (!players[socket.id]) {
            socket.emit('ERROR', 'You are not in any room');
            return;
        }
        const roomid = players[socket.id];
        io.to(socket.id).emit('ROOM_UPDATE', rooms[roomid]);
    });

    // TRY SONG
    socket.on('TRY_SONG', (s) => {
        console.log(`[TRY_SONG] ${socket.id} with ${s}`);
        if (!players[socket.id]) {
            socket.emit('ERROR', 'You are not in any room');
            return;
        }
        const roomid = players[socket.id];
        if (rooms[roomid].status !== "playing") {
            socket.emit('ERROR', 'Room is not available');
            return;
        }
        if (rooms[roomid].roundNumber === -1) {
            socket.emit('ERROR', 'No song is playing');
            return;
        }
        if (rooms[roomid].score[socket.id] !== undefined) {
            socket.emit('ERROR', 'You already tried this song');
            return;
        }
        const {score, success} = test(s, rooms[roomid].success[socket.id], rooms[roomid].rounds[rooms[roomid].roundNumber].name, rooms[roomid].rounds[rooms[roomid].roundNumber].artist);
        if (score === 0) {
            socket.emit('ERROR', 'No match');
            return;
        }
        rooms[roomid].score[socket.id] += score;
        rooms[roomid].success[socket.id] = success;
        
        rooms[roomid].version += 1;
        rooms[roomid].score[socket.id] = 0;
        rooms[roomid].players.forEach(player => {
            io.to(player.id).emit('ROOM_UPDATE', rooms[roomid]);
        });
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

function test(s, success, name, artist) {
    let score = 0;
    if (success === undefined) {
        success = {name: false, artist: false};
    }
    if (!(success.name !== true)) {
        // [x] Tom | implemente levenshtein distance
        distance(s, name) < 3 ? score += 1 : score += 0;
        success.name = true;
    }
    if (!(success.artist !== true)) {
        // [x] Tom | implemente levenshtein distance
        distance(s, artist) < 3 ? score += 1 : score += 0;
        success.artist = true;
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
    
    rooms[roomid].version += 1;
    if (rooms[roomid].master === socket.id) {
        // socket.id is the master of the room
        rooms[roomid].players.forEach(player => {
            if (player !== socket.id) {
                io.to(player.id).emit('ROOM_DESTROYED');
            }
            delete players[player];
        });
        delete rooms[roomid];
    } else {
        rooms[roomid].players = rooms[roomid].players.filter(player => player !== socket.id);
        rooms[roomid].players.forEach(player => {
            io.to(player.id).emit('PLAYER_LEFT', socket.id);
        });
    }
}