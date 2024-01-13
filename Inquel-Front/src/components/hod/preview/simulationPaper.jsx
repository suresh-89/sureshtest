import React, { Component } from "react";
import Wrapper from "../wrapper";
import { baseUrl, hodUrl } from "../../../shared/baseUrl.js";
import AlertBox from "../../common/alert";
import Loading from "../../common/loader";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import storeDispatch from "../../../redux/dispatch";
import { PAPER } from "../../../redux/action";

const mapStateToProps = (state) => ({
    course_name: state.content.course_name,
    simulation_name: state.content.simulation_name,
});

class HODSimulationPaperPreview extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: [],

            errorMsg: "",
            successMsg: "",
            showErrorAlert: false,
            showSuccessAlert: false,
            page_loading: true,
        };
        this.courseId = this.props.match.params.courseId;
        this.simulationId = this.props.match.params.simulationId;
        this.url = baseUrl + hodUrl;
        this.authToken = localStorage.getItem("Authorization");
        this.headers = {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: this.authToken,
        };
    }

    loadCycleTestData = () => {
        fetch(
            `${this.url}/hod/course/${this.courseId}/review/simulation/${this.simulationId}/`,
            {
                method: "GET",
                headers: this.headers,
            }
        )
            .then((res) => res.json())
            .then((result) => {
                if (result.sts === true) {
                    this.setState({
                        data: result.data,
                        page_loading: false,
                    });
                } else {
                    this.setState({
                        errorMsg: result.msg,
                        showErrorAlert: true,
                        page_loading: false,
                    });
                }
            })
            .catch((err) => {
                console.log(err);
                this.setState({
                    errorMsg: "Something went wrong!",
                    showErrorAlert: true,
                    page_loading: false,
                });
            });
    };

    componentDidMount = () => {
        this.loadCycleTestData();
    };

    render() {
        document.title = `${this.props.simulation_name} - HOD | IQLabs`;
        return (
            <Wrapper
                header={this.props.course_name}
                activeLink="dashboard"
                history={this.props.history}
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

                {/* ----- Breadcrumb ----- */}
                <nav aria-label="breadcrumb">
                    <ol className="breadcrumb mb-3">
                        <li className="breadcrumb-item">
                            <Link to="/hod">
                                <i className="fas fa-home fa-sm"></i>
                            </Link>
                        </li>
                        <li className="breadcrumb-item">
                            <Link to="#" onClick={this.props.history.goBack}>
                                {this.props.course_name}
                            </Link>
                        </li>
                        <li className="breadcrumb-item active">
                            {this.props.simulation_name}
                        </li>
                    </ol>
                </nav>

                <div className="card shadow-sm">
                    <div className="table-responsive">
                        <table className="table">
                            <thead className="primary-bg text-white">
                                <tr style={{ whiteSpace: "nowrap" }}>
                                    <th scope="col">Simulation Exams</th>
                                    <th scope="col">Type</th>
                                    <th scope="col">Duration</th>
                                    <th scope="col">Total marks</th>
                                    <th scope="col" className="text-right">
                                        Action
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {(this.state.data || []).map((data, index) => {
                                    return (
                                        <tr
                                            key={index}
                                            style={{
                                                whiteSpace: "nowrap",
                                            }}
                                        >
                                            <td>{data.paper_name}</td>
                                            <td>{data.paper_type}</td>
                                            <td>{data.time_duration}</td>
                                            <td>{data.total_marks}</td>
                                            <td className="text-right">
                                                <Link
                                                    to={`${this.props.match.url}/paper/${data.paper_id}`}
                                                >
                                                    <button
                                                        className="btn btn-primary-invert btn-sm shadow-none"
                                                        onClick={() => {
                                                            storeDispatch(
                                                                PAPER,
                                                                data.paper_name
                                                            );
                                                        }}
                                                    >
                                                        View
                                                    </button>
                                                </Link>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Loading component */}
                {this.state.page_loading ? <Loading /> : ""}
            </Wrapper>
        );
    }
}

export default connect(mapStateToProps)(HODSimulationPaperPreview);
