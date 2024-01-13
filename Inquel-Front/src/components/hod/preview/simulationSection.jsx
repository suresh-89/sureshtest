import React, { Component, useState } from "react";
import Wrapper from "../wrapper";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { baseUrl, hodUrl } from "../../../shared/baseUrl.js";
import Loading from "../../common/loader";
import AlertBox from "../../common/alert";
import Lightbox from "react-awesome-lightbox";
import "react-awesome-lightbox/build/style.css";
import { QuestionDataFormat } from "../../common/function/dataFormating";

const mapStateToProps = (state) => ({
    subject_name: state.content.subject_name,
    course_name: state.content.course_name,
    simulation_name: state.content.simulation_name,
    paper_name: state.content.paper_name,
});

const TypeOneQuestion = (props) => {
    return (
        <div
            className={`d-flex align-items-start ${
                props.pair.length === 2
                    ? props.q_index === 0
                        ? "mb-3"
                        : ""
                    : ""
            }`}
            key={props.q_index}
        >
            <button
                className="btn bg-white btn-sm shadow-sm mr-1 px-3 font-weight-bold-600 rounded-lg"
                style={{ cursor: "default" }}
            >
                {props.pair.length === 2
                    ? props.q_index === 0
                        ? `${props.pair_index + 1}A`
                        : `${props.pair_index + 1}B`
                    : props.pair_index + 1}
            </button>
            <div className="card shadow-sm w-100">
                <div className="card-body">
                    <div className="d-flex">
                        <div className="w-100">
                            <div
                                className="pb-2"
                                dangerouslySetInnerHTML={{
                                    __html: props.data.question,
                                }}
                            ></div>
                            {props.data.content.mcq ? (
                                <div className="row">
                                    {props.data.content.options.map(
                                        (options, index) => {
                                            return (
                                                <div
                                                    className="col-md-6"
                                                    key={index}
                                                >
                                                    <div className="form-group">
                                                        <div
                                                            className={`card shadow-sm ${
                                                                options.correct
                                                                    ? "success-bg"
                                                                    : "bg-light"
                                                            }`}
                                                        >
                                                            <div className="card-body small font-weight-bold-600 p-3">
                                                                <div
                                                                    dangerouslySetInnerHTML={{
                                                                        __html: `<div class="remove-bottom-margin">${options.content}</div>`,
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
                            {props.data.content.fill_in ? (
                                <div className="row">
                                    {props.data.content.fillin_answer.map(
                                        (fill_in, index) => {
                                            return (
                                                <div
                                                    className="col-md-6"
                                                    key={index}
                                                >
                                                    <div className="form-group">
                                                        <div className="card form-shadow">
                                                            <div className="card-body small font-weight-bold-600 p-3">
                                                                {fill_in}
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
                            {props.data.content.boolean ? (
                                <div className="row">
                                    {props.data.content.boolean_question.map(
                                        (boolean, index) => {
                                            return (
                                                <div
                                                    className="col-md-6"
                                                    key={index}
                                                >
                                                    <div className="form-group">
                                                        <div
                                                            className={`card shadow-sm ${
                                                                boolean.correct
                                                                    ? "success-bg"
                                                                    : "bg-light"
                                                            }`}
                                                        >
                                                            <div className="card-body small font-weight-bold-600 p-3">
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
                        {/* ----- image preview ----- */}
                        {props.data.content &&
                        props.data.content.images &&
                        props.data.content.images.length !== 0 ? (
                            <div className="ml-3">
                                {props.data.content.images.map(
                                    (images, index) => {
                                        return images.path !== "" ? (
                                            <div
                                                key={index}
                                                className="card preview-img-circle shadow-sm"
                                                style={{
                                                    backgroundImage: `url(${images.path})`,
                                                }}
                                                onClick={() =>
                                                    props.changeImage(
                                                        props.data.content
                                                            .images,
                                                        index
                                                    )
                                                }
                                            ></div>
                                        ) : (
                                            ""
                                        );
                                    }
                                )}
                            </div>
                        ) : (
                            ""
                        )}
                    </div>
                </div>

                {/* ----- Answer type tag ----- */}
                <div
                    className="secondary-bg primary-text font-weight-bold px-2 py-1 position-absolute rounded-lg shadow-sm"
                    style={{
                        bottom: "5px",
                        right: "5px",
                        fontSize: "10px",
                    }}
                >
                    {props.data.content.mcq
                        ? "MCQ"
                        : props.data.content.fill_in
                        ? "Fill in"
                        : "True / False"}
                </div>
            </div>
        </div>
    );
};

const TypeTwoQuestion = (props) => {
    const total_sub_question = props.data.sub_question.length;
    const [current_sub_question, setCurrentSubQuestion] = useState(0);

    return (
        <div
            className={`d-flex align-items-start ${
                props.pair.length === 2
                    ? props.q_index === 0
                        ? "mb-3"
                        : ""
                    : ""
            }`}
            key={props.q_index}
        >
            <button
                className="btn bg-white btn-sm shadow-sm mr-1 px-3 font-weight-bold-600 rounded-lg"
                style={{ cursor: "default" }}
            >
                {props.pair.length === 2
                    ? props.q_index === 0
                        ? `${props.pair_index + 1}A`
                        : `${props.pair_index + 1}B`
                    : props.pair_index + 1}
            </button>
            {/* ---------- Question preview ---------- */}
            <div className="card shadow-sm w-100">
                <div className="card-body d-flex">
                    <div className="w-100">
                        <div className="row">
                            {/* ----- Main Question ----- */}
                            <div className="col-md-6">
                                <div
                                    dangerouslySetInnerHTML={{
                                        __html: props.data.question,
                                    }}
                                ></div>
                            </div>
                            {/* ----- Sub Question ----- */}
                            <div className="col-md-6">
                                <div className="d-flex align-items-start">
                                    <button
                                        className="btn secondary-bg btn-sm shadow-sm mr-1 px-3 font-weight-bold-600 rounded-lg"
                                        style={{ cursor: "default" }}
                                    >
                                        {current_sub_question + 1}
                                    </button>

                                    {/* ---------- Sub Question preview ---------- */}
                                    <div className="card w-100">
                                        <div className="card secondary-bg py-2 px-3 mb-2">
                                            <div
                                                dangerouslySetInnerHTML={{
                                                    __html: props.data
                                                        .sub_question[
                                                        current_sub_question
                                                    ].question,
                                                }}
                                            ></div>
                                        </div>
                                        {props.data.sub_question[
                                            current_sub_question
                                        ].mcq
                                            ? props.data.sub_question[
                                                  current_sub_question
                                              ].options.map(
                                                  (options, index) => {
                                                      return (
                                                          <div
                                                              className={`card shadow-sm mb-2 ${
                                                                  options.correct
                                                                      ? "success-bg"
                                                                      : "bg-light"
                                                              }`}
                                                              key={index}
                                                          >
                                                              <div className="card-body small font-weight-bold-600 p-3">
                                                                  <div
                                                                      dangerouslySetInnerHTML={{
                                                                          __html: `<div class="remove-bottom-margin">${options.content}</div>`,
                                                                      }}
                                                                  ></div>
                                                              </div>
                                                          </div>
                                                      );
                                                  }
                                              )
                                            : ""}
                                        {props.data.sub_question[
                                            current_sub_question
                                        ].fill_in
                                            ? props.data.sub_question[
                                                  current_sub_question
                                              ].fillin_answer.map(
                                                  (fill_in, index) => {
                                                      return (
                                                          <div
                                                              className="card shadow-sm bg-light mb-2"
                                                              key={index}
                                                          >
                                                              <div className="card-body small font-weight-bold-600 p-3">
                                                                  {fill_in}
                                                              </div>
                                                          </div>
                                                      );
                                                  }
                                              )
                                            : ""}

                                        {/* ----- Navigation ----- */}
                                        <div className="d-flex align-items-center justify-content-center mt-2">
                                            <button
                                                className="btn btn-sm primary-text shadow-none"
                                                onClick={() => {
                                                    setCurrentSubQuestion(
                                                        current_sub_question - 1
                                                    );
                                                    window.MathJax.typeset();
                                                }}
                                                disabled={
                                                    current_sub_question === 0
                                                        ? true
                                                        : false
                                                }
                                            >
                                                <i className="fas fa-arrow-circle-left fa-lg"></i>
                                            </button>
                                            <div className="border-primary small font-weight-bold-600 rounded-lg px-3 py-1 mx-3">
                                                {current_sub_question + 1} /{" "}
                                                {total_sub_question}
                                            </div>
                                            <button
                                                className="btn btn-sm primary-text shadow-none"
                                                onClick={() => {
                                                    setCurrentSubQuestion(
                                                        current_sub_question + 1
                                                    );
                                                    window.MathJax.typeset();
                                                }}
                                                disabled={
                                                    current_sub_question + 1 <
                                                    total_sub_question
                                                        ? false
                                                        : true
                                                }
                                            >
                                                <i className="fas fa-arrow-circle-right fa-lg"></i>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* ----- image preview ----- */}
                    {props.data.content &&
                    props.data.content.images &&
                    props.data.content.images.length !== 0 ? (
                        <div className="ml-3">
                            {props.data.content.images.map((images, index) => {
                                return images.path !== "" ? (
                                    <div
                                        key={index}
                                        className="card preview-img-circle shadow-sm"
                                        style={{
                                            backgroundImage: `url(${images.path})`,
                                        }}
                                        onClick={() =>
                                            props.changeImage(
                                                props.data.content.images,
                                                index
                                            )
                                        }
                                    ></div>
                                ) : (
                                    ""
                                );
                            })}
                        </div>
                    ) : (
                        ""
                    )}
                </div>
            </div>
        </div>
    );
};

class HODSimulationSectionPreview extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: [],
            pairData: [],
            type: "",
            duration: "",
            sections: [],
            sectionId: "",

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
        this.courseId = this.props.match.params.courseId;
        this.simulationId = this.props.match.params.simulationId;
        this.paperId = this.props.match.params.paperId;
        this.url = baseUrl + hodUrl;
        this.authToken = localStorage.getItem("Authorization");
        this.headers = {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: this.authToken,
        };
    }

    componentDidMount = () => {
        document.title = `${this.props.paper_name} - HOD | IQLabs`;

        this.loadSectionData();
    };

    // loads question & answer
    loadQAData = async () => {
        await fetch(
            `${this.url}/hod/course/${this.courseId}/review/simulation/${this.simulationId}/${this.paperId}/${this.state.sectionId}/`,
            {
                method: "GET",
                headers: this.headers,
            }
        )
            .then((res) => res.json())
            .then((result) => {
                let type = "";
                let data = [...this.state.data];
                if (result.sts === true) {
                    if (result.data && result.data.length !== 0) {
                        let values = QuestionDataFormat(result.data);
                        type = values.type;
                        data.push(...values.result);

                        let arr = [];
                        let totalArr = [];
                        let currentArr = [];
                        let question = values.result;

                        // pairing question
                        for (let i = 0; i < question.length; i++) {
                            let temp = [];
                            let totalTemp = [];
                            let currentTemp = [];

                            temp.push(question[i]);
                            currentTemp.push(0);
                            type === "type_1"
                                ? totalTemp.push(0)
                                : totalTemp.push(
                                      question[i].sub_question.length
                                  );

                            for (let j = 0; j < question.length; j++) {
                                if (
                                    question[i].question_random_id ===
                                    question[j].pair_question_id
                                ) {
                                    temp.push(question[j]);
                                    currentTemp.push(0);
                                    type === "type_1"
                                        ? totalTemp.push(0)
                                        : totalTemp.push(
                                              question[j].sub_question.length
                                          );
                                    question.splice(j, 1);
                                }
                            }
                            arr.push(temp);
                            currentArr.push(currentTemp);
                            totalArr.push(totalTemp);
                        }

                        this.setState({
                            data: data,
                            pairData: arr,
                            type: type,
                            totalSubQuestion: totalArr,
                            currentSubQuestionIndex: currentArr,
                            page_loading: false,
                        });
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
            `${this.url}/hod/course/${this.courseId}/review/simulation/${this.simulationId}/${this.paperId}/`,
            {
                method: "GET",
                headers: this.headers,
            }
        )
            .then((res) => res.json())
            .then((result) => {
                if (result.sts === true) {
                    this.setState(
                        {
                            sections: result.data,
                            sectionId: result.data[0].section_id,
                            totalSection: result.data.length,
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
                pairData: [],
                totalSubQuestion: [],
                currentSubQuestionIndex: [],
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
                pairData: [],
                totalSubQuestion: [],
                currentSubQuestionIndex: [],
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

                {/* ----- Breadcrumb ----- */}
                <nav aria-label="breadcrumb">
                    <ol className="breadcrumb mb-3">
                        <li className="breadcrumb-item">
                            <Link to="/hod">
                                <i className="fas fa-home fa-sm"></i>
                            </Link>
                        </li>
                        {this.subjectId ? (
                            <li className="breadcrumb-item">
                                <Link to={`/hod/subject/${this.subjectId}`}>
                                    {this.props.subject_name}
                                </Link>
                            </li>
                        ) : (
                            <li className="breadcrumb-item">
                                <Link to={`/hod/course/${this.courseId}`}>
                                    {this.props.course_name}
                                </Link>
                            </li>
                        )}
                        <li className="breadcrumb-item">
                            <Link to="#" onClick={this.props.history.goBack}>
                                {this.props.simulation_name}
                            </Link>
                        </li>
                        <li className="breadcrumb-item active">
                            {this.props.paper_name}
                        </li>
                    </ol>
                </nav>

                {/* Header */}
                <div className="card primary-bg text-white small mb-4">
                    <div className="card-body">
                        <div className="row">
                            <div className="col-md-6">
                                {this.state.sections.length !== 0
                                    ? this.state.sections[
                                          this.state.currentSectionIndex
                                      ].section_name
                                    : ""}
                            </div>
                            <div className="col-md-2">
                                Total questions:{" "}
                                {this.state.sections
                                    ? this.state.sections[
                                          this.state.currentSectionIndex
                                      ]
                                        ? this.state.sections[
                                              this.state.currentSectionIndex
                                          ].total_questions
                                        : ""
                                    : ""}
                            </div>
                            <div className="col-md-2">
                                Any questions:{" "}
                                {this.state.sections
                                    ? this.state.sections[
                                          this.state.currentSectionIndex
                                      ]
                                        ? this.state.sections[
                                              this.state.currentSectionIndex
                                          ].any_questions
                                        : ""
                                    : ""}
                            </div>
                            <div className="col-md-2">
                                Marks:{" "}
                                {this.state.sections
                                    ? this.state.sections[
                                          this.state.currentSectionIndex
                                      ]
                                        ? this.state.sections[
                                              this.state.currentSectionIndex
                                          ].marks
                                        : ""
                                    : ""}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Q&A */}
                {this.state.type === "type_1"
                    ? (this.state.pairData || []).map((pair, pair_index) => {
                          return (
                              <div
                                  className="card card-body light-bg shadow-sm mb-3"
                                  key={pair_index}
                              >
                                  {(pair || []).map((data, q_index) => {
                                      return (
                                          // type one question
                                          <TypeOneQuestion
                                              key={q_index}
                                              pair={pair}
                                              pair_index={pair_index}
                                              q_index={q_index}
                                              data={data}
                                              changeImage={this.changeImage}
                                          />
                                      );
                                  })}
                              </div>
                          );
                      })
                    : this.state.type === "type_2"
                    ? (this.state.pairData || []).map((pair, pair_index) => {
                          return (
                              <div
                                  className="card card-body light-bg shadow-sm mb-3"
                                  key={pair_index}
                              >
                                  {(pair || []).map((data, q_index) => {
                                      return (
                                          // type two questions
                                          <TypeTwoQuestion
                                              key={q_index}
                                              pair={pair}
                                              pair_index={pair_index}
                                              q_index={q_index}
                                              data={data}
                                              imageRender={this.imageRender}
                                              toggleModal={this.toggleModal}
                                          />
                                      );
                                  })}
                              </div>
                          );
                      })
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

export default connect(mapStateToProps)(HODSimulationSectionPreview);
