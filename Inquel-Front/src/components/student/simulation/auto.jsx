import React, { Component } from "react";
import { baseUrl, studentUrl } from "../../../shared/baseUrl.js";
import AlertBox from "../../common/alert";
import Loading from "../../common/loader";
import Lightbox from "react-awesome-lightbox";
import "react-awesome-lightbox/build/style.css";
import { batch, connect } from "react-redux";
import { QuestionDataFormat } from "../../common/function/dataFormating";
import storeDispatch from "../../../redux/dispatch";
import { EXAMDATA, EXAM_STATE } from "../../../redux/action";
import { ErrorBoundary } from "react-error-boundary";
import ErrorFallback from "../../common/ErrorFallback";
import { Navbar } from "react-bootstrap";
import ConfirmationModal from "../shared/ExamConfirmationModal.jsx";

const mapStateToProps = (state) => ({
    course_name: state.content.course_name,
    simulation_name: state.content.simulation_name,
    paper_name: state.content.paper_name,
    examData: state.storage.examData,
});

class SimulationAutoExam extends Component {
    constructor(props) {
        super(props);
        this.state = {
            simulationExam: [],
            questionSection: [],
            answerSection: [],
            examInfo: [],
            currentSectionIndex: 0,
            totalSubQuestion: [],
            currentSubQuestionIndex: [],

            selectedImageData: [],
            startIndex: 0,
            isLightBoxOpen: false,

            showConfirmationModal: false,

            errorMsg: "",
            successMsg: "",
            showErrorAlert: false,
            showSuccessAlert: false,
            page_loading: true,

            time: {},
            seconds: 0,
        };
        this.timer = 0;
        this.startTimer = this.startTimer.bind(this);
        this.countDown = this.countDown.bind(this);

        this.subscriptionId = this.props.match.params.subscriptionId;
        this.courseId = this.props.match.params.courseId;
        this.subjectId = this.props.match.params.subjectId;
        this.simulationId = this.props.match.params.simulationId;
        this.paperId = this.props.match.params.paperId;
        this.url = baseUrl + studentUrl;
        this.authToken = localStorage.getItem("Authorization");
        this.headers = {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: this.authToken,
        };
    }

    // ---------- Loading the data ----------

    // loads sections and question data
    loadSimulationExamData = async () => {
        await fetch(
            `${this.url}/student/sub/${this.subscriptionId}/course/${this.courseId}/simulation/${this.simulationId}/paper/${this.paperId}/exam/`,
            {
                method: "GET",
                headers: this.headers,
            }
        )
            .then((res) => res.json())
            .then((result) => {
                let sections = [],
                    totalSubQuestion = [],
                    currentSubQuestionIndex = [];

                if (result.sts === true) {
                    let response = result.data;
                    let total_questions = 0;
                    if (response && Object.keys(response).length !== 0) {
                        // section looping
                        response.sections.forEach((data) => {
                            // section wise temp variables
                            let section_temp = [],
                                section_total_temp = [],
                                section_current_temp = [];

                            total_questions += data.total_questions;

                            // Question data formatting
                            let questions = QuestionDataFormat(
                                data.question_type === "type_1"
                                    ? data.type_one
                                    : data.type_two
                            );

                            // pairing question
                            for (let i = 0; i < questions.result.length; i++) {
                                let temp = [],
                                    totalTemp = [],
                                    currentTemp = [];

                                temp.push(questions.result[i]);
                                currentTemp.push(0);
                                questions.result[i].type === "type_1"
                                    ? totalTemp.push(0)
                                    : totalTemp.push(
                                          questions.result[i].sub_question
                                              .length
                                      );

                                // inner loop
                                for (
                                    let j = 0;
                                    j < questions.result.length;
                                    j++
                                ) {
                                    if (
                                        questions.result[i]
                                            .question_random_id ===
                                        questions.result[j].pair_question_id
                                    ) {
                                        temp.push(questions.result[j]);
                                        currentTemp.push(0);
                                        questions.result[i].type === "type_1"
                                            ? totalTemp.push(0)
                                            : totalTemp.push(
                                                  questions.result[j]
                                                      .sub_question.length
                                              );
                                        questions.result.splice(j, 1);
                                    }
                                }
                                section_temp.push(temp);
                                section_current_temp.push(currentTemp);
                                section_total_temp.push(totalTemp);
                            }

                            sections.push(section_temp);
                            totalSubQuestion.push(section_total_temp);
                            currentSubQuestionIndex.push(section_current_temp);

                            result.data["total_questions"] = total_questions;
                        });
                    }

                    this.setState(
                        {
                            simulationExam: result.data,
                            questionSection: sections,
                            totalSubQuestion: totalSubQuestion,
                            currentSubQuestionIndex: currentSubQuestionIndex,
                        },
                        () => {
                            this.loopAnswerSection();
                        }
                    );
                } else {
                    this.setState({
                        errorMsg: result.msg,
                        showErrorAlert: true,
                        page_loading: false,
                    });
                    storeDispatch(EXAM_STATE, {
                        examStarted: false,
                        id: "",
                        type: "",
                    });
                }
            })
            .catch((err) => {
                console.log(err);
                this.setState({
                    errorMsg:
                        "There is a problem in loading the question data!",
                    showErrorAlert: true,
                    page_loading: false,
                });
            });
        window.MathJax.typeset();
    };

