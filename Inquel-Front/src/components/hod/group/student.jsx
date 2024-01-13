import React, { Component } from "react";
import Wrapper from "../wrapper";
import { Dropdown, Modal, Alert, Spinner } from "react-bootstrap";
import { Link } from "react-router-dom";
import { baseUrl, hodUrl } from "../../../shared/baseUrl.js";
import { paginationCount } from "../../../shared/constant.js";
import Loading from "../../common/loader";
import Paginations from "../../common/pagination";
import StudentTable from "../../common/table/student";
import AlertBox from "../../common/alert";
import { UserRemoveModal } from "../../common/modal/userManagementModal";
import { connect } from "react-redux";
import NotificationModal from "../../common/modal/notification";

const mapStateToProps = (state) => ({
    profile: state.user.profile,
    group_name: state.content.group_name,
});

class StudentAssignModal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            studentId: [],
            studentItem: [],

            errorMsg: "",
            successMsg: "",
            showErrorAlert: false,
            showSuccessAlert: false,
            showLoader: false,
            isLoaded: false,
        };
    }

    handleSubmit = (event) => {
        event.preventDefault();
        var url = baseUrl + hodUrl;
        var authToken = localStorage.getItem("Authorization");
        var headers = {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: authToken,
        };

        this.setState({
            showLoader: true,
            showErrorAlert: false,
            showSuccessAlert: false,
        });

        fetch(`${url}/hod/group/${this.props.groupId}/assign/student/`, {
            headers: headers,
            method: "POST",
            body: JSON.stringify({
                student_ids: this.state.studentId,
            }),
        })
            .then((res) => res.json())
            .then((result) => {
                if (result.sts) {
                    this.setState({
                        successMsg: result.msg,
                        showSuccessAlert: true,
                        showLoader: false,
                    });
                    this.props.formSubmission();
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

    handleInputChange = (index, event) => {
        let values = [...this.state.studentId];
        if (event.target.checked) {
            values.push(event.target.value.toString());
            this.setState({
                studentId: values,
            });
        } else {
            values.splice(values.indexOf(event.target.value), 1);
            this.setState({
                studentId: values,
            });
        }
    };

    componentDidMount = () => {
        var url = baseUrl + hodUrl;
        var authToken = localStorage.getItem("Authorization");
        var headers = {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: authToken,
        };

        fetch(`${url}/hod/group/${this.props.groupId}/assign/student/`, {
            headers: headers,
            method: "GET",
        })
            .then((res) => res.json())
            .then((result) => {
                if (result.data) {
                    this.setState({
                        studentItem: result.data,
                    });
                }
                this.setState({
                    studentItem: result.data,
                    isLoaded: true,
                });
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
            <Modal
                show={this.props.show}
                onHide={this.props.onHide}
                size="lg"
                aria-labelledby="contained-modal-title-vcenter"
                centered
                scrollable
            >
                <Modal.Header closeButton>Assign Student</Modal.Header>
                <Modal.Body>
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

                    <div className="table-responsive">
                        <table className="table">
                            <thead className="primary-text">
                                <tr>
                                    <th scope="col"></th>
                                    <th scope="col">Name</th>
                                    <th scope="col">Username</th>
                                    <th scope="col">Email</th>
                                </tr>
                            </thead>
                            <tbody>
                                {this.state.isLoaded ? (
                                    this.state.studentItem.length !== 0 ? (
                                        this.state.studentItem.map(
                                            (list, index) => {
                                                return (
                                                    <tr key={index}>
                                                        <td className="text-center">
                                                            <div className="custom-control custom-checkbox">
                                                                <input
                                                                    type="checkbox"
                                                                    name="enable"
                                                                    value={
                                                                        list.id
                                                                    }
                                                                    className="custom-control-input"
                                                                    id={`check${index}`}
                                                                    onChange={(
                                                                        event
                                                                    ) =>
                                                                        this.handleInputChange(
                                                                            index,
                                                                            event
                                                                        )
                                                                    }
                                                                />
                                                                <label
                                                                    className="custom-control-label"
                                                                    htmlFor={`check${index}`}
                                                                ></label>
                                                            </div>
                                                        </td>
                                                        <td>
                                                            {list.full_name}
                                                        </td>
                                                        <td>{list.username}</td>
                                                        <td>{list.email}</td>
                                                    </tr>
                                                );
                                            }
                                        )
                                    ) : (
                                        <tr>
                                            <td>Data not available</td>
                                        </tr>
                                    )
                                ) : (
                                    <tr>
                                        <td>Loading...</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <button
                        className="btn btn-primary btn-sm shadow-none"
                        onClick={this.handleSubmit}
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
                            ""
                        )}
                        Assign
                    </button>
                </Modal.Footer>
            </Modal>
        );
    }
}

class HODGroupStudents extends Component {
    constructor(props) {
        super(props);
        this.state = {
            showStudentModal: false,
            showStudent_RemoveModal: false,

            studentItem: [],
            selectedStudent: [],
            activeStudentPage: 1,
            totalStudentCount: 0,

            notify_all: false,
            showNotificationModal: false,

            errorMsg: "",
            successMsg: "",
            showErrorAlert: false,
            showSuccessAlert: false,
            page_loading: true,
        };
        this.groupId = this.props.match.params.groupId;
        this.url = baseUrl + hodUrl;
        this.authToken = localStorage.getItem("Authorization");
        this.headers = {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: this.authToken,
        };
    }

    componentDidMount = () => {
        document.title = `${this.props.group_name} : Students - HOD | IQLabs`;

        this.loadStudentData();
    };

    loadStudentData = () => {
        fetch(
            this.state.activeStudentPage > 1
                ? `${this.url}/hod/group/${this.groupId}/student/?page=${this.state.activeStudentPage}`
                : `${this.url}/hod/group/${this.groupId}/student/`,
            {
                headers: this.headers,
                method: "GET",
            }
        )
            .then((res) => res.json())
            .then((result) => {
                if (result.sts === true) {
                    this.setState({
                        studentItem: result.data.results,
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

    toggleStudentModal = () => {
        this.setState({
            showStudentModal: !this.state.showStudentModal,
        });
    };

    handleRemove = () => {
        this.setState({
            showStudent_RemoveModal: !this.state.showStudent_RemoveModal,
        });
    };

    // Gets Student ID from the Student table
    handleStudentId = (data) => {
        let value = [];
        const studentItems = this.state.studentItem;
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

    formSubmission = () => {
        setTimeout(() => {
            this.setState({
                showStudentModal: false,
                showStudent_RemoveModal: false,
            });
        }, 1000);
        this.loadStudentData();
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

                {/* Student assign modal */}
                {this.state.showStudentModal ? (
                    <StudentAssignModal
                        show={this.state.showStudentModal}
                        onHide={this.toggleStudentModal}
                        groupId={this.groupId}
                        formSubmission={this.formSubmission}
                    />
                ) : (
                    ""
                )}

                {/* Student Removing Modal */}
                {this.state.showStudent_RemoveModal ? (
                    <UserRemoveModal
                        show={this.state.showStudent_RemoveModal}
                        onHide={this.handleRemove}
                        toggleModal={this.handleRemove}
                        formSubmission={this.formSubmission}
                        url={`${this.url}/hod/group/${this.groupId}/student/`}
                        data={this.state.selectedStudent}
                        field="student_ids"
                        type="Student"
                        token="Authorization"
                    />
                ) : (
                    ""
                )}

                {/* Notification Modal */}
                {this.state.showNotificationModal ? (
                    <NotificationModal
                        show={this.state.showNotificationModal}
                        onHide={() => {
                            this.setState({
                                showNotificationModal: false,
                            });
                        }}
                        url={`${this.url}/hod/group/${this.groupId}/student/notify/`}
                        data={this.state.selectedStudent}
                        field="student_id"
                        notify_all={this.state.notify_all}
                    />
                ) : (
                    ""
                )}

                <div className="row align-items-center">
                    <div className="col-md-6">
                        {/* Breadcrumb */}
                        <nav aria-label="breadcrumb">
                            <ol className="breadcrumb">
                                <li className="breadcrumb-item">
                                    <Link to="/hod">
                                        <i className="fas fa-home fa-sm"></i>
                                    </Link>
                                </li>
                                <li className="breadcrumb-item">
                                    <Link
                                        to="#"
                                        onClick={this.props.history.goBack}
                                    >
                                        {this.props.group_name}
                                    </Link>
                                </li>
                                <li className="breadcrumb-item active">
                                    Student
                                </li>
                            </ol>
                        </nav>
                    </div>
                    <div className="col-md-6">
                        <div className="d-flex flex-wrap justify-content-end mb-4">
                            <button
                                className="btn btn-primary btn-sm shadow-none mr-1"
                                onClick={this.toggleStudentModal}
                            >
                                Add New
                            </button>
                            <button
                                className="btn btn-primary btn-sm shadow-none mr-1"
                                onClick={this.handleRemove}
                            >
                                Remove
                            </button>
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

                {/* Student list */}
                <div className="card shadow-sm">
                    <StudentTable
                        studentItems={this.state.studentItem}
                        path={`hod/group/${this.groupId}`}
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

export default connect(mapStateToProps)(HODGroupStudents);
