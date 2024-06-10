import React from "react";
import axios from "axios";
import { useState } from "react";

const apiUrl = "http://localhost:9000/api/result";

// Suggested initial states
const initialMessage = "";
const initialEmail = "";
const initialSteps = 0;
const initialIndex = 4; // the index the "B" is at

export default function AppFunctional(props) {
  // THE FOLLOWING HELPERS ARE JUST RECOMMENDATIONS.
  // You can delete them and build your own logic from scratch.
  const bArr = [0, 1, 2, 3, 4, 5, 6, 7, 8];
  const [message, setMessage] = useState(initialMessage);
  const [email, setEmail] = useState(initialEmail);
  const [steps, setSteps] = useState(initialSteps);
  const [userIndex, setUserIndex] = useState(initialIndex);

  function getXY(idx) {
    // It it not necessary to have a state to track the coordinates.
    // It's enough to know what index the "B" is at, to be able to calculate them.
    const x = (idx % 3) + 1;
    const y = Math.floor(idx / 3) + 1;
    return { x, y };
  }

  function getXYMessage() {
    // It it not necessary to have a state to track the "Coordinates (2, 2)" message for the user.
    // You can use the `getXY` helper above to obtain the coordinates, and then `getXYMessage`
    // returns the fully constructed string.
    const { x, y } = getXY(userIndex);
    return `Coordinates (${x}, ${y})`;
  }

  function reset() {
    // Use this helper to reset all states to their initial values.
    setMessage(initialMessage);
    setEmail(initialEmail);
    setSteps(initialSteps);
    setUserIndex(initialIndex);
  }

  function getNextIndex(direction) {
    // This helper takes a direction ("left", "up", etc) and calculates what the next index
    // of the "B" would be. If the move is impossible because we are at the edge of the grid,
    // this helper should return the current index unchanged.
    let nextIndex = userIndex;

    if (direction === "left") {
      if (userIndex % 3 !== 0) {
        nextIndex = userIndex - 1;
      }
    } else if (direction === "up") {
      if (userIndex >= 3) {
        nextIndex = userIndex - 3;
      }
    } else if (direction === "right") {
      if ((userIndex + 1) % 3 !== 0) {
        nextIndex = userIndex + 1;
      }
    } else if (direction === "down") {
      if (userIndex < 6) {
        nextIndex = userIndex + 3;
      }
    }

    return nextIndex;
  }

  function move(evt) {
    // This event handler can use the helper above to obtain a new index for the "B",
    // and change any states accordingly.
    const direction = evt.target.id;
    const nextIndex = getNextIndex(direction);
    if (nextIndex !== userIndex) {
      setUserIndex(nextIndex);
      setSteps((prevSteps) => prevSteps + 1);
      setMessage(initialMessage);
    }
  }

  function onChange(evt) {
    // You will need this to update the value of the input.
    const { value } = evt.target;
    setEmail(value);
  }

  function onSubmit(evt) {
    // Use a POST request to send a payload to the server.
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
      })
      .catch((err) => console.log(err));
  }

  return (
    <div id="wrapper" className={props.className}>
      <div className="info">
        <h3 id="coordinates">{getXYMessage(userIndex)}</h3>
        <h3 id="steps">{`You moved ${steps} times`}</h3>
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
