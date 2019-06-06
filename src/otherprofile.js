import React from "react";
import axios from "./axios";

export default class OtherProfile extends React.Component {
    constructor() {
        super();
        this.state = {};
    }
    componentDidMount() {
        console.log("this.props.match.params.id:", this.props.match.params.id);
    }
    render() {
        return (
            <div>
                <h1 />
            </div>
        );
    }
}
