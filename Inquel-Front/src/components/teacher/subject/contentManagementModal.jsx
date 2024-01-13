import React, { Component } from "react";
import { Link } from "react-router-dom";
import { Modal, Alert, Spinner, Dropdown } from "react-bootstrap";
import { baseUrl, teacherUrl } from "../../../shared/baseUrl.js";
import ReactSwitch from "../../common/switchComponent";
import ScoreCardTable from "../../common/scorecard";

export function ChapterList(props) {
    return (
        <tr key={props.index}>
            <td>{props.chapter.chapter_name}</td>
            <td>
                {props.chapter.chapter_status.toLowerCase() ===
                "yet to start" ? (
                    <span className="text-danger text-capitalize">
                        {props.chapter.chapter_status}
                    </span>
                ) : props.chapter.chapter_status.toLowerCase() ===
                  "in progress" ? (
                    <span className="text-warning text-capitalize">
                        {props.chapter.chapter_status}
                    </span>
                ) : props.chapter.chapter_status.toLowerCase() ===
                  "ready for review" ? (
                    <span className="text-primary text-capitalize">
                        {props.chapter.chapter_status}
                    </span>
                ) : props.chapter.chapter_status.toLowerCase() === "approved" ||
                  props.chapter.chapter_status.toLowerCase() ===
                      "published to group" ? (
                    <span className="text-success text-capitalize">
                        {props.chapter.chapter_status}
                    </span>
                ) : (
                    props.chapter.chapter_status
                )}
            </td>
            <td>{props.chapter.weightage}</td>
            <td>
                {props.permissions.summary === true ? (
                    <>
                        <Link
                            to={`${props.url}/chapter/${props.chapter.chapter_id}/summary/upload`}
                            className="primary-text"
                        >
                            <button
                                className="btn btn-primary btn-sm shadow-none mr-2"
                                onClick={() =>
                                    props.dispatchChapter(
                                        props.chapter.chapter_name
                                    )
                                }
                            >
                                <i className="fas fa-file-upload"></i>
                            </button>
                        </Link>
                        <Link
                            to={`${props.url}/chapter/${props.chapter.chapter_id}/summary`}
                            className="primary-text"
                        >
                            <button
                                className="btn btn-primary btn-sm shadow-none"
                                onClick={() =>
                                    props.dispatchChapter(
                                        props.chapter.chapter_name
                                    )
                                }
                            >
                                <i className="fas fa-file-medical"></i>
                            </button>
                        </Link>
                    </>
                ) : (
                    <>
                        <button
                            className="btn btn-primary btn-sm shadow-none mr-2"
                            disabled
                        >
                            <i className="fas fa-file-upload"></i>
                        </button>
                        <button
                            className="btn btn-primary btn-sm shadow-none"
                            disabled
                        >
                            <i className="fas fa-file-medical"></i>
                        </button>
                    </>
                )}
            </td>
            <td className="d-flex justify-content-end">
                <Link to={`${props.url}/chapter/${props.chapter.chapter_id}`}>
                    <button
                        className="btn btn-primary btn-sm shadow-none"
                        onClick={() =>
                            props.dispatchChapter(props.chapter.chapter_name)
                        }
                    >
                        Add / Edit
                    </button>
                </Link>

                <Dropdown drop="left" key="left">
                    <Dropdown.Toggle
                        variant="white"
                        className="btn btn-link btn-sm shadow-none caret-off ml-2"
                        disabled={props.chapter.publish === true ? true : false}
                    >
                        <i className="fas fa-ellipsis-v"></i>
                    </Dropdown.Toggle>

                    <Dropdown.Menu>
                        <Dropdown.Item
                            onClick={() =>
                                props.toggleChapter_EditModal(props.chapter)
                            }
                        >
                            <i className="far fa-edit fa-sm mr-1"></i> Edit
                        </Dropdown.Item>
                        {props.group ? (
                            <Dropdown.Item
                                onClick={() =>
                                    props.toggleChapter_DeleteModal(
                                        props.chapter
                                    )
                                }
                            >
                                <i className="far fa-trash-alt fa-sm mr-1"></i>{" "}
                                Delete
                            </Dropdown.Item>
                        ) : (
                            ""
                        )}
                    </Dropdown.Menu>
                </Dropdown>
            </td>
        </tr>
    );
}

