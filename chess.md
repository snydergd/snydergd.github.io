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
        const [fen, setFen] = useState(chess.fen());
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
                pieceTheme: 'https://chessboardjs.com/img/chesspieces/wikipedia/{piece}.png',
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
        }, [fen, chessBoard])

        return <>
            <h3>{chess.turn() === 'b' ? 'Black' : 'White'}'s turn</h3>
            <div ref={boardRef} className={['chessboard']}></div>
            <pre>{pgn}</pre>
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