import React from "react";
import { Button } from "react-bootstrap";

const FullscreenButton = ({...extraArgs}) => {
    return <Button {...extraArgs} disabled={!document.fullscreenEnabled} onClick={e => {
        if (!document.fullscreenElement) {
            document.body.requestFullscreen({
                navigationUI: "hide",
            });
        } else {
            document.exitFullscreen();
        }
    }}>
        &#x26F6;
    </Button>
}

export default FullscreenButton;