import React from "react";
import axios from "./axios";
import ProfilePic from "./profilepic";
import { Uploader } from "./uploader";
import { Logo } from "./logo";

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
                <div>
                    <React.Fragment>
                        <Logo />
                    </React.Fragment>
                    <ProfilePic
                        imgUrl={this.state.avatar}
                        first={this.state.first}
                        clickHandler={() =>
                            this.setState({ uploaderVisible: true })
                        }
                    />
                    {this.state.uploaderVisible && (
                        <Uploader updatePic={this.updatePic} />
                    )}
                </div>
            );
        }
    }
}