    // creates section structure for exam submission
    loopAnswerSection = () => {
        const sections = this.state.simulationExam.sections || [];
        let temp = [...this.state.answerSection];
        let questions = [];

        function sectionStructure() {
            if (sections.length !== 0) {
                sections.forEach((data) => {
                    questions = [];

                    data[
                        data.question_type === "type_1"
                            ? "type_one"
                            : "type_two"
                    ].forEach((question) => {
                        if (question.sub_question === undefined) {
                            questions.push({
                                question_random_id: question.question_random_id,
                                pair_question_id: question.pair_question_id,
                                answer: [],
                            });
                        } else if (question.sub_question !== undefined) {
                            let sub_question = [];

                            question.sub_question.forEach((sub_data) => {
                                sub_question.push({
                                    sub_question_id: sub_data.sub_question_id,
                                    answer: [],
                                });
                            });

                            questions.push({
                                question_random_id: question.question_random_id,
                                pair_question_id: question.pair_question_id,
                                sub_question: sub_question,
                            });
                        }
                    });

                    temp.push({
                        section_id: data.section_id,
                        questions: questions,
                    });
                });
            }
        }

        // check if the exam data is present in redux
        if (
            this.props.examData &&
            Object.keys(this.props.examData).length !== 0
        ) {
            let exam_data = JSON.parse(this.props.examData);
            // check if the current exam data belongs to this exam
            if (exam_data.id !== this.simulationId) {
                storeDispatch(EXAMDATA, {});
                sectionStructure();
            } else {
                // else retrieve the data from redux
                temp = exam_data.sections;
            }
            // else structure the section data
        } else {
            sectionStructure();
        }

        this.setState({
            answerSection: temp,
        });
    };

