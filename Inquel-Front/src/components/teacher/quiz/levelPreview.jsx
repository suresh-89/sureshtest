import React, { Component } from "react";
import Wrapper from "../wrapper";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { baseUrl, teacherUrl } from "../../../shared/baseUrl.js";
import Loading from "../../common/loader";
import AlertBox from "../../common/alert";
import Lightbox from "react-awesome-lightbox";
import "react-awesome-lightbox/build/style.css";
import { QuestionDataFormat } from "../../common/function/dataFormating";
import TypeOneQuestion from "../../common/preview/TypeOne";

const mapStateToProps = (state) => ({
    group_name: state.content.group_name,
    subject_name: state.content.subject_name,
    chapter_name: state.content.chapter_name,
    quiz_name: state.content.quiz_name,
});

class TeacherLevelPreview extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: [],
            levelId: this.props.match.params.levelId,

            selectedImageData: [],
            startIndex: 0,
            isLightBoxOpen: false,

            levels: [],
            totalLevels: 0,
            currentLevelIndex: 0,

            errorMsg: "",
            successMsg: "",
            showErrorAlert: false,
            showSuccessAlert: false,
            page_loading: true,
        };
        this.groupId = this.props.match.params.groupId;
        this.subjectId = this.props.match.params.subjectId;
        this.chapterId = this.props.match.params.chapterId;
        this.quizId = this.props.match.params.quizId;
        this.attempt = new URLSearchParams(this.props.location.search).get(
            "attempt"
        );
        this.url = baseUrl + teacherUrl;
        this.authToken = localStorage.getItem("Authorization");
        this.headers = {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: this.authToken,
        };
    }

    componentDidMount = () => {
        this.loadQAData();
        this.loadLevelData();
    };

    // loads question & answer
    loadQAData = async (path) => {
        var apiURL =
            path === undefined || path === null
                ? `${this.url}/teacher/subject/${this.subjectId}/chapter/${this.chapterId}/quiz/${this.quizId}/level/${this.state.levelId}/?attempt_name=${this.attempt}`
                : path;
        await fetch(apiURL, {
            method: "GET",
            headers: this.headers,
        })
            .then((res) => res.json())
            .then((result) => {
                let data = [...this.state.data];
                if (result.sts === true) {
                    if (
                        result.data.results &&
                        result.data.results.length !== 0
                    ) {
                        let values = QuestionDataFormat(result.data.results);
                        data.push(...values.result);

                        this.setState(
                            {
                                data: data,
                            },
                            () => {
                                if (result.data.next !== null) {
                                    this.loadQAData(result.data.next);
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

    loadLevelData = () => {
        fetch(
            `${this.url}/teacher/subject/${this.subjectId}/chapter/${this.chapterId}/quiz/?attempt_name=${this.attempt}`,
            {
                method: "GET",
                headers: this.headers,
            }
        )
            .then((res) => res.json())
            .then((result) => {
                if (result.sts === true) {
                    let currentIndex = "";
                    for (let i = 0; i < result.data.levels.length; i++) {
                        if (
                            result.data.levels[i].level_id ===
                            this.state.levelId
                        ) {
                            currentIndex = i;
                        } else {
                            continue;
                        }
                    }
                    this.setState({
                        levels: result.data.levels,
                        totalLevels: result.data.levels.length,
                        currentLevelIndex: currentIndex,
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

    changeImage = (images, index) => {
        let imageArr = [];
        this.setState({
            selectedImageData: [],
            startIndex: 0,
        });
        for (let i = 0; i < images.length; i++) {
            imageArr.push({
                url: images[i].path,
                title: images[i].title,
            });
        }
        this.setState({
            selectedImageData: imageArr,
            startIndex: index,
            isLightBoxOpen: true,
        });
    };

    // ---------- Navigation ----------

    handlePrev = () => {
        const data = this.state.levels;
        this.setState(
            {
                levelId: data[this.state.currentLevelIndex - 1].level_id,
                currentLevelIndex: this.state.currentLevelIndex - 1,
                data: [],
                page_loading: true,
            },
            () => {
                this.loadQAData();
            }
        );
    };

    handleNext = () => {
        const data = this.state.levels;
        this.setState(
            {
                levelId: data[this.state.currentLevelIndex + 1].level_id,
                currentLevelIndex: this.state.currentLevelIndex + 1,
                data: [],
                page_loading: true,
            },
            () => {
                this.loadQAData();
            }
        );
    };

    render() {
        document.title = `${this.props.quiz_name} : ${
            this.state.levels.length !== 0
                ? this.state.levels[this.state.currentLevelIndex].level_name
                : ""
        } - Teacher | IQLabs`;
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

                {/* Image lightbox */}
                {this.state.isLightBoxOpen ? (
                    <Lightbox
                        images={this.state.selectedImageData}
                        startIndex={this.state.startIndex}
                        onClose={() => {
                            this.setState({
                                isLightBoxOpen: false,
                            });
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
                        <li className="breadcrumb-item">
                            <Link
                                to={`/teacher/group/${this.groupId}/subject/${this.subjectId}/chapter/${this.chapterId}`}
                            >
                                {this.props.chapter_name}
                            </Link>
                        </li>
                        <li className="breadcrumb-item">
                            <Link to="#" onClick={this.props.history.goBack}>
                                {this.props.quiz_name}
                            </Link>
                        </li>
                        <li className="breadcrumb-item active">
                            {this.state.levels.length !== 0
                                ? this.state.levels[
                                      this.state.currentLevelIndex
                                  ].level_name
                                : ""}
                        </li>
                    </ol>
                </nav>

                {/* ----- Header configuration ----- */}
                <div className="card primary-bg text-white small mb-4">
                    <div className="card-body">
                        <div className="row">
                            <div className="col-lg-8 col-md-5">
                                {this.state.levels.length !== 0
                                    ? this.state.levels[
                                          this.state.currentLevelIndex
                                      ].level_name
                                    : ""}
                            </div>
                            <div className="col-lg-2">{this.attempt}</div>
                            <div className="col-lg-2">
                                {this.state.data.length} Questions
                            </div>
                        </div>
                    </div>
                </div>

                {/* ----- Question & Answer ----- */}
                {this.state.data && this.state.data.length !== 0
                    ? this.state.data.map((data, q_index) => {
                          return (
                              <TypeOneQuestion
                                  key={q_index}
                                  q_index={q_index}
                                  data={data}
                                  changeImage={this.changeImage}
                              />
                          );
                      })
                    : ""}

                {/* ----- Navigation ----- */}
                <div className="row">
                    <div className="col-6">
                        {this.state.currentLevelIndex !== 0 ? (
                            <button
                                className="btn btn-primary btn-sm shadow-none"
                                onClick={this.handlePrev}
                            >
                                <i className="fas fa-angle-left mr-2"></i>Prev
                            </button>
                        ) : (
                            ""
                        )}
                    </div>
                    <div className="col-6 text-right">
                        {this.state.currentLevelIndex + 1 >=
                        this.state.totalLevels ? (
                            ""
                        ) : (
                            <button
                                className="btn btn-primary btn-sm shadow-none"
                                onClick={this.handleNext}
                            >
                                Next<i className="fas fa-angle-right ml-2"></i>
                            </button>
                        )}
                    </div>
                </div>

                {/* Loading component */}
                {this.state.page_loading ? <Loading /> : ""}
            </Wrapper>
        );
    }
}

export default connect(mapStateToProps)(TeacherLevelPreview);
