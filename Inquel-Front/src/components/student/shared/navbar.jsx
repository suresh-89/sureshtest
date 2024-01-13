import React, { Component } from "react";
import { Navbar, Nav, Dropdown } from "react-bootstrap";
import { Link, Redirect } from "react-router-dom";
import logo from "../../../assets/Iq-labs-01.svg";
import userpic from "../../../assets/user-v1.png";
import { baseUrl, accountsUrl, studentUrl } from "../../../shared/baseUrl";
import { Logout } from "../../common/modal/idleLogoutModal";
import { connect } from "react-redux";
import storeDispatch from "../../../redux/dispatch";
import { PROFILE, RESET_STATE } from "../../../redux/action";
import { NotificationDropdown } from "../../common/modal/notification";

const mapStateToProps = (state) => ({
    profile: state.user.profile,
    cart_count: state.application.cart_count,
    exam_state: state.application.exam_state,
});

class Header extends Component {
    constructor(props) {
        super(props);
        this.state = { isLoggedOut: false };
        this.url = baseUrl + accountsUrl;
        this.authToken = localStorage.getItem("Authorization");
        this.headers = {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: this.authToken,
        };
    }

    componentDidUpdate = (prevProps) => {
        if (prevProps.profile === this.props.profile) {
            if (
                this.props.profile &&
                Object.keys(this.props.profile).length === 0
            ) {
                if (this.state.isLoggedOut === false) {
                    this.loadProfileData();
                }
            }
        }
    };

    loadProfileData = () => {
        fetch(`${baseUrl + studentUrl}/student/profile/`, {
            method: "GET",
            headers: this.headers,
        })
            .then((res) => res.json())
            .then((result) => {
                if (result.sts === true) {
                    storeDispatch(PROFILE, result.data);
                }
            })
            .catch((err) => {
                console.log(err);
            });
    };

    handleLogout = () => {
        let status = true;
        if (this.props.exam_state.examStarted === true) {
            status = window.confirm(
                "Are you sure you want to logout? You have one unfinished exam"
            );
        }

        if (status === true) {
            fetch(`${this.url}/logout/`, {
                headers: this.headers,
                method: "POST",
            })
                .then((res) => res.json())
                .then((result) => {
                    localStorage.clear();
                    storeDispatch(RESET_STATE);

                    this.setState({
                        isLoggedOut: true,
                    });
                })
                .catch((err) => {
                    console.log(err);
                });
        }
    };

    render() {
        if (this.state.isLoggedOut) {
            return <Redirect to="/" />;
        }
        return (
            <>
                <Logout path="student" />
                <Navbar
                    variant="light"
                    className="shadow-sm fixed-top bg-white justify-content-center"
                >
                    <div className="row align-items-center justify-content-between w-100">
                        <div className="col-md-3 col-6 pl-0">
                            <Navbar.Brand className="d-flex align-items-center mr-0">
                                <button
                                    className="btn btn-outline-secondary btn-sm border-0 shadow-none d-block d-md-none mr-1"
                                    onClick={this.props.togglenav}
                                >
                                    <i className="fas fa-bars"></i>
                                </button>
                                <Link to="/">
                                    <img src={logo} alt="Logo" />
                                </Link>
                            </Navbar.Brand>
                        </div>

                        <div className="col-6 d-none d-md-block">
                            <h5 className="primary-text text-center font-weight-bold-600 mb-0 text-truncate">
                                {this.props.name}
                            </h5>
                        </div>

                        <div className="col-md-3 col-6 d-flex justify-content-end pr-0">
                            <Nav className="ml-auto">
                                {/* Notification */}
                                <NotificationDropdown
                                    path="/dashboard"
                                    url={`${baseUrl}${studentUrl}/student/notification/`}
                                    headers={this.headers}
                                />

                                <Nav.Link
                                    as={Link}
                                    to="/cart"
                                    className="position-relative"
                                >
                                    <i className="fas fa-shopping-cart mr-2 mt-2"></i>
                                    <div
                                        className="d-flex align-items-center justify-content-center bg-danger rounded-circle"
                                        style={{
                                            width: "12px",
                                            height: "12px",
                                            position: "absolute",
                                            top: "4px",
                                            left: "22px",
                                            fontSize: "7.5px",
                                            fontWeight: "500",
                                            color: "white",
                                            textAlign: "center",
                                        }}
                                    >
                                        {this.props.cart_count}
                                    </div>
                                </Nav.Link>

                                <Dropdown>
                                    <Dropdown.Toggle
                                        variant="light"
                                        className="bg-white border-0 nav-link shadow-none"
                                        id="dropdown-basic"
                                    >
                                        <img
                                            src={
                                                this.props.profile &&
                                                Object.keys(this.props.profile)
                                                    .length !== 0
                                                    ? this.props.profile
                                                          .profile_link &&
                                                      this.props.profile
                                                          .profile_link !== null
                                                        ? this.props.profile
                                                              .profile_link
                                                        : userpic
                                                    : userpic
                                            }
                                            alt={
                                                this.props.profile &&
                                                Object.keys(this.props.profile)
                                                    .length !== 0
                                                    ? this.props.profile
                                                          .username
                                                    : ""
                                            }
                                            className="profile-img-circle mr-1"
                                        />{" "}
                                        <span className="d-none d-md-inline">
                                            {this.props.profile &&
                                            Object.keys(this.props.profile)
                                                .length !== 0
                                                ? this.props.profile.username
                                                : ""}
                                        </span>
                                    </Dropdown.Toggle>

                                    <Dropdown.Menu className="dropdown-menu-down">
                                        <Dropdown.Header className="d-block d-md-none font-weight-bold-600 text-center">
                                            Hi,{" "}
                                            <span className="primary-text">
                                                {this.props.profile &&
                                                Object.keys(this.props.profile)
                                                    .length !== 0
                                                    ? this.props.profile
                                                          .username
                                                    : ""}
                                            </span>
                                        </Dropdown.Header>

                                        <Dropdown.Item
                                            as={Link}
                                            to="/dashboard/profile"
                                        >
                                            <i className="fas fa-user fa-sm mr-2"></i>{" "}
                                            My Profile
                                        </Dropdown.Item>

                                        <Dropdown.Item
                                            as={Link}
                                            to="/dashboard/invoice"
                                        >
                                            <i className="fas fa-file-invoice mr-2"></i>{" "}
                                            Invoice
                                        </Dropdown.Item>

                                        <Dropdown.Divider />

                                        <Dropdown.Item
                                            onClick={this.handleLogout}
                                        >
                                            <i className="fas fa-sign-out-alt mr-2"></i>{" "}
                                            Logout
                                        </Dropdown.Item>
                                    </Dropdown.Menu>
                                </Dropdown>
                            </Nav>
                        </div>
                    </div>
                </Navbar>
            </>
        );
    }
}

export default connect(mapStateToProps)(Header);
