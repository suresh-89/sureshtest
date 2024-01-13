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
import { connect } from "react-redux";
import { baseUrl, hodUrl } from "../../../shared/baseUrl";
import Loading from "../../common/loader";
import AlertBox from "../../common/alert";
import storeDispatch from "../../../redux/dispatch";
import {
    ACTIVE_STATE,
    CHAPTER,
    CYCLE,
    QUIZ,
    SEMESTER,
    SIMULATION,
    TOPIC,
} from "../../../redux/action";

const mapStateToProps = (state) => ({
    course_name: state.content.course_name,
    active_state: state.application.active_state,
});

const bgColor = "#e2e2e2";

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

const Scorecard = (props) => {
    return (
        <Modal
            show={props.show}
            onHide={props.onHide}
            size="xl"
            aria-labelledby="contained-modal-title-vcenter"
            centered
        >
            <Modal.Header closeButton>Scorecard</Modal.Header>
            <Modal.Body>
                <div className="table-responsive">
                    <table className="table table-bordered border-top">
                        <thead className="rounded-0">
                            <th scope="col">Range in %</th>
                            <th scope="col">Retake Duration</th>
                            <th scope="col">Reduction %</th>
                            <th scope="col">Reduction Duration</th>
                            <th scope="col">Remarks</th>
                        </thead>
                        <tbody>
                            {Object.keys(props.data).length !== 0
                                ? Object.entries(props.data).map(
                                      ([key, value], index) => {
                                          return (
                                              <tr key={index}>
                                                  <td className="d-flex align-items-center">
                                                      {value.range[0]}
                                                      <span className="mx-2">
                                                          to
                                                      </span>
                                                      {value.range[1]}
                                                  </td>
                                                  <td>{value.retake}</td>
                                                  <td>{value.reduction}</td>
                                                  <td>
                                                      {value.reduction_duration}
                                                  </td>
                                                  <td>
                                                      <div
                                                          style={{
                                                              color: value.color,
                                                          }}
                                                      >
                                                          {key}
                                                      </div>
                                                  </td>
                                              </tr>
                                          );
                                      }
                                  )
                                : null}
                        </tbody>
                    </table>
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
                                  <legend className="primary-bg text-white text-center">
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
                                                        className="card card-header bg-secondary text-white shadow-sm mb-2"
                                                        key={semester_index}
                                                    >
                                                        <div className="row align-items-center">
                                                            <div className="col-6">
                                                                <p className="small font-weight-bold-600 mb-0">
                                                                    {
                                                                        semester.semester_name
                                                                    }
                                                                </p>
                                                            </div>
                                                            <div className="col-6 text-right">
                                                                <Link
                                                                    to={`${props.match.url}/semester/${semester.semester_id}`}
                                                                >
                                                                    <button
                                                                        className="btn btn-light btn-sm shadow-none"
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
                                        className={`card card-header bg-secondary text-white shadow-sm ${
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
                                                <Link
                                                    to={`${props.match.url}/simulation/${simulation.simulation_id}`}
                                                >
                                                    <button
                                                        className="btn btn-light btn-sm shadow-none"
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
                className="bg-secondary text-white shadow-sm mb-2"
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
                    <div className="col-6">
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
                    <div className="col-6 small font-weight-bold-600">
                        <div className="row align-items-center justify-content-end">
                            <div className="col-3">
                                {props.chapter.weightage}
                            </div>
                            <div className="col-3">
                                {props.chapter.topics ? (
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
                                        <button
                                            className="btn btn-light btn-sm shadow-none"
                                            disabled={
                                                props.chapter.topics
                                                    ? false
                                                    : true
                                            }
                                        >
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
                                )}
                            </div>
                            <div className="col-3">
                                {props.chapter.topics ? (
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
                                )}
                            </div>
                            <div className="col-3"></div>
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
                                          className="card card-header shadow-sm border-secondary mb-2"
                                          style={{
                                              backgroundColor: bgColor,
                                              paddingTop: "9px",
                                              paddingBottom: "9px",
                                          }}
                                          key={cycle_index}
                                      >
                                          <div className="row align-items-center">
                                              <div className="col-6">
                                                  <p className="small text-dark font-weight-bold-600 mb-0">
                                                      {cycle.cycle_test_name}
                                                  </p>
                                              </div>
                                              <div className="col-6 text-right">
                                                  <Link
                                                      to={`${props.match.url}/chapter/${props.chapter.chapter_id}/cycle/${cycle.cycle_test_id}`}
                                                  >
                                                      <button
                                                          className="btn btn-secondary btn-sm shadow-none"
                                                          onClick={() => {
                                                              storeDispatch(
                                                                  CHAPTER,
                                                                  props.chapter
                                                                      .chapter_name
                                                              );
                                                              storeDispatch(
                                                                  CYCLE,
                                                                  cycle.cycle_test_name
                                                              );
                                                          }}
                                                      >
                                                          View
                                                      </button>
                                                  </Link>
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
                                      className="card card-header shadow-sm border-secondary mb-2"
                                      style={{
                                          backgroundColor: bgColor,
                                          paddingTop: "9px",
                                          paddingBottom: "9px",
                                      }}
                                      key={quiz_index}
                                  >
                                      <div className="row align-items-center">
                                          <div className="col-6">
                                              <p className="small text-dark font-weight-bold-600 mb-0">
                                                  {quiz.quiz_name}
                                              </p>
                                          </div>
                                          <div className="col-6 text-right">
                                              <Link
                                                  to={`${props.match.url}/chapter/${props.chapter.chapter_id}/quiz/${quiz.quiz_id}`}
                                              >
                                                  <button
                                                      className="btn btn-secondary btn-sm shadow-none"
                                                      onClick={() => {
                                                          storeDispatch(
                                                              CHAPTER,
                                                              props.chapter
                                                                  .chapter_name
                                                          );
                                                          storeDispatch(
                                                              QUIZ,
                                                              quiz.quiz_name
                                                          );
                                                      }}
                                                  >
                                                      View
                                                  </button>
                                              </Link>
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
                className="border-secondary text-dark shadow-sm mb-2"
                style={{
                    borderRadius: "8px",
                    backgroundColor: bgColor,
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
                    <div className="col-6">
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
                                    <Link
                                        to={`${props.match.url}/chapter/${props.chapter.chapter_id}/${props.topics.topic_num}/learn`}
                                        onClick={(e) => e.stopPropagation()}
                                    >
                                        <button
                                            className="btn btn-sm bg-white shadow-none"
                                            onClick={() => {
                                                storeDispatch(
                                                    CHAPTER,
                                                    props.chapter.chapter_name
                                                );
                                                storeDispatch(
                                                    TOPIC,
                                                    props.topics.topic_name
                                                );
                                            }}
                                        >
                                            {props.topics.topic_name}
                                            <i className="fas fa-external-link-alt fa-xs ml-2"></i>
                                        </button>
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="col-6 small primary-text font-weight-bold-600">
                        <div className="row align-items-center">
                            <div className="col-3"></div>
                            <div className="col-3"></div>
                            <div className="col-3"></div>
                            <div className="col-3">
                                {props.topics.next_topic ? (
                                    <OverlayTrigger
                                        key="next_topic"
                                        placement="top"
                                        overlay={
                                            <Tooltip id="tooltip">
                                                {props.topics.next_topic_name}
                                            </Tooltip>
                                        }
                                    >
                                        <Link
                                            to={`${props.match.url}/chapter/${props.topics.next_topic_chapter_id}/${props.topics.next_topic}/learn`}
                                            onClick={(e) => e.stopPropagation()}
                                        >
                                            <button
                                                className="btn btn-sm bg-white shadow-none"
                                                onClick={() => {
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
                                                }}
                                            >
                                                {props.topics.next_topic}
                                                <i className="fas fa-external-link-alt fa-xs ml-2"></i>
                                            </button>
                                        </Link>
                                    </OverlayTrigger>
                                ) : (
                                    ""
                                )}
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

class HODCourse extends Component {
    constructor(props) {
        super(props);
        this.state = {
            showModal: false,
            type: "",
            selectedData: "",

            data: {},
            chapterEventKey: [],
            topicEventKey: [],

            errorMsg: "",
            successMsg: "",
            showErrorAlert: false,
            showSuccessAlert: false,
            page_loading: true,
        };
        this.courseId = this.props.match.params.courseId;
        this.url = baseUrl + hodUrl;
        this.authToken = localStorage.getItem("Authorization");
        this.headers = {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: this.authToken,
        };
    }

    componentDidMount = () => {
        document.title = `${this.props.course_name} - HOD | IQLabs`;

        this.loadCourseData();
    };

    loadCourseData = () => {
        fetch(`${this.url}/hod/course/${this.courseId}/review/`, {
            method: "GET",
            headers: this.headers,
        })
            .then((res) => res.json())
            .then((result) => {
                if (result.sts === true) {
                    let chapterEventKey = [];
                    let topicEventKey = [];
                    if (result.data.units && result.data.units.length !== 0) {
                        result.data.units.forEach((data) => {
                            let temp = [];
                            if (data.chapters && data.chapters.length !== 0) {
                                data.chapters.forEach(() => {
                                    temp.push([]);
                                });
                            }
                            chapterEventKey.push([]);
                            topicEventKey.push(temp);
                        });
                    }

                    this.setState(
                        {
                            data: result.data,
                            chapterEventKey: chapterEventKey,
                            topicEventKey: topicEventKey,
                            page_loading: false,
                        },
                        () => {
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

    handlePublish = () => {
        this.setState({
            showErrorAlert: false,
            showSuccessAlert: false,
            page_loading: true,
        });

        fetch(`${this.url}/hod/course/${this.courseId}/publish/`, {
            method: "POST",
            headers: this.headers,
        })
            .then((res) => res.json())
            .then((result) => {
                if (result.sts === true) {
                    this.setState({
                        successMsg: result.msg,
                        showSuccessAlert: true,
                    });
                    this.loadCourseData();
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

                {/* Scorecard Modal */}
                {this.state.showModal && this.state.type === "scorecard" ? (
                    <Scorecard
                        show={this.state.showModal}
                        onHide={() => {
                            this.setState({
                                showModal: false,
                            });
                        }}
                        data={this.state.data.score_card_config}
                    />
                ) : (
                    ""
                )}

                {/* Course detail Modal */}
                {this.state.showModal && this.state.type === "detail" ? (
                    <CourseDetail
                        show={this.state.showModal}
                        onHide={() => {
                            this.setState({
                                showModal: false,
                            });
                        }}
                        data={this.state.data.course_detail}
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
                        data={this.state.data.quick_pass_tips}
                    />
                ) : (
                    ""
                )}

                <div className="row align-items-center mb-3">
                    <div className="col-md-6 mb-2 mb-md-0">
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
                    <div className="col-md-6 d-flex justify-content-end">
                        <button
                            className="btn btn-primary btn-sm shadow-none"
                            disabled={this.state.data.publish ? true : false}
                            onClick={this.handlePublish}
                        >
                            <i className="fas fa-share-square mr-1"></i>{" "}
                            {this.state.data.publish ? "Published" : "Publish"}
                        </button>
                        {this.state.data.publish === false ? (
                            <Link to={`${this.props.match.url}/edit`}>
                                <button className="btn btn-primary btn-sm shadow-none ml-1">
                                    <i className="fas fa-edit mr-1"></i> Edit
                                </button>
                            </Link>
                        ) : (
                            ""
                        )}

                        <Dropdown>
                            <Dropdown.Toggle
                                variant="Secondary"
                                className="btn btn-primary btn-sm shadow-none caret-off ml-1"
                            >
                                <i className="fas fa-ellipsis-h"></i>
                            </Dropdown.Toggle>

                            <Dropdown.Menu className="dropdown-menu-down-btn dropdown-menu-down">
                                <Dropdown.Item
                                    onClick={() => {
                                        this.setState({
                                            showModal: true,
                                            type: "scorecard",
                                        });
                                    }}
                                >
                                    Scorecard
                                </Dropdown.Item>
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
                            </Dropdown.Menu>
                        </Dropdown>
                    </div>
                </div>

                {/* Course details */}
                <div className="card shadow-sm overflow-auto">
                    <div style={{ minWidth: "900px" }}>
                        <div className="card-header primary-bg text-white">
                            <div className="row align-items-center">
                                <div className="col-6">Course Structure</div>
                                <div className="col-6 pl-0">
                                    <div className="row align-items-center small">
                                        <div className="col-3">Weightage</div>
                                        <div className="col-3">Summary</div>
                                        <div className="col-3">Notes</div>
                                        <div className="col-3">Next topic</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="card-body p-3">
                            {/* ----- Unit list ----- */}
                            {Object.entries(this.state.data).length !== 0 ? (
                                <UnitListRender
                                    data={this.state.data}
                                    chapterEventKey={this.state.chapterEventKey}
                                    topicEventKey={this.state.topicEventKey}
                                    toggleChapterCollapse={
                                        this.toggleChapterCollapse
                                    }
                                    toggleTopicCollapse={
                                        this.toggleTopicCollapse
                                    }
                                    {...this.props}
                                />
                            ) : null}
                        </div>
                    </div>
                </div>

                {/* Loading component */}
                {this.state.page_loading ? <Loading /> : ""}
            </Wrapper>
        );
    }
}

export default connect(mapStateToProps)(HODCourse);
