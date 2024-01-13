import React, { Component } from "react";
import Wrapper from "../wrapper";
import {
    Card,
    Accordion,
    Modal,
    Dropdown,
    OverlayTrigger,
    Tooltip,
} from "react-bootstrap";
import { Link } from "react-router-dom";
import { batch, connect } from "react-redux";
import { baseUrl, studentUrl } from "../../../shared/baseUrl";
import Loading from "../../common/loader";
import AlertBox from "../../common/alert";
import storeDispatch from "../../../redux/dispatch";
import {
    ACTIVE_STATE,
    CHAPTER,
    CYCLE,
    QUIZ,
    RESPONSE,
    SEMESTER,
    SIMULATION,
    TEMP,
    TOPIC,
} from "../../../redux/action";
import FeedbackModal from "../shared/feedbackModal";
import NumericConversion from "../../common/function/NumericConversion";

const mapStateToProps = (state) => ({
    course_name: state.content.course_name,
    exam_state: state.application.exam_state,
    active_state: state.application.active_state,
});

function Lock(props) {
    return (
        <OverlayTrigger
            key="top"
            placement="top"
            overlay={
                <Tooltip id="tooltip">
                    {props.message
                        ? props.message
                        : "Complete the topics to unlock the test"}
                </Tooltip>
            }
        >
            <button className="btn btn-sm primary-text shadow-none">
                <i className="fas fa-lock"></i>
            </button>
        </OverlayTrigger>
    );
}

function substring_topic_num(topic) {
    let topic_num = topic.toString();
    let dot_index = 0;

    for (var i = 0; i < topic_num.length; i++) {
        if (topic_num[i] === ".") {
            dot_index = i;
            break;
        }
    }

    return topic_num.substring(dot_index + 1);
}

const CourseDetail = (props) => {
    return (
        <Modal
            show={props.show}
            onHide={props.onHide}
            size="lg"
            aria-labelledby="contained-modal-title-vcenter"
            centered
            scrollable
        >
            <Modal.Header closeButton>Course Detail</Modal.Header>
            <Modal.Body>
                <div style={{ minHeight: "50vh" }}>
                    {props.data.content !== "" ? (
                        <>
                            <div className="h5 font-weight-bold-600 mb-3">
                                {props.data.title}
                            </div>
                            <div
                                dangerouslySetInnerHTML={{
                                    __html: props.data.content,
                                }}
                            ></div>
                        </>
                    ) : (
                        "No content to display..."
                    )}
                </div>
            </Modal.Body>
            <Modal.Footer className="text-right">
                <button
                    className="btn btn-link btn-sm shadow-none"
                    onClick={props.onHide}
                >
                    Close
                </button>
            </Modal.Footer>
        </Modal>
    );
};

const QuickPass = (props) => {
    return (
        <Modal
            show={props.show}
            onHide={props.onHide}
            size="lg"
            aria-labelledby="contained-modal-title-vcenter"
            centered
            scrollable
        >
            <Modal.Header closeButton>Quick Pass Tips</Modal.Header>
            <Modal.Body>
                <div style={{ minHeight: "50vh" }}>
                    {props.data.content !== "" ? (
                        <>
                            <div className="h5 font-weight-bold-600 mb-3">
                                {props.data.title}
                            </div>
                            <div
                                dangerouslySetInnerHTML={{
                                    __html: props.data.content,
                                }}
                            ></div>
                        </>
                    ) : (
                        "No content to display..."
                    )}
                </div>
            </Modal.Body>
            <Modal.Footer className="text-right">
                <button
                    className="btn btn-link btn-sm shadow-none"
                    onClick={props.onHide}
                >
                    Close
                </button>
            </Modal.Footer>
        </Modal>
    );
};

