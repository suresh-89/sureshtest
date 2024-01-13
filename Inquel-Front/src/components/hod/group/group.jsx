import React, { Component } from "react";
import Wrapper from "../wrapper";
import { Link } from "react-router-dom";
import { Modal, Alert, Spinner } from "react-bootstrap";
import Select from "react-select";
import { baseUrl, hodUrl } from "../../../shared/baseUrl.js";
import Loading from "../../common/loader";
import SubjectTable from "../../common/table/subject";
import AlertBox from "../../common/alert";
import {
    MultiContentDeleteModal,
    MultiContentEnableDisableModal,
} from "../../common/modal/contentManagementModal";
import { connect } from "react-redux";

const mapStateToProps = (state) => ({
    profile: state.user.profile,
    group_name: state.content.group_name,
});

class SubjectModal extends Component {
    constructor() {
        super();
        this.state = {
            subjectName: "",
            teacher_id: "",
            subject_code: "",

            teacherData: [],
            subjectItems: {},

            errorMsg: "",
            successMsg: "",
            showErrorAlert: false,
            showSuccessAlert: false,
            showLoader: false,
        };
        this.url = baseUrl + hodUrl;
        this.authToken = localStorage.getItem("Authorization");
        this.headers = {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: this.authToken,
        };
    }

