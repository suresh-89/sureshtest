import React, { Component } from "react";
import Wrapper from "../wrapper";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { baseUrl, hodUrl } from "../../../shared/baseUrl.js";
import Loading from "../../common/loader";
import AlertBox from "../../common/alert";
import FileModal from "../shared/fileExplorer";
import { QuestionDataFormat } from "../../common/function/dataFormating";
import ExplanationModal from "../../common/modal/explanation";

const mapStateToProps = (state) => ({
    subject_name: state.content.subject_name,
    chapter_name: state.content.chapter_name,
    topic_name: state.content.topic_name,
});

class HODSubjectTypeOne extends Component {
    constructor(props) {
        super(props);
        this.state = {
            showModal: false,
            showExplanationModal: false,

            questions: [],

            errorMsg: "",
            successMsg: "",
            showErrorAlert: false,
            showSuccessAlert: false,
            page_loading: true,

            selectedImage: "",
            selectedVideo: "",
            selectedAudio: "",
            selectedData: "",
        };
        this.subjectId = this.props.match.params.subjectId;
        this.chapterId = this.props.match.params.chapterId;
        this.topicNum = this.props.match.params.topicNum;
        this.url = baseUrl + hodUrl;
        this.authToken = localStorage.getItem("Authorization");
        this.headers = {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: this.authToken,
        };
    }

    toggleModal = (image, video, audio) => {
        this.setState({
            showModal: !this.state.showModal,
            selectedImage: image,
            selectedVideo: video,
            selectedAudio: audio,
        });
    };

    // -------------------------- Question data loading --------------------------

