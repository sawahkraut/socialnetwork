import React from "react";
import axios from "./axios";
import ProfilePic from "./profilepic";
import { Uploader } from "./uploader";
import { Profile } from "./profile";

export class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            uploaderVisible: false
        };
        this.updatePic = this.updatePic.bind(this);
        this.clickHandler = this.clickHandler.bind(this);
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
            console.log("DATA!", data);
            this.setState(data);
        });
    }
    render() {
        if (!this.state.id) {
            return <p>loading</p>;
        } else {
            return (
                <div className="app">
                    <header className="header">
                        <img className="image" src="/img/panda3.svg" />

                        <React.Fragment />

                        <ProfilePic
                            imgUrl={this.state.avatar}
                            first={this.state.first}
                            clickHandler={this.clickHandler}
                        />

                        {this.state.uploaderVisible && (
                            <Uploader
                                updatePic={this.updatePic}
                                clickHandler={this.clickHandler}
                            />
                        )}
                    </header>
                    <h5 className="customHr" />
                    <Profile
                        imgUrl={this.state.avatar}
                        first={this.state.first}
                    />
                </div>
            );
        }
    }
}
