import React, { Component, lazy, Suspense } from "react";
import Wrapper from "../wrapper";
import { connect } from "react-redux";
import axios from "axios";
import { Link } from "react-router-dom";
import { Spinner } from "react-bootstrap";
import { baseUrl, teacherUrl } from "../../../shared/baseUrl.js";
import Loading from "../../common/loader";
import dateFormat from "dateformat";
import AlertBox from "../../common/alert";

const DirectPDF = lazy(() => import("../../common/preview/DirectPDF"));

const mapStateToProps = (state) => ({
    group_name: state.content.group_name,
    subject_name: state.content.subject_name,
    semester_name: state.content.semester_name,
});

class TeacherSemesterDirect extends Component {
    constructor(props) {
        super(props);
        this.state = {
            errorMsg: "",
            successMsg: "",
            showErrorAlert: false,
            showSuccessAlert: false,
            showLoader: false,
            isFileUploaded: false,

            pdf: {
                file_name: null,
                file: null,
            },
            exam_date: "",
            starts_at: "",
            ends_at: "",
            valid_from: "",
            valid_to: "",
            publish: false,

            path: null,
            btnDisabled: false,
            page_loading: true,
        };
        this.groupId = this.props.match.params.groupId;
        this.subjectId = this.props.match.params.subjectId;
        this.semesterId = this.props.match.params.semesterId;
        this.url = baseUrl + teacherUrl;
        this.authToken = localStorage.getItem("Authorization");
        this.headers = {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: this.authToken,
        };
    }

    componentDidMount = () => {
        document.title = `${this.props.semester_name} - Teacher | IQLabs`;

        this.loadSemesterData();
    };