const UnitListRender = (props) => {
    return (
        <>
            {props.data.units
                ? props.data.units.length !== 0
                    ? props.data.units.map((unit, unit_index) => {
                          return (
                              <fieldset
                                  className="primary-fieldset mb-3"
                                  key={unit_index}
                              >
                                  <legend className="outline">
                                      {unit.unit_name}
                                  </legend>

                                  {/* ----- Chapter list ----- */}
                                  {(unit.chapters || []).map(
                                      (chapter, chapter_index) => {
                                          return (
                                              <Accordion
                                                  key={chapter_index}
                                                  activeKey={props.chapterEventKey[
                                                      unit_index
                                                  ].find(
                                                      (element) =>
                                                          element ===
                                                          chapter.chapter_id
                                                  )}
                                              >
                                                  <ChapterListRender
                                                      {...props}
                                                      chapter={chapter}
                                                      chapter_index={
                                                          chapter_index
                                                      }
                                                      unit_index={unit_index}
                                                  />
                                              </Accordion>
                                          );
                                      }
                                  )}

                                  {/* ----- Semester list ----- */}
                                  {unit.semesters
                                      ? unit.semesters.map(
                                            (semester, semester_index) => {
                                                return (
                                                    <div
                                                        className="card card-header pinkrange-bg primary-text shadow-sm mb-2"
                                                        key={semester_index}
                                                    >
                                                        <div className="row align-items-center">
                                                            <div className="col-5">
                                                                <p className="small font-weight-bold-600 mb-0">
                                                                    {
                                                                        semester.semester_name
                                                                    }
                                                                </p>
                                                            </div>
                                                            <div className="col-7 small font-weight-bold-600">
                                                                <div className="row align-items-center">
                                                                    <div className="col-2"></div>
                                                                    <div className="col-2"></div>
                                                                    <div className="col-2"></div>
                                                                    <div className="col-2">
                                                                        {semester.remarks &&
                                                                        semester.color ? (
                                                                            <div
                                                                                className="text-white text-center p-2 rounded"
                                                                                style={{
                                                                                    backgroundColor:
                                                                                        semester.color,
                                                                                    textTransform:
                                                                                        "capitalize",
                                                                                }}
                                                                            >
                                                                                {
                                                                                    semester.remarks
                                                                                }
                                                                            </div>
                                                                        ) : (
                                                                            ""
                                                                        )}
                                                                    </div>
                                                                    <div className="col-2"></div>
                                                                    <div className="col-2 text-right">
                                                                        {semester.chapters_completed ===
                                                                        true ? (
                                                                            // check if the exam has been started
                                                                            props
                                                                                .exam_state
                                                                                .examStarted ===
                                                                            true ? (
                                                                                // check if the current exam id is same as this exam
                                                                                props
                                                                                    .exam_state
                                                                                    .id ===
                                                                                semester.semester_id ? (
                                                                                    <Link
                                                                                        to={`${props.match.url}/semester/${semester.semester_id}`}
                                                                                    >
                                                                                        <button
                                                                                            className="btn btn-primary btn-sm shadow-none"
                                                                                            onClick={() => {
                                                                                                storeDispatch(
                                                                                                    SEMESTER,
                                                                                                    semester.semester_name
                                                                                                );
                                                                                            }}
                                                                                        >
                                                                                            View
                                                                                        </button>
                                                                                    </Link>
                                                                                ) : (
                                                                                    // if not then display the error message in tooltip
                                                                                    <Lock message="Submit the exam to continue..." />
                                                                                )
                                                                            ) : (
                                                                                <Link
                                                                                    to={`${props.match.url}/semester/${semester.semester_id}`}
                                                                                >
                                                                                    <button
                                                                                        className="btn btn-primary btn-sm shadow-none"
                                                                                        onClick={() => {
                                                                                            storeDispatch(
                                                                                                SEMESTER,
                                                                                                semester.semester_name
                                                                                            );
                                                                                        }}
                                                                                    >
                                                                                        View
                                                                                    </button>
                                                                                </Link>
                                                                            )
                                                                        ) : (
                                                                            <Lock />
                                                                        )}
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                );
                                            }
                                        )
                                      : null}
                              </fieldset>
                          );
                      })
                    : null
                : null}

            {/* ----- Simulation list ----- */}
            {props.data.simulation_exam ? (
                props.data.simulation_exam.length !== 0 ? (
                    <div
                        style={{
                            border: "1.4px solid #621012",
                            padding: "10px",
                            borderRadius: "6px",
                        }}
                    >
                        {props.data.simulation_exam.map(
                            (simulation, simulation_index) => {
                                return (
                                    <div
                                        className={`card card-header pinkrange-bg primary-text shadow-sm ${
                                            props.data.simulation_exam
                                                .length ===
                                            simulation_index + 1
                                                ? ""
                                                : "mb-2"
                                        }`}
                                        key={simulation_index}
                                    >
                                        <div className="row align-items-center">
                                            <div className="col-6">
                                                <p className="small font-weight-bold-600 mb-0">
                                                    {simulation.simulation_name}
                                                </p>
                                            </div>
                                            <div className="col-6 text-right">
                                                {
                                                    // check if the exam has been started
                                                    props.exam_state
                                                        .examStarted ===
                                                    true ? (
                                                        // check if the current exam id is same as this exam
                                                        props.exam_state.id ===
                                                        simulation.simulation_id ? (
                                                            <Link
                                                                to={`${props.match.url}/simulation/${simulation.simulation_id}`}
                                                            >
                                                                <button
                                                                    className="btn btn-primary btn-sm shadow-none"
                                                                    onClick={() => {
                                                                        storeDispatch(
                                                                            SIMULATION,
                                                                            simulation.simulation_name
                                                                        );
                                                                    }}
                                                                >
                                                                    View
                                                                </button>
                                                            </Link>
                                                        ) : (
                                                            // if not then display the error message in tooltip
                                                            <Lock message="Submit the exam to continue..." />
                                                        )
                                                    ) : (
                                                        // else display the view button
                                                        <Link
                                                            to={`${props.match.url}/simulation/${simulation.simulation_id}`}
                                                        >
                                                            <button
                                                                className="btn btn-primary btn-sm shadow-none"
                                                                onClick={() => {
                                                                    storeDispatch(
                                                                        SIMULATION,
                                                                        simulation.simulation_name
                                                                    );
                                                                }}
                                                            >
                                                                View
                                                            </button>
                                                        </Link>
                                                    )
                                                }
                                            </div>
                                        </div>
                                    </div>
                                );
                            }
                        )}
                    </div>
                ) : null
            ) : null}
        </>
    );
};