export class ChapterModal extends Component {
    constructor() {
        super();
        this.state = {
            chapter_name: "",
            weightage: "",
            errorMsg: "",
            successMsg: "",
            showErrorAlert: false,
            showSuccessAlert: false,
            showLoader: false,
        };
        this.url = baseUrl + teacherUrl;
        this.authToken = localStorage.getItem("Authorization");
        this.headers = {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: this.authToken,
        };
    }

    handleSubmit = (event) => {
        event.preventDefault();

        this.setState({
            showLoader: true,
            showErrorAlert: false,
            showSuccessAlert: false,
        });

        fetch(`${this.url}/teacher/subject/${this.props.subjectId}/chapter/`, {
            headers: this.headers,
            method: "POST",
            body: JSON.stringify({
                chapter_name: this.state.chapter_name,
                weightage: this.state.weightage,
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
                    this.props.formSubmission(true);
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

    handleCourse = (event) => {
        this.setState({
            chapter_name: event.target.value,
        });
    };

    handleWeightage = (event) => {
        this.setState({
            weightage: event.target.value,
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
                <Modal.Header closeButton>Add chapter</Modal.Header>
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
                            <label htmlFor="chapter">Chapter name</label>
                            <input
                                type="text"
                                name="chapter"
                                id="chapter"
                                className="form-control borders"
                                onChange={this.handleCourse}
                                placeholder="Chapter name"
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="weightage">Weightage</label>
                            <input
                                type="text"
                                name="weightage"
                                id="weightage"
                                className="form-control borders"
                                onChange={this.handleWeightage}
                                placeholder="Weightage"
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
                            Add
                        </button>
                    </Modal.Footer>
                </form>
            </Modal>
        );
    }
}

export class ChapterEditModal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            chapter_id: this.props.data.chapter_id,
            chapter_name: this.props.data.chapter_name,
            weightage: this.props.data.weightage,
            chapter_status: this.props.data.chapter_status,
            status: [],

            errorMsg: "",
            successMsg: "",
            showErrorAlert: false,
            showSuccessAlert: false,
            showLoader: false,
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
        fetch(`${this.url}/teacher/subject/${this.props.subjectId}/chapter/`, {
            headers: this.headers,
            method: "GET",
        })
            .then((res) => res.json())
            .then((result) => {
                this.setState({
                    status: result.data.chapter_status,
                });
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

    handleSubmit = (event) => {
        event.preventDefault();

        this.setState({
            showLoader: true,
            showErrorAlert: false,
            showSuccessAlert: false,
        });

        fetch(`${this.url}/teacher/subject/${this.props.subjectId}/chapter/`, {
            headers: this.headers,
            method: "PATCH",
            body: JSON.stringify({
                chapter_id: this.state.chapter_id,
                chapter_name: this.state.chapter_name,
                chapter_status: this.state.chapter_status,
                weightage: this.state.weightage.toString(),
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
                    this.props.formSubmission(true);
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

    handleCourse = (event) => {
        this.setState({
            chapter_name: event.target.value,
        });
    };

    handleWeightage = (event) => {
        this.setState({
            weightage: event.target.value,
        });
    };

    handleStatus = (event) => {
        this.setState({
            chapter_status: event.target.value,
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
                <Modal.Header closeButton>Edit chapter</Modal.Header>
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
                            <label htmlFor="chapter">Chapter name</label>
                            <input
                                type="text"
                                name="chapter"
                                id="chapter"
                                className="form-control borders"
                                onChange={this.handleCourse}
                                placeholder="Chapter name"
                                value={this.state.chapter_name}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="weightage">Weightage</label>
                            <input
                                type="text"
                                name="weightage"
                                id="weightage"
                                className="form-control borders"
                                onChange={this.handleWeightage}
                                placeholder="Weightage"
                                value={this.state.weightage}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="status">Status</label>
                            <select
                                name="status"
                                id="status"
                                className="form-control borders"
                                onChange={this.handleStatus}
                                value={this.state.chapter_status}
                                required
                            >
                                <option value="">Select an option</option>
                                {this.state.status.map((list, index) => {
                                    return (
                                        <option value={list} key={index}>
                                            {list}
                                        </option>
                                    );
                                })}
                            </select>
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
                            Update
                        </button>
                    </Modal.Footer>
                </form>
            </Modal>
        );
    }
}

export class SemesterModal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            semester_name: "",
            chapter_id: this.props.chapter_id,
            errorMsg: "",
            successMsg: "",
            showErrorAlert: false,
            showSuccessAlert: false,
            showLoader: false,
        };
        this.url = baseUrl + teacherUrl;
        this.authToken = localStorage.getItem("Authorization");
        this.headers = {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: this.authToken,
        };
    }

    handleSubmit = (event) => {
        event.preventDefault();

        this.setState({
            showLoader: true,
            showErrorAlert: false,
            showSuccessAlert: false,
        });

        fetch(`${this.url}/teacher/subject/${this.props.subjectId}/semester/`, {
            headers: this.headers,
            method: "POST",
            body: JSON.stringify({
                semester_name: this.state.semester_name,
                chapter_ids: this.state.chapter_id,
            }),
        })
            .then((res) => res.json())
            .then((result) => {
                if (result.sts === true) {
                    this.setState({
                        successMsg: result.msg,
                        showSuccessAlert: true,
                        showLoader: false,
                        chapter_names: [],
                    });
                    this.props.formSubmission(true);
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

    handleSemester = (event) => {
        this.setState({
            semester_name: event.target.value,
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
                <Modal.Header closeButton>Add Semester</Modal.Header>
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

                        <label htmlFor="semester">Semester name</label>
                        <input
                            type="text"
                            name="semester"
                            id="semester"
                            className="form-control borders"
                            onChange={this.handleSemester}
                            placeholder="Semester name"
                            required
                        />
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
                            Add
                        </button>
                    </Modal.Footer>
                </form>
            </Modal>
        );
    }
}

export class IndependentSemesterModal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            semester_name: "",
            chapter: this.props.chapter_id,
            chapter_id: [],
            limited: false,

            errorMsg: "",
            successMsg: "",
            showErrorAlert: false,
            showSuccessAlert: false,
            showLoader: false,
        };
        this.url = baseUrl + teacherUrl;
        this.authToken = localStorage.getItem("Authorization");
        this.headers = {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: this.authToken,
        };
    }

    handleSubmit = (event) => {
        event.preventDefault();

        this.setState({
            showLoader: true,
            showErrorAlert: false,
            showSuccessAlert: false,
        });

        fetch(
            `${this.url}/teacher/independent/subject/${this.props.subjectId}/semester/`,
            {
                headers: this.headers,
                method: "POST",
                body: JSON.stringify({
                    semester_name: this.state.semester_name,
                    chapter_ids: this.state.chapter_id,
                    limited: this.state.limited,
                }),
            }
        )
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

    handleSemester = (event) => {
        this.setState({
            semester_name: event.target.value,
        });
    };

    handleCheck = (event) => {
        let chapter_id = [...this.state.chapter_id];
        if (event.target.checked) {
            chapter_id.push(event.target.value);
        } else {
            chapter_id.splice(chapter_id.indexOf(event.target.value), 1);
        }
        this.setState({
            chapter_id: chapter_id,
        });
    };

    handleSwitch = () => {
        this.setState({
            limited: !this.state.limited,
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
                <Modal.Header closeButton>Add Semester</Modal.Header>
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

                        <div className="row align-items-start mb-3">
                            <div className="col-md-8 mb-2 mb-md-0">
                                <p className="mb-2 font-weight-bold-600">
                                    Select chapters
                                </p>
                                {this.state.chapter.length !== 0
                                    ? this.state.chapter.map(
                                          (chapter, index) => {
                                              return (
                                                  <div
                                                      className="custom-control custom-checkbox"
                                                      key={index}
                                                  >
                                                      <input
                                                          type="checkbox"
                                                          className="custom-control-input"
                                                          id={`chapter-${index}`}
                                                          value={
                                                              chapter.chapter_id
                                                          }
                                                          onChange={
                                                              this.handleCheck
                                                          }
                                                      />
                                                      <label
                                                          className="custom-control-label"
                                                          htmlFor={`chapter-${index}`}
                                                      >
                                                          {chapter.chapter_name}
                                                      </label>
                                                  </div>
                                              );
                                          }
                                      )
                                    : ""}
                            </div>
                            <div className="col-md-4 d-flex justify-content-end">
                                <div className="d-flex align-items-center">
                                    <span className="mr-4">Limited</span>
                                    <ReactSwitch
                                        onChange={this.handleSwitch}
                                        checked={this.state.limited}
                                    />
                                </div>
                            </div>
                        </div>

                        <label htmlFor="semester">Semester name</label>
                        <input
                            type="text"
                            name="semester"
                            id="semester"
                            className="form-control borders"
                            onChange={this.handleSemester}
                            placeholder="Semester name"
                            required
                        />
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
                            Add
                        </button>
                    </Modal.Footer>
                </form>
            </Modal>
        );
    }
}

export class IndependentSemesterEditModal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            chapter: this.props.chapter_id, // list of all chapters
            semester_name: this.props.data.semester_name,
            semester_chapters: this.props.data.chapter_ids,
            limited: this.props.data.limited,

            errorMsg: "",
            successMsg: "",
            showErrorAlert: false,
            showSuccessAlert: false,
            showLoader: false,
        };
        this.url = baseUrl + teacherUrl;
        this.authToken = localStorage.getItem("Authorization");
        this.headers = {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: this.authToken,
        };
    }

    handleSubmit = (event) => {
        event.preventDefault();

        this.setState({
            showLoader: true,
            showErrorAlert: false,
            showSuccessAlert: false,
        });

        fetch(
            `${this.url}/teacher/independent/subject/${this.props.subjectId}/semester/`,
            {
                headers: this.headers,
                method: "PATCH",
                body: JSON.stringify({
                    semester_id: this.props.data.semester_id,
                    semester_name: this.state.semester_name,
                    chapter_ids: this.state.semester_chapters,
                    limited: this.state.limited,
                }),
            }
        )
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

    handleSemester = (event) => {
        this.setState({
            semester_name: event.target.value,
        });
    };

    handleCheck = (event) => {
        let chapter_id = [...this.state.semester_chapters];
        if (event.target.checked) {
            chapter_id.push(event.target.value);
        } else {
            chapter_id.splice(chapter_id.indexOf(event.target.value), 1);
        }
        this.setState({
            semester_chapters: chapter_id,
        });
    };

    handleSwitch = () => {
        this.setState({
            limited: !this.state.limited,
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
                <Modal.Header closeButton>Edit Semester</Modal.Header>
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

                        <div className="row align-items-start mb-3">
                            <div className="col-md-8 mb-2 mb-md-0">
                                <p className="mb-2 font-weight-bold-600">
                                    Select chapters
                                </p>
                                {this.state.chapter.length !== 0
                                    ? this.state.chapter.map(
                                          (chapter, index) => {
                                              return (
                                                  <div
                                                      className="custom-control custom-checkbox"
                                                      key={index}
                                                  >
                                                      <input
                                                          type="checkbox"
                                                          className="custom-control-input"
                                                          id={`chapter-${index}`}
                                                          value={
                                                              chapter.chapter_id
                                                          }
                                                          onChange={
                                                              this.handleCheck
                                                          }
                                                          checked={
                                                              this.state.semester_chapters.includes(
                                                                  chapter.chapter_id
                                                              )
                                                                  ? true
                                                                  : false
                                                          }
                                                      />
                                                      <label
                                                          className="custom-control-label"
                                                          htmlFor={`chapter-${index}`}
                                                      >
                                                          {chapter.chapter_name}
                                                      </label>
                                                  </div>
                                              );
                                          }
                                      )
                                    : ""}
                            </div>
                            <div className="col-md-4 d-flex justify-content-end">
                                <div className="d-flex align-items-center">
                                    <span className="mr-4">Limited</span>
                                    <ReactSwitch
                                        onChange={this.handleSwitch}
                                        checked={this.state.limited}
                                    />
                                </div>
                            </div>
                        </div>

                        <label htmlFor="semester">Semester name</label>
                        <input
                            type="text"
                            name="semester"
                            id="semester"
                            className="form-control borders"
                            onChange={this.handleSemester}
                            placeholder="Semester name"
                            value={this.state.semester_name}
                            required
                        />
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
                            Update
                        </button>
                    </Modal.Footer>
                </form>
            </Modal>
        );
    }
}

export class Scorecard extends Component {
    constructor(props) {
        super(props);
        this.state = {
            errorMsg: "",
            successMsg: "",
            showErrorAlert: false,
            showSuccessAlert: false,
            showLoader: false,
            scorecard: [],
            page_loading: true,
        };
        this.subjectId = this.props.subjectId;
        this.chapterId = this.props.chapterId;
        this.cycle_testId = this.props.cycle_testId;
        this.url = baseUrl + teacherUrl;
        this.authToken = localStorage.getItem("Authorization");
        this.headers = {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: this.authToken,
        };
    }

    componentDidMount = () => {
        this.setState(
            {
                scorecard: this.props.scorecard,
            },
            () => {
                this.setState({
                    page_loading: false,
                });
            }
        );
    };

    handleData = (event, category, type, index) => {
        let scorecard = this.state.scorecard;

        if (type === "remarks") {
            var temp = Object.entries(scorecard);
            for (let i = 0; i < Object.keys(scorecard).length; i++) {
                if (temp[i][0] === category) {
                    temp[i][0] = event.target.value;
                } else {
                    continue;
                }
            }
            scorecard = Object.fromEntries(temp);
        } else if (type === "range") {
            scorecard[category][type][index] = Number(event.target.value);
        } else if (type === "retake" || type === "reduction_duration") {
            scorecard[category][type] = `${event.target.value.trim()} week`;
        } else if (type === "reduction") {
            scorecard[category][type] = `${event.target.value.trim()}%`;
        } else {
            scorecard[category][type] = event.target.value;
        }

        this.setState({
            scorecard: scorecard,
        });
    };

    handleSubmit = () => {
        this.setState({
            showErrorAlert: false,
            showSuccessAlert: false,
            showLoader: true,
        });

        fetch(`${this.url}/teacher/subject/${this.subjectId}/scorecard/`, {
            method: "POST",
            headers: this.headers,
            body: JSON.stringify({
                score_card_config: this.state.scorecard,
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
                size="xl"
                aria-labelledby="contained-modal-title-vcenter"
                centered
            >
                <Modal.Header closeButton className="align-items-center">
                    Scorecard Configuration
                    {this.state.page_loading ? (
                        <Spinner
                            as="span"
                            animation="border"
                            size="sm"
                            role="status"
                            aria-hidden="true"
                            className="ml-3 mb-0"
                        />
                    ) : (
                        ""
                    )}
                </Modal.Header>
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

                    {/* <!----- Scorecard Table -----> */}

                    <ScoreCardTable
                        scorecard={this.state.scorecard}
                        handleData={this.handleData}
                    />
                </Modal.Body>
                <Modal.Footer className="text-right">
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
                        Save & Close
                    </button>
                </Modal.Footer>
            </Modal>
        );
    }
}
