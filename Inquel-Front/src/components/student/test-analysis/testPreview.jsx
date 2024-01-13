import React, { Component, useState, useEffect, lazy, Suspense } from "react";
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
import AlertBox from "../../common/alert";
import NumericConversion from "../../common/function/NumericConversion";
import TestReport from "./report-component";

const DirectPDF = lazy(() => import("../../common/preview/DirectPDF"));

const mapStateToProps = (state) => ({
    course_data: state.storage.response,
    subject_name: state.content.subject_name,
    temp: state.storage.temp,
    course_name: state.content.course_name,
    profile: state.user.profile,
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
            className="d-flex align-items-start user-select-none mb-3"
            key={props.q_index}
        >
            <button
                className="btn btn-light light-bg btn-sm border-0 shadow-sm mr-1 px-3 font-weight-bold-600 rounded-lg"
                style={{
                    cursor: "default",
                }}
            >
                {props.q_index <= 8
                    ? `0${props.q_index + 1}`
                    : props.q_index + 1}
            </button>
            <div className="card light-bg shadow-sm w-100">
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
                                                            : "bg-white"
                                                        : "bg-white"
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
            className="d-flex align-items-start user-select-none mb-3"
            key={props.q_index}
        >
            <button className="btn btn-light light-bg btn-sm border-0 shadow-sm mr-1 px-3 font-weight-bold-600 rounded-lg">
                {props.q_index <= 8
                    ? `0${props.q_index + 1}`
                    : props.q_index + 1}
            </button>
            {/* ---------- Question preview ---------- */}
            <div className="card card-body shadow-sm light-bg w-100">
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
                                    <div className="card light-bg w-100 d-flex flex-column h-100">
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
                                                                    : "bg-white"
                                                                : "bg-white"
                                                            : "bg-white"
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

const DirectQuestion = (props) => {
    const [marks, setMarks] = useState({});

    useEffect(() => {
        if (props.semesterId) {
            let topic_marks = props.temp.data.topic_marks;
            let obj = {};

            try {
                // consolidating topic_marks of each chapter into one
                Object.entries(topic_marks)
                    .sort()
                    .forEach(([chapter_key, chapter_value]) => {
                        let total_marks = 0,
                            obtained_marks = 0,
                            correct_marks = 0;
                        Object.values(chapter_value.topic_marks).forEach(
                            (topic) => {
                                if (topic.total_marks) {
                                    total_marks += parseFloat(
                                        topic.total_marks
                                    );
                                } else {
                                    total_marks = "";
                                }
                                if (topic.obtained_marks) {
                                    obtained_marks += parseFloat(
                                        topic.obtained_marks
                                    );
                                } else {
                                    obtained_marks = "";
                                }
                                if (topic.correct_marks) {
                                    correct_marks += parseFloat(
                                        topic.correct_marks
                                    );
                                } else {
                                    correct_marks = "";
                                }
                            }
                        );
                        obj[chapter_key] = {
                            total_marks,
                            obtained_marks,
                            correct_marks,
                        };
                    });
            } catch (error) {
                console.log(error);
            }

            setMarks(obj);
        } else {
            setMarks(props.temp.data.topic_marks);
        }
        // eslint-disable-next-line
    }, []);

    return (
        <>
            {/* ----- Header configuration ----- */}
            <div className="card card-body primary-bg text-white shadow-sm mb-3 py-3">
                <div className="row align-items-center">
                    <div className="col-md-2 font-weight-bold-600">
                        Exam Details
                    </div>
                    <div className="col-md-2 small">
                        <span className="font-weight-bold-600">Exam Date:</span>{" "}
                        {dateFormat(props.temp.data.exam_date, "dd/mm/yyyy")}
                    </div>
                    <div className="col-md-3 small">
                        <span className="font-weight-bold-600">
                            Submitted On:
                        </span>{" "}
                        {dateFormat(
                            props.temp.data.submission_time,
                            "dd/mm/yyyy hh:MM"
                        )}
                    </div>
                    <div className="col-md-2 small">
                        <span className="font-weight-bold-600">
                            Scored Marks:
                        </span>{" "}
                        {NumericConversion(props.temp.data.obtained_test_marks)}
                        /{NumericConversion(props.temp.data.total_test_marks)}
                    </div>
                    <div className="col-md-2 small">
                        <span className="font-weight-bold-600">
                            Percentage:
                        </span>{" "}
                        {NumericConversion(props.temp.data.total_percentage)}%
                    </div>
                    <div className="col-md-1 small font-weight-bold-600">
                        <div
                            className="text-center rounded py-2"
                            style={{
                                backgroundColor: props.temp.data.color,
                                textTransform: "capitalize",
                            }}
                        >
                            {props.temp.data.remarks}
                        </div>
                    </div>
                </div>
            </div>

            {/* ----- Remarks table ----- */}
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
                                    <th scope="col">
                                        {props.semesterId
                                            ? "Chapter"
                                            : "Topic number"}
                                    </th>
                                    <th scope="col">Total marks</th>
                                    <th scope="col">Obtained marks</th>
                                    <th scope="col">Correct marks</th>
                                </tr>
                            </thead>
                            <tbody>
                                {Object.entries(marks).map(
                                    ([key, value], index) => {
                                        return (
                                            <tr key={index}>
                                                <td>
                                                    {props.semesterId
                                                        ? props.returnChapterName(
                                                              key
                                                          )
                                                        : key}
                                                </td>
                                                <td>{value.total_marks}</td>
                                                <td>{value.obtained_marks}</td>
                                                <td>{value.correct_marks}</td>
                                            </tr>
                                        );
                                    }
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* ----- File displaying ----- */}
            <div className="card light-bg shadow-sm">
                <div className="card-body">
                    <div
                        className="card card-body secondary-bg text-center"
                        style={{ minHeight: "40vh" }}
                    >
                        <Suspense fallback={<div>Loading...</div>}>
                            <DirectPDF
                                file_url={props.temp.data.answer_file_url}
                            />
                        </Suspense>
                    </div>
                </div>
            </div>
        </>
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
                                <th scope="col">
                                    {props.semesterId
                                        ? "Chapter"
                                        : "Topic number"}
                                </th>
                                <th scope="col">Total marks</th>
                                <th scope="col">Secured marks</th>
                                <th scope="col">Percentage %</th>
                            </tr>
                        </thead>
                        <tbody>
                            {Object.entries(props.data).map(
                                ([key, value], index) => {
                                    return (
                                        <tr key={index}>
                                            <td>
                                                {props.semesterId
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

class TestPreview extends Component {
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
            chapter_topic_remarks: {},

            selectedImageData: [],
            imageIndex: 0,
            isLightBoxOpen: false,
            selectedVideoData: "",
            selectedAudio: [],

            responseMsg: "",
            showErrorAlert: false,
            showSuccessAlert: false,
        };
        this.subscriptionId = this.props.match.params.subscriptionId;
        this.courseId = this.props.match.params.courseId;
        this.subjectId = this.props.match.params.subjectId;

        this.cycleTestId = this.props.match.params.cycleTestId;
        this.semesterId = this.props.match.params.semesterId;
        this.url = baseUrl + studentUrl;
        this.authToken = localStorage.getItem("Authorization");
        this.headers = {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: this.authToken,
        };
    }

    componentDidMount = () => {
        document.title = `${
            this.props.temp.cycle_test_name || this.props.temp.semester_name
        } : Test preview - Student | IQLabs`;

        if (this.props.temp.auto === true) {
            this.loopAutoSection();
        }
    };

    loopAutoSection = async () => {
        let sections = [];
        let totalQuestion = 0;
        let section_marks = [];

        let chapter_topic_remarks = {};

        try {
            this.props.temp.data.forEach((data) => {
                if (
                    data.cycle_test_id === this.cycleTestId ||
                    data.semester_id === this.semesterId
                ) {
                    // section looping
                    data.sections.forEach((section) => {
                        let questions = [];
                        let temp_section_marks = 0;

                        // question looping
                        for (let i = 0; i < section.questions.length; i++) {
                            let images = [];
                            let audio = [];
                            let videoTitle = "";
                            let videoPath = "";

                            // count only for the non choice question
                            if (section.questions[i].choice === false) {
                                totalQuestion++;
                                temp_section_marks +=
                                    section.questions[i].marks;
                            }

                            // type one
                            if (
                                section.questions[i].sub_question === undefined
                            ) {
                                if (
                                    section.questions[i].files &&
                                    section.questions[i].files.length !== 0
                                ) {
                                    // image
                                    if (
                                        section.questions[i].files.type1_image_1
                                    ) {
                                        images.push({
                                            title: section.questions[i].files
                                                .type1_image_1_title,
                                            file_name: "",
                                            image: null,
                                            path: section.questions[i].files
                                                .type1_image_1,
                                        });
                                    }
                                    if (
                                        section.questions[i].files.type1_image_2
                                    ) {
                                        images.push({
                                            title: section.questions[i].files
                                                .type1_image_2_title,
                                            file_name: "",
                                            image: null,
                                            path: section.questions[i].files
                                                .type1_image_2,
                                        });
                                    }
                                    if (
                                        section.questions[i].files.type1_image_3
                                    ) {
                                        images.push({
                                            title: section.questions[i].files
                                                .type1_image_3_title,
                                            file_name: "",
                                            image: null,
                                            path: section.questions[i].files
                                                .type1_image_3,
                                        });
                                    }
                                    if (
                                        section.questions[i].files.type1_image_4
                                    ) {
                                        images.push({
                                            title: section.questions[i].files
                                                .type1_image_4_title,
                                            file_name: "",
                                            image: null,
                                            path: section.questions[i].files
                                                .type1_image_4,
                                        });
                                    }

                                    // audio
                                    if (
                                        section.questions[i].files.type1_audio_1
                                    ) {
                                        audio.push({
                                            title: section.questions[i].files
                                                .type1_audio_1_title,
                                            file_name: "",
                                            audio: null,
                                            path: section.questions[i].files
                                                .type1_audio_1,
                                        });
                                    }
                                    if (
                                        section.questions[i].files.type1_audio_2
                                    ) {
                                        audio.push({
                                            title: section.questions[i].files
                                                .type1_audio_2_title,
                                            file_name: "",
                                            audio: null,
                                            path: section.questions[i].files
                                                .type1_audio_2,
                                        });
                                    }

                                    // video
                                    if (
                                        section.questions[i].files
                                            .paste_video_url
                                    ) {
                                        videoPath =
                                            section.questions[i].files
                                                .paste_video_url;
                                    }
                                    if (
                                        section.questions[i].files.type1_video_1
                                    ) {
                                        videoPath =
                                            section.questions[i].files
                                                .type1_video_1;
                                    }
                                    if (
                                        section.questions[i].files
                                            .type1_video_1_title
                                    ) {
                                        videoTitle =
                                            section.questions[i].files
                                                .type1_video_1_title;
                                    }
                                }

                                questions.push({
                                    type: "type_1",
                                    question: section.questions[i].question,
                                    question_random_id:
                                        section.questions[i].question_random_id,
                                    explanation:
                                        section.questions[i].explanation || "",
                                    images: images.length !== 0 ? images : [],
                                    video: {
                                        title: videoTitle,
                                        file_name: "",
                                        video: null,
                                        path: videoPath,
                                        url: "",
                                    },
                                    audio: audio.length !== 0 ? audio : [],
                                    proper_answer:
                                        section.questions[i].proper_answer ||
                                        [],
                                    answer: section.questions[i].answer || [],
                                    marks: section.questions[i].marks,
                                    choice: section.questions[i].choice,
                                    unanswered: section.questions[i].unanswered,
                                });
                                // type two
                            } else if (
                                section.questions[i].sub_question !== undefined
                            ) {
                                let sub_question = [];

                                // Image
                                if (
                                    section.questions[i].files &&
                                    Object.entries(section.questions[i].files)
                                        .length !== 0
                                ) {
                                    if (
                                        section.questions[i].files.type2_image_1
                                    ) {
                                        images.push({
                                            title: section.questions[i].files
                                                .type2_image_1_title,
                                            file_name: "",
                                            image: null,
                                            path: section.questions[i].files
                                                .type2_image_1,
                                        });
                                    }
                                    if (
                                        section.questions[i].files.type2_image_2
                                    ) {
                                        images.push({
                                            title: section.questions[i].files
                                                .type2_image_2_title,
                                            file_name: "",
                                            image: null,
                                            path: section.questions[i].files
                                                .type2_image_2,
                                        });
                                    }
                                    if (
                                        section.questions[i].files.type2_image_3
                                    ) {
                                        images.push({
                                            title: section.questions[i].files
                                                .type2_image_3_title,
                                            file_name: "",
                                            image: null,
                                            path: section.questions[i].files
                                                .type2_image_3,
                                        });
                                    }
                                    if (
                                        section.questions[i].files.type2_image_4
                                    ) {
                                        images.push({
                                            title: section.questions[i].files
                                                .type2_image_4_title,
                                            file_name: "",
                                            image: null,
                                            path: section.questions[i].files
                                                .type2_image_4,
                                        });
                                    }

                                    // audio
                                    if (
                                        section.questions[i].files.type2_audio_1
                                    ) {
                                        audio.push({
                                            title: section.questions[i].files
                                                .type2_audio_1_title,
                                            file_name: "",
                                            audio: null,
                                            path: section.questions[i].files
                                                .type2_audio_1,
                                        });
                                    }
                                    if (
                                        section.questions[i].files.type2_audio_2
                                    ) {
                                        audio.push({
                                            title: section.questions[i].files
                                                .type2_audio_2_title,
                                            file_name: "",
                                            audio: null,
                                            path: section.questions[i].files
                                                .type2_audio_2,
                                        });
                                    }

                                    // video
                                    if (
                                        section.questions[i].files
                                            .paste_video_url
                                    ) {
                                        videoPath =
                                            section.questions[i].files
                                                .paste_video_url;
                                    }
                                    if (
                                        section.questions[i].files.type2_video_1
                                    ) {
                                        videoPath =
                                            section.questions[i].files
                                                .type2_video_1;
                                    }
                                    if (
                                        section.questions[i].files
                                            .type2_video_1_title
                                    ) {
                                        videoTitle =
                                            section.questions[i].files
                                                .type2_video_1_title;
                                    }
                                }

                                for (
                                    let j = 0;
                                    j <
                                    section.questions[i].sub_question.length;
                                    j++
                                ) {
                                    sub_question.push({
                                        question:
                                            section.questions[i].sub_question[j]
                                                .sub_question || "",
                                        sub_question_id:
                                            section.questions[i].sub_question[j]
                                                .sub_question_id || "",
                                        proper_answer:
                                            section.questions[i].sub_question[j]
                                                .proper_answer || [],
                                        answer:
                                            section.questions[i].sub_question[j]
                                                .answer || [],
                                        marks: section.questions[i]
                                            .sub_question[j].marks,
                                    });
                                }

                                questions.push({
                                    type: "type_2",
                                    question: section.questions[i].question,
                                    question_random_id:
                                        section.questions[i].question_random_id,
                                    explanation:
                                        section.questions[i].explanation || "",
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
                                    choice: section.questions[i].choice,
                                    unanswered: section.questions[i].unanswered,
                                });
                            }
                        }

                        // topic_remarks looping
                        if (this.cycleTestId) {
                            if (
                                section.topic_marks &&
                                Object.keys(section.topic_marks).length !== 0
                            ) {
                                Object.entries(section.topic_marks).forEach(
                                    ([key, value]) => {
                                        chapter_topic_remarks[key] = {
                                            any_questions: 0,
                                            correct_marks: 0,
                                            total_marks: 0,
                                        };
                                    }
                                );
                            }
                        }

                        sections.push(questions);
                        section_marks.push(temp_section_marks);
                    });

                    // if chapter_remarks is added, then it is a semester
                    if (this.semesterId) {
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
        } catch (error) {
            this.setState({
                responseMsg: "Cannot load question data at the moment!",
                showErrorAlert: true,
            });
        }

        await this.setState(
            {
                questions: sections,
                totalSection: sections.length,
                totalQuestion: totalQuestion,
                section_marks: section_marks,
                chapter_topic_remarks: chapter_topic_remarks,
            },
            () => {
                this.calculateRemarks();
            }
        );
        window.MathJax.typeset();
    };

    calculateRemarks = () => {
        let chapter_topic_remarks = this.state.chapter_topic_remarks;

        try {
            this.props.temp.data.forEach((data) => {
                // section looping
                if (this.cycleTestId) {
                    data.sections.forEach((section) => {
                        // chapter_topic_remarks looping
                        if (
                            section.topic_marks &&
                            Object.keys(section.topic_marks).length !== 0
                        ) {
                            Object.entries(section.topic_marks).forEach(
                                ([key, value]) => {
                                    chapter_topic_remarks[key].any_questions +=
                                        value.any_questions;
                                    chapter_topic_remarks[key].correct_marks +=
                                        value.correct_marks;
                                    chapter_topic_remarks[key].total_marks +=
                                        value.total_marks;
                                }
                            );
                        }
                    });
                }

                // chapter_marks looping
                if (this.semesterId) {
                    if (
                        data.chapter_remarks &&
                        Object.keys(data.chapter_remarks).length !== 0
                    ) {
                        Object.entries(data.chapter_remarks).forEach(
                            ([key, value]) => {
                                chapter_topic_remarks[key].correct_marks +=
                                    value.correct_marks;
                                chapter_topic_remarks[key].total_marks +=
                                    value.total_marks;
                            }
                        );
                    }
                }
            });

            this.setState(
                {
                    chapter_topic_remarks: chapter_topic_remarks,
                },
                () => {
                    // sorting object based on keys
                    if (this.cycleTestId) {
                        function sortObj(obj) {
                            return Object.keys(obj)
                                .sort()
                                .reduce(function (result, key) {
                                    result[key] = obj[key];
                                    return result;
                                }, {});
                        }
                        this.setState({
                            chapter_topic_remarks: sortObj(
                                chapter_topic_remarks
                            ),
                        });
                    }
                }
            );
        } catch (error) {
            this.setState({
                responseMsg: "Cannot load remarks data at the moment!",
                showErrorAlert: true,
            });
        }
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

        if (this.subjectId) {
            this.props.course_data.chapters.forEach((chapter) => {
                if (chapter.chapter_id === id) {
                    chapter_name = chapter.chapter_name;
                }
            });
        } else if (this.courseId) {
            this.props.course_data.units.forEach((unit) => {
                unit.chapters.forEach((chapter) => {
                    if (chapter.chapter_id === id) {
                        chapter_name = chapter.chapter_name;
                    }
                });
            });
        }

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
                    name={
                        this.courseId
                            ? this.props.course_name
                            : this.props.subject_name
                    }
                    chapter_name={
                        this.props.temp.cycle_test_name ||
                        this.props.temp.semester_name
                    }
                    goBack={this.props.history.goBack}
                />

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
                            {this.props.temp.direct === true ? (
                                // direct section
                                <DirectQuestion
                                    temp={this.props.temp}
                                    returnChapterName={this.returnChapterName}
                                    semesterId={this.semesterId}
                                />
                            ) : (
                                // auto section
                                <>
                                    {/* ----- Send report button ----- */}
                                    {this.subjectId && (
                                        <TestReport
                                            profile={this.props.profile}
                                            course_name={
                                                this.props.subject_name
                                            }
                                            exam_name={
                                                this.props.temp
                                                    .cycle_test_name ||
                                                this.props.temp.semester_name
                                            }
                                            temp={this.props.temp}
                                            questions={this.state.questions}
                                            totalQuestion={
                                                this.state.totalQuestion
                                            }
                                            section_marks={
                                                this.state.section_marks
                                            }
                                            semesterId={this.semesterId}
                                            chapter_topic_remarks={
                                                this.state.chapter_topic_remarks
                                            }
                                            returnChapterName={
                                                this.returnChapterName
                                            }
                                        />
                                    )}

                                    {/* ----- Header Info ----- */}
                                    <div className="card card-body primary-bg text-white shadow-sm py-3 mb-3">
                                        <div className="row align-items-center">
                                            <div className="col-md-2 small">
                                                Attempt{" "}
                                                {this.props.temp.attempt + 1}
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
                                                /
                                                {
                                                    this.props.temp.data[0]
                                                        .total_marks
                                                }
                                            </div>
                                            <div className="col-md-2 small">
                                                Percentage:{" "}
                                                {NumericConversion(
                                                    this.props.temp.data[0]
                                                        .student_percentage
                                                )}
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
                                                            this.props.temp
                                                                .data[0].color,
                                                        textTransform:
                                                            "capitalize",
                                                    }}
                                                >
                                                    {
                                                        this.props.temp.data[0]
                                                            .remarks
                                                    }
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
                                                            this.props.temp
                                                                .data[0]
                                                                .sections[
                                                                this.state
                                                                    .currentSectionIndex
                                                            ]
                                                                .section_description
                                                        }
                                                    </div>
                                                    <div className="col-6 text-right small font-weight-bold-600">
                                                        Scored marks:{" "}
                                                        {
                                                            this.state
                                                                .section_marks[
                                                                this.state
                                                                    .currentSectionIndex
                                                            ]
                                                        }
                                                        /
                                                        {
                                                            this.props.temp
                                                                .data[0]
                                                                .sections[
                                                                this.state
                                                                    .currentSectionIndex
                                                            ]
                                                                .section_total_marks
                                                        }
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* ----- Question and Answer ----- */}
                                    {(data || []).map((question, q_index) => {
                                        return question.type === "type_1" ? (
                                            // type one question
                                            <TypeOneQuestion
                                                key={q_index}
                                                q_index={q_index}
                                                question={question}
                                                toggleModal={this.toggleModal}
                                                imageRender={this.imageRender}
                                            />
                                        ) : (
                                            // type two questions
                                            <TypeTwoQuestion
                                                key={q_index}
                                                q_index={q_index}
                                                question={question}
                                                toggleModal={this.toggleModal}
                                                imageRender={this.imageRender}
                                            />
                                        );
                                    })}

                                    {/* ----- Chapter and Topic wise remarks table ----- */}
                                    {this.state.currentSectionIndex + 1 ===
                                    this.state.totalSection ? (
                                        this.state.chapter_topic_remarks &&
                                        Object.keys(
                                            this.state.chapter_topic_remarks
                                        ).length !== 0 ? (
                                            <RemarksTable
                                                data={
                                                    this.state
                                                        .chapter_topic_remarks
                                                }
                                                returnChapterName={
                                                    this.returnChapterName
                                                }
                                                semesterId={this.semesterId}
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
                                            {this.state.currentSectionIndex !==
                                            0 ? (
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
                                            {this.state.currentSectionIndex +
                                                1 <
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
                                </>
                            )}
                        </ErrorBoundary>
                    </div>
                </div>
            </>
        );
    }
}

export default connect(mapStateToProps)(TestPreview);
