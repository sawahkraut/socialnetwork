import React from "react";

export class Logo extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            count: 0,
            images: [
                "/img/panda1.svg",
                "/img/panda2.svg",
                "/img/panda3.svg",
                "/img/panda4.svg",
                "/img/panda5.svg",
                "/img/panda6.svg",
                "/img/panda7.svg",
                "/img/panda8.svg",
                "/img/panda9.svg"
            ]
        };
        this.updateCount = this.updateCount.bind(this);
    } // closes login constructor
    componentDidMount() {
        this.updateCount();
    }
    updateCount() {
        setInterval(() => {
            let newCount = this.state.count;
            newCount++;
            if (newCount == this.state.images.length) {
                newCount = 0;
            }
            this.setState({ count: newCount });
        }, 3000);
    }

    render() {
        console.log(this.state.count);
        return (
            <div className="logo">
                <img src={this.state.images[this.state.count]} />
            </div>
        );
    }
}

// this.state.url
// return (
//     <div>
//         <h1>Hello</h1>
//     </div>
// );
