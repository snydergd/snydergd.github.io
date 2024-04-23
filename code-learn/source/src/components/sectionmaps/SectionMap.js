import React from 'react';

export const SectionMap = ({title, icon, ...otherAttributes}) => {
    return (<div className="col-12 sectionmap" {...otherAttributes}>
        <div className="sectionmap-content">
            <h2>{title} {icon && <i className={`fa-solid fa-${icon}`} />}</h2>

        </div>
    </div>)
};
export default SectionMap;