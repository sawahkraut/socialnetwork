import React from "react";
import ReactDOM from "react-dom";
import { Welcome } from "./welcome";
import { Logo } from "./logo";

import "bootstrap/dist/css/bootstrap.min.css";
import "../public/css/background.css";
import "../public/css/styles.css";

let elem;
if (location.pathname == "/welcome") {
    elem = <Welcome />;
} else {
    elem = <Logo />;
}

ReactDOM.render(elem, document.querySelector("main"));
