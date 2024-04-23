import React from 'react';
import Map from "./components/Map";

const Challenge1Monkey = React.lazy(() => import("./components/challenges/Challenge1Monkey"));
const Challenge2MonkeyClimb = React.lazy(() => import("./components/challenges/Challenge2MonkeyClimb"));
const Challenge3MonkeyRelative = React.lazy(() => import("./components/challenges/Challenge3MonkeyRelative"));

export const routes = [
    {
        path: "/",
        element: <Map />,
        title: "Map",
        isChallenge: false,
    },
    {
        path: "/challenge1",
        element: <Challenge1Monkey />,
        title: "Monkey X",
        isChallenge: true,
        section: "variables",
    },
    {
        path: "/challenge2",
        element: <Challenge2MonkeyClimb />,
        title: "Monkey XY",
        isChallenge: true,
        section: "variables",
    },
    {
        path: "/challenge3",
        element: <Challenge3MonkeyRelative />,
        title: "Monkey Relative",
        isChallenge: true,
        section: "variables",
    },
].map(x => ({...x, element: <React.Suspense fallback={<div>Loading...</div>}>{x.element}</React.Suspense>}));
export default routes