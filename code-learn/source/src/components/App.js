import React from "react";
import FullscreenButton from "./FullscreenButton";
import SlidePop from "./SlidePop";
import PathProgress from "./PathProgress";
import { AceEditor } from "./AceEditor";
import Challenge1Monkey from "./challenges/Challenge1Monkey";


export const App = () => {
    return (
        <div
            id="wrapper"
        >
            <FullscreenButton style={{ float: "right" }} />
            <PathProgress progress={50} style={{ float: "right" }} />
            <h1>Code Learn</h1>
            <Challenge1Monkey />
        </div>
    );
};
export default App;