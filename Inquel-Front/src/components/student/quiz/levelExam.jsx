import React, { Component } from "react";
import Header from "../shared/examNavbar";
import { baseUrl, studentUrl } from "../../../shared/baseUrl.js";
import AlertBox from "../../common/alert";
import Loading from "../../common/loader";
import Lightbox from "react-awesome-lightbox";
import "react-awesome-lightbox/build/style.css";
import { QuestionDataFormat } from "../../common/function/dataFormating";
import { Link } from "react-router-dom";
import { Modal } from "react-bootstrap";
import ReactHowler from "react-howler";
import aesjs from "aes-js";
import base64url from "base64url";
import { connect } from "react-redux";
import { ErrorBoundary } from "react-error-boundary";
import ErrorFallback from "../../common/ErrorFallback";
import { QUIZ_AUDIO } from "../../../shared/constant";
import NumericConversion from "../../common/function/NumericConversion";

const mapStateToProps = (state) => ({
    subject_name: state.content.subject_name,
    chapter_name: state.content.chapter_name,
    quiz_name: state.content.quiz_name,
    temp: state.storage.temp,
    course_name: state.content.course_name,
});

class QuizCountDown extends Component {
    constructor(props) {
        super(props);
        this.state = {
            second: 3,
        };
        this.timer = 0;
    }

    componentDidMount = () => {
        this.timer = setInterval(this.countDown, 1000);
    };

    componentWillUnmount = () => {
        clearInterval(this.timer);
    };

    countDown = () => {
        this.setState({
            second: this.state.second - 1,
        });

        if (this.state.second === -1) {
            clearInterval(this.timer);
            this.props.onHide();
        }
    };

    render() {
        return (
            <Modal
                show={this.props.show}
                onHide={this.props.onHide}
                size="sm"
                aria-labelledby="contained-modal-title-vcenter"
                backdrop="static"
                keyboard={false}
                centered
            >
                <Modal.Body className="text-center">
                    <h4 className="primary-text mt-3">Get Ready</h4>
                    <p className="font-weight-bold-600 mb-4">
                        Your quiz is going to start in
                    </p>
                    <p className="display-4 font-weight-bold-600 primary-text mb-2">
                        {this.state.second}
                    </p>
                    <p className="font-weight-bold-600 mb-3">Seconds</p>
                </Modal.Body>
            </Modal>
        );
    }
}

