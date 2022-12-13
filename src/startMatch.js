import { useEffect, useState } from "react";
import "./startMatch.css"
const colors = {
    available: 'lightgray',
    used: 'lightgreen',
    wrong: 'lightcoral',
    candidate: 'deepskyblue',
};

// Math science
const utils = {
    // Sum an array
    sum: arr => arr.reduce((acc, curr) => acc + curr, 0),

    // create an array of numbers between min and max (edges included)
    range: (min, max) => Array.from({ length: max - min + 1 }, (_, i) => min + i),

    // pick a random number between min and max (edges included)
    random: (min, max) => min + Math.floor(Math.random() * (max - min + 1)),

    // Given an array of numbers and a max...
    // Pick a random sum (< max) from the set of all available sums in arr
    randomSumIn: (arr, max) => {
        const sets = [[]];
        const sums = [];
        for (let i = 0; i < arr.length; i++) {
            for (let j = 0, len = sets.length; j < len; j++) {
                const candidateSet = sets[j].concat(arr[i]);
                const candidateSum = utils.sum(candidateSet);
                if (candidateSum <= max) {
                    sets.push(candidateSet);
                    sums.push(candidateSum);
                }
            }
        }
        return sums[utils.random(0, sums.length - 1)];
    },
};

const PlayNumber = (props) => {
    console.log("status of the numer is ", props.status, props.number)
    return (
        <button
            className="number"
            style={{ backgroundColor: colors[props.status] }}
            onClick={() => props.onNumberClick(props.number, props.status)}
        >{props.number}
        </button>
    );
};
const DisplayStar = (props) => {
    return (
        <>
            {utils.range(1, props.count).map((starId) => {
                return <div key={starId} className="star" />
            })}
        </>
    );
}
const PlayAgain = (props) => {
    return (
        <div>
            <div  style={{color:props.gameStatus ==="won"?"green" :"red"}}>
                {props.gameStatus ==="won"?"nice job":"Game Over"}
        </div>
            <button onClick={() =>  props.resetGame() }>PlayAgain</button>
        </div>
    );
};

const StarMatch = () => {
    const [stars, setStars] = useState(utils.random(1, 9));
    const [availableNums, setAvailableNums] = useState(utils.range(1, 9));
    const [candidateNums, setCandidateNums] = useState([])
    const [secondleft, setSecondleft] = useState(10)

    //setTimer,setInterval
    useEffect(() =>{
        console.log("after Html render this useeffect is called.");
        if (secondleft > 0){
        const timerID= setTimeout(() => {
            setSecondleft(secondleft -1)
        },1000);
        return() =>{
            clearTimeout(timerID)
        }
    }
    },[secondleft]);
    const candidateWrong = utils.sum(candidateNums) > stars;

    const gameStatus = availableNums.length === 0 ? "won":secondleft ===0 ?"lost":"active";

    const numberStatus = (number) => {
        console.log("number in number status component ", number);
        if (!availableNums.includes(number)) {
            return "used";

        }
        if (candidateNums.includes(number)) {
            return candidateWrong ? "wrong" : "candidate";
        }
        return "available";
    };

    const onNumberClick = (number, currentStatus) => {
        if (currentStatus === "used") {
            return;
        }
        // candidate array add
        const newCandidateNums = currentStatus === "available"
            ? candidateNums.concat(number) :
            candidateNums.filter((cn) => cn !== number);
        if (utils.sum(newCandidateNums) !== stars) {
            setCandidateNums(newCandidateNums);
        }
        else {

            const newAvailableNums = availableNums.filter(

                (n) => !newCandidateNums.includes(n)
            );
            setStars(utils.randomSumIn(newAvailableNums, 9));
            setAvailableNums(newAvailableNums);
            setCandidateNums([])
        }
    };
    const resetGame = () => {
        setStars(utils.random(1, 9))
        setAvailableNums(utils.range(1, 9));
        setCandidateNums([]);
        setSecondleft(20);
    }
    return (
        <div className="game">
            <div className="help">
                Pick 1 or more numbers that sum to the number of stars
            </div>
            <div className="body">
                <div className="left">
                    {gameStatus !=="active" ? (<PlayAgain resetGame={resetGame} gameStatus={gameStatus} />
                    ) : (<DisplayStar count={stars} />)
                    }


                </div>
                <div className="right">
                    {utils.range(1, 9).map((number) => (
                        <PlayNumber
                            key={number}
                            number={number}
                            status={numberStatus(number)}
                            onNumberClick={onNumberClick}

                        />
                    ))}
                </div>
            </div>
            <div className="timer">Time Remaining: {secondleft}</div>
        </div>
    );
};


export default StarMatch