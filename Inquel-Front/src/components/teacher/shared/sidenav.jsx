import React, { Component } from "react";
import { Link } from "react-router-dom";
import { OverlayTrigger, Tooltip } from "react-bootstrap";

class SideNav extends Component {
    render() {
        const active = this.props.activeLink;
        return (
            <div
                id="sidebar"
                className={`text-center light-bg ${
                    this.props.shownav ? "active" : ""
                }`}
                style={{ display: "flex", flexDirection: "column" }}
            >
                <div>
                    <Link to="/teacher">
                        <OverlayTrigger
                            key="right"
                            placement="right"
                            overlay={<Tooltip id="tooltip">Dashboard</Tooltip>}
                        >
                            <button
                                className={`btn sidebar-btn ${
                                    active === "dashboard" ? "active" : ""
                                } btn-sm mb-3`}
                            >
                                <i
                                    className="fas fa-tachometer-alt"
                                    style={{ marginLeft: "-1.5px" }}
                                ></i>
                            </button>
                        </OverlayTrigger>
                    </Link>
                    <Link to="/teacher/student">
                        <OverlayTrigger
                            key="right"
                            placement="right"
                            overlay={<Tooltip id="tooltip">Profiles</Tooltip>}
                        >
                            <button
                                className={`btn sidebar-btn ${
                                    active === "profiles" ? "active" : ""
                                } btn-sm mb-3`}
                            >
                                <i
                                    className="fas fa-users"
                                    style={{ marginLeft: "-1.5px" }}
                                ></i>
                            </button>
                        </OverlayTrigger>
                    </Link>
                    <Link to="/teacher/profile">
                        <OverlayTrigger
                            key="right"
                            placement="right"
                            overlay={<Tooltip id="tooltip">My Profile</Tooltip>}
                        >
                            <button
                                className={`btn sidebar-btn ${
                                    active === "account" ? "active" : ""
                                } btn-sm mb-3`}
                            >
                                <i className="fas fa-user-circle"></i>
                            </button>
                        </OverlayTrigger>
                    </Link>
                </div>
                <div className="mt-auto">
                    <Link to="/teacher/settings">
                        <OverlayTrigger
                            key="right"
                            placement="right"
                            overlay={<Tooltip id="tooltip">Settings</Tooltip>}
                        >
                            <button
                                className={`btn sidebar-btn ${
                                    active === "settings" ? "active" : ""
                                } btn-sm mb-3`}
                            >
                                <i
                                    className="fas fa-cog"
                                    style={{ marginLeft: "-1px" }}
                                ></i>
                            </button>
                        </OverlayTrigger>
                    </Link>
                </div>
            </div>
        );
    }
}

export default SideNav;
