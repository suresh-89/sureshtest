import React, { Component } from "react";
import { Alert, Spinner, OverlayTrigger, Tooltip } from "react-bootstrap";
import { Link, Redirect } from "react-router-dom";
import { baseUrl, accountsUrl } from "../../shared/baseUrl.js";
import TopNavbar from "../home/shared/navbar";
import Footer from "../home/shared/footer";
import Select from "react-select";
import { country } from "../../shared/countries.js";
import logo from "../../assets/logo-white.png";

const WelcomeSection = () => {
    return (
        <div className="card card-body primary-bg p-md-5 p-4 h-100">
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
                <h2 className="mb-3">Welcome</h2>
                <p
                    style={{
                        lineHeight: "30px",
                        marginBottom: "40px",
                    }}
                >
                    Enter your credentials to continue your learning, or
                    register using social media to get quick access
                </p>

                <button className="btn btn-outline-light btn-block shadow-none">
                    <i className="fab fa-google mr-1"></i> Continue with Google
                </button>
                <button className="btn btn-outline-light btn-block shadow-none">
                    <i className="fab fa-facebook-f mr-1"></i> Continue with
                    Faceboook
                </button>
            </div>
        </div>
    );
};

class StudentRegister extends Component {
    constructor(props) {
        super(props);
        this.state = {
            firstname: "",
            lastname: "",
            email: "",
            country_code: "+91",
            phone_num: "",
            username: "",
            password: "",
            confirm_password: "",
            terms_and_condition: false,

            errorMsg: "",
            successMsg: "",
            showLoader: false,
            showErrorAlert: false,
            showSuccessAlert: false,

            showPassword: false,
            showConfirmPassword: false,
            isAccountCreated: false,
        };
        this.url = baseUrl + accountsUrl;
        this.authToken = localStorage.getItem("Authorization");
        this.headers = {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: this.authToken,
        };
    }

    componentDidMount = () => {
        document.title = "Register | IQLabs";
    };

    handleInput = (event) => {
        this.setState({
            [event.target.name]: event.target.value,
        });
    };

