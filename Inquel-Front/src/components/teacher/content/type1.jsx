import React, { Component, Fragment } from "react";
import Wrapper from "../wrapper";
import { connect } from "react-redux";
import axios from "axios";
import { Link } from "react-router-dom";
import CKeditor, { OptionEditor } from "../../common/CKEditor";
import ReactSwitch from "../../common/switchComponent";
import { Accordion, Card } from "react-bootstrap";
import { baseUrl, teacherUrl } from "../../../shared/baseUrl.js";
import Loading from "../../common/loader";
import AlertBox from "../../common/alert";
import FileModal from "../shared/fileExplorer";
import { SingleContentDeleteModal } from "../../common/modal/contentManagementModal";
import TemplateUpload from "../shared/templateUpload";
import { TYPE_ONE_TEMPLATE } from "../../../shared/constant";

const mapStateToProps = (state) => ({
    group_name: state.content.group_name,
    subject_name: state.content.subject_name,
    chapter_name: state.content.chapter_name,
    topic_name: state.content.topic_name,
});

class TeacherType1 extends Component {
    constructor(props) {
        super(props);
        this.state = {
            showModal: false,
            showTemplateUploadModal: false,

            errorMsg: "",
            successMsg: "",
            showErrorAlert: false,
            showSuccessAlert: false,
            page_loading: true,
            btnDisabled: false,
            showMCQDelete_Modal: false,

            contentCollapsed: true,
            filesCollapsed: true,
            propertiesCollapsed: true,
            settingsCollapsed: true,
            showEdit_option: false,
            themeData: [],
            complexityData: [],
            isForm_submitted: false,

            activeQuestion: "",
            selectedImage: "",
            selectedVideo: "",
            selectedAudio: "",
            selectedQuestion: "",

            questions: [
                {
                    chapter_id: this.props.match.params.chapterId,
                    topic_num: this.props.match.params.topicNum,
                    question: "<p>Question goes here</p>",
                    question_random_id: "",
                    is_file_uploaded: false,
                    content: {
                        mcq: true,
                        fill_in: false,
                        boolean: false,
                        fillin_answer: [""],
                        boolean_question: [
                            { correct: false, content: "True" },
                            { correct: false, content: "False" },
                        ],
                        options: [
                            { correct: false, content: "" },
                            { correct: false, content: "" },
                            { correct: false, content: "" },
                            { correct: false, content: "" },
                        ],
                        explanation: "<p>Explanation goes here</p>",
                        images: [
                            { title: "", file_name: "", image: null, path: "" },
                            { title: "", file_name: "", image: null, path: "" },
                            { title: "", file_name: "", image: null, path: "" },
                            { title: "", file_name: "", image: null, path: "" },
                        ],
                        video: {
                            title: "",
                            file_name: "",
                            video: null,
                            path: "",
                            url: "",
                        },
                        audio: [
                            { title: "", file_name: "", audio: null, path: "" },
                            { title: "", file_name: "", audio: null, path: "" },
                        ],
                    },
                    properties: {
                        marks: "",
                        complexity: "",
                        priority: "",
                        theme: "",
                        test: [false, false, false, false, false],
                        semester: [false, false, false, false, false],
                        quiz: [false, false, false, false, false],
                        learn: false,
                    },
                    settings: {
                        virtual_keyboard: [],
                        limited: false,
                    },
                },
            ],
        };
        this.option_limit = 6;
        this.groupId = this.props.match.params.groupId;
        this.subjectId = this.props.match.params.subjectId;
        this.chapterId = this.props.match.params.chapterId;
        this.topicNum = this.props.match.params.topicNum;
        this.url = baseUrl + teacherUrl;
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

    // -------------------------- Template uploading --------------------------

    toggleTemplateModal = () => {
        this.setState({
            showTemplateUploadModal: !this.state.showTemplateUploadModal,
        });
    };

    templateFormSubmission = (data) => {
        this.setState({
            showTemplateUploadModal: false,
            page_loading: true,
        });
        this.loadMCQData();
    };

    // -------------------------- Question data loading --------------------------

    loadMCQData = async () => {
        await fetch(
            `${this.url}/teacher/subject/${this.subjectId}/chapter/mcq/?chapter_id=${this.chapterId}&topic_num=${this.topicNum}`,
            {
                headers: this.headers,
                method: "GET",
            }
        )
            .then((res) => res.json())
            .then((result) => {
                if (result.sts === true) {
                    let data = [];
                    let response = result.data.results;
                    if (response.length !== 0) {
                        let questionData = this.loopQuestionData(
                            data,
                            response
                        );
                        this.setState(
                            {
                                questions: questionData.question,
                            },
                            () => {
                                if (result.data.next !== null) {
                                    this.loadNextMCQData(result.data.next);
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

    loadNextMCQData = async (path) => {
        await fetch(path, {
            headers: this.headers,
            method: "GET",
        })
            .then((res) => res.json())
            .then((result) => {
                if (result.sts === true) {
                    let data = [...this.state.questions];
                    let response = result.data.results;
                    if (response.length !== 0) {
                        let questionData = this.loopQuestionData(
                            data,
                            response
                        );
                        this.setState(
                            {
                                questions: questionData.question,
                            },
                            () => {
                                if (result.data.next !== null) {
                                    this.loadNextMCQData(result.data.next);
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

    loopQuestionData = (data, response) => {
        let imgArr = [];
        let audioArr = [];
        for (let i = 0; i < response.length; i++) {
            imgArr = [];
            audioArr = [];
            if (response[i].files.length !== 0) {
                // image
                imgArr.push({
                    title: response[i].files.type1_image_1_title || "",
                    file_name: "",
                    image: null,
                    path: response[i].files.type1_image_1 || "",
                });
                imgArr.push({
                    title: response[i].files.type1_image_2_title || "",
                    file_name: "",
                    image: null,
                    path: response[i].files.type1_image_2 || "",
                });
                imgArr.push({
                    title: response[i].files.type1_image_3_title || "",
                    file_name: "",
                    image: null,
                    path: response[i].files.type1_image_3 || "",
                });
                imgArr.push({
                    title: response[i].files.type1_image_4_title || "",
                    file_name: "",
                    image: null,
                    path: response[i].files.type1_image_4 || "",
                });

                // audio
                audioArr.push({
                    title: response[i].files.type1_audio_1_title || "",
                    file_name: "",
                    audio: null,
                    path: response[i].files.type1_audio_1 || "",
                });
                audioArr.push({
                    title: response[i].files.type1_audio_2_title || "",
                    file_name: "",
                    audio: null,
                    path: response[i].files.type1_audio_2 || "",
                });
            }

            // video
            var path = "";
            if (response[i].files.length !== 0) {
                if (response[i].files.paste_video_url) {
                    path = response[i].files.paste_video_url;
                }
                if (response[i].files.type1_video_1) {
                    path = response[i].files.type1_video_1;
                }
            }

            data.push({
                chapter_id: this.props.match.params.chapterId,
                topic_num: this.props.match.params.topicNum,
                question: response[i].question,
                question_random_id: response[i].question_random_id,
                is_file_uploaded:
                    Object.keys(response[i].files).length !== 0 ? true : false,
                content: {
                    mcq: response[i].mcq,
                    fill_in: response[i].fill_in,
                    boolean: response[i].boolean,
                    fillin_answer:
                        response[i].fillin_answer.length !== 0
                            ? response[i].fillin_answer
                            : [""],
                    boolean_question:
                        response[i].boolean_question.length !== 0
                            ? response[i].boolean_question
                            : [
                                  {
                                      correct: false,
                                      content: "True",
                                  },
                                  {
                                      correct: false,
                                      content: "False",
                                  },
                              ],
                    options:
                        response[i].options.length !== 0
                            ? response[i].options
                            : [
                                  {
                                      correct: false,
                                      content: "",
                                  },
                                  {
                                      correct: false,
                                      content: "",
                                  },
                                  {
                                      correct: false,
                                      content: "",
                                  },
                                  {
                                      correct: false,
                                      content: "",
                                  },
                              ],
                    explanation: response[i].explanation,
                    images:
                        imgArr.length === 0
                            ? [
                                  {
                                      title: "",
                                      file_name: "",
                                      image: null,
                                      path: "",
                                  },
                                  {
                                      title: "",
                                      file_name: "",
                                      image: null,
                                      path: "",
                                  },
                                  {
                                      title: "",
                                      file_name: "",
                                      image: null,
                                      path: "",
                                  },
                                  {
                                      title: "",
                                      file_name: "",
                                      image: null,
                                      path: "",
                                  },
                              ]
                            : imgArr,
                    video: {
                        title:
                            response[i].files.length !== 0 &&
                            response[i].files.type1_video_1_title
                                ? response[i].files.type1_video_1_title
                                : "",
                        file_name: "",
                        video: null,
                        path: path,
                        url: "",
                    },
                    audio:
                        audioArr.length === 0
                            ? [
                                  {
                                      title: "",
                                      file_name: "",
                                      audio: null,
                                      path: "",
                                  },
                                  {
                                      title: "",
                                      file_name: "",
                                      audio: null,
                                      path: "",
                                  },
                              ]
                            : audioArr,
                },
                properties: {
                    marks: response[i].properties.marks,
                    complexity: response[i].properties.complexity,
                    priority: response[i].properties.priority,
                    theme: response[i].properties.theme,
                    test: response[i].properties.test,
                    semester: response[i].properties.semester,
                    quiz: response[i].properties.quiz,
                    learn: response[i].properties.learn,
                },
                settings: {
                    virtual_keyboard: response[i].settings.virtual_keyboard,
                    limited: response[i].settings.limited,
                },
            });
        }

        return {
            question: data,
        };
    };

    // -------------------------- Lifecycle --------------------------

    componentDidMount = () => {
        document.title = `${this.props.topic_name} - Teacher | IQLabs`;

        fetch(`${this.url}/teacher/status/data/?theme=1&complexity=1`, {
            headers: this.headers,
            method: "GET",
        })
            .then((res) => res.json())
            .then((result) => {
                if (result.sts === true) {
                    this.setState({
                        themeData: result.data.theme,
                        complexityData: result.data.complexity,
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

        this.loadMCQData();
    };

    // -------------------------- Data submission --------------------------

    handleSubmit = () => {
        this.setState({
            page_loading: true,
            showErrorAlert: false,
            showSuccessAlert: false,
        });

        const data = [...this.state.questions];
        let option_correct = data[this.state.activeQuestion].content.mcq
            ? false
            : true;
        let option_content = data[this.state.activeQuestion].content.mcq
            ? false
            : true;
        let fill_in = data[this.state.activeQuestion].content.fill_in
            ? false
            : true;
        let boolean_correct = data[this.state.activeQuestion].content.boolean
            ? false
            : true;

        // Options validation
        if (data[this.state.activeQuestion].content.mcq === true) {
            for (
                let i = 0;
                i < data[this.state.activeQuestion].content.options.length;
                i++
            ) {
                if (
                    data[this.state.activeQuestion].content.options[i]
                        .correct === true
                ) {
                    option_correct = true;
                } else {
                    continue;
                }
            }
            for (
                let i = 0;
                i < data[this.state.activeQuestion].content.options.length;
                i++
            ) {
                if (
                    data[this.state.activeQuestion].content.options[i]
                        .content !== ""
                ) {
                    option_content = true;
                } else {
                    option_content = false;
                }
            }
        }

        // fill in validation
        if (data[this.state.activeQuestion].content.fill_in === true) {
            for (
                let i = 0;
                i <
                data[this.state.activeQuestion].content.fillin_answer.length;
                i++
            ) {
                if (
                    data[this.state.activeQuestion].content.fillin_answer[i] !==
                    ""
                ) {
                    fill_in = true;
                } else {
                    fill_in = false;
                }
            }
        }

        // Boolean validation
        if (data[this.state.activeQuestion].content.boolean === true) {
            for (
                let i = 0;
                i <
                data[this.state.activeQuestion].content.boolean_question.length;
                i++
            ) {
                if (
                    data[this.state.activeQuestion].content.boolean_question[i]
                        .correct === true
                ) {
                    boolean_correct = true;
                } else {
                    continue;
                }
            }
        }

        if (data[this.state.activeQuestion].question === "") {
            this.setState({
                errorMsg: "Question is required",
                showErrorAlert: true,
                page_loading: false,
            });
        } else if (
            data[this.state.activeQuestion].content.mcq === false &&
            data[this.state.activeQuestion].content.fill_in === false &&
            data[this.state.activeQuestion].content.boolean === false
        ) {
            this.setState({
                errorMsg: "Select any one answer type",
                showErrorAlert: true,
                page_loading: false,
            });
        } else if (option_content === false) {
            this.setState({
                errorMsg: "Enter the options value",
                showErrorAlert: true,
                page_loading: false,
            });
        } else if (option_correct === false) {
            this.setState({
                errorMsg: "Select a correct option in the MCQ",
                showErrorAlert: true,
                page_loading: false,
            });
        } else if (fill_in === false) {
            this.setState({
                errorMsg: "Enter the fill in answers",
                showErrorAlert: true,
                page_loading: false,
            });
        } else if (boolean_correct === false) {
            this.setState({
                errorMsg: "Select either True or False",
                showErrorAlert: true,
                page_loading: false,
            });
        } else if (data[this.state.activeQuestion].properties.marks === "") {
            this.setState({
                errorMsg: "Marks is required",
                showErrorAlert: true,
                page_loading: false,
            });
        } else if (
            data[this.state.activeQuestion].properties.complexity === ""
        ) {
            this.setState({
                errorMsg: "Complexity is required",
                showErrorAlert: true,
                page_loading: false,
            });
        } else if (data[this.state.activeQuestion].properties.priority === "") {
            this.setState({
                errorMsg: "Priority is required",
                showErrorAlert: true,
                page_loading: false,
            });
        } else if (data[this.state.activeQuestion].properties.theme === "") {
            this.setState({
                errorMsg: "Theme is required",
                showErrorAlert: true,
                page_loading: false,
            });
        } else {
            if (data[this.state.activeQuestion].question_random_id === "") {
                this.handlePOST(data);
            } else {
                this.handlePUT(data);
            }
        }
    };

    handlePOST = (data) => {
        fetch(`${this.url}/teacher/subject/${this.subjectId}/chapter/mcq/`, {
            headers: this.headers,
            method: "POST",
            body: JSON.stringify({
                chapter_id: this.chapterId,
                topic_num: this.topicNum,
                question: data[this.state.activeQuestion].question,
                content: {
                    mcq: data[this.state.activeQuestion].content.mcq,
                    fill_in: data[this.state.activeQuestion].content.fill_in,
                    boolean: data[this.state.activeQuestion].content.boolean,
                    fillin_answer:
                        data[this.state.activeQuestion].content.fillin_answer,
                    boolean_question:
                        data[this.state.activeQuestion].content
                            .boolean_question,
                    options: data[this.state.activeQuestion].content.options,
                    explanation:
                        data[this.state.activeQuestion].content.explanation,
                },
                properties: {
                    marks: data[this.state.activeQuestion].properties.marks,
                    complexity:
                        data[this.state.activeQuestion].properties.complexity,
                    priority:
                        data[this.state.activeQuestion].properties.priority,
                    theme: data[this.state.activeQuestion].properties.theme,
                    test: data[this.state.activeQuestion].properties.test,
                    semester:
                        data[this.state.activeQuestion].properties.semester,
                    quiz: data[this.state.activeQuestion].properties.quiz,
                    learn: data[this.state.activeQuestion].properties.learn,
                },
                settings: {
                    virtual_keyboard:
                        data[this.state.activeQuestion].settings
                            .virtual_keyboard,
                    limited: data[this.state.activeQuestion].settings.limited,
                },
            }),
        })
            .then((res) => res.json())
            .then((result) => {
                if (result.sts === true) {
                    data[this.state.activeQuestion].question_random_id =
                        result.question_random_id;
                    this.setState({
                        questions: data,
                        isForm_submitted: true,
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

    handlePUT = (data) => {
        fetch(`${this.url}/teacher/subject/${this.subjectId}/chapter/mcq/`, {
            headers: this.headers,
            method: "PUT",
            body: JSON.stringify({
                chapter_id: this.chapterId,
                topic_num: this.topicNum,
                question: data[this.state.activeQuestion].question,
                question_random_id:
                    data[this.state.activeQuestion].question_random_id,
                content: {
                    mcq: data[this.state.activeQuestion].content.mcq,
                    fill_in: data[this.state.activeQuestion].content.fill_in,
                    boolean: data[this.state.activeQuestion].content.boolean,
                    fillin_answer:
                        data[this.state.activeQuestion].content.fillin_answer,
                    boolean_question:
                        data[this.state.activeQuestion].content
                            .boolean_question,
                    options: data[this.state.activeQuestion].content.options,
                    explanation:
                        data[this.state.activeQuestion].content.explanation,
                },
                properties: {
                    marks: data[this.state.activeQuestion].properties.marks,
                    complexity:
                        data[this.state.activeQuestion].properties.complexity,
                    priority:
                        data[this.state.activeQuestion].properties.priority,
                    theme: data[this.state.activeQuestion].properties.theme,
                    test: data[this.state.activeQuestion].properties.test,
                    semester:
                        data[this.state.activeQuestion].properties.semester,
                    quiz: data[this.state.activeQuestion].properties.quiz,
                    learn: data[this.state.activeQuestion].properties.learn,
                },
                settings: {
                    virtual_keyboard:
                        data[this.state.activeQuestion].settings
                            .virtual_keyboard,
                    limited: data[this.state.activeQuestion].settings.limited,
                },
            }),
        })
            .then((res) => res.json())
            .then((result) => {
                if (result.sts === true) {
                    data[this.state.activeQuestion].question_random_id =
                        result.question_random_id;
                    this.setState({
                        questions: data,
                        isForm_submitted: true,
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

    // Run the image API once the question is added
    componentDidUpdate = (prevProps, prevState) => {
        if (
            prevState.isForm_submitted !== this.state.isForm_submitted &&
            this.state.isForm_submitted === true
        ) {
            this.setState({
                page_loading: true,
                showErrorAlert: false,
                showSuccessAlert: false,
                isForm_submitted: false,
            });

            const questionData = [...this.state.questions];

            let form_data = new FormData();

            form_data.append("chapter_id", this.chapterId);
            form_data.append("topic_num", this.topicNum);
            form_data.append(
                "question_random_id",
                questionData[this.state.activeQuestion].question_random_id
            );

            // Video
            if (
                questionData[this.state.activeQuestion].content.video.url !== ""
            ) {
                form_data.append(
                    "video_url",
                    questionData[this.state.activeQuestion].content.video.url
                );
            }

            if (
                questionData[this.state.activeQuestion].content.video.video !==
                null
            ) {
                form_data.append(
                    "type1_video_1_title",
                    questionData[this.state.activeQuestion].content.video.title
                );
                form_data.append(
                    "type1_video_1",
                    questionData[this.state.activeQuestion].content.video.video
                );
            }

            // Image
            for (
                let i = 0;
                i <
                questionData[this.state.activeQuestion].content.images.length;
                i++
            ) {
                if (
                    questionData[this.state.activeQuestion].content.images[i]
                        .image !== null
                ) {
                    form_data.append(
                        `type1_image_${i + 1}_title`,
                        questionData[this.state.activeQuestion].content.images[
                            i
                        ].title
                    );
                    form_data.append(
                        `type1_image_${i + 1}`,
                        questionData[this.state.activeQuestion].content.images[
                            i
                        ].image
                    );
                } else {
                    continue;
                }
            }

            // Audio
            for (
                let i = 0;
                i <
                questionData[this.state.activeQuestion].content.audio.length;
                i++
            ) {
                if (
                    questionData[this.state.activeQuestion].content.audio[i]
                        .audio !== null
                ) {
                    form_data.append(
                        `type1_audio_${i + 1}_title`,
                        questionData[this.state.activeQuestion].content.audio[i]
                            .title
                    );
                    form_data.append(
                        `type1_audio_${i + 1}`,
                        questionData[this.state.activeQuestion].content.audio[i]
                            .audio
                    );
                } else {
                    continue;
                }
            }

            const options = {
                headers: {
                    Accept: "application/json",
                    "Content-Type": "multipart/form-data",
                    Authorization: this.authToken,
                },
            };

            let files_arr = [];
            for (var p of form_data) {
                files_arr.push(p);
            }

            if (files_arr.length !== 3) {
                if (
                    questionData[this.state.activeQuestion].is_file_uploaded ===
                    false
                ) {
                    this.handleImgPOST(options, form_data, questionData);
                } else {
                    this.handleImgPATCH(options, form_data, questionData);
                }
            } else {
                this.setState(
                    {
                        questions: questionData,
                        successMsg: "Question added",
                        showSuccessAlert: true,
                    },
                    () => {
                        this.setState({
                            showEdit_option: false,
                            contentCollapsed: true,
                            filesCollapsed: true,
                            propertiesCollapsed: true,
                            settingsCollapsed: true,
                            page_loading: true,
                            activeQuestion: "",
                        });
                        this.loadMCQData();
                    }
                );
            }
        }
    };

    handleImgPOST = (options, form_data, questionData) => {
        axios
            .post(
                `${this.url}/teacher/subject/${this.subjectId}/chapter/mcq/files/`,
                form_data,
                options
            )
            .then((result) => {
                if (result.data.sts === true) {
                    this.setState(
                        {
                            questions: questionData,
                            successMsg: result.data.msg,
                            showSuccessAlert: true,
                            page_loading: false,
                        },
                        () => {
                            this.setState({
                                showEdit_option: false,
                                contentCollapsed: true,
                                filesCollapsed: true,
                                propertiesCollapsed: true,
                                settingsCollapsed: true,
                                page_loading: true,
                                activeQuestion: "",
                            });
                            this.loadMCQData();
                        }
                    );
                } else {
                    this.setState({
                        errorMsg: result.data.msg,
                        showErrorAlert: true,
                        page_loading: false,
                    });
                }
            })
            .catch((err) => {
                console.log(err);
                if (err.response) {
                    this.setState({
                        errorMsg: err.response.data.msg,
                    });
                } else if (err.request) {
                    this.setState({
                        errorMsg: err.request.data.msg,
                    });
                } else if (err.message) {
                    this.setState({
                        errorMsg: err.message.data.msg,
                    });
                }
                this.setState({
                    showErrorAlert: true,
                    page_loading: false,
                });
            });
    };

    handleImgPATCH = (options, form_data, questionData) => {
        axios
            .patch(
                `${this.url}/teacher/subject/${this.subjectId}/chapter/mcq/files/`,
                form_data,
                options
            )
            .then((result) => {
                if (result.data.sts === true) {
                    this.setState(
                        {
                            questions: questionData,
                            successMsg: result.data.msg,
                            showSuccessAlert: true,
                            page_loading: false,
                        },
                        () => {
                            this.setState({
                                showEdit_option: false,
                                contentCollapsed: true,
                                filesCollapsed: true,
                                propertiesCollapsed: true,
                                settingsCollapsed: true,
                                page_loading: true,
                                activeQuestion: "",
                            });
                            this.loadMCQData();
                        }
                    );
                } else {
                    this.setState({
                        errorMsg: result.data.msg,
                        showErrorAlert: true,
                        page_loading: false,
                    });
                }
            })
            .catch((err) => {
                console.log(err);
                if (err.response) {
                    this.setState({
                        errorMsg: err.response.data.msg,
                    });
                } else if (err.request) {
                    this.setState({
                        errorMsg: err.request.data.msg,
                    });
                } else if (err.message) {
                    this.setState({
                        errorMsg: err.message.data.msg,
                    });
                }
                this.setState({
                    showErrorAlert: true,
                    page_loading: false,
                });
            });
    };

    // -------------------------- Question & Explanation --------------------------

    onEditorChange = async (evt) => {
        const values = [...this.state.questions];
        values[this.state.activeQuestion].question = evt.editor.getData();
        await this.setState({
            questions: values,
        });
        window.MathJax.typeset();
    };

    handleExplanation = async (evt) => {
        const values = [...this.state.questions];
        values[this.state.activeQuestion].content.explanation =
            evt.editor.getData();
        await this.setState({
            questions: values,
        });
        window.MathJax.typeset();
    };

    // -------------------------- Options --------------------------

    handleOptions_mcq = () => {
        const values = [...this.state.questions];
        values[this.state.activeQuestion].content.mcq =
            !values[this.state.activeQuestion].content.mcq;
        values[this.state.activeQuestion].content.fill_in = false;
        values[this.state.activeQuestion].content.boolean = false;
        this.setState({
            questions: values,
        });
    };

    handleOptions_fillin = () => {
        const values = [...this.state.questions];
        values[this.state.activeQuestion].content.fill_in =
            !values[this.state.activeQuestion].content.fill_in;
        values[this.state.activeQuestion].content.mcq = false;
        values[this.state.activeQuestion].content.boolean = false;
        this.setState({
            questions: values,
        });
    };

    handleOptions_boolean = () => {
        const values = [...this.state.questions];
        values[this.state.activeQuestion].content.boolean =
            !values[this.state.activeQuestion].content.boolean;
        values[this.state.activeQuestion].content.mcq = false;
        values[this.state.activeQuestion].content.fill_in = false;
        this.setState({
            questions: values,
        });
    };

    handleBoolean = () => {
        const values = [...this.state.questions];
        values[this.state.activeQuestion].content.boolean =
            !values[this.state.activeQuestion].content.boolean;
        this.setState({
            questions: values,
        });
    };

    correctOption = (index) => {
        const values = [...this.state.questions];
        if (
            values[this.state.activeQuestion].content.options[index].content !==
            ""
        ) {
            values[this.state.activeQuestion].content.options[index].correct =
                !values[this.state.activeQuestion].content.options[index]
                    .correct;
            this.setState({
                questions: values,
            });
        }
    };

    correctBoolean = (index) => {
        const values = [...this.state.questions];
        values[
            this.state.activeQuestion
        ].content.boolean_question[0].correct = false;
        values[
            this.state.activeQuestion
        ].content.boolean_question[1].correct = false;
        values[this.state.activeQuestion].content.boolean_question[
            index
        ].correct =
            !values[this.state.activeQuestion].content.boolean_question[index]
                .correct;
        this.setState({
            questions: values,
        });
    };

    handleOptionChange = async (index, event) => {
        const values = [...this.state.questions];
        values[this.state.activeQuestion].content.options[index].content =
            event.editor.getData();
        await this.setState({
            questions: values,
        });
        window.MathJax.typeset();
    };

    handleAddOptionFields = () => {
        const values = [...this.state.questions];
        values[this.state.activeQuestion].content.options.push({
            correct: false,
            content: "",
        });
        this.setState({
            questions: values,
        });
    };

    handleRemoveOptionFields = (index) => {
        const values = [...this.state.questions];
        values[this.state.activeQuestion].content.options.splice(index, 1);
        this.setState(
            {
                questions: values,
            },
            () => {
                if (
                    values[this.state.activeQuestion].content.options.length ===
                    0
                ) {
                    values[this.state.activeQuestion].content.options.push({
                        correct: false,
                        content: "",
                    });
                }
                this.setState({
                    questions: values,
                });
            }
        );
    };

    handleAnswerChange = (index, event) => {
        const values = [...this.state.questions];
        values[this.state.activeQuestion].content.fillin_answer[index] =
            event.target.value;
        this.setState({
            questions: values,
        });
    };

    handleAddAnswerFields = () => {
        const values = [...this.state.questions];
        values[this.state.activeQuestion].content.fillin_answer.push("");
        this.setState({
            questions: values,
        });
    };

    handleRemoveAnswerFields = (index) => {
        const values = [...this.state.questions];
        values[this.state.activeQuestion].content.fillin_answer.splice(
            index,
            1
        );
        this.setState(
            {
                questions: values,
            },
            () => {
                if (
                    values[this.state.activeQuestion].content.fillin_answer
                        .length === 0
                ) {
                    values[
                        this.state.activeQuestion
                    ].content.fillin_answer.push("");
                }
                this.setState({
                    questions: values,
                });
            }
        );
    };

    // -------------------------- Image --------------------------

    handleImageTitle = (index, event) => {
        const values = [...this.state.questions];
        values[this.state.activeQuestion].content.images[index].title =
            event.target.value;
        this.setState({
            questions: values,
        });
    };

    handleDeleteImages = (index) => {
        const values = [...this.state.questions];

        this.setState({
            showSuccessAlert: false,
            showErrorAlert: false,
        });

        if (
            values[this.state.activeQuestion].question_random_id !== "" &&
            values[this.state.activeQuestion].is_file_uploaded === true &&
            values[this.state.activeQuestion].content.images[index]
                .file_name === "" &&
            values[this.state.activeQuestion].content.images[index].path !== ""
        ) {
            let body = {
                chapter_id: this.chapterId,
                topic_num: this.topicNum,
                question_random_id:
                    values[this.state.activeQuestion].question_random_id,
            };
            body[`type1_image_${index + 1}_title`] =
                values[this.state.activeQuestion].content.images[index].title ||
                "title";

            fetch(
                `${this.url}/teacher/subject/${this.subjectId}/chapter/mcq/files/`,
                {
                    method: "DELETE",
                    headers: this.headers,
                    body: JSON.stringify(body),
                }
            )
                .then((res) => res.json())
                .then((result) => {
                    if (result.sts === true) {
                        this.setState({
                            successMsg: result.msg,
                            showSuccessAlert: true,
                        });
                        values[this.state.activeQuestion].content.images[
                            index
                        ] = {
                            title: "",
                            file_name: "",
                            image: null,
                            path: "",
                        };
                        this.setState({
                            questions: values,
                        });
                    } else {
                        this.setState({
                            errorMsg: result.msg,
                            showErrorAlert: true,
                        });
                    }
                })
                .catch((err) => {
                    console.log(err);
                    this.setState({
                        errorMsg: "Something went wrong!",
                        showErrorAlert: true,
                    });
                });
        } else {
            values[this.state.activeQuestion].content.images[index] = {
                title: "",
                file_name: "",
                image: null,
                path: "",
            };
            this.setState({
                questions: values,
            });
        }
    };

    handleImageFile = (index, event) => {
        this.setState({
            showErrorAlert: false,
        });

        const values = [...this.state.questions];
        const file = event.target.files[0].name.toLowerCase();
        if (!file.match(/\.(jpg|jpeg|png|webp)$/)) {
            this.setState({
                errorMsg: "Please select valid image file",
                showErrorAlert: true,
                btnDisabled: true,
            });
        } else {
            values[this.state.activeQuestion].content.images[index].file_name =
                event.target.files[0].name;
            values[this.state.activeQuestion].content.images[index].path =
                URL.createObjectURL(event.target.files[0]);
            values[this.state.activeQuestion].content.images[index].image =
                event.target.files[0];
            this.setState({
                questions: values,
                btnDisabled: false,
                showErrorAlert: false,
            });
        }
    };

    clearImages = () => {
        const values = [...this.state.questions];
        this.setState({
            showErrorAlert: false,
            showSuccessAlert: false,
        });
        for (
            let i = 0;
            i < values[this.state.activeQuestion].content.images.length;
            i++
        ) {
            this.handleDeleteImages(i);
        }
    };

    // -------------------------- Video --------------------------

    handleVideoTitle = (event) => {
        const values = [...this.state.questions];
        values[this.state.activeQuestion].content.video.title =
            event.target.value;
        this.setState({
            questions: values,
        });
    };

    handleVideoFile = (event) => {
        this.setState({
            showErrorAlert: false,
        });

        let values = [...this.state.questions];
        const file = event.target.files[0].name.toLowerCase();
        if (!file.match(/\.(mpeg|flv|avi|mov|mp4|mkv)$/)) {
            this.setState({
                errorMsg: "Please select valid video file",
                showErrorAlert: true,
                btnDisabled: true,
            });
        } else {
            values[this.state.activeQuestion].content.video.file_name =
                event.target.files[0].name;
            values[this.state.activeQuestion].content.video.path =
                URL.createObjectURL(event.target.files[0]);
            values[this.state.activeQuestion].content.video.video =
                event.target.files[0];
            values[this.state.activeQuestion].content.video.url = "";
            this.setState({
                questions: values,
                btnDisabled: false,
                showErrorAlert: false,
            });
        }
    };

    handleVideoUrl = (event) => {
        const values = [...this.state.questions];
        values[this.state.activeQuestion].content.video.url =
            event.target.value;
        values[this.state.activeQuestion].content.video.file_name = "";
        values[this.state.activeQuestion].content.video.video = null;
        values[this.state.activeQuestion].content.video.path = "";
        this.setState({
            questions: values,
        });
    };

    clearVideo = () => {
        const values = [...this.state.questions];

        if (
            values[this.state.activeQuestion].question_random_id !== "" &&
            values[this.state.activeQuestion].is_file_uploaded === true &&
            values[this.state.activeQuestion].content.video.file_name === "" &&
            values[this.state.activeQuestion].content.video.path !== ""
        ) {
            fetch(
                `${this.url}/teacher/subject/${this.subjectId}/chapter/mcq/files/`,
                {
                    method: "DELETE",
                    headers: this.headers,
                    body: JSON.stringify({
                        chapter_id: this.chapterId,
                        topic_num: this.topicNum,
                        question_random_id:
                            values[this.state.activeQuestion]
                                .question_random_id,
                        type1_video_1_title:
                            values[this.state.activeQuestion].content.video
                                .title || "title",
                    }),
                }
            )
                .then((res) => res.json())
                .then((result) => {
                    if (result.sts === true) {
                        this.setState({
                            successMsg: result.msg,
                            showSuccessAlert: true,
                        });
                        values[this.state.activeQuestion].content.video.title =
                            "";
                        values[
                            this.state.activeQuestion
                        ].content.video.file_name = "";
                        values[this.state.activeQuestion].content.video.video =
                            null;
                        values[this.state.activeQuestion].content.video.path =
                            "";
                        values[this.state.activeQuestion].content.video.url =
                            "";
                        this.setState({
                            questions: values,
                        });
                    } else {
                        this.setState({
                            errorMsg: result.msg,
                            showErrorAlert: true,
                        });
                    }
                })
                .catch((err) => {
                    console.log(err);
                    this.setState({
                        errorMsg: "Something went wrong!",
                        showErrorAlert: true,
                    });
                });
        } else {
            values[this.state.activeQuestion].content.video.title = "";
            values[this.state.activeQuestion].content.video.file_name = "";
            values[this.state.activeQuestion].content.video.video = null;
            values[this.state.activeQuestion].content.video.path = "";
            values[this.state.activeQuestion].content.video.url = "";
            this.setState({
                questions: values,
            });
        }
    };

    // -------------------------- Audio --------------------------

    handleAudioTitle = (index, event) => {
        const values = [...this.state.questions];
        values[this.state.activeQuestion].content.audio[index].title =
            event.target.value;
        this.setState({
            questions: values,
        });
    };

    handleDeleteAudio = (index) => {
        const values = [...this.state.questions];

        this.setState({
            showSuccessAlert: false,
            showErrorAlert: false,
        });

        if (
            values[this.state.activeQuestion].question_random_id !== "" &&
            values[this.state.activeQuestion].is_file_uploaded === true &&
            values[this.state.activeQuestion].content.audio[index].file_name ===
                "" &&
            values[this.state.activeQuestion].content.audio[index].path !== ""
        ) {
            let body = {
                chapter_id: this.chapterId,
                topic_num: this.topicNum,
                question_random_id:
                    values[this.state.activeQuestion].question_random_id,
            };
            body[`type1_audio_${index + 1}_title`] =
                values[this.state.activeQuestion].content.audio[index].title ||
                "title";

            fetch(
                `${this.url}/teacher/subject/${this.subjectId}/chapter/mcq/files/`,
                {
                    method: "DELETE",
                    headers: this.headers,
                    body: JSON.stringify(body),
                }
            )
                .then((res) => res.json())
                .then((result) => {
                    if (result.sts === true) {
                        this.setState({
                            successMsg: result.msg,
                            showSuccessAlert: true,
                        });
                        values[this.state.activeQuestion].content.audio[index] =
                            {
                                title: "",
                                file_name: "",
                                audio: null,
                                path: "",
                            };
                        this.setState({
                            questions: values,
                        });
                    } else {
                        this.setState({
                            errorMsg: result.msg,
                            showErrorAlert: true,
                        });
                    }
                })
                .catch((err) => {
                    console.log(err);
                    this.setState({
                        errorMsg: "Something went wrong!",
                        showErrorAlert: true,
                    });
                });
        } else {
            values[this.state.activeQuestion].content.audio[index] = {
                title: "",
                file_name: "",
                audio: null,
                path: "",
            };
            this.setState({
                questions: values,
            });
        }
    };

    handleAudioFile = (index, event) => {
        this.setState({
            showErrorAlert: false,
        });

        const values = [...this.state.questions];
        const file = event.target.files[0].name.toLowerCase();
        if (!file.match(/\.(wav|mp3)$/)) {
            this.setState({
                errorMsg: "Please select valid audio file",
                showErrorAlert: true,
                btnDisabled: true,
            });
        } else {
            values[this.state.activeQuestion].content.audio[index].file_name =
                event.target.files[0].name;
            values[this.state.activeQuestion].content.audio[index].path =
                URL.createObjectURL(event.target.files[0]);
            values[this.state.activeQuestion].content.audio[index].audio =
                event.target.files[0];
            this.setState({
                questions: values,
                btnDisabled: false,
                showErrorAlert: false,
            });
        }
    };

    clearAudios = () => {
        const values = [...this.state.questions];
        this.setState({
            showErrorAlert: false,
            showSuccessAlert: false,
        });
        for (
            let i = 0;
            i < values[this.state.activeQuestion].content.audio.length;
            i++
        ) {
            this.handleDeleteAudio(i);
        }
    };

    // -------------------------- Properties --------------------------

    handleProperties = (event, type) => {
        const values = [...this.state.questions];
        if (type === "marks") {
            values[this.state.activeQuestion].properties.marks =
                event.target.value;
        } else if (type === "complexity") {
            values[this.state.activeQuestion].properties.complexity =
                event.target.value;
        } else if (type === "priority") {
            values[this.state.activeQuestion].properties.priority =
                event.target.value;
        } else {
            values[this.state.activeQuestion].properties.theme =
                event.target.value;
        }
        this.setState({
            questions: values,
        });
    };

    handleAttemptSequence = (index, type) => {
        const values = [...this.state.questions];
        if (type === "test") {
            values[this.state.activeQuestion].properties.test[index] =
                !values[this.state.activeQuestion].properties.test[index];
        } else if (type === "semester") {
            values[this.state.activeQuestion].properties.semester[index] =
                !values[this.state.activeQuestion].properties.semester[index];
        } else {
            values[this.state.activeQuestion].properties.quiz[index] =
                !values[this.state.activeQuestion].properties.quiz[index];
        }
        this.setState({
            questions: values,
        });
    };

    handleLearn = () => {
        const values = [...this.state.questions];
        values[this.state.activeQuestion].properties.learn =
            !values[this.state.activeQuestion].properties.learn;
        this.setState({
            questions: values,
        });
    };

    // -------------------------- Settings --------------------------

    handleLimited = () => {
        const values = [...this.state.questions];
        values[this.state.activeQuestion].settings.limited =
            !values[this.state.activeQuestion].settings.limited;
        this.setState({
            questions: values,
        });
    };

    // -------------------------- Collapse --------------------------

    toggleCollapse = (component) => {
        this.setState({
            contentCollapsed: true,
            filesCollapsed: true,
            propertiesCollapsed: true,
            settingsCollapsed: true,
        });
        if (component === "content") {
            this.setState({
                contentCollapsed: !this.state.contentCollapsed,
            });
        } else if (component === "files") {
            this.setState({
                filesCollapsed: !this.state.filesCollapsed,
            });
        } else if (component === "properties") {
            this.setState({
                propertiesCollapsed: !this.state.propertiesCollapsed,
            });
        } else {
            this.setState({
                settingsCollapsed: !this.state.settingsCollapsed,
            });
        }
    };

    // -------------------------- Adding, Removing, Deleting question --------------------------

    handleAddQuestion = () => {
        const values = [...this.state.questions];

        values.push({
            chapter_id: this.chapterId,
            topic_num: this.topicNum,
            question: "<p>Question goes here</p>",
            question_random_id: "",
            is_file_uploaded: false,
            content: {
                mcq: true,
                fill_in: false,
                boolean: false,
                fillin_answer: [""],
                boolean_question: [
                    { correct: false, content: "True" },
                    { correct: false, content: "False" },
                ],
                options: [
                    { correct: false, content: "" },
                    { correct: false, content: "" },
                    { correct: false, content: "" },
                    { correct: false, content: "" },
                ],
                explanation: "<p>Explanation goes here</p>",
                images: [
                    { title: "", file_name: "", image: null, path: "" },
                    { title: "", file_name: "", image: null, path: "" },
                    { title: "", file_name: "", image: null, path: "" },
                    { title: "", file_name: "", image: null, path: "" },
                ],
                video: {
                    title: "",
                    file_name: "",
                    video: null,
                    path: "",
                    url: "",
                },
                audio: [
                    { title: "", file_name: "", audio: null, path: "" },
                    { title: "", file_name: "", audio: null, path: "" },
                ],
            },
            properties: {
                marks: "",
                complexity: "",
                priority: "",
                theme: "",
                test: [false, false, false, false, false],
                semester: [false, false, false, false, false],
                quiz: [false, false, false, false, false],
                learn: false,
            },
            settings: {
                virtual_keyboard: [],
                limited: false,
            },
        });
        this.setState({
            questions: values,
            activeQuestion: values.length - 1,
        });
    };

    copyQuestions = async (index) => {
        const values = [...this.state.questions];

        const options = [];
        for (let i = 0; i < values[index].content.options.length; i++) {
            options[i] = {
                content: values[index].content.options[i].content,
                correct: values[index].content.options[i].correct,
            };
        }
        const fillin = [];
        for (let i = 0; i < values[index].content.fillin_answer.length; i++) {
            fillin[i] = values[index].content.fillin_answer[i];
        }
        const boolean = [];
        for (
            let i = 0;
            i < values[index].content.boolean_question.length;
            i++
        ) {
            boolean[i] = {
                content: values[index].content.boolean_question[i].content,
                correct: values[index].content.boolean_question[i].correct,
            };
        }
        const test = [];
        for (let i = 0; i < values[index].properties.test.length; i++) {
            test[i] = values[index].properties.test[i];
        }
        const semester = [];
        for (let i = 0; i < values[index].properties.semester.length; i++) {
            semester[i] = values[index].properties.semester[i];
        }
        const quiz = [];
        for (let i = 0; i < values[index].properties.quiz.length; i++) {
            quiz[i] = values[index].properties.quiz[i];
        }
        values.splice(index + 1, 0, {
            chapter_id: this.chapterId,
            topic_num: this.topicNum,
            question: values[index].question,
            question_random_id: "",
            is_file_uploaded: false,
            content: {
                mcq: values[index].content.mcq,
                fill_in: values[index].content.fill_in,
                boolean: values[index].content.boolean,
                fillin_answer: fillin,
                boolean_question: boolean,
                options: options,
                explanation: values[index].content.explanation,
                images: [
                    { title: "", file_name: "", image: null, path: "" },
                    { title: "", file_name: "", image: null, path: "" },
                    { title: "", file_name: "", image: null, path: "" },
                    { title: "", file_name: "", image: null, path: "" },
                ],
                video: {
                    title: "",
                    file_name: "",
                    video: null,
                    path: "",
                    url: "",
                },
                audio: [
                    { title: "", file_name: "", audio: null, path: "" },
                    { title: "", file_name: "", audio: null, path: "" },
                ],
            },
            properties: {
                marks: values[index].properties.marks,
                complexity: values[index].properties.complexity,
                priority: values[index].properties.priority,
                theme: values[index].properties.theme,
                test: test,
                semester: semester,
                quiz: quiz,
                learn: values[index].properties.learn,
            },
            settings: {
                virtual_keyboard: values[index].settings.virtual_keyboard,
                limited: values[index].settings.limited,
            },
        });
        await this.setState({
            questions: values,
            activeQuestion: index + 1,
        });
        window.MathJax.typeset();
    };

    editQuestion = (index) => {
        this.setState({
            showEdit_option: true,
            activeQuestion: index,
            showErrorAlert: false,
            showSuccessAlert: false,
        });
    };

    deleteQuestion = (index) => {
        const values = [...this.state.questions];
        this.setState({
            showEdit_option: false,
            contentCollapsed: true,
            filesCollapsed: true,
            propertiesCollapsed: true,
            settingsCollapsed: true,
            activeQuestion: index,
        });

        if (values[index].question_random_id !== "") {
            this.setState({
                selectedQuestion: values[index].question_random_id,
                showMCQDelete_Modal: !this.state.showMCQDelete_Modal,
            });
        } else {
            values.splice(index, 1);
            this.setState(
                {
                    questions: values,
                    activeQuestion: "",
                },
                () => {
                    if (values.length === 0) {
                        values.push({
                            chapter_id: this.chapterId,
                            topic_num: this.topicNum,
                            question: "<p>Question goes here</p>",
                            question_random_id: "",
                            is_file_uploaded: false,
                            content: {
                                mcq: true,
                                fill_in: false,
                                boolean: false,
                                fillin_answer: [""],
                                boolean_question: [
                                    { correct: false, content: "True" },
                                    { correct: false, content: "False" },
                                ],
                                options: [
                                    { correct: false, content: "" },
                                    { correct: false, content: "" },
                                    { correct: false, content: "" },
                                    { correct: false, content: "" },
                                ],
                                explanation: "<p>Explanation goes here</p>",
                                images: [
                                    {
                                        title: "",
                                        file_name: "",
                                        image: null,
                                        path: "",
                                    },
                                    {
                                        title: "",
                                        file_name: "",
                                        image: null,
                                        path: "",
                                    },
                                    {
                                        title: "",
                                        file_name: "",
                                        image: null,
                                        path: "",
                                    },
                                    {
                                        title: "",
                                        file_name: "",
                                        image: null,
                                        path: "",
                                    },
                                ],
                                video: {
                                    title: "",
                                    file_name: "",
                                    video: null,
                                    path: "",
                                    url: "",
                                },
                                audio: [
                                    {
                                        title: "",
                                        file_name: "",
                                        audio: null,
                                        path: "",
                                    },
                                    {
                                        title: "",
                                        file_name: "",
                                        audio: null,
                                        path: "",
                                    },
                                ],
                            },
                            properties: {
                                marks: "",
                                complexity: "",
                                priority: "",
                                theme: "",
                                test: [false, false, false, false, false],
                                semester: [false, false, false, false, false],
                                quiz: [false, false, false, false, false],
                                learn: false,
                            },
                            settings: {
                                virtual_keyboard: [],
                                limited: false,
                            },
                        });
                        this.setState({
                            questions: values,
                        });
                    }
                }
            );
        }
    };

    toggleDeleteModal = () => {
        this.setState({
            showMCQDelete_Modal: !this.state.showMCQDelete_Modal,
        });
    };

    handleMCQ_Deletion = () => {
        const values = [...this.state.questions];

        values.splice(this.state.activeQuestion, 1);

        this.setState(
            {
                questions: values,
                activeQuestion: "",
            },
            () => {
                if (values.length === 0) {
                    values.push({
                        chapter_id: this.chapterId,
                        topic_num: this.topicNum,
                        question: "<p>Question goes here</p>",
                        question_random_id: "",
                        is_file_uploaded: false,
                        content: {
                            mcq: true,
                            fill_in: false,
                            boolean: false,
                            fillin_answer: [""],
                            boolean_question: [
                                {
                                    correct: false,
                                    content: "True",
                                },
                                {
                                    correct: false,
                                    content: "False",
                                },
                            ],
                            options: [
                                { correct: false, content: "" },
                                { correct: false, content: "" },
                                { correct: false, content: "" },
                                { correct: false, content: "" },
                            ],
                            explanation: "<p>Explanation goes here</p>",
                            images: [
                                {
                                    title: "",
                                    file_name: "",
                                    image: null,
                                    path: "",
                                },
                                {
                                    title: "",
                                    file_name: "",
                                    image: null,
                                    path: "",
                                },
                                {
                                    title: "",
                                    file_name: "",
                                    image: null,
                                    path: "",
                                },
                                {
                                    title: "",
                                    file_name: "",
                                    image: null,
                                    path: "",
                                },
                            ],
                            video: {
                                title: "",
                                file_name: "",
                                video: null,
                                path: "",
                                url: "",
                            },
                            audio: [
                                {
                                    title: "",
                                    file_name: "",
                                    audio: null,
                                    path: "",
                                },
                                {
                                    title: "",
                                    file_name: "",
                                    audio: null,
                                    path: "",
                                },
                            ],
                        },
                        properties: {
                            marks: "",
                            complexity: "",
                            priority: "",
                            theme: "",
                            test: [false, false, false, false, false],
                            semester: [false, false, false, false, false],
                            quiz: [false, false, false, false, false],
                            learn: false,
                        },
                        settings: {
                            virtual_keyboard: [],
                            limited: false,
                        },
                    });
                    this.setState({
                        questions: values,
                    });
                }
            }
        );
        setTimeout(() => {
            this.setState(
                {
                    showMCQDelete_Modal: false,
                    page_loading: true,
                },
                () => {
                    this.loadMCQData();
                }
            );
        }, 1000);
    };

    // -------------------------- Publishing the question --------------------------

    handlePublish = () => {
        this.setState({
            showSuccessAlert: false,
            showErrorAlert: false,
            page_loading: true,
        });

        const questions = [...this.state.questions];
        let id = [];
        for (let i = 0; i < questions.length; i++) {
            if (questions[i].question_random_id !== "") {
                id.push(questions[i].question_random_id);
            } else {
                continue;
            }
        }

        if (id.length !== 0) {
            fetch(
                `${this.url}/teacher/subject/${this.subjectId}/chapter/mcq/publish/`,
                {
                    headers: this.headers,
                    method: "POST",
                    body: JSON.stringify({
                        question_ids: id,
                        chapter_id: this.chapterId,
                        topic_num: this.topicNum,
                    }),
                }
            )
                .then((res) => res.json())
                .then((result) => {
                    if (result.sts === true) {
                        this.setState({
                            successMsg: result.msg,
                            showSuccessAlert: true,
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
        } else {
            this.setState({
                page_loading: false,
            });
        }
    };

    render() {
        let data = [...this.state.questions];
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

                {/* MCQ Deletion Modal */}
                {this.state.showMCQDelete_Modal ? (
                    <SingleContentDeleteModal
                        show={this.state.showMCQDelete_Modal}
                        onHide={this.toggleDeleteModal}
                        formSubmission={this.handleMCQ_Deletion}
                        url={`${this.url}/teacher/subject/${this.subjectId}/chapter/mcq/`}
                        type="question"
                        name=""
                        data={{
                            chapter_id: this.chapterId,
                            topic_num: this.topicNum,
                            question_random_id: this.state.selectedQuestion,
                        }}
                    />
                ) : null}

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

                {/* Template uploading Modal */}
                {this.state.showTemplateUploadModal ? (
                    <TemplateUpload
                        show={this.state.showTemplateUploadModal}
                        onHide={this.toggleTemplateModal}
                        formSubmission={this.templateFormSubmission}
                        toggleModal={this.toggleTemplateModal}
                        url={`${this.url}/teacher/subject/${this.subjectId}/chapter/mcq/upload/`}
                        type="type_1"
                        subjectId={this.subjectId}
                        chapterId={this.chapterId}
                        topic_num={this.topicNum}
                    />
                ) : null}

                <div className="row">
                    {/* ------------------------------ MCQ Column ------------------------------ */}
                    <div
                        className={`${
                            this.state.showEdit_option ? "col-md-9" : "col-12"
                        } mb-4 mb-md-0`}
                    >
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
                                            <Link
                                                to={`/teacher/group/${this.groupId}`}
                                            >
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
                                        <Link
                                            to={`/teacher/subject/${this.subjectId}`}
                                        >
                                            {this.props.subject_name}
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
                                    Type 1
                                </li>
                            </ol>
                        </nav>

                        {/* Header area */}
                        <div className="row align-items-center mb-4">
                            <div className="col-md-6">
                                <h5 className="primary-text mb-0">
                                    {`Type 1 - ${this.props.topic_name}`}
                                </h5>
                            </div>
                            <div className="col-md-6">
                                <div className="d-flex flex-wrap justify-content-end">
                                    <button
                                        className="btn btn-primary btn-sm shadow-none mr-1"
                                        onClick={this.handlePublish}
                                    >
                                        Publish
                                    </button>
                                    <a
                                        href={TYPE_ONE_TEMPLATE}
                                        className="btn btn-primary btn-sm shadow-none mr-1"
                                        download
                                    >
                                        Download template
                                    </a>
                                    <button
                                        className="btn btn-primary btn-sm shadow-none"
                                        onClick={this.toggleTemplateModal}
                                    >
                                        Upload template
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* -------------------- MCQ -------------------- */}
                        {this.state.questions.map((question, q_index) => {
                            return (
                                <div className="row mb-3" key={q_index}>
                                    {/* ---------- Side buttons ---------- */}
                                    <div className="col-md-1 mb-1 mb-md-0">
                                        <div className="row">
                                            <div className="col-md-12 col-3 mb-1">
                                                <button
                                                    type="button"
                                                    className="btn btn-light bg-white btn-block shadow-sm mr-2"
                                                    style={{
                                                        cursor: "default",
                                                    }}
                                                >
                                                    {q_index <= 8
                                                        ? `0${q_index + 1}`
                                                        : q_index + 1}
                                                </button>
                                            </div>
                                            <div className="col-md-12 col-3 mb-1">
                                                <button
                                                    type="button"
                                                    className="btn btn-light bg-white btn-block shadow-sm mr-2"
                                                    onClick={() =>
                                                        this.editQuestion(
                                                            q_index
                                                        )
                                                    }
                                                >
                                                    <i className="far fa-edit fa-sm"></i>
                                                </button>
                                            </div>
                                            <div className="col-md-12 col-3 mb-1">
                                                <button
                                                    type="button"
                                                    className="btn btn-light bg-white btn-block shadow-sm mr-1"
                                                    onClick={() =>
                                                        this.copyQuestions(
                                                            q_index
                                                        )
                                                    }
                                                    disabled={
                                                        question.question_random_id ===
                                                        ""
                                                            ? true
                                                            : false
                                                    }
                                                >
                                                    <i className="far fa-copy fa-sm"></i>
                                                </button>
                                            </div>
                                            <div className="col-md-12 col-3">
                                                <button
                                                    type="button"
                                                    className="btn btn-light bg-white btn-block shadow-sm"
                                                    onClick={() =>
                                                        this.deleteQuestion(
                                                            q_index
                                                        )
                                                    }
                                                >
                                                    <i className="far fa-trash-alt fa-sm"></i>
                                                </button>
                                            </div>
                                        </div>
                                    </div>

                                    {/* ---------- Question preview ---------- */}
                                    <div className="col-md-11 pl-md-0">
                                        <div
                                            className={`card shadow-sm ${
                                                this.state.activeQuestion ===
                                                q_index
                                                    ? "border-primary"
                                                    : ""
                                            }`}
                                        >
                                            <div className="card-body">
                                                <div className="row">
                                                    {/* Questions & options */}
                                                    <div className="col-11 pr-md-0">
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
                                                        {question.content
                                                            .mcq ? (
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
                                                        {question.content
                                                            .fill_in ? (
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
                                                        {question.content
                                                            .boolean ? (
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
                                                    <div className="col-1 pl-0 text-right">
                                                        <button
                                                            className="btn btn-light bg-white shadow-sm"
                                                            onClick={() =>
                                                                this.toggleModal(
                                                                    question
                                                                        .content
                                                                        .images,
                                                                    question
                                                                        .content
                                                                        .video,
                                                                    question
                                                                        .content
                                                                        .audio
                                                                )
                                                            }
                                                        >
                                                            <i className="far fa-folder-open"></i>
                                                        </button>
                                                    </div>
                                                </div>
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
                                </div>
                            );
                        })}

                        <button
                            className="btn btn-primary btn-block shadow-none"
                            onClick={this.handleAddQuestion}
                        >
                            Add +
                        </button>
                    </div>

                    {/* ---------- Settings column ---------- */}
                    {this.state.showEdit_option ? (
                        <div className="col-md-3 content-edit">
                            <div className="d-flex justify-content-between align-items-center mb-2">
                                <button
                                    className="btn btn-primary btn-sm shadow-none"
                                    onClick={this.handleSubmit}
                                    disabled={this.state.btnDisabled}
                                >
                                    Save
                                </button>
                                <button
                                    className="btn btn-link btn-sm shadow-none"
                                    onClick={() => {
                                        this.setState({
                                            showEdit_option: false,
                                            contentCollapsed: true,
                                            filesCollapsed: true,
                                            propertiesCollapsed: true,
                                            settingsCollapsed: true,
                                            activeQuestion: "",
                                        });
                                    }}
                                >
                                    Close
                                </button>
                            </div>

                            <Accordion defaultActiveKey="">
                                {/* ---------- Content ---------- */}
                                <Card className="shadow-sm mb-2">
                                    <Accordion.Toggle
                                        as={Card.Body}
                                        variant="link"
                                        eventKey="0"
                                        className="text-dark"
                                        style={{ cursor: "default" }}
                                        onClick={() =>
                                            this.toggleCollapse("content")
                                        }
                                    >
                                        <div className="d-flex justify-content-between align-items-center">
                                            Content
                                            {this.state.contentCollapsed ? (
                                                <i className="fas fa-angle-right "></i>
                                            ) : (
                                                <i className="fas fa-angle-down "></i>
                                            )}
                                        </div>
                                    </Accordion.Toggle>

                                    <Accordion.Collapse eventKey="0">
                                        <Card.Body className="p-3">
                                            {/* ---------- Questions ---------- */}
                                            <div className="form-group">
                                                <label>Add Questions</label>
                                                <CKeditor
                                                    data={
                                                        data[
                                                            this.state
                                                                .activeQuestion
                                                        ].question
                                                    }
                                                    onChange={
                                                        this.onEditorChange
                                                    }
                                                />
                                            </div>

                                            {/* ---------- Options ---------- */}
                                            <div className="form-group">
                                                <div className="row mb-3">
                                                    <div className="col-md-6">
                                                        <div className="d-flex align-items-center">
                                                            <span className="mr-4">
                                                                MCQ
                                                            </span>
                                                            <ReactSwitch
                                                                checked={
                                                                    data[
                                                                        this
                                                                            .state
                                                                            .activeQuestion
                                                                    ].content
                                                                        .mcq
                                                                }
                                                                onChange={() =>
                                                                    this.handleOptions_mcq(
                                                                        this
                                                                            .state
                                                                            .activeQuestion
                                                                    )
                                                                }
                                                            />
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="row mb-3">
                                                    <div className="col-md-6">
                                                        <div className="d-flex align-items-center">
                                                            <span className="mr-4">
                                                                Fill in
                                                            </span>
                                                            <ReactSwitch
                                                                checked={
                                                                    data[
                                                                        this
                                                                            .state
                                                                            .activeQuestion
                                                                    ].content
                                                                        .fill_in
                                                                }
                                                                onChange={() =>
                                                                    this.handleOptions_fillin(
                                                                        this
                                                                            .state
                                                                            .activeQuestion
                                                                    )
                                                                }
                                                            />
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="row mb-3">
                                                    <div className="col-md-8">
                                                        <div className="d-flex align-items-center">
                                                            <span className="mr-4">
                                                                True / False
                                                            </span>
                                                            <ReactSwitch
                                                                checked={
                                                                    data[
                                                                        this
                                                                            .state
                                                                            .activeQuestion
                                                                    ].content
                                                                        .boolean
                                                                }
                                                                onChange={() =>
                                                                    this.handleOptions_boolean(
                                                                        this
                                                                            .state
                                                                            .activeQuestion
                                                                    )
                                                                }
                                                            />
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            {data[this.state.activeQuestion]
                                                .content.mcq ? (
                                                <div className="form-group row align-items-center">
                                                    {data[
                                                        this.state
                                                            .activeQuestion
                                                    ].content.options.map(
                                                        (options, index) => (
                                                            <Fragment
                                                                key={index}
                                                            >
                                                                <div className="col-10 mb-2 pr-0">
                                                                    <div
                                                                        className="d-flex border-secondary"
                                                                        style={{
                                                                            borderRadius:
                                                                                "4px",
                                                                        }}
                                                                    >
                                                                        <div className="w-100">
                                                                            <OptionEditor
                                                                                data={
                                                                                    options.content
                                                                                }
                                                                                onChange={(
                                                                                    event
                                                                                ) =>
                                                                                    this.handleOptionChange(
                                                                                        index,
                                                                                        event
                                                                                    )
                                                                                }
                                                                            />
                                                                        </div>
                                                                        <button
                                                                            type="button"
                                                                            className="btn btn-light btn-sm shadow-none font-weight-bold"
                                                                            onClick={() =>
                                                                                this.handleRemoveOptionFields(
                                                                                    index
                                                                                )
                                                                            }
                                                                        >
                                                                            -
                                                                        </button>
                                                                    </div>
                                                                </div>
                                                                <div className="col-2 mb-2">
                                                                    <p
                                                                        className={`mb-0 text-right ${
                                                                            options.correct
                                                                                ? "text-success"
                                                                                : "text-muted"
                                                                        }`}
                                                                        onClick={() =>
                                                                            this.correctOption(
                                                                                index
                                                                            )
                                                                        }
                                                                        style={{
                                                                            cursor: "pointer",
                                                                        }}
                                                                    >
                                                                        <i className="fas fa-check-circle"></i>
                                                                    </p>
                                                                </div>
                                                            </Fragment>
                                                        )
                                                    )}
                                                    {data[
                                                        this.state
                                                            .activeQuestion
                                                    ].content.options.length <
                                                    this.option_limit ? (
                                                        <div className="form-group col-12 mb-0">
                                                            <button
                                                                className="btn btn-light btn-block border-secondary btn-sm"
                                                                onClick={
                                                                    this
                                                                        .handleAddOptionFields
                                                                }
                                                            >
                                                                Add +
                                                            </button>
                                                        </div>
                                                    ) : (
                                                        ""
                                                    )}
                                                </div>
                                            ) : data[this.state.activeQuestion]
                                                  .content.fill_in ? (
                                                // Fill in answers
                                                <div className="form-group row">
                                                    {data[
                                                        this.state
                                                            .activeQuestion
                                                    ].content.fillin_answer.map(
                                                        (answer, index) => (
                                                            <Fragment
                                                                key={index}
                                                            >
                                                                <div className="col-12 mb-2">
                                                                    <div
                                                                        className="input-group border-secondary"
                                                                        style={{
                                                                            borderRadius:
                                                                                "6px",
                                                                        }}
                                                                    >
                                                                        <input
                                                                            type="text"
                                                                            className="form-control form-control-sm"
                                                                            id={`answer${index}`}
                                                                            name="answer"
                                                                            placeholder={`Answer 0${
                                                                                index +
                                                                                1
                                                                            }`}
                                                                            value={
                                                                                answer
                                                                            }
                                                                            onChange={(
                                                                                event
                                                                            ) =>
                                                                                this.handleAnswerChange(
                                                                                    index,
                                                                                    event
                                                                                )
                                                                            }
                                                                            autoComplete="off"
                                                                            required
                                                                        />
                                                                        <div className="input-group-append">
                                                                            <div
                                                                                className="btn-group"
                                                                                role="group"
                                                                                aria-label="Basic example"
                                                                            >
                                                                                <button
                                                                                    type="button"
                                                                                    className="btn btn-light btn-sm shadow-none font-weight-bold"
                                                                                    onClick={() =>
                                                                                        this.handleRemoveAnswerFields(
                                                                                            index
                                                                                        )
                                                                                    }
                                                                                >
                                                                                    -
                                                                                </button>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </Fragment>
                                                        )
                                                    )}
                                                    <div className="form-group col-12 mb-0">
                                                        <button
                                                            className="btn btn-light btn-block border-secondary btn-sm"
                                                            onClick={
                                                                this
                                                                    .handleAddAnswerFields
                                                            }
                                                        >
                                                            Add +
                                                        </button>
                                                    </div>
                                                </div>
                                            ) : data[this.state.activeQuestion]
                                                  .content.boolean ? (
                                                // true or false
                                                <div className="form-group row align-items-center">
                                                    {data[
                                                        this.state
                                                            .activeQuestion
                                                    ].content.boolean_question.map(
                                                        (boolean, index) => (
                                                            <Fragment
                                                                key={index}
                                                            >
                                                                <div className="col-10 mb-2 pr-0">
                                                                    <input
                                                                        type="text"
                                                                        className="form-control form-control-sm border-secondary"
                                                                        id={`option${index}`}
                                                                        name="option"
                                                                        placeholder={`Option 0${
                                                                            index +
                                                                            1
                                                                        }`}
                                                                        value={
                                                                            boolean.content
                                                                        }
                                                                        disabled
                                                                        autoComplete="off"
                                                                        required
                                                                    />
                                                                </div>
                                                                <div className="col-2 mb-2">
                                                                    <p
                                                                        className={`mb-0 text-right ${
                                                                            boolean.correct
                                                                                ? "text-success"
                                                                                : "text-muted"
                                                                        }`}
                                                                        onClick={() =>
                                                                            this.correctBoolean(
                                                                                index
                                                                            )
                                                                        }
                                                                        style={{
                                                                            cursor: "pointer",
                                                                        }}
                                                                    >
                                                                        <i className="fas fa-check-circle"></i>
                                                                    </p>
                                                                </div>
                                                            </Fragment>
                                                        )
                                                    )}
                                                </div>
                                            ) : (
                                                ""
                                            )}

                                            {/* ---------- Explanation ---------- */}
                                            <div className="form-group">
                                                <label>Explanation</label>
                                                <CKeditor
                                                    data={
                                                        data[
                                                            this.state
                                                                .activeQuestion
                                                        ].content.explanation
                                                    }
                                                    onChange={
                                                        this.handleExplanation
                                                    }
                                                />
                                            </div>
                                        </Card.Body>
                                    </Accordion.Collapse>
                                </Card>

                                {/* ---------- Image | Video | Audio ---------- */}
                                <Card className="shadow-sm mb-2">
                                    <Accordion.Toggle
                                        as={Card.Body}
                                        variant="link"
                                        eventKey="1"
                                        className="text-dark"
                                        style={{ cursor: "default" }}
                                        onClick={() =>
                                            this.toggleCollapse("files")
                                        }
                                    >
                                        <div className="d-flex justify-content-between align-items-center">
                                            Image | Video | Audio
                                            {this.state.filesCollapsed ? (
                                                <i className="fas fa-angle-right "></i>
                                            ) : (
                                                <i className="fas fa-angle-down "></i>
                                            )}
                                        </div>
                                    </Accordion.Toggle>

                                    <Accordion.Collapse eventKey="1">
                                        <Card.Body className="p-3">
                                            {/* ---------- Image ---------- */}
                                            <div className="form-group">
                                                <div className="row align-items-center mb-2">
                                                    <div className="col-md-6">
                                                        <p className="mb-0">
                                                            Image
                                                        </p>
                                                    </div>
                                                    <div className="col-md-6 text-right">
                                                        <button
                                                            className="btn btn-link btn-sm shadow-none"
                                                            onClick={
                                                                this.clearImages
                                                            }
                                                        >
                                                            Clear
                                                        </button>
                                                    </div>
                                                </div>
                                                {data[
                                                    this.state.activeQuestion
                                                ].content.images.map(
                                                    (options, image_index) => (
                                                        <Fragment
                                                            key={image_index}
                                                        >
                                                            <div
                                                                className="input-group border-secondary mb-1"
                                                                style={{
                                                                    borderRadius:
                                                                        "6px",
                                                                }}
                                                            >
                                                                <input
                                                                    type="text"
                                                                    className="form-control form-control-sm"
                                                                    id={`image${image_index}`}
                                                                    name="image"
                                                                    placeholder={`Image title 0${
                                                                        image_index +
                                                                        1
                                                                    }`}
                                                                    value={
                                                                        options.title
                                                                    }
                                                                    onChange={(
                                                                        event
                                                                    ) =>
                                                                        this.handleImageTitle(
                                                                            image_index,
                                                                            event
                                                                        )
                                                                    }
                                                                    autoComplete="off"
                                                                />
                                                                <div className="input-group-append">
                                                                    <div
                                                                        className="btn-group"
                                                                        role="group"
                                                                        aria-label="Basic example"
                                                                    >
                                                                        <button
                                                                            type="button"
                                                                            className="btn btn-light btn-sm shadow-none"
                                                                            onClick={() =>
                                                                                this.handleDeleteImages(
                                                                                    image_index
                                                                                )
                                                                            }
                                                                        >
                                                                            <i className="fas fa-times fa-sm"></i>
                                                                        </button>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            <div className="custom-file mb-2">
                                                                <input
                                                                    type="file"
                                                                    className="custom-file-input"
                                                                    id={`file${image_index}`}
                                                                    accept="image/*"
                                                                    aria-describedby="inputGroupFileAddon01"
                                                                    onChange={(
                                                                        event
                                                                    ) =>
                                                                        this.handleImageFile(
                                                                            image_index,
                                                                            event
                                                                        )
                                                                    }
                                                                    disabled={
                                                                        options.file_name !==
                                                                            "" ||
                                                                        options.path !==
                                                                            ""
                                                                            ? true
                                                                            : false
                                                                    }
                                                                />
                                                                <label
                                                                    className="custom-file-label"
                                                                    htmlFor={`file${image_index}`}
                                                                >
                                                                    {options.file_name
                                                                        ? options.file_name
                                                                        : options.path
                                                                        ? options.path
                                                                        : "Choose file"}
                                                                </label>
                                                            </div>
                                                        </Fragment>
                                                    )
                                                )}
                                                <small
                                                    className="form-text text-muted mb-2"
                                                    style={{
                                                        marginTop: "-8px",
                                                    }}
                                                >
                                                    Select only .png .jpg .jpeg
                                                    .webp
                                                </small>
                                            </div>

                                            {/* ---------- Video ---------- */}

                                            <div className="form-group">
                                                <div className="row align-items-center mb-2">
                                                    <div className="col-md-6">
                                                        <p className="mb-0">
                                                            Video
                                                        </p>
                                                    </div>
                                                    <div className="col-md-6 text-right">
                                                        <button
                                                            className="btn btn-link btn-sm shadow-none"
                                                            onClick={
                                                                this.clearVideo
                                                            }
                                                        >
                                                            Clear
                                                        </button>
                                                    </div>
                                                </div>
                                                <input
                                                    type="text"
                                                    name="video"
                                                    id="video"
                                                    placeholder="Video title"
                                                    className="form-control form-control-sm border-secondary mb-1"
                                                    value={
                                                        data[
                                                            this.state
                                                                .activeQuestion
                                                        ].content.video.title
                                                    }
                                                    onChange={
                                                        this.handleVideoTitle
                                                    }
                                                    autoComplete="off"
                                                />
                                                <div className="custom-file mb-2">
                                                    <input
                                                        type="file"
                                                        className="custom-file-input"
                                                        id="video"
                                                        accept="video/*"
                                                        aria-describedby="inputGroupFileAddon01"
                                                        onChange={(event) =>
                                                            this.handleVideoFile(
                                                                event
                                                            )
                                                        }
                                                        disabled={
                                                            data[
                                                                this.state
                                                                    .activeQuestion
                                                            ].content.video
                                                                .file_name !==
                                                                "" ||
                                                            data[
                                                                this.state
                                                                    .activeQuestion
                                                            ].content.video
                                                                .path !== "" ||
                                                            data[
                                                                this.state
                                                                    .activeQuestion
                                                            ].content.video
                                                                .url !== ""
                                                                ? true
                                                                : false
                                                        }
                                                    />
                                                    <label
                                                        className="custom-file-label"
                                                        htmlFor="video"
                                                    >
                                                        {data[
                                                            this.state
                                                                .activeQuestion
                                                        ].content.video
                                                            .file_name === ""
                                                            ? "Choose file"
                                                            : data[
                                                                  this.state
                                                                      .activeQuestion
                                                              ].content.video
                                                                  .file_name}
                                                    </label>
                                                </div>
                                                <small
                                                    className="form-text text-muted mb-2"
                                                    style={{
                                                        marginTop: "-8px",
                                                    }}
                                                >
                                                    Select only .mpeg .flv .avi
                                                    .mov .mp4 .mkv
                                                </small>

                                                <p className="text-center small font-weight-bold mb-2">
                                                    Or
                                                </p>
                                                <input
                                                    type="url"
                                                    name="video"
                                                    placeholder="Paste URL"
                                                    className="form-control form-control-sm border-secondary mb-1"
                                                    onChange={(event) =>
                                                        this.handleVideoUrl(
                                                            event
                                                        )
                                                    }
                                                    value={
                                                        data[
                                                            this.state
                                                                .activeQuestion
                                                        ].content.video.url
                                                    }
                                                    disabled={
                                                        data[
                                                            this.state
                                                                .activeQuestion
                                                        ].content.video
                                                            .file_name !== "" ||
                                                        data[
                                                            this.state
                                                                .activeQuestion
                                                        ].content.video.path !==
                                                            ""
                                                            ? true
                                                            : false
                                                    }
                                                    autoComplete="off"
                                                />
                                                <small className="form-text text-muted mb-2">
                                                    Only https supported video
                                                </small>
                                            </div>

                                            {/* ---------- Audio ---------- */}

                                            <div className="form-group">
                                                <div className="row align-items-center mb-2">
                                                    <div className="col-md-6">
                                                        <p className="mb-0">
                                                            Audio
                                                        </p>
                                                    </div>
                                                    <div className="col-md-6 text-right">
                                                        <button
                                                            className="btn btn-link btn-sm shadow-none"
                                                            onClick={
                                                                this.clearAudios
                                                            }
                                                        >
                                                            Clear
                                                        </button>
                                                    </div>
                                                </div>
                                                {data[
                                                    this.state.activeQuestion
                                                ].content.audio.map(
                                                    (options, audio_index) => (
                                                        <Fragment
                                                            key={audio_index}
                                                        >
                                                            <div
                                                                className="input-group border-secondary mb-1"
                                                                style={{
                                                                    borderRadius:
                                                                        "6px",
                                                                }}
                                                            >
                                                                <input
                                                                    type="text"
                                                                    className="form-control form-control-sm"
                                                                    id={`audio${audio_index}`}
                                                                    name="audio"
                                                                    placeholder={`Audio title 0${
                                                                        audio_index +
                                                                        1
                                                                    }`}
                                                                    value={
                                                                        options.title
                                                                    }
                                                                    onChange={(
                                                                        event
                                                                    ) =>
                                                                        this.handleAudioTitle(
                                                                            audio_index,
                                                                            event
                                                                        )
                                                                    }
                                                                    autoComplete="off"
                                                                />
                                                                <div className="input-group-append">
                                                                    <div
                                                                        className="btn-group"
                                                                        role="group"
                                                                        aria-label="Basic example"
                                                                    >
                                                                        <button
                                                                            type="button"
                                                                            className="btn btn-light btn-sm shadow-none"
                                                                            onClick={() =>
                                                                                this.handleDeleteAudio(
                                                                                    audio_index
                                                                                )
                                                                            }
                                                                        >
                                                                            <i className="fas fa-times fa-sm"></i>
                                                                        </button>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            <div className="custom-file mb-2">
                                                                <input
                                                                    type="file"
                                                                    className="custom-file-input"
                                                                    id={`audio${audio_index}`}
                                                                    accept="audio/*"
                                                                    aria-describedby="inputGroupFileAddon01"
                                                                    onChange={(
                                                                        event
                                                                    ) =>
                                                                        this.handleAudioFile(
                                                                            audio_index,
                                                                            event
                                                                        )
                                                                    }
                                                                    disabled={
                                                                        options.file_name !==
                                                                            "" ||
                                                                        options.path !==
                                                                            ""
                                                                            ? true
                                                                            : false
                                                                    }
                                                                />
                                                                <label
                                                                    className="custom-file-label"
                                                                    htmlFor={`audio${audio_index}`}
                                                                >
                                                                    {options.file_name
                                                                        ? options.file_name
                                                                        : options.path
                                                                        ? options.path
                                                                        : "Choose file"}
                                                                </label>
                                                            </div>
                                                        </Fragment>
                                                    )
                                                )}
                                                <small
                                                    className="form-text text-muted mb-2"
                                                    style={{
                                                        marginTop: "-8px",
                                                    }}
                                                >
                                                    Select only .wav .mp3
                                                </small>
                                            </div>
                                        </Card.Body>
                                    </Accordion.Collapse>
                                </Card>

                                {/* ---------- Properties ---------- */}
                                <Card className="shadow-sm mb-2">
                                    <Accordion.Toggle
                                        as={Card.Body}
                                        variant="link"
                                        eventKey="2"
                                        className="text-dark"
                                        style={{ cursor: "default" }}
                                        onClick={() =>
                                            this.toggleCollapse("properties")
                                        }
                                    >
                                        <div className="d-flex justify-content-between align-items-center">
                                            Properties
                                            {this.state.propertiesCollapsed ? (
                                                <i className="fas fa-angle-right "></i>
                                            ) : (
                                                <i className="fas fa-angle-down "></i>
                                            )}
                                        </div>
                                    </Accordion.Toggle>

                                    <Accordion.Collapse eventKey="2">
                                        <Card.Body className="p-3">
                                            {/* ---------- Marks ---------- */}
                                            <div className="form-group row align-items-center">
                                                <div className="col-4 small">
                                                    Marks
                                                </div>
                                                <div className="col-8">
                                                    <input
                                                        type="text"
                                                        className="form-control form-control-sm border-secondary"
                                                        value={
                                                            data[
                                                                this.state
                                                                    .activeQuestion
                                                            ].properties.marks
                                                        }
                                                        onChange={(event) =>
                                                            this.handleProperties(
                                                                event,
                                                                "marks"
                                                            )
                                                        }
                                                        autoComplete="off"
                                                    />
                                                </div>
                                            </div>

                                            {/* ---------- Complexity ---------- */}
                                            <div className="form-group row align-items-center">
                                                <div className="col-4 small">
                                                    Complexity
                                                </div>
                                                <div className="col-8">
                                                    <select
                                                        name="complexity"
                                                        id="complexity"
                                                        className="form-control form-control-sm border-secondary"
                                                        onChange={(event) =>
                                                            this.handleProperties(
                                                                event,
                                                                "complexity"
                                                            )
                                                        }
                                                        value={
                                                            data[
                                                                this.state
                                                                    .activeQuestion
                                                            ].properties
                                                                .complexity
                                                        }
                                                    >
                                                        <option value="">
                                                            Select option
                                                        </option>
                                                        {this.state.complexityData.map(
                                                            (option, index) => {
                                                                return (
                                                                    <option
                                                                        value={
                                                                            option
                                                                        }
                                                                        key={
                                                                            index
                                                                        }
                                                                    >
                                                                        {option}
                                                                    </option>
                                                                );
                                                            }
                                                        )}
                                                    </select>
                                                </div>
                                            </div>

                                            {/* ---------- Priority ---------- */}
                                            <div className="form-group row align-items-center">
                                                <div className="col-4 small">
                                                    Priority
                                                </div>
                                                <div className="col-8">
                                                    <input
                                                        type="text"
                                                        className="form-control form-control-sm border-secondary"
                                                        value={
                                                            data[
                                                                this.state
                                                                    .activeQuestion
                                                            ].properties
                                                                .priority
                                                        }
                                                        onChange={(event) =>
                                                            this.handleProperties(
                                                                event,
                                                                "priority"
                                                            )
                                                        }
                                                        autoComplete="off"
                                                    />
                                                </div>
                                            </div>

                                            {/* ---------- Theme ---------- */}
                                            <div className="form-group row align-items-center">
                                                <div className="col-4 small">
                                                    Theme
                                                </div>
                                                <div className="col-8">
                                                    <select
                                                        name="theme"
                                                        id="theme"
                                                        className="form-control form-control-sm border-secondary"
                                                        onChange={(event) =>
                                                            this.handleProperties(
                                                                event,
                                                                "theme"
                                                            )
                                                        }
                                                        value={
                                                            data[
                                                                this.state
                                                                    .activeQuestion
                                                            ].properties.theme
                                                        }
                                                    >
                                                        <option value="">
                                                            Select option
                                                        </option>
                                                        {this.state.themeData.map(
                                                            (option, index) => {
                                                                return (
                                                                    <option
                                                                        value={
                                                                            option
                                                                        }
                                                                        key={
                                                                            index
                                                                        }
                                                                    >
                                                                        {option}
                                                                    </option>
                                                                );
                                                            }
                                                        )}
                                                    </select>
                                                </div>
                                            </div>

                                            {/* ---------- Attempt sequence ---------- */}
                                            <div className="form-group ">
                                                <p className="mb-2">
                                                    Attempt Sequence
                                                </p>
                                                <div className="row align-items-center">
                                                    <div className="col-7 pr-0">
                                                        <div className="card bg-light card-body p-2">
                                                            <div className="card card-body bg-white p-1 px-2 mb-2">
                                                                <div className="d-flex justify-content-between">
                                                                    {data[
                                                                        this
                                                                            .state
                                                                            .activeQuestion
                                                                    ].properties.test.map(
                                                                        (
                                                                            options,
                                                                            index
                                                                        ) => {
                                                                            return (
                                                                                <input
                                                                                    type="checkbox"
                                                                                    key={
                                                                                        index
                                                                                    }
                                                                                    checked={
                                                                                        options
                                                                                    }
                                                                                    onChange={() =>
                                                                                        this.handleAttemptSequence(
                                                                                            index,
                                                                                            "test"
                                                                                        )
                                                                                    }
                                                                                />
                                                                            );
                                                                        }
                                                                    )}
                                                                </div>
                                                            </div>
                                                            <div className="card card-body bg-white p-1 px-2 mb-2">
                                                                <div className="d-flex justify-content-between">
                                                                    {data[
                                                                        this
                                                                            .state
                                                                            .activeQuestion
                                                                    ].properties.semester.map(
                                                                        (
                                                                            options,
                                                                            index
                                                                        ) => {
                                                                            return (
                                                                                <input
                                                                                    type="checkbox"
                                                                                    key={
                                                                                        index
                                                                                    }
                                                                                    checked={
                                                                                        options
                                                                                    }
                                                                                    onChange={() =>
                                                                                        this.handleAttemptSequence(
                                                                                            index,
                                                                                            "semester"
                                                                                        )
                                                                                    }
                                                                                />
                                                                            );
                                                                        }
                                                                    )}
                                                                </div>
                                                            </div>
                                                            <div className="card card-body bg-white p-1 px-2">
                                                                <div className="d-flex justify-content-between">
                                                                    {data[
                                                                        this
                                                                            .state
                                                                            .activeQuestion
                                                                    ].properties.quiz.map(
                                                                        (
                                                                            options,
                                                                            index
                                                                        ) => {
                                                                            return (
                                                                                <input
                                                                                    type="checkbox"
                                                                                    key={
                                                                                        index
                                                                                    }
                                                                                    checked={
                                                                                        options
                                                                                    }
                                                                                    onChange={() =>
                                                                                        this.handleAttemptSequence(
                                                                                            index,
                                                                                            "quiz"
                                                                                        )
                                                                                    }
                                                                                />
                                                                            );
                                                                        }
                                                                    )}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="col-5 pl-0">
                                                        <div className="card card-body p-2">
                                                            <div className="card-body p-1 px-2 mb-1 small">
                                                                Test
                                                            </div>
                                                            <div className="card-body p-1 px-2 mb-1 small">
                                                                Semester
                                                            </div>
                                                            <div className="card-body p-1 px-2 small">
                                                                Quiz
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="form-group">
                                                <div className="row">
                                                    <div className="col-md-6">
                                                        <div className="d-flex align-items-center">
                                                            <span className="mr-4">
                                                                Learn
                                                            </span>
                                                            <ReactSwitch
                                                                onChange={
                                                                    this
                                                                        .handleLearn
                                                                }
                                                                checked={
                                                                    data[
                                                                        this
                                                                            .state
                                                                            .activeQuestion
                                                                    ].properties
                                                                        .learn
                                                                }
                                                            />
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </Card.Body>
                                    </Accordion.Collapse>
                                </Card>

                                {/* ---------- Settings ---------- */}
                                {!this.groupId ? (
                                    <Card className="shadow-sm mb-2">
                                        <Accordion.Toggle
                                            as={Card.Body}
                                            variant="link"
                                            eventKey="3"
                                            className="text-dark"
                                            style={{ cursor: "default" }}
                                            onClick={this.toggleCollapse}
                                        >
                                            <div className="d-flex justify-content-between align-items-center">
                                                Settings
                                                {this.state
                                                    .settingsCollapsed ? (
                                                    <i className="fas fa-angle-right "></i>
                                                ) : (
                                                    <i className="fas fa-angle-down "></i>
                                                )}
                                            </div>
                                        </Accordion.Toggle>

                                        <Accordion.Collapse eventKey="3">
                                            <Card.Body className="p-3">
                                                {/* ---------- Limited ---------- */}
                                                <div className="form-group">
                                                    <div className="row">
                                                        <div className="col-md-6">
                                                            <div className="d-flex align-items-center">
                                                                <span className="mr-4">
                                                                    Limited
                                                                </span>
                                                                <ReactSwitch
                                                                    onChange={
                                                                        this
                                                                            .handleLimited
                                                                    }
                                                                    checked={
                                                                        data[
                                                                            this
                                                                                .state
                                                                                .activeQuestion
                                                                        ]
                                                                            .settings
                                                                            .limited
                                                                    }
                                                                />
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </Card.Body>
                                        </Accordion.Collapse>
                                    </Card>
                                ) : (
                                    ""
                                )}
                            </Accordion>
                        </div>
                    ) : (
                        ""
                    )}
                </div>

                {/* Loading component */}
                {this.state.page_loading ? <Loading /> : ""}
            </Wrapper>
        );
    }
}

export default connect(mapStateToProps)(TeacherType1);
