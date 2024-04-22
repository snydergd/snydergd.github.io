import React, {useEffect, useMemo} from "react";
import AceEditor from "../AceEditor";
import { Button } from "react-bootstrap";
import useConfetti from "../../effects/Confetti";
import { Link, useNavigate } from "react-router-dom";

export const Challenge1Monkey = () => {
    const answer = {x: 4, y: 6};
    const [success, setSuccess] = React.useState(false);
    const [value, setValue] = React.useState("x = 0;\ny = 0;");
    const [pendingValue, setPendingValue] = React.useState();
    const [bananaPos, setBananaPos] = React.useState({...answer});
    const [x, setX] = React.useState(0);
    const [y, setY] = React.useState(0);
    const navigate = useNavigate();

    useConfetti({success});

    function check() {
        setValue(pendingValue);
        let x = 0;
        let y = 0;
        let banana = {...answer};
        try {
            eval(pendingValue);
        } catch (e) {
            // that's ok -- they tried
        }

        if (x === bananaPos.x && y === bananaPos.y) {
            setSuccess(true);
        } else {
            setSuccess(false);
        }
        setX(x);
        setY(y);
        setBananaPos(banana);
        console.log(pendingValue)
    }

    return (
        <>
            <p>Move the monkey to the bananas!</p>
            <svg style={{display: "block"}} viewBox="-10 0 130 120" className="col-sm-12 col-lg-6">
                {/* scale for "x"  with markings from 0 to 10 */}
                <line x1="0" y1="110" x2="100" y2="110" stroke="white" strokeWidth="1"/>
                {[...Array(11).keys()].map((i) => (<>
                     <line x1={i * 10} y1="110" x2={i * 10} y2="115" stroke="white" strokeWidth="1"/>
                     <text x={i * 10} y="118" fontSize="5" fill="white">{i}</text>
                 </>))
                }
                <text x="102" y="110" fontSize="5" fill="white">x</text>

                {/* scale for "y" with markings from 0 to 10 */}
                <line x1="0" y1="10" x2="0" y2="110" stroke="white" strokeWidth="1"/>
                {[...Array(11).keys()].map((i) => (<>
                     <line x1="-5" y1={110 - i * 10} x2="0" y2={110 - i * 10} stroke="white" strokeWidth="1"/>
                     <text x="-10" y={110 - (i * 10) + 1} fontSize="5" fill="white">{i}</text>
                 </>))
                }
                <text x="0" y="8" fontSize="5" fill="white">y</text>

                <g transform="matrix(1,0,0,-1,0,110)">
                    <g transform={`translate(${bananaPos.x*10}, ${bananaPos.y*10})`}>
                        <image href="./images/bananas.png" width="10" height="10" transform="matrix(1,0,0,-1,0,10)"/>
                    </g>
                    <g transform={`translate(${x*10}, ${y*10})`}>
                        <image href="./images/monkey.png" width="10" height="10"transform="matrix(1,0,0,-1,0,10)"/>
                    </g>
                </g>
            </svg>
            {success && <p>
                You did it!
                <Button onClick={() => navigate("/challenge3")}>Next Challenge</Button>
            </p>}
            <AceEditor value={value} onChange={setPendingValue} style={{fontSize: "20pt"}}></AceEditor>
            <Button onClick={check}>Check</Button>
        </>
    );
};
export default Challenge1Monkey;