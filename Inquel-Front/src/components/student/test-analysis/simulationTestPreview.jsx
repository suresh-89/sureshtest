import React, { Component, useState, useEffect } from "react";
import Header from "../shared/examNavbar";
import { baseUrl, studentUrl } from "../../../shared/baseUrl.js";
import dateFormat from "dateformat";
import { connect } from "react-redux";
import Lightbox from "react-awesome-lightbox";
import "react-awesome-lightbox/build/style.css";
import VideoModal from "../../common/modal/videoModal";
import { OverlayTrigger, Tooltip, Modal, Popover } from "react-bootstrap";
import { ErrorBoundary } from "react-error-boundary";
import ErrorFallback from "../../common/ErrorFallback";
import NumericConversion from "../../common/function/NumericConversion";

const mapStateToProps = (state) => ({
    course_data: state.storage.response,
    temp: state.storage.temp,
    course_name: state.content.course_name,
});

const ExplanationModal = (props) => {
    const [data, setData] = useState("");

    useEffect(() => {
        async function fetchData() {
            await setData(props.data);
        }
        fetchData();
        window.MathJax.typeset();
    });

    return (
        <Modal
            show={props.show}
            onHide={props.onHide}
            size="lg"
            aria-labelledby="contained-modal-title-vcenter"
            centered
            scrollable
        >
            <Modal.Header closeButton>Explanation</Modal.Header>
            <Modal.Body className="position-static">
                <div className="user-select-none" style={{ minHeight: "50vh" }}>
                    <div
                        dangerouslySetInnerHTML={{
                            __html: data,
                        }}
                    ></div>
                    <div
                        className="position-absolute"
                        style={{ right: "50px", top: "15px" }}
                    >
                        {(props.audio || []).map((audio, audio_index) => {
                            return audio.path !== "" ? (
                                <OverlayTrigger
                                    trigger="click"
                                    rootClose
                                    key={`popover${audio_index}`}
                                    placement="bottom"
                                    overlay={
                                        <Popover
                                            id={`popover-positioned-bottom${audio_index}`}
                                        >
                                            {audio.title !== "" ? (
                                                <Popover.Title>
                                                    {audio.title}
                                                </Popover.Title>
                                            ) : (
                                                ""
                                            )}
                                            <Popover.Content className="overflow-auto">
                                                <audio
                                                    src={audio.path}
                                                    autoPlay
                                                    controls
                                                    controlsList="nodownload"
                                                ></audio>
                                            </Popover.Content>
                                        </Popover>
                                    }
                                >
                                    <button
                                        className="btn btn-primary btn-sm rounded-circle mr-2 shadow-none"
                                        key={audio_index}
                                    >
                                        <i className="fas fa-volume-up buttton fa-sm"></i>
                                    </button>
                                </OverlayTrigger>
                            ) : (
                                ""
                            );
                        })}
                    </div>
                </div>
            </Modal.Body>
        </Modal>
    );
};

