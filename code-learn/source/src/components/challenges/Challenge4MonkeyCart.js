import React, {useEffect, useMemo} from "react";
import AceEditor from "../AceEditor";
import { Button } from "react-bootstrap";
import useConfetti from "../../effects/Confetti";
import { Link, useLocation, useNavigate } from "react-router-dom";
import progress from "../../utils/progress";

export const Challenge4MonkeyCart = () => {
    const answer = 8.2;
    const offset = 3.4;
    const [success, setSuccess] = React.useState(false);
    const [value, setValue] = React.useState("x = a;");
    const [pendingValue, setPendingValue] = React.useState(value);
    const [bananaPos, setBananaPos] = React.useState(answer);
    const [x, setX] = React.useState(0);
    const navigate = useNavigate();
    const location = useLocation();

    useConfetti({success});

    function check() {
        setValue(pendingValue);
        let x = 0;
        let a = answer-offset;
        let b = answer;
        let banana = answer;
        try {
            eval(pendingValue);
        } catch (e) {
            // that's ok -- they tried
        }

        if (Math.abs(x-offset)<0.0001) {
            setSuccess(true);
        } else {
            setSuccess(false);
        }
        setX(x);
        setBananaPos(banana);
    }

    return (
        <>
            <p>Move the monkey so he can reach the bananas with a stick<span onClick={() => progress.markComplete(location.pathname)}>!</span></p>
            <svg style={{display: "block"}} viewBox="0 0 100 50" className="col-sm-12 col-lg-6">
            <line x1="0" y1="40" x2="100" y2="40" stroke="white" strokeWidth="1"/>
                {[...Array(11).keys()].map((i) => (<>
                     <line x1={(i+answer%1) * 10} y1="40" x2={(i+answer%1) * 10} y2="45" stroke="white" strokeWidth="1"/>
                 </>))
                }

                <image href="./images/bananas.png" width="10" height="10" x={bananaPos*10} y={0}/>
                <line x1={bananaPos*10} y1={45} x2={bananaPos*10} y2={10} stroke="white" strokeWidth="1" strokeDasharray="1 2"/>
                <text x={bananaPos*10} y={50} fontSize="3" fill="white">b</text>

                <image href="./images/monkey.png" width="10" height="10" x={x*10} y={30}/>

                <line x1={x*10+5} y1={37} x2={(bananaPos-offset)*10+x*10} y2={10} stroke="brown" strokeWidth="1"/>
                <line x1={(bananaPos-offset)*10} y1={45} x2={(bananaPos-offset)*10} y2={10} stroke="white" strokeWidth="1" strokeDasharray="1 2"/>
                <text x={(bananaPos-offset)*10} y={50} fontSize="3" fill="white">a</text>
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
export default Challenge4MonkeyCart;