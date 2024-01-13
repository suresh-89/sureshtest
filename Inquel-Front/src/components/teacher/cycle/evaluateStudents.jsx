import React, { Component, lazy, Suspense } from "react";
import Wrapper from "../wrapper";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import Select from "react-select";
import { baseUrl, teacherUrl } from "../../../shared/baseUrl.js";
import AlertBox from "../../common/alert";
import Loading from "../../common/loader";
import { Spinner } from "react-bootstrap";

const DirectPDF = lazy(() => import("../../common/preview/DirectPDF"));

const mapStateToProps = (state) => ({
    group_name: state.content.group_name,
    subject_name: state.content.subject_name,
    chapter_name: state.content.chapter_name,
    cycle_name: state.content.cycle_name,
});

class TeacherCycleDirectEvaluation extends Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedStudent: {},
            student_list: [],
            student_marks_evaluated: false,

            answerData: {},
            topics: [],
            topic_marks: {},

            total_obtained_marks: "",
            total_marks: "",

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
        this.cycle_testId = this.props.match.params.cycle_testId;
        this.url = baseUrl + teacherUrl;
        this.authToken = localStorage.getItem("Authorization");
        this.headers = {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: this.authToken,
        };
    }

    componentDidMount = () => {
        this.loadStudentList();
    };

    loadStudentList = () => {
        fetch(
            `${this.url}/teacher/subject/${this.subjectId}/cycle/${this.cycle_testId}/direct/filter/`,
            {
                headers: this.headers,
                method: "GET",
            }
        )
            .then((res) => res.json())
            .then((result) => {
                if (result.sts === true) {
                    let student_marks_evaluated = true;

                    // Check if there is any student whose marks is not yet evaluated
                    if (result.data.student_data) {
                        student_marks_evaluated = result.data.student_data.some(
                            (student) => student.evaluated === false
                        );
                    }

                    this.setState({
                        student_list: result.data.student_data || [],
                        student_marks_evaluated: student_marks_evaluated
                            ? false
                            : true,
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

    handleSelect = (event) => {
        this.setState({
            selectedStudent: event.value,
            page_loading: true,
            answerData: {},
            topics: [],
            topic_marks: {},
            total_obtained_marks: "",
            total_marks: "",
        });

        fetch(
            `${this.url}/teacher/subject/${this.subjectId}/cycle/${this.cycle_testId}/direct/?username=${event.value.username}`,
            {
                method: "GET",
                headers: this.headers,
            }
        )
            .then((res) => res.json())
            .then((result) => {
                if (result.sts === true) {
                    let temp = {},
                        total_obtained_marks = 0,
                        total_marks = 0;

                    try {
                        if (
                            result.data.answer_data.topic_marks &&
                            Object.keys(result.data.answer_data.topic_marks)
                                .length !== 0
                        ) {
                            // if the evaluation marks is already saved
                            Object.entries(
                                result.data.answer_data.topic_marks
                            ).forEach(([key, value]) => {
                                temp[key] = {
                                    total_marks: value.total_marks || "",
                                    obtained_marks: value.obtained_marks || "",
                                };

                                if (value.obtained_marks) {
                                    total_obtained_marks += parseFloat(
                                        value.obtained_marks
                                    );
                                }
                                if (value.total_marks) {
                                    total_marks += parseFloat(
                                        value.total_marks
                                    );
                                }
                            });
                        } else {
                            // if this is the first time teacher is evaluating, then create a empty object for each chapter
                            for (
                                let i = 0;
                                i < result.data.topics.length;
                                i++
                            ) {
                                temp[result.data.topics[i].topic_num] = {
                                    total_marks: "",
                                    obtained_marks: "",
                                };
                            }
                        }

                        this.setState({
                            answerData: result.data.answer_data,
                            topics: result.data.topics,
                            topic_marks: temp,
                            total_obtained_marks: total_obtained_marks,
                            total_marks: total_marks,
                            page_loading: false,
                        });
                    } catch (error) {
                        console.log(error);
                        this.setState({
                            errorMsg: "There is a problem in loading the data!",
                            showErrorAlert: true,
                            page_loading: false,
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

    handleObtainedMarks = (event, topic_num) => {
        let topics = this.state.topic_marks;
        let total_obtained_marks = 0;

        topics[topic_num][event.target.name] = event.target.value;

        Object.values(topics).forEach((value) => {
            if (value.obtained_marks !== "") {
                total_obtained_marks += parseFloat(value.obtained_marks);
            }
        });

        this.setState({
            topic_marks: topics,
            total_obtained_marks: total_obtained_marks,
        });
    };

    handleTotalMarks = (event, topic_num) => {
        let topics = this.state.topic_marks;
        let total_marks = 0;

        topics[topic_num][event.target.name] = event.target.value;

        Object.values(topics).forEach((value) => {
            if (value.total_marks !== "") {
                total_marks += parseFloat(value.total_marks);
            }
        });

        this.setState({
            topic_marks: topics,
            total_marks: total_marks,
        });
    };

    handleEvaluate = () => {
        this.setState({
            showErrorAlert: false,
            showSuccessAlert: false,
            showLoader: true,
        });
        let topics = this.state.topic_marks;

        Object.entries(topics).forEach(([key, value]) => {
            if (value.total_marks === "" || value.obtained_marks === "") {
                topics[key] = {};
            }
        });

        if (this.state.selectedStudent.published === false) {
            fetch(
                `${this.url}/teacher/subject/${this.subjectId}/cycle/${this.cycle_testId}/direct/`,
                {
                    method: "POST",
                    headers: this.headers,
                    body: JSON.stringify({
                        chapter_id: this.chapterId,
                        student_username: this.state.selectedStudent.username,
                        answer_file_url: this.state.answerData.answer_file_url,
                        topic_marks: topics,
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
                        this.loadStudentList();
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
        } else {
            this.setState({
                errorMsg: "You cannot evaluate a student marks once published",
                showErrorAlert: true,
                showLoader: false,
            });
        }
    };

    handlePublish = () => {
        if (this.state.student_list) {
            this.setState({
                showErrorAlert: false,
                showSuccessAlert: false,
                page_loading: true,
            });

            for (let i = 0; i < this.state.student_list.length; i++) {
                fetch(
                    `${this.url}/teacher/subject/${this.subjectId}/cycle/${this.cycle_testId}/direct/publish/`,
                    {
                        method: "POST",
                        headers: this.headers,
                        body: JSON.stringify({
                            chapter_id: this.chapterId,
                            student_username: this.state.student_list[i].username,
                        }),
                    }
                )
                    .then((res) => res.json())
                    .then((result) => {
                        if (result.sts === true) {
                            this.setState({
                                successMsg: result.msg,
                                showSuccessAlert: true,
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
            }

            this.loadStudentList();
            this.setState({
                page_loading: false,
            });
        }
    };

    render() {
        document.title = `${this.props.cycle_name} : Direct test evaluation - Teacher | IQLabs`;
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

                <div className="row align-items-center mb-4">
                    <div className="col-md-9">
                        {/* ----- Breadcrumb ----- */}
                        <nav aria-label="breadcrumb">
                            <ol className="breadcrumb">
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
                                        to={`/teacher/group/${this.groupId}/subject/${this.subjectId}`}
                                    >
                                        {this.props.subject_name}
                                    </Link>
                                </li>
                                <li className="breadcrumb-item">
                                    <Link
                                        to={`/teacher/group/${this.groupId}/subject/${this.subjectId}/chapter/${this.chapterId}`}
                                    >
                                        {this.props.chapter_name}
                                    </Link>
                                </li>
                                <li className="breadcrumb-item">
                                    <Link
                                        to="#"
                                        onClick={this.props.history.goBack}
                                    >
                                        {this.props.cycle_name}
                                    </Link>
                                </li>
                                <li className="breadcrumb-item active">
                                    Student evaluation
                                </li>
                            </ol>
                        </nav>
                    </div>
                    {this.state.student_marks_evaluated && (
                        <div className="col-md-3 text-right">
                            <button
                                className="btn btn-primary btn-sm shadow-none"
                                onClick={this.handlePublish}
                            >
                                Publish
                            </button>
                        </div>
                    )}
                </div>

                {/* ----- Header configuration ----- */}

                <div className="card shadow-sm mb-3">
                    <div className="card-body">
                        <div className="row align-items-center">
                            <div className="col-md-8">
                                <div className="row">
                                    {this.groupId !== undefined ? (
                                        <div className="col-md-4">
                                            <p className="font-weight-bold-600 primary-text mb-2">
                                                Group:
                                            </p>
                                            <p className="small font-weight-bold-600 mb-0">
                                                {this.props.group_name}
                                            </p>
                                        </div>
                                    ) : (
                                        ""
                                    )}
                                    <div className="col-md-4">
                                        <p className="font-weight-bold-600 primary-text mb-2">
                                            Subject:
                                        </p>
                                        <p className="small font-weight-bold-600 mb-0">
                                            {this.props.subject_name}
                                        </p>
                                    </div>
                                    <div className="col-md-4">
                                        <p className="font-weight-bold-600 primary-text mb-2">
                                            Chapter:
                                        </p>
                                        <p className="small font-weight-bold-600 mb-0">
                                            {this.props.chapter_name}
                                        </p>
                                    </div>
                                </div>
                            </div>
                            <div className="col-md-4">
                                <p className="primary-text mb-2">
                                    Select student
                                </p>
                                <Select
                                    className="basic-single form-shadow"
                                    isSearchable={true}
                                    name="student"
                                    options={this.state.student_list.map(
                                        (list) => {
                                            return {
                                                value: list,
                                                label: list.username,
                                            };
                                        }
                                    )}
                                    onChange={this.handleSelect}
                                    required
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* ----- Main content ----- */}

                <div className="card card-body light-bg shadow-sm">
                    {/* ----- Table ----- */}
                    {this.state.topics &&
                    Object.entries(this.state.topics).length !== 0 ? (
                        <div className="row justify-content-center mb-4">
                            <div className="col-md-9">
                                <div className="card secondary-bg mb-3">
                                    <div className="table-responsive">
                                        <table className="table ">
                                            <thead>
                                                <tr>
                                                    <th scope="col">Sl.no</th>
                                                    <th scope="col">Topics</th>
                                                    <th scope="col">
                                                        Obtained Marks
                                                    </th>
                                                    <th scope="col">
                                                        Total Marks
                                                    </th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {this.state.topics.map(
                                                    (topic, index) => {
                                                        return (
                                                            <tr key={index}>
                                                                <td>
                                                                    {index + 1}
                                                                </td>
                                                                <td>
                                                                    {
                                                                        topic.topic_name
                                                                    }
                                                                </td>
                                                                <td>
                                                                    <input
                                                                        type="text"
                                                                        name="obtained_marks"
                                                                        id={`obtained_marks${index}`}
                                                                        className="form-control form-control-sm border-secondary"
                                                                        value={
                                                                            this
                                                                                .state
                                                                                .topic_marks[
                                                                                topic
                                                                                    .topic_num
                                                                            ]
                                                                                .obtained_marks ||
                                                                            ""
                                                                        }
                                                                        onChange={(
                                                                            event
                                                                        ) => {
                                                                            this.handleObtainedMarks(
                                                                                event,
                                                                                topic.topic_num
                                                                            );
                                                                        }}
                                                                        autoComplete="off"
                                                                    />
                                                                </td>
                                                                <td>
                                                                    <input
                                                                        type="text"
                                                                        name="total_marks"
                                                                        id={`total_marks${index}`}
                                                                        className="form-control form-control-sm border-secondary"
                                                                        value={
                                                                            this
                                                                                .state
                                                                                .topic_marks[
                                                                                topic
                                                                                    .topic_num
                                                                            ]
                                                                                .total_marks ||
                                                                            ""
                                                                        }
                                                                        onChange={(
                                                                            event
                                                                        ) => {
                                                                            this.handleTotalMarks(
                                                                                event,
                                                                                topic.topic_num
                                                                            );
                                                                        }}
                                                                        autoComplete="off"
                                                                    />
                                                                </td>
                                                            </tr>
                                                        );
                                                    }
                                                )}
                                                <tr>
                                                    <td></td>
                                                    <td>Total</td>
                                                    <td>
                                                        {
                                                            this.state
                                                                .total_obtained_marks
                                                        }
                                                    </td>
                                                    <td>
                                                        {this.state.total_marks}
                                                    </td>
                                                    <td></td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                                <div className="row justify-content-center">
                                    <div className="col-md-4">
                                        <button
                                            className="btn btn-primary btn-sm btn-block shadow-none"
                                            disabled={
                                                this.state.topics.length === 0
                                                    ? true
                                                    : false
                                            }
                                            onClick={this.handleEvaluate}
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
                                            Evaluate
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ) : (
                        ""
                    )}

                    {/* ----- Document preview ----- */}

                    <div className="card card-body secondary-bg text-center">
                        {Object.entries(this.state.answerData).length === 0 ? (
                            "Student uploads will appear here"
                        ) : (
                            <Suspense fallback={<div>Loading...</div>}>
                                <DirectPDF
                                    file_url={
                                        this.state.answerData.answer_file_url
                                    }
                                />
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

export default connect(mapStateToProps)(TeacherCycleDirectEvaluation);