const TypeOneQuestion = (props) => {
    return (
        <div
            className={`d-flex align-items-start user-select-none ${
                props.pair.length === 2
                    ? props.q_index === 0
                        ? "mb-3"
                        : ""
                    : ""
            }`}
            key={props.q_index}
        >
            <button
                className="btn btn-light btn-sm shadow-sm mr-1 px-3 font-weight-bold-600 rounded-lg"
                style={{
                    cursor: "default",
                }}
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
                        {/* Questions & options */}
                        <div className="w-100">
                            <div
                                className="mb-3"
                                dangerouslySetInnerHTML={{
                                    __html: props.question.question,
                                }}
                            ></div>

                            {/* ---------- Options ---------- */}
                            {(props.question.proper_answer || []).map(
                                (option, option_index) => {
                                    return (
                                        <div
                                            className="form-group"
                                            key={option_index}
                                        >
                                            <div
                                                className={`card shadow-sm ${
                                                    // check if it is a unanswered or choice question
                                                    props.question.choice ===
                                                        false &&
                                                    props.question
                                                        .unanswered === false
                                                        ? // check if the option is same as student answer
                                                          (
                                                              props.question
                                                                  .answer || []
                                                          )
                                                              .map((data) =>
                                                                  option.content
                                                                      ? data
                                                                      : data.toLowerCase()
                                                              )
                                                              .includes(
                                                                  option.content
                                                                      ? option.content
                                                                      : option.toLowerCase()
                                                              )
                                                            ? // if the marks is greater than 0, then it is a correct answer
                                                              props.question
                                                                  .marks > 0
                                                                ? "success-bg"
                                                                : option.correct
                                                                ? "success-bg"
                                                                : "danger-bg"
                                                            : option.correct ===
                                                              true
                                                            ? "success-bg"
                                                            : "bg-light"
                                                        : "bg-light"
                                                }`}
                                            >
                                                <div
                                                    className="card-body small font-weight-bold-600 p-3"
                                                    dangerouslySetInnerHTML={{
                                                        __html: `<div class="remove-bottom-margin">${
                                                            option.content !==
                                                            undefined
                                                                ? option.content
                                                                : option
                                                        }</div>`,
                                                    }}
                                                ></div>
                                            </div>
                                        </div>
                                    );
                                }
                            )}

                            {/* ---------- Student answers ---------- */}
                            {/* showing this section only for fill in question */}
                            {props.question.proper_answer &&
                            props.question.proper_answer[0] ? (
                                // if the marks is 0 and it is a fill in question, show the student answer
                                props.question.marks === 0 &&
                                props.question.proper_answer[0].content ===
                                    undefined ? (
                                    <div className="row mb-2">
                                        <div className="col-md-6">
                                            <div
                                                className="card card-body danger-bg h-100"
                                                style={{
                                                    minHeight: "100px",
                                                }}
                                            >
                                                <p className="font-weight-bold-600 mb-2">
                                                    Your answer(s):
                                                </p>
                                                {(
                                                    props.question.answer || []
                                                ).map(
                                                    (answer, answer_index) => {
                                                        return (
                                                            <p
                                                                className="small mb-2"
                                                                key={
                                                                    answer_index
                                                                }
                                                                dangerouslySetInnerHTML={{
                                                                    __html: answer,
                                                                }}
                                                            ></p>
                                                        );
                                                    }
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    ""
                                )
                            ) : (
                                ""
                            )}

                            {/* ----- Explanation ----- */}

                            {(props.question.audio &&
                                props.question.audio.length !== 0) ||
                            props.question.explanation !== "" ? (
                                <button
                                    className="btn btn-link btn-sm shadow-none"
                                    onClick={() =>
                                        props.toggleModal(
                                            props.question.explanation,
                                            props.question.audio
                                        )
                                    }
                                >
                                    <i className="fas fa-info-circle mr-1"></i>{" "}
                                    Explanation
                                </button>
                            ) : (
                                ""
                            )}
                        </div>

                        {/* ----- image preview ----- */}
                        {props.question.images.length !== 0 ||
                        props.question.video.path !== "" ? (
                            <div className="ml-3">
                                {props.imageRender(props.question)}
                            </div>
                        ) : (
                            ""
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

const TypeTwoQuestion = (props) => {
    const total_sub_question = props.question.sub_question.length;
    const [current_sub_question, setCurrentSubQuestion] = useState(0);

    return (
        <div
            className={`d-flex align-items-start user-select-none ${
                props.pair.length === 2
                    ? props.q_index === 0
                        ? "mb-3"
                        : ""
                    : ""
            }`}
            key={props.q_index}
        >
            <button className="btn btn-light btn-sm shadow-sm mr-1 px-3 font-weight-bold-600 rounded-lg">
                {props.pair.length === 2
                    ? props.q_index === 0
                        ? `${props.pair_index + 1}A`
                        : `${props.pair_index + 1}B`
                    : props.pair_index + 1}
            </button>
            {/* ---------- Question preview ---------- */}
            <div className="card card-body shadow-sm w-100">
                <div className="d-flex">
                    <div className="w-100">
                        {/* ----- Main Question ----- */}
                        <div
                            className="mb-3"
                            dangerouslySetInnerHTML={{
                                __html: props.question.question,
                            }}
                        ></div>

                        <div className="row mb-2">
                            {/* ---------- Student answers ---------- */}
                            <div className="col-md-5 order-2 order-md-1">
                                <div className="card" id="drop-area">
                                    <div className="card-header font-weight-bold-600 pb-0">
                                        Your answer(s):
                                    </div>
                                    <div className="card-body">
                                        {(
                                            props.question.sub_question || []
                                        ).map((sub_answer, sub_index) => {
                                            return sub_answer.answer[0] ? (
                                                <div
                                                    key={sub_index}
                                                    className={`card card-body shadow-sm small font-weight-bold-600 ${
                                                        sub_answer.marks === 0
                                                            ? "danger-bg"
                                                            : "success-bg"
                                                    } p-3 mb-2`}
                                                >
                                                    <div
                                                        className="d-flex"
                                                        dangerouslySetInnerHTML={{
                                                            __html: `<span class="mr-1">${
                                                                sub_index + 1
                                                            }.</span><div class="remove-bottom-margin">${
                                                                sub_answer
                                                                    .answer[0]
                                                            }</div>`,
                                                        }}
                                                    ></div>
                                                </div>
                                            ) : null;
                                        })}
                                    </div>
                                </div>
                            </div>

                            {/* ----- Sub Question ----- */}

                            <div className="col-md-7 mb-3 mb-md-0 order-1 order-md-2">
                                <div className="d-flex align-items-start justify-content h-100">
                                    <button className="btn secondary-bg btn-sm shadow-sm mr-1 mt-1 px-3 font-weight-bold-600 rounded-lg">
                                        {current_sub_question + 1}
                                    </button>

                                    {/* ---------- Sub Question preview ---------- */}
                                    <div className="card w-100 d-flex flex-column h-100">
                                        <div className="card secondary-bg py-2 px-3 mb-2">
                                            <div
                                                dangerouslySetInnerHTML={{
                                                    __html: props.question
                                                        .sub_question[
                                                        current_sub_question
                                                    ].question,
                                                }}
                                            ></div>
                                        </div>

                                        {/* ---------- Options ---------- */}

                                        {(
                                            props.question.sub_question[
                                                current_sub_question
                                            ].proper_answer || []
                                        ).map((option, option_index) => {
                                            return (
                                                <div
                                                    className={`card shadow-sm mb-2 ${
                                                        // check if it is a choice or unanswered question
                                                        props.question
                                                            .choice === false &&
                                                        props.question
                                                            .unanswered ===
                                                            false
                                                            ? option.correct !==
                                                              undefined
                                                                ? option.correct
                                                                    ? "success-bg"
                                                                    : "bg-light"
                                                                : "bg-light"
                                                            : "bg-light"
                                                    }`}
                                                    key={option_index}
                                                >
                                                    <div
                                                        className="card-body small font-weight-bold-600 p-3"
                                                        dangerouslySetInnerHTML={{
                                                            __html: `<div class="remove-bottom-margin">${
                                                                option.content !==
                                                                undefined
                                                                    ? option.content
                                                                    : option
                                                            }</div>`,
                                                        }}
                                                    ></div>
                                                </div>
                                            );
                                        })}

                                        {/* ---------- Navigation button ---------- */}

                                        <div className="d-flex align-items-center justify-content-center mt-auto">
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

                        {/* ----- Explanation ----- */}

                        {(props.question.audio &&
                            props.question.audio.length !== 0) ||
                        props.question.explanation !== "" ? (
                            <button
                                className="btn btn-link btn-sm shadow-none"
                                onClick={() =>
                                    props.toggleModal(
                                        props.question.explanation,
                                        props.question.audio
                                    )
                                }
                            >
                                <i className="fas fa-info-circle mr-1"></i>{" "}
                                Explanation
                            </button>
                        ) : (
                            ""
                        )}
                    </div>

                    {/* ----- image preview ----- */}
                    {props.question.images.length !== 0 ||
                    props.question.video.path !== "" ? (
                        <div className="ml-3">
                            {props.imageRender(props.question)}
                        </div>
                    ) : (
                        ""
                    )}
                </div>
            </div>
        </div>
    );
};

const RemarksTable = (props) => {
    return (
        <div className="container mb-3">
            <div className="card shadow-sm">
                <div className="table-responsive">
                    <table className="table">
                        <thead className="primary-text">
                            <tr
                                style={{
                                    whiteSpace: "nowrap",
                                }}
                            >
                                <th scope="col">Chapter</th>
                                <th scope="col">Total marks</th>
                                <th scope="col">Secured marks</th>
                                <th scope="col">Percentage %</th>
                            </tr>
                        </thead>
                        <tbody>
                            {Object.entries(props.chapter_topic_remarks).map(
                                ([key, value], index) => {
                                    return (
                                        <tr key={index}>
                                            <td>
                                                {props.returnChapterName(key)
                                                    ? props.returnChapterName(
                                                          key
                                                      )
                                                    : key}
                                            </td>
                                            <td>{value.total_marks}</td>
                                            <td>{value.correct_marks}</td>
                                            <td>
                                                {NumericConversion(
                                                    (value.correct_marks /
                                                        value.total_marks) *
                                                        100
                                                )}
                                            </td>
                                        </tr>
                                    );
                                }
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

class SimulationTestPreview extends Component {
    constructor(props) {
        super(props);
        this.state = {
            showExplanationModal: false,
            showVideoModal: false,
            selectedData: "",

            questions: [],

            totalSection: 0,
            currentSectionIndex: 0,
            totalQuestion: 0,

            section_marks: [],
            // section_total_marks: [],
            chapter_topic_remarks: {},

            selectedImageData: [],
            imageIndex: 0,
            isLightBoxOpen: false,
            selectedVideoData: "",
            selectedAudio: [],
        };
        this.subscriptionId = this.props.match.params.subscriptionId;
        this.courseId = this.props.match.params.courseId;
        this.simulationId = this.props.match.params.simulationId;
        this.url = baseUrl + studentUrl;
        this.authToken = localStorage.getItem("Authorization");
        this.headers = {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: this.authToken,
        };
    }

    componentDidMount = () => {
        document.title = `${this.props.temp.simulation_name} : Test preview - Student | IQLabs`;

        if (this.props.temp.auto === true) {
            this.loopAutoSection();
        }
    };

    loopAutoSection = async () => {
        let sections = [];
        let totalQuestion = 0;
        let section_marks = [];
        // let section_total_marks = [];

        let chapter_topic_remarks = {};

        this.props.temp.data.forEach((data) => {
            if (data.simulation_id === this.simulationId) {
                // section looping
                data.sections.forEach((section) => {
                    let temp_section_marks = 0;
                    // let temp_section_total_marks = 0;

                    // section wise temp variables
                    let section_question_temp = [];

                    // pairing question
                    for (let i = 0; i < section.questions.length; i++) {
                        let temp = [];

                        // count total_questioin and section_marks only for the non choice question
                        if (section.questions[i].choice === false) {
                            totalQuestion++;
                            temp_section_marks += section.questions[i].marks;
                            // temp_section_total_marks +=
                            //     section.section_total_marks;
                        }

                        this.questionLoop(section.questions[i], temp);

                        for (let j = 0; j < section.questions.length; j++) {
                            if (
                                section.questions[i].question_random_id ===
                                section.questions[j].pair_question_id
                            ) {
                                this.questionLoop(section.questions[j], temp);
                                section.questions.splice(j, 1);
                            }
                        }

                        section_question_temp.push(temp);
                    }

                    sections.push(section_question_temp);
                    section_marks.push(temp_section_marks);
                    // section_total_marks.push(temp_section_total_marks);
                });

                // if chapter_remarks is added, then it is a semester
                if (this.simulationId) {
                    if (data.chapter_remarks) {
                        if (
                            data.chapter_remarks &&
                            Object.keys(data.chapter_remarks).length !== 0
                        ) {
                            Object.entries(data.chapter_remarks).forEach(
                                ([key, value]) => {
                                    chapter_topic_remarks[key] = {
                                        correct_marks: 0,
                                        total_marks: 0,
                                    };
                                }
                            );
                        }
                    }
                }
            }
        });

        await this.setState(
            {
                questions: sections,
                totalSection: sections.length,
                totalQuestion: totalQuestion,
                section_marks: section_marks,
                // section_total_marks: section_total_marks,
                chapter_topic_remarks: chapter_topic_remarks,
            },
            () => {
                this.calculateRemarks();
            }
        );
        window.MathJax.typeset();
    };

    questionLoop = (question, temp) => {
        let images = [],
            audio = [],
            videoTitle = "",
            videoPath = "";

        if (question.sub_question === undefined) {
            if (question.files && question.files.length !== 0) {
                // image
                if (question.files.type1_image_1) {
                    images.push({
                        title: question.files.type1_image_1_title,
                        file_name: "",
                        image: null,
                        path: question.files.type1_image_1,
                    });
                }
                if (question.files.type1_image_2) {
                    images.push({
                        title: question.files.type1_image_2_title,
                        file_name: "",
                        image: null,
                        path: question.files.type1_image_2,
                    });
                }
                if (question.files.type1_image_3) {
                    images.push({
                        title: question.files.type1_image_3_title,
                        file_name: "",
                        image: null,
                        path: question.files.type1_image_3,
                    });
                }
                if (question.files.type1_image_4) {
                    images.push({
                        title: question.files.type1_image_4_title,
                        file_name: "",
                        image: null,
                        path: question.files.type1_image_4,
                    });
                }

                // audio
                if (question.files.type1_audio_1) {
                    audio.push({
                        title: question.files.type1_audio_1_title,
                        file_name: "",
                        audio: null,
                        path: question.files.type1_audio_1,
                    });
                }
                if (question.files.type1_audio_2) {
                    audio.push({
                        title: question.files.type1_audio_2_title,
                        file_name: "",
                        audio: null,
                        path: question.files.type1_audio_2,
                    });
                }

                // video
                if (question.files.paste_video_url) {
                    videoPath = question.files.paste_video_url;
                }
                if (question.files.type1_video_1) {
                    videoPath = question.files.type1_video_1;
                }
                if (question.files.type1_video_1_title) {
                    videoTitle = question.files.type1_video_1_title;
                }
            }

            temp.push({
                type: "type_1",
                question: question.question,
                question_random_id: question.question_random_id,
                explanation: question.explanation || "",
                images: images.length !== 0 ? images : [],
                video: {
                    title: videoTitle,
                    file_name: "",
                    video: null,
                    path: videoPath,
                    url: "",
                },
                audio: audio.length !== 0 ? audio : [],
                proper_answer: question.proper_answer || [],
                answer: question.answer || [],
                marks: question.marks,
                choice: question.choice,
                unanswered: question.unanswered,
            });
            // type two
        } else if (question.sub_question !== undefined) {
            let sub_question = [];

            // Image
            if (question.files && Object.entries(question.files).length !== 0) {
                if (question.files.type2_image_1) {
                    images.push({
                        title: question.files.type2_image_1_title,
                        file_name: "",
                        image: null,
                        path: question.files.type2_image_1,
                    });
                }
                if (question.files.type2_image_2) {
                    images.push({
                        title: question.files.type2_image_2_title,
                        file_name: "",
                        image: null,
                        path: question.files.type2_image_2,
                    });
                }
                if (question.files.type2_image_3) {
                    images.push({
                        title: question.files.type2_image_3_title,
                        file_name: "",
                        image: null,
                        path: question.files.type2_image_3,
                    });
                }
                if (question.files.type2_image_4) {
                    images.push({
                        title: question.files.type2_image_4_title,
                        file_name: "",
                        image: null,
                        path: question.files.type2_image_4,
                    });
                }

                // audio
                if (question.files.type2_audio_1) {
                    audio.push({
                        title: question.files.type2_audio_1_title,
                        file_name: "",
                        audio: null,
                        path: question.files.type2_audio_1,
                    });
                }
                if (question.files.type2_audio_2) {
                    audio.push({
                        title: question.files.type2_audio_2_title,
                        file_name: "",
                        audio: null,
                        path: question.files.type2_audio_2,
                    });
                }

                // video
                if (question.files.paste_video_url) {
                    videoPath = question.files.paste_video_url;
                }
                if (question.files.type2_video_1) {
                    videoPath = question.files.type2_video_1;
                }
                if (question.files.type2_video_1_title) {
                    videoTitle = question.files.type2_video_1_title;
                }
            }

            for (let j = 0; j < question.sub_question.length; j++) {
                sub_question.push({
                    question: question.sub_question[j].sub_question || "",
                    sub_question_id:
                        question.sub_question[j].sub_question_id || "",
                    proper_answer: question.sub_question[j].proper_answer || [],
                    answer: question.sub_question[j].answer || [],
                    marks: question.sub_question[j].marks,
                });
            }

            temp.push({
                type: "type_2",
                question: question.question,
                question_random_id: question.question_random_id,
                explanation: question.explanation || "",
                sub_question: sub_question,
                images: images.length !== 0 ? images : [],
                video: {
                    title: videoTitle,
                    file_name: "",
                    video: null,
                    path: videoPath,
                    url: "",
                },
                audio: audio.length !== 0 ? audio : [],
                choice: question.choice,
                unanswered: question.unanswered,
            });
        }
    };

    calculateRemarks = () => {
        let chapter_topic_remarks = this.state.chapter_topic_remarks;

        this.props.temp.data.forEach((data) => {
            // chapter_marks looping
            if (
                data.chapter_remarks &&
                Object.keys(data.chapter_remarks).length !== 0
            ) {
                Object.entries(data.chapter_remarks).forEach(([key, value]) => {
                    chapter_topic_remarks[key].correct_marks +=
                        value.correct_marks;
                    chapter_topic_remarks[key].total_marks += value.total_marks;
                });
            }
        });

        this.setState({
            chapter_topic_remarks: chapter_topic_remarks,
        });
    };

    // ---------- Navigation ----------

    handlePrev = async () => {
        await this.setState({
            currentSectionIndex: this.state.currentSectionIndex - 1,
        });
        window.scrollTo(0, 0);
        window.MathJax.typeset();
    };

    handleNext = async () => {
        await this.setState({
            currentSectionIndex: this.state.currentSectionIndex + 1,
        });
        window.scrollTo(0, 0);
        window.MathJax.typeset();
    };

    toggleModal = (data, audio) => {
        this.setState({
            showExplanationModal: !this.state.showExplanationModal,
            selectedData: data,
            selectedAudio: audio,
        });
    };

    // ---------- Image & Video ----------

    changeImage = (images, index) => {
        let imageArr = [];
        this.setState({
            selectedImageData: [],
            imageIndex: 0,
        });
        for (let i = 0; i < images.length; i++) {
            imageArr.push({
                url: images[i].path,
                title: images[i].title,
            });
        }
        this.setState({
            selectedImageData: imageArr,
            imageIndex: index,
            isLightBoxOpen: true,
        });
    };

    imageRender = (data) => {
        return (
            <>
                {data.images && data.images.length !== 0
                    ? data.images.map((images, index) => {
                          return images.path !== "" ? (
                              <div
                                  key={index}
                                  className="card preview-img-circle shadow-sm"
                                  style={{
                                      backgroundImage: `url(${images.path})`,
                                  }}
                                  onClick={() => {
                                      this.changeImage(data.images, index);
                                  }}
                              ></div>
                          ) : (
                              ""
                          );
                      })
                    : ""}
                {data.video.path !== "" ? (
                    <OverlayTrigger
                        key="top5"
                        placement="top"
                        overlay={<Tooltip id="tooltip4">Video</Tooltip>}
                    >
                        <button
                            className="btn btn-primary-invert btn-sm shadow-sm rounded-circle shadow-none mt-1"
                            onClick={() => {
                                this.toggleVideoModal(data.video);
                            }}
                        >
                            <i
                                className="fas fa-video fa-sm"
                                style={{
                                    marginLeft: "4px",
                                    marginRight: "1px",
                                    marginBottom: "7px",
                                    marginTop: "7px",
                                }}
                            ></i>
                        </button>
                    </OverlayTrigger>
                ) : (
                    ""
                )}
            </>
        );
    };

    toggleVideoModal = (data) => {
        this.setState({
            showVideoModal: !this.state.showVideoModal,
            selectedVideoData: data,
        });
    };

    // ---------- Return chapter name ----------

    returnChapterName = (id) => {
        let chapter_name = "";

        this.props.course_data.units.forEach((unit) => {
            unit.chapters.forEach((chapter) => {
                if (chapter.chapter_id === id) {
                    chapter_name = chapter.chapter_name;
                }
            });
        });

        return chapter_name;
    };

    render() {
        var data = [];
        if (this.props.temp.auto === true) {
            data = this.state.questions[this.state.currentSectionIndex] || [];
        }
        return (
            <>
                {/* Navbar */}
                <Header
                    name={this.props.course_name}
                    chapter_name={this.props.temp.simulation_name}
                    goBack={this.props.history.goBack}
                />

                <ErrorBoundary
                    FallbackComponent={ErrorFallback}
                    onReset={() => window.location.reload()}
                >
                    {/* Explanation modal */}
                    <ExplanationModal
                        show={this.state.showExplanationModal}
                        onHide={this.toggleModal}
                        data={this.state.selectedData}
                        audio={this.state.selectedAudio}
                    />
                </ErrorBoundary>

                {/* Image lightbox */}
                {this.state.isLightBoxOpen ? (
                    <Lightbox
                        images={this.state.selectedImageData}
                        startIndex={this.state.imageIndex}
                        onClose={() => {
                            this.setState({
                                isLightBoxOpen: false,
                            });
                        }}
                    />
                ) : (
                    ""
                )}

                {/* ----- Video modal ----- */}
                {this.state.showVideoModal ? (
                    <VideoModal
                        show={this.state.showVideoModal}
                        onHide={this.toggleVideoModal}
                        video={this.state.selectedVideoData}
                    />
                ) : (
                    ""
                )}

                <div className="exam-section">
                    <div className="container-fluid">
                        <ErrorBoundary
                            FallbackComponent={ErrorFallback}
                            onReset={() => window.location.reload()}
                        >
                            {/* ----- Header Info ----- */}
                            <div className="card card-body primary-bg text-white shadow-sm py-3 mb-3">
                                <div className="row align-items-center">
                                    <div className="col-md-2 font-weight-bold-600">
                                        Exam Details
                                    </div>
                                    <div className="col-md-2 small">
                                        Total questions:{" "}
                                        {this.state.totalQuestion <= 9
                                            ? `0${this.state.totalQuestion}`
                                            : this.state.totalQuestion}
                                    </div>
                                    <div className="col-md-2 small">
                                        Scored marks:{" "}
                                        {
                                            this.props.temp.data[0]
                                                .student_scored_marks
                                        }
                                        /{this.props.temp.data[0].total_marks}
                                    </div>
                                    <div className="col-md-2 small">
                                        Percentage:{" "}
                                        {
                                            this.props.temp.data[0]
                                                .student_percentage
                                        }
                                        %
                                    </div>
                                    <div className="col-md-3 small">
                                        Submitted On:{" "}
                                        {dateFormat(
                                            this.props.temp.submit_time,
                                            "dd-mm-yyyy"
                                        )}
                                    </div>
                                    <div className="col-md-1 small font-weight-bold-600">
                                        <div
                                            className="text-center rounded py-2"
                                            style={{
                                                backgroundColor:
                                                    this.props.temp.data[0]
                                                        .color,
                                                textTransform: "capitalize",
                                            }}
                                        >
                                            {this.props.temp.data[0].remarks}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* ----- section details ----- */}
                            <div className="container-fluid">
                                <div className="row justify-content-center mb-3">
                                    <div className="col-md-4 secondary-bg primary-text rounded-lg px-3 py-2">
                                        <div className="row align-items-center">
                                            <div className="col-6 font-weight-bold-600">
                                                {
                                                    this.props.temp.data[0]
                                                        .sections[
                                                        this.state
                                                            .currentSectionIndex
                                                    ].section_description
                                                }
                                            </div>
                                            <div className="col-6 text-right small font-weight-bold-600">
                                                Scored marks:{" "}
                                                {
                                                    this.state.section_marks[
                                                        this.state
                                                            .currentSectionIndex
                                                    ]
                                                }
                                                /
                                                {
                                                    this.props.temp.data[0]
                                                        .sections[
                                                        this.state
                                                            .currentSectionIndex
                                                    ].section_total_marks
                                                }
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* ----- Question and Answer ----- */}
                            {(data || []).map((pair, pair_index) => {
                                return (
                                    <div
                                        className="card card-body light-bg shadow-sm mb-3"
                                        key={pair_index}
                                    >
                                        {(pair || []).map(
                                            (question, q_index) => {
                                                return question.type ===
                                                    "type_1" ? (
                                                    // type one question
                                                    <TypeOneQuestion
                                                        key={q_index}
                                                        pair={pair}
                                                        pair_index={pair_index}
                                                        q_index={q_index}
                                                        question={question}
                                                        imageRender={
                                                            this.imageRender
                                                        }
                                                        toggleModal={
                                                            this.toggleModal
                                                        }
                                                    />
                                                ) : (
                                                    // type two questions
                                                    <TypeTwoQuestion
                                                        key={q_index}
                                                        pair={pair}
                                                        pair_index={pair_index}
                                                        q_index={q_index}
                                                        question={question}
                                                        imageRender={
                                                            this.imageRender
                                                        }
                                                        toggleModal={
                                                            this.toggleModal
                                                        }
                                                    />
                                                );
                                            }
                                        )}
                                    </div>
                                );
                            })}

                            {/* ----- Chapter wise remarks table ----- */}
                            {this.state.currentSectionIndex + 1 ===
                            this.state.totalSection ? (
                                this.state.chapter_topic_remarks &&
                                Object.keys(this.state.chapter_topic_remarks)
                                    .length !== 0 ? (
                                    <RemarksTable
                                        chapter_topic_remarks={
                                            this.state.chapter_topic_remarks
                                        }
                                        returnChapterName={
                                            this.returnChapterName
                                        }
                                    />
                                ) : (
                                    ""
                                )
                            ) : (
                                ""
                            )}

                            {/* ---------- Section navigation ---------- */}
                            <div className="row">
                                <div className="col-6">
                                    {this.state.currentSectionIndex !== 0 ? (
                                        <button
                                            className="btn btn-primary btn-sm shadow-none"
                                            onClick={this.handlePrev}
                                        >
                                            <i className="fas fa-angle-left mr-2"></i>
                                            Prev
                                        </button>
                                    ) : (
                                        ""
                                    )}
                                </div>
                                <div className="col-6 text-right">
                                    {this.state.currentSectionIndex + 1 <
                                    this.state.totalSection ? (
                                        <button
                                            className="btn btn-primary btn-sm shadow-none"
                                            onClick={this.handleNext}
                                        >
                                            Next
                                            <i className="fas fa-angle-right ml-2"></i>
                                        </button>
                                    ) : (
                                        ""
                                    )}
                                </div>
                            </div>
                        </ErrorBoundary>
                    </div>
                </div>
            </>
        );
    }
}

export default connect(mapStateToProps)(SimulationTestPreview);
