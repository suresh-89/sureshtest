import React, { Component } from "react";
import Header from "../shared/examNavbar";
import { Link } from "react-router-dom";
import { baseUrl, studentUrl } from "../../../shared/baseUrl.js";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import AlertBox from "../../common/alert";
import Loading from "../../common/loader";
import { connect } from "react-redux";
import storeDispatch from "../../../redux/dispatch";
import { SIMULATION, TEMP } from "../../../redux/action";
import { ErrorBoundary } from "react-error-boundary";
import ErrorFallback from "../../common/ErrorFallback";

const mapStateToProps = (state) => ({
    subject_name: state.content.subject_name,
    course_name: state.content.course_name,
});

function remarksCondition(data) {
    let remarks = "";

    // check if the attempt sequence is evaluated or not
    if (data.evaluated === true) {
        // check if it is a auto test
        if (data.auto_section.length !== 0) {
            // check if the exam is auto submitted by backend
            if (
                data.auto_section[0].sections &&
                data.auto_section[0].sections.length !== 0
            ) {
                // if the test is submitted by manual, then display the actual remarks
                remarks = data.auto_section[0].remarks;
            } else {
                // if it is submitted by backend then display this remarks
                remarks = "Exam not submitted";
            }
            // else check if it is a direct test
        } else if (Object.entries(data.direct_question).length !== 0) {
            remarks = data.direct_question.remarks
                ? data.direct_question.remarks
                : "Not yet evaluated";
        }
    } else {
        remarks = "Not yet evaluated";
    }

    return remarks;
}

function colorCondition(data) {
    let color = "";

    if (data.auto_section.length !== 0) {
        color = data.auto_section[0].color;
    } else if (Object.entries(data.direct_question).length !== 0) {
        color = data.direct_question.color
            ? data.direct_question.color
            : "grey";
    }

    return color;
}

function CycleTestAttempts(props) {
    return (
        <OverlayTrigger
            placement="top"
            overlay={
                <Tooltip
                    id="tooltip4"
                    style={{
                        textTransform: "capitalize",
                    }}
                >
                    {remarksCondition(props.attempt)}
                </Tooltip>
            }
        >
            {
                // check if the exam is evaluated
                props.attempt.evaluated === true ? (
                    // check if the attempt is a auto test
                    props.attempt.auto_section &&
                    props.attempt.auto_section.length !== 0 ? (
                        // check if the attempt sequence is submitted automatically by backend
                        props.attempt.auto_section[0].sections &&
                        props.attempt.auto_section[0].sections.length !== 0 ? (
                            // if the attempt sequence is evaluated and submitted by student
                            <Link
                                to={`${props.match.url}/cycle/${props.attempt.cycle_test_id}`}
                                onClick={() => {
                                    storeDispatch(TEMP, {
                                        auto: true,
                                        direct: false,
                                        cycle_test_name:
                                            props.data.cycle_test_name,
                                        data: props.attempt.auto_section,
                                        submit_time:
                                            props.attempt.actual_submit_time,
                                        attempt: props.attempt_index,
                                    });
                                }}
                            >
                                <i
                                    className="fas fa-book-open fa-lg mx-3"
                                    style={{
                                        color: colorCondition(props.attempt),
                                        fontSize: "22px",
                                    }}
                                ></i>
                            </Link>
                        ) : (
                            // if the attempt is submitted by backend
                            <i
                                className="fas fa-book-open fa-lg mx-3"
                                style={{
                                    color: "grey",
                                    fontSize: "22px",
                                }}
                            ></i>
                        )
                    ) : Object.entries(props.attempt.direct_question).length !==
                      0 ? (
                        //  if the attempt sequence is a direct test
                        <Link
                            to={`${props.match.url}/cycle/${props.attempt.cycle_test_id}`}
                            onClick={() => {
                                storeDispatch(TEMP, {
                                    auto: false,
                                    direct: true,
                                    cycle_test_name: props.data.cycle_test_name,
                                    data: props.attempt.direct_question,
                                });
                            }}
                        >
                            <i
                                className="fas fa-book-open fa-lg mx-3"
                                style={{
                                    color: colorCondition(props.attempt),
                                    fontSize: "22px",
                                }}
                            ></i>
                        </Link>
                    ) : (
                        // if the auto_section is empty
                        <i
                            className="fas fa-book-open fa-lg mx-3"
                            style={{
                                color: "grey",
                                fontSize: "22px",
                            }}
                        ></i>
                    )
                ) : (
                    // if the attempt sequence is not evaluated
                    <i
                        className="fas fa-book-open fa-lg mx-3"
                        style={{
                            color: "grey",
                            fontSize: "22px",
                        }}
                    ></i>
                )
            }
        </OverlayTrigger>
    );
}

