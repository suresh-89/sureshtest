import React, { Component } from "react";
import { Alert, Spinner, Navbar } from "react-bootstrap";
import { Redirect, Link } from "react-router-dom";
import { baseUrl, accountsUrl } from "../../shared/baseUrl.js";
import Loading from "../common/loader";
import logo from "../../assets/Iq-labs-01.svg";
import LoginFooter from "../common/LoginFooter.jsx";

class HODEmailVerification extends Component {
    constructor(props) {
        super(props);
        this.state = {
            firstName: "",
            lastName: "",
            username: "",
            password: "",
            confirmPassword: "",
            validToken: true,

            showErrorAlert: false,
            showSuccessAlert: false,
            showLoader: false,
            errors: "",
            successMsg: "",
            showPassword: false,
            showConfirmPassword: false,
            redirectLogin: false,
            page_loading: true,
        };
        this.tokenId = this.props.match.params.tokenId;
        this.url = baseUrl + accountsUrl;
        this.headers = {
            Accept: "application/json",
            "Content-Type": "application/json",
        };
    }

    componentDidMount = () => {
        document.title = "Account verification - HOD | IQLabs";

        fetch(`${this.url}/hod/activate/?activation_token=${this.tokenId}`, {
            headers: this.headers,
            method: "GET",
        })
            .then((res) => res.json())
            .then((result) => {
                this.setState({
                    validToken: result.sts === true ? true : false,
                    page_loading: false,
                });
            })
            .catch((err) => {
                console.log(err);
                this.setState({
                    validToken: false,
                    page_loading: false,
                });
            });
    };

    handleInput = (event) => {
        const name = event.target.name;
        const value = event.target.value;

        this.setState({
            [name]: value,
        });
    };

    handleSubmit = (event) => {
        event.preventDefault();
        this.setState({
            showErrorAlert: false,
            showSuccessAlert: false,
        });

        if (
            !this.state.firstName ||
            !this.state.lastName ||
            !this.state.username ||
            !this.state.password ||
            !this.state.confirmPassword
        ) {
            this.setState({
                errors: "All the fields are required",
                showErrorAlert: true,
            });
        } else if (this.state.password !== this.state.confirmPassword) {
            this.setState({
                errors: "Password doesn't match",
                showErrorAlert: true,
            });
        } else {
            this.setState({
                showLoader: true,
            });

            fetch(`${this.url}/hod/activate/`, {
                headers: this.headers,
                method: "POST",
                body: JSON.stringify({
                    token: this.tokenId,
                    first_name: this.state.firstName,
                    last_name: this.state.lastName,
                    username: this.state.username,
                    new_password: this.state.password,
                    confirm_password: this.state.confirmPassword,
                }),
            })
                .then((res) => res.json())
                .then((result) => {
                    if (result.sts === true) {
                        this.setState({
                            successMsg: result.msg,
                            showSuccessAlert: true,
                            showLoader: false,
                        });
                        setTimeout(() => {
                            this.setState({
                                redirectLogin: true,
                            });
                        }, 3000);
                    } else {
                        var errorMessage = "";
                        if (result.username) {
                            errorMessage = result.username[0];
                            this.setState({
                                errorMsg: errorMessage,
                            });
                        } else if (result.password) {
                            errorMessage = result.password[0];
                            this.setState({
                                errorMsg: errorMessage,
                            });
                        } else {
                            errorMessage = result.msg;
                            this.setState({
                                errorMsg: errorMessage,
                            });
                        }
                        this.setState({
                            showErrorAlert: true,
                            showLoader: false,
                        });
                    }
                })
                .catch((err) => {
                    console.log(err);
                    this.setState({
                        errorMsg: "Something went wrong!",
                        showErrorAlert: true,
                        showLoader: false,
                    });
                });
        }
    };

    showPassword = () => {
        this.setState({
            showPassword: !this.state.showPassword,
        });
    };

    showConfirmPassword = () => {
        this.setState({
            showConfirmPassword: !this.state.showConfirmPassword,
        });
    };

