import React from "react";
import axios from "./axios";
import ProfilePic from "./profilepic";
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";

export class Uploader extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            profilePicture: null,
            avatar: null
        };
    }

    handleChange(e) {
        this.setState({
            profilePicture: e.target.files[0],
            loaded: 0
        });
    }
    submit(e) {
        e.preventDefault();
        const data = new FormData();
        data.append("file", this.state.profilePicture);
        axios.post("/upload", data).then(response => {
            console.log("new img", response.data);
            this.props.updatePic(response.data);
        });
    }
    render() {
        return (
            <div>
                <Modal isOpen={this.props.modal}>
                    <ModalHeader>
                        Update your Profile Picture
                        <ProfilePic
                            imgUrl={this.props.imgUrl}
                            first={this.props.first}
                            last={this.props.last}
                        />
                    </ModalHeader>
                    <ModalBody>
                        <form>
                            <input
                                className="modalinput"
                                type="file"
                                name="file"
                                onChange={e => this.handleChange(e)}
                            />
                        </form>
                        <Button
                            color="secondary"
                            onClick={e => {
                                this.props.clickHandler;
                                this.submit(e);
                            }}
                            disable={!this.state.profilePicture + ""}
                        >
                            Upload
                        </Button>
                        {this.state.error && <p>{this.state.error}</p>}
                        <label>Upload Profile Photo</label>
                    </ModalBody>
                    <ModalFooter>
                        <Button color="info" onClick={this.props.clickHandler}>
                            Close
                        </Button>
                    </ModalFooter>
                </Modal>
            </div>
        );
    }
}