const ChapterListRender = (props) => {
    return (
        <Card className="mb-1">
            <Accordion.Toggle
                as={Card.Header}
                eventKey={props.chapter.chapter_id}
                className="pinkrange-bg primary-text shadow-sm mb-2"
                style={{
                    borderRadius: "8px",
                    cursor: "default",
                }}
                onClick={() =>
                    props.toggleChapterCollapse(
                        props.chapter.chapter_id,
                        props.unit_index
                    )
                }
            >
                <div className="row align-items-center">
                    <div className="col-5">
                        <div className="row align-items-center">
                            <div className="col-1">
                                <span>
                                    <i
                                        className={`fas fa-chevron-circle-down ${
                                            props.chapterEventKey[
                                                props.unit_index
                                            ].includes(props.chapter.chapter_id)
                                                ? ""
                                                : "fa-rotate-270"
                                        }`}
                                    ></i>
                                </span>
                            </div>
                            <div className="col-11 d-flex small font-weight-bold-600 pl-1">
                                <div className="mr-3">
                                    {props.chapter_index + 1}
                                </div>
                                <div className="w-100">
                                    {props.chapter.chapter_name}
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-7 small font-weight-bold-600">
                        <div className="row align-items-center justify-content-end">
                            <div className="col-2">
                                {props.chapter.weightage}
                            </div>
                            <div className="col-2">
                                {props.chapter.show_content ? (
                                    // check if the exam is started
                                    props.exam_state.examStarted === false ? (
                                        <Link
                                            to={`${props.match.url}/chapter/${props.chapter.chapter_id}/summary`}
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                storeDispatch(
                                                    CHAPTER,
                                                    props.chapter.chapter_name
                                                );
                                            }}
                                        >
                                            <button className="btn btn-light btn-sm shadow-none">
                                                <i className="fas fa-eye fa-sm"></i>
                                            </button>
                                        </Link>
                                    ) : (
                                        <button
                                            className="btn btn-light btn-sm shadow-none"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                            }}
                                            disabled
                                        >
                                            <i className="fas fa-eye fa-sm"></i>
                                        </button>
                                    )
                                ) : (
                                    <button
                                        className="btn btn-light btn-sm shadow-none"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                        }}
                                        disabled
                                    >
                                        <i className="fas fa-eye fa-sm"></i>
                                    </button>
                                )}
                            </div>
                            <div className="col-2">
                                {props.chapter.show_content ? (
                                    // check if the exam is started
                                    props.exam_state.examStarted === false ? (
                                        <Link
                                            to={`${props.match.url}/chapter/${props.chapter.chapter_id}/notes`}
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                storeDispatch(
                                                    CHAPTER,
                                                    props.chapter.chapter_name
                                                );
                                            }}
                                        >
                                            <button className="btn btn-light btn-sm shadow-none">
                                                <i className="fas fa-eye fa-sm"></i>
                                            </button>
                                        </Link>
                                    ) : (
                                        <button
                                            className="btn btn-light btn-sm shadow-none"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                            }}
                                            disabled
                                        >
                                            <i className="fas fa-eye fa-sm"></i>
                                        </button>
                                    )
                                ) : (
                                    <button
                                        className="btn btn-light btn-sm shadow-none"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                        }}
                                        disabled
                                    >
                                        <i className="fas fa-eye fa-sm"></i>
                                    </button>
                                )}
                            </div>
                            <div className="col-2">
                                {props.chapter_remarks[props.unit_index] ? (
                                    props.chapter_remarks[props.unit_index][
                                        props.chapter_index
                                    ] ? (
                                        props.chapter_remarks[props.unit_index][
                                            props.chapter_index
                                        ][props.chapter.chapter_id] ? (
                                            props.chapter_remarks[
                                                props.unit_index
                                            ][props.chapter_index][
                                                props.chapter.chapter_id
                                            ].remarks ? (
                                                <div
                                                    className="text-white text-center p-2 rounded"
                                                    style={{
                                                        backgroundColor:
                                                            props
                                                                .chapter_remarks[
                                                                props.unit_index
                                                            ][
                                                                props
                                                                    .chapter_index
                                                            ][
                                                                props.chapter
                                                                    .chapter_id
                                                            ].color,
                                                        textTransform:
                                                            "capitalize",
                                                    }}
                                                >
                                                    {
                                                        props.chapter_remarks[
                                                            props.unit_index
                                                        ][props.chapter_index][
                                                            props.chapter
                                                                .chapter_id
                                                        ].remarks
                                                    }
                                                </div>
                                            ) : (
                                                ""
                                            )
                                        ) : null
                                    ) : null
                                ) : null}
                            </div>
                            <div className="col-2"></div>
                            <div className="col-2 text-right">
                                <button
                                    className={`btn btn-sm shadow-none ${
                                        props.topics.length !== 0 &&
                                        props.topics_completed.length !== 0
                                            ? props.topics_completed.length ===
                                              props.data.units.length
                                                ? props.topics[
                                                      props.unit_index
                                                  ][props.chapter_index] &&
                                                  props.topics_completed[
                                                      props.unit_index
                                                  ][props.chapter_index]
                                                    ? props.topics[
                                                          props.unit_index
                                                      ][props.chapter_index]
                                                          .length ===
                                                      props.topics_completed[
                                                          props.unit_index
                                                      ][props.chapter_index]
                                                          .length
                                                        ? "text-success"
                                                        : "text-muted"
                                                    : "text-muted"
                                                : "text-muted"
                                            : "text-muted"
                                    }`}
                                    style={{
                                        fontSize: "18px",
                                    }}
                                    onClick={(event) => {
                                        props.handleAllTopicCompletion(
                                            props.unit_index,
                                            props.chapter_index,
                                            props.chapter.chapter_id
                                        );
                                        event.stopPropagation();
                                    }}
                                >
                                    <i className="fas fa-check-circle"></i>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </Accordion.Toggle>

            <Accordion.Collapse eventKey={props.chapter.chapter_id}>
                <>
                    {/* ----- Topic list ----- */}
                    {props.chapter.topics
                        ? props.chapter.topics.map((topics, topic_index) => {
                              return (
                                  <Accordion
                                      key={topic_index}
                                      activeKey={props.topicEventKey[
                                          props.unit_index
                                      ][props.chapter_index].find(
                                          (element) =>
                                              element ===
                                              `${
                                                  props.chapter.chapter_index
                                              }.${substring_topic_num(
                                                  topics.topic_num
                                              )}`
                                      )}
                                  >
                                      <TopicListRender
                                          {...props}
                                          topics={topics}
                                          topic_index={topic_index}
                                      />
                                  </Accordion>
                              );
                          })
                        : null}

                    {/* ----- Cycle test list ----- */}
                    {props.chapter.cycle_tests
                        ? props.chapter.cycle_tests.map(
                              (cycle, cycle_index) => {
                                  return (
                                      <div
                                          className="card card-header light-bg primary-text shadow-sm mb-2"
                                          style={{
                                              paddingTop: "9px",
                                              paddingBottom: "9px",
                                          }}
                                          key={cycle_index}
                                      >
                                          <div className="row align-items-center">
                                              <div className="col-5">
                                                  <p className="small font-weight-bold-600 mb-0">
                                                      {cycle.cycle_test_name}
                                                  </p>
                                              </div>
                                              <div className="col-7 small font-weight-bold-600">
                                                  <div className="row align-items-center">
                                                      <div className="col-2"></div>
                                                      <div className="col-2"></div>
                                                      <div className="col-2"></div>
                                                      <div className="col-2">
                                                          {cycle.remarks &&
                                                          cycle.color ? (
                                                              <div
                                                                  className="text-white text-center p-2 rounded"
                                                                  style={{
                                                                      backgroundColor:
                                                                          cycle.color,
                                                                      textTransform:
                                                                          "capitalize",
                                                                  }}
                                                              >
                                                                  {
                                                                      cycle.remarks
                                                                  }
                                                              </div>
                                                          ) : (
                                                              ""
                                                          )}
                                                      </div>
                                                      <div className="col-2"></div>
                                                      <div className="col-2 text-right">
                                                          {props
                                                              .all_topics_completed[
                                                              props.unit_index
                                                          ] ? (
                                                              // Check if all the topics are completed
                                                              props
                                                                  .all_topics_completed[
                                                                  props
                                                                      .unit_index
                                                              ][
                                                                  props
                                                                      .chapter_index
                                                              ] === true ? (
                                                                  // check if the exam has been started
                                                                  props
                                                                      .exam_state
                                                                      .examStarted ===
                                                                  true ? (
                                                                      props
                                                                          .exam_state
                                                                          .id ===
                                                                      cycle.cycle_test_id ? (
                                                                          <Link
                                                                              to={`${props.match.url}/chapter/${props.chapter.chapter_id}/cycle/${cycle.cycle_test_id}`}
                                                                          >
                                                                              <button
                                                                                  className="btn btn-primary btn-sm shadow-none"
                                                                                  onClick={() => {
                                                                                      batch(
                                                                                          () => {
                                                                                              storeDispatch(
                                                                                                  CHAPTER,
                                                                                                  props
                                                                                                      .chapter
                                                                                                      .chapter_name
                                                                                              );
                                                                                              storeDispatch(
                                                                                                  CYCLE,
                                                                                                  cycle.cycle_test_name
                                                                                              );
                                                                                          }
                                                                                      );
                                                                                  }}
                                                                              >
                                                                                  View
                                                                              </button>
                                                                          </Link>
                                                                      ) : (
                                                                          // if not then display the error message in tooltip
                                                                          <Lock message="Submit the exam to continue..." />
                                                                      )
                                                                  ) : (
                                                                      <Link
                                                                          to={`${props.match.url}/chapter/${props.chapter.chapter_id}/cycle/${cycle.cycle_test_id}`}
                                                                      >
                                                                          <button
                                                                              className="btn btn-primary btn-sm shadow-none"
                                                                              onClick={() => {
                                                                                  batch(
                                                                                      () => {
                                                                                          storeDispatch(
                                                                                              CHAPTER,
                                                                                              props
                                                                                                  .chapter
                                                                                                  .chapter_name
                                                                                          );
                                                                                          storeDispatch(
                                                                                              CYCLE,
                                                                                              cycle.cycle_test_name
                                                                                          );
                                                                                      }
                                                                                  );
                                                                              }}
                                                                          >
                                                                              View
                                                                          </button>
                                                                      </Link>
                                                                  )
                                                              ) : (
                                                                  // if not then display the error message in tooltip
                                                                  <Lock />
                                                              )
                                                          ) : (
                                                              // if not then display the error message in tooltip
                                                              <Lock />
                                                          )}
                                                      </div>
                                                  </div>
                                              </div>
                                          </div>
                                      </div>
                                  );
                              }
                          )
                        : null}

                    {/* ----- Quiz list ----- */}
                    {props.chapter.quiz
                        ? props.chapter.quiz.map((quiz, quiz_index) => {
                              return (
                                  <div
                                      className="card card-header light-bg primary-text shadow-sm mb-2"
                                      style={{
                                          paddingTop: "9px",
                                          paddingBottom: "9px",
                                      }}
                                      key={quiz_index}
                                  >
                                      <div className="row align-items-center">
                                          <div className="col-5">
                                              <p className="small font-weight-bold-600 mb-0">
                                                  {quiz.quiz_name}
                                              </p>
                                          </div>
                                          <div className="col-7">
                                              <div className="row align-items-center">
                                                  <div className="col-2"></div>
                                                  <div className="col-2"></div>
                                                  <div className="col-2"></div>
                                                  <div className="col-2 small font-weight-bold-600">
                                                      Points:{" "}
                                                      {NumericConversion(
                                                          props.chapter
                                                              .quiz_points
                                                      )}
                                                  </div>
                                                  <div className="col-2"></div>
                                                  <div className="col-2 text-right">
                                                      {
                                                          // check if the exam has been started
                                                          props.exam_state
                                                              .examStarted ===
                                                          true ? (
                                                              // if not then display the error message in tooltip
                                                              <Lock message="Submit the exam to continue..." />
                                                          ) : (
                                                              <Link
                                                                  to={`${props.match.url}/chapter/${props.chapter.chapter_id}/quiz/${quiz.quiz_id}`}
                                                              >
                                                                  <button
                                                                      className="btn btn-primary btn-sm shadow-none"
                                                                      onClick={() => {
                                                                          batch(
                                                                              () => {
                                                                                  storeDispatch(
                                                                                      CHAPTER,
                                                                                      props
                                                                                          .chapter
                                                                                          .chapter_name
                                                                                  );
                                                                                  storeDispatch(
                                                                                      QUIZ,
                                                                                      quiz.quiz_name
                                                                                  );
                                                                              }
                                                                          );
                                                                      }}
                                                                  >
                                                                      View
                                                                  </button>
                                                              </Link>
                                                          )
                                                      }
                                                  </div>
                                              </div>
                                          </div>
                                      </div>
                                  </div>
                              );
                          })
                        : null}
                </>
            </Accordion.Collapse>
        </Card>
    );
};

