import React, { Component } from "react";
import { Link } from "react-router-dom";
import { baseUrl, accountsUrl } from "../../shared/baseUrl.js";
import Loading from "../common/loader";

class EmailVerify extends Component {
    constructor(props) {
        super(props);
        this.state = { validToken: true, page_loading: true };
        this.tokenId = this.props.match.params.tokenId;
        this.url = baseUrl + accountsUrl;
        this.headers = {
            Accept: "application/json",
            "Content-Type": "application/json",
        };
    }

    componentDidMount = () => {
        document.title = "Account verification | IQLabs";

        fetch(`${this.url}/verify/`, {
            method: "POST",
            headers: this.headers,
            body: JSON.stringify({
                token: this.tokenId,
            }),
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

    render() {
        return (
            <div className="section">
                <div className="container">
                    {this.state.page_loading ? (
                        <Loading />
                    ) : (
                        <div
                            className="row justify-content-center align-items-center"
                            style={{ minHeight: "60vh" }}
                        >
                            <div className="col-md-5">
                                <div className="card shadow">
                                    <div className="card-body text-center p-5">
                                        {this.state.validToken ? (
                                            <>
                                                <h2 className="display-4 primary-text mb-3">
                                                    <i className="fas fa-check-circle"></i>
                                                </h2>
                                                <p className="h4 mb-4">
                                                    Your account is verified!
                                                </p>
                                                <Link
                                                    to="/login"
                                                    style={{
                                                        textDecoration: "none",
                                                    }}
                                                >
                                                    <button className="btn btn-primary btn-block shadow-none">
                                                        Login
                                                    </button>
                                                </Link>
                                            </>
                                        ) : (
                                            <>
                                                <h2 className="display-4 text-danger mb-3">
                                                    <i className="fas fa-times-circle"></i>
                                                </h2>
                                                <p className="h4 mb-0">
                                                    Invalid verification link!
                                                </p>
                                            </>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        );
    }
}

export default EmailVerify;
