import React from "react";
import { HashRouter, Route } from "react-router-dom";
import { Registration } from "./registration";
import { Login } from "./login";

export function Welcome() {
    return (
        <div id="welcome">
            <HashRouter>
                <React.Fragment>
                    <Route exact path="/" component={Registration} />
                    <Route path="/login" component={Login} />
                </React.Fragment>
            </HashRouter>
        </div>
    );
}
