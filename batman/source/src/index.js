import React, { useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import * as Paho from 'paho-mqtt';

const COLOR_OFF = 0;
const COLOR_WHITE = 1;
const COLOR_RED = 3;
const COLOR_BLUE = 4;
const COLOR_PURPLE = 5;

const COLOR_NAMES = {
    [COLOR_OFF]: "Off",
    [COLOR_RED]: "Red",
    [COLOR_BLUE]: "Blue",
    [COLOR_WHITE]: "White"
};

const App = () => {
    const [color, setColor] = useState(COLOR_OFF);
    const [client, setClient] = useState(null);
    useEffect(() => {
        const client = new Paho.Client("mqtt-dashboard.com", 8884, "/mqtt", "asdfkhwoiefhsdlkhow");
        client.onConnectionLost = response => {
            if (response.errorCode !== 0) {
                console.log("Connection lost: " + response.errorMessage);
            }
        };
        client.connect({
            onSuccess() {
                console.log("Connected");
                setClient(client);
            },
            useSSL: true,
            mqttVersion: 3,
        });
    }, []);

    useEffect(() => {
        if (client) {
            const message = new Paho.Message(color.toString());
            message.destinationName = "snydergd/work/batsignal/power";
            client.send(message);
        }
    }, [color, client]);

    function colorSet(color) {
        return () => setColor(color);
    }
    return <>
        <button onClick={colorSet(COLOR_OFF)}>Off</button>
        <button onClick={colorSet(COLOR_WHITE)}>White</button>
        <button onClick={colorSet(COLOR_RED)}>Red</button>
        <button onClick={colorSet(COLOR_BLUE)}>Blue</button>
        <button onClick={colorSet(COLOR_PURPLE)}>Purple</button>
        <span>Color: {COLOR_NAMES[color]}</span>
    </>
};

const el = document.getElementById("root");
if (el) {
    const root = createRoot(el);
    root.render(<App />);
}
