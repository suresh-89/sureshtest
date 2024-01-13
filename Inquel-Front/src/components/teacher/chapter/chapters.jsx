import React, { Component } from "react";
import Wrapper from "../wrapper";
import { connect } from "react-redux";
import { Card, Accordion, Dropdown } from "react-bootstrap";
import Select from "react-select";
import { Link } from "react-router-dom";
import Loading from "../../common/loader";
import { baseUrl, teacherUrl } from "../../../shared/baseUrl.js";
import AlertBox from "../../common/alert";
import {
    SingleContentDeleteModal,
    ContentUpdateModal,
} from "../../common/modal/contentManagementModal";
import {
    TopicModal,
    CycleTestModal,
    IndependentCycleTestModal,
    IndependentCycleEditModal,
    QuizModal,
} from "./contentManagementModal";
import storeDispatch from "../../../redux/dispatch";
import {
    ACTIVE_STATE,
    CHAPTER,
    CYCLE,
    QUIZ,
    TOPIC,
} from "../../../redux/action";

const mapStateToProps = (state) => ({
    subject_data: state.storage.response,
    group_name: state.content.group_name,
    subject_name: state.content.subject_name,
    chapter_name: state.content.chapter_name,
    active_state: state.application.active_state,
});

class TeacherChapters extends Component {
    constructor(props) {
        super(props);
        this.state = {
            collapsed: false,
            publish: false,

            showTopicModal: false,
            showTopic_EditModal: false,
            showTopic_DeleteModal: false,

            showCycle_TestModal: false,
            showCycle_EditModal: false,
            showCycle_DeleteModal: false,

            showIndependentCycle_TestModal: false,
            showIndependentCycle_EditModal: false,

            showQuiz_CreateModal: false,
            showQuiz_EditModal: false,
            showQuiz_DeleteModal: false,

            chapterId: this.props.match.params.chapterId,
            chapterName: "",
            topics: [],
            cycle_test: [],
            quiz: [],

            chapterIndex: 1,
            activeTopic: "",
            ancestor: "",
            topicEventKey: [],

            selectedCycleData: [],
            selectedTopicData: [],
            selectedQuizData: [],
            next_topic: [],

            errorMsg: "",
            successMsg: "",
            showErrorAlert: false,
            showSuccessAlert: false,
            page_loading: true,
        };
        this.groupId = this.props.match.params.groupId;
        this.subjectId = this.props.match.params.subjectId;
        this.url = baseUrl + teacherUrl;
        this.authToken = localStorage.getItem("Authorization");
        this.headers = {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: this.authToken,
        };
    }

    // ----- Loads data -----