    render() {
        if (this.state.redirectLogin) {
            return <Redirect to="/hod/login" />;
        }
        return (
            <>
                <Navbar className="secondary-bg py-2 px-4">
                    <Navbar.Brand>
                        <Link to="/">
                            <img src={logo} alt="Logo" />
                        </Link>
                    </Navbar.Brand>
                </Navbar>

                {this.state.page_loading ? (
                    <Loading />
                ) : (
                    <>
                        <div className="container-fluid ">
                            <div
                                className="row justify-content-center py-3 align-items-center"
                                style={{ minHeight: "80vh" }}
                            >
                                <div className="col-md-4">
                                    {!this.state.validToken ? (
                                        <div className="card shadow">
                                            <div
                                                className="card-body text-center"
                                                style={{ padding: "4rem" }}
                                            >
                                                <h2 className="display-4 text-danger mb-3">
                                                    <i className="fas fa-times-circle"></i>
                                                </h2>
                                                <p className="h3 mb-0">
                                                    Invalid activation link!
                                                </p>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="card shadow">
                                            <div className="card-body">
                                                <Alert
                                                    variant="danger"
                                                    show={
                                                        this.state
                                                            .showErrorAlert
                                                    }
                                                    onClose={() => {
                                                        this.setState({
                                                            showErrorAlert: false,
                                                        });
                                                    }}
                                                    dismissible
                                                >
                                                    {this.state.errors}
                                                </Alert>
                                                <Alert
                                                    variant="success"
                                                    show={
                                                        this.state
                                                            .showSuccessAlert
                                                    }
                                                    onClose={() => {
                                                        this.setState({
                                                            showSuccessAlert: false,
                                                        });
                                                    }}
                                                    dismissible
                                                >
                                                    {this.state.successMsg}
                                                </Alert>

                                                <h4 className="primary-text">
                                                    HOD Activation
                                                </h4>
                                                <p className="small mb-4">
                                                    Please update your details
                                                </p>
                                                <form
                                                    onSubmit={this.handleSubmit}
                                                    autoComplete="off"
                                                >
                                                    <div className="form-group">
                                                        <label htmlFor="firstname">
                                                            First Name:
                                                        </label>

                                                        <input
                                                            type="text"
                                                            name="firstName"
                                                            value={
                                                                this.state
                                                                    .firstName
                                                            }
                                                            onChange={
                                                                this.handleInput
                                                            }
                                                            className="form-control form-shadow"
                                                            placeholder="Enter First Name"
                                                            id="firstname"
                                                        />
                                                    </div>
                                                    <div className="form-group">
                                                        <label htmlFor="lastname">
                                                            Last Name:
                                                        </label>

                                                        <input
                                                            type="text"
                                                            name="lastName"
                                                            value={
                                                                this.state
                                                                    .lastName
                                                            }
                                                            onChange={
                                                                this.handleInput
                                                            }
                                                            className="form-control form-shadow"
                                                            placeholder="Enter Last Name"
                                                            id="lastname"
                                                        />
                                                    </div>
                                                    <div className="form-group">
                                                        <label htmlFor="username">
                                                            Username:
                                                        </label>

                                                        <input
                                                            type="text"
                                                            name="username"
                                                            value={
                                                                this.state
                                                                    .username
                                                            }
                                                            onChange={
                                                                this.handleInput
                                                            }
                                                            className="form-control form-shadow"
                                                            placeholder="Enter username"
                                                            id="username"
                                                        />
                                                    </div>

                                                    <div className="form-group">
                                                        <label htmlFor="password">
                                                            Enter Password:
                                                        </label>
                                                        <div
                                                            className="input-group form-shadow"
                                                            style={{
                                                                borderRadius:
                                                                    "6px",
                                                            }}
                                                        >
                                                            <input
                                                                type={
                                                                    this.state
                                                                        .showPassword
                                                                        ? "text"
                                                                        : "password"
                                                                }
                                                                name="password"
                                                                id="password"
                                                                className="form-control"
                                                                onChange={
                                                                    this
                                                                        .handleInput
                                                                }
                                                                value={
                                                                    this.state
                                                                        .password
                                                                }
                                                                placeholder="**********"
                                                                required
                                                            />
                                                            <div className="input-group-append">
                                                                <button
                                                                    className="btn btn-link btn-sm bg-white shadow-none"
                                                                    type="button"
                                                                    onClick={
                                                                        this
                                                                            .showPassword
                                                                    }
                                                                >
                                                                    {this.state
                                                                        .showPassword ? (
                                                                        <i className="far fa-eye-slash"></i>
                                                                    ) : (
                                                                        <i className="far fa-eye"></i>
                                                                    )}
                                                                </button>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div className="form-group">
                                                        <label htmlFor="confirm_password">
                                                            Confirm Password:
                                                        </label>
                                                        <div
                                                            className="input-group form-shadow"
                                                            style={{
                                                                borderRadius:
                                                                    "6px",
                                                            }}
                                                        >
                                                            <input
                                                                type={
                                                                    this.state
                                                                        .showConfirmPassword
                                                                        ? "text"
                                                                        : "password"
                                                                }
                                                                name="confirmPassword"
                                                                id="confirm_password"
                                                                className="form-control"
                                                                onChange={
                                                                    this
                                                                        .handleInput
                                                                }
                                                                value={
                                                                    this.state
                                                                        .confirmPassword
                                                                }
                                                                placeholder="**********"
                                                                required
                                                            />
                                                            <div className="input-group-append">
                                                                <button
                                                                    className="btn btn-link btn-sm bg-white shadow-none"
                                                                    type="button"
                                                                    onClick={
                                                                        this
                                                                            .showConfirmPassword
                                                                    }
                                                                >
                                                                    {this.state
                                                                        .showConfirmPassword ? (
                                                                        <i className="far fa-eye-slash"></i>
                                                                    ) : (
                                                                        <i className="far fa-eye"></i>
                                                                    )}
                                                                </button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <button className="btn btn-primary btn-block">
                                                        {this.state
                                                            .showLoader ? (
                                                            <Spinner
                                                                as="span"
                                                                animation="border"
                                                                size="sm"
                                                                role="status"
                                                                aria-hidden="true"
                                                                className="mr-2"
                                                            />
                                                        ) : (
                                                            ""
                                                        )}
                                                        Submit
                                                    </button>
                                                </form>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        <LoginFooter />
                    </>
                )}
            </>
        );
    }
}

export default HODEmailVerification;
