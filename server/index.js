const { Server } = require("socket.io");

const io = new Server({ /* options */ });


let rooms = {};
// rooms[roomid].id = "roomid"
// rooms[roomid].players = [socketid1, socketid2, ...]
// rooms[roomid].master = socketid
// rooms[roomid].status = "waiting" | "playing" | "finished"
// rooms[roomid].playlist.Id = "playlistid"
// rooms[roomid].playlist.Name = "playlistname"
// rooms[roomid].currentSong.id = "songId"
// romms[roomid].currentSong.name = "songName"
// rooms[roomid].currentSong.artist = "artistName"
// rooms[roomid].score = {socketid1: 0, socketid2: 0, ...}
// rooms[roomid].success = {socketid1: {name:true, artist:true}, socketid2: {name:true, artist:true}, ...}
// rooms[roomid].name = {socketid1: "name1", socketid2: "name2", ...}
// rooms[roomid].round = 0
// rooms[roomid].rounds = 3
// rooms[roomid].playersMax = 5

let players = {};
// players[socketid] = roomid

io.on("connection", (socket) => {
    console.log(`[connection] ${socket.id}`);

    // CREATE ROOM
    socket.on('CREATE_ROOM', () => {
        if (players[socket.id]) {
            io.to(socket.id).emit('ROOM_CREATION', players[socket.id]);
            return;
        }

        let roomid;
        do {
            roomid = makeid(6);
        } while (rooms[roomid]);

        rooms[roomid] = {
            id: roomid,
            players: [socket.id],
            master: socket.id,
            status: "waiting",
            playlist: {
                id: null,
                name: null
            },
            currentSong: {
                id: null,
                name: null,
                artist: null
            },
            score: {},
            name: {},
            success: {},
            round: 0,
            rounds: 3,
            playersMax: 5
        };
        players[socket.id] = roomid;
        io.to(socket.id).emit('ROOM_CREATION', rooms[roomid]);
    });

    // UPDATE PARAMETERS
    socket.on('UPDATE_PARAMETERS', (room) => {
        if (!players[socket.id]) {
            socket.emit('ERROR', 'You are not in any room');
            return;
        }
        const roomid = players[socket.id];
        if (rooms[roomid].master !== socket.id) {
            socket.emit('ERROR', 'You are not the master of this room');
            return;
        }
        rooms[roomid].playlist.id = room.playlist.id;
        rooms[roomid].playlist.name = room.playlist.name;
        rooms[roomid].rounds = room.rounds;
        rooms[roomid].playersMax = room.playersMax;
        rooms[roomid].players.forEach(player => {
            io.to(player).emit('ROOM_UPDATE', rooms[roomid]);
        });
    });

    // NEW ROUND
    socket.on('NEXT_ROUND', (room) => {
        if (!players[socket.id]) {
            socket.emit('ERROR', 'You are not in any room');
            return;
        }
        const roomid = players[socket.id];
        if (rooms[roomid].master !== socket.id) {
            socket.emit('ERROR', 'You are not the master of this room');
            return;
        }
        rooms[roomid].round += 1;
        rooms[roomid].status = "playing";
        rooms[roomid].success = {};
        if (rooms[roomid].round > rooms[roomid].rounds) {
            rooms[roomid].status = "finished";
            rooms[roomid].players.forEach(player => {
                io.to(player).emit('GAME_OVER', rooms[roomid]);
            });
            return;
        }
        rooms[roomid].currentSong = {
            id: room.currentSong.id,
            name: room.currentSong.name,
            artist: room.currentSong.artist
        };
        rooms[roomid].players.forEach(player => {
            io.to(player).emit('ROUND_START', rooms[roomid]);
        });
    });

    // JOIN ROOM [roomid]
    socket.on('JOIN_ROOM', (roomid) => {
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

        rooms[roomid].players.push(socket.id);
        players[socket.id] = roomid;
        rooms[roomid].players.forEach(player => {
            io.to(player).emit('PLAYER_JOIN', socket.id);
        });
    });

    // CHANGE NAME
    socket.on('CHANGE_NAME', (name) => {
        if (!players[socket.id]) {
            socket.emit('ERROR', 'You are not in any room');
            return;
        }
        const roomid = players[socket.id];
        rooms[roomid].name[socket.id] = name;
        rooms[roomid].players.forEach(player => {
            io.to(player).emit('ROOM_UPDATE', rooms[roomid]);
        });
    });

    // TRY SONG
    socket.on('TRY_SONG', (s) => {
        if (!players[socket.id]) {
            socket.emit('ERROR', 'You are not in any room');
            return;
        }
        const roomid = players[socket.id];
        if (rooms[roomid].status !== "playing") {
            socket.emit('ERROR', 'Room is not available');
            return;
        }
        if (rooms[roomid].currentSong.id === null) {
            socket.emit('ERROR', 'No song is playing');
            return;
        }
        if (rooms[roomid].score[socket.id] !== undefined) {
            socket.emit('ERROR', 'You already tried this song');
            return;
        }
        rooms[roomid].score[socket.id] = 0;
        rooms[roomid].players.forEach(player => {
            io.to(player).emit('ROOM_UPDATE', rooms[roomid]);
        });
    });

    // LEAVE ROOM
    socket.on('disconnect', () => {
        console.log(`[disconnect] ${socket.id}`);
        if (!players[socket.id]) {
            // socket.id is not in any room
            return;
        }
        const roomid = players[socket.id];
        delete players[socket.id];

        if (rooms[roomid].master === socket.id) {
            // socket.id is the master of the room
            rooms[roomid].players.forEach(player => {
                if (player !== socket.id) {
                    io.to(player).emit('ROOM_DESTROYED');
                }
                delete players[player];
            });
            delete rooms[roomid];
        } else {
            rooms[roomid].players = rooms[roomid].players.filter(player => player !== socket.id);
            rooms[roomid].players.forEach(player => {
                io.to(player).emit('PLAYER_LEFT', socket.id);
            });
        }
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
    if (!(success.name === true)) {
        // [ ] Tom | implemente levenshtein distance
    }
    if (!(success.artist === true)) {
        // [ ] Tom | implemente levenshtein distance
    }

    return {score, success}
}