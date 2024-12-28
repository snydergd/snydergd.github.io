---
layout: default
title: Chess Board Position
---

Here you can link to a specific chess position and make a move to create a new link.

Uses [chess.js](https://github.com/jhlywa/chess.js/blob/master/README.md) and [chessboard.js](https://chessboardjs.com/docs.html)

<div id="root">Javascript is loading...</div>

<link rel="stylesheet"
      href="https://unpkg.com/@chrisoakman/chessboardjs@1.0.0/dist/chessboard-1.0.0.min.css"
      integrity="sha384-q94+BZtLrkL1/ohfjR8c6L+A6qzNH9R2hBLwyoAfu3i/WCvQjzL2RQJ3uNHDISdU"
      crossorigin="anonymous">
<style>
    .alert {
        position: absolute;
        top: 0;
        z-index: 1000;
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

<!-- <script src="https://cdnjs.cloudflare.com/ajax/libs/chessboard-js/1.0.0/chessboard-1.0.0.min.js" integrity="sha512-WfASs5HtTgTL/eZsLaOftSN9wMQl7WZGlU5UiKx/yxTViMfGh9whWRwKAC27qH8VtZJqSMqDdbq2uUb1tY3jvQ==" crossorigin="anonymous" referrerpolicy="no-referrer"></script>
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/chessboard-js/1.0.0/chessboard-1.0.0.min.css" integrity="sha512-TU/clvRaSqKB43MX6dvJPEWV8tEGDTbmT4mdxTs6DSYsBY9zKmiw4Qeykp0nS10ndH14HRNG2VWN+IjiMfA17Q==" crossorigin="anonymous" referrerpolicy="no-referrer" /> -->

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
        const [editText, setEditText] = useState(null);
        const [moveView, setMoveView] = useState(null);
        const checkDrag = useRef(false);
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
            checkDrag.current = () => {
                if (moveView !== null) {
                    setMessage("Can't drag while previewing old moves.  Move to latest with the arrow buttons first.");
                    return false;
                }
                return true;
            };
        }, [moveView, setMessage]);

        useEffect(() => {
            if (!boardRef.current || !chess) return;
            const board = new Chessboard(boardRef.current, {
                pieceTheme: '/images/chess/{piece}.png',
                position: chess.fen(),
                draggable: true,
                onDragStart() {
                    if (checkDrag.current) {
                        return checkDrag.current();
                    }
                },
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
            const history = chess.history();
            const myChess = new Chess();
            myChess.load_pgn(chess.pgn());
            const move = moveView === null ? history.length : moveView;
            for (let i = history.length; i > move; i--) {
                myChess.undo();
            }
            chessBoard.position(myChess.fen());
            setChessBoardDataUrl(drawChessBoard(chessBoard.position()));
        }, [fen, moveView, chessBoard])
        useEffect(() => {
            if (message) {
                setTimeout(() => setMessage(''), 3000);
            }
        }, [message, setMessage])

        const color = chess.turn() === 'w' ? 'White' : 'Black';
        const validatePgn = pgn => {
            if (new Chess().load_pgn(pgn)) {
                onPgnChange(pgn);
                chess.load_pgn(pgn);
                changeFen(fen);
                setEditText(null);
            } else {
                setMessage("Invalid PGN");
            }
        }
        return <>
            <h3>{color}'s turn</h3>
            <div className="row d-flex position-relative">
                {message && <div className="alert alert-info">{message}</div>}
                <div ref={boardRef} className={['chessboard']} className="col-6"></div>
                <div className="col-6">
                    <div>
                        <button type="button" className="btn" onClick={() => setMoveView(Math.max(0,moveView === null ? chess.history().length - 1 : moveView-1))}>{"<"}</button>
                        <button type="button" className="btn" onClick={() => {
                            if (chess.history().length-1 === moveView) {
                                setMoveView(null);
                            } else if (moveView !== null) {
                                setMoveView(moveView+1);
                            }
                        }}>{">"}</button>
                        {moveView === null ? '(Latest Move)' : `Move ${moveView}`}
                    </div>
                    {chessBoardDataUrl && <button onClick={() => {
                        navigator.clipboard.write([new ClipboardItem({ 'text/html': new Blob([`<a href="${window.location.href}">It's ${color}'s move<br /><img src="${chessBoardDataUrl}" /><br />Click to view and make a move</a>`], { type: 'text/html'}) })]);
                        setMessage("Copied to clipboard!");
                    }} type="button" className="btn btn-primary">Copy Preview Link</button>}
                    {!editText ? <button type="button" className="btn" onClick={() => setEditText(pgn)}>Edit PGN</button> : <>
                        <button type="button" className="btn" onClick={() => validatePgn(editText)}>Save PGN</button>
                        <button type="button" className="btn" onClick={() => setEditText(null)}>Cancel</button>
                    </>}
                    {editText ? <textarea value={editText} style={ {display: 'block', height: "35em", width: "100%" } } onChange={e => setEditText(e.target.value)} /> : <pre>{pgn}</pre >}
                </div>
            </div>
        </>;
    }

    function App({}) {
        const [pgn, setPgn] = useState('');

        const tryParseHash = () => {
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
        }
        useEffect(() => {
            window.addEventListener('popstate', tryParseHash);
            tryParseHash();
        }, [])

        const onPgnChange = pgn => {
            setPgn(pgn);
            if (btoa(pgn) === window.location.hash.substring(1)) return;
            history.pushState(null, null, `#${btoa(pgn)}`);
        };

        return <div>
            <Board pgn={pgn} onPgnChange={onPgnChange}/>
        </div>
    }
    ReactDOM.render(<App />, document.getElementById("root"));
</script>

