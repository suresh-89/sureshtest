import React, { Component, lazy, Suspense } from "react";
import Wrapper from "../wrapper";
import { Accordion, Card } from "react-bootstrap";
import { Link } from "react-router-dom";
import Loading from "../../common/loader";
import AlertBox from "../../common/alert";
import { baseUrl, studentUrl } from "../../../shared/baseUrl.js";
import { connect } from "react-redux";

const DirectPDF = lazy(() => import("../../common/preview/DirectPDF"));

const mapStateToProps = (state) => ({
    subject_data: state.storage.response,
    subject_name: state.content.subject_name,
});

class Notes extends Component {
    constructor(props) {
        super(props);
        this.state = {
            collapsed: [],
            topicEventKey: [],

            notesData: "",
            chapterId: this.props.match.params.chapterId,
            topicName: "",
            topic_num: "",

            errorMsg: "",
            successMsg: "",
            showErrorAlert: false,
            showSuccessAlert: false,
            page_loading: true,
        };
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
        let collapsed = [];
        let topicEventKey = [];
        let topicName = "";
        let topic_num = "";

        try {
            for (let i = 0; i < this.props.subject_data.chapters.length; i++) {
                // adds collapse state
                collapsed.push(
                    this.props.subject_data.chapters[i].chapter_id ===
                        this.state.chapterId
                        ? false
                        : true
                );
                topicEventKey.push([]);
                // extract topic name from the current chapter
                if (
                    this.props.subject_data.chapters[i].chapter_id ===
                    this.state.chapterId
                ) {
                    topicName =
                        this.props.subject_data.chapters[i].topics.length !== 0
                            ? this.props.subject_data.chapters[i].topics[0]
                                  .topic_name
                            : "Topic";
                    topic_num =
                        this.props.subject_data.chapters[i].topics.length !== 0
                            ? this.props.subject_data.chapters[i].topics[0]
                                  .topic_num
                            : "1.1";
                } else {
                    continue;
                }
            }
        } catch (error) {
            console.error(error);
            this.setState({
                errorMsg: "Something went wrong!",
                showErrorAlert: true,
                page_loading: false,
            });
        }

        this.setState(
            {
                collapsed: collapsed,
                topic_num: topic_num,
                topicName: topicName,
                topicEventKey: topicEventKey,
            },
            () => {
                this.loadNotesData();
            }
        );
    };

