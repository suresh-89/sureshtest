import React, { Component, lazy, Suspense } from "react";
import Wrapper from "../wrapper";
import { connect } from "react-redux";
import axios from "axios";
import Switch from "react-switch";
import { Link } from "react-router-dom";
import { Spinner } from "react-bootstrap";
import { baseUrl, teacherUrl } from "../../../shared/baseUrl.js";
import Loading from "../../common/loader";
import AlertBox from "../../common/alert";
import { SingleContentDeleteModal } from "../../common/modal/contentManagementModal";

const DirectPDF = lazy(() => import("../../common/preview/DirectPDF"));

const mapStateToProps = (state) => ({
    group_name: state.content.group_name,
    subject_name: state.content.subject_name,
    chapter_name: state.content.chapter_name,
});

class TeacherSummaryUpload extends Component {
    constructor(props) {
        super(props);
        this.state = {
            showModal: false,
            summary_id: "",
            summary_name: "",

            pdf: {
                file_name: null,
                file: null,
            },
            path: null,
            limited: false,
            btnDisabled: true,

            errorMsg: "",
            successMsg: "",
            showErrorAlert: false,
            showSuccessAlert: false,
            showLoader: false,
            page_loading: true,
        };
        this.groupId = this.props.match.params.groupId;
        this.subjectId = this.props.match.params.subjectId;
        this.chapterId = this.props.match.params.chapterId;
        this.url = baseUrl + teacherUrl;
        this.authToken = localStorage.getItem("Authorization");
        this.headers = {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: this.authToken,
        };
    }

    componentDidMount = () => {
        document.title = `${this.props.chapter_name} Summary - Teacher | IQLabs`;

        this.loadSummaryData();
    };

    loadSummaryData = () => {
        this.setState({
            summary_id: "",
            limited: false,
            path: null,
            summary_name: "",
        });

        fetch(
            `${this.url}/teacher/subject/${this.subjectId}/summary/?chapter_id=${this.chapterId}`,
            {
                method: "GET",
                headers: this.headers,
            }
        )
            .then((res) => res.json())
            .then((result) => {
                if (result.sts === true) {
                    if (result.data && Object.keys(result.data).length !== 0) {
                        this.setState({
                            summary_id: result.data[0].summary_id,
                            summary_name: result.data[0].summary_name,
                            limited:
                                result.data[0].summary_name === undefined
                                    ? result.data[0].limited
                                    : false,
                            path:
                                result.data[0].direct_question_urls.length !== 0
                                    ? result.data[0].direct_question_urls[0]
                                    : null,
                        });
                    }
                } else {
                    this.setState({
                        errorMsg: result.msg,
                        showErrorAlert: true,
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

    toggleModal = () => {
        this.setState({
            showModal: !this.state.showModal,
        });
    };

    handleSwitch = () => {
        this.setState({
            limited: !this.state.limited,
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
            });
        } else if (event.target.files[0].size > 5242880) {
            this.setState({
                errorMsg: "File size exceeds more then 5MB!",
                showErrorAlert: true,
            });
        } else {
            this.setState({
                pdf: pdf,
                path: URL.createObjectURL(event.target.files[0]),
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

        let files = this.state.pdf;
        let extension = "";
        let form_data = new FormData();

        form_data.append("chapter_id", this.chapterId);
        form_data.append("summary_file_1", files.file);
        form_data.append("limited", this.state.limited);

        const options = {
            headers: {
                Accept: "application/json",
                "Content-Type": "multipart/form-data",
                Authorization: this.authToken,
            },
        };

        if (files.file !== null) {
            extension = files.file_name.split(".");
        }

        if (files.file === null) {
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
        } else if (files.file.size > 5000000) {
            this.setState({
                errorMsg: "File size exceeds more then 5MB!",
                showErrorAlert: true,
            });
        } else {
            axios
                .post(
                    `${this.url}/teacher/subject/${this.subjectId}/summary/files/pdf/`,
                    form_data,
                    options
                )
                .then((result) => {
                    if (result.data.sts === true) {
                        files.file = null;
                        files.file_name = null;
                        this.setState({
                            successMsg: result.data.msg,
                            showSuccessAlert: true,
                            showLoader: false,
                            path: result.data.url,
                            pdf: files,
                            btnDisabled: true,
                            summary_id: result.data.summary_id,
                        });
                        this.loadSummaryData();
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
                    this.setState({
                        errorMsg: "Something went wrong",
                        showErrorAlert: true,
                        showLoader: false,
                    });
                });
        }
    };

    formSubmission = () => {
        setTimeout(() => {
            this.setState({
                showModal: false,
            });
            this.loadSummaryData();
        }, 1000);
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

                {/* Delete Modal */}
                {this.state.showModal ? (
                    <SingleContentDeleteModal
                        show={this.state.showModal}
                        onHide={this.toggleModal}
                        formSubmission={this.formSubmission}
                        url={`${this.url}/teacher/subject/${this.subjectId}/summary/`}
                        type="summary"
                        name=""
                        data={{ summary_id: this.state.summary_id }}
                    />
                ) : null}

                {/* ----- Breadcrumb ----- */}
                <nav aria-label="breadcrumb">
                    <ol className="breadcrumb mb-3">
                        <li className="breadcrumb-item">
                            <Link to="/teacher">
                                <i className="fas fa-home fa-sm"></i>
                            </Link>
                        </li>
                        {this.groupId !== undefined ? (
                            <li className="breadcrumb-item">
                                <Link to={`/teacher/group/${this.groupId}`}>
                                    {this.props.group_name}
                                </Link>
                            </li>
                        ) : (
                            ""
                        )}
                        <li className="breadcrumb-item">
                            <Link to="#" onClick={this.props.history.goBack}>
                                {this.props.subject_name}
                            </Link>
                        </li>
                        <li className="breadcrumb-item active">
                            Summary upload
                        </li>
                    </ol>
                </nav>

                <div className="card secondary-bg mb-3">
                    <div className="card-body p-3">
                        <div className="row align-items-center">
                            <div className="col-md-6">
                                <p className="small mb-0">
                                    <span className="font-weight-bold">
                                        Summary:
                                    </span>{" "}
                                    {this.props.chapter_name}
                                </p>
                            </div>
                            <div className="col-md-6 d-flex align-items-center justify-content-end">
                                {this.state.summary_id !== "" &&
                                this.state.summary_name === undefined ? (
                                    <button
                                        className="btn btn-primary btn-sm shadow-none"
                                        onClick={this.toggleModal}
                                    >
                                        Delete
                                    </button>
                                ) : null}

                                {!this.groupId ? (
                                    <div className="d-flex justify-content-end ml-2">
                                        <span className="mr-2 small primary-text font-weight-bold">
                                            Limited
                                        </span>
                                        <Switch
                                            checked={this.state.limited}
                                            onChange={this.handleSwitch}
                                            onColor="#621012"
                                            onHandleColor="#efd2ac"
                                            handleDiameter={12}
                                            uncheckedIcon={false}
                                            checkedIcon={false}
                                            boxShadow="0px 1px 5px rgba(0, 0, 0, 0.6)"
                                            activeBoxShadow="0px 0px 1px 10px rgba(0, 0, 0, 0.2)"
                                            height={18}
                                            width={35}
                                            className="react-switch"
                                            id="select-all"
                                        />
                                    </div>
                                ) : (
                                    ""
                                )}
                            </div>
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
                                    Select only pdf format & Max file size is
                                    5MB
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
                                    Upload
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

export default connect(mapStateToProps)(TeacherSummaryUpload);
