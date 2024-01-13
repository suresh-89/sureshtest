import React, { Component, Fragment } from "react";
import Wrapper from "../wrapper";
import { connect } from "react-redux";
import axios from "axios";
import { Link } from "react-router-dom";
import Select from "react-select";
import CKeditor, { OptionEditor } from "../../common/CKEditor";
import { Accordion, Card, OverlayTrigger, Tooltip } from "react-bootstrap";
import { baseUrl, hodUrl } from "../../../shared/baseUrl.js";
import Loading from "../../common/loader";
import AlertBox from "../../common/alert";
import { SingleContentDeleteModal } from "../../common/modal/contentManagementModal";
import Lightbox from "react-awesome-lightbox";
import "react-awesome-lightbox/build/style.css";

const mapStateToProps = (state) => ({
    subject_name: state.content.subject_name,
    simulation_name: state.content.simulation_name,
    paper_name: state.content.paper_name,
    section_name: state.content.section_name,
    temp: state.storage.temp,
});

class HODSimulationType1 extends Component {
    constructor(props) {
        super(props);
        this.state = {
            showMCQDelete_Modal: false,

            errorMsg: "",
            successMsg: "",
            showErrorAlert: false,
            showSuccessAlert: false,
            page_loading: true,

            contentCollapsed: true,
            filesCollapsed: true,
            propertiesCollapsed: true,
            showEdit_option: false,

            activeQuestion: "",
            selectedQuestion: "",

            selectedImageData: [],
            startIndex: 0,
            isLightBoxOpen: false,

            chapterData: [],
            questions: [
                {
                    question_random_id: "",
                    question: "<p>Question goes here</p>",
                    pair_question_id: "NOPAIR",
                    is_file_uploaded: false,
                    content: {
                        explanation: "<p>Explanation goes here</p>",
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
                        images: [
                            { title: "", file_name: "", image: null, path: "" },
                            { title: "", file_name: "", image: null, path: "" },
                            { title: "", file_name: "", image: null, path: "" },
                            { title: "", file_name: "", image: null, path: "" },
                        ],
                    },
                    properties: {
                        chapter_id: "",
                    },
                },
            ],
            totalQuestion: 0,
        };
        this.option_limit = 6;
        this.subjectId = this.props.match.params.subjectId;
        this.simulationId = this.props.match.params.simulationId;
        this.paperId = this.props.match.params.paperId;
        this.sectionId = this.props.match.params.sectionId;
        this.url = baseUrl + hodUrl;
        this.authToken = localStorage.getItem("Authorization");
        this.headers = {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: this.authToken,
        };
        this.section = this.props.temp;
    }

    // -------------------------- Question data loading --------------------------

