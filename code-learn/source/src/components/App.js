import React from "react";
import FullscreenButton from "./FullscreenButton";
import PathProgress from "./PathProgress";
import Challenge1Monkey from "./challenges/Challenge1Monkey";
import Challenge2MonkeyClimb from "./challenges/Challenge2MonkeyClimb";
import { RouterProvider, createHashRouter, useNavigate } from "react-router-dom";
import Map from "./Map";
import { Button } from "react-bootstrap";

const router = createHashRouter([
    {
        path: "/",
        exact: true,
        element: <Map />,
    },
    {
        path: "/challenge1",
        exact: true,
        element: <Challenge1Monkey />,
    },
    {
        path: "/challenge2",
        exact: true,
        element: <Challenge2MonkeyClimb />,
    },
]);

export const App = () => {
    return (
        <div
            id="wrapper"
        >
            <FullscreenButton style={{ float: "right" }} />
            <Button style={{ float: "right" }} onClick={() => router.navigate("/")}><i className="fa-solid fa-map" /></Button>
            <PathProgress progress={50} style={{ float: "right" }} />
            <h1>Code Learn</h1>
            <RouterProvider router={router}></RouterProvider>
        </div>
    );
};
export default App;