const SuccessDIV = (props) => {
    return (
        <div className="w-100 mt-auto">
            <div className="row justify-content-center">
                <div className="col-lg-3 col-md-5">
                    <div className="card card-body text-center border border-success success-bg p-1">
                        <p className="small font-weight-bold-600 align-items-center mb-0">
                            <i className="fas fa-check-circle mr-1"></i> Right
                            answer!
                        </p>
                        <p className="small mb-0">
                            {props.level.points_per_question} Points
                        </p>
                        <p className="small mb-0">
                            Bonus Points {NumericConversion(props.bonus_points)}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

const DangerDIV = (props) => {
    return (
        <div className="w-100 mt-auto">
            <div className="row justify-content-center">
                <div className="col-lg-3 col-md-5">
                    <div className="card card-body text-center border border-danger danger-bg p-1">
                        <p className="small font-weight-bold-600 align-items-center mb-0">
                            <i className="fas fa-times-circle mr-1"></i> Wrong
                            answer!
                        </p>
                        <p className="small mb-0">
                            {props.quiz.negative_points === true
                                ? `-${props.level.points_per_question} Points`
                                : `0 Points`}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

const ToastRender = (props) => {
    let bonus =
        props.level.bonus_points !== 0 &&
        props.level.required_time_for_bonus !== 0
            ? (props.seconds / props.level.required_time_for_bonus) *
              props.level.bonus_points
            : 0;

    if (props.data[props.index].content) {
        if (props.data[props.index].content.mcq === true) {
            if (props.data[props.index].content.mcq_answers) {
                if (props.data[props.index].content.mcq_answers > 1) {
                    if (props.answerSection.answer) {
                        if (props.answerSection.answer.length !== 0) {
                            if (
                                props.data[props.index].content.mcq_answers ===
                                props.answerSection.answer.length
                            ) {
                                if (props.answerSection.isCorrect === true) {
                                    return (
                                        <SuccessDIV
                                            quiz={props.quiz}
                                            level={props.level}
                                            bonus_points={bonus}
                                        />
                                    );
                                } else {
                                    return (
                                        <DangerDIV
                                            quiz={props.quiz}
                                            level={props.level}
                                        />
                                    );
                                }
                            }
                        } else {
                            return (
                                <DangerDIV
                                    quiz={props.quiz}
                                    level={props.level}
                                />
                            );
                        }
                    }
                } else {
                    if (props.answerSection.answer) {
                        if (props.answerSection.answer.length !== 0) {
                            if (props.answerSection.isCorrect === true) {
                                return (
                                    <SuccessDIV
                                        quiz={props.quiz}
                                        level={props.level}
                                        bonus_points={bonus}
                                    />
                                );
                            } else {
                                return (
                                    <DangerDIV
                                        quiz={props.quiz}
                                        level={props.level}
                                    />
                                );
                            }
                        } else {
                            return (
                                <DangerDIV
                                    quiz={props.quiz}
                                    level={props.level}
                                />
                            );
                        }
                    }
                }
            }
        } else {
            if (props.answerSection.answer) {
                if (props.answerSection.answer.length !== 0) {
                    if (props.answerSection.isCorrect === true) {
                        return (
                            <SuccessDIV
                                quiz={props.quiz}
                                level={props.level}
                                bonus_points={bonus}
                            />
                        );
                    } else {
                        return (
                            <DangerDIV quiz={props.quiz} level={props.level} />
                        );
                    }
                } else {
                    return <DangerDIV quiz={props.quiz} level={props.level} />;
                }
            }
        }
    }
};

class QuizLevelExam extends Component {
    constructor(props) {
        super(props);
        this.state = {
            quiz: {},
            level: {},
            question: [],
            answer: [],
            currentQuestion: 0,
            currentLevel: 0,

            bonus_points: 0,
            scored_points: 0,
            total_points: 0,
            correct_answer: 0,
            wrong_answer: 0,

            selectedImageData: [],
            startIndex: 0,
            isLightBoxOpen: false,

            time: { h: 0, m: 0, s: 0 },
            seconds: 0,

            errorMsg: "",
            successMsg: "",
            showErrorAlert: false,
            showSuccessAlert: false,
            page_loading: true,

            showCountdownModal: false,
            isAnswerSubmitted: false,
            showQuestionReview: false,
            showOptions: false,
            showToast: false,
            isPlaying: false,
            iv: "",
        };

        this.subscriptionId = this.props.match.params.subscriptionId;
        this.courseId = this.props.match.params.courseId;
        this.subjectId = this.props.match.params.subjectId;
        this.chapterId = this.props.match.params.chapterId;
        this.quizId = this.props.match.params.quizId;
        this.levelId = this.props.match.params.levelId;
        this.url = baseUrl + studentUrl;
        this.authToken = localStorage.getItem("Authorization");
        this.headers = {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: this.authToken,
        };
        this.timer = 0;
    }

    // creates section structure for exam submission
    loopAnswerSection = () => {
        const questions = this.state.question || [];
        let answerSection = [];

        questions.forEach((question) => {
            answerSection.push({
                question_random_id: question.question_random_id,
                answer: [],
                isCorrect: false,
            });
        });
        this.setState({
            answer: answerSection,
        });
    };

    loadQuizData = () => {
        let level = {};
        let currentLevel = 0;
        this.props.temp.levels.forEach((value, index) => {
            if (value.level_id === this.levelId) {
                level = value;
                currentLevel = index;
            }
        });
        this.setState(
            {
                quiz: this.props.temp,
                currentLevel: currentLevel,
                level: level,
            },
            () => {
                this.loadQuestionData();
            }
        );
    };

    // Handle data encryption
    handleEncrypt = (data) => {
        // INIT
        var key = process.env.REACT_APP_QUIZ_ENCRYPT_DECRYPT_KEY;
        var iv = this.state.iv;

        var keyBytes = aesjs.utils.utf8.toBytes(key);
        var ivBytes = aesjs.utils.utf8.toBytes(iv);

        function encrypt(msg) {
            var aesCbc = new aesjs.ModeOfOperation.cbc(keyBytes, ivBytes);
            var textBytes = aesjs.utils.utf8.toBytes(msg);
            var padded = aesjs.padding.pkcs7.pad(textBytes);
            var encryptedBytes = aesCbc.encrypt(padded);
            var encoded = base64url.encode(encryptedBytes, "utf8");
            return base64url.toBase64(encoded);
        }

        return encrypt(data);
    };

    // Handle data decryption
    handleDecrypt = (data) => {
        // INIT
        var key = process.env.REACT_APP_QUIZ_ENCRYPT_DECRYPT_KEY;
        var iv = data.substring(0, 16);
        var keyBytes = aesjs.utils.utf8.toBytes(key);
        var ivBytes = aesjs.utils.utf8.toBytes(iv);

        function decrypt(encrypted) {
            var aesCbc = new aesjs.ModeOfOperation.cbc(keyBytes, ivBytes);
            var encryptedBytes = base64url.toBuffer(encrypted);
            var decryptedBytes = aesCbc.decrypt(encryptedBytes);
            var decryptedText = aesjs.utils.utf8.fromBytes(decryptedBytes);

            var stringify = decryptedText;
            var first_curly = 0;
            var last_curly = 1;
            for (let i = 0; i < stringify.length; i++) {
                if (stringify[i] === "}") {
                    last_curly = i;
                }
            }
            last_curly += 1;

            return JSON.parse(stringify.substring(first_curly, last_curly));
        }

        this.setState({
            iv: iv,
        });

        return decrypt(data.substring(16));
    };

    loadQuestionData = () => {
        fetch(
            this.courseId
                ? `${this.url}/student/sub/${this.subscriptionId}/course/${this.courseId}/chapter/${this.chapterId}/quiz/${this.quizId}/levels/?level_complexity=${this.state.level.complexity}&level_id=${this.levelId}`
                : `${this.url}/student/subject/${this.subjectId}/chapter/${this.chapterId}/quiz/${this.quizId}/levels/?level_complexity=${this.state.level.complexity}&level_id=${this.levelId}`,
            {
                method: "GET",
                headers: this.headers,
            }
        )
            .then((res) => res.json())
            .then((result) => {
                if (result.sts === true) {
                    let response = this.handleDecrypt(result.data);
                    let question = QuestionDataFormat(
                        response.levels[0].questions
                    );
                    this.setState(
                        {
                            level: response.levels[0],
                            question: question.result,
                            seconds: response.levels[0].time_per_question,
                            page_loading: false,
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

    componentDidMount = () => {
        this.setState({
            showCountdownModal: true,
        });

        this.loadQuizData();
    };

    componentWillUnmount = () => {
        clearInterval(this.timer);
    };

    // ---------- handle option selection ----------

    equalsIgnoreOrder = (a, b) => {
        if (a.length !== b.length) return false;
        const uniqueValues = new Set([...a, ...b]);
        for (const v of uniqueValues) {
            const aCount = a.filter((e) => e === v).length;
            const bCount = b.filter((e) => e === v).length;
            if (aCount !== bCount) return false;
        }
        return true;
    };

    handleMCQ = (event, index, type) => {
        let sections = [...this.state.answer];
        let question = [...this.state.question];
        let answer = [];
        for (let i = 0; i < question[index].content.options.length; i++) {
            if (question[index].content.options[i].correct === true) {
                answer.push(question[index].content.options[i].content);
            }
        }
        if (type === "checkbox") {
            if (event.target.checked) {
                sections[index].answer.push(event.target.value);
                this.setState(
                    {
                        answer: sections,
                    },
                    () => {
                        sections[index].isCorrect = this.equalsIgnoreOrder(
                            answer,
                            sections[index].answer
                        );
                        this.setState(
                            {
                                answer: sections,
                            },
                            () => {
                                // Pagination and submitting of data
                                if (
                                    this.state.question[
                                        this.state.currentQuestion
                                    ].content.mcq_answers ===
                                    sections[index].answer.length
                                ) {
                                    if (
                                        this.state.currentQuestion + 1 ===
                                        this.state.question.length
                                    ) {
                                        this.handleSubmit();
                                    } else {
                                        this.handleNext();
                                    }
                                }
                            }
                        );
                    }
                );
            } else {
                sections[index].answer.splice(
                    sections[index].answer.indexOf(event.target.value),
                    1
                );
                this.setState(
                    {
                        answer: sections,
                    },
                    () => {
                        sections[index].isCorrect = this.equalsIgnoreOrder(
                            answer,
                            sections[index].answer
                        );
                        this.setState(
                            {
                                answer: sections,
                            },
                            () => {
                                // Pagination and submitting of data
                                if (
                                    this.state.question[
                                        this.state.currentQuestion
                                    ].content.mcq_answers ===
                                    sections[index].answer.length
                                ) {
                                    if (
                                        this.state.currentQuestion + 1 ===
                                        this.state.question.length
                                    ) {
                                        this.handleSubmit();
                                    } else {
                                        this.handleNext();
                                    }
                                }
                            }
                        );
                    }
                );
            }
        } else if (type === "radio") {
            sections[index].answer[0] = event.target.value;
            if (answer.includes(event.target.value)) {
                sections[index].isCorrect = true;
            } else {
                sections[index].isCorrect = false;
            }
            this.setState(
                {
                    answer: sections,
                },
                () => {
                    // Pagination and submitting of data
                    if (
                        this.state.currentQuestion + 1 ===
                        this.state.question.length
                    ) {
                        this.handleSubmit();
                    } else {
                        this.handleNext();
                    }
                }
            );
        }
    };

    handleBoolean = (event, index) => {
        let sections = [...this.state.answer];
        let question = [...this.state.question];
        let answer = [];
        sections[index].answer[0] = event.target.value;
        for (
            let i = 0;
            i < question[index].content.boolean_question.length;
            i++
        ) {
            if (question[index].content.boolean_question[i].correct === true) {
                answer.push(
                    question[index].content.boolean_question[i].content
                );
            }
        }
        if (answer.includes(event.target.value)) {
            sections[index].isCorrect = true;
        } else {
            sections[index].isCorrect = false;
        }
        this.setState(
            {
                answer: sections,
            },
            () => {
                // Pagination and submitting of data
                if (
                    this.state.currentQuestion + 1 ===
                    this.state.question.length
                ) {
                    this.handleSubmit();
                } else {
                    this.handleNext();
                }
            }
        );
    };

    // ---------- Bonus points, Correct & Wrong answer ----------

    handleCorrectWrongAnswer = () => {
        let sections = [...this.state.answer];
        let correct_answer = this.state.correct_answer;
        let wrong_answer = this.state.wrong_answer;
        for (let i = 0; i < sections.length; i++) {
            if (sections[i].isCorrect === true) {
                // if the answer is correct, update the correct_answer
                correct_answer++;
            } else {
                // if the answer is wrong, update the wrong_answer
                wrong_answer++;
            }
        }
        this.setState({
            correct_answer: correct_answer,
            wrong_answer: wrong_answer,
        });
    };

    handlePoints = () => {
        clearInterval(this.timer);
        const remaining_seconds = this.state.seconds;
        let bonus_points = this.state.bonus_points;
        let scored_points = this.state.scored_points;
        let total_points = this.state.total_points;
        const section = [...this.state.answer];
        const level = this.state.level;
        if (section[this.state.currentQuestion].isCorrect === true) {
            scored_points += level.points_per_question;
            total_points += level.points_per_question;
            if (
                level.bonus_points !== 0 &&
                level.required_time_for_bonus !== 0
            ) {
                total_points +=
                    (remaining_seconds / level.required_time_for_bonus) *
                    level.bonus_points;
                bonus_points +=
                    (remaining_seconds / level.required_time_for_bonus) *
                    level.bonus_points;
            }
        } else {
            if (this.state.quiz.negative_points === true) {
                scored_points -= level.points_per_question;
                total_points -= level.points_per_question;
            }
        }
        this.setState({
            bonus_points: bonus_points,
            scored_points: scored_points,
            total_points: total_points,
        });
    };

    // ---------- Submit the exam ----------

    handleSubmit = async () => {
        this.handlePoints();
        this.handleCorrectWrongAnswer();
        this.setState({
            showToast: true,
        });

        setTimeout(() => {
            this.setState({
                page_loading: true,
            });

            let body = {
                level_id: this.state.level.level_id,
                level_complexity: this.state.level.complexity,
                total_points:
                    this.state.total_points > 0 ? this.state.total_points : 0,
            };
            let response = this.handleEncrypt(JSON.stringify(body));

            fetch(
                this.courseId
                    ? `${this.url}/student/sub/${this.subscriptionId}/course/${this.courseId}/chapter/${this.chapterId}/quiz/${this.quizId}/levels/`
                    : `${this.url}/student/subject/${this.subjectId}/chapter/${this.chapterId}/quiz/${this.quizId}/levels/`,
                {
                    method: "POST",
                    headers: this.headers,
                    body: JSON.stringify({
                        quiz_data: `${this.state.iv}${response}`,
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
                                page_loading: false,
                            },
                            () => {
                                this.setState({
                                    isAnswerSubmitted: true,
                                    isPlaying: false,
                                    showToast: false,
                                });
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
        }, 1000);
    };

    // ---------- Navigation and Timer ----------

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

    handleNext = () => {
        // show toast and delay 1 second to display next question
        this.handlePoints();
        this.setState({
            showToast: true,
        });
        setTimeout(async () => {
            const level = this.state.level;
            await this.setState({
                currentQuestion: this.state.currentQuestion + 1,
                seconds: level.time_per_question,
                showOptions: false,
                showToast: false,
            });
            window.MathJax.typeset();
        }, 1000);
    };

    startTimer = () => {
        this.setState({
            showCountdownModal: false,
            isPlaying: true,
        });
        if (
            this.state.isAnswerSubmitted === false &&
            this.state.showQuestionReview === false
        ) {
            setTimeout(() => {
                this.timer = setInterval(this.questionCountDown, 1000);
                this.setState({
                    showOptions: true,
                });
            }, 2000);
        }
    };

    componentDidUpdate = async (prevProps, prevState) => {
        if (this.state.currentQuestion !== prevState.currentQuestion) {
            if (
                this.state.isAnswerSubmitted === false &&
                this.state.showQuestionReview === false
            ) {
                setTimeout(() => {
                    this.timer = setInterval(this.questionCountDown, 1000);
                    this.setState({
                        showOptions: true,
                    });
                }, 2000);
            }
        }
    };

    nextQuestion = () => {
        if (this.state.currentQuestion + 1 < this.state.question.length) {
            this.setState({
                showToast: true,
            });
            setTimeout(async () => {
                await this.setState({
                    currentQuestion: this.state.currentQuestion + 1,
                    seconds: this.state.level.time_per_question,
                    showOptions: false,
                    showToast: false,
                });
                window.MathJax.typeset();
            }, 1000);
        }
    };

    questionCountDown = async () => {
        let seconds = this.state.seconds - 1;
        this.setState({
            time: this.secondsToTime(seconds),
            seconds: seconds,
        });

        if (seconds === 0) {
            if (this.state.currentQuestion + 1 === this.state.question.length) {
                this.handleSubmit();
            } else {
                this.handlePoints();
                this.nextQuestion();
            }
        }
    };

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

    // ----- Render question -----

    colorMCQ = (data, index, answerSection, option) => {
        let color = "bg-white";
        let question = [...this.state.question];
        let answer = [];
        for (let i = 0; i < question[index].content.options.length; i++) {
            if (question[index].content.options[i].correct === true) {
                answer.push(question[index].content.options[i].content);
            }
        }

        if (data[index].content) {
            if (data[index].content.mcq_answers) {
                if (data[index].content.mcq_answers > 1) {
                    if (answerSection.answer) {
                        if (answerSection.answer.length !== 0) {
                            if (
                                data[index].content.mcq_answers ===
                                answerSection.answer.length
                            ) {
                                if (
                                    answer.includes(option.content) &&
                                    answerSection.answer.includes(
                                        option.content
                                    )
                                ) {
                                    color = "success-bg";
                                } else if (
                                    !answer.includes(option.content) &&
                                    answerSection.answer.includes(
                                        option.content
                                    )
                                ) {
                                    color = "danger-bg";
                                } else {
                                    color = "bg-white";
                                }
                            }
                        }
                    }
                } else {
                    if (answerSection.answer) {
                        if (answerSection.answer.length !== 0) {
                            if (answerSection.answer.includes(option.content)) {
                                if (answerSection.isCorrect === true) {
                                    color = "success-bg";
                                } else {
                                    color = "danger-bg";
                                }
                            }
                        }
                    }
                }
            }
        }

        return color;
    };

    handleBGSound = () => {
        this.setState({
            isPlaying: !this.state.isPlaying,
        });
    };

    questionRender = (data, index, answerSection) => {
        return (
            <div className="card card-body shadow-sm">
                <div
                    className="light-bg p-3 d-flex flex-column align-items-start"
                    style={{ minHeight: "70vh" }}
                >
                    <div className="w-100">
                        {/* ----- Header ----- */}
                        <div className="row align-items-center mb-5">
                            <div className="col-lg-4 col-sm-6 order-2 order-lg-1 mb-3 mb-sm-0">
                                <div className="d-inline primary-bg px-4 py-2 rounded-pill text-white">
                                    Duration: {this.state.time.h}:
                                    {this.state.time.m}:{this.state.time.s}
                                </div>
                            </div>
                            <div className="col-lg-4 order-1 order-lg-2 mb-3 mb-lg-0">
                                <h4 className="text-center primary-text mb-0">
                                    Question: {this.state.currentQuestion + 1} /{" "}
                                    {data.length}
                                </h4>
                            </div>
                            <div className="col-lg-4 col-sm-6 order-3 text-right">
                                <div className="d-inline primary-bg px-4 py-2 rounded-pill text-white">
                                    Points Scored:{" "}
                                    {NumericConversion(this.state.total_points)}
                                </div>
                            </div>
                        </div>

                        {/* ---------- Question ---------- */}
                        <div className="d-flex align-items-start">
                            <button className="btn bg-white btn-sm shadow-sm mr-1 px-3 font-weight-bold-600 rounded-lg">
                                {index <= 8 ? `0${index + 1}` : index + 1}
                            </button>
                            <div className="w-100">
                                <div
                                    className="card card-body shadow-sm mb-3"
                                    style={{
                                        minHeight: "20vh",
                                    }}
                                >
                                    <div
                                        dangerouslySetInnerHTML={{
                                            __html: data[index].question,
                                        }}
                                    ></div>
                                </div>
                                {/* <!----- Options starts here -----> */}
                                <div
                                    className="row"
                                    style={{
                                        visibility: `${
                                            this.state.showOptions === true
                                                ? "visible"
                                                : "hidden"
                                        }`,
                                    }}
                                >
                                    {/* ----- MCQ ----- */}
                                    {data[index].content.mcq === true
                                        ? (
                                              data[index].content.options || []
                                          ).map((option, option_index) => {
                                              return (
                                                  <div
                                                      className="col-md-6 mb-3"
                                                      key={option_index}
                                                  >
                                                      <div
                                                          className={`card card-body shadow-sm small font-weight-bold-600 pt-3 pb-0 
                                                              ${this.colorMCQ(
                                                                  data,
                                                                  index,
                                                                  answerSection,
                                                                  option
                                                              )}`}
                                                      >
                                                          {data[index].content
                                                              .mcq_answers !==
                                                          undefined ? (
                                                              data[index]
                                                                  .content
                                                                  .mcq_answers >
                                                              1 ? (
                                                                  <div className="custom-control custom-checkbox">
                                                                      <input
                                                                          type="checkbox"
                                                                          className="custom-control-input"
                                                                          id={`customCheck1${index}-${option_index}`}
                                                                          value={
                                                                              option.content
                                                                          }
                                                                          checked={
                                                                              answerSection.answer
                                                                                  ? answerSection
                                                                                        .answer
                                                                                        .length !==
                                                                                    0
                                                                                      ? answerSection.answer.includes(
                                                                                            option.content
                                                                                        )
                                                                                          ? true
                                                                                          : false
                                                                                      : false
                                                                                  : false
                                                                          }
                                                                          onChange={(
                                                                              event
                                                                          ) => {
                                                                              this.handleMCQ(
                                                                                  event,
                                                                                  index,
                                                                                  "checkbox"
                                                                              );
                                                                          }}
                                                                          disabled={
                                                                              this
                                                                                  .state
                                                                                  .showToast ===
                                                                              true
                                                                                  ? true
                                                                                  : false
                                                                          }
                                                                      />
                                                                      <label
                                                                          className="custom-control-label"
                                                                          htmlFor={`customCheck1${index}-${option_index}`}
                                                                          dangerouslySetInnerHTML={{
                                                                              __html: `<div class="mb-3">${option.content}</div>`,
                                                                          }}
                                                                      ></label>
                                                                  </div>
                                                              ) : (
                                                                  <div className="custom-control custom-radio">
                                                                      <input
                                                                          type="radio"
                                                                          id={`customRadio1${index}-${option_index}`}
                                                                          name={`customRadio${index}`}
                                                                          className="custom-control-input"
                                                                          value={
                                                                              option.content
                                                                          }
                                                                          checked={
                                                                              answerSection.answer
                                                                                  ? answerSection
                                                                                        .answer
                                                                                        .length !==
                                                                                    0
                                                                                      ? answerSection.answer.includes(
                                                                                            option.content
                                                                                        )
                                                                                          ? true
                                                                                          : false
                                                                                      : false
                                                                                  : false
                                                                          }
                                                                          onChange={(
                                                                              event
                                                                          ) => {
                                                                              this.handleMCQ(
                                                                                  event,
                                                                                  index,
                                                                                  "radio"
                                                                              );
                                                                          }}
                                                                          disabled={
                                                                              this
                                                                                  .state
                                                                                  .showToast ===
                                                                              true
                                                                                  ? true
                                                                                  : false
                                                                          }
                                                                      />
                                                                      <label
                                                                          className="custom-control-label"
                                                                          htmlFor={`customRadio1${index}-${option_index}`}
                                                                          dangerouslySetInnerHTML={{
                                                                              __html: `<div class="mb-3">${option.content}</div>`,
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
                                          })
                                        : // ----- True or false -----
                                        data[index].content.boolean === true
                                        ? (
                                              data[index].content
                                                  .boolean_question || []
                                          ).map((option, boolean_index) => {
                                              return (
                                                  <div
                                                      className="col-md-6 mb-3"
                                                      key={boolean_index}
                                                  >
                                                      <div
                                                          className={`card card-body shadow-sm small font-weight-bold-600 p-3 ${
                                                              answerSection.answer
                                                                  ? answerSection
                                                                        .answer
                                                                        .length !==
                                                                    0
                                                                      ? answerSection.answer.includes(
                                                                            option.content
                                                                        )
                                                                          ? answerSection.isCorrect ===
                                                                            true
                                                                              ? "success-bg"
                                                                              : "danger-bg"
                                                                          : ""
                                                                      : ""
                                                                  : ""
                                                          }`}
                                                      >
                                                          <div className="custom-control custom-radio">
                                                              <input
                                                                  type="radio"
                                                                  id={`customRadio1${index}-${boolean_index}`}
                                                                  name={`customRadio${index}`}
                                                                  className="custom-control-input"
                                                                  value={
                                                                      option.content
                                                                  }
                                                                  checked={
                                                                      answerSection.answer
                                                                          ? answerSection
                                                                                .answer
                                                                                .length !==
                                                                            0
                                                                              ? answerSection.answer.includes(
                                                                                    option.content
                                                                                )
                                                                                  ? true
                                                                                  : false
                                                                              : false
                                                                          : false
                                                                  }
                                                                  onChange={(
                                                                      event
                                                                  ) =>
                                                                      this.handleBoolean(
                                                                          event,
                                                                          index
                                                                      )
                                                                  }
                                                                  disabled={
                                                                      this.state
                                                                          .showToast ===
                                                                      true
                                                                          ? true
                                                                          : false
                                                                  }
                                                              />
                                                              <label
                                                                  className="custom-control-label"
                                                                  htmlFor={`customRadio1${index}-${boolean_index}`}
                                                              >
                                                                  {
                                                                      option.content
                                                                  }
                                                              </label>
                                                          </div>
                                                      </div>
                                                  </div>
                                              );
                                          })
                                        : null}
                                </div>
                                {/* <!----- Options ends here -----> */}

                                {/* ----- Multiple choice notes ----- */}
                                {data[index].content.mcq_answers !==
                                undefined ? (
                                    data[index].content.mcq_answers > 1 ? (
                                        <div
                                            className="small"
                                            style={{
                                                visibility: `${
                                                    this.state.showOptions ===
                                                    true
                                                        ? "visible"
                                                        : "hidden"
                                                }`,
                                            }}
                                        >
                                            <b>Note:</b>{" "}
                                            {data[index].content.mcq_answers}{" "}
                                            answers are correct
                                        </div>
                                    ) : null
                                ) : null}
                            </div>

                            {/* <!----- Image viewer -----> */}
                            {data[index]
                                ? data[index].content
                                    ? data[index].content.images
                                        ? data[index].content.images.length !==
                                          0
                                            ? this.imageRender(data[index])
                                            : ""
                                        : ""
                                    : ""
                                : ""}
                        </div>
                    </div>

                    {/* ----- Toast Message ----- */}
                    {this.state.showToast === true ? (
                        <ToastRender
                            data={data}
                            index={index}
                            answerSection={answerSection}
                            level={this.state.level}
                            quiz={this.state.quiz}
                            seconds={this.state.seconds}
                        />
                    ) : (
                        ""
                    )}
                </div>
            </div>
        );
    };

    // ----- Render Scorecard -----

    scorecardRender = () => {
        function bonusPointsCalculation(total_points, scored_points) {
            return total_points - scored_points;
        }

        return (
            <div className="card card-body shadow-sm">
                <div
                    className="light-bg d-flex align-items-center justify-content-center p-3"
                    style={{ minHeight: "70vh" }}
                >
                    <div className="w-100">
                        {/* ----- Level name ----- */}
                        <div className="d-flex justify-content-center">
                            <div className="d-inline">
                                <div
                                    className="card card-body bg-danger p-2"
                                    style={{ border: "6px solid #ffa88b" }}
                                >
                                    <h5 className="text-white mb-0">
                                        {this.state.level.level_name || ""}
                                    </h5>
                                </div>
                            </div>
                        </div>
                        {/* ----- Score card ----- */}
                        <div className="row justify-content-center mb-4">
                            <div className="col-lg-4 col-md-6">
                                <div
                                    className="card card-body bg-danger"
                                    style={{ border: "6px solid #ffa88b" }}
                                >
                                    <p className="h1 text-center mb-1 tomato-text">
                                        {this.state.scored_points > 0
                                            ? NumericConversion(
                                                  this.state.scored_points
                                              )
                                            : 0}
                                    </p>
                                    <p className="text-center text-white font-weight-bold-600 small mb-1">
                                        Points Scored
                                    </p>
                                    <p className="h6 text-white text-center mb-2">
                                        Bonus Points:{" "}
                                        {this.state.total_points > 0
                                            ? NumericConversion(
                                                  bonusPointsCalculation(
                                                      this.state.total_points,
                                                      this.state.scored_points
                                                  )
                                              )
                                            : 0}
                                    </p>
                                    <p className="h5 text-white text-center mb-2">
                                        Total Points:{" "}
                                        {this.state.total_points > 0
                                            ? NumericConversion(
                                                  this.state.total_points
                                              )
                                            : 0}
                                    </p>

                                    <div className="dropdown-divider"></div>

                                    <p className="font-weight-bold-600 small text-white text-center mb-1">
                                        Correct answers:{" "}
                                        {this.state.correct_answer}
                                    </p>
                                    <p className="font-weight-bold-600 small text-white text-center mb-0">
                                        Wrong answers: {this.state.wrong_answer}
                                    </p>
                                </div>
                            </div>
                        </div>
                        {/* ----- Buttons ----- */}
                        <div className="row justify-content-center">
                            <div className="col-lg-3 col-md-4 d-flex justify-content-around">
                                <div
                                    className="text-center"
                                    style={{ cursor: "pointer" }}
                                    onClick={async () => {
                                        await this.setState({
                                            isAnswerSubmitted: false,
                                            showQuestionReview: true,
                                            currentQuestion: 0,
                                        });
                                        window.MathJax.typeset();
                                    }}
                                >
                                    <button className="btn btn-danger shadow-none">
                                        <i className="fas fa-eye"></i>
                                    </button>
                                    <p className="font-weight-bold-600 text-danger mb-0">
                                        Review
                                    </p>
                                </div>
                                <div className="text-center">
                                    <Link
                                        to="#"
                                        onClick={this.props.history.goBack}
                                        className="text-decoration-none"
                                    >
                                        <button className="btn btn-danger shadow-none">
                                            <i className="fas fa-home"></i>
                                        </button>
                                        <p className="font-weight-bold-600 text-danger mb-0">
                                            Home
                                        </p>
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    // ----- Render question review -----

    reviewRender = (data, index, answerSection) => {
        return (
            <div className="card card-body shadow-sm">
                <div
                    className="light-bg p-3 d-flex flex-column align-items-start justify-content-center position-relative"
                    style={{ minHeight: "70vh" }}
                >
                    <button
                        className="btn btn-link btn-sm shadow-none position-absolute"
                        style={{ top: "10px", left: "10px" }}
                        onClick={async () => {
                            await this.setState({
                                isAnswerSubmitted: true,
                                showQuestionReview: false,
                                currentQuestion: 0,
                            });
                            window.MathJax.typeset();
                        }}
                    >
                        <i className="fas fa-chevron-left fa-sm mr-1"></i>Back
                    </button>

                    <p className="text-center primary-text h5 w-100 mb-4">
                        Question: {this.state.currentQuestion + 1} /{" "}
                        {data.length}
                    </p>

                    {/* ---------- Question ---------- */}

                    <div className="d-flex align-items-start w-100">
                        <button className="btn bg-white btn-sm shadow-sm mr-1 px-3 font-weight-bold-600 rounded-lg">
                            {index <= 8 ? `0${index + 1}` : index + 1}
                        </button>
                        <div className="w-100">
                            <div
                                className="card card-body shadow-sm mb-3"
                                style={{
                                    minHeight: "20vh",
                                }}
                            >
                                <div
                                    dangerouslySetInnerHTML={{
                                        __html: data[index].question,
                                    }}
                                ></div>
                            </div>
                            {/* <!----- Options starts here -----> */}
                            <div className="row small">
                                {/* ----- MCQ ----- */}
                                {data[index].content.mcq === true
                                    ? (data[index].content.options || []).map(
                                          (option, option_index) => {
                                              return (
                                                  <div
                                                      className="col-md-6 mb-3"
                                                      key={option_index}
                                                  >
                                                      <div
                                                          className={`card card-body shadow-sm font-weight-bold-600 pt-3 pb-0 ${
                                                              answerSection.answer.includes(
                                                                  option.content
                                                              )
                                                                  ? answerSection.isCorrect ===
                                                                    true
                                                                      ? "success-bg"
                                                                      : option.correct ===
                                                                        true
                                                                      ? "success-bg"
                                                                      : "danger-bg"
                                                                  : option.correct ===
                                                                    true
                                                                  ? "success-bg"
                                                                  : ""
                                                          }`}
                                                      >
                                                          <div
                                                              dangerouslySetInnerHTML={{
                                                                  __html: `<div class="mb-3">${option.content}</div>`,
                                                              }}
                                                          ></div>
                                                      </div>
                                                  </div>
                                              );
                                          }
                                      )
                                    : // ----- True or false -----
                                    data[index].content.boolean === true
                                    ? (
                                          data[index].content
                                              .boolean_question || []
                                      ).map((option, boolean_index) => {
                                          return (
                                              <div
                                                  className="col-md-6 mb-3"
                                                  key={boolean_index}
                                              >
                                                  <div
                                                      className={`card card-body shadow-sm font-weight-bold-600 p-3 ${
                                                          answerSection.answer.includes(
                                                              option.content
                                                          )
                                                              ? answerSection.isCorrect ===
                                                                true
                                                                  ? "success-bg"
                                                                  : "danger-bg"
                                                              : option.correct ===
                                                                true
                                                              ? "success-bg"
                                                              : ""
                                                      }`}
                                                  >
                                                      {option.content}
                                                  </div>
                                              </div>
                                          );
                                      })
                                    : null}
                            </div>
                            {/* <!----- Options ends here -----> */}
                        </div>
                        {/* <!----- Image viewer -----> */}
                        {data[index]
                            ? data[index].content
                                ? data[index].content.images
                                    ? data[index].content.images.length !== 0
                                        ? this.imageRender(data[index])
                                        : ""
                                    : ""
                                : ""
                            : ""}
                    </div>

                    {/* ----- Pagination ----- */}

                    <div className="d-flex mt-auto align-items-center justify-content-center w-100">
                        {(this.state.answer || []).map((answer, index) => {
                            return (
                                <div
                                    key={index}
                                    className={`bg-white d-flex align-items-center justify-content-center rounded-circle mx-1 ${
                                        answer.isCorrect === true
                                            ? "text-success"
                                            : "text-danger"
                                    } font-weight-bold-600 border ${
                                        answer.isCorrect === true
                                            ? "border-success"
                                            : "border-danger"
                                    } ${
                                        this.state.currentQuestion === index
                                            ? answer.isCorrect === true
                                                ? "success-bg"
                                                : "danger-bg"
                                            : "bg-white"
                                    }`}
                                    style={{
                                        width: "30px",
                                        height: "30px",
                                        cursor: "pointer",
                                    }}
                                    onClick={async () => {
                                        await this.setState({
                                            currentQuestion: index,
                                        });
                                        window.MathJax.typeset();
                                    }}
                                >
                                    <span style={{ marginBottom: "2px" }}>
                                        {index + 1}
                                    </span>
                                </div>
                            );
                        })}
                    </div>
                    {/* <!----- Question ends here -----> */}
                </div>
            </div>
        );
    };

    render() {
        document.title = `${
            this.state.level.level_name || ""
        } - Student | IQLabs`;

        const data = this.state.question;
        const index = this.state.currentQuestion;
        const answerSection =
            this.state.answer[this.state.currentQuestion] !== undefined
                ? this.state.answer[this.state.currentQuestion]
                : [];
        return (
            <>
                {/* ----- Navbar ----- */}
                <Header
                    name={
                        this.courseId
                            ? this.props.course_name
                            : this.props.subject_name
                    }
                    chapter_name={`${this.props.chapter_name} - ${
                        this.props.quiz_name
                    } - ${this.state.level.level_name || ""}`}
                    goBack={this.props.history.goBack}
                />

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

                {/* ----- Quiz countdown modal ----- */}
                {this.state.showCountdownModal ? (
                    <QuizCountDown
                        show={this.state.showCountdownModal}
                        onHide={this.startTimer}
                    />
                ) : (
                    ""
                )}

                {/* ----- Image lightbox ----- */}
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

                <ReactHowler
                    src={QUIZ_AUDIO}
                    preload={true}
                    playing={this.state.isPlaying}
                    loop={true}
                    volume={0.3}
                />

                {/* <!----- Main content starts here -----> */}
                <div className="exam-section position-relative">
                    <div className="container user-select-none">
                        <ErrorBoundary
                            FallbackComponent={ErrorFallback}
                            onReset={() => window.location.reload()}
                        >
                            {this.state.isAnswerSubmitted === false &&
                            this.state.showQuestionReview === false
                                ? data.length !== 0
                                    ? data[index]
                                        ? this.questionRender(
                                              data,
                                              index,
                                              answerSection
                                          )
                                        : ""
                                    : ""
                                : this.state.isAnswerSubmitted === true
                                ? this.scorecardRender()
                                : this.state.showQuestionReview === true
                                ? data.length !== 0
                                    ? data[index]
                                        ? this.reviewRender(
                                              data,
                                              index,
                                              answerSection
                                          )
                                        : ""
                                    : ""
                                : ""}
                        </ErrorBoundary>
                    </div>

                    {this.state.isAnswerSubmitted === false &&
                    this.state.showQuestionReview === false ? (
                        <button
                            className="btn pinkrange-bg btn-sm shadow-none position-absolute"
                            style={{
                                top: "25px",
                                right: 0,
                                borderTopRightRadius: 0,
                                borderBottomRightRadius: 0,
                            }}
                            onClick={this.handleBGSound}
                        >
                            {this.state.isPlaying ? (
                                <i className="fas fa-volume-up"></i>
                            ) : (
                                <i className="fas fa-volume-mute"></i>
                            )}
                        </button>
                    ) : (
                        ""
                    )}
                </div>
                {/* <!----- Main content ends here -----> */}

                {/* ----- Loading component ----- */}
                {this.state.page_loading ? <Loading /> : ""}
            </>
        );
    }
}

export default connect(mapStateToProps)(QuizLevelExam);
