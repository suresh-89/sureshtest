import React, { Component, useState } from "react";
import TopNavBar from "../home/shared/navbar";
import LoginFooter from "../common/LoginFooter";
import { Alert, Spinner } from "react-bootstrap";
import { Link, Redirect } from "react-router-dom";
import {
    baseUrl,
    accountsUrl,
    adminPathUrl,
    studentUrl,
} from "../../shared/baseUrl.js";
import { ForgotPasswordModal } from "../common/forgotPassword";
import storeDispatch from "../../redux/dispatch";
import { PROFILE, RESET_STATE } from "../../redux/action/index.js";
import logo from "../../assets/logo-white.png";
import { GoogleLogin } from "react-google-login";
import AlertBox from "../common/alert";
import Loading from "../common/loader";
import { ToggleTawkTo } from "../common/function/TawktoChatWidget";

const WelcomeSection = (props) => {
    const [isLoading, setLoading] = useState(false);
    const [responseMsg, setResponseMsg] = useState("");
    const [showErrorAlert, setErrorAlert] = useState(false);
    const [showSuccessAlert, setSuccessAlert] = useState(false);

    const onSuccess = (res) => {
       // console.log(res);
        let id_token = res.getAuthResponse().id_token;
        //console.log(id_token);

        setLoading(true);
        setErrorAlert(false);
        setSuccessAlert(false);
        handlePOST(id_token, `${baseUrl}${accountsUrl}/google/`);
    };

    // eslint-disable-next-line no-unused-vars
    const handlePOST = (id_token, API) => {
        fetch(API, {
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
            },
            method: "POST",
            body: JSON.stringify({
                auth_token: id_token,
            }),
        })
            .then((res) => res.json())
            .then((result) => {
                if (result.sts === true) {
                    // Loggout from all the dashboard if the user is logged in
                    if (localStorage.getItem("Authorization")) {
                        fetch(`${baseUrl}${accountsUrl}/logout/`, {
                            headers: {
                                Accept: "application/json",
                                "Content-Type": "application/json",
                                Authorization:
                                    localStorage.getItem("Authorization"),
                            },
                            method: "POST",
                        })
                            .then((res) => res.json())
                            .then((results) => {
                                if (results.sts === true) {
                                    props.setLocalStorage(result);
                                }
                            })
                            .catch((err) => {
                                console.log(err);
                                setResponseMsg("Something went wrong!");
                                setErrorAlert(true);
                                setLoading(false);
                            });
                    } else {
                        props.setLocalStorage(result);
                    }
                } else {
                    setResponseMsg(result.msg);
                    setErrorAlert(true);
                    setLoading(false);
                }
            })
            .catch((err) => {
                console.log(err);
                setResponseMsg("Something went wrong!");
                setErrorAlert(true);
                setLoading(false);
            });
    };

    const onFailure = (res) => {
        console.log(res);
    };

    return (
        <>
            {/* Alert message */}
            <AlertBox
                errorMsg={responseMsg}
                successMsg={responseMsg}
                showErrorAlert={showErrorAlert}
                showSuccessAlert={showSuccessAlert}
                toggleSuccessAlert={() => {
                    setSuccessAlert(false);
                }}
                toggleErrorAlert={() => {
                    setErrorAlert(false);
                }}
            />
            <div className="card-body">
                <div className="row justify-content-center my-3 my-md-5">
                    <div className="col-sm-11">
                        <div
                            className="row"
                            style={{
                                marginBottom: "35px",
                            }}
                        >
                            <div className="col-6">
                                <Link to="/">
                                    <img
                                        src={logo}
                                        alt="IQ Labs Academy"
                                        className="img-fluid"
                                    />
                                </Link>
                            </div>
                        </div>

                        <div className="text-white">
                            <h2 className="mb-3">Welcome back!</h2>
                            <p
                                style={{
                                    lineHeight: "30px",
                                    marginBottom: "40px",
                                }}
                            >
                                Enter your credentials to continue your
                                learning, or login using social media to get
                                quick access
                            </p>
                            
                            <GoogleLogin
                                clientId="944583348153-1icc0fd6i46hcn6663mrpvhl1qrfslkq.apps.googleusercontent.com"
                                buttonText="Login with Google"
                                onSuccess={onSuccess}
                                onFailure={onFailure}
                                cookiePolicy={"single_host_origin"}
                                className="btn btn-outline-ligh btn-block shadow-none mb-3"
                            />
                            {/* <button className="btn btn-outline-light btn-block shadow-none">
                            <i className="fab fa-google mr-1"></i> Continue with
                            Google
                        </button> */}
                            {/* <button className="btn btn-outline-light btn-block shadow-none">
                                <i className="fab fa-facebook-f mr-1"></i>{" "}
                                Continue with Faceboook
                            </button> */}
                        </div>
                    </div>
                </div>
            </div>
            {/* Loading component */}
            {isLoading ? <Loading /> : ""}
        </>
    );
};

