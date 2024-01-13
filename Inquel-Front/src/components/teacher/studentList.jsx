import React, { Component } from "react";
import Wrapper from "./wrapper";
import { Dropdown } from "react-bootstrap";
import { Link } from "react-router-dom";
import { baseUrl, teacherUrl } from "../../shared/baseUrl.js";
import { paginationCount } from "../../shared/constant.js";
import Loading from "../common/loader";
import StudentTable from "../common/table/student";
import Paginations from "../common/pagination";
import AlertBox from "../common/alert";
import NotificationModal from "../common/modal/notification";

class TeacherStudentList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            activeStudentPage: 1,
            totalStudentCount: 0,
            studentItems: [],
            selectedStudent: [],

            notify_all: false,
            showNotificationModal: false,

            errorMsg: "",
            successMsg: "",
            showErrorAlert: false,
            showSuccessAlert: false,
            page_loading: true,
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
        document.title = "Student Profiles - Teacher | IQLabs";

        this.loadStudentData();
    };

    loadStudentData = () => {
        fetch(
            this.state.activeStudentPage > 1
                ? `${this.url}/teacher/student/?page=${this.state.activeStudentPage}`
                : `${this.url}/teacher/student/`,
            {
                headers: this.headers,
                method: "GET",
            }
        )
            .then((res) => res.json())
            .then((result) => {
                if (result.sts === true) {
                    this.setState({
                        studentItems: result.data.results,
                        totalStudentCount: result.data.count,
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

    // Gets Student ID from the Student table
    handleStudentId = (data) => {
        let value = [];
        const studentItems = this.state.studentItems;
        for (let i = 0; i < studentItems.length; i++) {
            if (data.includes(studentItems[i].id.toString())) {
                value.push({
                    id: studentItems[i].id.toString(),
                    username: studentItems[i].username,
                });
            } else {
                continue;
            }
        }
        this.setState({
            selectedStudent: value,
        });
    };

    handleStudentPageChange(pageNumber) {
        this.setState(
            { activeStudentPage: pageNumber, page_loading: true },
            () => {
                this.loadStudentData();
            }
        );
    }

    render() {
        return (
            <Wrapper
                header="Student Profiles"
                activeLink="profiles"
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

                {/* Notification Modal */}
                {this.state.showNotificationModal ? (
                    <NotificationModal
                        show={this.state.showNotificationModal}
                        onHide={() => {
                            this.setState({
                                showNotificationModal: false,
                            });
                        }}
                        url={`${this.url}/teacher/student/notify/`}
                        data={this.state.selectedStudent}
                        field="student_id"
                        notify_all={this.state.notify_all}
                    />
                ) : (
                    ""
                )}

                {/* Filter area */}
                <div className="row align-items-center mb-3">
                    <div className="col-md-6">
                        {/* ----- Breadcrumb ----- */}
                        <nav aria-label="breadcrumb">
                            <ol className="breadcrumb">
                                <li className="breadcrumb-item">
                                    <Link to="/teacher">
                                        <i className="fas fa-home fa-sm"></i>
                                    </Link>
                                </li>
                                <li className="breadcrumb-item active">
                                    Student Profiles
                                </li>
                            </ol>
                        </nav>
                    </div>
                    <div className="col-md-6">
                        <div className="d-flex flex-wrap justify-content-end">
                            <Dropdown>
                                <Dropdown.Toggle
                                    variant="primary"
                                    id="dropdown-basic"
                                    className="btn-sm shadow-none"
                                >
                                    Notify
                                </Dropdown.Toggle>

                                <Dropdown.Menu className="dropdown-menu-down dropdown-menu-down-btn">
                                    <Dropdown.Item
                                        onClick={() => {
                                            this.setState({
                                                showNotificationModal: true,
                                                notify_all: true,
                                            });
                                        }}
                                    >
                                        Notify All
                                    </Dropdown.Item>
                                    <div className="dropdown-divider"></div>
                                    <Dropdown.Item
                                        onClick={() => {
                                            if (
                                                this.state.selectedStudent
                                                    .length !== 0
                                            ) {
                                                this.setState({
                                                    showNotificationModal: true,
                                                    notify_all: false,
                                                });
                                            } else {
                                                this.setState({
                                                    errorMsg:
                                                        "Select student to send notification",
                                                    showErrorAlert: true,
                                                });
                                            }
                                        }}
                                    >
                                        Notify Selected
                                    </Dropdown.Item>
                                </Dropdown.Menu>
                            </Dropdown>
                        </div>
                    </div>
                </div>

                <div className="card shadow-sm">
                    <StudentTable
                        studentItems={this.state.studentItems}
                        path="teacher"
                        group={true}
                        handleStudentId={this.handleStudentId}
                    />
                    <div className="card-body p-3">
                        {this.state.totalStudentCount > paginationCount ? (
                            <Paginations
                                activePage={this.state.activeStudentPage}
                                totalItemsCount={this.state.totalStudentCount}
                                onChange={this.handleStudentPageChange.bind(
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

export default TeacherStudentList;
