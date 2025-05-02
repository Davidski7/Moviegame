import React from "react";
import "../style/app.scss";
import Fetch from "../components/fetch";

function App() {
  return (
    <>
      <header>
        <h1>🎬 Film Quiz</h1>
      </header>
      <main>
        <Fetch />
      </main>
    </>
  );
}

export default App;
