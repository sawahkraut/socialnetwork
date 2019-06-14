import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import { getListOfFriends } from "./actions";
import ProfilePic from "./profilepic";

function Friends(props) {
    useEffect(() => {
        props.dispatch(getListOfFriends());
    }, []);

    return (
        <React.Fragment>
            {props.friends ? (
                props.friends.map(friend => (
                    <div key={friend.id}>
                        <Link to={`/user/${friend.id}`}>
                            <ProfilePic imgUrl={friend.avatar} />
                            {friend.first + " " + friend.last}
                        </Link>
                    </div>
                ))
            ) : (
                <p>No Users Found</p>
            )}
        </React.Fragment>
    );
}

const mapStateToProps = function(state) {
    return {
        friends:
            state.friends &&
            state.friends.filter(friend => friend.accepted == true),
        pending:
            state.friends &&
            state.friends.filter(pending => pending.accepted == false)
    };
};

export default connect(mapStateToProps)(Friends);
