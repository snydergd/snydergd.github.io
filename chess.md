---
layout: default
title: Chess game
---

Here you can link to a specific chess position and make a move to create a new link.

<div id="root">Javascript is loading...</div>

<style>
    .chessboard {
        width: 30em;
    }
</style>
<script
    src="https://unpkg.com/react@17/umd/react.development.js"
    crossorigin
></script>
<script
    src="https://unpkg.com/react-dom@17/umd/react-dom.development.js"
    crossorigin
></script>
<script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/chess.js/0.10.3/chess.min.js" integrity="sha512-xRllwz2gdZciIB+AkEbeq+gVhX8VB8XsfqeFbUh+SzHlN96dEduwtTuVuc2u9EROlmW9+yhRlxjif66ORpsgVA==" crossorigin="anonymous" referrerpolicy="no-referrer"></script>

<link
    href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css"
    rel="stylesheet"
    integrity="sha384-QWTKZyjpPEjISv5WaRU9OFeRpok6YctnYmDr5pNlyT2bRjXh0JMhjY6hW+ALEwIH"
    crossorigin="anonymous"
/>

<!-- <script src="https://cdnjs.cloudflare.com/ajax/libs/chessboard-js/1.0.0/chessboard-1.0.0.min.js" integrity="sha512-WfASs5HtTgTL/eZsLaOftSN9wMQl7WZGlU5UiKx/yxTViMfGh9whWRwKAC27qH8VtZJqSMqDdbq2uUb1tY3jvQ==" crossorigin="anonymous" referrerpolicy="no-referrer"></script>
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/chessboard-js/1.0.0/chessboard-1.0.0.min.css" integrity="sha512-TU/clvRaSqKB43MX6dvJPEWV8tEGDTbmT4mdxTs6DSYsBY9zKmiw4Qeykp0nS10ndH14HRNG2VWN+IjiMfA17Q==" crossorigin="anonymous" referrerpolicy="no-referrer" /> -->

<link rel="stylesheet"
      href="https://unpkg.com/@chrisoakman/chessboardjs@1.0.0/dist/chessboard-1.0.0.min.css"
      integrity="sha384-q94+BZtLrkL1/ohfjR8c6L+A6qzNH9R2hBLwyoAfu3i/WCvQjzL2RQJ3uNHDISdU"
      crossorigin="anonymous">
<script src="https://code.jquery.com/jquery-3.5.1.min.js"
        integrity="sha384-ZvpUoO/+PpLXR1lu4jmpXWu80pZlYUAfxl5NsBMWOEPSjUn/6Z/hRTt8+pR6L4N2"
        crossorigin="anonymous"></script>

<script src="https://unpkg.com/@chrisoakman/chessboardjs@1.0.0/dist/chessboard-1.0.0.min.js"
        integrity="sha384-8Vi8VHwn3vjQ9eUHUxex3JSN/NFqUg3QbPyX8kWyb93+8AC/pPWTzj+nHtbC5bxD"
        crossorigin="anonymous"></script>

