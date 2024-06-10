import React from "react";
import axios from "axios";
import { useState } from "react";

const apiUrl = "http://localhost:9000/api/result";

const initialMessage = "";
const initialEmail = "";
const initialSteps = 0;
const initialIndex = 4; // the index the "B" is at

export default function AppFunctional(props) {
  const bArr = [0, 1, 2, 3, 4, 5, 6, 7, 8];
  const [message, setMessage] = useState(initialMessage);
  const [email, setEmail] = useState(initialEmail);
  const [steps, setSteps] = useState(initialSteps);
  const [userIndex, setUserIndex] = useState(initialIndex);

  function getXY(idx) {
    const x = (idx % 3) + 1;
    const y = Math.floor(idx / 3) + 1;
    return { x, y };
  }

  function getXYMessage() {
    const { x, y } = getXY(userIndex);
    return `Coordinates (${x}, ${y})`;
  }

  function reset() {
    setMessage(initialMessage);
    setEmail(initialEmail);
    setSteps(initialSteps);
    setUserIndex(initialIndex);
  }

  function getNextIndex(direction) {
    let nextIndex = userIndex;

    if (direction === "left") {
      if (userIndex % 3 !== 0) {
        nextIndex = userIndex - 1;
      }
      setMessage("You can't go left");
    } else if (direction === "up") {
      if (userIndex >= 3) {
        nextIndex = userIndex - 3;
      }
      setMessage("You can't go up");
    } else if (direction === "right") {
      if ((userIndex + 1) % 3 !== 0) {
        nextIndex = userIndex + 1;
      }
      setMessage("You can't go right");
    } else if (direction === "down") {
      if (userIndex < 6) {
        nextIndex = userIndex + 3;
      }
      setMessage("You can't go down");
    }

    return nextIndex;
  }

  function move(evt) {
    const direction = evt.target.id;
    const nextIndex = getNextIndex(direction);
    if (nextIndex !== userIndex) {
      setUserIndex(nextIndex);
      setSteps((prevSteps) => prevSteps + 1);
      setMessage(initialMessage);
    }
  }

  function onChange(evt) {
    const { value } = evt.target;
    setEmail(value);
  }

  function onSubmit(evt) {
    evt.preventDefault();
    const { x, y } = getXY(userIndex);
    const apiRequestObj = {
      x: x,
      y: y,
      steps: steps,
      email: email,
    };

    axios
      .post(apiUrl, apiRequestObj)
      .then((res) => {
        setMessage(res.data.message);
        setEmail(initialEmail);
      })
      .catch((err) => {
        setMessage(err.response.data.message);
      });
  }

  return (
    <div id="wrapper" className={props.className}>
      <div className="info">
        <h3 id="coordinates">{getXYMessage(userIndex)}</h3>
        <h3 id="steps">{`You moved ${steps} time${steps === 1 ? "" : "s"}`}</h3>
      </div>
      <div id="grid">
        {bArr.map((idx) => (
          <div
            key={idx}
            className={`square${idx === userIndex ? " active" : ""}`}
          >
            {idx === userIndex ? "B" : null}
          </div>
        ))}
      </div>
      <div className="info">
        <h3 id="message">{message}</h3>
      </div>
      <div id="keypad">
        <button onClick={move} id="left">
          LEFT
        </button>
        <button onClick={move} id="up">
          UP
        </button>
        <button onClick={move} id="right">
          RIGHT
        </button>
        <button onClick={move} id="down">
          DOWN
        </button>
        <button id="reset" onClick={reset}>
          reset
        </button>
      </div>
      <form onSubmit={onSubmit}>
        <input
          value={email}
          onChange={onChange}
          id="email"
          type="email"
          placeholder="type email"
        ></input>
        <input id="submit" type="submit"></input>
      </form>
    </div>
  );
}
