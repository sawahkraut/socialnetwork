import React from "react";
import axios from "./axios";
import { Link } from "react-router-dom";
import { Logo } from "./logo";

export class Login extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    } // closes login constructor
    handleChange({ target }) {
        this.setState({
            [target.name]: target.value
        });
    } // closes handleChange
    submit() {
        axios
            .post("/login", {
                email: this.state.email,
                password: this.state.password
            })
            .then(({ data }) => {
                if (data.success) {
                    location.replace("/logo");
                } else if (data.error) {
                    this.setState({
                        error: data.error
                    });
                }
            });
    } // closes submit

    render() {
        return (
            <div className="register-input">
                <Logo />
                <h1>Tomodachi</h1>
                <p> {this.state.error} </p>
                <h5>Login</h5>
                <input
                    name="email"
                    placeholder="email"
                    onChange={e => this.handleChange(e)}
                />
                <input
                    name="password"
                    placeholder="password"
                    type="password"
                    onChange={e => this.handleChange(e)}
                />
                <button
                    disabled={!this.state.password}
                    onClick={e => this.submit(e)}
                >
                    submit
                </button>
                <p>
                    Not a member yet? &nbsp;| &nbsp;
                    <Link to="/">Register</Link>
                </p>
            </div>
        );
    }
}
