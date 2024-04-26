import React, {useEffect, useMemo} from "react";
import AceEditor from "../AceEditor";
import { Button } from "react-bootstrap";
import useConfetti from "../../effects/Confetti";
import { Link, useLocation, useNavigate } from "react-router-dom";
import progress from "../../utils/progress";

export const Challenge1Monkey = () => {
    const answer = {x: 4, y: 6};
    const [success, setSuccess] = React.useState(false);
    const [value, setValue] = React.useState("x = 0;\ny = 0;");
    const [pendingValue, setPendingValue] = React.useState(value);
    const [bananaPos, setBananaPos] = React.useState({...answer});
    const [x, setX] = React.useState(0);
    const [y, setY] = React.useState(0);
    const navigate = useNavigate();
    const location = useLocation();

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
            <p>Move the monkey to the bananas<span onClick={() => progress.markComplete(location.pathname)}>!</span></p>
            <svg style={{display: "block"}} viewBox="-10 -10 130 120" className="col-sm-12 col-lg-6">
                {/* scale for "x"  with markings from 0 to 10 */}
                <line x1="0" y1="0" x2="100" y2="0" stroke="white" strokeWidth="1"/>
                {[...Array(11).keys()].map((i) => (<>
                     <line x1={i * 10} y1="-5" x2={i * 10} y2="0" stroke="white" strokeWidth="1"/>
                     <text x={i * 10} y="-5" fontSize="5" fill="white">{i}</text>
                 </>))
                }
                <text x="102" y="0" fontSize="5" fill="white">x</text>

                {/* scale for "y" with markings from 0 to 10 */}
                <line x1="0" y1="0" x2="0" y2="100" stroke="white" strokeWidth="1"/>
                {[...Array(11).keys()].map((i) => (<>
                     <line x1="-5" y1={i * 10} x2="0" y2={i * 10} stroke="white" strokeWidth="1"/>
                     <text x="-10" y={i * 10 + 1} fontSize="5" fill="white">{i}</text>
                 </>))
                }
                <text x="-5" y="105" fontSize="5" fill="white">y</text>

                <image href="./images/bananas.png" width="10" height="10" x={bananaPos.x*10} y={bananaPos.y*10}/>
                <image href="./images/monkey.png" width="10" height="10" x={x*10} y={y*10}/>
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