import React, { useEffect, useState } from "react";
import FullscreenButton from "./FullscreenButton";
import PathProgress from "./PathProgress";
import { RouterProvider, createHashRouter, useNavigate } from "react-router-dom";
import { Button } from "react-bootstrap";
import routes from "../routes";
import progress from "../utils/progress";

const router = createHashRouter(routes);

export const App = () => {
    progress.useProgress();
    const currentProgress = progress.getProgress();

    return (
        <div
            id="wrapper"
        >
            <Button style={{ float: "right" }} onClick={() => progress.clear()}><i className="fa-solid fa-undo" /></Button>
            <FullscreenButton style={{ float: "right" }} />
            <Button style={{ float: "right" }} onClick={() => router.navigate("/")}><i className="fa-solid fa-map" /></Button>
            <PathProgress progress={currentProgress} style={{ float: "right" }} />
            <h1>Code Learn</h1>
            <RouterProvider router={router}></RouterProvider>
        </div>
    );
};
export default App;