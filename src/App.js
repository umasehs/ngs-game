import React, { Component } from "react";
import PhaserContainer from "./PhaserContainer";
import logo from "./logo.svg";
import "./App.css";

let deferredPrompt;

window.addEventListener("beforeinstallprompt", e => {
  // Prevent Chrome 67 and earlier from automatically showing the prompt
  e.preventDefault();
  // Stash the event so it can be triggered later.
  deferredPrompt = e;
});

const addToHomeScreen = e => {
  // hide our user interface that shows our A2HS button
  // btnAdd.style.display = 'none';
  // Show the prompt
  deferredPrompt.prompt();
  // Wait for the user to respond to the prompt
  deferredPrompt.userChoice.then(choiceResult => {
    if (choiceResult.outcome === "accepted") {
      console.log("User accepted the A2HS prompt");
    } else {
      console.log("User dismissed the A2HS prompt");
    }
    deferredPrompt = null;
  });
};
class App extends Component {
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Our NGS Game</h1>
          <button onClick={addToHomeScreen}>Add to Home Screen</button>
        </header>
        <PhaserContainer />
      </div>
    );
  }
}

export default App;
