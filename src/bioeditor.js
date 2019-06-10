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
            <div className="bio">
                {this.props.bio && !this.state.bioEditorVisible && (
                    <div>
                        {this.props.bio}
                        <button onClick={() => this.openBioEditor()}>
                            Edit Bio
                        </button>
                    </div>
                )}
                {!this.props.bio && !this.state.bioEditorVisible && (
                    <div>
                        <button onClick={() => this.openBioEditor()}>
                            {" "}
                            Add Bio
                        </button>
                    </div>
                )}
                {this.state.bioEditorVisible && (
                    <div>
                        <p>Bio:</p>
                        <textarea
                            className="bioinput"
                            defaultValue={this.props.bio}
                            onChange={e => this.handleChange(e)}
                        />
                        <div className="savebutton">
                            <button type="submit" onClick={() => this.submit()}>
                                save
                            </button>
                        </div>
                    </div>
                )}
            </div>
        );
    }
}
