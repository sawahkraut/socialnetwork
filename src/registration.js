import React from "react";
import axios from "axios";

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
                        error: "Oopsie, something went wrong. Please try again!"
                    });
                }
            });
    } // closes submit

    render() {
        return (
            <div className="register-input">
                <h1>Find fellow dog walkers</h1>
                <p> {this.state.error} </p>

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
                    Already a member? <a href="#"> Login </a>
                </p>
            </div>
        );
    }
} // closes registration class
