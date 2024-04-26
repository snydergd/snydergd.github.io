import React from 'react';
import routes from '../../routes';
import { Link } from 'react-router-dom';
import progress from '../../utils/progress';

export const SectionMap = ({title, icon, children, sectionName, showLinks=true, ...otherAttributes}) => {
    progress.useProgress();
    return (<div className="col-12 sectionmap" {...otherAttributes}>
        <div className="sectionmap-content">
            <h2>{title} {icon && <i className={`fa-solid fa-${icon}`} />}</h2>
            {children}
            {showLinks && (<div style={{ position: "relative" }}>
                {routes
                    .filter((x) => x.isChallenge && x.section === sectionName)
                    .map(route => {
                        return (
                            <div key={route.path}>
                                <Link to={route.path}>
                                    {route.title}{" "}
                                    {progress.isComplete(route.path) &&
                                        <i className="fa-solid fa-circle-check" style={{color: "green"}} />}
                                </Link>
                            </div>
                        );
                    })}
            </div>)}
        </div>
    </div>)
};
export default SectionMap;