    loadSemesterData = () => {
        fetch(
            `${this.url}/teacher/subject/${this.subjectId}/semester/${this.semesterId}/files/`,
            {
                method: "GET",
                headers: this.headers,
            }
        )
            .then((res) => res.json())
            .then((result) => {
                if (result.sts === true) {
                    this.setState({
                        isFileUploaded:
                            result.data.direct_question_urls.length === 0
                                ? false
                                : true,
                        path:
                            result.data.direct_question_urls.length !== 0
                                ? result.data.direct_question_urls[0]
                                : null,
                        exam_date:
                            result.data.exam_date !== null
                                ? dateFormat(
                                      result.data.exam_date,
                                      "yyyy-mm-dd 00:00:00"
                                  )
                                : "",
                        starts_at:
                            result.data.starts_at !== null
                                ? dateFormat(result.data.starts_at, "HH:MM:ss")
                                : "",
                        ends_at:
                            result.data.ends_at !== null
                                ? dateFormat(result.data.ends_at, "HH:MM:ss")
                                : "",
                        valid_from: dateFormat(
                            result.group_valid_from,
                            "yyyy-mm-dd"
                        ),
                        valid_to: dateFormat(
                            result.group_valid_to,
                            "yyyy-mm-dd"
                        ),
                        publish: result.data.publish,
                    });
                } else {
                    this.setState({
                        errorMsg: result.msg,
                        showErrorAlert: true,
                        showLoader: false,
                    });
                }
                this.setState({
                    page_loading: false,
                });
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

    handleFile = (event) => {
        const pdf = this.state.pdf;
        pdf.file_name = event.target.files[0].name;
        pdf.file = event.target.files[0];
        let extension = event.target.files[0].name.split(".");
        if (extension[extension.length - 1].toLowerCase() !== "pdf") {
            this.setState({
                errorMsg: "Invalid file format!",
                showErrorAlert: true,
                btnDisabled: true,
            });
        } else if (event.target.files[0].size > 5242880) {
            this.setState({
                errorMsg: "File size exceeds more then 5MB!",
                showErrorAlert: true,
                btnDisabled: true,
            });
        } else {
            this.setState({
                pdf: pdf,
                path: URL.createObjectURL(event.target.files[0]),
                btnDisabled: false,
            });
        }
    };

    handleDate = (event) => {
        this.setState({
            exam_date: `${dateFormat(
                event.target.value,
                "yyyy-mm-dd"
            )} 00:00:00`,
        });
    };

    handleTime = (event) => {
        const target = event.target;
        const value = target.value;
        const name = target.name;

        this.setState({
            [name]: `${value}:00`,
        });
    };

    handleSubmit = (event) => {
        event.preventDefault();

        this.setState({
            showLoader: true,
            showSuccessAlert: false,
            showErrorAlert: false,
        });

        const pdf = this.state.pdf;

        let form_data = new FormData();

        form_data.append("semester_id", this.semesterId);
        form_data.append("exam_date", this.state.exam_date);
        form_data.append("starts_at", this.state.starts_at);
        form_data.append("ends_at", this.state.ends_at);
        if (pdf.file !== null) {
            form_data.append("semester_file_1", pdf.file);
        }

        const options = {
            headers: {
                Accept: "application/json",
                "Content-Type": "multipart/form-data",
                Authorization: this.authToken,
            },
        };

        if (this.state.exam_date === "") {
            this.setState({
                errorMsg: "Please select Exam date",
                showErrorAlert: true,
                showLoader: false,
            });
        } else if (this.state.starts_at === "") {
            this.setState({
                errorMsg: "Please select Starts at timings",
                showErrorAlert: true,
                showLoader: false,
            });
        } else if (this.state.ends_at === "") {
            this.setState({
                errorMsg: "Please select Ends at timings",
                showErrorAlert: true,
                showLoader: false,
            });
        } else {
            if (this.state.isFileUploaded === true) {
                this.handlePATCH(form_data, options);
            } else {
                this.handlePOST(form_data, options);
            }
        }
    };

    handlePOST = (form_data, options) => {
        let pdf = this.state.pdf;
        let extension = "";

        if (pdf.file_name !== null) {
            extension = pdf.file_name.split(".");
        }

        if (pdf.file === null) {
            this.setState({
                errorMsg: "Please upload a file",
                showErrorAlert: true,
                showLoader: false,
            });
        } else if (extension[extension.length - 1].toLowerCase() !== "pdf") {
            this.setState({
                errorMsg: "Invalid file format!",
                showErrorAlert: true,
            });
        } else if (pdf.file.size > 5242880) {
            this.setState({
                errorMsg: "File size exceeds more then 5MB!",
                showErrorAlert: true,
            });
        } else {
            axios
                .post(
                    `${this.url}/teacher/subject/${this.subjectId}/semester/${this.semesterId}/files/`,
                    form_data,
                    options
                )
                .then((result) => {
                    if (result.data.sts === true) {
                        this.setState(
                            {
                                successMsg: result.data.msg,
                                showSuccessAlert: true,
                                showLoader: false,
                                pdf: { file: null, file_name: null },
                            },
                            () => {
                                this.setState({
                                    page_loading: true,
                                });
                                this.loadSemesterData();
                            }
                        );
                    } else if (result.data.sts === false) {
                        this.setState({
                            errorMsg: result.data.msg,
                            showErrorAlert: true,
                            showLoader: false,
                        });
                    }
                })
                .catch((err) => {
                    console.log(err);
                    if (err.response) {
                        this.setState({
                            errorMsg: err.response.data.msg,
                        });
                    } else if (err.request) {
                        this.setState({
                            errorMsg: err.request.data.msg,
                        });
                    } else if (err.message) {
                        this.setState({
                            errorMsg: err.message.data.msg,
                        });
                    }
                    this.setState({
                        showErrorAlert: true,
                        showLoader: false,
                    });
                });
        }
    };

    handlePATCH = (form_data, options) => {
        const pdf = this.state.pdf;
        let extension = "";

        if (pdf.file_name !== null) {
            extension = pdf.file_name.split(".");
        }

        if (extension !== "") {
            if (extension[extension.length - 1].toLowerCase() !== "pdf") {
                this.setState({
                    errorMsg: "Invalid file format!",
                    showErrorAlert: true,
                });
            } else if (pdf.file.size > 5242880) {
                this.setState({
                    errorMsg: "File size exceeds more then 5MB!",
                    showErrorAlert: true,
                });
            } else {
                axios
                    .patch(
                        `${this.url}/teacher/subject/${this.subjectId}/semester/${this.semesterId}/files/`,
                        form_data,
                        options
                    )
                    .then((result) => {
                        if (result.data.sts === true) {
                            this.setState(
                                {
                                    successMsg: result.data.msg,
                                    showSuccessAlert: true,
                                    showLoader: false,
                                    pdf: { file: null, file_name: null },
                                },
                                () => {
                                    this.setState({
                                        page_loading: true,
                                    });
                                    this.loadSemesterData();
                                }
                            );
                        } else if (result.data.sts === false) {
                            this.setState({
                                errorMsg: result.data.msg,
                                showErrorAlert: true,
                                showLoader: false,
                            });
                        }
                    })
                    .catch((err) => {
                        console.log(err);
                        if (err.response) {
                            this.setState({
                                errorMsg: err.response.data.msg,
                            });
                        } else if (err.request) {
                            this.setState({
                                errorMsg: err.request.data.msg,
                            });
                        } else if (err.message) {
                            this.setState({
                                errorMsg: err.message.data.msg,
                            });
                        }
                        this.setState({
                            showErrorAlert: true,
                            showLoader: false,
                        });
                    });
            }
        } else {
            axios
                .patch(
                    `${this.url}/teacher/subject/${this.subjectId}/semester/${this.semesterId}/files/`,
                    form_data,
                    options
                )
                .then((result) => {
                    if (result.data.sts === true) {
                        this.setState(
                            {
                                successMsg: result.data.msg,
                                showSuccessAlert: true,
                                showLoader: false,
                                pdf: { file: null, file_name: null },
                            },
                            () => {
                                this.setState({
                                    page_loading: true,
                                });
                                this.loadSemesterData();
                            }
                        );
                    } else if (result.data.sts === false) {
                        if (result.data.detail) {
                            this.setState({
                                errorMsg: result.data.detail,
                            });
                        } else {
                            this.setState({
                                errorMsg: result.data.msg,
                            });
                        }
                        this.setState({
                            showErrorAlert: true,
                            showLoader: false,
                        });
                    }
                })
                .catch((err) => {
                    console.log(err);
                    if (err.response) {
                        this.setState({
                            errorMsg: err.response.data.msg,
                        });
                    } else if (err.request) {
                        this.setState({
                            errorMsg: err.request.data.msg,
                        });
                    } else if (err.message) {
                        this.setState({
                            errorMsg: err.message.data.msg,
                        });
                    }
                    this.setState({
                        showErrorAlert: true,
                        showLoader: false,
                    });
                });
        }
    };

    handlePublish = () => {
        this.setState({
            showErrorAlert: false,
            showSuccessAlert: false,
            page_loading: true,
        });

        fetch(
            `${this.url}/teacher/subject/${this.subjectId}/semester/publish/`,
            {
                method: "POST",
                headers: this.headers,
                body: JSON.stringify({
                    semester_id: this.semesterId,
                }),
            }
        )
            .then((res) => res.json())
            .then((result) => {
                if (result.sts === true) {
                    this.setState({
                        successMsg: `Semester exam ${
                            this.state.publish === false
                                ? "published"
                                : "unpublished"
                        }`,
                        showSuccessAlert: true,
                        page_loading: false,
                        publish: !this.state.publish,
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

    render() {
        return (
            <Wrapper
                header={this.props.subject_name}
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

                <div className="row mb-4">
                    <div className="col-md-8">
                        {/* ----- Breadcrumb ----- */}
                        <nav aria-label="breadcrumb">
                            <ol className="breadcrumb mb-3">
                                <li className="breadcrumb-item">
                                    <Link to="/teacher">
                                        <i className="fas fa-home fa-sm"></i>
                                    </Link>
                                </li>
                                <li className="breadcrumb-item">
                                    <Link to={`/teacher/group/${this.groupId}`}>
                                        {this.props.group_name}
                                    </Link>
                                </li>
                                <li className="breadcrumb-item">
                                    <Link
                                        to="#"
                                        onClick={this.props.history.goBack}
                                    >
                                        {this.props.subject_name}
                                    </Link>
                                </li>
                                <li className="breadcrumb-item active">
                                    {this.props.semester_name}
                                </li>
                            </ol>
                        </nav>
                    </div>
                    <div className="col-md-4 text-right">
                        <Link to={`${this.props.match.url}/evaluation`}>
                            <button className="btn btn-primary btn-sm">
                                Evaluate Student
                            </button>
                        </Link>
                        <button
                            className="btn btn-primary btn-sm shadow-none ml-1"
                            onClick={this.handlePublish}
                            disabled={this.state.isFileUploaded ? false : true}
                        >
                            {this.state.publish ? "Unpublish" : "Publish"}
                        </button>
                    </div>
                </div>

                {/* Header configuration */}
                <div className="row justify-content-center mb-3">
                    <div className="col-md-3">
                        <div className="form-group">
                            <label htmlFor="date">Exam Date:</label>
                            <input
                                type="date"
                                name="exam_date"
                                id="exam_date"
                                className="form-control form-shadow"
                                value={dateFormat(
                                    this.state.exam_date,
                                    "yyyy-mm-dd"
                                )}
                                min={this.state.valid_from}
                                max={this.state.valid_to}
                                onChange={this.handleDate}
                            />
                        </div>
                    </div>
                    <div className="col-md-3">
                        <div className="form-group">
                            <label htmlFor="starts_at">Starts at:</label>
                            <input
                                type="time"
                                name="starts_at"
                                id="starts_at"
                                className="form-control form-shadow"
                                value={this.state.starts_at}
                                onChange={this.handleTime}
                            />
                        </div>
                    </div>
                    <div className="col-md-3">
                        <div className="form-group">
                            <label htmlFor="ends_at">Ends at:</label>
                            <input
                                type="time"
                                name="ends_at"
                                id="ends_at"
                                className="form-control form-shadow"
                                value={this.state.ends_at}
                                onChange={this.handleTime}
                            />
                        </div>
                    </div>
                </div>

                <div className="card light-bg shadow-sm">
                    <div className="card-body">
                        <div className="row justify-content-center">
                            <div className="col-md-4">
                                <div className="custom-file">
                                    <input
                                        type="file"
                                        className="custom-file-input"
                                        id="question"
                                        accept=".pdf"
                                        aria-describedby="inputGroupFileAddon01"
                                        onChange={(event) =>
                                            this.handleFile(event)
                                        }
                                    />
                                    <label
                                        className="custom-file-label mb-0"
                                        htmlFor="question"
                                    >
                                        {this.state.pdf.file_name === null
                                            ? "Choose file"
                                            : this.state.pdf.file_name}
                                    </label>
                                </div>
                                <small
                                    id="passwordHelpBlock"
                                    className="form-text text-muted mb-2"
                                >
                                    Select only pdf format & Max file upload
                                    size is 5MB
                                </small>

                                <button
                                    className="btn btn-primary btn-block btn-sm shadow-none"
                                    onClick={this.handleSubmit}
                                    disabled={this.state.btnDisabled}
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
                                    Save
                                </button>
                            </div>
                        </div>
                    </div>
                    <div className="card-body secondary-bg primary-text text-center">
                        {this.state.path === null ? (
                            "Your uploads will appear here"
                        ) : (
                            <Suspense fallback={<div>Loading...</div>}>
                                <DirectPDF file_url={this.state.path} />
                            </Suspense>
                        )}
                    </div>
                </div>

                {/* Loading component */}
                {this.state.page_loading ? <Loading /> : ""}
            </Wrapper>
        );
    }
}

export default connect(mapStateToProps)(TeacherSemesterDirect);
