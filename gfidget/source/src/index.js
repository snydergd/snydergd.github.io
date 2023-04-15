import React, { useState } from "react";
import { createRoot } from "react-dom/client";
import FullscreenButton from "./components/FullscreenButton";
import SlidePop from "./components/SlidePop";
import { Button } from "react-bootstrap";

const HelloWorld = () => {
    const [txt, setText] = useState("");
    const [color, setColor] = useState("blue");
    const [over, setOver] = useState(false);

    const vibe = () => navigator.vibrate(over ? [30, 5, 3] : [3, 2, 1]);

    return (
        <div
            id="wrapper"
            onTouchStart={(e) => {
                if (e.touches[0].clientY > window.screen.height / 2) {
                    setOver(true);
                    vibe();
                }
            }}
            onTouchMove={(e) => {
                if (e.touches[0].clientY > window.screen.height / 2 != over) {
                    setOver(!over);
                    vibe();
                }
                e.preventDefault();
            }}
            onTouchEnd={(e) => {
                if (over) {
                    setOver(false);
                    vibe();
                }
            }}
        >
            <FullscreenButton style={{ float: "right" }} />
            <h1>gFidget</h1>
            <SlidePop
                onValueChange={(on) => {
                    setColor(on ? "red" : "blue");
                }}
            />
            <SlidePop flip />

            <Button onClick={() => navigator.vibrate([100])}>
                Vibrate for 100ms
            </Button>
            <div
                style={{
                    padding: "1em",
                    color: over ? "white" : "",
                    position: "absolute",
                    top: window.screen.height / 2,
                    backgroundColor: over ? color : "",
                    borderWidth: "4px",
                    borderStyle: over ? "inset" : "outset",
                    borderColor: "orange",
                }}
                onTouchMove={(e) => {
                    setText(e.touches.length.toString() + " touches.");
                }}
                onTouchEnd={(e) => {
                    setText("Touch removed.");
                }}
            >
                Drag down to here with touch. {txt}
            </div>
        </div>
    );
};

const el = document.getElementById("root");
if (el) {
    const root = createRoot(el);
    root.render(<HelloWorld />);
}
