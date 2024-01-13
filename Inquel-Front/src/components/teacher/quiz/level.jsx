import React, { Component } from "react";
import Wrapper from "../wrapper";
import { connect } from "react-redux";
import Select from "react-select";
import { Link } from "react-router-dom";
import { Dropdown } from "react-bootstrap";
import ReactSwitch from "../../common/switchComponent";
import { baseUrl, teacherUrl } from "../../../shared/baseUrl.js";
import Loading from "../../common/loader";
import AlertBox from "../../common/alert";

const mapStateToProps = (state) => ({
    group_name: state.content.group_name,
    subject_name: state.content.subject_name,
    chapter_name: state.content.chapter_name,
    quiz_name: state.content.quiz_name,
});

class TeacherQuizLevel extends Component {
    constructor(props) {
        super(props);
        this.state = {
            showModal: false,
            errorMsg: "",
            successMsg: "",
            showErrorAlert: false,
            showSuccessAlert: false,
            page_loading: true,

            quiz: [],

            negative_points: false,
            total_points: "",
            total_questions: [],
            attempts: [],
            selectedAttempt: "",
            publish: false,
        };
        this.groupId = this.props.match.params.groupId;
        this.subjectId = this.props.match.params.subjectId;
        this.chapterId = this.props.match.params.chapterId;
        this.quizId = this.props.match.params.quizId;
        this.url = baseUrl + teacherUrl;
        this.filterURL = `${this.url}/teacher/subject/${this.subjectId}/cycle/${this.cycle_testId}/filter/?chapter_id=${this.chapterId}`;
        this.authToken = localStorage.getItem("Authorization");
        this.headers = {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: this.authToken,
        };
    }

