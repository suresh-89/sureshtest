import React from "react";
import Spinner from "../../assets/Rolling.gif";

function Loading() {
    return (
        <div className="fp-container">
            <img src={Spinner} className="fp-loader" alt="loading" />
        </div>
    );
}

export default Loading;