    loadMCQData = async (path) => {
        var apiURL =
            path === undefined || path === null
                ? `${this.url}/hod/subject/${this.subjectId}/chapter/${this.chapterId}/${this.topicNum}/type_one/`
                : path;
        await fetch(apiURL, {
            headers: this.headers,
            method: "GET",
        })
            .then((res) => res.json())
            .then((result) => {
                if (result.sts === true) {
                    let data = [...this.state.questions];
                    if (
                        result.data.results &&
                        result.data.results.length !== 0
                    ) {
                        let questionData = QuestionDataFormat(
                            result.data.results
                        );
                        data.push(...questionData.result);

                        this.setState(
                            {
                                questions: data,
                            },
                            () => {
                                if (result.data.next !== null) {
                                    this.loadMCQData(result.data.next);
                                } else {
                                    this.setState({
                                        page_loading: false,
                                    });
                                }
                            }
                        );
                    } else {
                        this.setState({
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
        window.MathJax.typeset();
    };

    // -------------------------- Lifecycle --------------------------

    componentDidMount = () => {
        document.title = `${this.props.topic_name} : Type One - HOD | IQLabs`;

        this.loadMCQData();
    };

    render() {
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

                {/* File viewing Modal */}
                {this.state.showModal ? (
                    <FileModal
                        show={this.state.showModal}
                        onHide={this.toggleModal}
                        image={this.state.selectedImage}
                        video={this.state.selectedVideo}
                        audio={this.state.selectedAudio}
                    />
                ) : null}

                {/* Explanation modal */}
                <ExplanationModal
                    show={this.state.showExplanationModal}
                    onHide={() => {
                        this.setState({
                            showExplanationModal: false,
                        });
                    }}
                    data={this.state.selectedData}
                />

                {/* ----- Breadcrumb ----- */}
                <nav aria-label="breadcrumb">
                    <ol className="breadcrumb mb-3">
                        <li className="breadcrumb-item">
                            <Link to="/hod">
                                <i className="fas fa-home fa-sm"></i>
                            </Link>
                        </li>
                        <li className="breadcrumb-item">
                            <Link to={`/hod/subject/${this.subjectId}`}>
                                {this.props.subject_name}
                            </Link>
                        </li>
                        <li className="breadcrumb-item">
                            <Link to="#" onClick={this.props.history.goBack}>
                                {this.props.chapter_name}
                            </Link>
                        </li>
                        <li className="breadcrumb-item active">Type One</li>
                    </ol>
                </nav>

                {/* Header area */}
                <h5 className="primary-text mb-4">
                    {`Type One - ${this.props.topic_name}`}
                </h5>

                {/* -------------------- MCQ -------------------- */}
                {this.state.questions.length !== 0
                    ? this.state.questions.map((question, q_index) => {
                          return (
                              <div
                                  className="d-flex align-items-start mb-3"
                                  key={q_index}
                              >
                                  {/* ---------- Side buttons ---------- */}
                                  <div
                                      className="bg-white small font-weight-bold-600 rounded-lg shadow-sm text-nowrap user-select-none mr-2"
                                      style={{
                                          paddingTop: "8px",
                                          paddingBottom: "8px",
                                          paddingLeft: "12px",
                                          paddingRight: "12px",
                                      }}
                                  >
                                      {q_index <= 8
                                          ? `0${q_index + 1}`
                                          : q_index + 1}
                                  </div>

                                  {/* ---------- Question preview ---------- */}
                                  <div className="card shadow-sm w-100">
                                      <div className="card-body">
                                          <div className="d-flex align-items-start">
                                              {/* Questions & options */}
                                              <div className="w-100">
                                                  <div className="form-group">
                                                      <div className="card form-shadow">
                                                          <div
                                                              className="card-body py-2"
                                                              dangerouslySetInnerHTML={{
                                                                  __html: question.question,
                                                              }}
                                                          ></div>
                                                      </div>
                                                  </div>
                                                  {question.content.mcq ? (
                                                      <div className="row">
                                                          {question.content.options.map(
                                                              (
                                                                  options,
                                                                  index
                                                              ) => {
                                                                  return (
                                                                      <div
                                                                          className="col-md-6"
                                                                          key={
                                                                              index
                                                                          }
                                                                      >
                                                                          <div className="form-group">
                                                                              <div
                                                                                  className={`card shadow-sm ${
                                                                                      options.correct
                                                                                          ? "success-bg"
                                                                                          : "bg-light"
                                                                                  }`}
                                                                              >
                                                                                  <div className="card-body small font-weight-bold-600 pt-3 pb-0">
                                                                                      <div
                                                                                          dangerouslySetInnerHTML={{
                                                                                              __html:
                                                                                                  options.content !==
                                                                                                  ""
                                                                                                      ? `<div class="mb-3">${options.content}</div>`
                                                                                                      : `<p class="text-muted">Option 0${
                                                                                                            index +
                                                                                                            1
                                                                                                        }</p>`,
                                                                                          }}
                                                                                      ></div>
                                                                                  </div>
                                                                              </div>
                                                                          </div>
                                                                      </div>
                                                                  );
                                                              }
                                                          )}
                                                      </div>
                                                  ) : (
                                                      ""
                                                  )}
                                                  {question.content.fill_in ? (
                                                      <div className="row">
                                                          {question.content.fillin_answer.map(
                                                              (
                                                                  fill_in,
                                                                  index
                                                              ) => {
                                                                  return (
                                                                      <div
                                                                          className="col-md-6"
                                                                          key={
                                                                              index
                                                                          }
                                                                      >
                                                                          <div className="form-group">
                                                                              <div className="card shadow-sm bg-light">
                                                                                  <div className="card-body small font-weight-bold-600 py-3">
                                                                                      {fill_in !==
                                                                                      "" ? (
                                                                                          fill_in
                                                                                      ) : (
                                                                                          <span className="text-muted">{`Answer 0${
                                                                                              index +
                                                                                              1
                                                                                          }`}</span>
                                                                                      )}
                                                                                  </div>
                                                                              </div>
                                                                          </div>
                                                                      </div>
                                                                  );
                                                              }
                                                          )}
                                                      </div>
                                                  ) : (
                                                      ""
                                                  )}
                                                  {question.content.boolean ? (
                                                      <div className="row">
                                                          {question.content.boolean_question.map(
                                                              (
                                                                  boolean,
                                                                  index
                                                              ) => {
                                                                  return (
                                                                      <div
                                                                          className="col-md-6"
                                                                          key={
                                                                              index
                                                                          }
                                                                      >
                                                                          <div className="form-group">
                                                                              <div
                                                                                  className={`card shadow-sm ${
                                                                                      boolean.correct
                                                                                          ? "success-bg"
                                                                                          : "bg-light"
                                                                                  }`}
                                                                              >
                                                                                  <div className="card-body small font-weight-bold-600 py-3">
                                                                                      {
                                                                                          boolean.content
                                                                                      }
                                                                                  </div>
                                                                              </div>
                                                                          </div>
                                                                      </div>
                                                                  );
                                                              }
                                                          )}
                                                      </div>
                                                  ) : (
                                                      ""
                                                  )}
                                              </div>
                                              {/* File modal button */}
                                              {question.content.images
                                                  .length !== 0 ||
                                              question.content.video.path !==
                                                  "" ||
                                              question.content.audio.length !==
                                                  0 ? (
                                                  <button
                                                      className="btn btn-light bg-white shadow-sm ml-3"
                                                      onClick={() =>
                                                          this.toggleModal(
                                                              question.content
                                                                  .images,
                                                              question.content
                                                                  .video,
                                                              question.content
                                                                  .audio
                                                          )
                                                      }
                                                  >
                                                      <i className="far fa-folder-open"></i>
                                                  </button>
                                              ) : (
                                                  ""
                                              )}
                                          </div>

                                          {/* ----- Explanation ----- */}

                                          <button
                                              className="btn btn-link btn-sm shadow-none"
                                              onClick={() =>
                                                  this.setState({
                                                      showExplanationModal: true,
                                                      selectedData:
                                                          question.content
                                                              .explanation,
                                                  })
                                              }
                                          >
                                              <i className="fas fa-info-circle mr-1"></i>{" "}
                                              Explanation
                                          </button>
                                      </div>
                                      {/* ----- Answer type tag ----- */}
                                      {question.content.mcq ? (
                                          <div
                                              className="secondary-bg primary-text font-weight-bold px-2 py-1 position-absolute rounded-lg shadow-sm"
                                              style={{
                                                  bottom: "5px",
                                                  right: "5px",
                                                  fontSize: "10px",
                                              }}
                                          >
                                              MCQ
                                          </div>
                                      ) : question.content.fill_in ? (
                                          <div
                                              className="secondary-bg primary-text font-weight-bold px-2 py-1 position-absolute rounded-lg shadow-sm"
                                              style={{
                                                  bottom: "5px",
                                                  right: "5px",
                                                  fontSize: "10px",
                                              }}
                                          >
                                              Fill in
                                          </div>
                                      ) : (
                                          <div
                                              className="secondary-bg primary-text font-weight-bold px-2 py-1 position-absolute rounded-lg shadow-sm"
                                              style={{
                                                  bottom: "5px",
                                                  right: "5px",
                                                  fontSize: "10px",
                                              }}
                                          >
                                              True / False
                                          </div>
                                      )}
                                  </div>
                              </div>
                          );
                      })
                    : "No content to display..."}

                {/* Loading component */}
                {this.state.page_loading ? <Loading /> : ""}
            </Wrapper>
        );
    }
}

export default connect(mapStateToProps)(HODSubjectTypeOne);
