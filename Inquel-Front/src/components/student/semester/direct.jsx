import React, { Component, lazy, Suspense } from "react";
import { connect } from "react-redux";
import axios from "axios";
import Header from "../shared/examNavbar";
import { Spinner } from "react-bootstrap";
import { baseUrl, studentUrl } from "../../../shared/baseUrl.js";
import AlertBox from "../../common/alert";
import Loading from "../../common/loader";
import dateFormat from "dateformat";
import { ErrorBoundary } from "react-error-boundary";
import ErrorFallback from "../../common/ErrorFallback";

const DirectPDF = lazy(() => import("../../common/preview/DirectPDF"));

const mapStateToProps = (state) => ({
    subject_name: state.content.subject_name,
    semester_name: state.content.semester_name,
});

class SemesterDirectExam extends Component {
    constructor(props) {
        super(props);
        this.state = {
            semesterExamItem: [],
            url: null,
            question_url: null,
            pdf: {
                file_name: null,
                file: null,
            },
            isFileUploaded: false,
            btnDisabled: true,
            isExamStarted: true,

            errorMsg: "",
            successMsg: "",
            showErrorAlert: false,
            showSuccessAlert: false,
            showLoader: false,
            page_loading: true,
        };
        this.subjectId = this.props.match.params.subjectId;
        this.semesterId = this.props.match.params.semesterId;
        this.url = baseUrl + studentUrl;
        this.authToken = localStorage.getItem("Authorization");
        this.headers = {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: this.authToken,
        };
    }

    componentDidMount = () => {
        document.title = `${this.props.semester_name} : Direct - Student | IQLabs`;

        this.loadExamData();
    };

    loadExamData = () => {
        fetch(
            `${this.url}/student/subject/${this.subjectId}/semester/${this.semesterId}/direct/`,
            {
                method: "GET",
                headers: this.headers,
            }
        )
            .then((res) => res.json())
            .then((result) => {
                if (result.sts === true) {
                    this.setState({
                        semesterExamItem: result.data,
                        url:
                            result.data.answer_file_url !== ""
                                ? result.data.answer_file_url
                                : null,
                        question_url:
                            result.data.direct_question_urls !== undefined
                                ? result.data.direct_question_urls[0]
                                : null,
                        page_loading: false,
                        isExamStarted: true,
                    });
                    var currentDate = new Date();
                    var examDate = new Date(result.data.starts_at);
                    if (currentDate.getTime() < examDate.getTime()) {
                        this.setState({
                            isExamStarted: false,
                            errorMsg: "Exam hasn't started yet...",
                            showErrorAlert: true,
                        });
                    }
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
                url: URL.createObjectURL(event.target.files[0]),
                btnDisabled: false,
            });
        }
    };

