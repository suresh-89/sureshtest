import React, { Component } from "react";
import Wrapper from "../wrapper";
import {
    Card,
    Accordion,
    OverlayTrigger,
    Tooltip,
    Dropdown,
} from "react-bootstrap";
import { Link } from "react-router-dom";
import Loading from "../../common/loader";
import AlertBox from "../../common/alert";
import { baseUrl, studentUrl } from "../../../shared/baseUrl.js";
import { batch, connect } from "react-redux";
import storeDispatch from "../../../redux/dispatch";
import {
    ACTIVE_STATE,
    CHAPTER,
    RESPONSE,
    CYCLE,
    QUIZ,
    SEMESTER,
    TEMP,
    TOPIC,
} from "../../../redux/action";
import NumericConversion from "../../common/function/NumericConversion";

const mapStateToProps = (state) => ({
    subject_name: state.content.subject_name,
    exam_state: state.application.exam_state,
    active_state: state.application.active_state,
    permissions: state.user.profile.hod_permission,
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

const ChapterListRender = (props) => {
    return (
        <Card className="mb-1">
            <Accordion.Toggle
                as={Card.Header}
                eventKey={props.chapter.chapter_id}
                className="pinkrange-bg shadow-sm mb-2"
                style={{
                    borderRadius: "8px",
                    cursor: "default",
                }}
                onClick={() => props.toggleCollapse(props.chapter.chapter_id)}
            >
                <div className="row align-items-center">
                    <div className="col-5">
                        <div className="row align-items-center">
                            <div className="col-1">
                                <span>
                                    <i
                                        className={`fas fa-chevron-circle-down ${
                                            props.chapterEventKey.includes(
                                                props.chapter.chapter_id
                                            )
                                                ? ""
                                                : "fa-rotate-270"
                                        }`}
                                    ></i>
                                </span>
                            </div>
                            <div className="col-11 d-flex small font-weight-bold-600 pl-1">
                                <div className="mr-3">
                                    {props.all_chapters.indexOf(
                                        props.chapter.chapter_id
                                    ) + 1}
                                </div>
                                <div className="w-100">
                                    {props.chapter.chapter_name}
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-7 small primary-text font-weight-bold-600">
                        <div className="row align-items-center justify-content-end">
                            <div className="col-2">
                                {props.chapter.weightage}
                            </div>
                            <div className="col-2">
                                {
                                    // check if the exam is started
                                    props.exam_state.examStarted === false ? (
                                        <Link
                                            to={`${props.match.url}/chapter/${props.chapter.chapter_id}/summary`}
                                            onClick={(e) => e.stopPropagation()}
                                        >
                                            <button
                                                className="btn btn-light btn-sm shadow-none"
                                                onClick={() =>
                                                    storeDispatch(
                                                        CHAPTER,
                                                        props.chapter
                                                            .chapter_name
                                                    )
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
                                    )
                                }
                            </div>
                            <div className="col-2">
                                {
                                    // check if the exam is started
                                    props.exam_state.examStarted === false ? (
                                        <Link
                                            to={`${props.match.url}/chapter/${props.chapter.chapter_id}/notes`}
                                            onClick={(e) => e.stopPropagation()}
                                        >
                                            <button
                                                className="btn btn-light btn-sm shadow-none"
                                                onClick={() =>
                                                    storeDispatch(
                                                        CHAPTER,
                                                        props.chapter
                                                            .chapter_name
                                                    )
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
                                    )
                                }
                            </div>
                            <div className="col-2">
                                {props.permissions &&
                                props.permissions.prog_sco_card === true &&
                                props.chapter_remarks[
                                    props.all_chapters.indexOf(
                                        props.chapter.chapter_id
                                    )
                                ] !== undefined ? (
                                    props.chapter_remarks[
                                        props.all_chapters.indexOf(
                                            props.chapter.chapter_id
                                        )
                                    ][props.chapter.chapter_id] !==
                                    undefined ? (
                                        props.chapter_remarks[
                                            props.all_chapters.indexOf(
                                                props.chapter.chapter_id
                                            )
                                        ][props.chapter.chapter_id].remarks !==
                                        undefined ? (
                                            <div
                                                className="text-white text-center p-2 rounded"
                                                style={{
                                                    backgroundColor:
                                                        props.chapter_remarks[
                                                            props.all_chapters.indexOf(
                                                                props.chapter
                                                                    .chapter_id
                                                            )
                                                        ][
                                                            props.chapter
                                                                .chapter_id
                                                        ].color,
                                                    textTransform: "capitalize",
                                                }}
                                            >
                                                {
                                                    props.chapter_remarks[
                                                        props.all_chapters.indexOf(
                                                            props.chapter
                                                                .chapter_id
                                                        )
                                                    ][props.chapter.chapter_id]
                                                        .remarks
                                                }
                                            </div>
                                        ) : (
                                            ""
                                        )
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
                                              props.subjectItems.chapters.length
                                                ? props.topics[
                                                      props.all_chapters.indexOf(
                                                          props.chapter
                                                              .chapter_id
                                                      )
                                                  ] !== undefined &&
                                                  props.topics_completed[
                                                      props.all_chapters.indexOf(
                                                          props.chapter
                                                              .chapter_id
                                                      )
                                                  ] !== undefined
                                                    ? props.topics[
                                                          props.all_chapters.indexOf(
                                                              props.chapter
                                                                  .chapter_id
                                                          )
                                                      ].length ===
                                                      props.topics_completed[
                                                          props.all_chapters.indexOf(
                                                              props.chapter
                                                                  .chapter_id
                                                          )
                                                      ].length
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
                                            props.all_chapters.indexOf(
                                                props.chapter.chapter_id
                                            ),
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
                    {(props.chapter.topics || []).map((topics, topic_index) => {
                        return (
                            <Accordion
                                key={topic_index}
                                activeKey={props.topicEventKey[
                                    props.chapter_index
                                ].find(
                                    (element) => element === topics.topic_num
                                )}
                            >
                                <TopicListRender
                                    {...props}
                                    topics={topics}
                                    topic_index={topic_index}
                                />
                            </Accordion>
                        );
                    })}

                    {/* ----- Cycle test list ----- */}
                    {(props.chapter.cycle_tests || []).map(
                        (cycle, cycle_index) => {
                            return props.cycleTest(
                                cycle,
                                cycle_index,
                                props.all_chapters.indexOf(
                                    props.chapter.chapter_id
                                ),
                                props.chapter.chapter_id,
                                props.chapter.chapter_name
                            );
                        }
                    )}

                    {/* ----- Quiz list ----- */}
                    {(props.chapter.quiz || []).map((quiz, quiz_index) => {
                        return (
                            <div
                                className="card card-header shadow-sm light-bg mb-2"
                                key={quiz_index}
                            >
                                <div className="row align-items-center">
                                    <div className="col-5">
                                        <p className="small primary-text font-weight-bold-600 mb-0">
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
                                                {props.chapter.quiz_points || 0}
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
                                                            onClick={() => {
                                                                batch(() => {
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
                                                                });
                                                            }}
                                                        >
                                                            <button className="btn btn-primary btn-sm shadow-none">
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
                    })}
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
                activeKey={props.topicEventKey[props.chapter_index].find(
                    (element) => element === topic.topic_num
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
                eventKey={props.topics.topic_num}
                className="light-bg shadow-sm py-2 mb-2"
                style={{
                    borderRadius: "8px",
                }}
                onClick={() =>
                    props.topics.child.length !== 0
                        ? props.toggleTopicCollapse(
                              props.topics.topic_num,
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
                                                    props.chapter_index
                                                ].includes(
                                                    props.topics.topic_num
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
                                    {props.topics.topic_num}
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
                                {props.permissions &&
                                props.permissions.prog_sco_card === true &&
                                props.topics_remarks[
                                    props.all_chapters.indexOf(
                                        props.chapter.chapter_id
                                    )
                                ] !== undefined ? (
                                    props.topics_remarks[
                                        props.all_chapters.indexOf(
                                            props.chapter.chapter_id
                                        )
                                    ][props.topics.topic_num] !== undefined ? (
                                        props.topics_remarks[
                                            props.all_chapters.indexOf(
                                                props.chapter.chapter_id
                                            )
                                        ][props.topics.topic_num].remarks !==
                                        undefined ? (
                                            <div
                                                className="text-white text-center p-2 rounded"
                                                style={{
                                                    backgroundColor:
                                                        props.topics_remarks[
                                                            props.all_chapters.indexOf(
                                                                props.chapter
                                                                    .chapter_id
                                                            )
                                                        ][
                                                            props.topics
                                                                .topic_num
                                                        ].color,
                                                    textTransform: "capitalize",
                                                }}
                                            >
                                                {
                                                    props.topics_remarks[
                                                        props.all_chapters.indexOf(
                                                            props.chapter
                                                                .chapter_id
                                                        )
                                                    ][props.topics.topic_num]
                                                        .remarks
                                                }
                                            </div>
                                        ) : (
                                            ""
                                        )
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
                                        props.topics_completed[
                                            props.all_chapters.indexOf(
                                                props.chapter.chapter_id
                                            )
                                        ] !== undefined
                                            ? props.topics_completed[
                                                  props.all_chapters.indexOf(
                                                      props.chapter.chapter_id
                                                  )
                                              ].includes(props.topics.topic_num)
                                                ? "text-success"
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
                                            props.all_chapters.indexOf(
                                                props.chapter.chapter_id
                                            ),
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
                eventKey={props.topics.topic_num}
                className="ml-3"
            >
                <div>{nestedTopics}</div>
            </Accordion.Collapse>
        </>
    );
};

class Subject extends Component {
    constructor(props) {
        super(props);
        this.state = {
            subjectItems: [],
            topics: [],
            topics_completed: [],
            topics_remarks: [],
            chapter_remarks: [],
            all_topics_completed: [],

            all_chapters: [],
            semester_chapters: [],

            chapterEventKey: [],
            topicEventKey: [],

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
        this.subjectId = this.props.match.params.subjectId;
    }

    componentDidMount = () => {
        document.title = `${this.props.subject_name} - Student | IQLabs`;

        this.loadSubjectData();
    };

    // loads chapter, topic and semester data
    loadSubjectData = () => {
        fetch(`${this.url}/student/subject/${this.subjectId}/`, {
            method: "GET",
            headers: this.headers,
        })
            .then((res) => res.json())
            .then((result) => {
                if (result.sts === true) {
                    let topics = [];
                    let all_chapters = [];
                    let semester_chapters = [];
                    let topicKey = [];
                    if (
                        result.data.chapters &&
                        Object.keys(result.data.chapters).length !== 0
                    ) {
                        // semester loop
                        for (let i = 0; i < result.data.semesters.length; i++) {
                            // Gets all chapter id from the semester list
                            for (
                                let j = 0;
                                j < result.data.semesters[i].chapters.length;
                                j++
                            ) {
                                semester_chapters.push(
                                    result.data.semesters[i].chapters[j]
                                );
                            }

                            // call the semester reduction api on loop
                            this.handleSemesterReduction(
                                result.data.semesters[i].semester_id
                            );
                        }

                        // chapter loop
                        for (let i = 0; i < result.data.chapters.length; i++) {
                            // cycle loop
                            for (
                                let j = 0;
                                j < result.data.chapters[i].cycle_tests.length;
                                j++
                            ) {
                                // call the cycle reduction api on loop
                                this.handleCycleTestReduction(
                                    result.data.chapters[i].chapter_id,
                                    result.data.chapters[i].cycle_tests[j]
                                        .cycle_test_id
                                );
                            }

                            // Extracting topics from the chapter_structure
                            topics.push(
                                this.loopTopicStructure(
                                    result.data.chapters[i].topics
                                )
                            );

                            // function to load completed topic list from API
                            this.loadTopicCompletedData(
                                result.data.chapters[i].chapter_id,
                                i
                            );

                            // Gets all chapter id from the chapters list
                            all_chapters.push(
                                result.data.chapters[i].chapter_id
                            );

                            // Topic event key
                            topicKey.push([]);
                            if (
                                this.state.topicEventKey.length !== 0 &&
                                this.state.topicEventKey[i] !== undefined
                            ) {
                                if (this.state.topicEventKey[i].length !== 0) {
                                    topicKey[i] = this.state.topicEventKey[i];
                                }
                            }
                        }
                    } else {
                        this.setState({
                            page_loading: false,
                        });
                    }

                    // redux store dispatcher
                    batch(() => {
                        storeDispatch(RESPONSE, result.data);
                        storeDispatch(TEMP, {});
                    });

                    this.setState(
                        {
                            subjectItems: result.data,
                            topics: topics,
                            all_chapters: all_chapters,
                            semester_chapters: semester_chapters,
                            topicEventKey: topicKey,
                        },
                        () => {
                            if (this.props.active_state.id !== "") {
                                if (
                                    this.props.active_state.id ===
                                    this.subjectId
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

    // Loads topic completion data and remarks data
    loadTopicCompletedData = (chapter_id, chapter_index) => {
        fetch(
            `${this.url}/student/subject/${this.subjectId}/chapter/${chapter_id}/topics/`,
            {
                method: "GET",
                headers: this.headers,
            }
        )
            .then((res) => res.json())
            .then((result) => {
                if (result.sts === true) {
                    let topics_completed = [...this.state.topics_completed];
                    let all_topics_completed = [
                        ...this.state.all_topics_completed,
                    ];
                    let topics_remarks = [...this.state.topics_remarks];
                    let chapter_remarks = [...this.state.chapter_remarks];
                    topics_completed[chapter_index] =
                        result.data.topics_completed !== undefined
                            ? Array.isArray(result.data.topics_completed)
                                ? result.data.topics_completed
                                : []
                            : [];
                    all_topics_completed[chapter_index] =
                        result.data.all_topics_completed !== undefined
                            ? result.data.all_topics_completed
                            : "";
                    topics_remarks[chapter_index] =
                        result.data.topics_remarks !== undefined
                            ? result.data.topics_remarks
                            : "";
                    chapter_remarks[chapter_index] =
                        result.data.chapter_remarks !== undefined
                            ? result.data.chapter_remarks
                            : "";

                    // Updating the completed topics data in topics state
                    let topics = [...this.state.topics];
                    if (
                        Object.entries(result.data).length !== 0 &&
                        topics.length !== 0 &&
                        topics[chapter_index] !== undefined &&
                        topics_completed[chapter_index].length !== 0 &&
                        topics_completed[chapter_index] !== undefined
                    ) {
                        for (let i = 0; i < topics[chapter_index].length; i++) {
                            if (
                                topics_completed[chapter_index].includes(
                                    topics[chapter_index][i].topic_num
                                )
                            ) {
                                topics[chapter_index][i].isCompleted = true;
                            }
                        }
                    }

                    this.setState({
                        topics: topics,
                        topics_completed: topics_completed,
                        all_topics_completed: all_topics_completed,
                        topics_remarks: topics_remarks,
                        chapter_remarks: chapter_remarks,
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

    // Topic completion toggle
    handleTopicCompletion = (
        topic_num,
        topic_name,
        chapter_index,
        chapter_id
    ) => {
        let topics = [...this.state.topics];
        let temp = {};

        for (let i = 0; i < topics[chapter_index].length; i++) {
            if (
                topics[chapter_index][i].topic_num === topic_num &&
                topics[chapter_index][i].topic_name === topic_name
            ) {
                topics[chapter_index][i].isCompleted =
                    !topics[chapter_index][i].isCompleted;
            }
            temp[topics[chapter_index][i].topic_num] =
                topics[chapter_index][i].isCompleted;
        }

        this.handleTopicCompletionSubmit(temp, chapter_index, chapter_id);
    };

    // All topic completion toggle
    handleAllTopicCompletion = (chapter_index, chapter_id) => {
        let topics = [...this.state.topics];
        let topics_completed = [...this.state.topics_completed];
        let temp = {};

        for (let i = 0; i < topics[chapter_index].length; i++) {
            if (
                topics[chapter_index].length ===
                topics_completed[chapter_index].length
            ) {
                topics[chapter_index][i].isCompleted = false;
            } else {
                topics[chapter_index][i].isCompleted = true;
            }
            temp[topics[chapter_index][i].topic_num] =
                topics[chapter_index][i].isCompleted;
        }

        this.handleTopicCompletionSubmit(temp, chapter_index, chapter_id);
    };

    // Submit topic completion
    handleTopicCompletionSubmit = (data, chapter_index, chapter_id) => {
        this.setState({
            page_loading: true,
        });

        fetch(
            `${this.url}/student/subject/${this.subjectId}/chapter/${chapter_id}/topics/`,
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
                            this.loadSubjectData();
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

    // handle content checkup
    handleCheckup = (chapter_id, topic_num) => {
        this.setState({
            page_loading: true,
        });
        fetch(
            `${this.url}/student/subject/${this.subjectId}/chapter/${chapter_id}/checkup/?topic_num=${topic_num}`,
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

    cycleTest = (data, index, chapter_index, chapter_id, chapter_name) => {
        return (
            <div
                className="card card-header shadow-sm light-bg py-2 mb-2"
                key={index}
            >
                <div className="row align-items-center">
                    <div className="col-5">
                        <p className="small primary-text font-weight-bold-600 mb-0">
                            {data.cycle_test_name}
                        </p>
                    </div>
                    <div className="col-7 small font-weight-bold-600">
                        <div className="row align-items-center">
                            <div className="col-2"></div>
                            <div className="col-2"></div>
                            <div className="col-2"></div>
                            <div className="col-2">
                                {this.props.permissions &&
                                this.props.permissions.prog_sco_card === true &&
                                data.remarks &&
                                data.color ? (
                                    <div
                                        className="text-white text-center p-2 rounded"
                                        style={{
                                            backgroundColor: data.color,
                                            textTransform: "capitalize",
                                        }}
                                    >
                                        {data.remarks}
                                    </div>
                                ) : (
                                    ""
                                )}
                            </div>
                            <div className="col-2"></div>
                            <div className="col-2 text-right">
                                {
                                    // Check if all the topics are completed
                                    this.state.all_topics_completed[
                                        chapter_index
                                    ] === true ? (
                                        // Check if cycle test is created or not
                                        data.direct_question === false &&
                                        data.auto_test_question === false ? (
                                            // if not then display the error message in tooltip
                                            <OverlayTrigger
                                                key="top"
                                                placement="top"
                                                overlay={
                                                    <Tooltip id="tooltip">
                                                        Cycle test is not
                                                        created yet
                                                    </Tooltip>
                                                }
                                            >
                                                <button className="btn btn-sm primary-text shadow-none">
                                                    <i className="fas fa-lock"></i>
                                                </button>
                                            </OverlayTrigger>
                                        ) : // if exist, then redirect them to appropriate cycle test
                                        data.direct_question === true ? (
                                            // check if the exam has been started
                                            this.props.exam_state
                                                .examStarted === true ? (
                                                // check if the current exam id is same as this exam
                                                this.props.exam_state.id ===
                                                data.cycle_test_id ? (
                                                    <Link
                                                        to={`${this.props.match.url}/chapter/${chapter_id}/cycle/${data.cycle_test_id}/direct`}
                                                    >
                                                        <button
                                                            className="btn btn-primary btn-sm shadow-none"
                                                            onClick={() => {
                                                                batch(() => {
                                                                    storeDispatch(
                                                                        CHAPTER,
                                                                        chapter_name
                                                                    );
                                                                    storeDispatch(
                                                                        CYCLE,
                                                                        data.cycle_test_name
                                                                    );
                                                                });
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
                                                    to={`${this.props.match.url}/chapter/${chapter_id}/cycle/${data.cycle_test_id}/direct`}
                                                >
                                                    <button
                                                        className="btn btn-primary btn-sm shadow-none"
                                                        onClick={() => {
                                                            batch(() => {
                                                                storeDispatch(
                                                                    CHAPTER,
                                                                    chapter_name
                                                                );
                                                                storeDispatch(
                                                                    CYCLE,
                                                                    data.cycle_test_name
                                                                );
                                                            });
                                                        }}
                                                    >
                                                        View
                                                    </button>
                                                </Link>
                                            )
                                        ) : // check if the exam has been started
                                        this.props.exam_state.examStarted ===
                                          true ? (
                                            // check if the current exam id is same as this exam
                                            this.props.exam_state.id ===
                                            data.cycle_test_id ? (
                                                <Link
                                                    to={`${this.props.match.url}/chapter/${chapter_id}/cycle/${data.cycle_test_id}`}
                                                >
                                                    <button
                                                        className="btn btn-primary btn-sm shadow-none"
                                                        onClick={() => {
                                                            batch(() => {
                                                                storeDispatch(
                                                                    CHAPTER,
                                                                    chapter_name
                                                                );
                                                                storeDispatch(
                                                                    CYCLE,
                                                                    data.cycle_test_name
                                                                );
                                                            });
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
                                                to={`${this.props.match.url}/chapter/${chapter_id}/cycle/${data.cycle_test_id}`}
                                            >
                                                <button
                                                    className="btn btn-primary btn-sm shadow-none"
                                                    onClick={() => {
                                                        batch(() => {
                                                            storeDispatch(
                                                                CHAPTER,
                                                                chapter_name
                                                            );
                                                            storeDispatch(
                                                                CYCLE,
                                                                data.cycle_test_name
                                                            );
                                                        });
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
                                }
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    // handle chapter and topic collapse
    toggleCollapse = (key) => {
        let chapterEventKey = this.state.chapterEventKey;
        if (chapterEventKey.includes(key)) {
            chapterEventKey.splice(chapterEventKey.indexOf(key), 1);
        } else {
            chapterEventKey.push(key);
        }

        this.setState({
            chapterEventKey: chapterEventKey,
        });
        storeDispatch(ACTIVE_STATE, {
            id: this.subjectId,
            chapter_key: chapterEventKey,
            topic_key: this.state.topicEventKey,
        });
    };

    toggleTopicCollapse = (key, chapter_index) => {
        let topicEventKey = this.state.topicEventKey;
        if (topicEventKey.length !== 0 && topicEventKey[chapter_index]) {
            if (topicEventKey[chapter_index].includes(key)) {
                topicEventKey[chapter_index].splice(
                    topicEventKey[chapter_index].indexOf(key),
                    1
                );
            } else {
                topicEventKey[chapter_index].push(key);
            }
        }

        this.setState({
            topicEventKey: topicEventKey,
        });
        storeDispatch(ACTIVE_STATE, {
            id: this.subjectId,
            chapter_key: this.state.chapterEventKey,
            topic_key: topicEventKey,
        });
    };

    // Reduction API for cycle test
    handleCycleTestReduction = (chapter_id, cycle_test_id) => {
        fetch(
            `${this.url}/student/subject/${this.subjectId}/chapter/${chapter_id}/cycletest/reduce/?cycle_test_id=${cycle_test_id}`,
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
            `${this.url}/student/subject/${this.subjectId}/semester/${semester_id}/reduce/`,
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

    render() {
        const all_chapters = this.state.all_chapters;
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

                <div className="row align-items-center mb-3">
                    <div className="col-md-6 col-10">
                        {/* Breadcrumb */}
                        <nav aria-label="breadcrumb">
                            <ol className="breadcrumb">
                                <li className="breadcrumb-item">
                                    <Link to="/dashboard">
                                        <i className="fas fa-home fa-sm"></i>
                                    </Link>
                                </li>
                                <li className="breadcrumb-item active">
                                    <span>Subject:</span>
                                    {this.props.subject_name}
                                </li>
                            </ol>
                        </nav>
                    </div>
                    <div className="col-md-6 col-2 d-flex align-items-center justify-content-end">
                        {this.state.subjectItems.scored_quiz_points ? (
                            <div
                                className="border-primary primary-text small font-weight-bold-600 mr-1 rounded-sm d-none d-md-block"
                                style={{ padding: "5px 10px" }}
                            >
                                {`Quiz Points: ${NumericConversion(
                                    this.state.subjectItems.scored_quiz_points
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
                                    this.state.subjectItems.chapters &&
                                    this.state.subjectItems.chapters.length !==
                                        0
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
                                    this.state.subjectItems.chapters &&
                                    this.state.subjectItems.chapters.length !==
                                        0
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
                                className="btn btn-primary btn-sm shadow-none"
                                disabled={
                                    this.state.subjectItems.chapters &&
                                    this.state.subjectItems.chapters.length !==
                                        0
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
                        <Dropdown className="d-block d-md-none">
                            <Dropdown.Toggle
                                variant="Secondary"
                                className="btn btn-primary btn-sm shadow-none caret-off"
                                disabled={
                                    this.props.exam_state.examStarted === true
                                        ? true
                                        : false
                                }
                            >
                                <i className="fas fa-ellipsis-h"></i>
                            </Dropdown.Toggle>

                            <Dropdown.Menu className="dropdown-menu-down-btn dropdown-menu-down">
                                {this.state.subjectItems.scored_quiz_points ? (
                                    <Dropdown.Item className="d-md-none d-block">
                                        {`Quiz Points: ${NumericConversion(
                                            this.state.subjectItems
                                                .scored_quiz_points
                                        )}`}
                                    </Dropdown.Item>
                                ) : null}
                                <Dropdown.Item
                                    as={Link}
                                    to={`${this.props.match.url}/personal-notes`}
                                    className="d-md-none d-block"
                                    disabled={
                                        this.state.subjectItems.chapters
                                            ? this.state.subjectItems.chapters
                                                  .length !== 0
                                                ? false
                                                : true
                                            : false
                                    }
                                >
                                    Personal Notes
                                </Dropdown.Item>
                                <Dropdown.Item
                                    as={Link}
                                    to={`${this.props.match.url}/favourites`}
                                    className="d-md-none d-block"
                                    disabled={
                                        this.state.subjectItems.chapters
                                            ? this.state.subjectItems.chapters
                                                  .length !== 0
                                                ? false
                                                : true
                                            : false
                                    }
                                >
                                    Favourites
                                </Dropdown.Item>
                                <Dropdown.Item
                                    as={Link}
                                    to={`${this.props.match.url}/results`}
                                    className="d-md-none d-block"
                                    disabled={
                                        this.state.subjectItems.chapters
                                            ? this.state.subjectItems.chapters
                                                  .length !== 0
                                                ? false
                                                : true
                                            : false
                                    }
                                >
                                    Test Analysis
                                </Dropdown.Item>
                            </Dropdown.Menu>
                        </Dropdown>
                    </div>
                </div>

                {/* Course details */}
                <div className="card shadow-sm overflow-auto">
                    <div style={{ minWidth: "1100px" }}>
                        <div className="card-header secondary-bg primary-text font-weight-bold">
                            <div className="row align-items-center">
                                <div className="col-5">Chapter</div>
                                <div className="col-7 small primary-text font-weight-bold">
                                    <div className="row justify-content-end">
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
                        <div className="card-body">
                            {this.state.subjectItems.length !== 0
                                ? (this.state.subjectItems.semesters || []).map(
                                      (semester, semester_index) => {
                                          return (
                                              <React.Fragment
                                                  key={semester_index}
                                              >
                                                  {/* ----- Chapter list ----- */}
                                                  {(
                                                      this.state.subjectItems
                                                          .chapters || []
                                                  ).map(
                                                      (
                                                          chapter,
                                                          chapter_index
                                                      ) => {
                                                          return semester.chapters.includes(
                                                              chapter.chapter_id
                                                          ) ? (
                                                              <Accordion
                                                                  key={
                                                                      chapter_index
                                                                  }
                                                                  activeKey={this.state.chapterEventKey.find(
                                                                      (
                                                                          element
                                                                      ) =>
                                                                          element ===
                                                                          chapter.chapter_id
                                                                  )}
                                                              >
                                                                  <ChapterListRender
                                                                      {...this
                                                                          .props}
                                                                      chapter={
                                                                          chapter
                                                                      }
                                                                      chapter_index={
                                                                          chapter_index
                                                                      }
                                                                      all_chapters={
                                                                          all_chapters
                                                                      }
                                                                      subjectItems={
                                                                          this
                                                                              .state
                                                                              .subjectItems
                                                                      }
                                                                      topics_completed={
                                                                          this
                                                                              .state
                                                                              .topics_completed
                                                                      }
                                                                      topics_remarks={
                                                                          this
                                                                              .state
                                                                              .topics_remarks
                                                                      }
                                                                      chapter_remarks={
                                                                          this
                                                                              .state
                                                                              .chapter_remarks
                                                                      }
                                                                      topics={
                                                                          this
                                                                              .state
                                                                              .topics
                                                                      }
                                                                      chapterEventKey={
                                                                          this
                                                                              .state
                                                                              .chapterEventKey
                                                                      }
                                                                      topicEventKey={
                                                                          this
                                                                              .state
                                                                              .topicEventKey
                                                                      }
                                                                      toggleCollapse={
                                                                          this
                                                                              .toggleCollapse
                                                                      }
                                                                      handleAllTopicCompletion={
                                                                          this
                                                                              .handleAllTopicCompletion
                                                                      }
                                                                      handleTopicCompletion={
                                                                          this
                                                                              .handleTopicCompletion
                                                                      }
                                                                      toggleTopicCollapse={
                                                                          this
                                                                              .toggleTopicCollapse
                                                                      }
                                                                      handleCheckup={
                                                                          this
                                                                              .handleCheckup
                                                                      }
                                                                      cycleTest={
                                                                          this
                                                                              .cycleTest
                                                                      }
                                                                  />
                                                              </Accordion>
                                                          ) : null;
                                                      }
                                                  )}
                                                  {/* ----- Semester list ----- */}
                                                  <div
                                                      className="card card-header pinkrange-bg shadow-sm"
                                                      style={{
                                                          marginBottom:
                                                              "0.75rem",
                                                      }}
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
                                                                      {this
                                                                          .props
                                                                          .permissions &&
                                                                      this.props
                                                                          .permissions
                                                                          .prog_sco_card ===
                                                                          true &&
                                                                      semester.remarks &&
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
                                                                          // Check if semester exam is created or not
                                                                          semester.direct_question ===
                                                                              false &&
                                                                          semester.auto_test_question ===
                                                                              false ? (
                                                                              // if not then display the error message in tooltip
                                                                              <OverlayTrigger
                                                                                  key="top"
                                                                                  placement="top"
                                                                                  overlay={
                                                                                      <Tooltip id="tooltip">
                                                                                          Semester
                                                                                          exam
                                                                                          is
                                                                                          not
                                                                                          created
                                                                                          yet
                                                                                      </Tooltip>
                                                                                  }
                                                                              >
                                                                                  <button className="btn btn-sm primary-text">
                                                                                      <i className="fas fa-lock"></i>
                                                                                  </button>
                                                                              </OverlayTrigger>
                                                                          ) : // if exist, then redirect them to appropriate cycle test
                                                                          semester.direct_question ===
                                                                            true ? (
                                                                              // check if the exam has been started
                                                                              this
                                                                                  .props
                                                                                  .exam_state
                                                                                  .examStarted ===
                                                                              true ? (
                                                                                  // check if the current exam id is same as this exam
                                                                                  this
                                                                                      .props
                                                                                      .exam_state
                                                                                      .id ===
                                                                                  semester.semester_id ? (
                                                                                      <Link
                                                                                          to={`${this.props.match.url}/semester/${semester.semester_id}/direct`}
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
                                                                                  // else display the view button
                                                                                  <Link
                                                                                      to={`${this.props.match.url}/semester/${semester.semester_id}/direct`}
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
                                                                          ) : // check if the exam has been started
                                                                          this
                                                                                .props
                                                                                .exam_state
                                                                                .examStarted ===
                                                                            true ? (
                                                                              // check if the current exam id is same as this exam
                                                                              this
                                                                                  .props
                                                                                  .exam_state
                                                                                  .id ===
                                                                              semester.semester_id ? (
                                                                                  <Link
                                                                                      to={`${this.props.match.url}/semester/${semester.semester_id}`}
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
                                                                              // else display the view button
                                                                              <Link
                                                                                  to={`${this.props.match.url}/semester/${semester.semester_id}`}
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
                                              </React.Fragment>
                                          );
                                      }
                                  )
                                : null}
                            {/* ----- Unassigned chapter list ----- */}
                            {this.state.subjectItems.length !== 0
                                ? (this.state.subjectItems.chapters || []).map(
                                      (chapter, chapter_index) => {
                                          return !this.state.semester_chapters.includes(
                                              chapter.chapter_id
                                          ) ? (
                                              <Accordion
                                                  key={chapter_index}
                                                  activeKey={this.state.chapterEventKey.find(
                                                      (element) =>
                                                          element ===
                                                          chapter.chapter_id
                                                  )}
                                              >
                                                  <ChapterListRender
                                                      {...this.props}
                                                      chapter={chapter}
                                                      chapter_index={
                                                          chapter_index
                                                      }
                                                      all_chapters={
                                                          all_chapters
                                                      }
                                                      subjectItems={
                                                          this.state
                                                              .subjectItems
                                                      }
                                                      topics_completed={
                                                          this.state
                                                              .topics_completed
                                                      }
                                                      topics_remarks={
                                                          this.state
                                                              .topics_remarks
                                                      }
                                                      chapter_remarks={
                                                          this.state
                                                              .chapter_remarks
                                                      }
                                                      topics={this.state.topics}
                                                      chapterEventKey={
                                                          this.state
                                                              .chapterEventKey
                                                      }
                                                      topicEventKey={
                                                          this.state
                                                              .topicEventKey
                                                      }
                                                      toggleCollapse={
                                                          this.toggleCollapse
                                                      }
                                                      handleAllTopicCompletion={
                                                          this
                                                              .handleAllTopicCompletion
                                                      }
                                                      handleTopicCompletion={
                                                          this
                                                              .handleTopicCompletion
                                                      }
                                                      toggleTopicCollapse={
                                                          this
                                                              .toggleTopicCollapse
                                                      }
                                                      handleCheckup={
                                                          this.handleCheckup
                                                      }
                                                      cycleTest={this.cycleTest}
                                                  />
                                              </Accordion>
                                          ) : null;
                                      }
                                  )
                                : null}
                        </div>
                    </div>
                </div>

                {/* Loading component */}
                {this.state.page_loading ? <Loading /> : ""}
            </Wrapper>
        );
    }
}

export default connect(mapStateToProps)(Subject);
