import React from "react";
import axios from "./axios";
import ProfilePic from "./profilepic";
import { Uploader } from "./uploader";
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";

export class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            uploaderVisible: false
        };
        this.updatePic = this.updatePic.bind(this);
    }
    updatePic(url) {
        this.setState({
            avatar: url,
            uploaderVisible: false
        });
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
                            clickHandler={() =>
                                this.setState({ uploaderVisible: true })
                            }
                        />
                        <div className="modal">
                            {this.state.uploaderVisible && (
                                <Uploader updatePic={this.updatePic} />
                            )}
                        </div>
                    </header>
                </div>
            );
        }
    }
}
