import React from 'react';
import { Link } from 'react-router-dom';
import routes from '../routes';
import { Variables } from './sectionmaps/Variables';

export const Map = () => {
    return (
        <div>
            <Variables />
            <ul>
                {routes.filter(x => x.isChallenge).map(route => (
                    <li key={route.path}>
                        <Link to={route.path}>{route.title}</Link>
                    </li>
                ))}
            </ul>
        </div>
    );
};
export default Map;