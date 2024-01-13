import React, { Component } from "react";
import Wrapper from "./wrapper";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { baseUrl, teacherUrl } from "../../shared/baseUrl.js";
import { paginationCount } from "../../shared/constant.js";
import Loading from "../common/loader";
import Paginations from "../common/pagination";
import SubjectTable from "../common/table/subject";
import AlertBox from "../common/alert";

const mapStateToProps = (state) => ({
    group_name: state.content.group_name,
    profile: state.user.profile,
});

class TeacherGroup extends Component {
    constructor(props) {
        super(props);
        this.state = {
            groupItem: [],
            activeSubjectPage: 1,
            totalSubjectCount: 0,

            errorMsg: "",
            successMsg: "",
            showErrorAlert: false,
            showSuccessAlert: false,
            page_loading: true,
        };
        this.groupId = this.props.match.params.groupId;
        this.url = baseUrl + teacherUrl;
        this.authToken = localStorage.getItem("Authorization");
        this.headers = {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: this.authToken,
        };
    }

    componentDidMount = () => {
        this.loadSubjectData();
    };

    loadSubjectData = () => {
        fetch(
            this.state.activeSubjectPage > 1
                ? `${this.url}/teacher/group/${this.groupId}/?page=${this.state.activeSubjectPage}`
                : `${this.url}/teacher/group/${this.groupId}/`,
            {
                headers: this.headers,
                method: "GET",
            }
        )
            .then((res) => res.json())
            .then((result) => {
                if (result.sts === true) {
                    this.setState({
                        groupItem: result.data.results,
                        totalSubjectCount: result.data.count,
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

    handleSubjectPageChange(pageNumber) {
        this.setState(
            { activeSubjectPage: pageNumber, page_loading: true },
            () => {
                this.loadSubjectData();
            }
        );
    }

    render() {
        document.title = `${this.props.group_name} - Teacher | IQLabs`;
        return (
            <Wrapper
                header={this.props.group_name}
                activeLink="dashboard"
                history={this.props.history}
                waterMark={this.props.profile}
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

                <div className="row align-items-center mb-3">
                    <div className="col-6">
                        {/* ----- Breadcrumb ----- */}
                        <nav aria-label="breadcrumb">
                            <ol className="breadcrumb">
                                <li className="breadcrumb-item">
                                    <Link to="/teacher">
                                        <i className="fas fa-home fa-sm"></i>
                                    </Link>
                                </li>
                                <li className="breadcrumb-item active">
                                    <span>Group:</span>
                                    {this.props.group_name}
                                </li>
                            </ol>
                        </nav>
                    </div>
                    <div className="col-6 text-right">
                        <Link
                            to={`/teacher/group/${this.props.match.params.groupId}/student`}
                        >
                            <button className="btn btn-primary btn-sm shadow-none">
                                Students
                            </button>
                        </Link>
                    </div>
                </div>

                {/* ----- Subject list ----- */}
                <div className="card shadow-sm mb-4">
                    <div className="card-header">
                        <h5 className="mb-0">Subjects</h5>
                    </div>
                    <SubjectTable
                        subjectItems={this.state.groupItem}
                        path={`teacher/group/${this.groupId}`}
                        subject={true}
                    />
                    <div className="card-body p-3">
                        {this.state.totalSubjectCount > paginationCount ? (
                            <Paginations
                                activePage={this.state.activeSubjectPage}
                                totalItemsCount={this.state.totalSubjectCount}
                                onChange={this.handleSubjectPageChange.bind(
                                    this
                                )}
                            />
                        ) : null}
                    </div>
                </div>

                {/* Loading component */}
                {this.state.page_loading ? <Loading /> : ""}
            </Wrapper>
        );
    }
}

export default connect(mapStateToProps)(TeacherGroup);
