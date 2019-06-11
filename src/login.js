import React from "react";
import axios from "./axios";
import { Link } from "react-router-dom";
import { Logo } from "./logo";
import { Input, Button, Form } from "reactstrap";

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
    submit(e) {
        e.preventDefault();
        axios
            .post("/login", {
                email: this.state.email,
                password: this.state.password
            })
            .then(({ data }) => {
                if (data.success) {
                    location.replace("/");
                } else if (data.error) {
                    this.setState({
                        error: data.error
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
                    <h5>Login</h5>
                    <Form onSubmit={e => this.submit(e)}>
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
                        <Button
                            className="button"
                            type="submit"
                            outline
                            color="info"
                            disabled={!this.state.password}
                        >
                            submit
                        </Button>
                    </Form>
                    <p>
                        Not a member yet? &nbsp;| &nbsp;
                        <Link to="/">Register</Link>
                    </p>
                </div>
            </React.Fragment>
        );
    }
}