const TopicListRender = (props) => {
    const nestedTopics = (props.topics.child || []).map((topic, index) => {
        return (
            <Accordion
                key={index}
                activeKey={props.topicEventKey[props.unit_index][
                    props.chapter_index
                ].find(
                    (element) =>
                        element ===
                        `${props.chapter.chapter_index}.${substring_topic_num(
                            topic.topic_num
                        )}`
                )}
            >
                <TopicListRender
                    {...props}
                    topics={topic}
                    topic_index={index}
                />
            </Accordion>
        );
    });

    return (
        <>
            <Accordion.Toggle
                as={Card.Header}
                eventKey={`${props.chapter.chapter_index}.${substring_topic_num(
                    props.topics.topic_num
                )}`}
                className="light-bg primary-text shadow-sm mb-2"
                style={{
                    borderRadius: "8px",
                    paddingTop: "9px",
                    paddingBottom: "9px",
                }}
                onClick={() =>
                    props.topics.child.length !== 0
                        ? props.toggleTopicCollapse(
                              `${
                                  props.chapter.chapter_index
                              }.${substring_topic_num(props.topics.topic_num)}`,
                              props.unit_index,
                              props.chapter_index
                          )
                        : ""
                }
            >
                <div className="row align-items-center">
                    <div className="col-5">
                        <div className="row align-items-center">
                            <div className="col-1">
                                {props.topics.child.length !== 0 ? (
                                    <div>
                                        <i
                                            className={`fas fa-chevron-circle-down ${
                                                props.topicEventKey[
                                                    props.unit_index
                                                ][props.chapter_index].includes(
                                                    `${
                                                        props.chapter
                                                            .chapter_index
                                                    }.${substring_topic_num(
                                                        props.topics.topic_num
                                                    )}`
                                                )
                                                    ? "fa-rotate-360"
                                                    : "fa-rotate-270"
                                            }`}
                                        ></i>
                                    </div>
                                ) : (
                                    ""
                                )}
                            </div>
                            <div className="col-10 d-flex align-items-center small font-weight-bold-600 pl-1">
                                <div className="mr-3">
                                    {props.chapter.chapter_index}.
                                    {substring_topic_num(
                                        props.topics.topic_num
                                    )}
                                </div>
                                <div className="w-100">
                                    <button
                                        className="btn btn-light btn-sm shadow-none"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            props.handleCheckup(
                                                props.chapter.chapter_id,
                                                props.topics.topic_num
                                            );
                                            batch(() => {
                                                storeDispatch(
                                                    CHAPTER,
                                                    props.chapter.chapter_name
                                                );
                                                storeDispatch(
                                                    TOPIC,
                                                    props.topics.topic_name
                                                );
                                            });
                                        }}
                                        disabled={
                                            props.exam_state.examStarted ===
                                            true
                                                ? true
                                                : false
                                        }
                                    >
                                        {props.topics.topic_name}
                                        <i className="fas fa-external-link-alt fa-xs ml-2"></i>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="col-7 small primary-text font-weight-bold-600">
                        <div className="row align-items-center">
                            <div className="col-2"></div>
                            <div className="col-2"></div>
                            <div className="col-2"></div>
                            <div className="col-2">
                                {props.topics_remarks[props.unit_index] ? (
                                    props.topics_remarks[props.unit_index][
                                        props.chapter_index
                                    ] ? (
                                        props.topics_remarks[props.unit_index][
                                            props.chapter_index
                                        ][props.topics.topic_num] ? (
                                            props.topics_remarks[
                                                props.unit_index
                                            ][props.chapter_index][
                                                props.topics.topic_num
                                            ].remarks ? (
                                                <div
                                                    className="text-white text-center p-2 rounded"
                                                    style={{
                                                        backgroundColor:
                                                            props
                                                                .topics_remarks[
                                                                props.unit_index
                                                            ][
                                                                props
                                                                    .chapter_index
                                                            ][
                                                                props.topics
                                                                    .topic_num
                                                            ].color,
                                                        textTransform:
                                                            "capitalize",
                                                    }}
                                                >
                                                    {
                                                        props.topics_remarks[
                                                            props.unit_index
                                                        ][props.chapter_index][
                                                            props.topics
                                                                .topic_num
                                                        ].remarks
                                                    }
                                                </div>
                                            ) : (
                                                ""
                                            )
                                        ) : null
                                    ) : null
                                ) : null}
                            </div>
                            <div className="col-2 text-center">
                                {props.topics.next_topic ? (
                                    props.exam_state.examStarted === false ? (
                                        <OverlayTrigger
                                            key="next_topic"
                                            placement="top"
                                            overlay={
                                                <Tooltip id="tooltip">
                                                    {
                                                        props.topics
                                                            .next_topic_name
                                                    }
                                                </Tooltip>
                                            }
                                        >
                                            <button
                                                className="btn btn-light btn-sm shadow-none small"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    props.handleCheckup(
                                                        props.topics
                                                            .next_topic_chapter_id,
                                                        props.topics.next_topic
                                                    );
                                                    batch(() => {
                                                        storeDispatch(
                                                            CHAPTER,
                                                            props.chapter
                                                                .chapter_name
                                                        );
                                                        storeDispatch(
                                                            TOPIC,
                                                            props.topics
                                                                .next_topic_name
                                                        );
                                                    });
                                                }}
                                            >
                                                {props.topics.next_topic}
                                            </button>
                                        </OverlayTrigger>
                                    ) : (
                                        <OverlayTrigger
                                            key="next_topic"
                                            placement="top"
                                            overlay={
                                                <Tooltip id="tooltip">
                                                    {
                                                        props.topics
                                                            .next_topic_name
                                                    }
                                                </Tooltip>
                                            }
                                        >
                                            <button
                                                className="btn btn-light btn-sm shadow-none small"
                                                disabled
                                            >
                                                {props.topics.next_topic}
                                            </button>
                                        </OverlayTrigger>
                                    )
                                ) : (
                                    ""
                                )}
                            </div>
                            <div className="col-2 text-right">
                                <button
                                    className={`btn btn-sm shadow-none ${
                                        props.topics_completed[props.unit_index]
                                            ? props.topics_completed[
                                                  props.unit_index
                                              ][props.chapter_index]
                                                ? props.topics_completed[
                                                      props.unit_index
                                                  ][props.chapter_index]
                                                    ? props.topics_completed[
                                                          props.unit_index
                                                      ][
                                                          props.chapter_index
                                                      ].includes(
                                                          props.topics.topic_num
                                                      )
                                                        ? "text-success"
                                                        : "text-muted"
                                                    : "text-muted"
                                                : "text-muted"
                                            : "text-muted"
                                    }`}
                                    style={{
                                        fontSize: "18px",
                                    }}
                                    onClick={(event) => {
                                        props.handleTopicCompletion(
                                            props.topics.topic_num,
                                            props.topics.topic_name,
                                            props.unit_index,
                                            props.chapter_index,
                                            props.chapter.chapter_id
                                        );

                                        event.stopPropagation();
                                    }}
                                >
                                    <i className="fas fa-check-circle"></i>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </Accordion.Toggle>

            <Accordion.Collapse
                eventKey={`${props.chapter.chapter_index}.${substring_topic_num(
                    props.topics.topic_num
                )}`}
                className="ml-3"
            >
                <div>{nestedTopics}</div>
            </Accordion.Collapse>
        </>
    );
};

