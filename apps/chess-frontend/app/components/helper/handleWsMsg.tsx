
export function handleWsMsg(
    event: MessageEvent,
    setRoomId: (v: string | null) => void,
    setRoomName: (v: string) => void,
    setFen: (v: string) => void,
    setTurn: (v: "w" | "b" | null) => void,
    setLastMove: (v: { from: string; to: string }) => void,
    setPromotion: (v: { from: string; to: string } | null) => void,
    setWinner: (v: string | null) => void,
    setSuccessMsg: (v: string) => void,
    setErrorMsg: (v: string) => void,
    setplayerColor: (v: "w" | "b") => void,
    setWhitePlayer: (v: string) => void,
    setBlackPlayer: (v: string) => void
) {

    const { type, payload } = JSON.parse(event.data);

    switch (type) {

        // CREATE ROOM
        case "create-room-success":
            setRoomId(payload.room);
            setRoomName(payload.name);
            setSuccessMsg(payload.message);
            setplayerColor(payload.color);
            setWhitePlayer(payload.userName);
            break;

        case "create-room-error":
            setErrorMsg(payload.message);
            break;


        // JOIN ROOM
        case "join-room-success":
            setRoomId(payload.roomId);
            setRoomName(payload.roomName);
            setSuccessMsg(payload.message);
            setplayerColor(payload.color);
            setBlackPlayer(payload.userName);
            setWhitePlayer(payload.opponentName);
            break;

        case "join-room-error":
            setErrorMsg(payload.message);
            break;

        case "opponent-joined":
            setWhitePlayer(payload.userName);      // creator (you)
            setBlackPlayer(payload.opponentName);  // joiner
            break;
            
        // LEAVE ROOM
        case "leave-room-error":
            setErrorMsg(payload.message);
            break;


        // GAME STATE (reconnect sync)
        case "game-state":
            setFen(payload.fen);
            setTurn(payload.turn);
            break;


        // MOVE MADE
        case "move-made":
            setLastMove(payload.move);
            setFen(payload.fen);
            setTurn(payload.turn);
            break;


        // PROMOTION REQUIRED
        case "promotion-required":
            setPromotion({
                from: payload.from,
                to: payload.to
            });
            break;


        // GAME OVER
        case "game-over":
            setSuccessMsg(payload.message);
            setWinner(payload.winner);
            break;


        default:
            console.warn("Unknown message:", type, payload);
    }
}