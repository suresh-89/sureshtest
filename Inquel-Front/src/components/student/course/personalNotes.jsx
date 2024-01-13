import React, { Component } from "react";
import Wrapper from "../wrapper";
import { Accordion, Card, Modal, Alert } from "react-bootstrap";
import { Link } from "react-router-dom";
import Loading from "../../common/loader";
import AlertBox from "../../common/alert";
import { baseUrl, studentUrl } from "../../../shared/baseUrl.js";
import { connect } from "react-redux";

const mapStateToProps = (state) => ({
    course_data: state.storage.response,
    course_name: state.content.course_name,
});

class NotesModal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: "",
            errorMsg: "",
            successMsg: "",
            showErrorAlert: false,
            showSuccessAlert: false,
            showLoader: false,
        };
        this.url = baseUrl + studentUrl;
        this.authToken = localStorage.getItem("Authorization");
        this.headers = {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: this.authToken,
        };
    }

    componentDidMount = async () => {
        await this.setState({
            data: this.props.data,
        });
        window.MathJax.typeset();
    };

    handleDelete = () => {
        let body = {
            topic_num: this.props.topic_num,
            personal_notes_id: this.state.data.personal_notes_id,
        };
        if (this.state.data.type === "concept") {
            body["concept"] = true;
            body["question"] = false;
        } else {
            body["concept"] = false;
            body["question"] = true;
        }
        fetch(
            `${this.url}/student/sub/${this.props.subscriptionId}/course/${this.props.courseId}/chapter/${this.props.chapterId}/personal_notes/`,
            {
                headers: this.headers,
                method: "DELETE",
                body: JSON.stringify(body),
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
                    this.props.formSubmission();
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
    };

    render() {
        return (
            <Modal
                show={this.props.show}
                onHide={this.props.onHide}
                size="xl"
                aria-labelledby="contained-modal-title-vcenter"
                centered
                scrollable
            >
                <Modal.Header closeButton>Personal notes</Modal.Header>
                <Modal.Body>
                    <Alert
                        variant="danger"
                        show={this.state.showErrorAlert}
                        onClose={() => {
                            this.setState({
                                showErrorAlert: false,
                            });
                        }}
                        dismissible
                    >
                        {this.state.errorMsg}
                    </Alert>
                    <Alert
                        variant="success"
                        show={this.state.showSuccessAlert}
                        onClose={() => {
                            this.setState({
                                showSuccessAlert: false,
                            });
                        }}
                        dismissible
                    >
                        {this.state.successMsg}
                    </Alert>

                    <div
                        className="user-select-none"
                        style={{ minHeight: "50vh" }}
                    >
                        <div className="h5 font-weight-bold-600 mb-3">
                            {this.state.data.personal_notes_title}
                        </div>
                        <div
                            dangerouslySetInnerHTML={{
                                __html: this.state.data.personal_notes_content,
                            }}
                        ></div>
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <button
                        className="btn btn-link btn-sm text-danger shadow-none"
                        onClick={this.handleDelete}
                    >
                        <i className="fas fa-trash-alt fa-sm mr-1"></i> Delete
                    </button>
                </Modal.Footer>
            </Modal>
        );
    }
}

class CoursePersonalNotes extends Component {
    constructor(props) {
        super(props);
        this.state = {
            showModal: false,
            topicEventKey: [],
            notesData: "",

            chapterId: "",
            topicName: "",
            topic_num: "",
            selectedData: "",

            errorMsg: "",
            successMsg: "",
            showErrorAlert: false,
            showSuccessAlert: false,
            page_loading: false,
        };
        this.subscriptionId = this.props.match.params.subscriptionId;
        this.courseId = this.props.match.params.courseId;
        this.url = baseUrl + studentUrl;
        this.authToken = localStorage.getItem("Authorization");
        this.headers = {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: this.authToken,
        };
    }

    loadNotesData = async () => {
        await fetch(
            `${this.url}/student/sub/${this.subscriptionId}/course/${this.courseId}/chapter/${this.state.chapterId}/personal_notes/`,
            {
                method: "GET",
                headers: this.headers,
            }
        )
            .then((res) => res.json())
            .then((result) => {
                if (result.sts === true) {
                    let notes = {};
                    let response = result.data;
                    if (response.length !== 0) {
                        response.forEach((item) => {
                            notes[item.topic_num] = [];
                            if (item.concepts.length !== 0) {
                                item.concepts.forEach((concept) => {
                                    concept["type"] = "concept";
                                    notes[item.topic_num].push(concept);
                                });
                            }
                            if (item.questions.length !== 0) {
                                item.questions.forEach((question) => {
                                    question["type"] = "question";
                                    notes[item.topic_num].push(question);
                                });
                            }
                        });
                    }
                    this.setState({
                        notesData: notes,
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
        window.MathJax.typeset();
    };

    componentDidMount = () => {
        document.title = `Personal Notes - Student | IQLabs`;

        let topicEventKey = [];
        try {
            if (
                this.props.course_data.units &&
                this.props.course_data.units.length !== 0
            ) {
                this.props.course_data.units.forEach((data) => {
                    let temp = [];
                    if (data.chapters && data.chapters.length !== 0) {
                        data.chapters.forEach((item, index) => {
                            temp.push([]);
                        });
                    }
                    topicEventKey.push(temp);
                });
            }
        } catch (error) {
            console.error(error);
            this.setState({
                errorMsg: "Something went wrong!",
                showErrorAlert: true,
                page_loading: false,
            });
        }
        this.setState({
            topicEventKey: topicEventKey,
        });
    };

    toggleChapterCollapse = (key) => {
        try {
            let chapterId = "";
            if (this.state.chapterId !== key) {
                chapterId = key;
            }

            let topicName = "";
            let topic_num = "";
            (this.state.data || []).forEach((unit) => {
                (unit.chapters || []).forEach((chapter) => {
                    if (chapter.chapter_id === key) {
                        topicName = chapter.topics
                            ? chapter.topics[0].topic_name
                            : "Topic";
                        topic_num = chapter.topics
                            ? chapter.topics[0].topic_num
                            : "1.1";
                    }
                });
            });
            this.setState(
                {
                    chapterId: chapterId,
                    topicName: topicName,
                    topic_num: topic_num,
                },
                () => {
                    if (this.state.chapterId === key) {
                        this.setState({
                            page_loading: true,
                        });
                        this.loadNotesData();
                    }
                }
            );
        } catch (error) {
            console.error(error);
            this.setState({
                errorMsg: "Something went wrong!",
                showErrorAlert: true,
            });
        }
    };

    toggleTopicCollapse = (key, unit_index, chapter_index) => {
        try {
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
        } catch (error) {
            console.error(error);
            this.setState({
                errorMsg: "Something went wrong!",
                showErrorAlert: true,
            });
        }
    };

    // loads data on selecting a topic
    handleSelect = (topicName, topic_num) => {
        this.setState({
            topicName: topicName,
            topic_num: topic_num,
        });
    };

    // topic list
    topic = (data, index, chapter_index, unit_index) => {
        const nestedTopics = (data.child || []).map((topic, index) => {
            return (
                <Accordion key={index}>
                    {this.topic(topic, index, chapter_index, unit_index)}
                </Accordion>
            );
        });

        let topicEventKey = this.state.topicEventKey;

        return (
            <>
                <Accordion.Toggle
                    as={Card.Header}
                    eventKey={`topic-${index}-${data.topic_num}`}
                    className={`${
                        this.state.topic_num === data.topic_num &&
                        this.state.topicName === data.topic_name
                            ? "light-bg"
                            : "bg-light"
                    } shadow-sm py-2 align-items-center mb-2`}
                    style={{
                        borderRadius: "8px",
                        cursor: "default",
                    }}
                    onClick={() =>
                        data.child.length !== 0
                            ? this.toggleTopicCollapse(
                                  `topic-${index}-${data.topic_num}`,
                                  unit_index,
                                  chapter_index
                              )
                            : ""
                    }
                >
                    <div className="row align-items-center">
                        <div className="col-9">
                            <div className="row align-items-center">
                                {data.child.length !== 0 ? (
                                    <div className="col-1">
                                        <span>
                                            <i
                                                className={`fas fa-chevron-circle-down ${
                                                    topicEventKey[unit_index]
                                                        ? topicEventKey[
                                                              unit_index
                                                          ][chapter_index]
                                                            ? topicEventKey[
                                                                  unit_index
                                                              ][
                                                                  chapter_index
                                                              ].includes(
                                                                  `topic-${index}-${data.topic_num}`
                                                              )
                                                                ? "fa-rotate-360"
                                                                : "fa-rotate-270"
                                                            : "fa-rotate-270"
                                                        : "fa-rotate-270"
                                                }`}
                                            ></i>
                                        </span>
                                    </div>
                                ) : (
                                    ""
                                )}
                                <div
                                    className={`${
                                        data.child.length !== 0
                                            ? "col-9 pr-0"
                                            : "col-12"
                                    } d-flex small font-weight-bold-600`}
                                >
                                    <div className="mr-2">{data.topic_num}</div>
                                    <div className="w-100 text-truncate">
                                        {data.topic_name}
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-3 text-right pr-1">
                            <button
                                className="btn btn-link btn-sm shadow-none"
                                onClick={(e) => {
                                    this.handleSelect(
                                        data.topic_name,
                                        data.topic_num
                                    );
                                    e.stopPropagation();
                                }}
                            >
                                <i className="fas fa-eye"></i>
                            </button>
                        </div>
                    </div>
                </Accordion.Toggle>

                <Accordion.Collapse
                    eventKey={`topic-${index}-${data.topic_num}`}
                    className="ml-2"
                >
                    <div>{nestedTopics}</div>
                </Accordion.Collapse>
            </>
        );
    };

    toggleModal = (data) => {
        this.setState({
            showModal: !this.state.showModal,
            selectedData: data,
        });
    };

    formSubmission = () => {
        setTimeout(() => {
            this.setState({
                showModal: false,
                chapterId: this.state.chapterId,
                topic_num: this.state.topic_num,
                topicName: this.state.topicName,
            });
        }, 1000);
        this.loadNotesData();
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

                {/* ----- Personal notes modal ----- */}
                {this.state.showModal ? (
                    <NotesModal
                        show={this.state.showModal}
                        onHide={this.toggleModal}
                        data={this.state.selectedData}
                        subscriptionId={this.subscriptionId}
                        courseId={this.courseId}
                        chapterId={this.state.chapterId}
                        topic_num={this.state.topic_num}
                        formSubmission={this.formSubmission}
                    />
                ) : (
                    ""
                )}

                {/* ----- Breadcrumb ----- */}
                <nav aria-label="breadcrumb">
                    <ol className="breadcrumb mb-3">
                        <li className="breadcrumb-item">
                            <Link to="/dashboard">
                                <i className="fas fa-home fa-sm"></i>
                            </Link>
                        </li>
                        <li className="breadcrumb-item">
                            <Link to="#" onClick={this.props.history.goBack}>
                                {this.props.course_name}
                            </Link>
                        </li>
                        <li className="breadcrumb-item active">
                            Personal Notes
                        </li>
                    </ol>
                </nav>

                <div className="card shadow-sm">
                    <div className="card-body">
                        <div className="row">
                            {/* ----- Chapter list ----- */}
                            <div className="col-md-3 mb-2 mb-md-0 border-right">
                                <Accordion
                                    defaultActiveKey={this.state.chapterId}
                                >
                                    {(this.props.course_data.units || []).map(
                                        (unit, unit_index) => {
                                            return (
                                                <fieldset
                                                    className="border-primary mb-2"
                                                    key={unit_index}
                                                >
                                                    <legend className="border-primary primary-text">
                                                        {unit.unit_name}
                                                    </legend>
                                                    {/* ----- Chapter list ----- */}
                                                    {(unit.chapters || []).map(
                                                        (
                                                            chapter,
                                                            chapter_index
                                                        ) => {
                                                            return (
                                                                <Card
                                                                    className="mb-1"
                                                                    key={
                                                                        chapter_index
                                                                    }
                                                                >
                                                                    <Accordion.Toggle
                                                                        as={
                                                                            Card.Header
                                                                        }
                                                                        eventKey={
                                                                            chapter.chapter_id
                                                                        }
                                                                        className="pinkrange-bg shadow-sm mb-2"
                                                                        style={{
                                                                            borderRadius:
                                                                                "8px",
                                                                            cursor: "default",
                                                                        }}
                                                                        onClick={() =>
                                                                            this.toggleChapterCollapse(
                                                                                chapter.chapter_id
                                                                            )
                                                                        }
                                                                    >
                                                                        <div className="row align-items-center">
                                                                            <div className="col-1">
                                                                                <span>
                                                                                    <i
                                                                                        className={`fas fa-chevron-circle-down ${
                                                                                            this
                                                                                                .state
                                                                                                .chapterId ===
                                                                                            chapter.chapter_id
                                                                                                ? ""
                                                                                                : "fa-rotate-270"
                                                                                        }`}
                                                                                    ></i>
                                                                                </span>
                                                                            </div>
                                                                            <div className="col-10 small font-weight-bold-600">
                                                                                {
                                                                                    chapter.chapter_name
                                                                                }
                                                                            </div>
                                                                        </div>
                                                                    </Accordion.Toggle>

                                                                    <Accordion.Collapse
                                                                        eventKey={
                                                                            chapter.chapter_id
                                                                        }
                                                                    >
                                                                        <Card>
                                                                            {(
                                                                                chapter.topics ||
                                                                                []
                                                                            ).map(
                                                                                (
                                                                                    topics,
                                                                                    topic_index
                                                                                ) => {
                                                                                    return (
                                                                                        <Accordion
                                                                                            key={
                                                                                                topic_index
                                                                                            }
                                                                                        >
                                                                                            {this.topic(
                                                                                                topics,
                                                                                                topic_index,
                                                                                                chapter_index,
                                                                                                unit_index
                                                                                            )}
                                                                                        </Accordion>
                                                                                    );
                                                                                }
                                                                            )}
                                                                        </Card>
                                                                    </Accordion.Collapse>
                                                                </Card>
                                                            );
                                                        }
                                                    )}
                                                </fieldset>
                                            );
                                        }
                                    )}
                                </Accordion>
                            </div>

                            {/* ---------- Notes data ---------- */}

                            <div className="col-md-9 pl-md-0">
                                <div className="card card-body py-0">
                                    {Object.entries(this.state.notesData)
                                        .length !== 0 ? (
                                        this.state.notesData[
                                            this.state.topic_num
                                        ] &&
                                        this.state.notesData[
                                            this.state.topic_num
                                        ].length !== 0 ? (
                                            <div className="row">
                                                {this.state.notesData[
                                                    this.state.topic_num
                                                ].map((data, index) => {
                                                    return (
                                                        <div
                                                            className="col-md-6 mb-3"
                                                            key={index}
                                                        >
                                                            <div className="card light-bg shadow-sm">
                                                                <div className="card-body">
                                                                    <div className="row align-items-center pr-2">
                                                                        <div className="col-10 primary-text font-weight-bold-600 small">
                                                                            {
                                                                                data.personal_notes_title
                                                                            }
                                                                        </div>
                                                                        <div className="col-2">
                                                                            <button
                                                                                className="btn btn-primary btn-sm shadow-none"
                                                                                onClick={() =>
                                                                                    this.toggleModal(
                                                                                        data
                                                                                    )
                                                                                }
                                                                            >
                                                                                View
                                                                            </button>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        ) : (
                                            "No content to display..."
                                        )
                                    ) : (
                                        "No content to display..."
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Loading component */}
                {this.state.page_loading ? <Loading /> : ""}
            </Wrapper>
        );
    }
}

export default connect(mapStateToProps)(CoursePersonalNotes);
