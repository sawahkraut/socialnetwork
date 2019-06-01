import React from "react";
import ReactDOM from "react-dom";
import { Welcome } from "./welcome";

let elem = <Welcome />;

ReactDOM.render(elem, document.querySelector("main"));

// let elem;
// if (location.pathname == "welcome") {
//     elem = <Welcome />;
// } else {
//     elem = <img src="" />;
// }

//
// ReactDOM.render(<HelloWorld />, document.querySelector("main"));
//
// function HelloWorld() {
//     return <div>Hello, World!</div>;
// }
