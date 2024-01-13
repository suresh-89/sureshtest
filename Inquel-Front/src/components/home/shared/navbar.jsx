import React from "react";
import logo from "../../../assets/Iq-labs-01.svg";
import { Navbar, Nav, Dropdown } from "react-bootstrap";
import { Link } from "react-router-dom";
import userpic from "../../../assets/user-v1.png";
import { baseUrl, accountsUrl, studentUrl } from "../../../shared/baseUrl";
import { Logout } from "../../common/modal/idleLogoutModal";
import { connect } from "react-redux";
import storeDispatch from "../../../redux/dispatch";
import { RESET_STATE } from "../../../redux/action";
import StudyGuideDropdown from "./StudyGuideDropdown";

const mapStateToProps = (state) => ({
    profile: state.user.profile,
    cart_count: state.application.cart_count,
});

class TopNavbar extends React.Component {
    constructor(props) {
        super(props);
        this.state = { isLoggedOut: false, cart_count: 0 };
        this.url = baseUrl + accountsUrl;
        this.studentURL = baseUrl + studentUrl;
        this.authToken = localStorage.getItem("Authorization");
        this.headers = {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: this.authToken,
        };
    }

    handleLogout = () => {
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

                window.location.reload();
            })
            .catch((err) => {
                console.log(err);
            });
    };

    render() {
        return (
            <>
                <Logout path="student" />
                <Navbar
                    collapseOnSelect
                    expand="lg"
                    variant="light"
                    className="shadow-sm secondary-bg sticky-top"
                >
                    <div className="container-fluid">
                        <Navbar.Brand>
                            <Link to="/">
                                <img src={logo} alt="Logo" />
                            </Link>
                        </Navbar.Brand>

                        <Navbar.Toggle aria-controls="responsive-navbar-nav" />

                        <Navbar.Collapse
                            id="responsive-navbar-nav"
                            style={{ flexGrow: "0" }}
                            className="ml-auto"
                        >
                            <Nav className="align-items-md-center">
                                <StudyGuideDropdown />

                                <Nav.Link
                                    as={Link}
                                    to="/features"
                                    className={`text-dark ${
                                        this.props.activeLink
                                            ? this.props.activeLink ===
                                              "features"
                                                ? "active"
                                                : ""
                                            : ""
                                    } mr-md-3`}
                                >
                                    Features
                                </Nav.Link>

                                {/* <Nav.Link
                                    as={Link}
                                    to="/leaderboard"
                                    className={`text-dark ${
                                        this.props.activeLink
                                            ? this.props.activeLink ===
                                              "leaderboard"
                                                ? "active"
                                                : ""
                                            : ""
                                    } mr-md-3`}
                                >
                                    Leader Board
                                </Nav.Link> */}

                                <Nav.Link
                                    as={Link}
                                    to="/catalog"
                                    className={`text-dark ${
                                        this.props.activeLink
                                            ? this.props.activeLink === "course"
                                                ? "active"
                                                : ""
                                            : ""
                                    } mr-md-3`}
                                >
                                    Buy a Course
                                </Nav.Link>

                                <Nav.Link
                                    as={Link}
                                    to="/cart"
                                    className={`text-dark position-relative ${
                                        this.props.activeLink
                                            ? this.props.activeLink === "cart"
                                                ? "active"
                                                : ""
                                            : ""
                                    } mr-md-3`}
                                >
                                    <i className="fas fa-shopping-cart mr-1"></i>{" "}
                                    Cart
                                    {localStorage.getItem("Authorization") &&
                                    localStorage.getItem("is_student") ? (
                                        <div
                                            className="d-flex align-items-center justify-content-center bg-danger rounded-circle"
                                            style={{
                                                width: "12px",
                                                height: "12px",
                                                position: "absolute",
                                                top: "2px",
                                                left: "22px",
                                                fontSize: "7.5px",
                                                fontWeight: "500",
                                                color: "white",
                                                textAlign: "center",
                                            }}
                                        >
                                            {this.props.cart_count}
                                        </div>
                                    ) : (
                                        ""
                                    )}
                                </Nav.Link>

                                {!localStorage.getItem("Authorization") ||
                                !localStorage.getItem("is_student") ? (
                                    <>
                                        <Dropdown>
                                            <Dropdown.Toggle
                                                variant="light"
                                                className="btn btn-outline-primary btn-sm shadow-none px-3 caret-off rounded-pill"
                                                id="dropdown-basic"
                                            >
                                                Login
                                            </Dropdown.Toggle>

                                            <Dropdown.Menu className="dropdown-menu-down border-0">
                                                <Dropdown.Item
                                                    as={Link}
                                                    to="/login"
                                                >
                                                    For Student
                                                </Dropdown.Item>
                                                <Dropdown.Item
                                                    as={Link}
                                                    to="/teacher/login"
                                                >
                                                    For Teacher
                                                </Dropdown.Item>
                                                <Dropdown.Item
                                                    as={Link}
                                                    to="/hod/login"
                                                >
                                                    For HOD
                                                </Dropdown.Item>
                                            </Dropdown.Menu>
                                        </Dropdown>
                                        <Nav.Link as={Link} to="/register">
                                            <button className="btn btn-primary btn-sm rounded-pill px-3">
                                                Sign Up
                                            </button>
                                        </Nav.Link>
                                    </>
                                ) : (
                                    ""
                                )}

                                {localStorage.getItem("Authorization") &&
                                localStorage.getItem("is_student") ? (
                                    <Dropdown>
                                        <Dropdown.Toggle
                                            variant="light"
                                            className="secondary-bg border-0 nav-link shadow-none"
                                            id="dropdown-basic"
                                        >
                                            <img
                                                src={
                                                    this.props.profile &&
                                                    Object.keys(
                                                        this.props.profile
                                                    ).length !== 0
                                                        ? this.props.profile
                                                              .profile_link &&
                                                          this.props.profile
                                                              .profile_link !==
                                                              null
                                                            ? this.props.profile
                                                                  .profile_link
                                                            : userpic
                                                        : userpic
                                                }
                                                alt={
                                                    this.props.profile &&
                                                    Object.keys(
                                                        this.props.profile
                                                    ).length !== 0
                                                        ? this.props.profile
                                                              .username
                                                        : ""
                                                }
                                                className="profile-img-circle mr-1"
                                            />{" "}
                                            {this.props.profile &&
                                            Object.keys(this.props.profile)
                                                .length !== 0
                                                ? this.props.profile.username
                                                : ""}
                                        </Dropdown.Toggle>

                                        <Dropdown.Menu className="dropdown-menu-down border-0">
                                            <Dropdown.Item
                                                as={Link}
                                                to="/dashboard"
                                            >
                                                <i className="fas fa-tachometer-alt fa-sm mr-2"></i>{" "}
                                                Dashboard
                                            </Dropdown.Item>
                                            <Dropdown.Item
                                                as={Link}
                                                to="/dashboard/profile"
                                            >
                                                <i className="fas fa-user fa-sm mr-2"></i>{" "}
                                                My Profile
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
                                ) : (
                                    ""
                                )}
                            </Nav>
                        </Navbar.Collapse>
                    </div>
                </Navbar>
            </>
        );
    }
}

export default connect(mapStateToProps)(TopNavbar);
