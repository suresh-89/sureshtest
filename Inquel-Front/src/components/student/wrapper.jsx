import React, { useState } from "react";
import Header from "./shared/navbar";
import SideNav from "./shared/sidenav";
import { ErrorBoundary } from "react-error-boundary";
import ErrorFallback from "../common/ErrorFallback";
import { waterMark } from "../common/function/watermark";

const Wrapper = (props) => {
    const [showSideNav, setSideNav] = useState(false);

    return (
        <div className="wrapper">
            {/* Navbar */}
            <Header
                name={props.header}
                togglenav={() => setSideNav(!showSideNav)}
            />

            {/* Sidebar */}
            <SideNav shownav={showSideNav} activeLink={props.activeLink} />

            <div
                className={`section content ${showSideNav ? "active" : ""}`}
                style={props.waterMark ? waterMark(props.waterMark) : {}}
            >
                <div className="container-fluid">
                    {/* Back button */}
                    {!props.hideBackButton ? (
                        <button
                            className="btn btn-primary-invert btn-sm mb-3"
                            onClick={props.history.goBack}
                        >
                            <i className="fas fa-chevron-left fa-sm"></i> Back
                        </button>
                    ) : (
                        ""
                    )}

                    {/* Children component */}
                    <ErrorBoundary
                        FallbackComponent={ErrorFallback}
                        onReset={() => window.location.reload()}
                    >
                        {props.children}
                    </ErrorBoundary>
                </div>
            </div>
        </div>
    );
};

export default Wrapper;
