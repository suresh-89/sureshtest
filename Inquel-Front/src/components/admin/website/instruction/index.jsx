import React, { Component } from "react";
import Wrapper from "../../wrapper";
import { Link } from "react-router-dom";
import ExamInstruction from "./exam";
import StudyPlannerInstruction from "./study-planner";

class WebsiteManagementInstruction extends Component {
    constructor(props) {
        super(props);
        this.state = {
            tab: "exam",
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
                        <li className="breadcrumb-item active">Instructions</li>
                    </ol>
                </nav>

                <div className="row">
                    <div className="col-md-2 mb-2 mb-md-0 pr-md-0">
                        <div className="card h-100 settings">
                            <div
                                className={`settings-tab ${
                                    this.state.tab === "exam" ? "active" : ""
                                }`}
                                onClick={() =>
                                    this.setState({
                                        tab: "exam",
                                    })
                                }
                            >
                                <i className="fas fa-info-circle mr-2"></i> Exam
                            </div>
                            <div
                                className={`settings-tab ${
                                    this.state.tab === "calendar"
                                        ? "active"
                                        : ""
                                }`}
                                onClick={() =>
                                    this.setState({
                                        tab: "calendar",
                                    })
                                }
                            >
                                <i className="fas fa-info-circle mr-2"></i>{" "}
                                Study planner
                            </div>
                        </div>
                    </div>

                    <div className="col-md-10">
                        <div className="card" style={{ minHeight: "75vh" }}>
                            {this.state.tab === "exam" ? (
                                <ExamInstruction />
                            ) : this.state.tab === "calendar" ? (
                                <StudyPlannerInstruction />
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

export default WebsiteManagementInstruction;
