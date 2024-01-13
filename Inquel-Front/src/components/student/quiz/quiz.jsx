import React, { Component } from "react";
import Header from "../shared/examNavbar";
import { baseUrl, studentUrl } from "../../../shared/baseUrl.js";
import AlertBox from "../../common/alert";
import Loading from "../../common/loader";
import { connect } from "react-redux";
import storeDispatch from "../../../redux/dispatch";
import { TEMP } from "../../../redux/action";
import { ErrorBoundary } from "react-error-boundary";
import ErrorFallback from "../../common/ErrorFallback";
import NumericConversion from "../../common/function/NumericConversion";

const mapStateToProps = (state) => ({
    subject_name: state.content.subject_name,
    chapter_name: state.content.chapter_name,
    quiz_name: state.content.quiz_name,
    course_name: state.content.course_name,
});

class Quiz extends Component {
    constructor(props) {
        super(props);
        this.state = {
            quiz: {},
            cssArray: [
                "align-items-start",
                "align-items-start align-items-md-center",
                "align-items-start align-items-md-end",
            ],

            errorMsg: "",
            successMsg: "",
            showErrorAlert: false,
            showSuccessAlert: false,
            page_loading: true,
        };
        this.subscriptionId = this.props.match.params.subscriptionId;
        this.courseId = this.props.match.params.courseId;
        this.subjectId = this.props.match.params.subjectId;
        this.chapterId = this.props.match.params.chapterId;
        this.quizId = this.props.match.params.quizId;
        this.url = baseUrl + studentUrl;
        this.authToken = localStorage.getItem("Authorization");
        this.headers = {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: this.authToken,
        };
    }

    loadQuizData = () => {
        fetch(
            this.courseId
                ? `${this.url}/student/sub/${this.subscriptionId}/course/${this.courseId}/chapter/${this.chapterId}/quiz/`
                : `${this.url}/student/subject/${this.subjectId}/chapter/${this.chapterId}/quiz/`,
            {
                method: "GET",
                headers: this.headers,
            }
        )
            .then((res) => res.json())
            .then((result) => {
                if (result.sts === true) {
                    this.setState({
                        quiz: result.data,
                        page_loading: false,
                    });
                    storeDispatch(TEMP, result.data);
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

    componentDidMount = () => {
        document.title = `${this.props.quiz_name} - Student | IQLabs`;

        this.loadQuizData();
    };

    handleExamStart = (level_id, complexity) => {
        this.setState({
            page_loading: true,
        });

        fetch(
            this.courseId
                ? `${this.url}/student/sub/${this.subscriptionId}/course/${this.courseId}/chapter/${this.chapterId}/quiz/`
                : `${this.url}/student/subject/${this.subjectId}/chapter/${this.chapterId}/quiz/`,
            {
                method: "POST",
                headers: this.headers,
                body: JSON.stringify({
                    quiz_id: this.quizId,
                    level: complexity,
                }),
            }
        )
            .then((res) => res.json())
            .then((result) => {
                if (result.sts === true) {
                    this.props.history.push(
                        `${this.props.match.url}/level/${level_id}`
                    );
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
                    chapter_name={`${this.props.chapter_name} - ${
                        this.props.quiz_name || ""
                    }`}
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
                    <div className="container">
                        <ErrorBoundary
                            FallbackComponent={ErrorFallback}
                            onReset={() => window.location.reload()}
                        >
                            <div className="card card-body shadow-sm">
                                <div
                                    className="light-bg p-3 p-md-4 p-md-mb-0"
                                    style={{ minHeight: "70vh" }}
                                >
                                    {/* ----- Header ----- */}
                                    <div className="row align-items-center mb-5">
                                        <div className="col-lg-4 col-sm-6 order-2 order-lg-1 mb-3 mb-sm-0">
                                            <div className="d-inline primary-bg px-4 py-2 rounded-pill text-white">
                                                Total points:{" "}
                                                {this.state.quiz.total_points ||
                                                    0}
                                            </div>
                                        </div>
                                        <div className="col-lg-4 order-1 order-lg-2 mb-3 mb-lg-0">
                                            <h3 className="text-center primary-text mb-0">
                                                Select Level
                                            </h3>
                                        </div>
                                        <div className="col-lg-4 col-sm-6 order-3 text-right">
                                            <div className="d-inline primary-bg px-4 py-2 rounded-pill text-white">
                                                Scored points:{" "}
                                                {this.state.quiz.scored_points
                                                    ? NumericConversion(
                                                          this.state.quiz
                                                              .scored_points
                                                      )
                                                    : 0}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="row">
                                        {Object.entries(this.state.quiz)
                                            .length !== 0
                                            ? (
                                                  this.state.quiz.levels || []
                                              ).map((level, index) => {
                                                  return (
                                                      <div
                                                          className="col-md-4"
                                                          key={index}
                                                      >
                                                          <div
                                                              className={`row ${this.state.cssArray[index]}`}
                                                              style={{
                                                                  height: "50vh",
                                                              }}
                                                          >
                                                              <div className="col-12">
                                                                  <div className="text-center d-flex flex-column align-items-center justify-content-center rounded-pill primary-bg p-4">
                                                                      <div
                                                                          className="bg-white d-flex align-items-center justify-content-center rounded-lg font-weight-bold-600 primary-text mb-2"
                                                                          style={{
                                                                              width: "30px",
                                                                              height: "30px",
                                                                          }}
                                                                      >
                                                                          {index +
                                                                              1}
                                                                      </div>
                                                                      <p className="h5 text-white font-weight-bold-600 mb-0">
                                                                          {this
                                                                              .state
                                                                              .quiz
                                                                              .scored_points >=
                                                                          level.min_points
                                                                              ? level.level_name
                                                                              : `Earn ${level.min_points} points to unlock`}
                                                                      </p>
                                                                  </div>
                                                                  <div className="text-center mt-2">
                                                                      {this
                                                                          .state
                                                                          .quiz
                                                                          .scored_points >=
                                                                      level.min_points ? (
                                                                          <button
                                                                              className="btn btn-primary shadow-none rounded-pill px-3"
                                                                              onClick={() =>
                                                                                  this.handleExamStart(
                                                                                      level.level_id,
                                                                                      level.complexity
                                                                                  )
                                                                              }
                                                                          >
                                                                              <i className="fas fa-lock-open fa-sm mr-1"></i>{" "}
                                                                              Start
                                                                          </button>
                                                                      ) : (
                                                                          <button className="btn btn-primary shadow-none rounded-pill px-3">
                                                                              <i className="fas fa-lock fa-sm mr-1"></i>{" "}
                                                                              Lock
                                                                          </button>
                                                                      )}
                                                                  </div>
                                                              </div>
                                                          </div>
                                                      </div>
                                                  );
                                              })
                                            : ""}
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

export default connect(mapStateToProps)(Quiz);
