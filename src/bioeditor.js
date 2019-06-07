import React from "react";
import axios from "./axios";

export default class BioEditor extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    handleChange({ target }) {
        this.setState({
            bio: target.value
        });
    }

    openBioEditor() {
        this.setState({
            bioEditorVisible: true
        });
    }

    submit() {
        axios
            .post("/editbio", { bio: this.state.bio })
            .then(results => {
                console.log("results ", results);
                this.setState({
                    bioEditorVisible: false
                });
                this.props.setBio(this.state.bio);
            })
            .catch(err => {
                console.log("profile bioeditor ", err);
            });
    }

    render() {
        return (
            <div>
                {this.props.bio && !this.state.bioEditorVisible && (
                    <div>
                        {this.props.bio}
                        <button onClick={() => this.openBioEditor()}>
                            edit
                        </button>
                    </div>
                )}
                {!this.props.bio && !this.state.bioEditorVisible && (
                    <div>
                        <button onClick={() => this.openBioEditor()}>
                            {" "}
                            add bio
                        </button>
                    </div>
                )}
                {this.state.bioEditorVisible && (
                    <div>
                        <p>write your bio:</p>
                        <textarea
                            defaultValue={this.props.bio}
                            onChange={e => this.handleChange(e)}
                        />
                        <button type="submit" onClick={() => this.submit()}>
                            save
                        </button>
                    </div>
                )}
            </div>
        );
    }
}
