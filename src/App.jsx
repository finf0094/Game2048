import './App.css'
import {useEffect, useState} from "react";
import Block from "./components/Block.jsx";
import cloneDeep from "lodash.clonedeep"
import {useEvent} from "./utils/useEvent.js";
import {btn} from "./styledComponent/styles.js";
import Control from "./components/Control.jsx";


function App() {
    const [size, setSize] = useState(4);
    const newDataArr = Array.from({ length: size }, () => Array.from({ length: size }, () => 0));
    const [data, setData] = useState(newDataArr);
    const [bestResult, setBestResult] = useState(0);
    const [timer, setTimer] = useState(0);

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

    let savedResult = JSON.parse(localStorage.getItem('best_result'));

    if (sumArray(data) > bestResult) {
        setBestResult(sumArray(data))
    }

    function initialize() {
        setTimer(0)
        const newData = newDataArr;

        // Add two random numbers (2 or 4) to the game board
        addNumber(newData);
        addNumber(newData);

        // Update the state with the new game board
        setData(newData);
    }
    useEffect(() => {
        initialize();
    }, [])

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
        } else if (event.key === "x" || event.key === 88) {
            swipe(getDirection(data));
        }
    }

    // useEffect(() => {
    //     let intervalId = null;
    //     if (timer > 0) {
    //         intervalId = setInterval(() => {
    //             setTimer(timer => timer + 1);
    //         }, 1000);
    //     }
    //     return () => clearInterval(intervalId);
    // }, [timer]);






    const [second, setSecond] = useState(0);
    const [bestTime, setBestTime] = useState(0);

    if (second > bestTime) {
        setBestTime(second);
    }


    useEffect(() => {

            const intervalId = setInterval(() => {
                setTimer(timer => timer + 1);
            }, 1000);


            if (!isLose()) {
                setSecond(timer);
            }

        return () => {clearInterval(intervalId)};

    }, [timer]);


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
            alert("enter a number from 3 to 8");
            return 4;
        } else if (num < 3) {
            alert("enter a number from 3 to 8");
            return 4;
        }
        alert("start at the game")

        return num;
    }



    function isLose() {
        for (let i = 0; i < size; i++) {
            for (let j = 0; j < size; j++) {
                const currentBlock = data[i][j];
                if (currentBlock === 0) {
                    return false;
                }
                const rightBlock = j < size - 1 ? data[i][j + 1] : null;
                const bottomBlock = i < size - 1 ? data[i + 1][j] : null;
                if (currentBlock === rightBlock || currentBlock === bottomBlock) {
                    return false;
                }
            }
        }
        return true;
    }


    function getDirection(data) {
        const [n, m] = [data.length, data[0].length];
        let max = -1, dir = "";

        // Проверяем, есть ли пустые ячейки на игровом поле
        let hasEmpty = false;
        for (let i = 0; i < n; i++) {
            for (let j = 0; j < m; j++) {
                if (data[i][j] === 0) {
                    hasEmpty = true;
                    break;
                }
            }
            if (hasEmpty) {
                break;
            }
        }

        // Если есть пустые ячейки, то двигаемся в случайном направлении
        if (hasEmpty) {
            const randomIndex = Math.floor(Math.random() * 4);
            switch (randomIndex) {
                case 0:
                    dir = "up";
                    break;
                case 1:
                    dir = "down";
                    break;
                case 2:
                    dir = "left";
                    break;
                case 3:
                    dir = "right";
                    break;
                default:
                    break;
            }
        } else {
            // Если нет пустых ячеек, то ищем максимальный элемент и двигаемся в его направлении
            for (let i = 0; i < n; i++) {
                for (let j = 0; j < m; j++) {
                    if (data[i][j] > max) {
                        max = data[i][j];
                    }
                }
            }
            for (let i = 0; i < n; i++) {
                for (let j = 0; j < m; j++) {
                    if (data[i][j] === max) {
                        // Проверяем, в каком направлении максимальный элемент находится относительно пустых ячеек
                        if (i > 0 && data[i-1][j] === 0) {
                            dir = "up";
                        } else if (i < n-1 && data[i+1][j] === 0) {
                            dir = "down";
                        } else if (j > 0 && data[i][j-1] === 0) {
                            dir = "left";
                        } else if (j < m-1 && data[i][j+1] === 0) {
                            dir = "right";
                        }
                    }
                }
            }
        }

        return dir;
    }


    const bot = () => {

    }


  return (
    <div style={{
        display:"flex",
        alignItems: "center",
        justifyContent: "center",
        margin: "0 auto",
        gap: "5vmax" }}>
        <Control
            keyDown={"s"}
            keyLeft={"a"}
            keyUp={"w"}
            keyRight={"d"}/>
      <div>
          <h2 style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto"}}>
              {isLose() ? "You Lose" : ""}
          </h2>
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
              gap: "50px"
          }}>
              <div style={{display: "flex", flexDirection: "column", gap: 10}}>
                  <button onClick={initialize} style={{...btn}}>
                      {sumArray(data) !== 0 ? "new game" : "start"}
                  </button>
                  <button onClick={() => setSize(changeDifficulty())} style={{...btn}}>
                      difficulty
                  </button>
                  <button style={{...btn}} onClick={() => {
                      swipe(getDirection(data))
                  }}>Bot</button>
              </div>

              <div>
              <h2 style={{color: "black",
                 fontWeight: 600,
                 fontSize: 25,
                 fontFamily: "Arial, Helvetica, sans-serif"}}>
                  current: {sumArray(data)} <br/>
                  best result: {savedResult}
              </h2>
              <h2 style={{color: "black",
                  fontWeight: 600,
                  fontSize: 25,
                  fontFamily: "Arial, Helvetica, sans-serif"}}>
                  Time: {sumArray(data) > 0 ? second ? second : timer : "PRESS START"} <br/>
                  Longest time: {bestTime}
              </h2>
              </div>
          </div>
      </div>
        <Control/>
    </div>
  )
}
export default App