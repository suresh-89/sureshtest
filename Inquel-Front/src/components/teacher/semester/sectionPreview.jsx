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
import TypeTwoQuestion from "../../common/preview/TypeTwo";

const mapStateToProps = (state) => ({
    group_name: state.content.group_name,
    subject_name: state.content.subject_name,
    semester_name: state.content.semester_name,
});

class TeacherSemesterAutoQA extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: [],
            type: "",
            duration: "",
            sectionId: this.props.match.params.sectionId,

            selectedImageData: [],
            startIndex: 0,
            isLightBoxOpen: false,

            sectionData: [],
            totalSection: 0,
            currentSectionIndex: 0,

            errorMsg: "",
            successMsg: "",
            showErrorAlert: false,
            showSuccessAlert: false,
            page_loading: true,
        };
        this.groupId = this.props.match.params.groupId;
        this.subjectId = this.props.match.params.subjectId;
        this.semesterId = this.props.match.params.semesterId;
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
        this.loadSectionData();
    };

    // loads question & answer
    loadQAData = async (path) => {
        var apiURL =
            path === undefined || path === null
                ? `${this.url}/teacher/subject/${this.subjectId}/semester/${this.semesterId}/auto/${this.state.sectionId}/?attempt_number=${this.attempt}`
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
        fetch(
            `${this.url}/teacher/subject/${this.subjectId}/semester/${this.semesterId}/auto/`,
            {
                method: "GET",
                headers: this.headers,
            }
        )
            .then((res) => res.json())
            .then((result) => {
                if (result.sts === true) {
                    let currentIndex = "";
                    let data = [];
                    for (let i = 0; i < result.data.auto_test.length; i++) {
                        data.push(result.data.auto_test[i]);
                        if (
                            result.data.auto_test[i].section_id ===
                            this.state.sectionId
                        ) {
                            currentIndex = i;
                        } else {
                            continue;
                        }
                    }
                    this.setState({
                        sectionData: data,
                        totalSection: result.data.auto_test.length,
                        currentSectionIndex: currentIndex,
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
        const section = this.state.sectionData;
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
        const section = this.state.sectionData;
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
        document.title = `${this.props.semester_name} : ${
            this.state.sectionData.length !== 0
                ? this.state.sectionData[this.state.currentSectionIndex]
                      .section_description
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
                            <Link to="#" onClick={this.props.history.goBack}>
                                {this.props.semester_name}
                            </Link>
                        </li>
                        <li className="breadcrumb-item active">Section</li>
                    </ol>
                </nav>

                {/* Header */}
                <div className="card primary-bg text-white small mb-4">
                    <div className="card-body">
                        <div className="row">
                            <div className="col-lg-7 col-md-5">
                                {this.state.sectionData.length !== 0
                                    ? this.state.sectionData[
                                          this.state.currentSectionIndex
                                      ].section_description
                                    : ""}
                            </div>
                            <div className="col-lg-5 col-md-7">
                                <div className="row">
                                    <div className="col-4">{this.attempt}</div>
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

export default connect(mapStateToProps)(TeacherSemesterAutoQA);
