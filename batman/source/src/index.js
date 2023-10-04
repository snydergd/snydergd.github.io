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
        const client = new Paho.Client("mqtt-dashboard.com", 8884, "/mqtt", "asdfkhwoiefhsdlkhow" + Math.random());
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
        <div className="d-grid gap-2 container">
            <h2>Signal Batman!</h2>
            <p>
                Set the color.
            </p>
            <button onClick={colorSet(COLOR_OFF)} className="btn btn-secondary btn-block">Off</button>
            <button onClick={colorSet(COLOR_WHITE)} className="btn" style={{backgroundColor: "white"}}>White</button>
            <button onClick={colorSet(COLOR_RED)} className="btn" style={{backgroundColor: "red", color: "white"}}>Red</button>
            <button onClick={colorSet(COLOR_BLUE)} className="btn" style={{backgroundColor: "blue", color: "white"}}>Blue</button>
            <button onClick={colorSet(COLOR_PURPLE)} className="btn" style={{backgroundColor: "purple", color: "white"}}>Purple</button>
            <span>Current color: {COLOR_NAMES[color]}</span>
        </div>
    </>
};

const el = document.getElementById("root");
if (el) {
    const root = createRoot(el);
    root.render(<App />);
}
