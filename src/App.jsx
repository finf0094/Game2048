import './App.css'
import {useEffect, useState} from "react";
import Block from "./components/Block.jsx";
import cloneDeep from "lodash.clonedeep"
import {useEvent} from "./utils/useEvent.js";
import {btn} from "./styledComponent/styles.js";


function App() {
    const [size, setSize] = useState(4)
    const newDataArr = Array.from({ length: size }, () => Array.from({ length: size }, () => 0));
    const [data, setData] = useState(newDataArr)
    const [bestResult, setBestResult] = useState(0);

    function sumArray(arr) {
        let sum = 0;
        for (let i = 0; i < arr.length; i++) {
            for (let j = 0; j < arr[i].length; j++) {
                sum += arr[i][j];
            }
        }
        return sum;
    }



    localStorage.setItem('best_result', JSON.stringify(bestResult));

    const savedResult = JSON.parse(localStorage.getItem('best_result'));

    if (sumArray(data) > bestResult) {
        setBestResult(sumArray(data))
    }

    function initialize() {
        const newData = newDataArr;

        // Add two random numbers (2 or 4) to the game board
        addNumber(newData);
        addNumber(newData);

        // Update the state with the new game board
        setData(newData);
    }


    function addNumber(newData) {
        // Find all the empty cells on the game board
        const emptyCells = [];
        for (let i = 0; i < size; i++) {
            for (let j = 0; j < size; j++) {
                if (newData[i][j] === 0) {
                    emptyCells.push([i, j]);
                }
            }
        }

        // If there are no empty cells, do nothing
        if (emptyCells.length === 0) {
            return;
        }

        // Choose a random empty cell and add a new number (2 or 4)
        const [i, j] = emptyCells[Math.floor(Math.random() * emptyCells.length)];
        newData[i][j] = Math.random() < 0.9 ? 2 : 4;
        setData(newData)
    }

    function combine(arr) {
        for (let i = 0; i < arr.length - 1; i++) {
            if (arr[i] !== 0 && arr[i] === arr[i+1]) {
                arr[i] = arr[i] * 2;
                arr[i+1] = 0;
            }
        }
        return arr;
    }

    function isEqual(arr1, arr2) {
        return JSON.stringify(arr1) === JSON.stringify(arr2);
    }

    function swipe(direction) {
        let oldData = cloneDeep(data);
        let newData = cloneDeep(data);

        if (direction === "left") {
            for (let i = 0; i < size; i++) {
                let arr = newData[i];
                let newArr = [];
                for (let j = 0; j < size; j++) {
                    if (arr[j] !== 0) {
                        newArr.push(arr[j]);
                    }
                }
                let combinedArr = combine(newArr);
                while (combinedArr.length < size) {
                    combinedArr.push(0);
                }
                newData[i] = combinedArr;
            }
        } else if (direction === "right") {
            for (let i = 0; i < size; i++) {
                let arr = newData[i];
                let newArr = [];
                for (let j = size - 1; j >= 0; j--) {
                    if (arr[j] !== 0) {
                        newArr.unshift(arr[j]);
                    }
                }
                let combinedArr = combine(newArr);
                while (combinedArr.length < size) {
                    combinedArr.unshift(0);
                }
                newData[i] = combinedArr;
            }
        } else if (direction === "up") {
            for (let j = 0; j < size; j++) {
                let arr = [];
                for (let i = 0; i < size; i++) {
                    arr.push(newData[i][j]);
                }
                let newArr = [];
                for (let k = 0; k < size; k++) {
                    if (arr[k] !== 0) {
                        newArr.push(arr[k]);
                    }
                }
                let combinedArr = combine(newArr);
                while (combinedArr.length < size) {
                    combinedArr.push(0);
                }
                for (let m = 0; m < size; m++) {
                    newData[m][j] = combinedArr[m];
                }
            }
        } else if (direction === "down") {
            for (let j = 0; j < size; j++) {
                let arr = [];
                for (let i = size - 1; i >= 0; i--) {
                    arr.push(newData[i][j]);
                }
                let newArr = [];
                for (let k = 0; k < size; k++) {
                    if (arr[k] !== 0) {
                        newArr.push(arr[k]);
                    }
                }
                let combinedArr = combine(newArr);
                while (combinedArr.length < size) {
                    combinedArr.push(0);
                }
                for (let m = size - 1; m >= 0; m--) {
                    newData[m][j] = combinedArr[size - 1 - m];
                }
            }
        }

        if (!isEqual(oldData, newData)) {
            addNumber(newData);
        }

        setData(newData);
    }

    function handleKeyDown(event) {
        if (event.key === "ArrowUp" || event.key === "w") {
            swipe("up");
        } else if (event.key === "ArrowDown" || event.key === "s") {
            swipe("down");
        } else if (event.key === "ArrowLeft" || event.key === "a") {
            swipe("left");
        } else if (event.key === "ArrowRight" || event.key === "d") {
            swipe("right");
        }
    }

    // useEffect(() => {
    //     initialize();
        // document.addEventListener("keydown", handleKeyDown);
    // }, [])

    useEvent('keydown', handleKeyDown)

    const changeDifficulty = () => {
        const num = +prompt();
        if (isNaN(num)) {
            alert("Insert number!")
            return 4;
        }
        if (num > 8) {
            alert("введите число от 3 до 8");
            return 4;
        } else if (num < 3) {
            alert("введите число от 3 до 8");
            return 4;
        }
        alert("start at the game")

        return num;
    }




    // isLose


  return (
      <div>
          <div style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto"
          }}>
              <button style={{...btn, marginRight: 10}} onClick={() => swipe("up")}>UP</button>
              <button style={{...btn, marginRight: 10}} onClick={() => swipe("down")}>DOWN</button>
              <button style={{...btn, marginRight: 10}} onClick={() => swipe("left")}>LEFT</button>
              <button style={{...btn, marginRight: 10}} onClick={() => swipe("right")}>RIGHT</button>
          </div>



      <div className="game-board">
        <div
            style={{
                background: "gray",
                width: "max-content",
                margin: "auto",
                padding: 5,
                borderRadius: 5,
                marginTop: 10,
            }}
        >
        {data.map((row, i) => (
            <div key={i} style={{display: "flex"}}>
              {row.map((cell, j) => (
                  <Block num={cell} key={j} className="cell" />
              ))}
            </div>
        ))}
        </div>
      </div>

          <div style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto",
              gap: 50
          }}>

              <div style={{display: "flex"}}>
                  <button onClick={initialize} style={{...btn}}>
                      {sumArray(data) !== 0 ? "new game" : "start"}
                  </button>
                  <button onClick={() => setSize(changeDifficulty())} style={{...btn}}>
                      difficulty
                  </button>
              </div>

              <div>
              <h2 style={{color: "black",
                     fontWeight: 600,
                     fontSize: 25,
                     fontFamily: "Arial, Helvetica, sans-serif"}
          }>current: {sumArray(data)}
              </h2>
              <h2 style={{color: "black",
                  fontWeight: 600,
                  fontSize: 25,
                  fontFamily: "Arial, Helvetica, sans-serif"}}>
                  best result: {savedResult}
              </h2>
              </div>
          </div>
      </div>
  )
}



export default App