<script type="text/babel">
    const { useState, useEffect, useRef, useCallback } = React;

    function drawChessBoard(position) {
        // Set up the canvas
        const canvas = document.createElement('canvas');
        canvas.width = 400;
        canvas.height = 400;
        const ctx = canvas.getContext('2d');
        
        const boardSize = 8;
        const squareSize = canvas.width / boardSize;

        // Draw the chessboard
        for (let row = 0; row < boardSize; row++) {
            for (let col = 0; col < boardSize; col++) {
                const x = col * squareSize;
                const y = row * squareSize;
                const isDarkSquare = (row + col) % 2 !== 0;
                ctx.fillStyle = isDarkSquare ? '#769656' : '#EEEED2'; // Dark and light squares
                ctx.fillRect(x, y, squareSize, squareSize);
            }
        }

        const pieceUnicode = {
            wK: '♔', wQ: '♕', wR: '♖', wB: '♗', wN: '♘', wP: '♙',
            bK: '♚', bQ: '♛', bR: '♜', bB: '♝', bN: '♞', bP: '♟'
        };

        ctx.font = `${squareSize * 0.8}px Arial`; // Scale font size relative to square size
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        // Draw the pieces
        for (const [coord, piece] of Object.entries(position)) {
            if (piece) {
                const unicodePiece = pieceUnicode[piece];
                if (unicodePiece) {
                    const col = coord.charCodeAt(0) - 'a'.charCodeAt(0); // Convert letter to index (a-h -> 0-7)
                    const row = 8 - parseInt(coord[1], 10); // Convert number to index (1-8 -> 7-0)
                    const x = col * squareSize + squareSize / 2;
                    const y = row * squareSize + squareSize / 2;
                    ctx.fillStyle = '#000000'; // Black text for all pieces
                    ctx.fillText(unicodePiece, x, y);
                }
            }
        }
        return canvas.toDataURL();
    }

    const ascii = pos => {
        const chess = new Chess();
        const fen = Chessboard.objToFen(pos) + " w - - 0 0";
        console.log("Pos fen:" + fen)
        const validPos = chess.load(fen, {skipValidation: true});
        return validPos && chess.ascii();
    }

    function Board({pgn, onFenChange = () => {}, onPgnChange}) {
        const boardRef = useRef(null);
        const [chessBoard, setChessBoard] = useState(null);
        const [chess] = useState(() => {
            const chess = new Chess();
            chess.load_pgn(pgn);
            window.chess = chess;
            return chess;
        });
        const [chessBoardDataUrl, setChessBoardDataUrl] = useState(null);
        const [fen, setFen] = useState(chess.fen());
        const [message, setMessage] = useState('');
        const changeFen = (fen) => {
            setFen(fen);
            onFenChange(fen);
        }

        useEffect(() => {
            if (!pgn) return;
            chess.load_pgn(pgn);
            changeFen(chess.fen());
        }, [pgn]);

        useEffect(() => {
            if (!boardRef.current || !chess) return;
            const board = new Chessboard(boardRef.current, {
                pieceTheme: '/images/chess/{piece}.png',
                position: chess.fen(),
                draggable: true,
                onDrop(oldLocation, newLocation) {
                    const move = chess.move({from: oldLocation, to: newLocation});
                    if (!move) return;
                    onPgnChange(chess.pgn({max_width: 5, newline_char: '\n'}));
                    onFenChange(chess.fen());
                },
                onSnapEnd() {
                    if (ascii(board.position()) !== chess.ascii()) {
                        board.position(chess.fen(), false);
                    }
                },
            });
            setChessBoard(board);
        }, [boardRef, chess])

        useEffect(() => {
            if (!chessBoard || !fen) return;
            chessBoard.position(fen);
            setChessBoardDataUrl(drawChessBoard(chessBoard.position()));
        }, [fen, chessBoard])
        useEffect(() => {
            if (message) {
                setTimeout(() => setMessage(''), 3000);
            }
        }, [message, setMessage])

        const color = chess.turn() === 'w' ? 'White' : 'Black';
        return <>
            <h3>{color}'s turn</h3>
            {message && <div className="alert alert-info">{message}</div>}
            <div ref={boardRef} className={['chessboard']}></div>
            <pre>{pgn}</pre >
            {chessBoardDataUrl && <button onClick={() => {
                navigator.clipboard.write([new ClipboardItem({ 'text/html': new Blob([`<a href="${window.location.href}">It's ${color}'s move<br /><img src="${chessBoardDataUrl}" /><br />Click to view and make a move</a>`], { type: 'text/html'}) })]);
                setMessage("Copied to clipboard!");
            }} type="button">Copy</button>}
        </>;
    }

    function App({}) {
        const [pgn, setPgn] = useState('');

        useEffect(() => {
            if (!window.location.hash || !window.location.hash.length) return;
            try {
                const pgn = atob(window.location.hash.substring(1));
                if (new Chess().load_pgn(pgn)) {
                    setPgn(pgn);
                } else {
                    console.log("Not valid PGN", pgn);
                }
            } catch (e) {
                console.error("Unable to decode pgn from URL hash", e);
            }
        }, [])

        const onPgnChange = pgn => {
            setPgn(pgn);
            if (btoa(pgn) === window.location.hash.substring(1)) return;
            window.location.hash = btoa(pgn);
        };

        return <div>
            <Board pgn={pgn} onPgnChange={onPgnChange}/>
        </div>
    }
    ReactDOM.render(<App />, document.getElementById("root"));
</script>

<script
    src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"
    integrity="sha384-YvpcrYf0tY3lHB60NNkmXc5s9fDVZLESaAA55NDzOxhy9GkcIdslK1eN7N6jIeHz"
    crossorigin="anonymous"
></script>