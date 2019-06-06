import React from "react";
import axios from "./axios";

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
            <div className="modal">
                <form onSubmit={e => this.submit(e)}>
                    <input
                        type="file"
                        name="file"
                        onChange={e => this.handleChange(e)}
                    />
                    <button disable={!this.state.profilePicture} type="submit">
                        upload
                    </button>
                    {this.state.error && <p>{this.state.error}</p>}
                    <label>upload profile photo</label>
                </form>
            </div>
        );
    }
}
