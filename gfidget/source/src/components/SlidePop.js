import React, { useState } from "react";

const SlidePop = ({
    flip = false,
    height = flip ? 60 : 200,
    width = flip ? 200 : 60,
    onValueChange = /** @type {function|null} **/ (null),
}) => {
    if (!flip) {
       const newWidth = height;
       height = width;
       width = newWidth;
    }
    const [on, setOn] = useState(false);
    const [startPos, setStartPos] = useState(0);
    const [currentPos, setCurrentPos] = useState(0);
    const [lastSwitched, setLastSwitched] = useState(false);
    const [lastPos, setLastPos] = useState(0);
    const [touching, setTouching] = useState(false);

    const cx = Math.max(
        height / 2,
        Math.min(
            width - height / 2,
            height / 2 + (on ? width - height : 0) + currentPos - startPos
        )
    );

    const slideDistance = width - height;
    const switched =
        (on && currentPos - startPos < -slideDistance / 2) ||
        (!on && currentPos - startPos > slideDistance / 2);

    const start = (e, x) => {
        setStartPos(x);
        setCurrentPos(x);
        setLastPos(cx);
        navigator.vibrate([1]);
        e.preventDefault();
        setTouching(true);
    };
    const move = (e, x) => {
        if (!touching) return;
        setCurrentPos(x);
        if (switched != lastSwitched) {
            navigator.vibrate([30]);
            setLastSwitched(switched);
        }
        if (cx != lastPos && (cx == width - height / 2 || cx == height / 2)) {
            navigator.vibrate([2]);
        }
        setLastPos(cx);
        e.preventDefault();
    };
    const end = (e) => {
        if (switched) {
            setOn(!on);
            if (onValueChange) onValueChange(!on);
        }
        setStartPos(0);
        setCurrentPos(0);
        e.preventDefault();
        navigator.vibrate([1]);
        setTouching(false);
    };

    const coordKey = flip ? "clientY" : "clientX";

    return (
        <div style={{ display: "inline-block" }}>
            <svg
                width={(flip?height:width) + "px"}
                height={(flip?width:height) + "px"}
                viewBox={`0 0 ${flip?height:width} ${flip?width:height}`}
                style={{
                    border: `3px outset ${on ? "red" : "blue"}`,
                    borderRadius: `${height / 2}px`,
                    margin: "1em",
                    boxSizing: "content-box",
                }}
            >
                <g transform={flip ? "matrix(0, 1, 1, 0, 0, 0)" : ""}>
                    <rect
                        width={cx}
                        height={height}
                        style={{
                            fill: "#00df00",
                        }}
                    />
                    <rect
                        x={cx}
                        width={width}
                        height={height}
                        style={{
                            fill: "#000044",
                        }}
                    />
                    <circle
                        style={{
                            stroke: on ? "red" : "blue",
                            width: "3",
                            fill: "lightgray",
                        }}
                        r={height / 2}
                        cx={cx}
                        cy={height / 2}
                        onTouchStart={(e) => start(e, e.touches[0][coordKey])}
                        onTouchMove={(e) => move(e, e.touches[0][coordKey])}
                        onTouchEnd={(e) => end(e)}
                        onMouseDown={(e) => start(e, e[coordKey])}
                        onMouseMove={(e) => move(e, e[coordKey])}
                        onMouseUp={(e) => end(e)}
                        onMouseOut={(e) => end(e)}
                    />
                </g>
            </svg>
        </div>
    );
};

export default SlidePop;