class Course extends Component {
    constructor(props) {
        super(props);
        this.state = {
            showModal: false,
            showFeedbackModal: false,
            type: "",
            selectedData: "",

            data: {},
            chapterEventKey: [],
            topicEventKey: [],

            topics: [],
            topics_completed: [],
            topics_remarks: [],
            chapter_remarks: [],
            all_topics_completed: [],

            certificate: {},
            show_content: false,

            errorMsg: "",
            successMsg: "",
            showErrorAlert: false,
            showSuccessAlert: false,
            page_loading: true,
        };
        this.url = baseUrl + studentUrl;
        this.authToken = localStorage.getItem("Authorization");
        this.headers = {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: this.authToken,
        };
        this.subscriptionId = this.props.match.params.subscriptionId;
        this.courseId = this.props.match.params.courseId;
    }

    componentDidMount = () => {
        document.title = `${this.props.course_name} - Student | IQLabs`;

        this.loadCourseData();
        this.loadCertificateDate();
    };

    loadCourseData = () => {
        fetch(
            `${this.url}/student/sub/${this.subscriptionId}/course/${this.courseId}/`,
            {
                method: "GET",
                headers: this.headers,
            }
        )
            .then((res) => res.json())
            .then((result) => {
                if (result.sts === true) {
                    let topics = [];
                    let chapterEventKey = [];
                    let topicEventKey = [];
                    let show_content = false;

                    // unit loop
                    if (result.data.units && result.data.units.length !== 0) {
                        result.data.units.forEach((data) => {
                            let temp = [];
                            let temp_topics = [];

                            // chapter loop
                            if (data.chapters && data.chapters.length !== 0) {
                                data.chapters.forEach((chapter) => {
                                    if (
                                        chapter.topics &&
                                        chapter.topics.lenght !== 0
                                    ) {
                                        // topic event key
                                        temp.push([]);

                                        // Extracting topics from the chapter_structure
                                        temp_topics.push(
                                            this.loopTopicStructure(
                                                chapter.topics
                                            )
                                        );
                                    }

                                    // certificate show_content
                                    if (chapter.show_content === true) {
                                        show_content = true;
                                    }

                                    // call the cycle reduction api on loop
                                    if (
                                        chapter.cycle_tests &&
                                        chapter.cycle_tests.length !== 0
                                    ) {
                                        // cycle loop
                                        chapter.cycle_tests.forEach((cycle) => {
                                            this.handleCycleTestReduction(
                                                chapter.chapter_id,
                                                cycle.cycle_test_id
                                            );
                                        });
                                    }
                                });
                            }

                            // semester loop
                            if (data.semesters && data.semesters.length !== 0) {
                                data.semesters.forEach((semester) => {
                                    // call the semester reduction api on loop
                                    this.handleSemesterReduction(
                                        semester.semester_id
                                    );
                                });
                            }
                            chapterEventKey.push([]);
                            topicEventKey.push(temp);
                            topics.push(temp_topics);
                        });
                    }

                    this.setState(
                        {
                            data: result.data,
                            chapterEventKey: chapterEventKey,
                            topicEventKey: topicEventKey,
                            topics: topics,
                            show_content: show_content,
                        },
                        () => {
                            // function to load completed topic list from API
                            this.loadTopicCompletedData();
                            if (this.props.active_state.id !== "") {
                                if (
                                    this.props.active_state.id === this.courseId
                                ) {
                                    this.setState({
                                        chapterEventKey:
                                            this.props.active_state.chapter_key,
                                        topicEventKey:
                                            this.props.active_state.topic_key,
                                    });
                                } else {
                                    storeDispatch(ACTIVE_STATE, {
                                        id: "",
                                        chapter_key: [],
                                        topic_key: [],
                                    });
                                }
                            }
                        }
                    );

                    // redux store dispatcher
                    batch(() => {
                        storeDispatch(RESPONSE, result.data);
                        storeDispatch(TEMP, {});
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
                    errorMsg: "Cannot show chapter structure at the moment!",
                    showErrorAlert: true,
                    page_loading: false,
                });
            });
    };

    // Loads topic completion data
    loadTopicCompletedData = () => {
        let topics_completed = [];
        let all_topics_completed = [];
        let topics_remarks = [];
        let chapter_remarks = [];

        if (this.state.data.units && this.state.data.units.length !== 0) {
            // unit loop
            this.state.data.units.forEach((data, unit_index) => {
                topics_completed.push([]);
                all_topics_completed.push([]);
                topics_remarks.push([]);
                chapter_remarks.push([]);

                if (data.chapters && data.chapters.length !== 0) {
                    // chapter loop
                    data.chapters.forEach((chapter, chapter_index) => {
                        fetch(
                            `${this.url}/student/sub/${this.subscriptionId}/course/${this.courseId}/chapter/${chapter.chapter_id}/topics/`,
                            {
                                method: "GET",
                                headers: this.headers,
                            }
                        )
                            .then((res) => res.json())
                            .then((result) => {
                                if (result.sts === true) {
                                    topics_completed[unit_index][
                                        chapter_index
                                    ] = result.data.topics_completed
                                        ? Array.isArray(
                                              result.data.topics_completed
                                          )
                                            ? result.data.topics_completed
                                            : []
                                        : [];

                                    all_topics_completed[unit_index][
                                        chapter_index
                                    ] = result.data.all_topics_completed
                                        ? result.data.all_topics_completed
                                        : "";

                                    topics_remarks[unit_index][chapter_index] =
                                        result.data.topics_remarks
                                            ? result.data.topics_remarks
                                            : "";

                                    chapter_remarks[unit_index][chapter_index] =
                                        result.data.chapter_remarks
                                            ? result.data.chapter_remarks
                                            : "";

                                    this.setState(
                                        {
                                            topics_completed: topics_completed,
                                            all_topics_completed:
                                                all_topics_completed,
                                            topics_remarks: topics_remarks,
                                            chapter_remarks: chapter_remarks,
                                        },
                                        () => {
                                            this.handleTopicStatus(result.data);
                                        }
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
                    });
                }
            });
        } else {
            this.setState({
                page_loading: false,
            });
        }
    };

    // Updating the completed topics data in topics state
    handleTopicStatus = (data) => {
        let topics = [...this.state.topics];
        let topics_completed = [...this.state.topics_completed];

        if (data && Object.keys(data).length !== 0) {
            for (let i = 0; i < topics.length; i++) {
                for (let j = 0; j < topics[i].length; j++) {
                    for (let k = 0; k < topics[i][j].length; k++) {
                        if (topics_completed[i][j]) {
                            if (
                                topics_completed[i][j].includes(
                                    topics[i][j][k].topic_num
                                )
                            ) {
                                topics[i][j][k].isCompleted = true;
                            }
                        }
                    }
                }
            }
        }

        this.setState({
            topics: topics,
            page_loading: false,
        });
    };

    // Flatten the chapter_structure array of objects
    loopTopicStructure = (array) => {
        var result = [];
        array.forEach((a) => {
            result.push({
                topic_num: a.topic_num,
                topic_name: a.topic_name,
                isCompleted: false,
            });
            if (Array.isArray(a.child)) {
                result = result.concat(this.loopTopicStructure(a.child));
            }
        });
        return result;
    };

    // handle content checkup
    handleCheckup = (chapter_id, topic_num) => {
        this.setState({
            page_loading: true,
        });
        fetch(
            `${this.url}/student/sub/${this.subscriptionId}/course/${this.courseId}/chapter/${chapter_id}/${topic_num}/`,
            {
                method: "GET",
                headers: this.headers,
            }
        )
            .then((res) => res.json())
            .then((result) => {
                if (result.sts === true) {
                    if (
                        result.data.concepts_exists === true ||
                        result.data.mcq_exists === true ||
                        result.data.type_two_exists === true ||
                        result.data.match_exists === true
                    ) {
                        storeDispatch(TEMP, result.data);
                        this.props.history.push(
                            `${this.props.match.url}/chapter/${chapter_id}/${topic_num}/learn`
                        );
                    } else {
                        this.setState({
                            errorMsg: "Selected node is a free folder",
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

    // Topic completion toggle
    handleTopicCompletion = (
        topic_num,
        topic_name,
        unit_index,
        chapter_index,
        chapter_id
    ) => {
        let topics = [...this.state.topics];
        let temp = {};

        for (let i = 0; i < topics[unit_index][chapter_index].length; i++) {
            if (
                topics[unit_index][chapter_index][i].topic_num === topic_num &&
                topics[unit_index][chapter_index][i].topic_name === topic_name
            ) {
                topics[unit_index][chapter_index][i].isCompleted =
                    !topics[unit_index][chapter_index][i].isCompleted;
            }
            temp[topics[unit_index][chapter_index][i].topic_num] =
                topics[unit_index][chapter_index][i].isCompleted;
        }

        this.handleTopicCompletionSubmit(temp, chapter_id);
    };

    // All topic completion toggle
    handleAllTopicCompletion = (unit_index, chapter_index, chapter_id) => {
        let topics = [...this.state.topics];
        let topics_completed = [...this.state.topics_completed];
        let temp = {};

        for (let i = 0; i < topics[unit_index][chapter_index].length; i++) {
            if (
                topics[unit_index][chapter_index].length ===
                topics_completed[unit_index][chapter_index].length
            ) {
                topics[unit_index][chapter_index][i].isCompleted = false;
            } else {
                topics[unit_index][chapter_index][i].isCompleted = true;
            }
            temp[topics[unit_index][chapter_index][i].topic_num] =
                topics[unit_index][chapter_index][i].isCompleted;
        }

        this.handleTopicCompletionSubmit(temp, chapter_id);
    };

    // Submit topic completion
    handleTopicCompletionSubmit = (data, chapter_id) => {
        this.setState({
            page_loading: true,
        });

        fetch(
            `${this.url}/student/sub/${this.subscriptionId}/course/${this.courseId}/chapter/${chapter_id}/topics/`,
            {
                method: "POST",
                headers: this.headers,
                body: JSON.stringify({ topic_num: data }),
            }
        )
            .then((res) => res.json())
            .then((result) => {
                if (result.sts === true) {
                    this.setState(
                        {
                            successMsg: "Topic completion updated",
                            showSuccessAlert: true,
                        },
                        () => {
                            this.loadCourseData();
                            this.loadCertificateDate();
                        }
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

    // handle chapter and topic collapse
    toggleChapterCollapse = (key, unit_index) => {
        let chapterEventKey = this.state.chapterEventKey;
        if (chapterEventKey.length !== 0 && chapterEventKey[unit_index]) {
            if (chapterEventKey[unit_index].includes(key)) {
                chapterEventKey[unit_index].splice(
                    chapterEventKey[unit_index].indexOf(key),
                    1
                );
            } else {
                chapterEventKey[unit_index].push(key);
            }
        }

        this.setState({
            chapterEventKey: chapterEventKey,
        });
        storeDispatch(ACTIVE_STATE, {
            id: this.courseId,
            chapter_key: chapterEventKey,
            topic_key: this.state.topicEventKey,
        });
    };

    toggleTopicCollapse = (key, unit_index, chapter_index) => {
        let topicEventKey = this.state.topicEventKey;
        if (
            topicEventKey.length !== 0 &&
            topicEventKey[unit_index] &&
            topicEventKey[unit_index][chapter_index]
        ) {
            if (topicEventKey[unit_index][chapter_index].includes(key)) {
                topicEventKey[unit_index][chapter_index].splice(
                    topicEventKey[unit_index][chapter_index].indexOf(key),
                    1
                );
            } else {
                topicEventKey[unit_index][chapter_index].push(key);
            }
        }

        this.setState({
            topicEventKey: topicEventKey,
        });
        storeDispatch(ACTIVE_STATE, {
            id: this.courseId,
            chapter_key: this.state.chapterEventKey,
            topic_key: topicEventKey,
        });
    };

    // Reduction API for cycle test
    handleCycleTestReduction = (chapter_id, cycle_test_id) => {
        fetch(
            `${this.url}/student/sub/${this.subscriptionId}/course/${this.courseId}/chapter/${chapter_id}/cycletest/${cycle_test_id}/reduce/`,
            {
                method: "GET",
                headers: this.headers,
            }
        )
            .then((res) => res.json())
            .then((result) => {})
            .catch((err) => {
                console.log(err);
            });
    };

    // Reduction API for semester
    handleSemesterReduction = (semester_id) => {
        fetch(
            `${this.url}/student/sub/${this.subscriptionId}/course/${this.courseId}/semester/${semester_id}/reduce/`,
            {
                method: "GET",
                headers: this.headers,
            }
        )
            .then((res) => res.json())
            .then((result) => {})
            .catch((err) => {
                console.log(err);
            });
    };

    // Certificate data
    loadCertificateDate = () => {
        fetch(
            `${this.url}/student/sub/${this.subscriptionId}/course/${this.courseId}/certificate/`,
            {
                method: "GET",
                headers: this.headers,
            }
        )
            .then((res) => res.json())
            .then((result) => {
                if (result.sts === true) {
                    this.setState({
                        certificate: result.data,
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
                    errorMsg: "There's a problem in loading certificate data",
                    showErrorAlert: true,
                });
            });
    };

    render() {
        const course_data = this.state.data;
        return (
            <Wrapper
                header={this.props.course_name}
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

                <FeedbackModal
                    show={this.state.showFeedbackModal}
                    onHide={() =>
                        this.setState({
                            showFeedbackModal: false,
                        })
                    }
                />

                {/* Course detail Modal */}
                {this.state.showModal && this.state.type === "detail" ? (
                    <CourseDetail
                        show={this.state.showModal}
                        onHide={() => {
                            this.setState({
                                showModal: false,
                            });
                        }}
                        data={course_data.course_detail}
                    />
                ) : (
                    ""
                )}

                {/* Quick pass Modal */}
                {this.state.showModal && this.state.type === "quickpass" ? (
                    <QuickPass
                        show={this.state.showModal}
                        onHide={() => {
                            this.setState({
                                showModal: false,
                            });
                        }}
                        data={course_data.quick_pass_tips}
                    />
                ) : (
                    ""
                )}

                <div className="row align-items-center mb-3">
                    <div className="col-md-6 col-10">
                        {/* Breadcrumb */}
                        <nav aria-label="breadcrumb">
                            <ol className="breadcrumb">
                                <li className="breadcrumb-item">
                                    <Link to="/hod">
                                        <i className="fas fa-home fa-sm"></i>
                                    </Link>
                                </li>
                                <li className="breadcrumb-item active">
                                    <span>Course:</span>
                                    {this.props.course_name}
                                </li>
                            </ol>
                        </nav>
                    </div>
                    <div className="col-md-6 col-2 d-flex justify-content-end">
                        {course_data.scored_quiz_points ? (
                            <div
                                className="border-primary primary-text small font-weight-bold-600 mr-1 rounded-sm d-none d-md-block"
                                style={{ padding: "5px 10px" }}
                            >
                                {`Quiz Points: ${NumericConversion(
                                    course_data.scored_quiz_points
                                )}`}
                            </div>
                        ) : null}
                        <Link
                            to={`${this.props.match.url}/personal-notes`}
                            className="d-none d-md-block"
                        >
                            <button
                                className="btn btn-primary btn-sm shadow-none mr-1"
                                disabled={
                                    course_data.units &&
                                    course_data.units.length !== 0
                                        ? this.props.exam_state.examStarted ===
                                          true
                                            ? true
                                            : false
                                        : true
                                }
                            >
                                Personal Notes
                            </button>
                        </Link>
                        <Link
                            to={`${this.props.match.url}/favourites`}
                            className="d-none d-md-block"
                        >
                            <button
                                className="btn btn-primary btn-sm shadow-none mr-1"
                                disabled={
                                    course_data.units &&
                                    course_data.units.length !== 0
                                        ? this.props.exam_state.examStarted ===
                                          true
                                            ? true
                                            : false
                                        : true
                                }
                            >
                                Favourites
                            </button>
                        </Link>
                        <Link
                            to={`${this.props.match.url}/results`}
                            className="d-none d-md-block"
                        >
                            <button
                                className="btn btn-primary btn-sm shadow-none mr-1"
                                disabled={
                                    course_data &&
                                    Object.keys(course_data).length !== 0
                                        ? this.props.exam_state.examStarted ===
                                          true
                                            ? true
                                            : false
                                        : true
                                }
                            >
                                Test Analysis
                            </button>
                        </Link>

                        {course_data.course_detail &&
                        course_data.quick_pass_tips ? (
                            <Dropdown
                                className={
                                    course_data.course_detail.content === "" &&
                                    course_data.quick_pass_tips.content === ""
                                        ? "d-md-none d-block"
                                        : ""
                                }
                            >
                                <Dropdown.Toggle
                                    variant="Secondary"
                                    className="btn btn-primary btn-sm shadow-none caret-off"
                                    disabled={
                                        this.props.exam_state.examStarted ===
                                        true
                                            ? true
                                            : false
                                    }
                                >
                                    <i className="fas fa-ellipsis-h"></i>
                                </Dropdown.Toggle>

                                <Dropdown.Menu className="dropdown-menu-down-btn dropdown-menu-down">
                                    {course_data.scored_quiz_points ? (
                                        <Dropdown.Item className="d-md-none d-block">
                                            {`Quiz Points: ${NumericConversion(
                                                course_data.scored_quiz_points
                                            )}`}
                                        </Dropdown.Item>
                                    ) : null}
                                    <Dropdown.Item
                                        as={Link}
                                        to={`${this.props.match.url}/personal-notes`}
                                        className="d-md-none d-block"
                                        disabled={
                                            course_data.units &&
                                            course_data.units.length !== 0
                                                ? false
                                                : true
                                        }
                                    >
                                        Personal Notes
                                    </Dropdown.Item>
                                    <Dropdown.Item
                                        as={Link}
                                        to={`${this.props.match.url}/favourites`}
                                        className="d-md-none d-block"
                                        disabled={
                                            course_data.units &&
                                            course_data.units.length !== 0
                                                ? false
                                                : true
                                        }
                                    >
                                        Favourites
                                    </Dropdown.Item>
                                    <Dropdown.Item
                                        as={Link}
                                        to={`${this.props.match.url}/results`}
                                        className="d-md-none d-block"
                                        disabled={
                                            course_data &&
                                            Object.keys(course_data).length !==
                                                0
                                                ? false
                                                : true
                                        }
                                    >
                                        Test Analysis
                                    </Dropdown.Item>
                                    {/* Course details and quick pass */}
                                    {course_data.course_detail.content !==
                                    "" ? (
                                        <Dropdown.Item
                                            onClick={() => {
                                                this.setState({
                                                    showModal: true,
                                                    type: "detail",
                                                });
                                            }}
                                        >
                                            Course Detail
                                        </Dropdown.Item>
                                    ) : null}
                                    {course_data.quick_pass_tips.content !==
                                    "" ? (
                                        <Dropdown.Item
                                            onClick={() => {
                                                this.setState({
                                                    showModal: true,
                                                    type: "quickpass",
                                                });
                                            }}
                                        >
                                            Quick Pass
                                        </Dropdown.Item>
                                    ) : null}
                                </Dropdown.Menu>
                            </Dropdown>
                        ) : null}
                    </div>
                </div>

                {/* Course details */}
                <div className="card shadow-sm overflow-auto mb-3">
                    <div style={{ minWidth: "1100px" }}>
                        <div className="card-header secondary-bg primary-text font-weight-bold">
                            <div className="row align-items-center">
                                <div className="col-5">Course Structure</div>
                                <div className="col-7 small primary-text font-weight-bold">
                                    <div className="row align-items-center">
                                        <div className="col-2">Weightage</div>
                                        <div className="col-2">Summary</div>
                                        <div className="col-2">Notes</div>
                                        <div className="col-2">Remarks</div>
                                        <div className="col-2">Next topic</div>
                                        <div className="col-2"></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="card-body p-3">
                            {/* ----- Unit list ----- */}
                            {course_data &&
                            Object.keys(course_data).length !== 0 ? (
                                <UnitListRender
                                    {...this.props}
                                    data={course_data}
                                    topics={this.state.topics}
                                    topics_completed={
                                        this.state.topics_completed
                                    }
                                    all_topics_completed={
                                        this.state.all_topics_completed
                                    }
                                    topics_remarks={this.state.topics_remarks}
                                    chapter_remarks={this.state.chapter_remarks}
                                    chapterEventKey={this.state.chapterEventKey}
                                    topicEventKey={this.state.topicEventKey}
                                    toggleChapterCollapse={
                                        this.toggleChapterCollapse
                                    }
                                    toggleTopicCollapse={
                                        this.toggleTopicCollapse
                                    }
                                    handleAllTopicCompletion={
                                        this.handleAllTopicCompletion
                                    }
                                    handleTopicCompletion={
                                        this.handleTopicCompletion
                                    }
                                    handleCheckup={this.handleCheckup}
                                />
                            ) : null}
                        </div>
                    </div>
                </div>

                {/* certificate and feedback button */}
                <div className="form-row align-items-center">
                    <div className="col-6">
                        {this.state.show_content === true &&
                        (this.state.certificate.course_completed === true ||
                            this.state.certificate.chapters_completed > 0) ? (
                            <Link to={`${this.props.match.url}/certificate`}>
                                <button className="btn btn-primary rounded-pill shadow-none">
                                    <i className="fas fa-certificate mr-1"></i>{" "}
                                    Certificate
                                </button>
                            </Link>
                        ) : null}
                    </div>
                    <div className="col-6 text-right">
                        <button
                            className="btn btn-primary rounded-pill shadow-none"
                            onClick={() =>
                                this.setState({
                                    showFeedbackModal: true,
                                })
                            }
                        >
                            <i className="far fa-comment-dots fa-lg mr-1"></i>{" "}
                            Feedback
                        </button>
                    </div>
                </div>

                {/* Loading component */}
                {this.state.page_loading ? <Loading /> : ""}
            </Wrapper>
        );
    }
}

export default connect(mapStateToProps)(Course);
