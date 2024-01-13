import React, { Component, useState } from "react";
import { Redirect, Link } from "react-router-dom";
import { Alert, Spinner, Navbar, Modal } from "react-bootstrap";
import { baseUrl, accountsUrl } from "../../shared/baseUrl.js";
import Loading from "./loader";
import logo from "../../assets/Iq-labs-01.svg";

export function ForgotPasswordModal(props) {
    const [email, setEmail] = useState("");
    const [errorMsg, setErrorMsg] = useState("");
    const [successMsg, setSuccessMsg] = useState("");
    const [showErrorAlert, setErrorAlert] = useState(false);
    const [showSuccessAlert, setSuccessAlert] = useState(false);
    const [showLoader, setLoader] = useState(false);

    function handleSubmit(event) {
        event.preventDefault();
        var url = baseUrl + accountsUrl;
        var authToken = localStorage.getItem("Authorization");
        var headers = {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: authToken,
        };

        setLoader(true);
        setErrorAlert(false);
        setSuccessAlert(false);

        fetch(`${url}/forgotpassword/`, {
            headers: headers,
            method: "POST",
            body: JSON.stringify({
                email: email,
            }),
        })
            .then((res) => res.json())
            .then((result) => {
                if (result.sts) {
                    setSuccessMsg(result.msg);
                    setSuccessAlert(true);
                    setLoader(false);
                    props.formSubmission();
                } else {
                    setErrorMsg(result.msg);
                    setErrorAlert(true);
                    setLoader(false);
                }
            })
            .catch((err) => {
                console.log(err);
            });
    }

    return (
        <Modal
            {...props}
            size="md"
            aria-labelledby="contained-modal-title-vcenter"
            centered
        >
            <Modal.Header closeButton>Forgot password</Modal.Header>
            <form onSubmit={handleSubmit} autoComplete="off">
                <Modal.Body>
                    <Alert
                        variant="danger"
                        show={showErrorAlert}
                        onClose={() => {
                            setErrorAlert(false);
                        }}
                        dismissible
                    >
                        {errorMsg}
                    </Alert>
                    <Alert
                        variant="success"
                        show={showSuccessAlert}
                        onClose={() => {
                            setSuccessAlert(false);
                        }}
                        dismissible
                    >
                        {successMsg}
                    </Alert>

                    <label htmlFor="email">Email</label>
                    <input
                        type="email"
                        name="email"
                        id="email"
                        className="form-control borders"
                        placeholder="Enter your email ID"
                        onChange={(event) => {
                            setEmail(event.target.value);
                        }}
                        required
                    />
                </Modal.Body>
                <Modal.Footer>
                    <button className="btn btn-primary btn-block shadow-none">
                        {showLoader ? (
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
                        Send Email
                    </button>
                </Modal.Footer>
            </form>
        </Modal>
    );
}

export class ForgotPassword extends Component {
    constructor(props) {
        super(props);
        this.state = {
            password: "",
            confirmPassword: "",

            errorMsg: "",
            successMsg: "",
            showErrorAlert: false,
            showSuccessAlert: false,
            showLoader: false,
            page_loading: true,

            showPassword: false,
            showConfirmPassword: false,
            validToken: true,
            redirectLogin: false,
        };
        this.authToken = this.props.match.params.authToken;
        this.url = baseUrl + accountsUrl;
        this.headers = {
            Accept: "application/json",
            "Content-Type": "application/json",
        };
    }

    componentDidMount = () => {
        document.title = "Forgot password | IQLabs";

        fetch(
            `${this.url}/resetpassword/?reset_password_token=${this.authToken}`,
            {
                method: "GET",
                headers: this.headers,
            }
        )
            .then((res) => res.json())
            .then((result) => {
                if (result.sts === true) {
                    this.setState({
                        validToken: true,
                        page_loading: false,
                    });
                } else {
                    this.setState({
                        validToken: false,
                        page_loading: false,
                    });
                }
            })
            .catch((err) => {
                console.log(err);
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
            showLoader: true,
            showErrorAlert: false,
            showSuccessAlert: false,
        });
        if (!this.state.password || !this.state.confirmPassword) {
            this.setState({
                errorMsg: "All the fields are required",
                showErrorAlert: true,
                showLoader: false,
            });
        } else if (this.state.password !== this.state.confirmPassword) {
            this.setState({
                errorMsg: "Password doesn't match",
                showErrorAlert: true,
                showLoader: false,
            });
        } else {
            fetch(`${this.url}/resetpassword/`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Accept: "application/json",
                },
                body: JSON.stringify({
                    password: this.state.password,
                    confirm_password: this.state.confirmPassword,
                    reset_password_token: this.authToken,
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
                        this.setState({
                            errorMsg: result.msg,
                            showErrorAlert: true,
                            showLoader: false,
                        });
                    }
                })
                .catch((err) => {
                    console.log(err);
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
            return <Redirect to="/" />;
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
                                className="row justify-content-center align-items-center"
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
                                                <p className="h4 mb-0">
                                                    Invalid link!
                                                </p>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="card shadow-sm">
                                            <div className="card-body">
                                                <h5 className="primary-text mb-4">
                                                    Update password
                                                </h5>
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
                                                    {this.state.errorMsg}
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
                                                <form
                                                    onSubmit={this.handleSubmit}
                                                >
                                                    <div className="form-group ">
                                                        <label htmlFor="password">
                                                            New Password
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
                                                            Confirm Password
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
                                                    <div className="form-group">
                                                        <button className="btn btn-primary btn-block shadow-none">
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
                                                    </div>
                                                </form>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        <footer className="primary-bg p-4">
                            <div className="container-fluid">
                                <div className="row">
                                    <div className="col-md-6">
                                        <p className="mb-3 mb-md-0 text-white text-center text-md-left">
                                            &copy;{new Date().getFullYear()}{" "}
                                            Inquel inc. Powered By{" "}
                                            <a
                                                href="https://sachirva.com/"
                                                target="_blank"
                                                rel="noreferrer"
                                                className="secondary-text"
                                            >
                                                Sachirva Technology Solutions
                                            </a>
                                        </p>
                                    </div>
                                    <div className="col-md-6 ">
                                        <div className="d-flex justify-content-center justify-content-md-end ">
                                            <Link to="/" className="text-white">
                                                <i className="fab fa-facebook-f mr-4"></i>
                                            </Link>
                                            <Link to="/" className="text-white">
                                                <i className="fab fa-twitter mr-4"></i>
                                            </Link>
                                            <Link to="/" className="text-white">
                                                <i className="fab fa-instagram mr-4"></i>
                                            </Link>
                                            <Link to="/" className="text-white">
                                                <i className="fab fa-linkedin-in mr-4"></i>
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </footer>
                    </>
                )}
            </>
        );
    }
}