class StudentLogin extends Component {
    constructor(props) {
        super(props);
        this.state = {
            username: "",
            password: "",

            errorMsg: "",
            showLoader: false,
            showErrorAlert: false,
            showPassword: false,
            showModal: false,
            is_formSubmitted: false,
        };
        this.url = baseUrl + accountsUrl;
        this.authToken = localStorage.getItem("Authorization");
        this.headers = {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: this.authToken,
        };
        this.redirect = new URLSearchParams(this.props.location.search).get(
            "redirect"
        );
    }

    componentDidMount = () => {
        document.title = "Login | IQLabs";
        
        // Toggle tawk-to chat widget
        setTimeout(() => {
            ToggleTawkTo("hide");
        }, 1000);
    };

    handleInput = (event) => {
        this.setState({ [event.target.name]: event.target.value });
    };

    loadProfileData = (token) => {
        fetch(`${baseUrl + studentUrl}/student/profile/`, {
            method: "GET",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
                Authorization: `Token ${token}`,
            },
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

    setLocalStorage = async (data) => {
        localStorage.clear();
        storeDispatch(RESET_STATE);

        localStorage.setItem("Authorization", `Token ${data.token}`);
        localStorage.setItem("is_student", data.is_student);
        await this.loadProfileData(data.token);

        this.setState({
            showLoader: false,
        });
    };

    handleSubmit = (event) => {
        event.preventDefault();
        this.setState({
            errorMsg: "",
            showLoader: true,
            showErrorAlert: false,
        });

        fetch(`${this.url}/login/`, {
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
            },
            method: "POST",
            body: JSON.stringify({
                username: this.state.username,
                password: this.state.password,
                user: "student",
            }),
        })
            .then((res) => res.json())
            .then((result) => {
                if (result.sts === true) {
                    // Loggout from all the dashboard if the user is logged in
                    if (localStorage.getItem("Authorization")) {
                        fetch(`${this.url}/logout/`, {
                            headers: this.headers,
                            method: "POST",
                        })
                            .then((res) => res.json())
                            .then((results) => {
                                if (results.sts === true) {
                                    this.setLocalStorage(result);
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
                        // Logout the admin if he is logged in
                    } else if (localStorage.getItem("Inquel-Auth")) {
                        var url = baseUrl + adminPathUrl;
                        var authToken = localStorage.getItem("Inquel-Auth");
                        var headers = {
                            Accept: "application/json",
                            "Content-Type": "application/json",
                            "Inquel-Auth": authToken,
                        };

                        fetch(`${url}/logout/`, {
                            headers: headers,
                            method: "POST",
                        })
                            .then((res) => res.json())
                            .then((results) => {
                                if (results.sts === true) {
                                    this.setLocalStorage(result);
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
                    } else {
                        this.setLocalStorage(result);
                    }
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
                this.setState({
                    errorMsg: "Something went wrong!",
                    showErrorAlert: true,
                    showLoader: false,
                });
            });
    };

    formSubmission = () => {
        setTimeout(() => {
            this.setState({
                showModal: false,
            });
        }, 2500);
    };

    render() {
        if (
            localStorage.getItem("Authorization") &&
            localStorage.getItem("is_student")
        ) {
            if (this.redirect) {
                return <Redirect to={this.redirect} />;
            } else {
                return <Redirect to="/dashboard" />;
            }
        }
        return (
            <>
                {this.state.showModal ? (
                    <ForgotPasswordModal
                        show={this.state.showModal}
                        onHide={() =>
                            this.setState({
                                showModal: !this.state.showModal,
                            })
                        }
                        formSubmission={this.formSubmission}
                    />
                ) : (
                    ""
                )}

                <TopNavBar />

                <div
                    className="d-flex justify-content-center align-items-center"
                    style={{ minHeight: "100vh" }}
                >
                    <div className="container my-5">
                        <div className="row align-items-center justify-content-center">
                            <div className="col-lg-10">
                                <div className="card shadow-sm overflow-hidden">
                                    <div className="row align-items-center">
                                        {/* ----- left column ----- */}
                                        <div className="col-md-6 primary-bg pr-md-0">
                                            <WelcomeSection
                                                setLocalStorage={
                                                    this.setLocalStorage
                                                }
                                            />
                                        </div>

                                        {/* ----- right column ----- */}
                                        <div className="col-md-6 pl-md-0">
                                            <div className="card-body">
                                                <div className="row justify-content-center">
                                                    <div className="col-sm-11">
                                                        <h3 className="primary-text">
                                                            Login
                                                        </h3>
                                                        <p className="small text-muted mb-4">
                                                            Enjoy unlimited
                                                            learning | Enjoy 7
                                                            days Free Trails
                                                        </p>

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
                                                            {
                                                                this.state
                                                                    .errorMsg
                                                            }
                                                        </Alert>

                                                        <form
                                                            onSubmit={
                                                                this
                                                                    .handleSubmit
                                                            }
                                                            autoComplete="off"
                                                        >
                                                            <div className="form-group">
                                                                <label htmlFor="username">
                                                                    Username
                                                                </label>
                                                                <input
                                                                    type="text"
                                                                    name="username"
                                                                    id="username"
                                                                    className="form-control form-shadow form-control-lg"
                                                                    onChange={
                                                                        this
                                                                            .handleInput
                                                                    }
                                                                    value={
                                                                        this
                                                                            .state
                                                                            .username
                                                                    }
                                                                    placeholder="Username"
                                                                    autoFocus
                                                                    required
                                                                />
                                                            </div>
                                                            <div className="form-group">
                                                                <label htmlFor="password">
                                                                    Password
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
                                                                            this
                                                                                .state
                                                                                .showPassword
                                                                                ? "text"
                                                                                : "password"
                                                                        }
                                                                        name="password"
                                                                        id="password"
                                                                        className="form-control form-control-lg"
                                                                        onChange={
                                                                            this
                                                                                .handleInput
                                                                        }
                                                                        value={
                                                                            this
                                                                                .state
                                                                                .password
                                                                        }
                                                                        placeholder="**********"
                                                                        required
                                                                    />
                                                                    <div className="input-group-append">
                                                                        <button
                                                                            className="btn btn-link btn-sm bg-white shadow-none"
                                                                            type="button"
                                                                            id="button-addon2"
                                                                            onClick={() =>
                                                                                this.setState(
                                                                                    {
                                                                                        showPassword:
                                                                                            !this
                                                                                                .state
                                                                                                .showPassword,
                                                                                    }
                                                                                )
                                                                            }
                                                                        >
                                                                            {this
                                                                                .state
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
                                                                <p className="small mb-0 text-right">
                                                                    {" "}
                                                                    <Link
                                                                        to="#"
                                                                        onClick={() =>
                                                                            this.setState(
                                                                                {
                                                                                    showModal:
                                                                                        !this
                                                                                            .state
                                                                                            .showModal,
                                                                                }
                                                                            )
                                                                        }
                                                                        className="primary-text"
                                                                    >
                                                                        Forgot
                                                                        password?
                                                                    </Link>
                                                                </p>
                                                            </div>
                                                            <div className="form-group">
                                                                <button
                                                                    type="submit"
                                                                    className="btn btn-primary btn-block shadow-none"
                                                                >
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
                                                                        <>
                                                                            LOGIN{" "}
                                                                            <i className="fas fa-sign-in-alt ml-2"></i>
                                                                        </>
                                                                    )}
                                                                </button>
                                                            </div>
                                                        </form>
                                                        <p className="text-center small mb-0">
                                                            Don't have an
                                                            account?{" "}
                                                            <Link
                                                                to="/register"
                                                                className="primary-text font-weight-bold"
                                                            >
                                                                Join Inquel
                                                                Online Learning
                                                            </Link>{" "}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <LoginFooter />
            </>
        );
    }
}

export default StudentLogin;