    handleSubmit = (event) => {
        event.preventDefault();

        this.setState({
            showLoader: true,
            showSuccessAlert: false,
            showErrorAlert: false,
        });

        const pdf = this.state.pdf;
        let extension = "";
        let form_data = new FormData();

        if (pdf.file !== null) {
            form_data.append("semester_exam_file_1", pdf.file);
        }

        const options = {
            headers: {
                Accept: "application/json",
                "Content-Type": "multipart/form-data",
                Authorization: this.authToken,
            },
        };

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
            if (this.state.semesterExamItem.answer_file_url !== "") {
                this.handlePATCH(form_data, options);
            } else {
                this.handlePOST(form_data, options);
            }
        }
    };

    handlePOST = (form_data, options) => {
        axios
            .post(
                `${this.url}/student/subject/${this.subjectId}/semester/${this.semesterId}/direct/`,
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
                            url: result.data.url,
                        },
                        () => {
                            this.setState({
                                page_loading: true,
                            });
                            this.loadExamData();
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
    };

    handlePATCH = (form_data, options) => {
        axios
            .patch(
                `${this.url}/student/subject/${this.subjectId}/semester/${this.semesterId}/direct/`,
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
                            url: result.data.url,
                        },
                        () => {
                            this.setState({
                                page_loading: true,
                            });
                            this.loadExamData();
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
    };

    render() {
        return (
            <>
                {/* Navbar */}
                <Header
                    name={this.props.subject_name}
                    chapter_name={this.props.semester_name}
                    goBack={this.props.history.goBack}
                />

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

                <div className="exam-section">
                    <div className="container-fluid">
                        <ErrorBoundary
                            FallbackComponent={ErrorFallback}
                            onReset={() => window.location.reload()}
                        >
                            {/* Header configuration */}
                            <div className="row align-items-center justify-content-center mb-3">
                                <div className="col-md-2 text-center">
                                    <div className="form-group">
                                        <p className="mb-2 font-weight-bold-600">
                                            Date:
                                        </p>
                                        <p className="small mb-0">
                                            {dateFormat(
                                                this.state.semesterExamItem
                                                    .exam_date,
                                                "dd/mm/yyyy"
                                            )}
                                        </p>
                                    </div>
                                </div>
                                <div className="col-md-2 text-center">
                                    <div className="form-group">
                                        <p className="mb-2 font-weight-bold-600">
                                            Starts at:
                                        </p>
                                        <p className="small mb-0">
                                            {dateFormat(
                                                this.state.semesterExamItem
                                                    .starts_at,
                                                "hh:MM TT"
                                            )}
                                        </p>
                                    </div>
                                </div>
                                <div className="col-md-2 text-center">
                                    <div className="form-group">
                                        <p className="mb-2 font-weight-bold-600">
                                            Ends at:
                                        </p>
                                        <p className="small mb-0">
                                            {dateFormat(
                                                this.state.semesterExamItem
                                                    .ends_at,
                                                "hh:MM TT"
                                            )}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="card light-bg shadow-sm">
                                {/* ----- File uploading ----- */}
                                <div className="card-body">
                                    {this.state.isExamStarted ? (
                                        <div className="row justify-content-center mb-4">
                                            <div className="col-md-5">
                                                <div className="custom-file">
                                                    <input
                                                        type="file"
                                                        className="custom-file-input"
                                                        id="question"
                                                        accept=".pdf"
                                                        aria-describedby="inputGroupFileAddon01"
                                                        onChange={(event) =>
                                                            this.handleFile(
                                                                event
                                                            )
                                                        }
                                                    />
                                                    <label
                                                        className="custom-file-label mb-0"
                                                        htmlFor="question"
                                                    >
                                                        {this.state.pdf
                                                            .file_name === null
                                                            ? "Choose file"
                                                            : this.state.pdf
                                                                  .file_name}
                                                    </label>
                                                </div>
                                                <small
                                                    id="passwordHelpBlock"
                                                    className="form-text text-muted mb-2"
                                                >
                                                    Select only pdf format & Max
                                                    file upload size is 5MB
                                                </small>

                                                <div className="row">
                                                    <div className="col-6">
                                                        <a
                                                            href={
                                                                this.state
                                                                    .question_url
                                                            }
                                                            className="btn btn-primary btn-block btn-sm shadow-none"
                                                            disabled={
                                                                this.state
                                                                    .question_url ===
                                                                null
                                                                    ? true
                                                                    : false
                                                            }
                                                            download
                                                        >
                                                            Download Question
                                                        </a>
                                                    </div>
                                                    <div className="col-6">
                                                        <button
                                                            className="btn btn-primary btn-block btn-sm shadow-none"
                                                            onClick={
                                                                this
                                                                    .handleSubmit
                                                            }
                                                            disabled={
                                                                this.state
                                                                    .btnDisabled
                                                            }
                                                        >
                                                            {this.state
                                                                .showLoader ? (
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
                                                            Upload Answer
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ) : (
                                        ""
                                    )}

                                    {/* File displaying */}
                                    <div
                                        className="card card-body secondary-bg text-center"
                                        style={{ minHeight: "40vh" }}
                                    >
                                        {this.state.url === null ? (
                                            "Your uploads will appear here"
                                        ) : (
                                            <Suspense
                                                fallback={<div>Loading...</div>}
                                            >
                                                <DirectPDF
                                                    file_url={this.state.url}
                                                />
                                            </Suspense>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </ErrorBoundary>
                    </div>
                </div>

                {/* Loading component */}
                {this.state.page_loading ? <Loading /> : ""}
            </>
        );
    }
}

export default connect(mapStateToProps)(SemesterDirectExam);
