import React from 'react';
import { Link } from 'react-router-dom';

export const Map = () => {
    return (
        <div>
            <h1>Map</h1>
            <ul>
                <li>
                    <Link to="/challenge1">Challenge 1</Link>
                </li>
                <li>
                    <Link to="/challenge2">Challenge 2</Link>
                </li>
            </ul>
        </div>
    );
};
export default Map;