import React, { Component } from "react";
import Header from "../shared/examNavbar";
import ReactCardFlip from "react-card-flip";
import { baseUrl, studentUrl } from "../../../shared/baseUrl.js";
import AlertBox from "../../common/alert";
import Loading from "../../common/loader";
import { OverlayTrigger, Tooltip, Popover } from "react-bootstrap";
import FullScreen from "react-fullscreen-crossbrowser";
import Lightbox from "react-awesome-lightbox";
import "react-awesome-lightbox/build/style.css";
import {
    ConceptDataFormat,
    QuestionDataFormat,
} from "../../common/function/dataFormating";
import { connect } from "react-redux";
import VideoModal from "../../common/modal/videoModal";
import { ErrorBoundary } from "react-error-boundary";
import ErrorFallback from "../../common/ErrorFallback";

const mapStateToProps = (state) => ({
    subject_data: state.storage.response,
    temp: state.storage.temp,
    subject_name: state.content.subject_name,
    chapter_name: state.content.chapter_name,
    topic_name: state.content.topic_name,
});

class FavouritesFlashcard extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isFlipped: false,
            showVideoModal: false,
            data: [],

            sections: [],
            explanation: [],

            activeTab: this.props.match.params.type,
            activeData: 0,
            totalItems: "",
            totalSubQuestion: [],
            currentSubQuestionIndex: [],

            isFullscreenEnabled: false,
            isLightBoxOpen: false,

            selectedImageArray: [],
            imageStartIndex: 0,
            selectedVideoData: "",

            errorMsg: "",
            successMsg: "",
            showErrorAlert: false,
            showSuccessAlert: false,
            page_loading: false,

            seconds: 0,
            isSlideshowPlaying: false,
        };
        this.subscriptionId = this.props.match.params.subscriptionId;
        this.courseId = this.props.match.params.courseId;
        this.subjectId = this.props.match.params.subjectId;
        this.chapterId = this.props.match.params.chapterId;
        this.topicNum = this.props.match.params.topicNum;
        this.url = baseUrl + studentUrl;
        this.authToken = localStorage.getItem("Authorization");
        this.headers = {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: this.authToken,
        };
        this.slideInterval = 0;
    }

    // ---------- loads concepts data ----------

    loadConceptData = async () => {
        let response = ConceptDataFormat(this.props.temp);
        await this.setState({
            data: response.result,
            totalItems: response.result.length,
            seconds: 15,
        });
        window.MathJax.typeset();
    };

    conceptRender = (data, index) => {
        return (
            <FullScreen
                enabled={this.state.isFullscreenEnabled}
                onChange={(isFullscreenEnabled) =>
                    this.setState({ isFullscreenEnabled })
                }
            >
                <ReactCardFlip
                    isFlipped={this.state.isFlipped}
                    flipDirection="vertical"
                >
                    <div
                        className="card card-body shadow-sm concept-content-center"
                        style={{
                            minHeight: `${
                                this.state.isFullscreenEnabled
                                    ? "100vh"
                                    : "70vh"
                            }`,
                            maxHeight: "100vh",
                            overflowY: "auto",
                        }}
                        onClick={() => {
                            this.setState({
                                isFlipped: !this.state.isFlipped,
                            });
                        }}
                    >
                        <div
                            dangerouslySetInnerHTML={{
                                __html: data[index].content.terms || "",
                            }}
                        ></div>
                        <button
                            className="btn btn-link btn-sm shadow-none"
                            style={{
                                position: "absolute",
                                top: "10px",
                                right: "10px",
                            }}
                            onClick={(e) => {
                                e.stopPropagation();
                                this.setState({
                                    isFullscreenEnabled:
                                        !this.state.isFullscreenEnabled,
                                });
                            }}
                        >
                            {this.state.isFullscreenEnabled ? (
                                <i className="fas fa-compress fa-lg"></i>
                            ) : (
                                <i className="fas fa-expand fa-lg"></i>
                            )}
                        </button>
                    </div>
                    <div
                        className="card card-body shadow-sm concept-content-center"
                        style={{
                            minHeight: `${
                                this.state.isFullscreenEnabled
                                    ? "100vh"
                                    : "70vh"
                            }`,
                            maxHeight: "100vh",
                            overflowY: "auto",
                        }}
                        onClick={() => {
                            this.setState({
                                isFlipped: !this.state.isFlipped,
                            });
                        }}
                    >
                        <div className="d-flex align-items-center w-100">
                            {/* ---------- Content ---------- */}
                            <div className="w-100">
                                <div
                                    dangerouslySetInnerHTML={{
                                        __html:
                                            data[index] !== undefined &&
                                            data[index].content !== undefined &&
                                            data[index].content.definition !==
                                                undefined
                                                ? data[index].content.definition
                                                : "",
                                    }}
                                ></div>
                            </div>
                            {/* <!----- Image & Video viewer -----> */}
                            {data[index] &&
                            data[index].content &&
                            data[index].content.images &&
                            data[index].content.video ? (
                                data[index].content.images.length !== 0 ||
                                data[index].content.video.path !== "" ? (
                                    <div className="ml-3">
                                        {this.imageRender(data[index])}
                                    </div>
                                ) : (
                                    ""
                                )
                            ) : (
                                ""
                            )}
                            {/* <!-- Image viewer ends here --> */}
                        </div>
                        <button
                            className="btn btn-link btn-sm shadow-none"
                            style={{
                                position: "absolute",
                                top: "10px",
                                right: "10px",
                            }}
                            onClick={(e) => {
                                e.stopPropagation();
                                this.setState({
                                    isFullscreenEnabled:
                                        !this.state.isFullscreenEnabled,
                                });
                            }}
                        >
                            {this.state.isFullscreenEnabled ? (
                                <i className="fas fa-compress fa-lg"></i>
                            ) : (
                                <i className="fas fa-expand fa-lg"></i>
                            )}
                        </button>
                    </div>
                </ReactCardFlip>
            </FullScreen>
        );
    };

    // ---------- loads practice data ----------

    loadPracticeData = async () => {
        let response = QuestionDataFormat(this.props.temp);
        await this.setState(
            {
                data: response.result,
                totalItems: response.result.length,
                totalSubQuestion: response.totalSubQuestion,
                currentSubQuestionIndex: response.currentSubQuestionIndex,
            },
            () => {
                this.loopSectionStructure();
            }
        );
        window.MathJax.typeset();
    };

    // ---------- creates section structure and explanation structure ----------

    loopSectionStructure = () => {
        const sections =
            this.state.data !== undefined || this.state.data.length !== 0
                ? this.state.data
                : [];
        let questions = [];
        let explanation = [];

        if (sections.length !== 0) {
            sections.forEach((data) => {
                if (data.type === "type_1") {
                    // section
                    questions.push({
                        question_random_id: data.question_random_id,
                        answers: [],
                    });
                    // explanation
                    explanation.push({
                        isAnswered: false,
                        answer: false,
                        answers: [],
                        explanation: "",
                    });
                } else if (data.type === "type_2") {
                    let sub_question = [];
                    let sub_explanation = [];
                    data.sub_question.forEach((sub_data) => {
                        // section
                        sub_question.push({
                            sub_question_id: sub_data.sub_question_id,
                            answers: [],
                        });
                        // explanation
                        sub_explanation.push({
                            answer: false,
                            answers: [],
                        });
                    });
                    // section
                    questions.push({
                        question_random_id: data.question_random_id,
                        answers: sub_question,
                    });
                    // explanation
                    explanation.push({
                        explanation: "",
                        isAnswered: false,
                        sub_question: sub_explanation,
                    });
                }
            });
        }

        this.setState({
            sections: questions,
            explanation: explanation,
        });
    };

    // ---------- handle option selection ----------

    handleMCQ = (event, index, type) => {
        let sections = [...this.state.sections];
        if (type === "checkbox") {
            if (sections[index].answers.includes(event)) {
                sections[index].answers.splice(
                    sections[index].answers.indexOf(event),
                    1
                );
                this.setState({
                    sections: sections,
                });
            } else {
                sections[index].answers.push(event);
                this.setState({
                    sections: sections,
                });
            }
        } else if (type === "radio") {
            sections[index].answers[0] = event;
            this.setState({
                sections: sections,
            });
        }
    };

    handleFillin = (event, index, type) => {
        let sections = [...this.state.sections];
        if (event.target.value !== "") {
            if (type === "type_1") {
                sections[index].answers[0] = event.target.value;
            } else if (type === "type_2") {
                sections[index].answers[
                    this.state.currentSubQuestionIndex[index]
                ].answers[0] = event.target.value;
            }
            this.setState({
                sections: sections,
            });
        } else {
            if (type === "type_1") {
                sections[index].answers = [];
            } else if (type === "type_2") {
                sections[index].answers[
                    this.state.currentSubQuestionIndex[index]
                ].answers = [];
            }
            this.setState({
                sections: sections,
            });
        }
    };

    handleBoolean = (event, index) => {
        let sections = [...this.state.sections];
        sections[index].answers[0] = event;
        this.setState({
            sections: sections,
        });
    };

    handleEventChange = (event, index) => {
        let sections = [...this.state.sections];
        if (event.target.checked) {
            sections[index].answers.splice(
                sections[index].answers.indexOf(event.target.value),
                1
            );
            this.setState({
                sections: sections,
            });
        } else {
            sections[index].answers.push(event.target.value);
            this.setState({
                sections: sections,
            });
        }
    };

    practiceRender = (data, index, section, explanation) => {
        return data.lenght === 0 ? (
            <div
                className="card card-body shadow-sm align-items-center justify-content-center font-weight-bold-600"
                style={{
                    minHeight: "70vh",
                }}
            >
                No content to display
            </div>
        ) : (
            <div
                className="card card-body shadow-sm"
                style={{ minHeight: "70vh" }}
            >
                {data[index].type === "type_1" ? (
                    // --------------- Type 1 content ---------------
                    <div className="d-flex">
                        <div className="w-100">
                            <div className="d-flex mb-2">
                                <p className="font-weight-bold mr-2">
                                    {index < 9
                                        ? `0${index + 1}.`
                                        : `${index + 1}.`}
                                </p>
                                <div
                                    className="font-weight-bold-600 w-100"
                                    dangerouslySetInnerHTML={{
                                        __html: data[index].question,
                                    }}
                                ></div>
                            </div>

                            {/* ---------- Explanation ---------- */}
                            {explanation.lenght !== 0 ? (
                                explanation.isAnswered === true ? (
                                    <>
                                        <div
                                            className="card card-body bg-light mb-3 position-relative"
                                            style={{
                                                minHeight: "200px",
                                            }}
                                        >
                                            <p className="font-weight-bold-600 mb-2">
                                                Explanation:
                                            </p>
                                            <p
                                                className="small"
                                                dangerouslySetInnerHTML={{
                                                    __html: explanation.explanation,
                                                }}
                                            ></p>
                                            <div
                                                className="position-absolute"
                                                style={{
                                                    right: 0,
                                                    top: "10px",
                                                }}
                                            >
                                                {data[index] &&
                                                data[index].content &&
                                                data[index].content.audio
                                                    ? data[index].content.audio
                                                          .length !== 0
                                                        ? data[
                                                              index
                                                          ].content.audio.map(
                                                              (
                                                                  audio,
                                                                  audio_index
                                                              ) => {
                                                                  return audio.path !==
                                                                      "" ? (
                                                                      <OverlayTrigger
                                                                          trigger="click"
                                                                          rootClose
                                                                          key={`popover${audio_index}`}
                                                                          placement="bottom"
                                                                          overlay={
                                                                              <Popover
                                                                                  id={`popover-positioned-bottom${audio_index}`}
                                                                              >
                                                                                  {audio.title !==
                                                                                  "" ? (
                                                                                      <Popover.Title>
                                                                                          {
                                                                                              audio.title
                                                                                          }
                                                                                      </Popover.Title>
                                                                                  ) : (
                                                                                      ""
                                                                                  )}
                                                                                  <Popover.Content
                                                                                      style={{
                                                                                          overflow:
                                                                                              "auto",
                                                                                      }}
                                                                                  >
                                                                                      <audio
                                                                                          src={
                                                                                              audio.path
                                                                                          }
                                                                                          autoPlay
                                                                                          controls
                                                                                          controlsList="nodownload"
                                                                                      ></audio>
                                                                                  </Popover.Content>
                                                                              </Popover>
                                                                          }
                                                                      >
                                                                          <button
                                                                              className="btn btn-primary btn-sm rounded-circle mr-2 shadow-none"
                                                                              key={
                                                                                  audio_index
                                                                              }
                                                                          >
                                                                              <i className="fas fa-volume-up buttton fa-sm"></i>
                                                                          </button>
                                                                      </OverlayTrigger>
                                                                  ) : (
                                                                      ""
                                                                  );
                                                              }
                                                          )
                                                        : ""
                                                    : ""}
                                            </div>
                                        </div>
                                        {/* show answer */}
                                        <div className="row">
                                            <div className="col-md-6">
                                                <div
                                                    className="card card-body success-bg h-100"
                                                    style={{
                                                        minHeight: "100px",
                                                    }}
                                                >
                                                    <p className="font-weight-bold-600 mb-2">
                                                        Correct answer(s):
                                                    </p>
                                                    {explanation.answer ===
                                                    false
                                                        ? explanation.answers &&
                                                          explanation.answers
                                                              .lenght !== 0
                                                            ? explanation.answers.map(
                                                                  (
                                                                      data,
                                                                      index
                                                                  ) => {
                                                                      return (
                                                                          <p
                                                                              className="small mb-2"
                                                                              key={
                                                                                  index
                                                                              }
                                                                              dangerouslySetInnerHTML={{
                                                                                  __html: data,
                                                                              }}
                                                                          ></p>
                                                                      );
                                                                  }
                                                              )
                                                            : ""
                                                        : section.length !== 0
                                                        ? section.answers &&
                                                          section.answers
                                                              .length !== 0
                                                            ? section.answers.map(
                                                                  (
                                                                      data,
                                                                      index
                                                                  ) => {
                                                                      return (
                                                                          <p
                                                                              className="small mb-2"
                                                                              key={
                                                                                  index
                                                                              }
                                                                              dangerouslySetInnerHTML={{
                                                                                  __html: data,
                                                                              }}
                                                                          ></p>
                                                                      );
                                                                  }
                                                              )
                                                            : ""
                                                        : ""}
                                                </div>
                                            </div>
                                            {explanation.answer === false ? (
                                                <div className="col-md-6">
                                                    <div
                                                        className="card card-body danger-bg h-100"
                                                        style={{
                                                            minHeight: "100px",
                                                        }}
                                                    >
                                                        <p className="font-weight-bold-600 mb-2">
                                                            Your answer(s):
                                                        </p>
                                                        {section.length !== 0
                                                            ? section.answers &&
                                                              section.answers
                                                                  .length !== 0
                                                                ? section.answers.map(
                                                                      (
                                                                          data,
                                                                          index
                                                                      ) => {
                                                                          return (
                                                                              <p
                                                                                  className="small mb-2"
                                                                                  key={
                                                                                      index
                                                                                  }
                                                                                  dangerouslySetInnerHTML={{
                                                                                      __html: data,
                                                                                  }}
                                                                              ></p>
                                                                          );
                                                                      }
                                                                  )
                                                                : ""
                                                            : ""}
                                                    </div>
                                                </div>
                                            ) : (
                                                ""
                                            )}
                                        </div>
                                    </>
                                ) : (
                                    // ---------- MCQ Optins ----------
                                    <div className="row">
                                        <div className="col-md-6">
                                            {data[index].content.mcq ===
                                            true ? (
                                                data[index].content.options.map(
                                                    (option, option_index) => {
                                                        return (
                                                            <div
                                                                className="card shadow-sm mb-2 bg-light card-body small font-weight-bold-600 pt-3 pb-0"
                                                                key={
                                                                    option_index
                                                                }
                                                                onClick={() =>
                                                                    this.handleMCQ(
                                                                        option.content,
                                                                        index,
                                                                        data[
                                                                            index
                                                                        ]
                                                                            .content
                                                                            .mcq_answers >
                                                                            1
                                                                            ? "checkbox"
                                                                            : "radio"
                                                                    )
                                                                }
                                                            >
                                                                {data[index]
                                                                    .content
                                                                    .mcq_answers >
                                                                1 ? (
                                                                    <div className="custom-control custom-checkbox">
                                                                        <input
                                                                            type="checkbox"
                                                                            className="custom-control-input"
                                                                            id={`option_${option_index}`}
                                                                            value={
                                                                                option.content
                                                                            }
                                                                            checked={
                                                                                section.length !==
                                                                                0
                                                                                    ? section
                                                                                          .answers
                                                                                          .length !==
                                                                                      0
                                                                                        ? section.answers.includes(
                                                                                              option.content
                                                                                          )
                                                                                            ? true
                                                                                            : false
                                                                                        : false
                                                                                    : false
                                                                            }
                                                                            onChange={(
                                                                                e
                                                                            ) => {
                                                                                this.handleEventChange(
                                                                                    e,
                                                                                    index
                                                                                );
                                                                            }}
                                                                        />
                                                                        <label
                                                                            className="custom-control-label"
                                                                            htmlFor={`option_${option_index}`}
                                                                            dangerouslySetInnerHTML={{
                                                                                __html: `<div class="mb-3">${option.content}</div>`,
                                                                            }}
                                                                        ></label>
                                                                    </div>
                                                                ) : (
                                                                    <div className="custom-control custom-radio">
                                                                        <input
                                                                            type="radio"
                                                                            id={`customRadio${index}-${option_index}`}
                                                                            name={`customRadio${index}`}
                                                                            className="custom-control-input"
                                                                            value={
                                                                                option.content
                                                                            }
                                                                            checked={
                                                                                section.length !==
                                                                                0
                                                                                    ? section
                                                                                          .answers
                                                                                          .length !==
                                                                                      0
                                                                                        ? section.answers.includes(
                                                                                              option.content
                                                                                          )
                                                                                            ? true
                                                                                            : false
                                                                                        : false
                                                                                    : false
                                                                            }
                                                                            onChange={(
                                                                                e
                                                                            ) => {}}
                                                                        />
                                                                        <label
                                                                            className="custom-control-label"
                                                                            htmlFor={`customRadio${index}-${option_index}`}
                                                                            dangerouslySetInnerHTML={{
                                                                                __html: `<div class="mb-3">${option.content}</div>`,
                                                                            }}
                                                                        ></label>
                                                                    </div>
                                                                )}
                                                            </div>
                                                        );
                                                    }
                                                )
                                            ) : // ---------- True or False ----------
                                            data[index].content.boolean ===
                                              true ? (
                                                (
                                                    data[index].content
                                                        .boolean_question || []
                                                ).map(
                                                    (option, boolean_index) => {
                                                        return (
                                                            <div
                                                                className="card shadow-sm mb-2 bg-light card-body small font-weight-bold-600 py-3"
                                                                key={
                                                                    boolean_index
                                                                }
                                                                onClick={() =>
                                                                    this.handleBoolean(
                                                                        option.content,
                                                                        index
                                                                    )
                                                                }
                                                            >
                                                                <div className="custom-control custom-radio">
                                                                    <input
                                                                        type="radio"
                                                                        id={`customRadio${index}-${boolean_index}`}
                                                                        name={`customRadio${index}`}
                                                                        className="custom-control-input"
                                                                        value={
                                                                            option.content
                                                                        }
                                                                        checked={
                                                                            section.length !==
                                                                            0
                                                                                ? section
                                                                                      .answers
                                                                                      .length !==
                                                                                  0
                                                                                    ? section.answers.includes(
                                                                                          option.content
                                                                                      )
                                                                                        ? true
                                                                                        : false
                                                                                    : false
                                                                                : false
                                                                        }
                                                                        onChange={(
                                                                            e
                                                                        ) => {}}
                                                                    />
                                                                    <label
                                                                        className="custom-control-label"
                                                                        htmlFor={`customRadio${index}-${boolean_index}`}
                                                                    >
                                                                        {
                                                                            option.content
                                                                        }
                                                                    </label>
                                                                </div>
                                                            </div>
                                                        );
                                                    }
                                                )
                                            ) : // ---------- Fill in answers ----------
                                            data[index].content.fill_in ===
                                              true ? (
                                                <input
                                                    type="text"
                                                    name="fill_in"
                                                    className="form-control borders"
                                                    placeholder="Type your answer here"
                                                    value={
                                                        section.length !== 0
                                                            ? section.answers
                                                                  .length !== 0
                                                                ? section
                                                                      .answers[0]
                                                                : ""
                                                            : ""
                                                    }
                                                    onChange={(event) =>
                                                        this.handleFillin(
                                                            event,
                                                            index,
                                                            "type_1"
                                                        )
                                                    }
                                                    autoComplete="off"
                                                />
                                            ) : (
                                                ""
                                            )}
                                        </div>
                                    </div>
                                )
                            ) : (
                                ""
                            )}

                            {/* ----- Multiple choice notes ----- */}
                            {explanation.length !== 0 ? (
                                explanation.isAnswered === false ? (
                                    data[index].content.mcq_answers !==
                                    undefined ? (
                                        data[index].content.mcq_answers > 1 ? (
                                            <div className="small">
                                                <b>Note:</b>{" "}
                                                {
                                                    data[index].content
                                                        .mcq_answers
                                                }{" "}
                                                answers are correct
                                            </div>
                                        ) : null
                                    ) : null
                                ) : (
                                    ""
                                )
                            ) : (
                                ""
                            )}

                            {/* ----- Check button ----- */}
                            {Object.entries(explanation).length !== 0 ? (
                                explanation.isAnswered === false ? (
                                    section.answers.length !== 0 ? (
                                        data[index].content.mcq_answers ? (
                                            data[index].content.mcq_answers ===
                                            section.answers.length ? (
                                                <div className="row mt-4">
                                                    <div className="col-md-3">
                                                        <button
                                                            className="btn btn-primary btn-block btn-sm shadow-none"
                                                            onClick={() => {
                                                                this.handleCheck(
                                                                    section,
                                                                    "type_1"
                                                                );
                                                            }}
                                                        >
                                                            Check
                                                        </button>
                                                    </div>
                                                </div>
                                            ) : (
                                                ""
                                            )
                                        ) : (
                                            <div className="row mt-4">
                                                <div className="col-md-3">
                                                    <button
                                                        className="btn btn-primary btn-block btn-sm shadow-none"
                                                        onClick={() => {
                                                            this.handleCheck(
                                                                section,
                                                                "type_1"
                                                            );
                                                        }}
                                                    >
                                                        Check
                                                    </button>
                                                </div>
                                            </div>
                                        )
                                    ) : (
                                        ""
                                    )
                                ) : (
                                    ""
                                )
                            ) : (
                                ""
                            )}
                        </div>
                        {/* <!----- Image & Video viewer -----> */}
                        {data[index] &&
                        data[index].content &&
                        data[index].content.images &&
                        data[index].content.video ? (
                            data[index].content.images.length !== 0 ||
                            data[index].content.video.path !== "" ? (
                                <div className="ml-3">
                                    {this.imageRender(data[index])}
                                </div>
                            ) : (
                                ""
                            )
                        ) : (
                            ""
                        )}
                        {/* <!-- Image viewer ends here --> */}
                    </div>
                ) : (
                    // --------------- Type 2 render function ---------------
                    this.typeTwoRender(data, index, section, explanation)
                )}
            </div>
        );
    };

    handleDragStart = (event, data, index) => {
        event.dataTransfer.setData("data", data);
        event.dataTransfer.setData("index", index);
        var node = document.getElementById(event.target.id);
        if (node !== null) {
            var crt = node.cloneNode(true);
            crt.id = event.target.id + "-copy";
            crt.classList.remove("light-bg");
            crt.classList.add("ghost-card");
            document.getElementById("root").appendChild(crt);
            event.dataTransfer.setDragImage(crt, 0, 0);
        }
    };

    handleDragEnd = (event) => {
        var id = event.target.id + "-copy";
        var node = document.getElementById(id);
        if (node !== null) {
            node.parentNode.removeChild(node);
        }
    };

    handleDrop = async (event) => {
        const sections = [...this.state.sections];

        var areaNode = document.getElementById("drop-area");
        areaNode.classList.toggle("over");

        let data = event.dataTransfer.getData("data") || null;
        let index = event.dataTransfer.getData("index") || null;
        if (data !== null && index !== null) {
            sections[index].answers[
                this.state.currentSubQuestionIndex[index]
            ].answers[0] = data;
        }

        await this.setState({
            sections: sections,
        });
        window.MathJax.typeset();
    };

    handleDragEnter = (event) => {
        var node = document.getElementById("drop-area");
        node.classList.toggle("over");
    };

    handleDragLeave = (event) => {
        var node = document.getElementById("drop-area");
        node.classList.toggle("over");
    };

    typeTwoRender = (data, index, section, explanation) => {
        let isAnswerAvailable = false;
        let answerCount = 0;
        if (Object.entries(section).length !== 0) {
            if (section.answers.length !== 0) {
                section.answers.forEach((data) => {
                    if (data.answers.length !== 0) {
                        isAnswerAvailable = true;
                        answerCount++;
                    }
                });
            }
        }
        return (
            <div className="d-flex">
                <div className="w-100">
                    {/* ---------- Main Question ---------- */}
                    <div className="d-flex mb-2">
                        <p className="font-weight-bold mr-2">
                            {index < 9 ? `0${index + 1}.` : `${index + 1}.`}
                        </p>
                        <div
                            className="w-100"
                            dangerouslySetInnerHTML={{
                                __html: data[index].question,
                            }}
                        ></div>
                    </div>
                    <div className="row mb-3">
                        {/* ---------- Drop area ---------- */}
                        <div className="col-md-6">
                            <div
                                id="drop-area"
                                className="position-relative p-3"
                                onDragOver={(e) => e.preventDefault()}
                                onDrop={(e) => this.handleDrop(e)}
                                onDragEnter={(e) => this.handleDragEnter(e)}
                                onDragLeave={(e) => this.handleDragLeave(e)}
                            >
                                {isAnswerAvailable === false ? (
                                    data[index].sub_question[
                                        this.state.currentSubQuestionIndex[
                                            index
                                        ]
                                    ].fill_in ? (
                                        <div
                                            id="drop-here"
                                            className="user-select-none"
                                            draggable={false}
                                        >
                                            Type your answer in the answer
                                            section
                                        </div>
                                    ) : (
                                        <div
                                            id="drop-here"
                                            className="user-select-none"
                                            draggable={false}
                                        >
                                            <i className="fas fa-arrows-alt mr-2"></i>{" "}
                                            Drop answer here...
                                        </div>
                                    )
                                ) : (
                                    <>
                                        {(section.answers || []).map(
                                            (data, index) => {
                                                return data.answers.length !==
                                                    0 ? (
                                                    <div
                                                        className={`card shadow-sm mb-2 ${
                                                            explanation.isAnswered ===
                                                            true
                                                                ? explanation
                                                                      .sub_question[
                                                                      index
                                                                  ].answer ===
                                                                  false
                                                                    ? "danger-bg"
                                                                    : "success-bg"
                                                                : "pinkrange-bg primary-text"
                                                        }`}
                                                        key={index}
                                                    >
                                                        <div
                                                            className="card-body small font-weight-bold-600 pt-3 pb-0"
                                                            dangerouslySetInnerHTML={{
                                                                __html: `<div class="mb-3">${data.answers[0]}</div>`,
                                                            }}
                                                        ></div>
                                                    </div>
                                                ) : (
                                                    ""
                                                );
                                            }
                                        )}
                                        {/* ----- Check button ----- */}
                                        {answerCount ===
                                        this.state.totalSubQuestion[index] ? (
                                            explanation.isAnswered === false ? (
                                                <div className="row mt-3">
                                                    <div className="col-md-4">
                                                        <button
                                                            className="btn btn-primary btn-block btn-sm shadow-none"
                                                            onClick={() => {
                                                                this.handleCheck(
                                                                    section,
                                                                    "type_2"
                                                                );
                                                            }}
                                                        >
                                                            Check
                                                        </button>
                                                    </div>
                                                </div>
                                            ) : (
                                                ""
                                            )
                                        ) : (
                                            ""
                                        )}
                                    </>
                                )}
                            </div>
                        </div>
                        {/* ---------- Sub question ---------- */}
                        <div className="col-md-6">
                            {/* ----- Explanation ----- */}
                            {Object.entries(explanation).lenght !== 0 ? (
                                explanation.isAnswered === true ? (
                                    <div
                                        className="card card-body bg-light position-relative"
                                        style={{
                                            minHeight: "250px",
                                        }}
                                    >
                                        <p className="font-weight-bold-600 mb-2">
                                            Explanation:
                                        </p>
                                        <p
                                            className="small"
                                            dangerouslySetInnerHTML={{
                                                __html: explanation.explanation,
                                            }}
                                        ></p>
                                        <div
                                            className="position-absolute"
                                            style={{ right: 0, top: "10px" }}
                                        >
                                            {(
                                                data[index].content.audio || []
                                            ).map((audio, audio_index) => {
                                                return audio.path !== "" ? (
                                                    <OverlayTrigger
                                                        trigger="click"
                                                        rootClose
                                                        key={`popover${audio_index}`}
                                                        placement="bottom"
                                                        overlay={
                                                            <Popover
                                                                id={`popover-positioned-bottom${audio_index}`}
                                                            >
                                                                {audio.title !==
                                                                "" ? (
                                                                    <Popover.Title>
                                                                        {
                                                                            audio.title
                                                                        }
                                                                    </Popover.Title>
                                                                ) : (
                                                                    ""
                                                                )}
                                                                <Popover.Content
                                                                    style={{
                                                                        overflow:
                                                                            "auto",
                                                                    }}
                                                                >
                                                                    <audio
                                                                        src={
                                                                            audio.path
                                                                        }
                                                                        autoPlay
                                                                        controls
                                                                        controlsList="nodownload"
                                                                    ></audio>
                                                                </Popover.Content>
                                                            </Popover>
                                                        }
                                                    >
                                                        <button
                                                            className="btn btn-primary btn-sm rounded-circle mr-2 shadow-none"
                                                            key={audio_index}
                                                        >
                                                            <i className="fas fa-volume-up buttton fa-sm"></i>
                                                        </button>
                                                    </OverlayTrigger>
                                                ) : (
                                                    ""
                                                );
                                            })}
                                        </div>
                                    </div>
                                ) : (
                                    /* ---------- Sub Question ---------- */
                                    <div className="d-flex align-items-start justify-content">
                                        <button className="btn secondary-bg btn-sm shadow-sm mr-1 mt-1 px-3 font-weight-bold-600 rounded-lg">
                                            {this.state.currentSubQuestionIndex[
                                                index
                                            ] + 1}
                                        </button>

                                        <div className="card w-100">
                                            <div className="card secondary-bg py-2 px-3 mb-2">
                                                <div
                                                    dangerouslySetInnerHTML={{
                                                        __html: data[index]
                                                            .sub_question[
                                                            this.state
                                                                .currentSubQuestionIndex[
                                                                index
                                                            ]
                                                        ].question,
                                                    }}
                                                    draggable={false}
                                                ></div>
                                            </div>
                                            {/* Multiple choice question */}
                                            {data[index].sub_question[
                                                this.state
                                                    .currentSubQuestionIndex[
                                                    index
                                                ]
                                            ].mcq
                                                ? (
                                                      data[index].sub_question[
                                                          this.state
                                                              .currentSubQuestionIndex[
                                                              index
                                                          ]
                                                      ].options || []
                                                  ).map(
                                                      (
                                                          options,
                                                          option_index
                                                      ) => {
                                                          return (
                                                              <div
                                                                  className="card shadow-sm mb-2 light-bg"
                                                                  key={
                                                                      option_index
                                                                  }
                                                                  id={`option-${option_index}`}
                                                                  style={{
                                                                      cursor: "move",
                                                                  }}
                                                                  onDragStart={(
                                                                      e
                                                                  ) =>
                                                                      this.handleDragStart(
                                                                          e,
                                                                          options.content,
                                                                          index
                                                                      )
                                                                  }
                                                                  onDragEnd={(
                                                                      e
                                                                  ) =>
                                                                      this.handleDragEnd(
                                                                          e
                                                                      )
                                                                  }
                                                                  draggable
                                                              >
                                                                  <div
                                                                      className="card-body small font-weight-bold-600 primary-text pt-3 pb-0"
                                                                      dangerouslySetInnerHTML={{
                                                                          __html: `<div class="mb-3">${options.content}</div>`,
                                                                      }}
                                                                  ></div>
                                                              </div>
                                                          );
                                                      }
                                                  )
                                                : ""}
                                            {/* Fill in the blanks */}
                                            {data[index].sub_question[
                                                this.state
                                                    .currentSubQuestionIndex[
                                                    index
                                                ]
                                            ].fill_in ? (
                                                <input
                                                    type="text"
                                                    name="fill_in"
                                                    className="form-control borders"
                                                    placeholder="Type your answer here"
                                                    value={
                                                        section.length !== 0
                                                            ? section.answers
                                                                  .length !== 0
                                                                ? section
                                                                      .answers[
                                                                      this.state
                                                                          .currentSubQuestionIndex[
                                                                          index
                                                                      ]
                                                                  ]
                                                                      .answers[0] ||
                                                                  ""
                                                                : ""
                                                            : ""
                                                    }
                                                    onChange={(event) =>
                                                        this.handleFillin(
                                                            event,
                                                            index,
                                                            "type_2"
                                                        )
                                                    }
                                                    autoComplete="off"
                                                />
                                            ) : (
                                                ""
                                            )}
                                            <div className="d-flex align-items-center justify-content-center mt-3">
                                                <button
                                                    className="btn btn-sm primary-text shadow-none"
                                                    onClick={() =>
                                                        this.handleSubQPrev(
                                                            index
                                                        )
                                                    }
                                                    disabled={
                                                        this.state
                                                            .currentSubQuestionIndex[
                                                            index
                                                        ] === 0
                                                            ? true
                                                            : false
                                                    }
                                                >
                                                    <i className="fas fa-arrow-circle-left fa-lg"></i>
                                                </button>
                                                <div className="border-primary small font-weight-bold-600 rounded-lg px-3 py-1 mx-3">
                                                    {this.state
                                                        .currentSubQuestionIndex[
                                                        index
                                                    ] + 1}{" "}
                                                    /{" "}
                                                    {
                                                        this.state
                                                            .totalSubQuestion[
                                                            index
                                                        ]
                                                    }
                                                </div>
                                                <button
                                                    className="btn btn-sm primary-text shadow-none"
                                                    onClick={() =>
                                                        this.handleSubQNext(
                                                            index
                                                        )
                                                    }
                                                    disabled={
                                                        this.state
                                                            .currentSubQuestionIndex[
                                                            index
                                                        ] +
                                                            1 <
                                                        this.state
                                                            .totalSubQuestion[
                                                            index
                                                        ]
                                                            ? false
                                                            : true
                                                    }
                                                >
                                                    <i className="fas fa-arrow-circle-right fa-lg"></i>
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                )
                            ) : (
                                ""
                            )}
                        </div>
                    </div>
                </div>
                {/* <!----- Image & Video viewer -----> */}
                {data[index] &&
                data[index].content &&
                data[index].content.images &&
                data[index].content.video ? (
                    data[index].content.images.length !== 0 ||
                    data[index].content.video.path !== "" ? (
                        <div className="ml-3">
                            {this.imageRender(data[index])}
                        </div>
                    ) : (
                        ""
                    )
                ) : (
                    ""
                )}
                {/* <!-- Image viewer ends here --> */}
            </div>
        );
    };

    // ---------- Post the options answers ----------

    handleCheck = async (data, type) => {
        this.setState({
            page_loading: true,
        });

        let explanation = [...this.state.explanation];

        if (type === "type_1") {
            await fetch(
                this.courseId
                    ? `${this.url}/student/sub/${this.subscriptionId}/course/${this.courseId}/chapter/${this.chapterId}/${this.topicNum}/type_one/`
                    : `${this.url}/student/subject/${this.subjectId}/chapter/${this.chapterId}/typeone/learn/`,
                {
                    method: "POST",
                    headers: this.headers,
                    body: JSON.stringify(data),
                }
            )
                .then((res) => res.json())
                .then((result) => {
                    if (result.sts === true) {
                        explanation[this.state.activeData].answer =
                            result.answer;
                        explanation[this.state.activeData].answers =
                            result.data.answers;
                        explanation[this.state.activeData].explanation =
                            result.data.explanation;
                        explanation[this.state.activeData].isAnswered = true;
                        this.setState({
                            page_loading: false,
                            explanation: explanation,
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
        } else if (type === "type_2") {
            await fetch(
                this.courseId
                    ? `${this.url}/student/sub/${this.subscriptionId}/course/${this.courseId}/chapter/${this.chapterId}/${this.topicNum}/type_two/`
                    : `${this.url}/student/subject/${this.subjectId}/chapter/${this.chapterId}/typetwo/learn/`,
                {
                    method: "POST",
                    headers: this.headers,
                    body: JSON.stringify(data),
                }
            )
                .then((res) => res.json())
                .then((result) => {
                    if (result.sts === true) {
                        explanation[this.state.activeData].explanation =
                            result.data.explanation;
                        explanation[this.state.activeData].isAnswered = true;
                        for (
                            let i = 0;
                            i < result.data.sub_question.length;
                            i++
                        ) {
                            explanation[this.state.activeData].sub_question[
                                i
                            ].answer = result.data.sub_question[i].answer;
                            // explanation[this.state.activeData].sub_question[
                            //     i
                            // ].answers =
                            //     result.data.sub_question[i].data.answers;
                        }
                        this.setState({
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
        }
        window.MathJax.typeset();
    };

    // ---------- loads subject information ----------

    componentDidMount = () => {
        if (this.state.activeTab === "concept") {
            this.loadConceptData();
        } else {
            this.loadPracticeData();
        }

        document.addEventListener("keydown", this.handleKeys);
    };

    componentWillUnmount = () => {
        document.removeEventListener("keydown", this.handleKeys);
    };

    // ---------- Navigation ----------

    handleKeys = (event) => {
        let keyCode = event.key;
        if (keyCode === "ArrowLeft") {
            if (this.state.activeData !== 0) this.handlePrev();
        } else if (keyCode === "ArrowRight") {
            if (this.state.activeData + 1 < this.state.totalItems)
                this.handleNext();
        }
    };

    handleFirstSlide = async () => {
        clearInterval(this.slideInterval);
        await this.setState({
            activeData: 0,
            isFlipped: false,
            seconds: 15,
        });
        window.MathJax.typeset();
    };

    handleLastSlide = async () => {
        clearInterval(this.slideInterval);
        await this.setState({
            activeData: this.state.totalItems - 1,
            isFlipped: false,
            seconds: 15,
        });
        window.MathJax.typeset();
    };

    handleNext = async () => {
        clearInterval(this.slideInterval);
        await this.setState({
            activeData: this.state.activeData + 1,
            isFlipped: false,
            seconds: 15,
        });
        window.MathJax.typeset();
    };

    handlePrev = async () => {
        clearInterval(this.slideInterval);
        await this.setState({
            activeData: this.state.activeData - 1,
            isFlipped: false,
            seconds: 15,
        });
        window.MathJax.typeset();
    };

    handleSubQPrev = async (main_index) => {
        let index = this.state.currentSubQuestionIndex;
        index[main_index] = index[main_index] - 1;
        await this.setState({
            currentSubQuestionIndex: index,
        });
        window.MathJax.typeset();
    };

    handleSubQNext = async (main_index) => {
        let index = this.state.currentSubQuestionIndex;
        index[main_index] = index[main_index] + 1;
        await this.setState({
            currentSubQuestionIndex: index,
        });
        window.MathJax.typeset();
    };

    // ---------- Image & Video ----------

    changeImage = (images, index) => {
        let imageArr = [];
        this.setState({
            selectedImageArray: [],
            imageStartIndex: 0,
        });
        for (let i = 0; i < images.length; i++) {
            imageArr.push({
                url: images[i].path,
                title: images[i].title,
            });
        }
        this.setState({
            selectedImageArray: imageArr,
            imageStartIndex: index,
            isLightBoxOpen: true,
        });
    };

    imageRender = (data) => {
        return (
            <>
                {data.content.images && data.content.images.length !== 0
                    ? data.content.images.map((images, index) => {
                          return images.path !== "" ? (
                              <div
                                  key={index}
                                  className="card preview-img-circle shadow-sm"
                                  style={{
                                      backgroundImage: `url(${images.path})`,
                                  }}
                                  onClick={(e) => {
                                      this.changeImage(
                                          data.content.images,
                                          index
                                      );
                                      e.stopPropagation();
                                      this.pauseSlideshow();
                                  }}
                              ></div>
                          ) : (
                              ""
                          );
                      })
                    : ""}
                {data.content.video.path !== "" ? (
                    <OverlayTrigger
                        key="top5"
                        placement="top"
                        overlay={<Tooltip id="tooltip4">Video</Tooltip>}
                    >
                        <button
                            className="btn btn-primary-invert btn-sm shadow-sm rounded-circle shadow-none mt-1"
                            onClick={(e) => {
                                this.toggleVideoModal(data.content.video);
                                e.stopPropagation();
                                this.pauseSlideshow();
                            }}
                        >
                            <i
                                className="fas fa-video fa-sm"
                                style={{
                                    marginLeft: "4px",
                                    marginRight: "1px",
                                    marginBottom: "7px",
                                    marginTop: "7px",
                                }}
                            ></i>
                        </button>
                    </OverlayTrigger>
                ) : (
                    ""
                )}
            </>
        );
    };

    toggleVideoModal = (data) => {
        this.setState({
            showVideoModal: !this.state.showVideoModal,
            selectedVideoData: data,
        });
    };

    // ---------- Slideshow ----------

    handleSlideShow = () => {
        if (this.state.isSlideshowPlaying) {
            this.pauseSlideshow();
        } else {
            this.playSlideshow();
        }
    };

    pauseSlideshow = async () => {
        clearInterval(this.slideInterval);
        await this.setState({
            isSlideshowPlaying: false,
        });
        window.MathJax.typeset();
    };

    playSlideshow = async () => {
        clearInterval(this.slideInterval);
        if (
            this.state.seconds === 0 &&
            this.state.activeData + 1 === this.state.totalItems
        ) {
            await this.setState({
                activeData: 0,
                seconds: 15,
                isFlipped: false,
            });
            this.slideInterval = setInterval(this.conceptCountDown, 1000);
        } else {
            this.slideInterval = setInterval(this.conceptCountDown, 1000);
        }
        this.setState({
            isSlideshowPlaying: true,
        });
        window.MathJax.typeset();
    };

    componentDidUpdate = async (prevProps, prevState) => {
        if (this.state.activeTab === "concept") {
            if (this.state.isSlideshowPlaying === true) {
                if (this.state.activeData !== prevState.activeData) {
                    this.slideInterval = setInterval(
                        this.conceptCountDown,
                        1000
                    );
                }
            }
        }
    };

    componentWillUnmount = () => {
        clearInterval(this.slideInterval);
    };

    nextSlide = async () => {
        await this.setState({
            activeData: this.state.activeData + 1,
            seconds: 15,
            isFlipped: false,
        });
        window.MathJax.typeset();
    };

    conceptCountDown = () => {
        let seconds = this.state.seconds - 1;
        this.setState({
            seconds: seconds,
        });

        if (seconds === 10) {
            this.setState({
                isFlipped: true,
            });
        } else if (seconds === 0) {
            if (this.state.activeData + 1 === this.state.totalItems) {
                clearInterval(this.slideInterval);
                this.setState({
                    isSlideshowPlaying: false,
                });
            } else {
                clearInterval(this.slideInterval);
                this.nextSlide();
            }
        }
    };

    render() {
        document.title = `${this.props.chapter_name} : learn - Student | IQLabs`;
        let data = this.state.data || [];
        const section =
            this.state.sections[this.state.activeData] !== undefined
                ? this.state.sections[this.state.activeData]
                : [];
        const explanation =
            this.state.explanation[this.state.activeData] !== undefined
                ? this.state.explanation[this.state.activeData]
                : [];
        const index = this.state.activeData;
        const total = this.state.totalItems;
        return (
            <>
                {/* ----- Navbar ----- */}
                <Header
                    name={this.props.subject_name}
                    chapter_name={`${this.props.chapter_name} - ${this.props.topic_name}`}
                    goBack={this.props.history.goBack}
                />

                {/* ----- Alert message ----- */}
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

                {/* ----- Video modal ----- */}
                {this.state.showVideoModal ? (
                    <VideoModal
                        show={this.state.showVideoModal}
                        onHide={this.toggleVideoModal}
                        video={this.state.selectedVideoData}
                    />
                ) : (
                    ""
                )}

                {/* ----- Image lightbox ----- */}
                {this.state.isLightBoxOpen ? (
                    <Lightbox
                        images={this.state.selectedImageArray}
                        startIndex={this.state.imageStartIndex}
                        onClose={() => {
                            this.setState({
                                isLightBoxOpen: false,
                            });
                        }}
                    />
                ) : (
                    ""
                )}

                <ErrorBoundary
                    FallbackComponent={ErrorFallback}
                    onReset={() => window.location.reload()}
                >
                    {/* ---------- Header tab section ---------- */}

                    <div className="light-bg p-3 mt-1 mb-3">
                        <div className="row justify-content-center">
                            <div className="col-md-11">
                                <div className="row align-items-center">
                                    <div className="col-md-6">
                                        <div className="font-weight-bold-600 primary-text">
                                            {this.state.activeTab === "concept"
                                                ? "Concept"
                                                : "Practice"}
                                        </div>
                                    </div>
                                    <div className="col-md-6 text-right">
                                        {this.state.activeTab === "concept"
                                            ? data[index] && data[index].content
                                                ? (
                                                      data[index].content
                                                          .audio || []
                                                  ).map(
                                                      (audio, audio_index) => {
                                                          return audio.path !==
                                                              "" ? (
                                                              <OverlayTrigger
                                                                  trigger="click"
                                                                  rootClose
                                                                  key={`popover${audio_index}`}
                                                                  placement="bottom"
                                                                  overlay={
                                                                      <Popover
                                                                          id={`popover-positioned-bottom${audio_index}`}
                                                                      >
                                                                          {audio.title !==
                                                                          "" ? (
                                                                              <Popover.Title>
                                                                                  {
                                                                                      audio.title
                                                                                  }
                                                                              </Popover.Title>
                                                                          ) : (
                                                                              ""
                                                                          )}
                                                                          <Popover.Content
                                                                              style={{
                                                                                  overflow:
                                                                                      "auto",
                                                                              }}
                                                                          >
                                                                              <audio
                                                                                  src={
                                                                                      audio.path
                                                                                  }
                                                                                  controls
                                                                                  autoPlay
                                                                                  controlsList="nodownload"
                                                                              ></audio>
                                                                          </Popover.Content>
                                                                      </Popover>
                                                                  }
                                                              >
                                                                  <button
                                                                      className="btn btn-primary btn-sm rounded-circle mr-3 shadow-none"
                                                                      onClick={
                                                                          this
                                                                              .pauseSlideshow
                                                                      }
                                                                      key={
                                                                          audio_index
                                                                      }
                                                                  >
                                                                      <i className="fas fa-volume-up buttton fa-sm"></i>
                                                                  </button>
                                                              </OverlayTrigger>
                                                          ) : (
                                                              ""
                                                          );
                                                      }
                                                  )
                                                : ""
                                            : ""}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* ---------- Main content ---------- */}

                    <div className="container user-select-none mb-3">
                        {this.state.activeTab === "concept" ? (
                            data[index] !== undefined &&
                            data[index].content !== undefined ? (
                                this.conceptRender(data, index)
                            ) : (
                                <div
                                    className="card card-body shadow-sm align-items-center justify-content-center font-weight-bold-600"
                                    style={{
                                        minHeight: "70vh",
                                    }}
                                >
                                    No content to display
                                </div>
                            )
                        ) : this.state.activeTab === "practice" ? (
                            data[index] !== undefined &&
                            data[index].content !== undefined ? (
                                this.practiceRender(
                                    data,
                                    index,
                                    section,
                                    explanation
                                )
                            ) : (
                                <div
                                    className="card card-body shadow-sm align-items-center justify-content-center font-weight-bold-600"
                                    style={{
                                        minHeight: "70vh",
                                    }}
                                >
                                    No content to display
                                </div>
                            )
                        ) : (
                            ""
                        )}
                    </div>

                    {/* ---------- Footer ---------- */}

                    <div className="secondary-bg p-3">
                        <div className="row align-items-center justify-content-center">
                            <div className="col-md-11">
                                <div className="row align-items-center">
                                    <div className="col-md-4"></div>

                                    {/* ---------- Pagination ---------- */}

                                    <div className="col-md-4 d-flex align-items-center justify-content-center small">
                                        {/* ----- Previous page button ----- */}

                                        {index === 0 ? (
                                            <button
                                                className="btn btn-link btn-sm mr-2 shadow-none"
                                                disabled
                                            >
                                                <i className="fas fa-angle-double-left fa-lg"></i>
                                            </button>
                                        ) : (
                                            <OverlayTrigger
                                                key="top1"
                                                placement="top"
                                                overlay={
                                                    <Tooltip id="tooltip1">
                                                        First slide
                                                    </Tooltip>
                                                }
                                            >
                                                <button
                                                    className="btn btn-link btn-sm mr-2 shadow-none"
                                                    onClick={
                                                        this.handleFirstSlide
                                                    }
                                                    disabled={
                                                        index === 0
                                                            ? true
                                                            : false
                                                    }
                                                >
                                                    <i className="fas fa-angle-double-left fa-lg"></i>
                                                </button>
                                            </OverlayTrigger>
                                        )}

                                        {/* ----- Previous slide button ----- */}

                                        {index === 0 ? (
                                            <button
                                                className="btn btn-link btn-sm mr-2 shadow-none"
                                                disabled
                                            >
                                                <i className="fas fa-chevron-left"></i>
                                            </button>
                                        ) : (
                                            <OverlayTrigger
                                                key="top2"
                                                placement="top"
                                                overlay={
                                                    <Tooltip id="tooltip2">
                                                        Previous slide
                                                    </Tooltip>
                                                }
                                            >
                                                <button
                                                    className="btn btn-link btn-sm mr-2 shadow-none"
                                                    onClick={() =>
                                                        this.handlePrev(
                                                            data,
                                                            index
                                                        )
                                                    }
                                                    disabled={
                                                        index === 0
                                                            ? true
                                                            : false
                                                    }
                                                >
                                                    <i className="fas fa-chevron-left"></i>
                                                </button>
                                            </OverlayTrigger>
                                        )}

                                        {/* ----- Pagination number ----- */}

                                        <div
                                            className="d-inline border-primary primary-text font-weight-bold-600 rounded-lg"
                                            style={{
                                                padding: "5px 10px",
                                            }}
                                        >
                                            <span className="mr-1">
                                                {total !== 0
                                                    ? index <= 9
                                                        ? `0${index + 1}`
                                                        : index + 1
                                                    : 0}
                                            </span>
                                            <span>/</span>
                                            <span className="ml-1">
                                                {total <= 9
                                                    ? `0${total}`
                                                    : total}
                                            </span>
                                        </div>

                                        {/* ----- Next slide button ----- */}

                                        {index + 1 < total ? (
                                            <OverlayTrigger
                                                key="top3"
                                                placement="top"
                                                overlay={
                                                    <Tooltip id="tooltip3">
                                                        Next slide
                                                    </Tooltip>
                                                }
                                            >
                                                <button
                                                    className="btn btn-link btn-sm ml-2 shadow-none"
                                                    onClick={() =>
                                                        this.handleNext(
                                                            data,
                                                            index
                                                        )
                                                    }
                                                    disabled={
                                                        index + 1 < total
                                                            ? false
                                                            : true
                                                    }
                                                >
                                                    <i className="fas fa-chevron-right"></i>
                                                </button>
                                            </OverlayTrigger>
                                        ) : (
                                            <button
                                                className="btn btn-link btn-sm ml-2 shadow-none"
                                                disabled
                                            >
                                                <i className="fas fa-chevron-right"></i>
                                            </button>
                                        )}

                                        {/* ----- Next page button ----- */}

                                        {index + 1 >= total ? (
                                            <button
                                                className="btn btn-link btn-sm ml-2 shadow-none"
                                                disabled
                                            >
                                                <i className="fas fa-angle-double-right fa-lg"></i>
                                            </button>
                                        ) : (
                                            <OverlayTrigger
                                                key="top4"
                                                placement="top"
                                                overlay={
                                                    <Tooltip id="tooltip4">
                                                        Last slide
                                                    </Tooltip>
                                                }
                                            >
                                                <button
                                                    className="btn btn-link btn-sm ml-2 shadow-none"
                                                    onClick={
                                                        this.handleLastSlide
                                                    }
                                                    disabled={
                                                        index + 1 >= total
                                                            ? true
                                                            : false
                                                    }
                                                >
                                                    <i className="fas fa-angle-double-right fa-lg"></i>
                                                </button>
                                            </OverlayTrigger>
                                        )}
                                    </div>

                                    {/* ---------- Slideshow button ---------- */}

                                    {this.state.activeTab === "concept" ? (
                                        <div className="col-md-4 text-right">
                                            <OverlayTrigger
                                                key="top5"
                                                placement="top"
                                                overlay={
                                                    <Tooltip id="tooltip4">
                                                        {this.state
                                                            .isSlideshowPlaying
                                                            ? "Pause"
                                                            : "Play"}{" "}
                                                        slideshow
                                                    </Tooltip>
                                                }
                                            >
                                                <button
                                                    className="btn btn-primary btn-sm rounded-circle shadow-none"
                                                    onClick={
                                                        this.handleSlideShow
                                                    }
                                                >
                                                    <i
                                                        className={`fas ${
                                                            this.state
                                                                .isSlideshowPlaying
                                                                ? "fa-pause"
                                                                : "fa-play"
                                                        } fa-sm`}
                                                        style={{
                                                            marginLeft: "3px",
                                                            marginRight: "1px",
                                                            marginBottom: "5px",
                                                        }}
                                                    ></i>
                                                </button>
                                            </OverlayTrigger>
                                        </div>
                                    ) : (
                                        ""
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </ErrorBoundary>

                {/* Loading component */}
                {this.state.page_loading ? <Loading /> : ""}
            </>
        );
    }
}

export default connect(mapStateToProps)(FavouritesFlashcard);
