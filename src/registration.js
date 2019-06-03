import React from "react";
import axios from "./axios";
import { Link } from "react-router-dom";
import { Logo } from "./logo";

export class Registration extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    } // closes registration constructor

    handleChange({ target }) {
        this.setState({
            [target.name]: target.value
        });
    } // closes handleChange

    submit() {
        axios
            .post("/register", {
                first: this.state.first,
                last: this.state.last,
                email: this.state.email,
                password: this.state.password
            })
            .then(({ data }) => {
                if (data.success) {
                    location.replace("/");
                    // console.log("user id exists :", data.userId);
                } else if (data.error) {
                    this.setState({
                        error: "Catastrophic Failure!"
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
                <h5>Register</h5>
                <input
                    name="first"
                    placeholder="first"
                    onChange={e => this.handleChange(e)}
                />
                <input
                    name="last"
                    placeholder="last"
                    onChange={e => this.handleChange(e)}
                />
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
                <button onClick={e => this.submit(e)}>submit</button>

                <p>
                    Already a member? &nbsp;| &nbsp;
                    <Link to="/login">Login</Link>
                </p>
            </div>
        );
    }
} // closes registration class
