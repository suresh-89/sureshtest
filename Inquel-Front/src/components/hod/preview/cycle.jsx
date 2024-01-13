import React, { Component } from "react";
import Wrapper from "../wrapper";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { baseUrl, hodUrl } from "../../../shared/baseUrl.js";
import Loading from "../../common/loader";
import AlertBox from "../../common/alert";
import Lightbox from "react-awesome-lightbox";
import "react-awesome-lightbox/build/style.css";
import { QuestionDataFormat } from "../../common/function/dataFormating";
import Select from "react-select";
import TypeOneQuestion from "../../common/preview/TypeOne";
import TypeTwoQuestion from "../../common/preview/TypeTwo";

const mapStateToProps = (state) => ({
    subject_name: state.content.subject_name,
    course_name: state.content.course_name,
    chapter_name: state.content.chapter_name,
    cycle_name: state.content.cycle_name,
});

class HODCyclePreview extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: [],
            type: "",
            duration: "",
            sections: [],
            attempts: [],
            sectionId: "",
            selectedAttempt: "",

            selectedImageData: [],
            startIndex: 0,
            isLightBoxOpen: false,

            totalSection: 0,
            currentSectionIndex: 0,

            errorMsg: "",
            successMsg: "",
            showErrorAlert: false,
            showSuccessAlert: false,
            page_loading: true,
        };
        this.subjectId = this.props.match.params.subjectId;
        this.courseId = this.props.match.params.courseId;
        this.chapterId = this.props.match.params.chapterId;
        this.cycleId = this.props.match.params.cycleId;
        this.url = baseUrl + hodUrl;
        this.authToken = localStorage.getItem("Authorization");
        this.headers = {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: this.authToken,
        };
    }

    componentDidMount = () => {
        document.title = `${this.props.cycle_name} - HOD | IQLabs`;

        this.loadSectionData();
    };

    // loads question & answer
    loadQAData = async (path) => {
        var apiURL =
            path === undefined || path === null
                ? this.subjectId
                    ? `${this.url}/hod/subject/${this.subjectId}/chapter/${this.chapterId}/cycle_test/${this.cycleId}/${this.state.sectionId}/?attempt_number=${this.state.selectedAttempt}`
                    : `${this.url}/hod/course/${this.courseId}/review/chapter/${this.chapterId}/${this.cycleId}/${this.state.sectionId}/?attempt_number=${this.state.selectedAttempt}`
                : path;
        await fetch(apiURL, {
            method: "GET",
            headers: this.headers,
        })
            .then((res) => res.json())
            .then((result) => {
                let type = "";
                let data = [...this.state.data];

                if (result.sts === true) {
                    if (
                        result.data.results &&
                        result.data.results.length !== 0
                    ) {
                        let values = QuestionDataFormat(result.data.results);
                        type = values.type;
                        data.push(...values.result);

                        this.setState(
                            {
                                data: data,
                                type: type,
                                duration:
                                    result.duration !== undefined
                                        ? result.duration
                                        : 0,
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

    loadSectionData = () => {
        let apiURL = this.subjectId
            ? `${this.url}/hod/subject/${this.subjectId}/chapter/${this.chapterId}/cycle_test/${this.cycleId}/attempt/`
            : `${this.url}/hod/course/${this.courseId}/review/chapter/${this.chapterId}/${this.cycleId}/attempt/`;
        fetch(apiURL, {
            method: "GET",
            headers: this.headers,
        })
            .then((res) => res.json())
            .then((result) => {
                if (result.sts === true) {
                    this.setState(
                        {
                            sections: result.data.sections,
                            attempts: result.data.attempts,
                            sectionId: result.data.sections[0].section_id,
                            selectedAttempt: result.data.attempts[0].name,
                            totalSection: result.data.sections.length,
                        },
                        () => {
                            this.loadQAData();
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
        const section = this.state.sections;
        this.setState(
            {
                sectionId:
                    section[this.state.currentSectionIndex - 1].section_id,
                currentSectionIndex: this.state.currentSectionIndex - 1,
                data: [],
                page_loading: true,
            },
            () => {
                this.loadQAData();
            }
        );
    };

    handleNext = () => {
        const section = this.state.sections;
        this.setState(
            {
                sectionId:
                    section[this.state.currentSectionIndex + 1].section_id,
                currentSectionIndex: this.state.currentSectionIndex + 1,
                data: [],
                page_loading: true,
            },
            () => {
                this.loadQAData();
            }
        );
    };

    render() {
        return (
            <Wrapper
                header={
                    this.subjectId
                        ? this.props.subject_name
                        : this.props.course_name
                }
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

                <div className="row align-items-center mb-3">
                    <div className="col-lg-8 mb-2 mb-lg-0">
                        {/* ----- Breadcrumb ----- */}
                        <nav aria-label="breadcrumb">
                            <ol className="breadcrumb">
                                <li className="breadcrumb-item">
                                    <Link to="/hod">
                                        <i className="fas fa-home fa-sm"></i>
                                    </Link>
                                </li>
                                {this.subjectId ? (
                                    <li className="breadcrumb-item">
                                        <Link
                                            to={`/hod/subject/${this.subjectId}`}
                                        >
                                            {this.props.subject_name}
                                        </Link>
                                    </li>
                                ) : (
                                    <li className="breadcrumb-item">
                                        <Link
                                            to={`/hod/course/${this.courseId}`}
                                        >
                                            {this.props.course_name}
                                        </Link>
                                    </li>
                                )}
                                <li className="breadcrumb-item">
                                    <Link
                                        to="#"
                                        onClick={this.props.history.goBack}
                                    >
                                        {this.props.chapter_name}
                                    </Link>
                                </li>
                                <li className="breadcrumb-item active">
                                    {this.props.cycle_name}
                                </li>
                            </ol>
                        </nav>
                    </div>
                    <div className="col-lg-4">
                        <Select
                            className="basic-single form-shadow"
                            placeholder="Select attempt"
                            isSearchable={true}
                            name="attempt"
                            value={(this.state.attempts || []).map((data) => {
                                return data.name === this.state.selectedAttempt
                                    ? {
                                          value: data.name,
                                          label: data.name,
                                      }
                                    : "";
                            })}
                            options={(this.state.attempts || []).map((data) => {
                                return {
                                    value: data.name,
                                    label: data.name,
                                };
                            })}
                            onChange={(event) => {
                                this.setState(
                                    {
                                        selectedAttempt: event.value,
                                        data: [],
                                        totalSubQuestion: [],
                                        currentSubQuestionIndex: [],
                                        page_loading: true,
                                    },
                                    () => this.loadQAData()
                                );
                            }}
                            required
                        />
                    </div>
                </div>

                {/* Header */}
                <div className="card primary-bg text-white small mb-4">
                    <div className="card-body">
                        <div className="row">
                            <div className="col-lg-7 col-md-5">
                                {this.state.sections.length !== 0
                                    ? this.state.sections[
                                          this.state.currentSectionIndex
                                      ].section_name
                                    : ""}
                            </div>
                            <div className="col-lg-5 col-md-7">
                                <div className="row">
                                    <div className="col-4">
                                        {this.state.selectedAttempt}
                                    </div>
                                    <div className="col-4">
                                        {this.state.data.length !== 0
                                            ? this.state.data.length
                                            : "0"}{" "}
                                        Questions
                                    </div>
                                    <div className="col-4">
                                        Total time: {this.state.duration} mins
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* ----- Question render ----- */}
                {this.state.data && this.state.data.length !== 0
                    ? // TypeOne question
                      this.state.type === "type_1"
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
                        : // TypeTwo question
                        this.state.type === "type_2"
                        ? this.state.data.map((data, q_index) => {
                              return (
                                  <TypeTwoQuestion
                                      key={q_index}
                                      q_index={q_index}
                                      data={data}
                                      changeImage={this.changeImage}
                                  />
                              );
                          })
                        : ""
                    : ""}

                {/* Navigation */}
                <div className="row">
                    <div className="col-6">
                        {this.state.currentSectionIndex !== 0 ? (
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
                        {this.state.currentSectionIndex + 1 >=
                        this.state.totalSection ? (
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

export default connect(mapStateToProps)(HODCyclePreview);
