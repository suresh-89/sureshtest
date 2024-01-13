import React, { Component } from "react";
import Wrapper from "../wrapper";
import { Link } from "react-router-dom";
import { baseUrl, teacherUrl } from "../../../shared/baseUrl.js";
import AlertBox from "../../common/alert";
import { connect } from "react-redux";
import UpdateProfile from "./profile";
import UpdatePassword from "./password";
import { PROFILE } from "../../../redux/action";
import storeDispatch from "../../../redux/dispatch";

const mapStateToProps = (state) => ({
    profileData: state.user.profile,
});

class TeacherSettings extends Component {
    constructor(props) {
        super(props);
        this.state = {
            tab: "profile",

            errorMsg: "",
            successMsg: "",
            showErrorAlert: false,
            showSuccessAlert: false,
        };
        this.url = baseUrl + teacherUrl;
        this.authToken = localStorage.getItem("Authorization");
        this.headers = {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: this.authToken,
        };
    }

    componentDidMount = () => {
        document.title = "Settings - Teacher | IQLabs";
    };

    fetchProfile = () => {
        fetch(`${this.url}/teacher/profile/`, {
            method: "GET",
            headers: this.headers,
        })
            .then((res) => res.json())
            .then((result) => {
                if (result.sts === true) {
                    storeDispatch(PROFILE, result.data);
                } else {
                    this.setState({
                        errorMsg: result.msg,
                        showErrorAlert: true,
                    });
                }
            })
            .catch((err) => {
                console.log(err);
                this.setState({
                    errorMsg: "Something went wrong!",
                    showErrorAlert: true,
                });
            });
    };

    render() {
        return (
            <Wrapper
                header="Settings"
                activeLink="settings"
                history={this.props.history}
                hideBackButton={true}
            >
                {/* Alert message */}
                <AlertBox
                    errorMsg={this.state.errorMsg}
                    successMsg={this.state.successMsg}
                    showErrorAlert={this.state.showErrorAlert}
                    showSuccessAlert={this.state.showSuccessAlert}
                    toggleSuccessAlert={() => {
                        this.setState({
                            showSuccessAlert: false,
                        });
                    }}
                    toggleErrorAlert={() => {
                        this.setState({
                            showErrorAlert: false,
                        });
                    }}
                />

                {/* Breadcrumb */}
                <nav aria-label="breadcrumb">
                    <ol className="breadcrumb mb-3">
                        <li className="breadcrumb-item">
                            <Link to="/teacher">
                                <i className="fas fa-home fa-sm"></i>
                            </Link>
                        </li>
                        <li className="breadcrumb-item active">Settings</li>
                    </ol>
                </nav>

                <div className="row">
                    <div className="col-md-2 mb-2 mb-md-0 pr-md-0">
                        <div className="card h-100 settings">
                            <div
                                className={`settings-tab ${
                                    this.state.tab === "profile" ? "active" : ""
                                }`}
                                onClick={() =>
                                    this.setState({
                                        tab: "profile",
                                    })
                                }
                            >
                                <i className="fas fa-user-edit mr-2"></i>{" "}
                                Profile
                            </div>
                            <div
                                className={`settings-tab ${
                                    this.state.tab === "password"
                                        ? "active"
                                        : ""
                                }`}
                                onClick={() =>
                                    this.setState({
                                        tab: "password",
                                    })
                                }
                            >
                                <i className="fas fa-unlock-alt mr-2"></i>{" "}
                                Password
                            </div>
                        </div>
                    </div>

                    <div className="col-md-10">
                        <div className="card" style={{ minHeight: "75vh" }}>
                            {this.state.tab === "profile" ? (
                                <UpdateProfile fetchProfile={this.fetchProfile} />
                            ) : this.state.tab === "password" ? (
                                <UpdatePassword fetchProfile={this.fetchProfile} />
                            ) : (
                                ""
                            )}
                        </div>
                    </div>
                </div>
            </Wrapper>
        );
    }
}

export default connect(mapStateToProps)(TeacherSettings);