function SemesterAttempts(props) {
    return (
        <OverlayTrigger
            placement="top"
            overlay={
                <Tooltip
                    id="tooltip4"
                    style={{
                        textTransform: "capitalize",
                    }}
                >
                    {remarksCondition(props.attempt)}
                </Tooltip>
            }
        >
            {
                // check if the exam is evaluated
                props.attempt.evaluated === true ? (
                    // check if the attempt is a auto test
                    props.attempt.auto_section &&
                    props.attempt.auto_section.length !== 0 ? (
                        // check if the attempt sequence in submitted automatically by backend
                        props.attempt.auto_section[0].sections &&
                        props.attempt.auto_section[0].sections.length !== 0 ? (
                            // if the attempt sequence is evaluated and submitted by student
                            <Link
                                to={`${props.match.url}/semester/${props.attempt.semester_id}`}
                                onClick={() => {
                                    storeDispatch(TEMP, {
                                        auto: true,
                                        direct: false,
                                        semester_name: props.data.semester_name,
                                        data: props.attempt.auto_section,
                                        submit_time:
                                            props.attempt.actual_submit_time,
                                        attempt: props.attempt_index,
                                    });
                                }}
                            >
                                <i
                                    className="fas fa-book-open fa-lg mx-3"
                                    style={{
                                        color: colorCondition(props.attempt),
                                        fontSize: "22px",
                                    }}
                                ></i>
                            </Link>
                        ) : (
                            // if the attempt is submitted by backend
                            <i
                                className="fas fa-book-open fa-lg mx-3"
                                style={{
                                    color: "grey",
                                    fontSize: "22px",
                                }}
                            ></i>
                        )
                    ) : Object.entries(props.attempt.direct_question).length !==
                      0 ? (
                        //  if the attempt sequence is a direct test
                        <Link
                            to={`${props.match.url}/semester/${props.attempt.semester_id}`}
                            onClick={() => {
                                storeDispatch(TEMP, {
                                    auto: false,
                                    direct: true,
                                    semester_name: props.data.semester_name,
                                    data: props.attempt.direct_question,
                                });
                            }}
                        >
                            <i
                                className="fas fa-book-open fa-lg mx-3"
                                style={{
                                    color: colorCondition(props.attempt),
                                    fontSize: "22px",
                                }}
                            ></i>
                        </Link>
                    ) : (
                        // if the auto_section is empty
                        <i
                            className="fas fa-book-open fa-lg mx-3"
                            style={{
                                color: "grey",
                                fontSize: "22px",
                            }}
                        ></i>
                    )
                ) : (
                    // if the attempt sequence is not evaluated
                    <i
                        className="fas fa-book-open fa-lg mx-3"
                        style={{
                            color: "grey",
                            fontSize: "22px",
                        }}
                    ></i>
                )
            }
        </OverlayTrigger>
    );
}

function SimulationPapers(props) {
    return (
        <OverlayTrigger
            placement="top"
            overlay={
                <Tooltip
                    id="tooltip4"
                    style={{
                        textTransform: "capitalize",
                    }}
                >
                    {remarksCondition(props.attempt)}
                </Tooltip>
            }
        >
            {
                // check if the exam is evaluated
                props.attempt.evaluated === true ? (
                    // check if the auto_section is empty or not
                    props.attempt.auto_section &&
                    props.attempt.auto_section.length !== 0 ? (
                        // check if the attempt sequence in submitted automatically by backend
                        props.attempt.auto_section[0].sections &&
                        props.attempt.auto_section[0].sections.length !== 0 ? (
                            // if the attempt sequence is evaluated and submitted by student
                            <Link
                                to={`${props.match.url}/simulation/${props.attempt.simulation_id}`}
                                onClick={() => {
                                    storeDispatch(TEMP, {
                                        auto: true,
                                        direct: false,
                                        simulation_name:
                                            props.data.simulation_name,
                                        data: props.attempt.auto_section,
                                        submit_time:
                                            props.attempt.actual_submit_time,
                                    });
                                }}
                            >
                                <i
                                    className="fas fa-book-open fa-lg mx-3"
                                    style={{
                                        color: colorCondition(props.attempt),
                                        fontSize: "22px",
                                    }}
                                ></i>
                            </Link>
                        ) : (
                            // if the attempt is submitted by backend
                            <i
                                className="fas fa-book-open fa-lg mx-3"
                                style={{
                                    color: "grey",
                                    fontSize: "22px",
                                }}
                            ></i>
                        )
                    ) : (
                        // if the auto_section is empty
                        <i
                            className="fas fa-book-open fa-lg mx-3"
                            style={{
                                color: "grey",
                                fontSize: "22px",
                            }}
                        ></i>
                    )
                ) : (
                    // if the attempt sequence is not evaluated
                    <i
                        className="fas fa-book-open fa-lg mx-3"
                        style={{
                            color: "grey",
                            fontSize: "22px",
                        }}
                    ></i>
                )
            }
        </OverlayTrigger>
    );
}

