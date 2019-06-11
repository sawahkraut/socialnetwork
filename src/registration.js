import React from "react";
import axios from "./axios";
import { Link } from "react-router-dom";
import { Logo } from "./logo";
import { Input, Button, Form } from "reactstrap";

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

    submit(e) {
        e.preventDefault();
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
            <React.Fragment>
                <Logo />
                <div className="register-input">
                    <h1>Tomodachi</h1>
                    <p> {this.state.error} </p>
                    <h5>Register</h5>
                    <Form onSubmit={e => this.submit(e)}>
                        <Input
                            name="first"
                            placeholder="first name"
                            onChange={e => this.handleChange(e)}
                        />
                        <Input
                            name="last"
                            placeholder="surname"
                            onChange={e => this.handleChange(e)}
                        />
                        <Input
                            name="email"
                            placeholder="email"
                            onChange={e => this.handleChange(e)}
                        />
                        <Input
                            name="password"
                            placeholder="password"
                            type="password"
                            onChange={e => this.handleChange(e)}
                        />
                        <Button className="button" outline color="info">
                            submit
                        </Button>
                    </Form>
                    <p>
                        Already a member? &nbsp;| &nbsp;
                        <Link to="/login">Login</Link>
                    </p>
                </div>
            </React.Fragment>
        );
    }
} // closes registration class
