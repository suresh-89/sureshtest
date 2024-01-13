import React, { Component } from "react";
import Wrapper from "../../wrapper";
import { Link } from "react-router-dom";
import StudyGuide from "./study-guide";
import FlashNews from "./flash-news";

class WebsiteManagementHome extends Component {
    constructor(props) {
        super(props);
        this.state = {
            tab: "study_guide",
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
                        <li className="breadcrumb-item active">
                            Home sections
                        </li>
                    </ol>
                </nav>

                <div className="row">
                    <div className="col-md-2 mb-2 mb-md-0 pr-md-0">
                        <div className="card h-100 settings">
                            <div
                                className={`settings-tab ${
                                    this.state.tab === "study_guide"
                                        ? "active"
                                        : ""
                                }`}
                                onClick={() =>
                                    this.setState({
                                        tab: "study_guide",
                                    })
                                }
                            >
                                <i className="fas fa-book-open mr-2"></i> Study
                                guide
                            </div>
                            <div
                                className={`settings-tab ${
                                    this.state.tab === "flash_news"
                                        ? "active"
                                        : ""
                                }`}
                                onClick={() =>
                                    this.setState({
                                        tab: "flash_news",
                                    })
                                }
                            >
                                <i className="fas fa-rss-square mr-2"></i> Flash news
                            </div>
                        </div>
                    </div>

                    <div className="col-md-10">
                        <div className="card" style={{ minHeight: "75vh" }}>
                            {this.state.tab === "study_guide" ? (
                                <StudyGuide />
                            ) : this.state.tab === "flash_news" ? (
                                <FlashNews />
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

export default WebsiteManagementHome;