    componentDidMount = () => {
        fetch(`${this.url}/hod/teacher/`, {
            headers: this.headers,
            method: "GET",
        })
            .then((res) => res.json())
            .then((result) => {
                if (result.sts === true) {
                    this.setState({
                        teacherData: result.data,
                    });
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

        fetch(
            `${this.url}/hod/group/levels/?category=${this.props.category}&sub_category=${this.props.sub_category}`,
            {
                headers: this.headers,
                method: "GET",
            }
        )
            .then((res) => res.json())
            .then((result) => {
                if (result.sts === true) {
                    this.setState({
                        subjectItems: result.data.SUBJECTS,
                    });
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

    handleSubmit = (event) => {
        event.preventDefault();

        this.setState({
            showLoader: true,
            showErrorAlert: false,
            showSuccessAlert: false,
        });

        if (this.state.subjectName === "") {
            this.setState({
                errorMsg: "Enter subject name",
                showErrorAlert: true,
                showLoader: false,
            });
        } else if (this.state.teacher_id === "") {
            this.setState({
                errorMsg: "Select teacher from the list",
                showErrorAlert: true,
                showLoader: false,
            });
        } else if (this.state.subject_code === "") {
            this.setState({
                errorMsg: "Select subject code from the list",
                showErrorAlert: true,
                showLoader: false,
            });
        } else {
            fetch(`${this.url}/hod/group/${this.props.groupId}/subject/`, {
                headers: this.headers,
                method: "POST",
                body: JSON.stringify({
                    subject_name: this.state.subjectName,
                    teacher_id: this.state.teacher_id,
                    subject: this.state.subject_code,
                }),
            })
                .then((res) => res.json())
                .then((result) => {
                    if (result.sts === true) {
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
        }
    };

    handleInput = (event) => {
        this.setState({
            subjectName: event.target.value,
        });
    };

    handleTeacher = (event) => {
        this.setState({
            teacher_id: event.value.toString(),
        });
    };

    handleSubject = (event) => {
        this.setState({
            subject_code: event.value,
        });
    };

    render() {
        return (
            <Modal
                show={this.props.show}
                onHide={this.props.onHide}
                size="md"
                aria-labelledby="contained-modal-title-vcenter"
                centered
            >
                <Modal.Header closeButton>Create Subject</Modal.Header>
                <form onSubmit={this.handleSubmit} autoComplete="off">
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

                        <div className="form-group">
                            <label htmlFor="subject">Subject name</label>
                            <input
                                type="text"
                                name="subject"
                                id="subject"
                                className="form-control borders"
                                placeholder="Enter subject name"
                                onChange={this.handleInput}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="teacher_id">Teacher</label>
                            <Select
                                className="basic-single borders"
                                placeholder="Select teacher"
                                isSearchable={true}
                                name="teacher_id"
                                id="teacher_id"
                                options={this.state.teacherData.map((list) => {
                                    return {
                                        value: list.id,
                                        label:
                                            list.full_name !== ""
                                                ? list.full_name
                                                : list.username,
                                    };
                                })}
                                onChange={this.handleTeacher}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="subject">Subject</label>
                            <Select
                                className="basic-single borders"
                                placeholder="Select subject"
                                isSearchable={true}
                                name="subject"
                                id="subject"
                                options={
                                    Object.keys(this.state.subjectItems)
                                        .length !== 0
                                        ? Object.entries(
                                              this.state.subjectItems
                                          ).map(([key, value]) => {
                                              return {
                                                  value: key,
                                                  label: value,
                                              };
                                          })
                                        : null
                                }
                                onChange={this.handleSubject}
                                required
                            />
                        </div>
                    </Modal.Body>
                    <Modal.Footer>
                        <button className="btn btn-primary btn-block shadow-none">
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
                            Create Subject
                        </button>
                    </Modal.Footer>
                </form>
            </Modal>
        );
    }
}

class SubjectEditModal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            subject_name: this.props.data.subject_name,

            errorMsg: "",
            successMsg: "",
            showErrorAlert: false,
            showSuccessAlert: false,
            showLoader: false,
        };
        this.url = baseUrl + hodUrl;
        this.authToken = localStorage.getItem("Authorization");
        this.headers = {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: this.authToken,
        };
    }

    handleInput = (event) => {
        this.setState({
            subject_name: event.target.value,
        });
    };

    handleSubmit = (event) => {
        event.preventDefault();

        this.setState({
            showLoader: true,
        });

        fetch(`${this.url}/hod/group/subject/`, {
            headers: this.headers,
            method: "PATCH",
            body: JSON.stringify({
                subject_id: this.props.data.id,
                subject_name: this.state.subject_name,
            }),
        })
            .then((res) => res.json())
            .then((result) => {
                if (result.sts === true) {
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

    render() {
        return (
            <Modal
                show={this.props.show}
                onHide={this.props.onHide}
                size="md"
                aria-labelledby="contained-modal-title-vcenter"
                centered
            >
                <Modal.Header closeButton>Edit Subject</Modal.Header>
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

                    <label htmlFor="subject">Subject name</label>
                    <input
                        type="text"
                        name="subject_name"
                        id="subject_name"
                        className="form-control form-control-lg borders"
                        onChange={this.handleInput}
                        value={this.state.subject_name}
                        placeholder="Enter subject name"
                        autoComplete="off"
                        required
                    />
                </Modal.Body>
                <Modal.Footer>
                    <button
                        className="btn btn-primary btn-block shadow-none"
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
                        Save changes
                    </button>
                </Modal.Footer>
            </Modal>
        );
    }
}

class HODGroup extends Component {
    constructor(props) {
        super(props);
        this.state = {
            showModal: false,
            showSubject_DeleteModal: false,
            showSubject_EnableDisableModal: false,
            showSubjectEditModal: false,

            subjectItems: [],
            groupItem: {},
            selectedSubject: [],

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
        document.title = `${this.props.group_name} - HOD | IQLabs`;

        this.loadSubjectData();
    };

    loadSubjectData = () => {
        fetch(`${this.url}/hod/group/${this.groupId}/`, {
            headers: this.headers,
            method: "GET",
        })
            .then((res) => res.json())
            .then((result) => {
                if (result.sts === true) {
                    this.setState({
                        subjectItems: result.data.subjects,
                        groupItem: result.data,
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

    toggleModal = () => {
        this.setState({
            showModal: !this.state.showModal,
        });
    };

    handleDelete = () => {
        this.setState({
            showSubject_DeleteModal: !this.state.showSubject_DeleteModal,
        });
    };

    handleEnableDisable = () => {
        this.setState({
            showSubject_EnableDisableModal:
                !this.state.showSubject_EnableDisableModal,
        });
    };

    // Gets Subject ID from the Subject table
    handleSubjectId = (data) => {
        let value = [];
        const subjectItems = this.state.subjectItems;
        for (let i = 0; i < subjectItems.length; i++) {
            if (data.includes(subjectItems[i].id.toString())) {
                value.push({
                    id: subjectItems[i].id.toString(),
                    name: subjectItems[i].subject_name,
                });
            } else {
                continue;
            }
        }
        this.setState({
            selectedSubject: value,
        });
    };

    formSubmission = () => {
        setTimeout(() => {
            this.setState({
                showModal: false,
                showSubject_DeleteModal: false,
                showSubject_EnableDisableModal: false,
                showSubjectEditModal: false,
            });
        }, 1000);
        this.loadSubjectData();
    };

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

                {/* Subject create modal */}
                {this.state.showModal ? (
                    <SubjectModal
                        show={this.state.showModal}
                        onHide={this.toggleModal}
                        groupId={this.groupId}
                        formSubmission={this.formSubmission}
                        category={this.props.profile.permissions.category}
                        sub_category={
                            this.props.profile.permissions.sub_category
                        }
                    />
                ) : (
                    ""
                )}

                {/* Subject Delete Modal */}
                {this.state.showSubject_DeleteModal ? (
                    <MultiContentDeleteModal
                        show={this.state.showSubject_DeleteModal}
                        onHide={this.handleDelete}
                        toggleModal={this.handleDelete}
                        formSubmission={this.formSubmission}
                        url={`${this.url}/hod/group/subject/`}
                        data={this.state.selectedSubject}
                        field="subject_ids"
                        type="Subject"
                    />
                ) : (
                    ""
                )}

                {/* Subject Enable Disable Modal */}
                {this.state.showSubject_EnableDisableModal ? (
                    <MultiContentEnableDisableModal
                        show={this.state.showSubject_EnableDisableModal}
                        onHide={this.handleEnableDisable}
                        toggleModal={this.handleEnableDisable}
                        formSubmission={this.formSubmission}
                        url={`${this.url}/hod/group/subject/`}
                        data={this.state.selectedSubject}
                        field="subject_ids"
                        type="Subject"
                    />
                ) : (
                    ""
                )}

                {/* Edit Modal */}
                {this.state.showSubjectEditModal ? (
                    <SubjectEditModal
                        show={this.state.showSubjectEditModal}
                        onHide={() => {
                            this.setState({
                                showSubjectEditModal: false,
                            });
                        }}
                        formSubmission={this.formSubmission}
                        data={this.state.selectedSubject}
                    />
                ) : (
                    ""
                )}

                <div className="row align-items-center mb-3 mt-2">
                    <div className="col-6">
                        {/* ----- Breadcrumb ----- */}
                        <nav aria-label="breadcrumb">
                            <ol className="breadcrumb">
                                <li className="breadcrumb-item">
                                    <Link to="/hod">
                                        <i className="fas fa-home fa-sm"></i>
                                    </Link>
                                </li>
                                <li className="breadcrumb-item active">
                                    <span>Group:</span>
                                    {this.props.group_name} -{" "}
                                    {this.state.groupItem.level
                                        ? this.state.groupItem.level
                                        : ""}
                                </li>
                            </ol>
                        </nav>
                    </div>
                    <div className="col-6 text-right">
                        <Link to={`${this.props.match.url}/student`}>
                            <button className="btn btn-primary btn-sm shadow-none mr-1">
                                Student
                            </button>
                        </Link>
                        <Link to={`${this.props.match.url}/teacher`}>
                            <button className="btn btn-primary btn-sm shadow-none mr-1">
                                Teacher
                            </button>
                        </Link>
                        <Link to={`${this.props.match.url}/details`}>
                            <button className="btn btn-primary btn-sm shadow-none">
                                Details
                            </button>
                        </Link>
                    </div>
                </div>
                <div className="card shadow-sm mb-4">
                    <div className="card-header">
                        <div className="row align-items-center">
                            <div className="col-md-3">
                                <h5 className="mb-0">Subjects</h5>
                            </div>
                            <div className="col-md-9 text-right">
                                <button
                                    className="btn btn-primary btn-sm shadow-none mr-1"
                                    onClick={this.toggleModal}
                                >
                                    Add new
                                </button>
                                <button
                                    className="btn btn-primary btn-sm shadow-none mr-1"
                                    onClick={this.handleDelete}
                                >
                                    Delete
                                </button>
                                <button
                                    className="btn btn-primary btn-sm shadow-none"
                                    onClick={this.handleEnableDisable}
                                >
                                    Enable / Disable
                                </button>
                            </div>
                        </div>
                    </div>
                    <SubjectTable
                        subjectItems={this.state.subjectItems}
                        path={`hod/group/${this.groupId}`}
                        check={true}
                        status={true}
                        subject={true}
                        hasEdit={true}
                        handleSubjectId={this.handleSubjectId}
                        handleEdit={(data) => {
                            this.setState({
                                selectedSubject: data,
                                showSubjectEditModal: true,
                            });
                        }}
                    />
                    <div className="card-footer"></div>
                </div>
                {/* Loading component */}
                {this.state.page_loading ? <Loading /> : ""}
            </Wrapper>
        );
    }
}

export default connect(mapStateToProps)(HODGroup);