    loadAttemptData = () => {
        fetch(
            `${this.url}/teacher/subject/${this.subjectId}/chapter/${this.chapterId}/quiz/${this.quizId}/filters/`,
            {
                method: "GET",
                headers: this.headers,
            }
        )
            .then((res) => res.json())
            .then((result) => {
                if (result.sts === true) {
                    this.setState({
                        attempts: result.data.attempts,
                        selectedAttempt: result.data.attempts[0].name,
                        total_questions: result.data.total_questions,
                    });
                    this.loadQuizData();
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

    loadQuizData = () => {
        fetch(
            `${this.url}/teacher/subject/${this.subjectId}/chapter/${this.chapterId}/quiz/`,
            {
                method: "GET",
                headers: this.headers,
            }
        )
            .then((res) => res.json())
            .then((result) => {
                if (result.sts === true) {
                    this.setState({
                        quiz: result.data.levels,
                        negative_points: result.data.negative_points,
                        total_points: result.data.total_points,
                        publish: result.data.publish,
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

    componentDidMount = () => {
        this.loadAttemptData();
    };

    handleAttempt = (event) => {
        this.setState({
            selectedAttempt: event.value,
        });
    };

    handleNegativePoints = () => {
        this.setState({
            negative_points: !this.state.negative_points,
        });
    };

    handleInput = (event, index, type) => {
        let data = [...this.state.quiz];
        data[index][type] = event.target.value;
        this.setState({
            quiz: data,
        });
    };

    handleTotalPoints = (event, index, type) => {
        let total_points = 0;
        let data = [...this.state.quiz];
        data[index][type] = event.target.value;
        this.setState(
            {
                quiz: data,
            },
            () => {
                if (index === 2) {
                    total_points = event.target.value;
                    this.setState({
                        total_points: total_points,
                    });
                }
            }
        );
    };

    handleSubmit = (index) => {
        this.setState({
            showErrorAlert: false,
            showSuccessAlert: false,
            page_loading: true,
        });

        const quiz = [...this.state.quiz];

        if (quiz[index].level_name === "") {
            this.setState({
                errorMsg: "Enter the level name",
                showErrorAlert: true,
                page_loading: false,
            });
        } else if (quiz[index].points_per_question === "") {
            this.setState({
                errorMsg: "Enter the points per question",
                showErrorAlert: true,
                page_loading: false,
            });
        } else if (quiz[index].total_questions === "") {
            this.setState({
                errorMsg: "Enter the total question",
                showErrorAlert: true,
                page_loading: false,
            });
        } else if (quiz[index].max_points === "") {
            this.setState({
                errorMsg: "Enter the max points",
                showErrorAlert: true,
                page_loading: false,
            });
        } else if (quiz[index].bonus_points === "") {
            this.setState({
                errorMsg: "Enter the bonus points",
                showErrorAlert: true,
                page_loading: false,
            });
        } else if (quiz[index].required_time_for_bonus === "") {
            this.setState({
                errorMsg: "Enter the seconds per bonus points",
                showErrorAlert: true,
                page_loading: false,
            });
        } else if (quiz[index].time_per_question === "") {
            this.setState({
                errorMsg: "Enter the time per question",
                showErrorAlert: true,
                page_loading: false,
            });
        } else {
            fetch(
                `${this.url}/teacher/subject/${this.subjectId}/chapter/${this.chapterId}/quiz/${this.quizId}/level/`,
                {
                    method: "PUT",
                    headers: this.headers,
                    body: JSON.stringify({
                        level_id: quiz[index].level_id,
                        level_name: quiz[index].level_name,
                        points: quiz[index].points_per_question.toString(),
                        total_questions: quiz[index].total_questions.toString(),
                        max_points: quiz[index].max_points.toString(),
                        min_points:
                            index === 0
                                ? "0"
                                : quiz[index - 1].max_points.toString(),
                        bonus_points: quiz[index].bonus_points.toString(),
                        time_for_bonus:
                            quiz[index].required_time_for_bonus.toString(),
                        time_per_question:
                            quiz[index].time_per_question.toString(),
                        negative_points: this.state.negative_points,
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
                        this.loadAttemptData();
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
    };

    // -------------------------- Publishing the quiz --------------------------

    handlePublish = () => {
        this.setState({
            showSuccessAlert: false,
            showErrorAlert: false,
            page_loading: true,
        });

        fetch(
            `${this.url}/teacher/subject/${this.subjectId}/chapter/${this.chapterId}/quiz/publish/`,
            {
                headers: this.headers,
                method: "POST",
                body: JSON.stringify({
                    quiz_id: this.quizId,
                }),
            }
        )
            .then((res) => res.json())
            .then((result) => {
                if (result.sts === true) {
                    this.setState({
                        successMsg: `Quiz ${this.state.publish === false ? 'published' : 'unpublished'}`,
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

    levelRedirect = (id) => {
        this.setState({
            showErrorAlert: false,
        });
        if (this.state.selectedAttempt === "") {
            this.setState({
                errorMsg: "Select attempt to preview level details",
                showErrorAlert: true,
            });
        } else {
            this.props.history.push(
                `${this.props.match.url}/level/${id}/?attempt=${this.state.selectedAttempt}`
            );
        }
    };

    render() {
        document.title = `${this.props.quiz_name} - Teacher | IQLabs`;
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

                {/* ----- Breadcrumb ----- */}
                <nav aria-label="breadcrumb">
                    <ol className="breadcrumb mb-3">
                        <li className="breadcrumb-item">
                            <Link to="/teacher">
                                <i className="fas fa-home fa-sm"></i>
                            </Link>
                        </li>
                        {this.groupId !== undefined ? (
                            <>
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
                            </>
                        ) : (
                            <li className="breadcrumb-item">
                                <Link to={`/teacher/subject/${this.subjectId}`}>
                                    {this.props.subject_name}
                                </Link>
                            </li>
                        )}
                        <li className="breadcrumb-item">
                            <Link to="#" onClick={this.props.history.goBack}>
                                {this.props.chapter_name}
                            </Link>
                        </li>
                        <li className="breadcrumb-item active">
                            {this.props.quiz_name}
                        </li>
                    </ol>
                </nav>

                {/* ----- Header configuration ----- */}

                <div className="row align-items-center mb-3">
                    <div className="col-md-8 mb-2 mb-md-0">
                        <div className="row align-items-center">
                            <div className="col-md-4 mb-2 mb-md-0">
                                <Select
                                    className="basic-single form-shadow"
                                    placeholder="Select attempt"
                                    isSearchable={true}
                                    name="attempt"
                                    value={(this.state.attempts || []).map(
                                        (data) => {
                                            return data.name ===
                                                this.state.selectedAttempt
                                                ? {
                                                      value: data.name,
                                                      label: data.name,
                                                  }
                                                : "";
                                        }
                                    )}
                                    options={(this.state.attempts || []).map(
                                        (data) => {
                                            return {
                                                value: data.name,
                                                label: data.name,
                                            };
                                        }
                                    )}
                                    onChange={this.handleAttempt}
                                    required
                                />
                            </div>
                            <div className="col-md-5 mb-2 mb-md-0">
                                <div className="row">
                                    <label className="col-4 col-form-label">
                                        Total Points
                                    </label>
                                    <div className="col-8">
                                        <input
                                            type="text"
                                            name="total_points"
                                            className="form-control form-shadow text-center"
                                            placeholder="Total points"
                                            value={this.state.total_points}
                                            disabled
                                            required
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="col-md-3">
                                <div className="d-flex align-items-center">
                                    <span className="mr-4">
                                        Negative Points
                                    </span>
                                    <ReactSwitch
                                        onChange={this.handleNegativePoints}
                                        checked={this.state.negative_points}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-4 text-right">
                        <button
                            className="btn btn-primary btn-sm shadow-none"
                            onClick={this.handlePublish}
                        >
                            <span className="mx-2">
                                {this.state.publish ? "Unpublish" : "Publish"}
                            </span>
                        </button>
                    </div>
                </div>

                <div className="overflow-auto">
                    <div
                        className="card card-body primary-bg text-white small font-weight-bold-600 shadow-sm p-3 mb-2"
                        style={{ minWidth: "1100px" }}
                    >
                        <div className="row">
                            <div className="col-2">Quiz level</div>
                            <div className="col-10">
                                <div className="row">
                                    <div className="col-2">
                                        Points / Questions
                                    </div>
                                    <div className="col-2">Total Questions</div>
                                    <div className="col-3">
                                        <div className="form-row">
                                            <div className="col-6">
                                                Min Points
                                            </div>
                                            <div className="col-6">
                                                Max Points
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-2">
                                        Bonus Point / Sec
                                    </div>
                                    <div className="col-2 pr-0">
                                        Time / Question
                                    </div>
                                    <div className="col-1 text-right">
                                        Action
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {this.state.quiz.length !== 0
                        ? this.state.quiz.map((quiz, index) => {
                              return (
                                  <div
                                      className="card card-body small font-weight-bold-600 shadow-sm p-3 mb-2"
                                      style={{ minWidth: "1100px" }}
                                      key={index}
                                  >
                                      <div className="row">
                                          <div className="col-2">
                                              <input
                                                  type="text"
                                                  className="form-control form-control-sm border-secondary"
                                                  placeholder={`Quiz level ${
                                                      index + 1
                                                  }`}
                                                  value={quiz.level_name}
                                                  onChange={(event) =>
                                                      this.handleInput(
                                                          event,
                                                          index,
                                                          "level_name"
                                                      )
                                                  }
                                                  required
                                              />
                                          </div>
                                          <div className="col-10">
                                              <div className="row">
                                                  <div className="col-2">
                                                      <input
                                                          type="text"
                                                          className="form-control form-control-sm border-secondary text-center"
                                                          value={
                                                              quiz.points_per_question
                                                          }
                                                          onChange={(event) =>
                                                              this.handleInput(
                                                                  event,
                                                                  index,
                                                                  "points_per_question"
                                                              )
                                                          }
                                                          required
                                                      />
                                                  </div>
                                                  <div className="col-2">
                                                      <div className="form-row">
                                                          <div className="col-6">
                                                              <input
                                                                  type="text"
                                                                  className="form-control form-control-sm border-secondary text-center"
                                                                  value={
                                                                      Object.values(
                                                                          this
                                                                              .state
                                                                              .total_questions[
                                                                              index
                                                                          ]
                                                                      )[0]
                                                                  }
                                                                  disabled
                                                              />
                                                          </div>
                                                          <div className="col-6">
                                                              <input
                                                                  type="text"
                                                                  className="form-control form-control-sm border-secondary text-center"
                                                                  value={
                                                                      quiz.total_questions
                                                                  }
                                                                  onChange={(
                                                                      event
                                                                  ) =>
                                                                      this.handleInput(
                                                                          event,
                                                                          index,
                                                                          "total_questions"
                                                                      )
                                                                  }
                                                                  required
                                                              />
                                                          </div>
                                                      </div>
                                                  </div>
                                                  <div className="col-3">
                                                      <div className="form-row">
                                                          <div className="col-6">
                                                              <input
                                                                  type="text"
                                                                  className="form-control form-control-sm border-secondary text-center"
                                                                  value={
                                                                      index ===
                                                                      0
                                                                          ? index
                                                                          : this
                                                                                .state
                                                                                .quiz[
                                                                                index -
                                                                                    1
                                                                            ]
                                                                                .max_points
                                                                  }
                                                                  onChange={(
                                                                      event
                                                                  ) =>
                                                                      this.handleInput(
                                                                          event,
                                                                          index,
                                                                          "min_points"
                                                                      )
                                                                  }
                                                                  disabled
                                                              />
                                                          </div>
                                                          <div className="col-6">
                                                              <input
                                                                  type="text"
                                                                  className="form-control form-control-sm border-secondary text-center"
                                                                  value={
                                                                      quiz.max_points
                                                                  }
                                                                  onChange={(
                                                                      event
                                                                  ) =>
                                                                      this.handleTotalPoints(
                                                                          event,
                                                                          index,
                                                                          "max_points"
                                                                      )
                                                                  }
                                                                  required
                                                              />
                                                          </div>
                                                      </div>
                                                  </div>
                                                  <div className="col-2">
                                                      <div className="d-flex align-items-center">
                                                          <input
                                                              type="text"
                                                              className="form-control form-control-sm border-secondary text-center"
                                                              value={
                                                                  quiz.bonus_points
                                                              }
                                                              onChange={(
                                                                  event
                                                              ) =>
                                                                  this.handleInput(
                                                                      event,
                                                                      index,
                                                                      "bonus_points"
                                                                  )
                                                              }
                                                              required
                                                          />
                                                          <span className="h5 mx-1 mb-0">
                                                              /
                                                          </span>
                                                          <input
                                                              type="text"
                                                              className="form-control form-control-sm border-secondary text-center"
                                                              value={
                                                                  quiz.required_time_for_bonus
                                                              }
                                                              onChange={(
                                                                  event
                                                              ) =>
                                                                  this.handleInput(
                                                                      event,
                                                                      index,
                                                                      "required_time_for_bonus"
                                                                  )
                                                              }
                                                              required
                                                          />
                                                      </div>
                                                  </div>
                                                  <div className="col-2 pr-0">
                                                      <div
                                                          className="input-group input-group-sm border-secondary rounded-lg"
                                                          style={{
                                                              overflow:
                                                                  "hidden",
                                                          }}
                                                      >
                                                          <input
                                                              type="text"
                                                              className="form-control form-control-sm text-center"
                                                              value={
                                                                  quiz.time_per_question
                                                              }
                                                              onChange={(
                                                                  event
                                                              ) =>
                                                                  this.handleInput(
                                                                      event,
                                                                      index,
                                                                      "time_per_question"
                                                                  )
                                                              }
                                                              required
                                                          />
                                                          <div className="input-group-prepend">
                                                              <span className="input-group-text border-0">
                                                                  sec
                                                              </span>
                                                          </div>
                                                      </div>
                                                  </div>
                                                  <div className="col-1 text-right">
                                                      <Dropdown>
                                                          <Dropdown.Toggle
                                                              variant="Secondary"
                                                              className="btn btn-outline-secondary btn-sm shadow-none caret-off"
                                                          >
                                                              <i className="fas fa-ellipsis-h"></i>
                                                          </Dropdown.Toggle>

                                                          <Dropdown.Menu>
                                                              <Dropdown.Item
                                                                  onClick={() => {
                                                                      this.handleSubmit(
                                                                          index
                                                                      );
                                                                  }}
                                                              >
                                                                  <i className="far fa-save fa-sm mr-1"></i>{" "}
                                                                  Save
                                                              </Dropdown.Item>
                                                              <Dropdown.Item
                                                                  onClick={() => {
                                                                      this.levelRedirect(
                                                                          quiz.level_id
                                                                      );
                                                                  }}
                                                                  disabled={
                                                                      quiz.questions
                                                                          ? false
                                                                          : true
                                                                  }
                                                              >
                                                                  <i className="far fa-eye fa-sm mr-1"></i>{" "}
                                                                  View
                                                              </Dropdown.Item>
                                                          </Dropdown.Menu>
                                                      </Dropdown>
                                                  </div>
                                              </div>
                                          </div>
                                      </div>
                                  </div>
                              );
                          })
                        : ""}
                </div>

                {/* Loading component */}
                {this.state.page_loading ? <Loading /> : ""}
            </Wrapper>
        );
    }
}

export default connect(mapStateToProps)(TeacherQuizLevel);
