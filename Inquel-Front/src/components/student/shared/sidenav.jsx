import React, { Component } from "react";
import { Link } from "react-router-dom";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import ContactInquelModal from "./contactModal";

class SideNav extends Component {
    constructor() {
        super();
        this.state = {
            showModal: false,
        };
    }

    render() {
        const active = this.props.activeLink;
        return (
            <>
                <ContactInquelModal
                    show={this.state.showModal}
                    onHide={() =>
                        this.setState({
                            showModal: false,
                        })
                    }
                />

                <div
                    id="sidebar"
                    className={`text-center light-bg ${
                        this.props.shownav ? "active" : ""
                    }`}
                    style={{ display: "flex", flexDirection: "column" }}
                >
                    <div>
                        <Link to="/dashboard">
                            <OverlayTrigger
                                key="right"
                                placement="right"
                                overlay={
                                    <Tooltip id="tooltip">Dashboard</Tooltip>
                                }
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
                        <Link to="/dashboard/leaderboard">
                            <OverlayTrigger
                                key="right"
                                placement="right"
                                overlay={
                                    <Tooltip id="tooltip">Leaderboard</Tooltip>
                                }
                            >
                                <button
                                    className={`btn sidebar-btn ${
                                        active === "leaderboard" ? "active" : ""
                                    } btn-sm mb-3`}
                                >
                                    <i
                                        className="fas fa-chart-bar"
                                        style={{ marginLeft: "-1.5px" }}
                                    ></i>
                                </button>
                            </OverlayTrigger>
                        </Link>
                        <Link to="/dashboard/study-planner">
                            <OverlayTrigger
                                key="right"
                                placement="right"
                                overlay={
                                    <Tooltip id="tooltip">
                                        Study Planner
                                    </Tooltip>
                                }
                            >
                                <button
                                    className={`btn sidebar-btn ${
                                        active === "calendar" ? "active" : ""
                                    } btn-sm mb-3`}
                                >
                                    <i className="far fa-calendar-alt"></i>
                                </button>
                            </OverlayTrigger>
                        </Link>
                        <Link to="/catalog">
                            <OverlayTrigger
                                key="right"
                                placement="right"
                                overlay={
                                    <Tooltip id="tooltip">
                                        Course Catalog
                                    </Tooltip>
                                }
                            >
                                <button
                                    className={`btn sidebar-btn ${
                                        active === "course" ? "active" : ""
                                    } btn-sm mb-3`}
                                >
                                    <i
                                        className="fas fa-cart-plus"
                                        style={{ marginLeft: "-2px" }}
                                    ></i>
                                </button>
                            </OverlayTrigger>
                        </Link>
                    </div>

                    <div className="mt-auto">
                        <OverlayTrigger
                            key="right"
                            placement="right"
                            overlay={
                                <Tooltip id="tooltip">Contact Inquel</Tooltip>
                            }
                        >
                            <button
                                className="btn sidebar-btn btn-sm shadow-none mb-2"
                                onClick={() =>
                                    this.setState({
                                        showModal: true,
                                    })
                                }
                            >
                                <i
                                    className="far fa-question-circle"
                                    style={{ marginLeft: "-0.8px" }}
                                ></i>
                            </button>
                        </OverlayTrigger>
                        <Link to="/about">
                            <OverlayTrigger
                                key="right"
                                placement="right"
                                overlay={
                                    <Tooltip id="tooltip">About INQUEL</Tooltip>
                                }
                            >
                                <button className="btn sidebar-btn btn-sm mb-2">
                                    <i
                                        className="fas fa-info-circle"
                                        style={{ marginLeft: "-1px" }}
                                    ></i>
                                </button>
                            </OverlayTrigger>
                        </Link>
                        <Link to="/privacy-policy">
                            <OverlayTrigger
                                key="right"
                                placement="right"
                                overlay={
                                    <Tooltip id="tooltip">
                                        Privacy Policy
                                    </Tooltip>
                                }
                            >
                                <button className="btn sidebar-btn btn-sm mb-2">
                                    <i
                                        className="fas fa-shield-alt"
                                        style={{ marginLeft: "-1px" }}
                                    ></i>
                                </button>
                            </OverlayTrigger>
                        </Link>
                        <Link to="/dashboard/settings">
                            <OverlayTrigger
                                key="right"
                                placement="right"
                                overlay={
                                    <Tooltip id="tooltip">Settings</Tooltip>
                                }
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
            </>
        );
    }
}

export default SideNav;