    handleSelect = (event) => {
        this.setState({
            country_code: event.value,
        });
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

    handleSubmit = (event) => {
        event.preventDefault();
        this.setState({
            showLoader: true,
            showErrorAlert: false,
            showSuccessAlert: false,
        });

        if (this.state.password !== this.state.confirm_password) {
            this.setState({
                errorMsg: "Password doesn't match",
                showErrorAlert: true,
                showLoader: false,
            });
        } else if (this.state.terms_and_condition === false) {
            this.setState({
                errorMsg:
                    "Please indicate that you have read and agree to the Terms and Conditions",
                showErrorAlert: true,
                showLoader: false,
            });
        } else {
            fetch(`${this.url}/register/`, {
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json",
                },
                method: "POST",
                body: JSON.stringify({
                    first_name: this.state.firstname,
                    last_name: this.state.lastname,
                    username: this.state.username,
                    email: this.state.email,
                    phone_num: this.state.country_code + this.state.phone_num,
                    password: this.state.password,
                    terms_and_condition: this.state.terms_and_condition,
                }),
            })
                .then((res) => res.json())
                .then((result) => {
                    if (result.sts === true) {
                        this.setState(
                            {
                                successMsg: "Account created!",
                                showSuccessAlert: true,
                                showLoader: false,
                            },
                            () => {
                                setTimeout(() => {
                                    this.setState({
                                        isAccountCreated: true,
                                    });
                                }, 2000);
                            }
                        );
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
        }
    };

    handleCheck = (event) => {
        if (event.target.checked) {
            this.setState({
                terms_and_condition: true,
            });
        }
    };

    renderValue = (data) => {
        return (
            <span>
                <img
                    src={data.flag}
                    alt=""
                    className="img-fluid"
                    width="25px"
                    height="auto"
                />{" "}
                {data.isoCode} - {data.dialCode}
            </span>
        );
    };

    render() {
        if (this.state.isAccountCreated === true) {
            return <Redirect to="/login" />;
        }
        return (
            <>
                <TopNavbar />

                <div
                    className="d-flex justify-content-center align-items-center"
                    style={{ minHeight: "100vh" }}
                >
                    <div className="container my-5">
                        <div className="card shadow-sm">
                            <div className="row">
                                {/* ----- left column ----- */}
                                <div className="col-md-5 pr-md-0">
                                    <WelcomeSection />
                                </div>

                                {/* right column */}
                                <div className="col-md-7 pl-md-0">
                                    <div className="card-body p-md-5 p-4">
                                        <h4 className="primary-text">
                                            CREATE YOUR ACCOUNT
                                        </h4>
                                        <p className="small text-muted">
                                            Enjoy unlimited learning | Free
                                            course
                                        </p>

                                        <Alert
                                            variant="danger"
                                            show={this.state.showErrorAlert}
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
                                            show={this.state.showSuccessAlert}
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
                                            autoComplete="off"
                                        >
                                            <div className="form-row">
                                                <div className="col-md-6 form-group">
                                                    <label htmlFor="firstname">
                                                        Firstname
                                                    </label>
                                                    <input
                                                        type="text"
                                                        name="firstname"
                                                        id="firstname"
                                                        className="form-control form-shadow form-control-lg"
                                                        onChange={
                                                            this.handleInput
                                                        }
                                                        value={
                                                            this.state.firstname
                                                        }
                                                        placeholder="Enter first name"
                                                        required
                                                    />
                                                </div>

                                                <div className="col-md-6 form-group">
                                                    <label htmlFor="lastname">
                                                        Lastname
                                                    </label>
                                                    <input
                                                        type="text"
                                                        name="lastname"
                                                        id="lastname"
                                                        className="form-control form-shadow form-control-lg"
                                                        onChange={
                                                            this.handleInput
                                                        }
                                                        value={
                                                            this.state.lastname
                                                        }
                                                        placeholder="Enter last name"
                                                        required
                                                    />
                                                </div>
                                            </div>

                                            <div className="form-group">
                                                <label htmlFor="username">
                                                    Username
                                                </label>
                                                <input
                                                    type="text"
                                                    name="username"
                                                    id="username"
                                                    className="form-control form-shadow form-control-lg"
                                                    onChange={this.handleInput}
                                                    value={this.state.username}
                                                    placeholder="Enter username"
                                                    required
                                                />
                                            </div>

                                            <div className="form-group">
                                                <label htmlFor="email">
                                                    Email
                                                </label>
                                                <input
                                                    type="email"
                                                    name="email"
                                                    id="email"
                                                    className="form-control form-shadow form-control-lg"
                                                    onChange={this.handleInput}
                                                    value={this.state.email}
                                                    placeholder="Enter email"
                                                    required
                                                />
                                            </div>

                                            <div className="form-group">
                                                <label htmlFor="phone">
                                                    Phone Number
                                                </label>
                                                <div className="d-flex form-shadow rounded-lg">
                                                    <div
                                                        style={{
                                                            width: "35%",
                                                        }}
                                                    >
                                                        <Select
                                                            className="basic-single border-right"
                                                            isSearchable={false}
                                                            name="country_code"
                                                            value={country.map(
                                                                (list) => {
                                                                    return list.dialCode ===
                                                                        this
                                                                            .state
                                                                            .country_code
                                                                        ? {
                                                                              value: list.dialCode,
                                                                              label: this.renderValue(
                                                                                  list
                                                                              ),
                                                                          }
                                                                        : "";
                                                                }
                                                            )}
                                                            options={country.map(
                                                                (list) => {
                                                                    return {
                                                                        value: list.dialCode,
                                                                        label: this.renderValue(
                                                                            list
                                                                        ),
                                                                    };
                                                                }
                                                            )}
                                                            onChange={
                                                                this
                                                                    .handleSelect
                                                            }
                                                            required
                                                        />
                                                    </div>
                                                    <div>
                                                        <input
                                                            type="text"
                                                            name="phone_num"
                                                            id="phone"
                                                            className="form-control form-control-lg"
                                                            onChange={
                                                                this.handleInput
                                                            }
                                                            value={
                                                                this.state
                                                                    .phone_num
                                                            }
                                                            placeholder="Enter phone number"
                                                            required
                                                        />
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="form-row">
                                                <div className="col-md-6 form-group">
                                                    <label htmlFor="password">
                                                        Password
                                                        <OverlayTrigger
                                                            key="right"
                                                            placement="right"
                                                            overlay={
                                                                <Tooltip
                                                                    id="tooltip"
                                                                    className="text-left"
                                                                >
                                                                    Password
                                                                    must have:{" "}
                                                                    <br />
                                                                    1. One
                                                                    Uppercase
                                                                    letter
                                                                    <br />
                                                                    2. One
                                                                    Special
                                                                    character
                                                                    <br />
                                                                    3. One Digit
                                                                    <br />
                                                                    4. Length
                                                                    should be
                                                                    greater than
                                                                    8 characters
                                                                </Tooltip>
                                                            }
                                                        >
                                                            <i className="fas fa-info-circle fa-sm ml-2"></i>
                                                        </OverlayTrigger>
                                                    </label>
                                                    <div
                                                        className="input-group form-shadow"
                                                        style={{
                                                            borderRadius: "6px",
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
                                                            className="form-control form-control-lg"
                                                            onChange={
                                                                this.handleInput
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

                                                <div className="col-md-6 form-group">
                                                    <label htmlFor="confirm_password">
                                                        Confirm Password
                                                    </label>
                                                    <div
                                                        className="input-group form-shadow"
                                                        style={{
                                                            borderRadius: "6px",
                                                        }}
                                                    >
                                                        <input
                                                            type={
                                                                this.state
                                                                    .showConfirmPassword
                                                                    ? "text"
                                                                    : "password"
                                                            }
                                                            name="confirm_password"
                                                            id="confirm_password"
                                                            className="form-control form-control-lg"
                                                            onChange={
                                                                this.handleInput
                                                            }
                                                            value={
                                                                this.state
                                                                    .confirm_password
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
                                            </div>

                                            <div className="form-group">
                                                <div
                                                    className="custom-control custom-checkbox"
                                                    style={{
                                                        zIndex: 0,
                                                    }}
                                                >
                                                    <input
                                                        type="checkbox"
                                                        className="custom-control-input"
                                                        id="customCheck1"
                                                        name="terms_and_condition"
                                                        onChange={
                                                            this.handleCheck
                                                        }
                                                        disabled={
                                                            this.state
                                                                .terms_and_condition
                                                                ? true
                                                                : false
                                                        }
                                                        required
                                                    />
                                                    <label
                                                        className="custom-control-label"
                                                        htmlFor="customCheck1"
                                                    >
                                                        I agree to the{" "}
                                                        <Link
                                                            to="/terms-and-conditions"
                                                            className="primary-text font-weight-bold-600"
                                                        >
                                                            terms and conditions
                                                        </Link>
                                                    </label>
                                                </div>
                                            </div>

                                            <div className="form-group">
                                                <button
                                                    type="submit"
                                                    className="btn btn-primary btn-block shadow-none"
                                                    disabled={
                                                        this.state
                                                            .terms_and_condition
                                                            ? false
                                                            : true
                                                    }
                                                >
                                                    {this.state.showLoader ? (
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
                                                            SIGN UP{" "}
                                                            <i className="fas fa-sign-in-alt ml-2"></i>
                                                        </>
                                                    )}
                                                </button>
                                            </div>
                                        </form>
                                        <p className="text-center small mb-0">
                                            Already have an account?{" "}
                                            <Link
                                                to="/login"
                                                className="primary-text font-weight-bold"
                                            >
                                                Login
                                            </Link>{" "}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <Footer />
            </>
        );
    }
}

export default StudentRegister;
