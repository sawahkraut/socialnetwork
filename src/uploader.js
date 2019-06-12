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
                <Modal
                    isOpen={this.props.modal}
                    clickHandler={this.props.clickHandler}
                >
                    <ModalHeader>
                        Update your Profile Picture
                        <ProfilePic
                            imgUrl={this.props.imgUrl}
                            first={this.props.first}
                            last={this.props.last}
                        />
                    </ModalHeader>
                    <ModalBody>
                        <form onSubmit={e => this.submit(e)}>
                            <input
                                className="modalinput"
                                type="file"
                                name="file"
                                onChange={e => this.handleChange(e)}
                            />
                            <Button
                                color="secondary"
                                onClick={this.props.clickHandler}
                                disable={!this.state.profilePicture}
                                type="submit"
                            >
                                Upload
                            </Button>
                            {this.state.error && <p>{this.state.error}</p>}
                            <label>Upload Profile Photo</label>
                        </form>
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
