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

    async handleChange(e) {
        await this.setState({
            profilePicture: e.target.files[0],
            loaded: 0
        });
        this.submit(e);
    }
    submit(e) {
        e.preventDefault();
        const data = new FormData();
        data.append("file", this.state.profilePicture);
        data.append("imgUrl", this.props.imgUrl);
        axios.post("/upload", data).then(response => {
            console.log("new img", response.data);
            this.props.updatePic(response.data);
        });
    }
    delete() {
        // console.log("axios post props.imgurl", { imgUrl: this.props.imgUrl });
        axios
            .post("/delete-account", { imgUrl: this.props.imgUrl })
            .then(response => {
                console.log(response);
                location.replace("/register");
            });
    }
    render() {
        return (
            <div>
                <Modal isOpen={this.props.modal}>
                    <ModalHeader>
                        Update your Profile Picture
                        <ProfilePic
                            className={"modalpic"}
                            imgUrl={this.props.imgUrl}
                            first={this.props.first}
                            last={this.props.last}
                        />
                    </ModalHeader>
                    <ModalBody>
                        <form className="upload-btn-wrapper">
                            <input
                                type="file"
                                name="file"
                                onChange={e => this.handleChange(e)}
                            />
                            <button className="uploadbtn">
                                Change Profile Picture
                            </button>
                        </form>
                        {this.state.error && <p>{this.state.error}</p>}
                    </ModalBody>
                    <ModalFooter>
                        <Button color="danger" onClick={() => this.delete()}>
                            Delete Account
                        </Button>
                        <Button
                            outline
                            color="secondary"
                            onClick={this.props.clickHandler}
                        >
                            Close
                        </Button>
                    </ModalFooter>
                </Modal>
            </div>
        );
    }
}
