import React from "react";
import { BrowserRouter } from "react-router-dom";
import routes from "./components/route";
import "./App.css";

function App() {
    return <BrowserRouter>{routes}</BrowserRouter>;
}

export default App;
