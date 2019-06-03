import React from "react";
import { Registration } from "./registration";

export function Welcome() {
    return (
        <div className="welcome-page">
            <div className="welcome">
                <div className="logo">
                    <img src="/img/logo.jpeg" width="600px" />
                </div>
                <div className="register-form">
                    <Registration />
                </div>
            </div>
        </div>
    );
}
