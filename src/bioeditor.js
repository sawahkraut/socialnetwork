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
            bioEditorIsVisible: true
        });
    }

    submit() {
        axios
            .post("/profile", { bio: this.state.bio })
            .then(results => {
                console.log("results ", results);
                this.setState({
                    bioEditorIsVisible: false
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
                {this.props.bio && !this.state.bioEditorIsVisible && (
                    <div>
                        {this.props.bio}
                        <button onClick={() => this.openBioEditor()}>
                            edit
                        </button>
                    </div>
                )}
                {!this.props.bio && !this.state.bioEditorIsVisible && (
                    <div>
                        <button onClick={() => this.openBioEditor()}>
                            {" "}
                            add bio
                        </button>
                    </div>
                )}
                {this.state.bioEditorIsVisible && (
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