class TestResult extends Component {
    constructor(props) {
        super(props);
        this.state = {
            cycle_test: [],
            semester: [],
            simulation: [],

            errorMsg: "",
            successMsg: "",
            showErrorAlert: false,
            showSuccessAlert: false,
            page_loading: true,
        };
        this.subscriptionId = this.props.match.params.subscriptionId;
        this.courseId = this.props.match.params.courseId;
        this.subjectId = this.props.match.params.subjectId;
        this.url = baseUrl + studentUrl;
        this.authToken = localStorage.getItem("Authorization");
        this.headers = {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: this.authToken,
        };
    }

    componentDidMount = () => {
        document.title = `${
            this.courseId ? this.props.course_name : this.props.subject_name
        } : Test analysis - Student | IQLabs`;

        this.loadTestResultData();
    };

    loadTestResultData = () => {
        fetch(
            this.courseId
                ? `${this.url}/student/sub/${this.subscriptionId}/course/${this.courseId}/testanalysis/`
                : `${this.url}/student/subject/${this.subjectId}/testanalysis/`,
            {
                method: "GET",
                headers: this.headers,
            }
        )
            .then((res) => res.json())
            .then((result) => {
                if (result.sts === true) {
                    this.setState({
                        cycle_test: result.data.cycle_tests,
                        semester: result.data.semesters,
                        simulation: result.data.simulation_exams,
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

    render() {
        return (
            <>
                {/* Navbar */}
                <Header
                    name={
                        this.courseId
                            ? this.props.course_name
                            : this.props.subject_name
                    }
                    chapter_name=""
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
                    <div className="container overflow-auto">
                        <ErrorBoundary
                            FallbackComponent={ErrorFallback}
                            onReset={() => window.location.reload()}
                        >
                            <div style={{ minWidth: "1100px" }}>
                                <div className="row justify-content-center">
                                    <div className="col-md-11">
                                        <div className="row align-items-center font-weight-bold-600 primary-text mb-3">
                                            <div className="col-3">
                                                TEST ANALYSIS
                                            </div>
                                            <div className="col-7">
                                                ATTEMPTS & PAPERS
                                            </div>
                                        </div>

                                        {/* ----- Cycle test list ----- */}
                                        {(this.state.cycle_test || []).map(
                                            (data, index) => {
                                                return (
                                                    <div
                                                        className="card light-bg shadow-sm mb-2"
                                                        key={index}
                                                    >
                                                        <div className="row align-items-center font-weight-bold-600 small">
                                                            <div className="col-3">
                                                                <div className="card card-body secondary-bg p-3">
                                                                    {
                                                                        data.cycle_test_name
                                                                    }
                                                                </div>
                                                            </div>
                                                            {/* ----- Attempts score card ----- */}
                                                            <div className="col-9">
                                                                {(
                                                                    data.student_cycle_test ||
                                                                    []
                                                                ).map(
                                                                    (
                                                                        attempt,
                                                                        attempt_index
                                                                    ) => {
                                                                        return (
                                                                            <CycleTestAttempts
                                                                                {...this
                                                                                    .props}
                                                                                key={
                                                                                    attempt_index
                                                                                }
                                                                                attempt_index={
                                                                                    attempt_index
                                                                                }
                                                                                attempt={
                                                                                    attempt
                                                                                }
                                                                                data={
                                                                                    data
                                                                                }
                                                                            />
                                                                        );
                                                                    }
                                                                )}
                                                            </div>
                                                        </div>
                                                    </div>
                                                );
                                            }
                                        )}

                                        {/* ----- Semester list ----- */}
                                        {(this.state.semester || []).map(
                                            (data, index) => {
                                                return (
                                                    <div
                                                        className="card light-bg shadow-sm mb-2"
                                                        key={index}
                                                    >
                                                        <div className="row align-items-center font-weight-bold-600 small">
                                                            <div className="col-3">
                                                                <div className="card card-body secondary-bg p-3">
                                                                    {
                                                                        data.semester_name
                                                                    }
                                                                </div>
                                                            </div>
                                                            <div className="col-9">
                                                                {(
                                                                    data.student_semester ||
                                                                    []
                                                                ).map(
                                                                    (
                                                                        attempt,
                                                                        attempt_index
                                                                    ) => {
                                                                        return (
                                                                            <SemesterAttempts
                                                                                {...this
                                                                                    .props}
                                                                                key={
                                                                                    attempt_index
                                                                                }
                                                                                attempt_index={
                                                                                    attempt_index
                                                                                }
                                                                                attempt={
                                                                                    attempt
                                                                                }
                                                                                data={
                                                                                    data
                                                                                }
                                                                            />
                                                                        );
                                                                    }
                                                                )}
                                                            </div>
                                                        </div>
                                                    </div>
                                                );
                                            }
                                        )}

                                        {/* ----- Simulation list ----- */}
                                        {(this.state.simulation || []).map(
                                            (data, index) => {
                                                return (
                                                    <React.Fragment key={index}>
                                                        {data.student_simulation_paper &&
                                                        data
                                                            .student_simulation_paper
                                                            .length !== 0 ? (
                                                            <Link
                                                                to={`${this.props.match.url}/simulation/${data.simulation_id}/marksheet`}
                                                            >
                                                                <div className="text-right my-3">
                                                                    <button
                                                                        className="btn btn-primary btn-sm shadow-none"
                                                                        onClick={() =>
                                                                            storeDispatch(
                                                                                SIMULATION,
                                                                                data.simulation_name
                                                                            )
                                                                        }
                                                                    >
                                                                        Generate
                                                                        marksheet
                                                                    </button>
                                                                </div>
                                                            </Link>
                                                        ) : (
                                                            ""
                                                        )}

                                                        <div className="row align-items-center font-weight-bold-600 small mb-2">
                                                            <div className="col-3">
                                                                <div className="card card-body secondary-bg p-3 shadow-sm">
                                                                    {
                                                                        data.simulation_name
                                                                    }
                                                                </div>
                                                            </div>
                                                        </div>

                                                        {/* Modal paper */}
                                                        {(
                                                            data.student_simulation_paper ||
                                                            []
                                                        ).some(
                                                            (element) =>
                                                                element.paper_type ===
                                                                "Model paper"
                                                        ) ? (
                                                            <div className="card light-bg shadow-sm mb-2">
                                                                <div className="row align-items-center font-weight-bold-600 small">
                                                                    <div className="col-3">
                                                                        <div className="card card-body pinkrange-bg p-3">
                                                                            Model
                                                                            paper
                                                                        </div>
                                                                    </div>
                                                                    <div className="col-9">
                                                                        {(
                                                                            data.student_simulation_paper ||
                                                                            []
                                                                        )
                                                                            .filter(
                                                                                (
                                                                                    element
                                                                                ) =>
                                                                                    element.paper_type ===
                                                                                    "Model paper"
                                                                            )
                                                                            .map(
                                                                                (
                                                                                    attempt,
                                                                                    attempt_index
                                                                                ) => {
                                                                                    return (
                                                                                        <SimulationPapers
                                                                                            {...this
                                                                                                .props}
                                                                                            key={
                                                                                                attempt_index
                                                                                            }
                                                                                            attempt={
                                                                                                attempt
                                                                                            }
                                                                                            data={
                                                                                                data
                                                                                            }
                                                                                        />
                                                                                    );
                                                                                }
                                                                            )}
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        ) : (
                                                            ""
                                                        )}

                                                        {/* Previous paper */}
                                                        {(
                                                            data.student_simulation_paper ||
                                                            []
                                                        ).some(
                                                            (element) =>
                                                                element.paper_type ===
                                                                "Previous paper"
                                                        ) ? (
                                                            <div className="card light-bg shadow-sm mb-2">
                                                                <div className="row align-items-center font-weight-bold-600 small">
                                                                    <div className="col-3">
                                                                        <div className="card card-body pinkrange-bg p-3">
                                                                            Previous
                                                                            paper
                                                                        </div>
                                                                    </div>
                                                                    <div className="col-9">
                                                                        {(
                                                                            data.student_simulation_paper ||
                                                                            []
                                                                        )
                                                                            .filter(
                                                                                (
                                                                                    element
                                                                                ) =>
                                                                                    element.paper_type ===
                                                                                    "Previous paper"
                                                                            )
                                                                            .map(
                                                                                (
                                                                                    attempt,
                                                                                    attempt_index
                                                                                ) => {
                                                                                    return (
                                                                                        <SimulationPapers
                                                                                            {...this
                                                                                                .props}
                                                                                            key={
                                                                                                attempt_index
                                                                                            }
                                                                                            attempt={
                                                                                                attempt
                                                                                            }
                                                                                            data={
                                                                                                data
                                                                                            }
                                                                                        />
                                                                                    );
                                                                                }
                                                                            )}
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        ) : (
                                                            ""
                                                        )}
                                                    </React.Fragment>
                                                );
                                            }
                                        )}

                                        <small className="mt-2 text-muted">
                                            <i className="fas fa-info-circle fa-sm mr-1"></i>{" "}
                                            Click on the attempt sequence to
                                            view the result
                                        </small>
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

export default connect(mapStateToProps)(TestResult);