    // loads exam start and end time info
    loadExamInfo = () => {
        fetch(
            `${this.url}/student/sub/${this.subscriptionId}/course/${this.courseId}/simulation/${this.simulationId}/paper/${this.paperId}/start/`,
            {
                method: "GET",
                headers: this.headers,
            }
        )
            .then((res) => res.json())
            .then((result) => {
                if (result.sts === true) {
                    let seconds = result.data.minutes * 60;
                    this.setState({
                        examInfo: result.data,
                        seconds: seconds + result.data.seconds,
                        page_loading: false,
                    });
                    this.startTimer();
                } else {
                    this.setState({
                        errorMsg: result.msg,
                        showErrorAlert: true,
                        page_loading: false,
                    });
                    storeDispatch(EXAM_STATE, {
                        examStarted: false,
                        id: "",
                        type: "",
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

    // loads subject info
    componentDidMount = () => {
        document.title = `${this.props.simulation_name} : Auto - Student | IQLabs`;

        let timeLeftVar = this.secondsToTime(this.state.seconds);
        this.setState({ time: timeLeftVar });

        this.loadSimulationExamData();
        this.loadExamInfo();
    };

    componentWillUnmount = () => {
        clearInterval(this.timer);
    };
    // ---------- Submitting the data ----------

    handleSubmit = () => {
        this.setState({
            page_loading: true,
            showConfirmationModal: false,
        });
        clearInterval(this.timer);

        fetch(
            `${this.url}/student/sub/${this.subscriptionId}/course/${this.courseId}/simulation/${this.simulationId}/paper/${this.paperId}/exam/`,
            {
                method: "POST",
                headers: this.headers,
                body: JSON.stringify({
                    sections: this.state.answerSection,
                }),
            }
        )
            .then((res) => res.json())
            .then((result) => {
                if (result.sts === true) {
                    this.setState(
                        {
                            successMsg: result.msg,
                            showSuccessAlert: true,
                        },
                        () => {
                            setTimeout(() => {
                                this.setState({
                                    page_loading: false,
                                });
                                batch(() => {
                                    storeDispatch(EXAMDATA, {});
                                    storeDispatch(EXAM_STATE, {
                                        examStarted: false,
                                        id: "",
                                        type: "",
                                    });
                                });
                                this.props.history.goBack();
                            }, 1000);
                        }
                    );
                } else {
                    this.setState({
                        errorMsg: result.msg,
                        showErrorAlert: true,
                        page_loading: false,
                    });
                    storeDispatch(EXAM_STATE, {
                        examStarted: false,
                        id: "",
                        type: "",
                    });
                }
            })
            .catch((err) => {
                console.log(err);
                this.setState({
                    errorMsg: "Cannot submit test at the moment!",
                    showErrorAlert: true,
                    page_loading: false,
                });
                storeDispatch(EXAM_STATE, {
                    examStarted: false,
                    id: "",
                    type: "",
                });
            });
    };

    // ---------- Navigation ----------

    handleNext = async () => {
        await this.setState({
            currentSectionIndex: this.state.currentSectionIndex + 1,
        });
        window.scrollTo(0, 0);
        window.MathJax.typeset();
    };

    handlePrev = async () => {
        await this.setState({
            currentSectionIndex: this.state.currentSectionIndex - 1,
        });
        window.scrollTo(0, 0);
        window.MathJax.typeset();
    };

    handleSubQPrev = async (pair_index, question_index) => {
        let index = this.state.currentSubQuestionIndex;

        index[this.state.currentSectionIndex][pair_index][question_index] =
            index[this.state.currentSectionIndex][pair_index][question_index] -
            1;

        await this.setState({
            currentSubQuestionIndex: index,
        });
        window.MathJax.typeset();
    };

    handleSubQNext = async (pair_index, question_index) => {
        let index = this.state.currentSubQuestionIndex;

        index[this.state.currentSectionIndex][pair_index][question_index] =
            index[this.state.currentSectionIndex][pair_index][question_index] +
            1;

        await this.setState({
            currentSubQuestionIndex: index,
        });
        window.MathJax.typeset();
    };

    // ---------- handle option selection ----------

    handleRemovingPairedQuestionAnswer = (pair_id) => {
        let sections = [...this.state.answerSection];
        let simulation_data =
            this.state.simulationExam.sections[this.state.currentSectionIndex];

        if (simulation_data.question_type === "type_1") {
            for (
                let i = 0;
                i < sections[this.state.currentSectionIndex].questions.length;
                i++
            ) {
                if (
                    pair_id ===
                    sections[this.state.currentSectionIndex].questions[i]
                        .question_random_id
                ) {
                    sections[this.state.currentSectionIndex].questions[
                        i
                    ].answer = [];
                }
            }
        } else if (simulation_data.question_type === "type_2") {
            for (
                let i = 0;
                i < sections[this.state.currentSectionIndex].questions.length;
                i++
            ) {
                if (
                    pair_id ===
                    sections[this.state.currentSectionIndex].questions[i]
                        .question_random_id
                ) {
                    for (
                        let j = 0;
                        j <
                        sections[this.state.currentSectionIndex].questions[i]
                            .sub_question.length;
                        j++
                    ) {
                        sections[this.state.currentSectionIndex].questions[
                            i
                        ].sub_question[j].answer = [];
                    }
                }
            }
        }

        this.setState({
            answerSection: sections,
        });
        storeDispatch(
            EXAMDATA,
            JSON.stringify({ id: this.simulationId, sections })
        );
    };

    handleMCQ = (event, question_id, pair_id, type) => {
        let sections = [...this.state.answerSection];
        if (type === "checkbox") {
            sections[this.state.currentSectionIndex].questions.forEach(
                (question) => {
                    if (question.question_random_id === question_id) {
                        if (question.answer.includes(event)) {
                            question.answer.splice(
                                question.answer.indexOf(event),
                                1
                            );

                            this.setState(
                                {
                                    answerSection: sections,
                                },
                                () => {
                                    if (pair_id !== "NOPAIR") {
                                        this.handleRemovingPairedQuestionAnswer(
                                            pair_id
                                        );
                                    }
                                }
                            );
                            storeDispatch(
                                EXAMDATA,
                                JSON.stringify({
                                    id: this.simulationId,
                                    sections,
                                })
                            );
                        } else {
                            question.answer.push(event);

                            this.setState(
                                {
                                    answerSection: sections,
                                },
                                () => {
                                    if (pair_id !== "NOPAIR") {
                                        this.handleRemovingPairedQuestionAnswer(
                                            pair_id
                                        );
                                    }
                                }
                            );
                            storeDispatch(
                                EXAMDATA,
                                JSON.stringify({
                                    id: this.simulationId,
                                    sections,
                                })
                            );
                        }
                    }
                }
            );
        } else if (type === "radio") {
            sections[this.state.currentSectionIndex].questions.forEach(
                (question) => {
                    if (question.question_random_id === question_id) {
                        question.answer[0] = event;
                    }
                }
            );

            this.setState(
                {
                    answerSection: sections,
                },
                () => {
                    if (pair_id !== "NOPAIR") {
                        this.handleRemovingPairedQuestionAnswer(pair_id);
                    }
                }
            );
            storeDispatch(
                EXAMDATA,
                JSON.stringify({ id: this.simulationId, sections })
            );
        }
    };

    handleFillin = (event, question_id, pair_id) => {
        let sections = [...this.state.answerSection];
        if (event.target.value !== "") {
            sections[this.state.currentSectionIndex].questions.forEach(
                (question) => {
                    if (question.question_random_id === question_id) {
                        question.answer[0] = event.target.value;
                    }
                }
            );

            this.setState(
                {
                    answerSection: sections,
                },
                () => {
                    if (pair_id !== "NOPAIR") {
                        this.handleRemovingPairedQuestionAnswer(pair_id);
                    }
                }
            );
            storeDispatch(
                EXAMDATA,
                JSON.stringify({ id: this.simulationId, sections })
            );
        } else {
            sections[this.state.currentSectionIndex].questions.forEach(
                (question) => {
                    if (question.question_random_id === question_id) {
                        question.answer = [];
                    }
                }
            );

            this.setState(
                {
                    answerSection: sections,
                },
                () => {
                    if (pair_id !== "NOPAIR") {
                        this.handleRemovingPairedQuestionAnswer(pair_id);
                    }
                }
            );
            storeDispatch(
                EXAMDATA,
                JSON.stringify({ id: this.simulationId, sections })
            );
        }
    };

    handleBoolean = (event, question_id, pair_id) => {
        let sections = [...this.state.answerSection];
        sections[this.state.currentSectionIndex].questions.forEach(
            (question) => {
                if (question.question_random_id === question_id) {
                    question.answer[0] = event;
                }
            }
        );

        this.setState(
            {
                answerSection: sections,
            },
            () => {
                if (pair_id !== "NOPAIR") {
                    this.handleRemovingPairedQuestionAnswer(pair_id);
                }
            }
        );
        storeDispatch(
            EXAMDATA,
            JSON.stringify({ id: this.simulationId, sections })
        );
    };

    handleEventChange = (event, question_id, pair_id) => {
        let sections = [...this.state.answerSection];
        sections[this.state.currentSectionIndex].questions.forEach(
            (question) => {
                if (question.question_random_id === question_id) {
                    if (event.target.checked) {
                        question.answer.splice(
                            question.answer.indexOf(event),
                            1
                        );

                        this.setState(
                            {
                                answerSection: sections,
                            },
                            () => {
                                if (pair_id !== "NOPAIR") {
                                    this.handleRemovingPairedQuestionAnswer(
                                        pair_id
                                    );
                                }
                            }
                        );
                        storeDispatch(
                            EXAMDATA,
                            JSON.stringify({ id: this.simulationId, sections })
                        );
                    } else {
                        question.answer.push(event.target.value);

                        this.setState(
                            {
                                answerSection: sections,
                            },
                            () => {
                                if (pair_id !== "NOPAIR") {
                                    this.handleRemovingPairedQuestionAnswer(
                                        pair_id
                                    );
                                }
                            }
                        );
                        storeDispatch(
                            EXAMDATA,
                            JSON.stringify({ id: this.simulationId, sections })
                        );
                    }
                }
            }
        );
    };

    // ---------- Drag and drop ----------

    handleDragStart = (event, data, pair_id, question_id, sub_question_id) => {
        event.dataTransfer.setData("data", data);
        event.dataTransfer.setData("pair_id", pair_id);
        event.dataTransfer.setData("question_id", question_id);
        event.dataTransfer.setData("sub_question_id", sub_question_id);

        var node = document.getElementById(event.target.id);
        if (node !== null) {
            var crt = node.cloneNode(true);
            crt.id = event.target.id + "-copy";
            crt.classList.remove("light-bg");
            crt.classList.add("ghost-card");
            document.getElementById("root").appendChild(crt);
            event.dataTransfer.setDragImage(crt, 0, 0);
        }
    };

    handleDragEnd = (event) => {
        var id = event.target.id + "-copy";
        var node = document.getElementById(id);
        if (node !== null) {
            node.parentNode.removeChild(node);
        }
    };

    handleDrop = async (event) => {
        let sections = [...this.state.answerSection];

        event.target.classList.toggle("over");

        let data = event.dataTransfer.getData("data") || null;
        let pair_id = event.dataTransfer.getData("pair_id") || null;
        let question_id = event.dataTransfer.getData("question_id") || null;
        let sub_question_id =
            event.dataTransfer.getData("sub_question_id") || null;

        if (data !== null && question_id !== null && sub_question_id !== null) {
            sections[this.state.currentSectionIndex].questions.forEach(
                (question) => {
                    if (question.question_random_id === question_id) {
                        question.sub_question.forEach((sub_question) => {
                            if (
                                sub_question.sub_question_id === sub_question_id
                            ) {
                                sub_question.answer[0] = data;
                            }
                        });
                    }
                }
            );
        }

        await this.setState(
            {
                answerSection: sections,
            },
            () => {
                if (pair_id !== "NOPAIR") {
                    this.handleRemovingPairedQuestionAnswer(pair_id);
                }
            }
        );
        window.MathJax.typeset();
        storeDispatch(
            EXAMDATA,
            JSON.stringify({ id: this.simulationId, sections })
        );
    };

    handleDragEnter = (event) => {
        event.target.classList.toggle("over");
    };

    handleDragLeave = (event) => {
        event.target.classList.toggle("over");
    };

    handleDropFillin = (event, pair_id, question_id, sub_question_id) => {
        let sections = [...this.state.answerSection];
        if (event.target.value !== "") {
            sections[this.state.currentSectionIndex].questions.forEach(
                (question) => {
                    if (question.question_random_id === question_id) {
                        question.sub_question.forEach((sub_question) => {
                            if (
                                sub_question.sub_question_id === sub_question_id
                            ) {
                                sub_question.answer[0] = event.target.value;
                            }
                        });
                    }
                }
            );

            this.setState(
                {
                    answerSection: sections,
                },
                () => {
                    if (pair_id !== "NOPAIR") {
                        this.handleRemovingPairedQuestionAnswer(pair_id);
                    }
                }
            );
            storeDispatch(
                EXAMDATA,
                JSON.stringify({ id: this.simulationId, sections })
            );
        } else {
            sections[this.state.currentSectionIndex].questions.forEach(
                (question) => {
                    if (question.question_random_id === question_id) {
                        question.sub_question.forEach((sub_question) => {
                            if (
                                sub_question.sub_question_id === sub_question_id
                            ) {
                                sub_question.answer = [];
                            }
                        });
                    }
                }
            );

            this.setState(
                {
                    answerSection: sections,
                },
                () => {
                    if (pair_id !== "NOPAIR") {
                        this.handleRemovingPairedQuestionAnswer(pair_id);
                    }
                }
            );
            storeDispatch(
                EXAMDATA,
                JSON.stringify({ id: this.simulationId, sections })
            );
        }
    };

    // ---------- Countdown Timer ----------

    secondsToTime(secs) {
        let hours = Math.floor(secs / (60 * 60));

        let divisor_for_minutes = secs % (60 * 60);
        let minutes = Math.floor(divisor_for_minutes / 60);

        let divisor_for_seconds = divisor_for_minutes % 60;
        let seconds = Math.ceil(divisor_for_seconds);

        let obj = {
            h: hours,
            m: minutes,
            s: seconds,
        };
        return obj;
    }

    startTimer() {
        if (this.timer === 0 && this.state.seconds > 0) {
            this.timer = setInterval(this.countDown, 1000);
        }
    }

    countDown() {
        // Remove one second, set state so a re-render happens.
        let seconds = this.state.seconds - 1;
        this.setState({
            time: this.secondsToTime(seconds),
            seconds: seconds,
        });
        localStorage.setItem("examDuration", seconds);

        // Check if we're at zero.
        if (seconds === 0) {
            clearInterval(this.timer);
            this.handleSubmit();
        }
    }

    // ---------- Image viewer ----------

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

    // ---------- Question rendering ----------

    typeOneRender = (pair, index, data, q_index, answerSection) => {
        function returnQuestionIndex() {
            if (answerSection && answerSection.length !== 0) {
                for (let i = 0; i < answerSection.length; i++) {
                    if (
                        answerSection[i].question_random_id ===
                        data.question_random_id
                    ) {
                        return i;
                    }
                }
            }
        }

        return (
            <div
                className={`d-flex align-items-start user-select-none ${
                    pair.length === 2 ? (q_index === 0 ? "mb-3" : "") : ""
                }`}
                key={q_index}
            >
                <button
                    className="btn btn-light btn-sm shadow-sm mr-1 px-3 font-weight-bold-600 rounded-lg"
                    style={{ cursor: "default" }}
                >
                    {pair.length === 2
                        ? q_index === 0
                            ? `${index + 1}A`
                            : `${index + 1}B`
                        : index + 1}
                </button>
                <div className="card bg-light shadow-sm w-100">
                    <div className="card-body">
                        <div className="d-flex">
                            {/* Questions & options */}
                            <div className="w-100">
                                <div
                                    className="mb-3"
                                    dangerouslySetInnerHTML={{
                                        __html: data.question,
                                    }}
                                ></div>

                                {/* ----- MCQ ----- */}
                                {data.content.mcq === true ? (
                                    (data.content.options || []).map(
                                        (option, option_index) => {
                                            return (
                                                <div
                                                    className="form-group"
                                                    key={option_index}
                                                >
                                                    <div
                                                        className="card card-body shadow-sm small font-weight-bold-600 p-3"
                                                        onClick={() =>
                                                            this.handleMCQ(
                                                                option.content,
                                                                data.question_random_id,
                                                                data.pair_question_id,
                                                                data.content
                                                                    .mcq_answers >
                                                                    1
                                                                    ? "checkbox"
                                                                    : "radio"
                                                            )
                                                        }
                                                    >
                                                        {data.content
                                                            .mcq_answers !==
                                                        undefined ? (
                                                            data.content
                                                                .mcq_answers >
                                                            1 ? (
                                                                <div className="custom-control custom-checkbox">
                                                                    <input
                                                                        type="checkbox"
                                                                        className="custom-control-input"
                                                                        id={`customCheck${index}${q_index}${option_index}`}
                                                                        value={
                                                                            option.content
                                                                        }
                                                                        checked={
                                                                            answerSection &&
                                                                            answerSection.length !==
                                                                                0
                                                                                ? answerSection[
                                                                                      returnQuestionIndex()
                                                                                  ]
                                                                                      .answer
                                                                                    ? answerSection[
                                                                                          returnQuestionIndex()
                                                                                      ].answer.includes(
                                                                                          option.content
                                                                                      )
                                                                                        ? true
                                                                                        : false
                                                                                    : false
                                                                                : false
                                                                        }
                                                                        onChange={(
                                                                            e
                                                                        ) => {
                                                                            this.handleEventChange(
                                                                                e,
                                                                                data.question_random_id,
                                                                                data.pair_question_id
                                                                            );
                                                                        }}
                                                                    />
                                                                    <label
                                                                        className="custom-control-label"
                                                                        htmlFor={`customCheck${index}${q_index}${option_index}`}
                                                                        dangerouslySetInnerHTML={{
                                                                            __html: `<div class="remove-bottom-margin">${option.content}</div>`,
                                                                        }}
                                                                    ></label>
                                                                </div>
                                                            ) : (
                                                                <div className="custom-control custom-radio">
                                                                    <input
                                                                        type="radio"
                                                                        className="custom-control-input"
                                                                        id={`customRadio${index}${q_index}${option_index}`}
                                                                        value={
                                                                            option.content
                                                                        }
                                                                        checked={
                                                                            answerSection &&
                                                                            answerSection.length !==
                                                                                0
                                                                                ? answerSection[
                                                                                      returnQuestionIndex()
                                                                                  ]
                                                                                      .answer
                                                                                    ? answerSection[
                                                                                          returnQuestionIndex()
                                                                                      ].answer.includes(
                                                                                          option.content
                                                                                      )
                                                                                        ? true
                                                                                        : false
                                                                                    : false
                                                                                : false
                                                                        }
                                                                        onChange={(
                                                                            e
                                                                        ) => {}}
                                                                    />
                                                                    <label
                                                                        className="custom-control-label"
                                                                        htmlFor={`customRadio${index}${q_index}${option_index}`}
                                                                        dangerouslySetInnerHTML={{
                                                                            __html: `<div class="remove-bottom-margin">${option.content}</div>`,
                                                                        }}
                                                                    ></label>
                                                                </div>
                                                            )
                                                        ) : (
                                                            ""
                                                        )}
                                                    </div>
                                                </div>
                                            );
                                        }
                                    )
                                ) : // ----- True or false -----
                                data.content.boolean === true ? (
                                    (data.content.boolean_question || []).map(
                                        (option, boolean_index) => {
                                            return (
                                                <div
                                                    className="form-group"
                                                    key={boolean_index}
                                                >
                                                    <div
                                                        className="card card-body shadow-sm small font-weight-bold-600 p-3"
                                                        onClick={() =>
                                                            this.handleBoolean(
                                                                option.content,
                                                                data.question_random_id,
                                                                data.pair_question_id
                                                            )
                                                        }
                                                    >
                                                        <div className="custom-control custom-radio">
                                                            <input
                                                                type="radio"
                                                                className="custom-control-input"
                                                                id={`customRadio${index}${q_index}${boolean_index}`}
                                                                value={
                                                                    option.content
                                                                }
                                                                checked={
                                                                    answerSection.length !==
                                                                    0
                                                                        ? answerSection[
                                                                              returnQuestionIndex()
                                                                          ]
                                                                              .answer
                                                                            ? answerSection[
                                                                                  returnQuestionIndex()
                                                                              ].answer.includes(
                                                                                  option.content
                                                                              )
                                                                                ? true
                                                                                : false
                                                                            : false
                                                                        : false
                                                                }
                                                                onChange={(
                                                                    e
                                                                ) => {}}
                                                            />
                                                            <label
                                                                className="custom-control-label"
                                                                htmlFor={`customRadio${index}${q_index}${boolean_index}`}
                                                            >
                                                                {option.content}
                                                            </label>
                                                        </div>
                                                    </div>
                                                </div>
                                            );
                                        }
                                    )
                                ) : // ----- Fill in answers -----
                                data.content.fill_in === true ? (
                                    <div className="row">
                                        <div
                                            className="col-md-6 mb-3"
                                            key={q_index}
                                        >
                                            <input
                                                type="text"
                                                name="fill_in"
                                                className="form-control borders"
                                                placeholder="Type your answer here"
                                                value={
                                                    answerSection.length !== 0
                                                        ? answerSection[
                                                              returnQuestionIndex()
                                                          ].answer.length !== 0
                                                            ? answerSection[
                                                                  returnQuestionIndex()
                                                              ].answer[0]
                                                            : ""
                                                        : ""
                                                }
                                                onChange={(event) =>
                                                    this.handleFillin(
                                                        event,
                                                        data.question_random_id,
                                                        data.pair_question_id
                                                    )
                                                }
                                                autoComplete="off"
                                            />
                                        </div>
                                    </div>
                                ) : null}

                                {/* ----- Multiple choice notes ----- */}
                                {data.content.mcq_answers !== undefined ? (
                                    data.content.mcq_answers > 1 ? (
                                        <div className="small">
                                            <b>Note:</b>{" "}
                                            {data.content.mcq_answers} answers
                                            are correct
                                        </div>
                                    ) : null
                                ) : null}
                            </div>

                            {/* <!----- Image viewer -----> */}
                            {data.content
                                ? data.content.images &&
                                  data.content.images.length !== 0
                                    ? this.imageRender(data)
                                    : ""
                                : ""}
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    typeTwoRender = (pair, index, data, q_index, answerSection) => {
        let isAnswerAvailable = [];
        answerSection.forEach((item1) => {
            let temp = false;
            item1.sub_question.forEach((item2) => {
                if (item2.answer.length !== 0) {
                    temp = true;
                }
            });
            isAnswerAvailable.push(temp);
        });

        let CURRENT_SUB_QUESTION_INDEX =
            this.state.currentSubQuestionIndex[this.state.currentSectionIndex][
                index
            ][q_index];

        function returnQuestionIndex() {
            if (answerSection && answerSection.length !== 0) {
                for (let i = 0; i < answerSection.length; i++) {
                    if (
                        answerSection[i].question_random_id ===
                        data.question_random_id
                    ) {
                        return i;
                    }
                }
            }
        }

        return (
            <div
                className={`d-flex align-items-start user-select-none ${
                    pair.length === 2 ? (q_index === 0 ? "mb-3" : "") : ""
                }`}
                key={q_index}
            >
                <button
                    className="btn btn-light btn-sm shadow-sm mr-1 px-3 font-weight-bold-600 rounded-lg"
                    style={{ cursor: "default" }}
                >
                    {pair.length === 2
                        ? q_index === 0
                            ? `${index + 1}A`
                            : `${index + 1}B`
                        : index + 1}
                </button>
                <div className="card bg-light shadow-sm w-100">
                    <div className="card-body">
                        <div className="d-flex">
                            <div className="w-100">
                                {/* ---------- Main Question ---------- */}
                                <div
                                    className="mb-4"
                                    dangerouslySetInnerHTML={{
                                        __html: data.question,
                                    }}
                                ></div>
                                <div className="row mb-3">
                                    {/* ---------- Drop area ---------- */}
                                    <div className="col-md-6">
                                        <div
                                            id="drop-area"
                                            className="position-relative p-3"
                                            onDragOver={(e) =>
                                                e.preventDefault()
                                            }
                                            onDrop={(e) => this.handleDrop(e)}
                                            onDragEnter={(e) =>
                                                this.handleDragEnter(e)
                                            }
                                            onDragLeave={(e) =>
                                                this.handleDragLeave(e)
                                            }
                                        >
                                            {isAnswerAvailable[
                                                returnQuestionIndex()
                                            ] === false ? (
                                                data.sub_question[
                                                    CURRENT_SUB_QUESTION_INDEX
                                                ].fill_in ? (
                                                    <div
                                                        id="drop-here"
                                                        className="user-select-none"
                                                        draggable={false}
                                                    >
                                                        Type your answer in the
                                                        answer section
                                                    </div>
                                                ) : (
                                                    <div
                                                        id="drop-here"
                                                        className="user-select-none"
                                                        draggable={false}
                                                    >
                                                        <i className="fas fa-arrows-alt mr-2"></i>{" "}
                                                        Drop answer here...
                                                    </div>
                                                )
                                            ) : (
                                                <>
                                                    {(
                                                        answerSection[
                                                            returnQuestionIndex()
                                                        ].sub_question || []
                                                    ).map(
                                                        (
                                                            sub_answer,
                                                            answer_index
                                                        ) => {
                                                            return sub_answer
                                                                .answer
                                                                .length !==
                                                                0 ? (
                                                                <div
                                                                    className="card shadow-sm mb-2 pinkrange-bg"
                                                                    key={
                                                                        answer_index
                                                                    }
                                                                >
                                                                    <div
                                                                        className="card-body small font-weight-bold-600 primary-text p-3"
                                                                        dangerouslySetInnerHTML={{
                                                                            __html: `<div class="d-flex"><span class="mr-1">${
                                                                                answer_index +
                                                                                1
                                                                            }.</span><div class="remove-bottom-margin">${
                                                                                sub_answer
                                                                                    .answer[0]
                                                                            }</div></div>`,
                                                                        }}
                                                                    ></div>
                                                                </div>
                                                            ) : (
                                                                ""
                                                            );
                                                        }
                                                    )}
                                                </>
                                            )}
                                        </div>
                                    </div>

                                    {/* ---------- Sub question ---------- */}
                                    <div className="col-md-6">
                                        <div className="d-flex align-items-start justify-content">
                                            <button className="btn secondary-bg btn-sm shadow-sm mr-1 mt-1 px-3 font-weight-bold-600 rounded-lg">
                                                {CURRENT_SUB_QUESTION_INDEX + 1}
                                            </button>

                                            <div className="card bg-transparent w-100">
                                                <div className="card secondary-bg py-2 px-3 mb-2">
                                                    <div
                                                        dangerouslySetInnerHTML={{
                                                            __html: data
                                                                .sub_question[
                                                                CURRENT_SUB_QUESTION_INDEX
                                                            ].question,
                                                        }}
                                                    ></div>
                                                </div>
                                                {/* Multiple choice question */}
                                                {data.sub_question[
                                                    CURRENT_SUB_QUESTION_INDEX
                                                ].mcq
                                                    ? (
                                                          data.sub_question[
                                                              CURRENT_SUB_QUESTION_INDEX
                                                          ].options || []
                                                      ).map(
                                                          (
                                                              options,
                                                              option_index
                                                          ) => {
                                                              return (
                                                                  <div
                                                                      className="card shadow-sm mb-2"
                                                                      key={
                                                                          option_index
                                                                      }
                                                                      id={`option-${index}-${q_index}-${CURRENT_SUB_QUESTION_INDEX}-${option_index}`}
                                                                      style={{
                                                                          cursor: "move",
                                                                      }}
                                                                      onDragStart={(
                                                                          e
                                                                      ) =>
                                                                          this.handleDragStart(
                                                                              e,
                                                                              options.content,
                                                                              data.pair_question_id,
                                                                              data.question_random_id,
                                                                              data
                                                                                  .sub_question[
                                                                                  CURRENT_SUB_QUESTION_INDEX
                                                                              ]
                                                                                  .sub_question_id
                                                                          )
                                                                      }
                                                                      onDragEnd={(
                                                                          e
                                                                      ) =>
                                                                          this.handleDragEnd(
                                                                              e
                                                                          )
                                                                      }
                                                                      draggable
                                                                  >
                                                                      <div
                                                                          className="card-body small font-weight-bold-600 primary-text p-3"
                                                                          dangerouslySetInnerHTML={{
                                                                              __html: `<div class="remove-bottom-margin">${options.content}</div>`,
                                                                          }}
                                                                      ></div>
                                                                  </div>
                                                              );
                                                          }
                                                      )
                                                    : ""}
                                                {/* Fill in the blanks */}
                                                {data.sub_question[
                                                    CURRENT_SUB_QUESTION_INDEX
                                                ].fill_in ? (
                                                    <input
                                                        type="text"
                                                        name="fill_in"
                                                        className="form-control borders"
                                                        placeholder="Type your answer here"
                                                        value={
                                                            answerSection[
                                                                returnQuestionIndex()
                                                            ].sub_question
                                                                .length !== 0
                                                                ? answerSection[
                                                                      returnQuestionIndex()
                                                                  ]
                                                                      .sub_question[
                                                                      CURRENT_SUB_QUESTION_INDEX
                                                                  ].answer[0] ||
                                                                  ""
                                                                : ""
                                                        }
                                                        onChange={(event) =>
                                                            this.handleDropFillin(
                                                                event,
                                                                data.pair_question_id,
                                                                data.question_random_id,
                                                                data
                                                                    .sub_question[
                                                                    CURRENT_SUB_QUESTION_INDEX
                                                                ]
                                                                    .sub_question_id
                                                            )
                                                        }
                                                        autoComplete="off"
                                                    />
                                                ) : (
                                                    ""
                                                )}
                                                <div className="d-flex align-items-center justify-content-center mt-3">
                                                    <button
                                                        className="btn btn-sm primary-text shadow-none"
                                                        onClick={() =>
                                                            this.handleSubQPrev(
                                                                index,
                                                                q_index
                                                            )
                                                        }
                                                        disabled={
                                                            CURRENT_SUB_QUESTION_INDEX ===
                                                            0
                                                                ? true
                                                                : false
                                                        }
                                                    >
                                                        <i className="fas fa-arrow-circle-left fa-lg"></i>
                                                    </button>
                                                    <div className="border-primary small font-weight-bold-600 rounded-lg px-3 py-1 mx-3">
                                                        {CURRENT_SUB_QUESTION_INDEX +
                                                            1}{" "}
                                                        /{" "}
                                                        {
                                                            this.state
                                                                .totalSubQuestion[
                                                                this.state
                                                                    .currentSectionIndex
                                                            ][index][q_index]
                                                        }
                                                    </div>
                                                    <button
                                                        className="btn btn-sm primary-text shadow-none"
                                                        onClick={() =>
                                                            this.handleSubQNext(
                                                                index,
                                                                q_index
                                                            )
                                                        }
                                                        disabled={
                                                            CURRENT_SUB_QUESTION_INDEX +
                                                                1 <
                                                            this.state
                                                                .totalSubQuestion[
                                                                this.state
                                                                    .currentSectionIndex
                                                            ][index][q_index]
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

                            {/* <!----- Image viewer -----> */}
                            {data.content
                                ? data.content.images &&
                                  data.content.images.length !== 0
                                    ? this.imageRender(data)
                                    : ""
                                : ""}
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    imageRender = (data) => {
        return (
            <div className="ml-3">
                {(data.content.images || []).map((images, index) => {
                    return images.path !== "" ? (
                        <div
                            key={index}
                            className="card preview-img-circle shadow-sm"
                            style={{
                                backgroundImage: `url(${images.path})`,
                            }}
                            onClick={() =>
                                this.changeImage(data.content.images, index)
                            }
                        ></div>
                    ) : (
                        ""
                    );
                })}
            </div>
        );
    };

    render() {
        const simulationExam =
            this.state.simulationExam.sections !== undefined
                ? this.state.simulationExam.sections[
                      this.state.currentSectionIndex
                  ]
                : [];

        const questionSection =
            this.state.questionSection[this.state.currentSectionIndex] || [];

        const answerSection =
            this.state.answerSection &&
            this.state.answerSection[this.state.currentSectionIndex] !==
                undefined
                ? this.state.answerSection[this.state.currentSectionIndex]
                      .questions !== undefined
                    ? this.state.answerSection[this.state.currentSectionIndex]
                          .questions
                    : []
                : [];

        return (
            <>
                {/* Navbar */}
                <Navbar
                    variant="light"
                    className="shadow-sm bg-white justify-content-center py-3"
                >
                    <div
                        className="row align-items-center"
                        style={{ width: "100%" }}
                    >
                        <div className="col-md-4 col-6 order-2 order-md-1 pl-0">
                            <p className="small font-weight-bold-600 primary-text text-truncate mb-0">
                                {this.props.simulation_name} -{" "}
                                {this.props.paper_name}
                            </p>
                        </div>
                        <div className="col-md-4 col-12 order-1 order-md-2">
                            <h5 className="text-center mb-0 primary-text font-weight-bold-600 text-truncate">
                                {this.props.course_name}
                            </h5>
                        </div>
                        <div className="col-md-4 col-6 order-3 order-md-3 text-right pr-0">
                            <button
                                className="btn btn-light bg-white border-0 shadow-none btn-sm"
                                onClick={() => {
                                    if (this.state.seconds === 0) {
                                        this.props.history.goBack();
                                    } else {
                                        this.setState({
                                            showConfirmationModal: true,
                                        });
                                    }
                                }}
                            >
                                <i className="fas fa-times"></i>
                            </button>
                        </div>
                    </div>
                </Navbar>

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

                {/* Confirmation modal */}
                <ConfirmationModal
                    show={this.state.showConfirmationModal}
                    onHide={() =>
                        this.setState({
                            showConfirmationModal: false,
                        })
                    }
                    submit={this.handleSubmit}
                    goBack={this.props.history.goBack}
                />

                <div className="exam-section">
                    <div className="container-fluid">
                        <ErrorBoundary
                            FallbackComponent={ErrorFallback}
                            onReset={() => window.location.reload()}
                        >
                            {/* Header */}
                            <div className="card card-body secondary-bg primary-text font-weight-bold-600 small mb-3 py-2">
                                <div className="row align-items-center">
                                    <div className="col-md-5 text-center text-md-left mb-2 mb-md-0">
                                        {simulationExam.length !== 0
                                            ? simulationExam.section_name
                                            : ""}
                                    </div>
                                    <div className="col-md-7">
                                        <div className="row align-items-center">
                                            <div className="col-md-4 col-4">
                                                Total questions:{" "}
                                                {
                                                    this.state.simulationExam
                                                        .total_questions
                                                }
                                            </div>
                                            <div className="col-md-4 col-4">
                                                Total marks:{" "}
                                                {
                                                    this.state.simulationExam
                                                        .total_marks
                                                }
                                            </div>
                                            <div className="col-md-4 col-6 mx-auto mt-2 mt-md-0">
                                                <div className="bg-warning text-center rounded py-2">
                                                    {this.state.time.h}:
                                                    {this.state.time.m}:
                                                    {this.state.time.s}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* any question section */}
                            <div className="d-flex justify-content-center mb-3">
                                <div className="pinkrange-bg px-3 py-2 rounded-lg small font-weight-bold-600">
                                    <i className="fas fa-info-circle mr-1"></i>{" "}
                                    {questionSection && simulationExam
                                        ? questionSection.length ===
                                          simulationExam.any_questions
                                            ? `Answer all the questions in this section`
                                            : `Answer any ${
                                                  simulationExam.any_questions <=
                                                  9
                                                      ? `0${simulationExam.any_questions}`
                                                      : `${simulationExam.any_questions}`
                                              } questions in this section`
                                        : ""}
                                </div>
                            </div>

                            {/* ---------- Q&A ---------- */}
                            {(questionSection || []).map((pair, pair_index) => {
                                return (
                                    <div
                                        className="card card-body light-bg shadow-sm mb-3"
                                        key={pair_index}
                                    >
                                        {(pair || []).map(
                                            (question, question_index) => {
                                                return question.type ===
                                                    "type_1" ? (
                                                    <React.Fragment
                                                        key={question_index}
                                                    >
                                                        {this.typeOneRender(
                                                            pair,
                                                            pair_index,
                                                            question,
                                                            question_index,
                                                            answerSection
                                                        )}
                                                        {pair.length > 1 ? (
                                                            question_index ===
                                                            0 ? (
                                                                <p className="text-center text-danger font-weight-bold h5 mb-3">
                                                                    ----- or
                                                                    -----
                                                                </p>
                                                            ) : (
                                                                ""
                                                            )
                                                        ) : (
                                                            ""
                                                        )}
                                                    </React.Fragment>
                                                ) : (
                                                    <React.Fragment
                                                        key={question_index}
                                                    >
                                                        {this.typeTwoRender(
                                                            pair,
                                                            pair_index,
                                                            question,
                                                            question_index,
                                                            answerSection
                                                        )}
                                                        {pair.length > 1 ? (
                                                            question_index ===
                                                            0 ? (
                                                                <p className="text-center text-danger font-weight-bold h5 mb-3">
                                                                    ----- or
                                                                    -----
                                                                </p>
                                                            ) : (
                                                                ""
                                                            )
                                                        ) : (
                                                            ""
                                                        )}
                                                    </React.Fragment>
                                                );
                                            }
                                        )}
                                    </div>
                                );
                            })}

                            {/* ----- Navigation ----- */}
                            <div className="row align-items-center">
                                <div className="col-md-3 col-6 order-1 order-md-1">
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
                                <div className="col-md-6 col-12 order-3 order-md-2 mt-2 mt-md-0">
                                    {this.state.currentSectionIndex ===
                                    this.state.questionSection.length - 1 ? (
                                        <button
                                            className="btn btn-primary btn-block shadow-none"
                                            onClick={this.handleSubmit}
                                        >
                                            Submit
                                        </button>
                                    ) : (
                                        ""
                                    )}
                                </div>
                                <div className="col-md-3 col-6 text-right order-2 order-md-3">
                                    {this.state.currentSectionIndex <
                                    this.state.questionSection.length - 1 ? (
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

                {/* Loading component */}
                {this.state.page_loading ? <Loading /> : ""}
            </>
        );
    }
}

export default connect(mapStateToProps)(SimulationAutoExam);
