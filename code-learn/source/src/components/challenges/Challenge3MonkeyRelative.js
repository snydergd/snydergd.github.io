import React, {useEffect, useMemo} from "react";
import AceEditor from "../AceEditor";
import { Button } from "react-bootstrap";
import useConfetti from "../../effects/Confetti";
import { Link, useNavigate } from "react-router-dom";

export const Challenge2MonkeyRelative = () => {
    const answer = 6.5;
    const offset = 3;
    const [success, setSuccess] = React.useState(false);
    const [value, setValue] = React.useState("x = a;");
    const [pendingValue, setPendingValue] = React.useState(value);
    const [bananaPos, setBananaPos] = React.useState(answer);
    const [x, setX] = React.useState(0);
    const navigate = useNavigate();

    useConfetti({success});

    function check() {
        setValue(pendingValue);
        let x = 0;
        let a = answer-offset;
        let banana = answer;
        try {
            eval(pendingValue);
        } catch (e) {
            // that's ok -- they tried
        }

        if (x === bananaPos) {
            setSuccess(true);
        } else {
            setSuccess(false);
        }
        setX(x);
        setBananaPos(banana);
    }

    return (
        <>
            <p>Move the monkey to the bananas!</p>
            <svg style={{display: "block"}} viewBox="0 0 80 20" className="col-sm-12 col-lg-6">
                <line x1={(bananaPos-offset)*10} y1={12} x2={bananaPos*10} y2={12} stroke="white" strokeWidth="1"/>
                <text x={(bananaPos-offset/2)*10} y={18} fontSize="5" fill="white">{offset}</text>

                <text x={(bananaPos-offset)*10} y={8} fontSize="5" fill="white">a</text>
                <image href="./images/bananas.png" width="10" height="10" x={bananaPos*10} y={0}/>
                <image href="./images/monkey.png" width="10" height="10" x={x*10} y={0}/>
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
export default Challenge2MonkeyRelative;