    loadTopicData = () => {
        fetch(
            `${this.url}/teacher/subject/${this.subjectId}/chapter/topics/?chapter_id=${this.state.chapterId}`,
            {
                headers: this.headers,
                method: "GET",
            }
        )
            .then((res) => res.json())
            .then((result) => {
                if (result.sts === true) {
                    storeDispatch(
                        CHAPTER,
                        result.data.chapter_name
                            ? result.data.chapter_name
                            : this.props.chapter_name
                    );
                    this.setState({
                        topics: result.data.topics || [],
                        chapterName: result.data.chapter_name
                            ? result.data.chapter_name
                            : this.props.chapter_name,
                        next_topic: result.data.topics_list
                            ? result.data.topics_list
                            : [],
                        publish: result.data.publish || false,
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

    loadCycleTestData = () => {
        let url = "";
        if (this.props.subject_data.is_independent === true) {
            url = `${this.url}/teacher/independent/subject/${this.subjectId}/cycle/?chapter_id=${this.state.chapterId}`;
        } else {
            url = `${this.url}/teacher/subject/${this.subjectId}/cycle/?chapter_id=${this.state.chapterId}`;
        }
        fetch(url, {
            headers: this.headers,
            method: "GET",
        })
            .then((res) => res.json())
            .then((result) => {
                if (result.sts === true) {
                    this.setState({
                        cycle_test: result.data,
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

    loadQuizData = () => {
        fetch(
            `${this.url}/teacher/subject/${this.subjectId}/chapter/${this.state.chapterId}/quiz/`,
            {
                headers: this.headers,
                method: "GET",
            }
        )
            .then((res) => res.json())
            .then((result) => {
                if (result.sts === true) {
                    this.setState({
                        quiz: result.data,
                        page_loading: false,
                    });
                } else {
                    if (
                        result.msg !==
                        "HOD has not configured with this feature"
                    ) {
                        this.setState({
                            errorMsg: result.msg,
                            showErrorAlert: true,
                            page_loading: false,
                        });
                    } else {
                        this.setState({
                            page_loading: false,
                        });
                    }
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

    getChapterIndex = () => {
        const chapters = [...this.props.subject_data.results];
        let index = 0;
        for (let i = 0; i < chapters.length; i++) {
            if (chapters[i].chapter_id === this.state.chapterId) {
                index = i + 1;
            }
        }
        this.setState({
            chapterIndex: index,
        });
    };

    componentDidMount = () => {
        if (this.props.active_state.id) {
            if (this.props.active_state.id === this.state.chapterId) {
                this.setState({
                    topicEventKey: this.props.active_state.topic_key,
                });
            } else {
                storeDispatch(ACTIVE_STATE, {
                    id: "",
                    chapter_key: [],
                    topic_key: [],
                });
            }
        }

        this.getChapterIndex();
        this.loadTopicData();
        this.loadCycleTestData();
        this.loadQuizData();
    };

    componentDidUpdate = (prevProps, prevState) => {
        if (this.props.match.params.chapterId !== this.state.chapterId) {
            this.setState(
                {
                    chapterId: this.props.match.params.chapterId,
                    page_loading: true,
                },
                () => {
                    this.loadTopicData();
                    this.loadCycleTestData();
                    this.loadQuizData();
                    this.getChapterIndex();
                }
            );
        }
    };

    // ----- Topic Modals -----

    toggleTopicModal = (index, ancestor) => {
        this.setState({
            showTopicModal: !this.state.showTopicModal,
            activeTopic: index,
            ancestor: ancestor,
        });
    };

    toggleTopic_EditModal = (data) => {
        this.setState({
            selectedTopicData: data,
            showTopic_EditModal: !this.state.showTopic_EditModal,
        });
    };

    toggleTopic_DeleteModal = (data) => {
        this.setState({
            selectedTopicData: data,
            showTopic_DeleteModal: !this.state.showTopic_DeleteModal,
        });
    };

    // ----- Cycle test Modals -----

    toggleCycleTestModal = () => {
        if (this.props.subject_data.is_independent === false) {
            this.setState({
                showCycle_TestModal: !this.state.showCycle_TestModal,
            });
        } else {
            this.setState({
                showIndependentCycle_TestModal:
                    !this.state.showIndependentCycle_TestModal,
            });
        }
    };

    toggleCycle_EditModal = (data) => {
        if (this.props.subject_data.is_independent === false) {
            this.setState({
                selectedCycleData: data,
                showCycle_EditModal: !this.state.showCycle_EditModal,
            });
        } else {
            this.setState({
                selectedCycleData: data,
                showIndependentCycle_EditModal:
                    !this.state.showIndependentCycle_EditModal,
            });
        }
    };

    toggleCycle_DeleteModal = (data) => {
        this.setState({
            selectedCycleData: data,
            showCycle_DeleteModal: !this.state.showCycle_DeleteModal,
        });
    };

    // ----- Quiz Modals -----

    toggleQuiz_CreateModal = () => {
        this.setState({
            showQuiz_CreateModal: !this.state.showQuiz_CreateModal,
        });
    };

    toggleQuiz_EditModal = (data) => {
        this.setState({
            selectedQuizData: data,
            showQuiz_EditModal: !this.state.showQuiz_EditModal,
        });
    };

    toggleQuiz_DeleteModal = (data) => {
        this.setState({
            selectedQuizData: data,
            showQuiz_DeleteModal: !this.state.showQuiz_DeleteModal,
        });
    };

    // ----- Form submissions -----

    topic_formSubmission = () => {
        setTimeout(() => {
            this.setState({
                showTopicModal: false,
                showTopic_EditModal: false,
                showTopic_DeleteModal: false,
            });
        }, 1000);
        this.loadTopicData();
    };

    cycleTest_formSubmission = () => {
        setTimeout(() => {
            this.setState({
                showCycle_TestModal: false,
                showCycle_EditModal: false,
                showCycle_DeleteModal: false,
                showIndependentCycle_TestModal: false,
                showIndependentCycle_EditModal: false,
            });
        }, 1000);
        this.loadCycleTestData();
    };

    quiz_formSubmission = () => {
        setTimeout(() => {
            this.setState({
                showQuiz_CreateModal: false,
                showQuiz_EditModal: false,
                showQuiz_DeleteModal: false,
            });
        }, 1000);
        this.loadQuizData();
    };

    handleSelect = (event) => {
        this.props.history.push({
            pathname: this.groupId
                ? `/teacher/group/${this.groupId}/subject/${this.subjectId}/chapter/${event.value}`
                : `/teacher/subject/${this.subjectId}/chapter/${event.value}`,
        });
        storeDispatch(CHAPTER, event.label);
        this.setState(
            {
                chapterId: event.value,
                page_loading: true,
            },
            () => {
                this.loadTopicData();
                this.loadCycleTestData();
                this.loadQuizData();
                this.getChapterIndex();
            }
        );
    };

    handleNextTopic = (event, topic_num) => {
        this.setState({
            showErrorAlert: false,
            showSuccessAlert: false,
            page_loading: true,
        });

        let next_topic_name = "",
            next_topic_chapter_id = "";
        this.state.next_topic.forEach((list) => {
            if (list.topic_num === event.target.value) {
                next_topic_name = list.topic_name;
                next_topic_chapter_id = list.chapter_id;
            }
        });

        if (event.target.value !== "") {
            fetch(
                `${this.url}/teacher/subject/${this.subjectId}/chapter/topics/next/`,
                {
                    method: "POST",
                    headers: this.headers,
                    body: JSON.stringify({
                        chapter_id: this.state.chapterId,
                        topic_num: topic_num,
                        next_topic: event.target.value,
                        next_topic_name: next_topic_name,
                        next_topic_chapter_id: next_topic_chapter_id,
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
                        this.loadTopicData();
                    } else {
                        this.setState({
                            errorMsg: result.detail
                                ? result.detail
                                : result.msg,
                            showErrorAlert: true,
                            page_loading: false,
                        });
                    }
                });
        } else {
            this.setState({
                errorMsg: "Select a topic",
                showErrorAlert: true,
                page_loading: false,
            });
        }
    };

    permissionsDisable = (type) => {
        let state = false;

        if (
            this.props.subject_data.permissions &&
            Object.entries(this.props.subject_data.permissions).length !== 0
        ) {
            if (this.props.subject_data.permissions[type] !== undefined) {
                if (this.props.subject_data.permissions[type] === true) {
                    state = false;
                } else {
                    state = true;
                }
            }
        }

        return state;
    };

    topicRender = (data) => {
        const nestedTopics = (data.child || []).map((topic, index) => {
            return (
                <Accordion
                    key={index}
                    activeKey={this.state.topicEventKey.find(
                        (element) => element === topic.topic_num
                    )}
                >
                    {this.topicRender(topic)}
                </Accordion>
            );
        });

        return (
            <>
                <Accordion.Toggle
                    as={Card.Header}
                    eventKey={data.topic_num}
                    className="light-bg shadow-sm py-2 mb-2"
                    style={{
                        borderRadius: "8px",
                    }}
                    onClick={() =>
                        data.child.length !== 0
                            ? this.toggleTopicCollapse(data.topic_num)
                            : ""
                    }
                >
                    <div className="row align-items-center">
                        <div className="col-4">
                            <div className="row align-items-center">
                                <div className="col-1">
                                    {data.child.length !== 0 ? (
                                        <div>
                                            <i
                                                className={`fas fa-chevron-circle-down ${
                                                    this.state.topicEventKey.includes(
                                                        data.topic_num
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
                                <div className="col-10 d-flex small font-weight-bold-600 pl-2">
                                    <div className="mr-3">{data.topic_num}</div>
                                    <div className="w-100">
                                        {data.topic_name}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="col-8">
                            <div className="row align-items-center">
                                <div className="col-2">
                                    {this.props.subject_data.permissions &&
                                    Object.entries(
                                        this.props.subject_data.permissions
                                    ).length !== 0 ? (
                                        this.props.subject_data.permissions
                                            .copy_download ? (
                                            <>
                                                <Link
                                                    to={`${this.props.match.url}/${data.topic_num}/notes/upload`}
                                                    onClick={(e) =>
                                                        e.stopPropagation()
                                                    }
                                                >
                                                    <button
                                                        className="btn btn-sm btn-primary shadow-none mr-2"
                                                        onClick={() =>
                                                            this.dispatchTopic(
                                                                data.topic_name
                                                            )
                                                        }
                                                    >
                                                        <i className="fas fa-file-upload fa-sm"></i>
                                                    </button>
                                                </Link>
                                                <Link
                                                    to={`${this.props.match.url}/${data.topic_num}/notes`}
                                                    onClick={(e) =>
                                                        e.stopPropagation()
                                                    }
                                                >
                                                    <button
                                                        className="btn btn-sm btn-primary shadow-none"
                                                        onClick={() =>
                                                            this.dispatchTopic(
                                                                data.topic_name
                                                            )
                                                        }
                                                    >
                                                        <i className="fas fa-file-medical fa-sm"></i>
                                                    </button>
                                                </Link>
                                            </>
                                        ) : (
                                            <>
                                                <button
                                                    className="btn btn-primary btn-sm shadow-none mr-2"
                                                    disabled
                                                >
                                                    <i className="fas fa-file-upload"></i>
                                                </button>
                                                <button
                                                    className="btn btn-primary btn-sm shadow-none"
                                                    disabled
                                                >
                                                    <i className="fas fa-file-medical"></i>
                                                </button>
                                            </>
                                        )
                                    ) : (
                                        ""
                                    )}
                                </div>
                                <div className="col-2">
                                    <Link
                                        to={`${this.props.match.url}/${data.topic_num}/match`}
                                        onClick={(e) => e.stopPropagation()}
                                    >
                                        <button
                                            className="btn btn-primary btn-sm shadow-none"
                                            onClick={() =>
                                                this.dispatchTopic(
                                                    data.topic_name
                                                )
                                            }
                                            disabled={this.permissionsDisable(
                                                "match"
                                            )}
                                        >
                                            View / Edit
                                        </button>
                                    </Link>
                                </div>
                                <div className="col-2">
                                    <Link
                                        to={`${this.props.match.url}/${data.topic_num}/concepts`}
                                        onClick={(e) => e.stopPropagation()}
                                    >
                                        <button
                                            className="btn btn-primary btn-sm shadow-none"
                                            onClick={() =>
                                                this.dispatchTopic(
                                                    data.topic_name
                                                )
                                            }
                                        >
                                            View / Edit
                                        </button>
                                    </Link>
                                </div>
                                <div className="col-2">
                                    <Link
                                        to={`${this.props.match.url}/${data.topic_num}/type1`}
                                        onClick={(e) => e.stopPropagation()}
                                    >
                                        <button
                                            className="btn btn-primary btn-sm shadow-none"
                                            onClick={() =>
                                                this.dispatchTopic(
                                                    data.topic_name
                                                )
                                            }
                                            disabled={this.permissionsDisable(
                                                "type_1_q"
                                            )}
                                        >
                                            View / Edit
                                        </button>
                                    </Link>
                                </div>
                                <div className="col-2">
                                    <Link
                                        to={`${this.props.match.url}/${data.topic_num}/type2`}
                                        onClick={(e) => e.stopPropagation()}
                                    >
                                        <button
                                            className="btn btn-primary btn-sm shadow-none"
                                            onClick={() =>
                                                this.dispatchTopic(
                                                    data.topic_name
                                                )
                                            }
                                            disabled={this.permissionsDisable(
                                                "type_2_q"
                                            )}
                                        >
                                            View / Edit
                                        </button>
                                    </Link>
                                </div>
                                <div className="col-2 d-flex pr-0">
                                    <select
                                        name="next_topic"
                                        className="form-control form-control-sm border-secondary"
                                        value={data.next_topic}
                                        onChange={(event) => {
                                            this.handleNextTopic(
                                                event,
                                                data.topic_num
                                            );
                                        }}
                                        onClick={(e) => e.stopPropagation()}
                                    >
                                        <option value="">Select...</option>
                                        {this.state.next_topic &&
                                        this.state.next_topic.length !== 0
                                            ? this.state.next_topic.map(
                                                  (topic, index) => {
                                                      return (
                                                          <option
                                                              value={
                                                                  topic.topic_num
                                                              }
                                                              key={index}
                                                          >
                                                              {topic.topic_num}-{topic.topic_name}
                                                          </option>
                                                      );
                                                  }
                                              )
                                            : ""}
                                    </select>

                                    <Dropdown
                                        drop="left"
                                        key="left"
                                        onClick={(e) => e.stopPropagation()}
                                    >
                                        <Dropdown.Toggle
                                            variant="white"
                                            className="btn btn-link btn-sm shadow-none caret-off ml-2"
                                        >
                                            <i className="fas fa-ellipsis-v"></i>
                                        </Dropdown.Toggle>

                                        <Dropdown.Menu>
                                            <Dropdown.Item
                                                onClick={() =>
                                                    this.toggleTopicModal(
                                                        data.topic_num,
                                                        data.ancestor
                                                    )
                                                }
                                            >
                                                <i className="fas fa-plus fa-sm mr-1"></i>{" "}
                                                Add
                                            </Dropdown.Item>
                                            <Dropdown.Item
                                                onClick={() =>
                                                    this.toggleTopic_EditModal(
                                                        data
                                                    )
                                                }
                                            >
                                                <i className="far fa-edit fa-sm mr-1"></i>{" "}
                                                Edit
                                            </Dropdown.Item>
                                            <Dropdown.Item
                                                onClick={() =>
                                                    this.toggleTopic_DeleteModal(
                                                        data
                                                    )
                                                }
                                            >
                                                <i className="far fa-trash-alt fa-sm mr-1"></i>{" "}
                                                Delete
                                            </Dropdown.Item>
                                        </Dropdown.Menu>
                                    </Dropdown>
                                </div>
                            </div>
                        </div>
                    </div>
                </Accordion.Toggle>

                <Accordion.Collapse eventKey={data.topic_num} className="ml-2">
                    <div>{nestedTopics}</div>
                </Accordion.Collapse>
            </>
        );
    };

    toggleTopicCollapse = (key) => {
        let topicEventKey = this.state.topicEventKey;
        if (topicEventKey.includes(key)) {
            topicEventKey.splice(topicEventKey.indexOf(key), 1);
        } else {
            topicEventKey.push(key);
        }

        this.setState({
            topicEventKey: topicEventKey,
        });
        storeDispatch(ACTIVE_STATE, {
            id: this.state.chapterId,
            chapter_key: [],
            topic_key: topicEventKey,
        });
    };

    handlePublish = () => {
        this.setState({
            showErrorAlert: false,
            showSuccessAlert: false,
            page_loading: true,
        });

        let URL =
            this.groupId !== undefined
                ? `${this.url}/teacher/subject/${this.subjectId}/chapter/publish/`
                : `${this.url}/teacher/independent/subject/${this.subjectId}/chapter/publish/`;

        fetch(URL, {
            method: "POST",
            headers: this.headers,
            body: JSON.stringify({
                chapter_id: this.state.chapterId,
            }),
        })
            .then((res) => res.json())
            .then((result) => {
                if (result.sts === true) {
                    this.setState({
                        successMsg: result.msg,
                        showSuccessAlert: true,
                        page_loading: false,
                    });
                    this.loadTopicData();
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

    dispatchTopic = (data) => {
        storeDispatch(TOPIC, data);
    };

    dispatchCycle = (data) => {
        storeDispatch(CYCLE, data);
    };

    dispatchQuiz = (data) => {
        storeDispatch(QUIZ, data);
    };

    render() {
        document.title = `${this.props.chapter_name} - Teacher | IQLabs`;
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

                {/* Topic modal */}
                {this.state.showTopicModal ? (
                    <TopicModal
                        show={this.state.showTopicModal}
                        onHide={this.toggleTopicModal}
                        formSubmission={this.topic_formSubmission}
                        subjectId={this.subjectId}
                        chapterId={this.state.chapterId}
                        topics={this.state.topics}
                        activeTopic={this.state.activeTopic}
                        ancestor={this.state.ancestor}
                    />
                ) : (
                    ""
                )}

                {/* Topic edit modal */}
                {this.state.showTopic_EditModal ? (
                    <ContentUpdateModal
                        show={this.state.showTopic_EditModal}
                        onHide={this.toggleTopic_EditModal}
                        formSubmission={this.topic_formSubmission}
                        url={`${this.url}/teacher/subject/${this.subjectId}/chapter/topics/`}
                        type="Topic"
                        name={this.state.selectedTopicData.topic_name}
                        data={{
                            chapter_id: this.state.chapterId,
                            topic_num: this.state.selectedTopicData.topic_num,
                            topic_name: this.state.selectedTopicData.topic_name,
                            ancestor: this.state.selectedTopicData.ancestor,
                        }}
                    />
                ) : (
                    ""
                )}

                {/* Topic Delete modal */}
                {this.state.showTopic_DeleteModal ? (
                    <SingleContentDeleteModal
                        show={this.state.showTopic_DeleteModal}
                        onHide={this.toggleTopic_DeleteModal}
                        formSubmission={this.topic_formSubmission}
                        url={`${this.url}/teacher/subject/${this.subjectId}/chapter/topics/`}
                        type="Topic"
                        name={this.state.selectedTopicData.topic_name}
                        data={{
                            chapter_id: this.state.chapterId,
                            topic_num: this.state.selectedTopicData.topic_num,
                            ancestor: this.state.selectedTopicData.ancestor,
                        }}
                    />
                ) : (
                    ""
                )}

                {/* Cycle test modal */}
                {this.state.showCycle_TestModal ? (
                    <CycleTestModal
                        show={this.state.showCycle_TestModal}
                        onHide={this.toggleCycleTestModal}
                        formSubmission={this.cycleTest_formSubmission}
                        subjectId={this.subjectId}
                        chapter_id={this.state.chapterId}
                    />
                ) : (
                    ""
                )}

                {/* Cycle test edit modal */}
                {this.state.showCycle_EditModal ? (
                    <ContentUpdateModal
                        show={this.state.showCycle_EditModal}
                        onHide={this.toggleCycle_EditModal}
                        formSubmission={this.cycleTest_formSubmission}
                        url={`${this.url}/teacher/subject/${this.subjectId}/cycle/`}
                        type="Cycle test"
                        name={this.state.selectedCycleData.cycle_test_name}
                        data={{
                            chapter_id: this.state.chapterId,
                            cycle_test_id:
                                this.state.selectedCycleData.cycle_test_id,
                            cycle_test_name:
                                this.state.selectedCycleData.cycle_test_name,
                        }}
                    />
                ) : (
                    ""
                )}

                {/* Cycle test Delete modal */}
                {this.state.showCycle_DeleteModal ? (
                    <SingleContentDeleteModal
                        show={this.state.showCycle_DeleteModal}
                        onHide={this.toggleCycle_DeleteModal}
                        formSubmission={this.cycleTest_formSubmission}
                        url={`${this.url}/teacher/subject/${this.subjectId}/cycle/`}
                        type="Cycle test"
                        name={this.state.selectedCycleData.cycle_test_name}
                        data={{
                            chapter_id: this.state.chapterId,
                            cycle_test_id:
                                this.state.selectedCycleData.cycle_test_id,
                        }}
                    />
                ) : (
                    ""
                )}

                {/* Independent Cycle test modal */}
                {this.state.showIndependentCycle_TestModal ? (
                    <IndependentCycleTestModal
                        show={this.state.showIndependentCycle_TestModal}
                        onHide={this.toggleCycleTestModal}
                        formSubmission={this.cycleTest_formSubmission}
                        subjectId={this.subjectId}
                        chapter_id={this.state.chapterId}
                    />
                ) : (
                    ""
                )}

                {/* Independent Cycle test edit modal */}
                {this.state.showIndependentCycle_EditModal ? (
                    <IndependentCycleEditModal
                        show={this.state.showIndependentCycle_EditModal}
                        onHide={this.toggleCycle_EditModal}
                        formSubmission={this.cycleTest_formSubmission}
                        subjectId={this.subjectId}
                        chapter_id={this.state.chapterId}
                        data={this.state.selectedCycleData}
                    />
                ) : (
                    ""
                )}

                {/* Quiz creation modal */}
                {this.state.showQuiz_CreateModal ? (
                    <QuizModal
                        show={this.state.showQuiz_CreateModal}
                        onHide={this.toggleQuiz_CreateModal}
                        formSubmission={this.quiz_formSubmission}
                        subjectId={this.subjectId}
                        chapterId={this.state.chapterId}
                    />
                ) : (
                    ""
                )}

                {/* Quiz edit modal */}
                {this.state.showQuiz_EditModal ? (
                    <ContentUpdateModal
                        show={this.state.showQuiz_EditModal}
                        onHide={this.toggleQuiz_EditModal}
                        formSubmission={this.quiz_formSubmission}
                        url={`${this.url}/teacher/subject/${this.subjectId}/chapter/${this.state.chapterId}/quiz/`}
                        type="Quiz"
                        name={this.state.selectedQuizData.quiz_name}
                        data={{
                            quiz_id: this.state.selectedQuizData.quiz_id,
                            quiz_name: this.state.selectedQuizData.quiz_name,
                        }}
                        toggleModal={this.toggleQuiz_EditModal}
                    />
                ) : (
                    ""
                )}

                {/* Quiz Delete modal */}
                {this.state.showQuiz_DeleteModal ? (
                    <SingleContentDeleteModal
                        show={this.state.showQuiz_DeleteModal}
                        onHide={this.toggleQuiz_DeleteModal}
                        formSubmission={this.quiz_formSubmission}
                        url={`${this.url}/teacher/subject/${this.subjectId}/chapter/${this.state.chapterId}/quiz/`}
                        type="Quiz"
                        name={this.state.selectedQuizData.quiz_name}
                        data={{
                            quiz_id: this.state.selectedQuizData.quiz_id,
                        }}
                    />
                ) : (
                    ""
                )}

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
                        <li className="breadcrumb-item active">
                            <span>Chapter:</span>
                            {this.state.chapterName}
                        </li>
                    </ol>
                </nav>

                <div className="row align-items-center mb-3">
                    <div className="col-md-4">
                        <Select
                            className="basic-single form-shadow"
                            placeholder="Select chapter"
                            isSearchable={true}
                            name="chapter"
                            value={(this.props.subject_data.results || []).map(
                                (list) => {
                                    return this.props.chapter_name ===
                                        list.chapter_name
                                        ? {
                                              value: list.chapter_id,
                                              label: list.chapter_name,
                                          }
                                        : "";
                                }
                            )}
                            options={(
                                this.props.subject_data.results || []
                            ).map(function (list) {
                                return {
                                    value: list.chapter_id,
                                    label: list.chapter_name,
                                };
                            })}
                            onChange={this.handleSelect}
                            required
                        />
                    </div>
                    <div className="col-md-8 text-right">
                        <button
                            className="btn btn-primary btn-sm shadow-none"
                            onClick={this.handlePublish}
                        >
                            {this.groupId !== undefined
                                ? this.state.publish
                                    ? "Unpublish"
                                    : "Publish to Group"
                                : this.state.publish
                                ? "Published"
                                : "Publish to HOD"}
                        </button>
                    </div>
                </div>

                {/* Course details */}
                <div className="card shadow-sm mb-3 overflow-auto">
                    <div style={{ minWidth: "1100px" }}>
                        <div className="card-header secondary-bg primary-text font-weight-bold">
                            <div className="row align-items-center">
                                <div className="col-4">Topic structure</div>
                                <div className="col-8 small primary-text font-weight-bold">
                                    <div className="row justify-content-end">
                                        <div className="col-2">Notes</div>
                                        <div className="col-2">Match</div>
                                        <div className="col-2">Concept</div>
                                        <div className="col-2">Type 1 Q</div>
                                        <div className="col-2">Type 2 Q</div>
                                        <div className="col-2">Next topic</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="card-body">
                            <Accordion defaultActiveKey="0">
                                <Card>
                                    <Accordion.Toggle
                                        as={Card.Header}
                                        eventKey="0"
                                        className="secondary-bg shadow-sm mb-2 py-3"
                                        style={{ borderRadius: "8px" }}
                                        onClick={() => {
                                            this.setState({
                                                collapsed:
                                                    !this.state.collapsed,
                                            });
                                        }}
                                    >
                                        <div className="row align-items-center">
                                            <div className="col-4">
                                                <div className="row align-items-center">
                                                    <div className="col-1">
                                                        <span>
                                                            <i
                                                                className={`fas fa-chevron-circle-down ${
                                                                    this.state
                                                                        .collapsed
                                                                        ? "fa-rotate-270"
                                                                        : ""
                                                                }`}
                                                            ></i>
                                                        </span>
                                                    </div>
                                                    <div className="col-10 d-flex small font-weight-bold">
                                                        <div className="mr-3">
                                                            {
                                                                this.state
                                                                    .chapterIndex
                                                            }
                                                        </div>
                                                        <div>
                                                            {
                                                                this.props
                                                                    .chapter_name
                                                            }
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </Accordion.Toggle>

                                    <Accordion.Collapse eventKey="0">
                                        <Card>
                                            {/* ----- Topic list ----- */}
                                            {this.state.topics &&
                                            this.state.topics.length !== 0
                                                ? this.state.topics.map(
                                                      (data, index) => {
                                                          return (
                                                              <Accordion
                                                                  key={index}
                                                                  activeKey={this.state.topicEventKey.find(
                                                                      (
                                                                          element
                                                                      ) =>
                                                                          element ===
                                                                          data.topic_num
                                                                  )}
                                                              >
                                                                  {this.topicRender(
                                                                      data
                                                                  )}
                                                              </Accordion>
                                                          );
                                                      }
                                                  )
                                                : null}

                                            {/* ----- Cycle test list ----- */}
                                            {this.state.cycle_test.length !== 0
                                                ? this.state.cycle_test.map(
                                                      (data, index) => {
                                                          return (
                                                              <div
                                                                  className="card card-header shadow-sm light-bg mb-2"
                                                                  key={index}
                                                              >
                                                                  <div className="row align-items-center">
                                                                      <div className="col-6">
                                                                          <p className="small primary-text font-weight-bold-600 mb-0">
                                                                              {
                                                                                  data.cycle_test_name
                                                                              }
                                                                          </p>
                                                                      </div>
                                                                      <div className="col-6 pr-0 d-flex align-items-center justify-content-end">
                                                                          {/* checks if both the permission exist */}
                                                                          {data.auto_test_perm ===
                                                                              true &&
                                                                          data.direct_perm ===
                                                                              true ? (
                                                                              // checks if auto content is available
                                                                              data.auto_test_question ===
                                                                              true ? (
                                                                                  <Link
                                                                                      to={`${this.props.match.url}/cycle/${data.cycle_test_id}`}
                                                                                  >
                                                                                      <button
                                                                                          className="btn btn-primary btn-sm shadow-none"
                                                                                          onClick={() =>
                                                                                              this.dispatchCycle(
                                                                                                  data.cycle_test_name
                                                                                              )
                                                                                          }
                                                                                      >
                                                                                          Auto
                                                                                      </button>
                                                                                  </Link>
                                                                              ) : // or if direct content is available
                                                                              data.direct_question ===
                                                                                true ? (
                                                                                  // checks if it is a independent subject
                                                                                  this
                                                                                      .props
                                                                                      .subject_data
                                                                                      .is_independent ===
                                                                                  false ? (
                                                                                      <Link
                                                                                          to={`${this.props.match.url}/cycle/${data.cycle_test_id}/direct`}
                                                                                      >
                                                                                          <button
                                                                                              className="btn btn-primary btn-sm shadow-none ml-2"
                                                                                              onClick={() =>
                                                                                                  this.dispatchCycle(
                                                                                                      data.cycle_test_name
                                                                                                  )
                                                                                              }
                                                                                          >
                                                                                              Direct
                                                                                              Test
                                                                                          </button>
                                                                                      </Link>
                                                                                  ) : (
                                                                                      ""
                                                                                  )
                                                                              ) : (
                                                                                  // or display both the button
                                                                                  <>
                                                                                      <Link
                                                                                          to={`${this.props.match.url}/cycle/${data.cycle_test_id}`}
                                                                                      >
                                                                                          <button
                                                                                              className="btn btn-primary btn-sm shadow-none"
                                                                                              onClick={() =>
                                                                                                  this.dispatchCycle(
                                                                                                      data.cycle_test_name
                                                                                                  )
                                                                                              }
                                                                                          >
                                                                                              Auto
                                                                                          </button>
                                                                                      </Link>
                                                                                      {/* checks if it is a independent subject */}
                                                                                      {this
                                                                                          .props
                                                                                          .subject_data
                                                                                          .is_independent ===
                                                                                      false ? (
                                                                                          <Link
                                                                                              to={`${this.props.match.url}/cycle/${data.cycle_test_id}/direct`}
                                                                                          >
                                                                                              <button
                                                                                                  className="btn btn-primary btn-sm shadow-none ml-2"
                                                                                                  onClick={() =>
                                                                                                      this.dispatchCycle(
                                                                                                          data.cycle_test_name
                                                                                                      )
                                                                                                  }
                                                                                              >
                                                                                                  Direct
                                                                                                  Test
                                                                                              </button>
                                                                                          </Link>
                                                                                      ) : (
                                                                                          ""
                                                                                      )}
                                                                                  </>
                                                                              )
                                                                          ) : // checks if auto permission exist
                                                                          data.auto_test_perm ===
                                                                            true ? (
                                                                              <Link
                                                                                  to={`${this.props.match.url}/cycle/${data.cycle_test_id}`}
                                                                              >
                                                                                  <button
                                                                                      className="btn btn-primary btn-sm shadow-none"
                                                                                      onClick={() =>
                                                                                          this.dispatchCycle(
                                                                                              data.cycle_test_name
                                                                                          )
                                                                                      }
                                                                                  >
                                                                                      Auto
                                                                                  </button>
                                                                              </Link>
                                                                          ) : // checks if direct permission exist
                                                                          data.direct_perm ===
                                                                            true ? (
                                                                              // checks if it is a independent subject
                                                                              this
                                                                                  .props
                                                                                  .subject_data
                                                                                  .is_independent ===
                                                                              false ? (
                                                                                  <Link
                                                                                      to={`${this.props.match.url}/cycle/${data.cycle_test_id}/direct`}
                                                                                  >
                                                                                      <button
                                                                                          className="btn btn-primary btn-sm shadow-none ml-2"
                                                                                          onClick={() =>
                                                                                              this.dispatchCycle(
                                                                                                  data.cycle_test_name
                                                                                              )
                                                                                          }
                                                                                      >
                                                                                          Direct
                                                                                          Test
                                                                                      </button>
                                                                                  </Link>
                                                                              ) : (
                                                                                  ""
                                                                              )
                                                                          ) : (
                                                                              // or else prints nothing
                                                                              ""
                                                                          )}
                                                                          <Dropdown>
                                                                              <Dropdown.Toggle
                                                                                  variant="white"
                                                                                  className="btn btn-link btn-sm shadow-none caret-off ml-2"
                                                                              >
                                                                                  <i className="fas fa-ellipsis-v"></i>
                                                                              </Dropdown.Toggle>

                                                                              <Dropdown.Menu>
                                                                                  <Dropdown.Item
                                                                                      onClick={() =>
                                                                                          this.toggleCycle_EditModal(
                                                                                              data
                                                                                          )
                                                                                      }
                                                                                  >
                                                                                      <i className="far fa-edit fa-sm mr-1"></i>{" "}
                                                                                      Edit
                                                                                  </Dropdown.Item>
                                                                                  <Dropdown.Item
                                                                                      onClick={() =>
                                                                                          this.toggleCycle_DeleteModal(
                                                                                              data
                                                                                          )
                                                                                      }
                                                                                  >
                                                                                      <i className="far fa-trash-alt fa-sm mr-1"></i>{" "}
                                                                                      Delete
                                                                                  </Dropdown.Item>
                                                                              </Dropdown.Menu>
                                                                          </Dropdown>
                                                                      </div>
                                                                  </div>
                                                              </div>
                                                          );
                                                      }
                                                  )
                                                : null}

                                            {/* ----- Quiz list ----- */}
                                            {Object.entries(this.state.quiz)
                                                .length !== 0 ? (
                                                <div className="card card-header shadow-sm light-bg mb-2">
                                                    <div className="row align-items-center">
                                                        <div className="col-6">
                                                            <p className="small primary-text font-weight-bold-600 mb-0">
                                                                {
                                                                    this.state
                                                                        .quiz
                                                                        .quiz_name
                                                                }
                                                            </p>
                                                        </div>
                                                        <div className="col-6 pr-0 d-flex align-items-center justify-content-end">
                                                            <Link
                                                                to={`${this.props.match.url}/quiz/${this.state.quiz.quiz_id}`}
                                                            >
                                                                <button
                                                                    className="btn btn-primary btn-sm shadow-none"
                                                                    onClick={() =>
                                                                        this.dispatchQuiz(
                                                                            this
                                                                                .state
                                                                                .quiz
                                                                                .quiz_name
                                                                        )
                                                                    }
                                                                >
                                                                    View / Edit
                                                                </button>
                                                            </Link>
                                                            <Dropdown>
                                                                <Dropdown.Toggle
                                                                    variant="white"
                                                                    className="btn btn-link btn-sm shadow-none caret-off ml-2"
                                                                >
                                                                    <i className="fas fa-ellipsis-v"></i>
                                                                </Dropdown.Toggle>

                                                                <Dropdown.Menu>
                                                                    <Dropdown.Item
                                                                        onClick={() =>
                                                                            this.toggleQuiz_EditModal(
                                                                                this
                                                                                    .state
                                                                                    .quiz
                                                                            )
                                                                        }
                                                                    >
                                                                        <i className="far fa-edit fa-sm mr-1"></i>{" "}
                                                                        Edit
                                                                    </Dropdown.Item>
                                                                    <Dropdown.Item
                                                                        onClick={() =>
                                                                            this.toggleQuiz_DeleteModal(
                                                                                this
                                                                                    .state
                                                                                    .quiz
                                                                            )
                                                                        }
                                                                    >
                                                                        <i className="far fa-trash-alt fa-sm mr-1"></i>{" "}
                                                                        Delete
                                                                    </Dropdown.Item>
                                                                </Dropdown.Menu>
                                                            </Dropdown>
                                                        </div>
                                                    </div>
                                                </div>
                                            ) : (
                                                ""
                                            )}
                                        </Card>
                                    </Accordion.Collapse>
                                </Card>
                            </Accordion>
                        </div>
                    </div>
                </div>

                <button
                    className="btn btn-tomato btn-block shadow-sm"
                    onClick={() =>
                        this.toggleTopicModal(this.state.chapterIndex, "")
                    }
                >
                    Add Topic
                </button>
                <button
                    className="btn btn-tomato btn-block shadow-sm"
                    onClick={this.toggleCycleTestModal}
                >
                    Add Cycle test
                </button>
                {this.props.subject_data.permissions !== undefined ? (
                    this.props.subject_data.permissions.quiz !== undefined ? (
                        this.props.subject_data.permissions.quiz === true &&
                        this.props.subject_data.permissions.type_1_q ===
                            true ? (
                            <button
                                className="btn btn-tomato btn-block shadow-sm"
                                onClick={this.toggleQuiz_CreateModal}
                                disabled={
                                    Object.entries(this.state.quiz).length !== 0
                                        ? true
                                        : false
                                }
                            >
                                Add Quiz
                            </button>
                        ) : (
                            ""
                        )
                    ) : (
                        <button
                            className="btn btn-tomato btn-block shadow-sm"
                            disabled
                        >
                            Add Quiz
                        </button>
                    )
                ) : (
                    <button
                        className="btn btn-tomato btn-block shadow-sm"
                        disabled
                    >
                        Add Quiz
                    </button>
                )}

                {/* Loading component */}
                {this.state.page_loading ? <Loading /> : ""}
            </Wrapper>
        );
    }
}

export default connect(mapStateToProps)(TeacherChapters);
