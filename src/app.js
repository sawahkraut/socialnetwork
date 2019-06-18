import React from "react";
import axios from "./axios";
import ProfilePic from "./profilepic";
import { Uploader } from "./uploader";
import { Profile } from "./profile";
import { BrowserRouter, Route } from "react-router-dom";
import { OtherProfile } from "./otherprofile";
import { FindUsers } from "./findusers";
import { Link } from "react-router-dom";
import Friends from "./friends";
import Chat from "./chat";
import { Tooltip } from "reactstrap";

export class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            modal: false,
            tooltipOpen: false
        };
        this.updatePic = this.updatePic.bind(this);
        this.clickHandler = this.clickHandler.bind(this);
        this.setBio = this.setBio.bind(this);
        this.toggle = this.toggle.bind(this);
    }
    toggle() {
        this.setState({ tooltipOpen: !this.state.tooltipOpen });
    }
    setBio(bio) {
        this.setState({
            bio: bio
        });
    }
    updatePic(url) {
        this.setState({
            avatar: url,
            modal: false
        });
    }
    clickHandler() {
        this.setState(prevState => {
            // console.log(prevState);
            return { modal: !prevState.modal };
        });
    }
    logout() {
        axios.get("/logoutUser").then(({ data }) => {
            if (data.success) {
                this.props.history.push("/");
            }
        });
    }
    componentDidMount() {
        axios.get("/user").then(({ data }) => {
            // console.log("DATA!", data);
            this.setState(data);
        });
    }
    render() {
        if (!this.state.id) {
            return <p>Loading...</p>;
        } else {
            return (
                <div className="app">
                    <BrowserRouter>
                        <React.Fragment>
                            <header className="header">
                                <i className="fas fa-dragon fa-2x" />
                                <p className="nav">
                                    {"Kon'nichiwa,"} &nbsp;{" "}
                                    <div className="yourname">
                                        {this.state.first}
                                    </div>
                                    &nbsp;&nbsp;
                                </p>
                                <React.Fragment />
                                <Link to="/chat" className="nav">
                                    Chat
                                </Link>
                                <Link to="/users" className="nav">
                                    Search Tomodachi
                                </Link>
                                <Link to="/friends" className="nav">
                                    Your Tomodachi
                                </Link>
                                <Link to="/" className="nav">
                                    Profile
                                </Link>
                                <div>
                                    <Tooltip
                                        placement="right"
                                        isOpen={this.state.tooltipOpen}
                                        target="logout"
                                        toggle={this.toggle}
                                    >
                                        Logout
                                    </Tooltip>
                                    <a href="/logoutUser" id="logout">
                                        <i className="fas fa-sign-out-alt fa-1.5x" />
                                    </a>
                                </div>

                                <ProfilePic
                                    className={"navpic"}
                                    imgUrl={this.state.avatar}
                                    first={this.state.first}
                                />
                            </header>

                            {this.state.modal && (
                                <Uploader
                                    imgUrl={this.state.avatar}
                                    first={this.state.first}
                                    updatePic={this.updatePic}
                                    clickHandler={this.clickHandler}
                                    modal={this.state.modal}
                                />
                            )}

                            <h5 className="customHr" />
                            <div>
                                <Route
                                    exact
                                    path="/"
                                    render={() => (
                                        <Profile
                                            imgUrl={this.state.avatar}
                                            bio={this.state.bio}
                                            first={this.state.first}
                                            last={this.state.last}
                                            clickHandler={this.clickHandler}
                                            setBio={this.setBio}
                                        />
                                    )}
                                />
                                <Route
                                    path="/user/:id"
                                    render={props => (
                                        <OtherProfile
                                            key={props.match.url}
                                            match={props.match}
                                            history={props.history}
                                        />
                                    )}
                                />
                                <Route
                                    path="/users"
                                    render={() => <FindUsers />}
                                />
                                <Route path="/friends" component={Friends} />
                                <Route path="/chat" component={Chat} />
                            </div>
                        </React.Fragment>
                    </BrowserRouter>
                </div>
            );
        }
    }
}
// <img className="image" src="/img/panda3.svg" />
