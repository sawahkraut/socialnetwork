import React from "react";
import axios from "./axios";
import ProfilePic from "./profilepic";
import { Uploader } from "./uploader";
import { Profile } from "./profile";
import { BrowserRouter, Route } from "react-router-dom";
import { OtherProfile } from "./otherprofile";
import { FindUsers } from "./findusers";

export class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            uploaderVisible: false
        };
        this.updatePic = this.updatePic.bind(this);
        this.clickHandler = this.clickHandler.bind(this);
        this.setBio = this.setBio.bind(this);
    }
    setBio(bio) {
        this.setState({
            bio: bio
        });
    }
    updatePic(url) {
        this.setState({
            avatar: url,
            uploaderVisible: false
        });
    }
    clickHandler() {
        this.setState(
            this.state.uploaderVisible
                ? { uploaderVisible: false }
                : { uploaderVisible: true }
        );
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
                    <header className="header">
                        <img className="image" src="/img/panda3.svg" />

                        <React.Fragment />
                        <h4 className="nav">Find Friends</h4>
                        <a href="/" className="nav">
                            Logout
                        </a>
                        <ProfilePic
                            imgUrl={this.state.avatar}
                            first={this.state.first}
                        />

                        {this.state.uploaderVisible && (
                            <Uploader
                                imgUrl={this.state.avatar}
                                first={this.state.first}
                                updatePic={this.updatePic}
                                clickHandler={this.clickHandler}
                            />
                        )}
                    </header>
                    <h5 className="customHr" />
                    <BrowserRouter>
                        <div>
                            <Route
                                exact
                                path="/"
                                render={() => (
                                    <Profile
                                        imgUrl={this.state.avatar}
                                        bio={this.state.bio}
                                        first={this.state.first}
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
                            <Route path="/users" render={() => <FindUsers />} />
                        </div>
                    </BrowserRouter>
                </div>
            );
        }
    }
}
