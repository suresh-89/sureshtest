import React, { Component } from "react";
import Wrapper from "../wrapper";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { Dropdown } from "react-bootstrap";
import { baseUrl, teacherUrl } from "../../../shared/baseUrl.js";
import Loading from "../../common/loader";
import AlertBox from "../../common/alert";
import {
    SingleContentDeleteModal,
    ContentUpdateModal,
} from "../../common/modal/contentManagementModal";
import {
    ChapterList,
    ChapterModal,
    ChapterEditModal,
    SemesterModal,
    Scorecard,
} from "./contentManagementModal";
import storeDispatch from "../../../redux/dispatch";
import { CHAPTER, RESPONSE, SEMESTER } from "../../../redux/action";

const mapStateToProps = (state) => ({
    group_name: state.content.group_name,
    subject_name: state.content.subject_name,
    profile: state.user.profile,
});

class TeacherSubject extends Component {
    constructor(props) {
        super(props);
        this.state = {
            showScorecardModal: false,

            showChapterModal: false,
            showChapter_EditModal: false,
            showChapter_DeleteModal: false,

            showSemesterModal: false,
            showSemester_EditModal: false,
            showSemester_DeleteModal: false,

            subjectItems: [], // Chapter data
            semesterItems: [], // Semester data
            chapter_id: [], // List of unassigned chapters
            semester_chapters: [], // List of assigned chapters under a semester
            scorecard: [],
            permissions: {},

            selectedChapter: "",
            selectedSemester: "",

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

    componentDidMount = () => {
        document.title = `${this.props.subject_name} - Teacher | IQLabs`;

        this.loadChapterData();
        this.loadSemesterData();
    };

    loadChapterData = (path) => {
        fetch(path ? path : `${this.url}/teacher/subject/${this.subjectId}/`, {
            headers: this.headers,
            method: "GET",
        })
            .then((res) => res.json())
            .then((result) => {
                if (result.sts === true) {
                    let chapter = [...this.state.subjectItems];
                    chapter.push(...result.data.results);

                    this.setState(
                        {
                            subjectItems: chapter,
                            scorecard: result.data.score_card_config,
                            permissions: result.data.permissions,
                        },
                        () => {
                            if (result.data.next !== null) {
                                this.loadChapterData(result.data.next);
                            } else {
                                this.setState({
                                    page_loading: false,
                                });
                            }
                        }
                    );
                    storeDispatch(RESPONSE, result.data);
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

    loadSemesterData = () => {
        fetch(`${this.url}/teacher/subject/${this.subjectId}/semester/`, {
            headers: this.headers,
            method: "GET",
        })
            .then((res) => res.json())
            .then((result) => {
                if (result.sts === true) {
                    const chapters = [];
                    for (let i = 0; i < result.data.length; i++) {
                        for (
                            let j = 0;
                            j < result.data[i].chapters.length;
                            j++
                        ) {
                            chapters.push(result.data[i].chapters[j]);
                        }
                    }
                    this.setState({
                        semesterItems: result.data,
                        semester_chapters: chapters,
                        chapter_id: [],
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

    toggleChapterModal = () => {
        this.setState({
            showChapterModal: !this.state.showChapterModal,
        });
    };

    toggleChapter_EditModal = (data) => {
        this.setState({
            selectedChapter: data,
            showChapter_EditModal: !this.state.showChapter_EditModal,
        });
    };

    toggleChapter_DeleteModal = (data) => {
        this.setState({
            selectedChapter: data,
            showChapter_DeleteModal: !this.state.showChapter_DeleteModal,
        });
    };

    toggleSemesterModal = () => {
        const chapter_id = this.state.chapter_id;
        for (let i = 0; i < this.state.subjectItems.length; i++) {
            if (
                !this.state.semester_chapters.includes(
                    this.state.subjectItems[i].chapter_id
                )
            ) {
                chapter_id.push(this.state.subjectItems[i].chapter_id);
            } else {
                continue;
            }
        }
        this.setState({
            showSemesterModal: !this.state.showSemesterModal,
            chapter_id: chapter_id,
        });
    };

    toggleSemester_EditModal = (data) => {
        this.setState({
            selectedSemester: data,
            showSemester_EditModal: !this.state.showSemester_EditModal,
        });
    };

    toggleSemester_DeleteModal = (data) => {
        this.setState({
            selectedSemester: data,
            showSemester_DeleteModal: !this.state.showSemester_DeleteModal,
        });
    };

    chapterFormSubmission = () => {
        setTimeout(() => {
            this.setState({
                showChapterModal: false,
                showChapter_EditModal: false,
                showChapter_DeleteModal: false,
            });
        }, 1000);
        this.setState(
            {
                subjectItems: [],
            },
            () => this.loadChapterData()
        );
    };

    semesterFormSubmission = () => {
        setTimeout(() => {
            this.setState({
                showSemesterModal: false,
                showSemester_EditModal: false,
                showSemester_DeleteModal: false,
            });
        }, 1000);
        this.loadSemesterData();
    };

    toggleScorecardModal = () => {
        this.setState({
            showScorecardModal: !this.state.showScorecardModal,
        });
    };

    scorecardFormSubmission = () => {
        setTimeout(() => {
            this.setState({
                showScorecardModal: !this.state.showScorecardModal,
            });
        }, 1000);
        this.loadChapterData();
    };

    dispatchChapter = (data) => {
        storeDispatch(CHAPTER, data);
    };

    dispatchSemester = (data) => {
        storeDispatch(SEMESTER, data);
    };

    render() {
        return (
            <Wrapper
                header={this.props.subject_name}
                activeLink="dashboard"
                history={this.props.history}
                waterMark={this.props.profile}
            >
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

                {/* ----- Chapter modal ----- */}
                {this.state.showChapterModal ? (
                    <ChapterModal
                        show={this.state.showChapterModal}
                        onHide={this.toggleChapterModal}
                        formSubmission={this.chapterFormSubmission}
                        subjectId={this.subjectId}
                    />
                ) : (
                    ""
                )}

                {/* ----- Chapter Edit modal ----- */}
                {this.state.showChapter_EditModal ? (
                    <ChapterEditModal
                        show={this.state.showChapter_EditModal}
                        onHide={this.toggleChapter_EditModal}
                        formSubmission={this.chapterFormSubmission}
                        subjectId={this.subjectId}
                        data={this.state.selectedChapter}
                    />
                ) : (
                    ""
                )}

                {/* ----- Chapter Delete modal ----- */}
                {this.state.showChapter_DeleteModal ? (
                    <SingleContentDeleteModal
                        show={this.state.showChapter_DeleteModal}
                        onHide={this.toggleChapter_DeleteModal}
                        formSubmission={this.chapterFormSubmission}
                        url={`${this.url}/teacher/subject/${this.subjectId}/chapter/`}
                        type="Chapter"
                        name={this.state.selectedChapter.chapter_name}
                        data={{
                            chapter_id: this.state.selectedChapter.chapter_id,
                        }}
                    />
                ) : (
                    ""
                )}

                {/* ----- Semester modal ----- */}
                {this.state.showSemesterModal ? (
                    <SemesterModal
                        show={this.state.showSemesterModal}
                        onHide={this.toggleSemesterModal}
                        formSubmission={this.semesterFormSubmission}
                        chapter_id={this.state.chapter_id}
                        subjectId={this.subjectId}
                    />
                ) : (
                    ""
                )}

                {/* ----- Semester Edit modal ----- */}
                {this.state.showSemester_EditModal ? (
                    <ContentUpdateModal
                        show={this.state.showSemester_EditModal}
                        onHide={this.toggleSemester_EditModal}
                        formSubmission={this.semesterFormSubmission}
                        url={`${this.url}/teacher/subject/${this.subjectId}/semester/`}
                        type="Semester"
                        name={this.state.selectedSemester.semester_name}
                        data={{
                            semester_id:
                                this.state.selectedSemester.semester_id,
                            semester_name:
                                this.state.selectedSemester.semester_name,
                        }}
                    />
                ) : (
                    ""
                )}

                {/* ----- Semester Delete modal ----- */}
                {this.state.showSemester_DeleteModal ? (
                    <SingleContentDeleteModal
                        show={this.state.showSemester_DeleteModal}
                        onHide={this.toggleSemester_DeleteModal}
                        formSubmission={this.semesterFormSubmission}
                        url={`${this.url}/teacher/subject/${this.subjectId}/semester/`}
                        type="Semester"
                        name={this.state.selectedSemester.semester_name}
                        data={{
                            semester_id:
                                this.state.selectedSemester.semester_id,
                        }}
                    />
                ) : (
                    ""
                )}

                {/* ----- Scorecard modal ----- */}
                {this.state.showScorecardModal ? (
                    <Scorecard
                        show={this.state.showScorecardModal}
                        onHide={this.toggleScorecardModal}
                        subjectId={this.subjectId}
                        formSubmission={this.scorecardFormSubmission}
                        scorecard={this.state.scorecard}
                    />
                ) : (
                    ""
                )}

                {/* Header area */}
                <div className="row align-items-center mb-3">
                    <div className="col-md-6">
                        {/* ----- Breadcrumb ----- */}
                        <nav aria-label="breadcrumb">
                            <ol className="breadcrumb">
                                <li className="breadcrumb-item">
                                    <Link to="/teacher">
                                        <i className="fas fa-home fa-sm"></i>
                                    </Link>
                                </li>
                                <li className="breadcrumb-item">
                                    <Link
                                        to="#"
                                        onClick={this.props.history.goBack}
                                    >
                                        {this.props.group_name}
                                    </Link>
                                </li>
                                <li className="breadcrumb-item active">
                                    <span>Subject:</span>
                                    {this.props.subject_name}
                                </li>
                            </ol>
                        </nav>
                    </div>
                    <div className="col-md-6 text-right">
                        <button
                            className="btn btn-primary btn-sm shadow-none"
                            onClick={this.toggleScorecardModal}
                        >
                            Subject scorecard
                        </button>
                    </div>
                </div>

                <div className="card shadow-sm mb-3">
                    <div className="table-responsive">
                        <table className="table">
                            <thead className="primary-bg text-white">
                                <tr>
                                    <th scope="col">Chapter structure</th>
                                    <th scope="col">Status</th>
                                    <th scope="col">Weightage</th>
                                    <th scope="col">Summary</th>
                                    <th scope="col" className="text-right">
                                        Add content
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {/* Assigned chapter list to a semester */}
                                {this.state.semesterItems.length !== 0
                                    ? this.state.semesterItems.map(
                                          (data, index) => {
                                              return (
                                                  <React.Fragment key={index}>
                                                      {this.state.subjectItems.map(
                                                          (chapter, index) => {
                                                              return data.chapters.includes(
                                                                  chapter.chapter_id
                                                              ) ? (
                                                                  <ChapterList
                                                                      key={
                                                                          index
                                                                      }
                                                                      chapter={
                                                                          chapter
                                                                      }
                                                                      dispatchChapter={
                                                                          this
                                                                              .dispatchChapter
                                                                      }
                                                                      toggleChapter_EditModal={
                                                                          this
                                                                              .toggleChapter_EditModal
                                                                      }
                                                                      toggleChapter_DeleteModal={
                                                                          this
                                                                              .toggleChapter_DeleteModal
                                                                      }
                                                                      group={
                                                                          true
                                                                      }
                                                                      url={
                                                                          this
                                                                              .props
                                                                              .match
                                                                              .url
                                                                      }
                                                                      permissions={
                                                                          this
                                                                              .state
                                                                              .permissions
                                                                      }
                                                                  />
                                                              ) : null;
                                                          }
                                                      )}
                                                      {/* ----- Semester list ----- */}
                                                      <tr key={index}>
                                                          <td>
                                                              {
                                                                  data.semester_name
                                                              }
                                                          </td>
                                                          <td>
                                                              {data.publish ? (
                                                                  <span className="text-success">
                                                                      Published
                                                                  </span>
                                                              ) : (
                                                                  ""
                                                              )}
                                                          </td>
                                                          <td></td>
                                                          <td></td>
                                                          <td className="d-flex justify-content-end">
                                                              {/* checks if both the permission exist */}
                                                              {data.auto_test_perm ===
                                                                  true &&
                                                              data.direct_perm ===
                                                                  true ? (
                                                                  // checks if auto content is available
                                                                  data.auto_test_question ===
                                                                  true ? (
                                                                      <Link
                                                                          to={`${this.props.match.url}/semester/${data.semester_id}`}
                                                                      >
                                                                          <button
                                                                              className="btn btn-primary btn-sm shadow-none"
                                                                              onClick={() =>
                                                                                  this.dispatchSemester(
                                                                                      data.semester_name
                                                                                  )
                                                                              }
                                                                          >
                                                                              Auto
                                                                          </button>
                                                                      </Link>
                                                                  ) : // or if direct content is available
                                                                  data.direct_question ===
                                                                    true ? (
                                                                      <Link
                                                                          to={`${this.props.match.url}/semester/${data.semester_id}/direct`}
                                                                      >
                                                                          <button
                                                                              className="btn btn-primary btn-sm shadow-none ml-2"
                                                                              onClick={() =>
                                                                                  this.dispatchSemester(
                                                                                      data.semester_name
                                                                                  )
                                                                              }
                                                                          >
                                                                              Direct
                                                                              Test
                                                                          </button>
                                                                      </Link>
                                                                  ) : (
                                                                      // or display both the button
                                                                      <>
                                                                          <Link
                                                                              to={`${this.props.match.url}/semester/${data.semester_id}`}
                                                                          >
                                                                              <button
                                                                                  className="btn btn-primary btn-sm shadow-none"
                                                                                  onClick={() =>
                                                                                      this.dispatchSemester(
                                                                                          data.semester_name
                                                                                      )
                                                                                  }
                                                                              >
                                                                                  Auto
                                                                              </button>
                                                                          </Link>
                                                                          <Link
                                                                              to={`${this.props.match.url}/semester/${data.semester_id}/direct`}
                                                                          >
                                                                              <button
                                                                                  className="btn btn-primary btn-sm shadow-none ml-2"
                                                                                  onClick={() =>
                                                                                      this.dispatchSemester(
                                                                                          data.semester_name
                                                                                      )
                                                                                  }
                                                                              >
                                                                                  Direct
                                                                                  Test
                                                                              </button>
                                                                          </Link>
                                                                      </>
                                                                  )
                                                              ) : // checks if auto permission exist
                                                              data.auto_test_perm ===
                                                                true ? (
                                                                  <Link
                                                                      to={`${this.props.match.url}/semester/${data.semester_id}`}
                                                                  >
                                                                      <button
                                                                          className="btn btn-primary btn-sm shadow-none"
                                                                          onClick={() =>
                                                                              this.dispatchSemester(
                                                                                  data.semester_name
                                                                              )
                                                                          }
                                                                      >
                                                                          Auto
                                                                      </button>
                                                                  </Link>
                                                              ) : // checks if direct permission exist
                                                              data.direct_perm ===
                                                                true ? (
                                                                  <Link
                                                                      to={`${this.props.match.url}/semester/${data.semester_id}/direct`}
                                                                  >
                                                                      <button
                                                                          className="btn btn-primary btn-sm shadow-none ml-2"
                                                                          onClick={() =>
                                                                              this.dispatchSemester(
                                                                                  data.semester_name
                                                                              )
                                                                          }
                                                                      >
                                                                          Direct
                                                                          Test
                                                                      </button>
                                                                  </Link>
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
                                                                              this.toggleSemester_EditModal(
                                                                                  data
                                                                              )
                                                                          }
                                                                      >
                                                                          <i className="far fa-edit fa-sm mr-1"></i>{" "}
                                                                          Edit
                                                                      </Dropdown.Item>
                                                                      <Dropdown.Item
                                                                          onClick={() =>
                                                                              this.toggleSemester_DeleteModal(
                                                                                  data
                                                                              )
                                                                          }
                                                                      >
                                                                          <i className="far fa-trash-alt fa-sm mr-1"></i>{" "}
                                                                          Delete
                                                                      </Dropdown.Item>
                                                                  </Dropdown.Menu>
                                                              </Dropdown>
                                                          </td>
                                                      </tr>
                                                  </React.Fragment>
                                              );
                                          }
                                      )
                                    : null}
                                {/* ----- Unassigned chapter list ----- */}
                                {this.state.subjectItems.length !== 0
                                    ? this.state.subjectItems.map(
                                          (chapter, index) => {
                                              return !this.state.semester_chapters.includes(
                                                  chapter.chapter_id
                                              ) ? (
                                                  <ChapterList
                                                      key={index}
                                                      chapter={chapter}
                                                      dispatchChapter={
                                                          this.dispatchChapter
                                                      }
                                                      toggleChapter_EditModal={
                                                          this
                                                              .toggleChapter_EditModal
                                                      }
                                                      toggleChapter_DeleteModal={
                                                          this
                                                              .toggleChapter_DeleteModal
                                                      }
                                                      group={true}
                                                      url={this.props.match.url}
                                                      permissions={
                                                          this.state.permissions
                                                      }
                                                  />
                                              ) : null;
                                          }
                                      )
                                    : null}
                            </tbody>
                        </table>
                    </div>
                </div>

                <button
                    className="btn btn-tomato btn-block shadow-sm mb-2"
                    onClick={this.toggleChapterModal}
                >
                    Add Chapter
                </button>
                <button
                    className="btn btn-tomato btn-block shadow-sm"
                    onClick={this.toggleSemesterModal}
                >
                    Add Semester Exam
                </button>

                {/* Loading component */}
                {this.state.page_loading ? <Loading /> : ""}
            </Wrapper>
        );
    }
}

export default connect(mapStateToProps)(TeacherSubject);
