import React, { Component } from "react";
import Wrapper from "../../wrapper";
import { Link } from "react-router-dom";
import AboutINQUEL from "./about-inquel";
import PrivacyPolicy from "./privacy-policy";
import TermsAndCondition from "./terms-and-conditions";
import LegalNotice from "./legal-notice";
import Copyright from "./copyright";
import HelpCenter from "./help-center";
import HODTermsAndCondition from "./hod-terms-and-conditions";

class WebsiteManagementFooter extends Component {
    constructor(props) {
        super(props);
        this.state = {
            tab: "about",
        };
    }

    componentDidMount = () => {
        document.title = "Website management - Admin | IQLabs";
    };

    render() {
        return (
            <Wrapper
                header="Website Management"
                activeLink="website"
                history={this.props.history}
            >
                {/* Breadcrumb */}
                <nav aria-label="breadcrumb">
                    <ol className="breadcrumb mb-3">
                        <li className="breadcrumb-item">
                            <Link to="/hod">
                                <i className="fas fa-home fa-sm"></i>
                            </Link>
                        </li>
                        <li className="breadcrumb-item">
                            <Link to="#" onClick={this.props.history.goBack}>
                                Website management
                            </Link>
                        </li>
                        <li className="breadcrumb-item active">Footer pages</li>
                    </ol>
                </nav>

                <div className="row">
                    <div className="col-md-2 mb-2 mb-md-0 pr-md-0">
                        <div className="card h-100 settings">
                            <div
                                className={`settings-tab ${
                                    this.state.tab === "about" ? "active" : ""
                                }`}
                                onClick={() =>
                                    this.setState({
                                        tab: "about",
                                    })
                                }
                            >
                                <i className="fas fa-users mr-2"></i> About
                                INQUEL
                            </div>
                            <div
                                className={`settings-tab ${
                                    this.state.tab === "privacy" ? "active" : ""
                                }`}
                                onClick={() =>
                                    this.setState({
                                        tab: "privacy",
                                    })
                                }
                            >
                                <i className="fas fa-user-shield mr-2"></i>{" "}
                                Privacy Policy
                            </div>
                            <div
                                className={`settings-tab ${
                                    this.state.tab === "terms" ? "active" : ""
                                }`}
                                onClick={() =>
                                    this.setState({
                                        tab: "terms",
                                    })
                                }
                            >
                                <i className="fas fa-user-lock mr-2"></i> Terms
                                & conditions
                            </div>
                            <div
                                className={`settings-tab ${
                                    this.state.tab === "hodtc" ? "active" : ""
                                }`}
                                onClick={() =>
                                    this.setState({
                                        tab: "hodtc",
                                    })
                                }
                            >
                                <i className="fas fa-users-cog mr-2"></i> HOD
                                T&C
                            </div>
                            <div
                                className={`settings-tab ${
                                    this.state.tab === "legal" ? "active" : ""
                                }`}
                                onClick={() =>
                                    this.setState({
                                        tab: "legal",
                                    })
                                }
                            >
                                <i className="fas fa-exclamation-circle mr-2"></i>{" "}
                                Legal notice
                            </div>
                            <div
                                className={`settings-tab ${
                                    this.state.tab === "help" ? "active" : ""
                                }`}
                                onClick={() =>
                                    this.setState({
                                        tab: "help",
                                    })
                                }
                            >
                                <i className="fas fa-hands-helping mr-2"></i>{" "}
                                Help center
                            </div>
                            <div
                                className={`settings-tab ${
                                    this.state.tab === "copyright"
                                        ? "active"
                                        : ""
                                }`}
                                onClick={() =>
                                    this.setState({
                                        tab: "copyright",
                                    })
                                }
                            >
                                <i className="fas fa-copyright mr-2"></i>{" "}
                                Copyright
                            </div>
                        </div>
                    </div>

                    <div className="col-md-10">
                        <div className="card" style={{ minHeight: "75vh" }}>
                            {this.state.tab === "about" ? (
                                <AboutINQUEL />
                            ) : this.state.tab === "privacy" ? (
                                <PrivacyPolicy />
                            ) : this.state.tab === "terms" ? (
                                <TermsAndCondition />
                            ) : this.state.tab === "hodtc" ? (
                                <HODTermsAndCondition />
                            ) : this.state.tab === "legal" ? (
                                <LegalNotice />
                            ) : this.state.tab === "help" ? (
                                <HelpCenter />
                            ) : this.state.tab === "copyright" ? (
                                <Copyright />
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

export default WebsiteManagementFooter;
