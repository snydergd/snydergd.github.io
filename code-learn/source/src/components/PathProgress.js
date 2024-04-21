import React from "react";

export const PathProgress = (/** @type import("react").HTMLAttributes */{progress, ...otherAttributes}) => {
    return (
        <div className="progress mx-3" {...otherAttributes} style={{width: "20%", ...otherAttributes.style}}>
            <div
                className="progress-bar"
                role="progressbar"
                style={{ width: `${progress}%` }}
                aria-valuenow={progress}
                aria-valuemin="0"
                aria-valuemax="100"
            >
                {progress}%
            </div>
        </div>
    );
};
export default PathProgress;