    loadMCQData = async () => {
        await fetch(
            `${this.url}/hod/subject/${this.subjectId}/simulation/${this.simulationId}/paper/${this.paperId}/type_one/?section_id=${this.sectionId}`,
            {
                headers: this.headers,
                method: "GET",
            }
        )
            .then((res) => res.json())
            .then((result) => {
                if (result.sts === true) {
                    let data = [];
                    let response = result.data;
                    if (response.length !== 0) {
                        let questionResponse = this.loopQuestionData(
                            data,
                            response
                        );
                        let question = questionResponse.question;
                        let temp = [],
                            totalQuestion = 0;

                        // pairing questions
                        for (let i = 0; i < question.length; i++) {
                            question[i]["index"] = i + 1;
                            temp.push(question[i]);
                            for (let j = 0; j < question.length; j++) {
                                if (
                                    question[i].question_random_id ===
                                    question[j].pair_question_id
                                ) {
                                    temp[temp.length - 1].index = `${i + 1}A`;
                                    question[j]["index"] = `${i + 1}B`;
                                    temp.push(question[j]);
                                    question.splice(j, 1);
                                }
                            }
                            totalQuestion++;
                        }

                        this.setState({
                            questions: temp,
                            totalQuestion,
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

    loopQuestionData = (data, response) => {
        let imgArr = [];
        for (let i = 0; i < response.length; i++) {
            imgArr = [];
            if (
                response[i].files &&
                Object.entries(response[i].files).length !== 0
            ) {
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
            }

            data.push({
                question: response[i].question,
                question_random_id: response[i].question_random_id,
                pair_question_id: response[i].pair_question_id,
                is_file_uploaded:
                    Object.entries(response[i].files).length !== 0
                        ? true
                        : false,
                content: {
                    explanation: response[i].explanation,
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
                },
                properties: {
                    chapter_id: response[i].properties.chapter_id,
                },
            });
        }

        return {
            question: data,
        };
    };

    // -------------------------- Lifecycle --------------------------

    componentDidMount = () => {
        document.title = `${this.props.section_name} - HOD | IQLabs`;

        fetch(
            `${this.url}/hod/subject/${this.subjectId}/simulation/${this.simulationId}/paper/${this.paperId}/filters/`,
            {
                headers: this.headers,
                method: "GET",
            }
        )
            .then((res) => res.json())
            .then((result) => {
                if (result.sts === true) {
                    this.setState({
                        chapterData: result.data.chapter_data,
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

        let option_correct = this.section.category === "MCQ" ? false : true;
        let option_content = this.section.category === "MCQ" ? false : true;
        let fill_in = this.section.category === "Fill In" ? false : true;
        let boolean_correct =
            this.section.category === "True or False" ? false : true;

        // Options validation
        if (this.section.category === "MCQ") {
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
        if (this.section.category === "Fill In") {
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
        if (this.section.category === "True or False") {
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
        } else if (
            data[this.state.activeQuestion].properties.chapter_id === ""
        ) {
            this.setState({
                errorMsg: "Select chapter property",
                showErrorAlert: true,
                page_loading: false,
            });
        } else {
            let form_data = new FormData();

            let content = {};

            if (this.section.category === "MCQ") {
                content["options"] =
                    data[this.state.activeQuestion].content.options;
            } else if (this.section.category === "Fill In") {
                content["fillin_answer"] =
                    data[this.state.activeQuestion].content.fillin_answer;
            } else if (this.section.category === "True or False") {
                content["boolean_question"] =
                    data[this.state.activeQuestion].content.boolean_question;
            }

            form_data.append(
                "question",
                JSON.stringify({
                    question: {
                        question: data[this.state.activeQuestion].question,
                        explanation:
                            data[this.state.activeQuestion].content.explanation,
                        content: content,
                        properties: {
                            chapter_id:
                                data[this.state.activeQuestion].properties
                                    .chapter_id,
                        },
                    },
                })
            );

            form_data.append("section_id", this.sectionId);
            form_data.append(
                "pair_question_id",
                data[this.state.activeQuestion].pair_question_id
            );

            // Image
            for (
                let i = 0;
                i < data[this.state.activeQuestion].content.images.length;
                i++
            ) {
                if (
                    data[this.state.activeQuestion].content.images[i].image !==
                    null
                ) {
                    form_data.append(
                        `type1_image_${i + 1}_title`,
                        data[this.state.activeQuestion].content.images[i].title
                    );
                    form_data.append(
                        `type1_image_${i + 1}`,
                        data[this.state.activeQuestion].content.images[i].image
                    );
                } else {
                    continue;
                }
            }

            if (data[this.state.activeQuestion].question_random_id === "") {
                this.handlePOST(form_data);
            } else {
                this.handlePUT(form_data);
            }
        }
    };

    handlePOST = (data) => {
        const options = {
            headers: {
                Accept: "application/json",
                "Content-Type": "multipart/form-data",
                Authorization: this.authToken,
            },
        };

        axios
            .post(
                `${this.url}/hod/subject/${this.subjectId}/simulation/${this.simulationId}/paper/${this.paperId}/type_one/`,
                data,
                options
            )
            .then((result) => {
                if (result.data.sts === true) {
                    this.setState(
                        {
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
                                activeQuestion: "",
                            });
                            this.loadMCQData();
                        }
                    );
                } else {
                    this.setState({
                        errorMsg: result.data.msg ? result.data.msg : "",
                        showErrorAlert: true,
                        page_loading: false,
                    });
                }
            })
            .catch((err) => {
                console.warn(err);
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

    handlePUT = (data) => {
        const options = {
            headers: {
                Accept: "application/json",
                "Content-Type": "multipart/form-data",
                Authorization: this.authToken,
            },
        };
        const question = [...this.state.questions];
        data.append(
            "question_random_id",
            question[this.state.activeQuestion].question_random_id
        );

        axios
            .put(
                `${this.url}/hod/subject/${this.subjectId}/simulation/${this.simulationId}/paper/${this.paperId}/type_one/`,
                data,
                options
            )
            .then((result) => {
                if (result.data.sts === true) {
                    this.setState(
                        {
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
                console.warn(err);
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
                section_id: this.sectionId,
                question_random_id:
                    values[this.state.activeQuestion].question_random_id,
                full_delete: false,
            };
            body[`type1_image_${index + 1}_title`] =
                values[this.state.activeQuestion].content.images[index].title ||
                "title";

            fetch(
                `${this.url}/hod/subject/${this.subjectId}/simulation/${this.simulationId}/paper/${this.paperId}/type_one/`,
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

    // -------------------------- Properties --------------------------

    handleProperties = (event) => {
        let values = [...this.state.questions];
        values[this.state.activeQuestion].properties.chapter_id = event.value;

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
        }
    };

    // -------------------------- Adding, Removing, Deleting question --------------------------

    handleAdd = () => {
        const values = [...this.state.questions];
        values.push({
            question: "<p>Question goes here</p>",
            question_random_id: "",
            pair_question_id: "NOPAIR",
            is_file_uploaded: false,
            content: {
                explanation: "<p>Explanation goes here</p>",
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
                images: [
                    { title: "", file_name: "", image: null, path: "" },
                    { title: "", file_name: "", image: null, path: "" },
                    { title: "", file_name: "", image: null, path: "" },
                    { title: "", file_name: "", image: null, path: "" },
                ],
            },
            properties: {
                chapter_id: "",
            },
        });
        this.setState({
            questions: values,
            activeQuestion: values.length - 1,
        });
    };

    handleCopy = async (index) => {
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
        values.push({
            question: values[index].question,
            question_random_id: "",
            pair_question_id: "NOPAIR",
            is_file_uploaded: false,
            content: {
                explanation: values[index].content.explanation,
                fillin_answer: fillin,
                boolean_question: boolean,
                options: options,
                images: [
                    { title: "", file_name: "", image: null, path: "" },
                    { title: "", file_name: "", image: null, path: "" },
                    { title: "", file_name: "", image: null, path: "" },
                    { title: "", file_name: "", image: null, path: "" },
                ],
            },
            properties: {
                chapter_id: values[index].properties.chapter_id,
            },
        });
        await this.setState({
            questions: values,
            activeQuestion: values.length,
        });
        window.MathJax.typeset();
    };

    handleEdit = (index) => {
        this.setState({
            showEdit_option: true,
            activeQuestion: index,
            showErrorAlert: false,
            showSuccessAlert: false,
        });
    };

    handleDelete = (index) => {
        const values = [...this.state.questions];
        this.setState({
            showEdit_option: false,
            contentCollapsed: true,
            filesCollapsed: true,
            propertiesCollapsed: true,
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
                            question: "<p>Question goes here</p>",
                            question_random_id: "",
                            pair_question_id: "NOPAIR",
                            is_file_uploaded: false,
                            content: {
                                explanation: "<p>Explanation goes here</p>",
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
                            },
                            properties: {
                                chapter_id: "",
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
                        question: "<p>Question goes here</p>",
                        question_random_id: "",
                        pair_question_id: "NOPAIR",
                        is_file_uploaded: false,
                        content: {
                            explanation: "<p>Explanation goes here</p>",
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
                        },
                        properties: {
                            chapter_id: "",
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

    // -------------------------- Pairing question --------------------------

    handlePair = (question, index) => {
        let values = [...this.state.questions];
        values.splice(index + 1, 0, {
            question: "<p>Question goes here</p>",
            question_random_id: "",
            pair_question_id: question.question_random_id,
            is_file_uploaded: false,
            content: {
                explanation: "<p>Explanation goes here</p>",
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
                images: [
                    { title: "", file_name: "", image: null, path: "" },
                    { title: "", file_name: "", image: null, path: "" },
                    { title: "", file_name: "", image: null, path: "" },
                    { title: "", file_name: "", image: null, path: "" },
                ],
            },
            properties: {
                chapter_id: "",
            },
        });
        this.setState({
            questions: values,
            activeQuestion: index + 1,
        });
    };

    // -------------------------- Image preview --------------------------

    changeImage = (images, path) => {
        let imageArr = [];
        let index = 0;
        this.setState({
            selectedImageData: [],
            startIndex: 0,
        });
        for (let i = 0; i < images.length; i++) {
            if (images[i].path !== "") {
                imageArr.push({
                    url: images[i].path,
                    title: images[i].title,
                });
            }
        }
        for (let i = 0; i < imageArr.length; i++) {
            if (imageArr[i].url === path) {
                index = i;
            } else {
                continue;
            }
        }
        this.setState({
            selectedImageData: imageArr,
            startIndex: index,
            isLightBoxOpen: true,
        });
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

                {/* MCQ Deletion Modal */}
                {this.state.showMCQDelete_Modal ? (
                    <SingleContentDeleteModal
                        show={this.state.showMCQDelete_Modal}
                        onHide={this.toggleDeleteModal}
                        formSubmission={this.handleMCQ_Deletion}
                        url={`${this.url}/hod/subject/${this.subjectId}/simulation/${this.simulationId}/paper/${this.paperId}/type_one/`}
                        type="question"
                        name=""
                        data={{
                            section_id: this.sectionId,
                            question_random_id: this.state.selectedQuestion,
                            full_delete: true,
                        }}
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
                                    <Link to="/hod">
                                        <i className="fas fa-home fa-sm"></i>
                                    </Link>
                                </li>
                                <li className="breadcrumb-item">
                                    <Link to={`/hod/subject/${this.subjectId}`}>
                                        {this.props.subject_name}
                                    </Link>
                                </li>
                                <li className="breadcrumb-item">
                                    <Link
                                        to={`/hod/subject/${this.subjectId}/simulation/${this.simulationId}`}
                                    >
                                        {this.props.simulation_name}
                                    </Link>
                                </li>
                                <li className="breadcrumb-item">
                                    <Link
                                        to="#"
                                        onClick={this.props.history.goBack}
                                    >
                                        {this.props.paper_name}
                                    </Link>
                                </li>
                                <li className="breadcrumb-item active">
                                    {this.props.section_name}
                                </li>
                            </ol>
                        </nav>

                        {/* Header area */}
                        <h5 className="primary-text mb-4">
                            Type 1 - {this.section.category}
                        </h5>

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
                                                    {question.index ? (
                                                        question.index
                                                    ) : (
                                                        <i className="fas fa-ellipsis-h"></i>
                                                    )}
                                                </button>
                                            </div>
                                            <div className="col-md-12 col-3 mb-1">
                                                <OverlayTrigger
                                                    key="right"
                                                    placement="right"
                                                    overlay={
                                                        <Tooltip id="tooltip">
                                                            Edit
                                                        </Tooltip>
                                                    }
                                                >
                                                    <button
                                                        type="button"
                                                        className="btn btn-light bg-white btn-block shadow-sm mr-2"
                                                        onClick={() =>
                                                            this.handleEdit(
                                                                q_index
                                                            )
                                                        }
                                                    >
                                                        <i className="far fa-edit fa-sm"></i>
                                                    </button>
                                                </OverlayTrigger>
                                            </div>
                                            <div className="col-md-12 col-3 mb-1">
                                                <OverlayTrigger
                                                    key="right"
                                                    placement="right"
                                                    overlay={
                                                        <Tooltip id="tooltip">
                                                            Copy
                                                        </Tooltip>
                                                    }
                                                >
                                                    <button
                                                        type="button"
                                                        className="btn btn-light bg-white btn-block shadow-sm mr-1"
                                                        onClick={() =>
                                                            this.handleCopy(
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
                                                </OverlayTrigger>
                                            </div>
                                            <div className="col-md-12 col-3 mb-1">
                                                <OverlayTrigger
                                                    key="right"
                                                    placement="right"
                                                    overlay={
                                                        <Tooltip id="tooltip">
                                                            Delete
                                                        </Tooltip>
                                                    }
                                                >
                                                    <button
                                                        type="button"
                                                        className="btn btn-light bg-white btn-block shadow-sm"
                                                        onClick={() =>
                                                            this.handleDelete(
                                                                q_index
                                                            )
                                                        }
                                                    >
                                                        <i className="far fa-trash-alt fa-sm"></i>
                                                    </button>
                                                </OverlayTrigger>
                                            </div>
                                            {question.pair_question_id ===
                                            "NOPAIR" ? (
                                                <div className="col-md-12 col-3">
                                                    <OverlayTrigger
                                                        key="right"
                                                        placement="right"
                                                        overlay={
                                                            <Tooltip id="tooltip">
                                                                Pair question
                                                            </Tooltip>
                                                        }
                                                    >
                                                        <button
                                                            type="button"
                                                            className="btn btn-light bg-white btn-block shadow-sm"
                                                            onClick={() =>
                                                                this.handlePair(
                                                                    question,
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
                                                            <i className="fas fa-plus fa-sm"></i>
                                                        </button>
                                                    </OverlayTrigger>
                                                </div>
                                            ) : (
                                                ""
                                            )}
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
                                                <div className="d-flex">
                                                    {/* Questions & options */}
                                                    <div className="w-100">
                                                        <div
                                                            className="pb-2"
                                                            dangerouslySetInnerHTML={{
                                                                __html: question.question,
                                                            }}
                                                        ></div>

                                                        {this.section
                                                            .category ===
                                                        "MCQ" ? (
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
                                                        {this.section
                                                            .category ===
                                                        "Fill In" ? (
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
                                                        {this.section
                                                            .category ===
                                                        "True or False" ? (
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
                                                    {/* ----- image preview ----- */}
                                                    {question.content.images[0]
                                                        .path !== "" ||
                                                    question.content.images[1]
                                                        .path !== "" ||
                                                    question.content.images[2]
                                                        .path !== "" ||
                                                    question.content.images[3]
                                                        .path !== "" ? (
                                                        <div className="ml-3">
                                                            {question.content.images.map(
                                                                (
                                                                    images,
                                                                    index
                                                                ) => {
                                                                    return images.path !==
                                                                        "" ? (
                                                                        <div
                                                                            key={
                                                                                index
                                                                            }
                                                                            className="card preview-img-circle shadow-sm"
                                                                            style={{
                                                                                backgroundImage: `url(${images.path})`,
                                                                            }}
                                                                            onClick={() =>
                                                                                this.changeImage(
                                                                                    question
                                                                                        .content
                                                                                        .images,
                                                                                    images.path
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
                                        </div>
                                    </div>
                                </div>
                            );
                        })}

                        <button
                            className="btn btn-primary btn-block shadow-none"
                            onClick={this.handleAdd}
                            disabled={
                                this.state.totalQuestion ===
                                this.section.total_questions
                                    ? true
                                    : false
                            }
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
                                            <label>Answers</label>
                                            {this.section.category === "MCQ" ? (
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
                                            ) : this.section.category ===
                                              "Fill In" ? (
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
                                            ) : this.section.category ===
                                              "True or False" ? (
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

                                {/* ---------- Image ---------- */}
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
                                            Image
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
                                            {/* ---------- Chapter selection ---------- */}
                                            <Select
                                                className="basic-single border-secondary"
                                                placeholder="Select chapter"
                                                isSearchable={true}
                                                name="chapter"
                                                id="chapter"
                                                value={this.state.chapterData.map(
                                                    (list) => {
                                                        return data[
                                                            this.state
                                                                .activeQuestion
                                                        ].properties
                                                            .chapter_id ===
                                                            list.chapter_id
                                                            ? {
                                                                  value: list.chapter_id,
                                                                  label: list.chapter_name,
                                                              }
                                                            : "";
                                                    }
                                                )}
                                                options={this.state.chapterData.map(
                                                    (list) => {
                                                        return {
                                                            value: list.chapter_id,
                                                            label: list.chapter_name,
                                                        };
                                                    }
                                                )}
                                                onChange={(event) =>
                                                    this.handleProperties(event)
                                                }
                                                required
                                            />
                                        </Card.Body>
                                    </Accordion.Collapse>
                                </Card>
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

export default connect(mapStateToProps)(HODSimulationType1);
