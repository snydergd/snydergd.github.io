import React, {useEffect, useMemo} from "react";
import AceEditor from "../AceEditor";
import { Button } from "react-bootstrap";
import useConfetti from "../../effects/Confetti";
import { Link, useNavigate } from "react-router-dom";

export const Challenge1Monkey = () => {
    const answer = 4;
    const [success, setSuccess] = React.useState(false);
    const [value, setValue] = React.useState("x = 0");
    const [pendingValue, setPendingValue] = React.useState();
    const [bananaPos, setBananaPos] = React.useState(answer);
    const [x, setX] = React.useState(0);
    const navigate = useNavigate();

    useConfetti({success});

    function check() {
        setValue(pendingValue);
        let x = 0;
        let banana = answer;
        try {
            eval(pendingValue);
        } catch (e) {
            // that's ok -- they tried
        }

        if (x === banana) {
            setSuccess(true);
        } else {
            setSuccess(false);
        }
        setX(x);
        setBananaPos(banana);
        console.log(pendingValue)
    }
    return (
        <>
            <p>Move the monkey to the bananas!</p>
            <svg style={{display: "block"}} viewBox="0 0 120 20" className="col-sm-12 col-lg-6">
                {/* scale for "x"  with markings from 0 to 10 */}
                <line x1="0" y1="10" x2="100" y2="10" stroke="white" strokeWidth="1"/>
                {[...Array(11).keys()].map((i) => (<>
                     <line x1={i * 10} y1="10" x2={i * 10} y2="15" stroke="white" strokeWidth="1"/>
                     <text x={i * 10} y="18" fontSize="5" fill="white">{i}</text>
                 </>))
                }
                <text x="102" y="10" fontSize="5" fill="white">x</text>
                <image href="./images/bananas.png" width="10" height="10" x={bananaPos*10} y="0" />
                <image href="./images/monkey.png" width="10" height="10" x={x*10} y="0" />
            </svg>
            {success && <p>
                You did it!
                <Button onClick={() => navigate("/challenge2")}>Next Challenge</Button>
            </p>}
            <AceEditor value={value} onChange={setPendingValue} style={{fontSize: "20pt"}}></AceEditor>
            <Button onClick={check}>Check</Button>
        </>
    );
};
export default Challenge1Monkey;