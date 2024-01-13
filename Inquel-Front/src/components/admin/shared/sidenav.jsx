import React, { Component } from "react";
import { Link } from "react-router-dom";
import { OverlayTrigger, Tooltip, Dropdown } from "react-bootstrap";

class SideNav extends Component {
    render() {
        const active = this.props.activeLink;
        return (
            <div
                id="sidebar"
                className={`text-center light-bg ${
                    this.props.shownav ? "active" : ""
                }`}
                style={{
                    display: "flex",
                    flexDirection: "column",
                    overflow: "unset",
                }}
            >
                <div>
                    <Link to="/admin">
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

                    <Link to="/admin/profiles">
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
                                    style={{ marginLeft: "-2.5px" }}
                                ></i>
                            </button>
                        </OverlayTrigger>
                    </Link>

                    <Dropdown drop="right" key="right">
                        <OverlayTrigger
                            key="master"
                            placement="right"
                            overlay={
                                <Tooltip id="tooltip">Master Data</Tooltip>
                            }
                        >
                            <Dropdown.Toggle
                                variant="white"
                                className={`btn sidebar-btn btn-sm shadow-none caret-off mb-3 ${
                                    active === "data" ? "active" : ""
                                }`}
                            >
                                <i className="fas fa-database"></i>
                            </Dropdown.Toggle>
                        </OverlayTrigger>

                        <Dropdown.Menu className="dropdown-menu-right">
                            <Dropdown.Item as={Link} to="/admin/master-data">
                                Master Data
                            </Dropdown.Item>
                            <Dropdown.Item as={Link} to="/admin/discounts">
                                Discount Configuration
                            </Dropdown.Item>
                        </Dropdown.Menu>
                    </Dropdown>

                    <Link to="/admin/website">
                        <OverlayTrigger
                            key="website"
                            placement="right"
                            overlay={
                                <Tooltip id="tooltip">
                                    Website management
                                </Tooltip>
                            }
                        >
                            <button
                                className={`btn sidebar-btn ${
                                    active === "website" ? "active" : ""
                                } btn-sm mb-3`}
                            >
                                <i className="fas fa-globe"></i>
                            </button>
                        </OverlayTrigger>
                    </Link>
                </div>
                <div className="mt-auto">
                    <Link to="/admin/settings">
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