    // loads notes data
    loadNotesData = async () => {
        await fetch(
            `${this.url}/student/subject/${this.subjectId}/chapter/${this.state.chapterId}/notes/?topic_num=${this.state.topic_num}`,
            {
                method: "GET",
                headers: this.headers,
            }
        )
            .then((res) => res.json())
            .then((result) => {
                if (result.sts === true) {
                    this.setState({
                        notesData: result.data,
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

    toggleCollapse = (index, chapter_id) => {
        try {
            let collapsed = [...this.state.collapsed];
            for (let i = 0; i < collapsed.length; i++) {
                if (i !== index) {
                    collapsed[i] = true;
                }
            }
            collapsed[index] = !collapsed[index];

            let topicName = "";
            let topic_num = "";
            for (let i = 0; i < this.props.subject_data.chapters.length; i++) {
                // extract topic name from the current chapter
                if (
                    this.props.subject_data.chapters[i].chapter_id ===
                    chapter_id
                ) {
                    topicName =
                        this.props.subject_data.chapters[i].topics.length !== 0
                            ? this.props.subject_data.chapters[i].topics[0]
                                  .topic_name
                            : "Topic";
                    topic_num =
                        this.props.subject_data.chapters[i].topics.length !== 0
                            ? this.props.subject_data.chapters[i].topics[0]
                                  .topic_num
                            : "1.1";
                } else {
                    continue;
                }
            }
            this.setState(
                {
                    collapsed: collapsed,
                    chapterId: chapter_id,
                    topicName: topicName,
                    topic_num: topic_num,
                },
                () => {
                    if (collapsed[index] === false) {
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
                page_loading: false,
            });
        }
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
    };

    // loads data on selecting a topic
    handleSelect = (topicName, topic_num) => {
        this.setState(
            {
                topicName: topicName,
                topic_num: topic_num,
                page_loading: true,
            },
            () => {
                this.loadNotesData();
            }
        );
    };

    // topic list
    topic = (data, index, chapter_index) => {
        const nestedTopics = (data.child || []).map((topic, index) => {
            return (
                <Accordion key={index}>
                    {this.topic(topic, index, chapter_index)}
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
                                                    topicEventKey[chapter_index]
                                                        ? topicEventKey[
                                                              chapter_index
                                                          ].includes(
                                                              `topic-${index}-${data.topic_num}`
                                                          )
                                                            ? "fa-rotate-360"
                                                            : "fa-rotate-270"
                                                        : ""
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

    render() {
        document.title = `${this.state.topicName} : Notes - Student | IQLabs`;
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

                {/* Breadcrumb */}
                <nav aria-label="breadcrumb">
                    <ol className="breadcrumb mb-3">
                        <li className="breadcrumb-item">
                            <Link to="/dashboard">
                                <i className="fas fa-home fa-sm"></i>
                            </Link>
                        </li>
                        <li className="breadcrumb-item">
                            <Link to="#" onClick={this.props.history.goBack}>
                                {this.props.subject_name}
                            </Link>
                        </li>
                        <li className="breadcrumb-item active">Notes</li>
                    </ol>
                </nav>

                <div className="card shadow-sm">
                    <div className="card-body">
                        <div className="row">
                            {/* ----- Chapter list ----- */}
                            <div className="col-md-3 mb-2 mb-md-0 border-right">
                                <div className="card">
                                    <Accordion
                                        defaultActiveKey={this.state.chapterId}
                                    >
                                        {this.props.subject_data &&
                                        Object.keys(this.props.subject_data)
                                            .length !== 0
                                            ? (
                                                  this.props.subject_data
                                                      .chapters || []
                                              ).map((data, index) => {
                                                  return (
                                                      <Card
                                                          className="mb-1"
                                                          key={index}
                                                      >
                                                          <Accordion.Toggle
                                                              as={Card.Header}
                                                              eventKey={
                                                                  data.chapter_id
                                                              }
                                                              className="pinkrange-bg shadow-sm mb-2"
                                                              style={{
                                                                  borderRadius:
                                                                      "8px",
                                                                  cursor: "default",
                                                              }}
                                                              onClick={() =>
                                                                  this.toggleCollapse(
                                                                      index,
                                                                      data.chapter_id
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
                                                                                      .collapsed[
                                                                                      index
                                                                                  ]
                                                                                      ? "fa-rotate-270"
                                                                                      : ""
                                                                              }`}
                                                                          ></i>
                                                                      </span>
                                                                  </div>
                                                                  <div className="col-10 small font-weight-bold-600">
                                                                      {
                                                                          data.chapter_name
                                                                      }
                                                                  </div>
                                                              </div>
                                                          </Accordion.Toggle>

                                                          <Accordion.Collapse
                                                              eventKey={
                                                                  data.chapter_id
                                                              }
                                                          >
                                                              <Card>
                                                                  {/* ----- Topic list ----- */}
                                                                  {(
                                                                      data.topics ||
                                                                      []
                                                                  ).map(
                                                                      (
                                                                          topic,
                                                                          topic_index
                                                                      ) => {
                                                                          return (
                                                                              <Accordion
                                                                                  key={
                                                                                      topic_index
                                                                                  }
                                                                              >
                                                                                  {this.topic(
                                                                                      topic,
                                                                                      topic_index,
                                                                                      index
                                                                                  )}
                                                                              </Accordion>
                                                                          );
                                                                      }
                                                                  )}
                                                              </Card>
                                                          </Accordion.Collapse>
                                                      </Card>
                                                  );
                                              })
                                            : null}
                                    </Accordion>
                                </div>
                            </div>

                            {/* ----- Notes data ----- */}

                            <div className="col-md-9 pl-md-0">
                                <div className="card">
                                    <div className="card-body py-0">
                                        {this.state.notesData &&
                                        this.state.notesData.length !== 0
                                            ? this.state.notesData.map(
                                                  (data, index) => {
                                                      return data.direct_question_urls !==
                                                          undefined ? (
                                                          <div
                                                              className="text-center"
                                                              key={index}
                                                          >
                                                              <Suspense
                                                                  fallback={
                                                                      <div>
                                                                          Loading...
                                                                      </div>
                                                                  }
                                                              >
                                                                  <DirectPDF
                                                                      file_url={
                                                                          data
                                                                              .direct_question_urls[0]
                                                                      }
                                                                  />
                                                              </Suspense>
                                                          </div>
                                                      ) : (
                                                          <div
                                                              key={index}
                                                              className="user-select-none"
                                                          >
                                                              <div className="h5 font-weight-bold-600 mb-2">
                                                                  {
                                                                      data.notes_name
                                                                  }
                                                              </div>
                                                              <div
                                                                  dangerouslySetInnerHTML={{
                                                                      __html: data.notes_content,
                                                                  }}
                                                              ></div>
                                                          </div>
                                                      );
                                                  }
                                              )
                                            : "No content to display..."}
                                    </div>
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

export default connect(mapStateToProps)(Notes);
