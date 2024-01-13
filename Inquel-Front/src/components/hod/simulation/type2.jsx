import React, { Component, Fragment } from "react";
import Wrapper from "../wrapper";
import { connect } from "react-redux";
import axios from "axios";
import { Link } from "react-router-dom";
import Select from "react-select";
import CKeditor, { OptionEditor } from "../../common/CKEditor";
import ReactSwitch from "../../common/switchComponent";
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

class HODSimulationType2 extends Component {
    constructor(props) {
        super(props);
        this.state = {
            showMCQDelete_Modal: false,
            showSubMCQDelete_Modal: false,

            errorMsg: "",
            successMsg: "",
            showErrorAlert: false,
            showSuccessAlert: false,
            page_loading: true,
            btnDisabled: false,

            showMainEdit_option: false,
            contentCollapsed: true,
            filesCollapsed: true,
            propertiesCollapsed: true,

            showSubEdit_option: false,
            subContentCollapsed: true,
            showVirtual_keyboard: true,

            activeQuestion: "",
            activeSubQuestion: "",
            selectedQuestion: "",
            selectedSubQuestion: "",
            selectedImageData: [],
            startIndex: 0,
            isLightBoxOpen: false,

            chapterData: [],
            questions: [
                {
                    question_random_id: "",
                    question: "<p>Main Question goes here</p>",
                    explanation: "<p>Explanation goes here</p>",
                    pair_question_id: "NOPAIR",
                    is_file_uploaded: false,
                    mcq: true,
                    fill_in: false,
                    sub_question: [
                        {
                            sub_question_id: "",
                            question: "<p>Sub question goes here</p>",
                            mcq: true,
                            fill_in: false,
                            fillin_answer: [""],
                            options: [
                                { correct: false, content: "" },
                                { correct: false, content: "" },
                                { correct: false, content: "" },
                                { correct: false, content: "" },
                            ],
                            marks: "",
                            negative_marks: "0",
                        },
                    ],
                    content: {
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
        this.sub_question_limit = 10;
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
            `${this.url}/hod/subject/${this.subjectId}/simulation/${this.simulationId}/paper/${this.paperId}/type_two/?section_id=${this.sectionId}`,
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
                        let questionData = this.loopQuestionData(
                            data,
                            response
                        );

                        let question = questionData.question;
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
        let images = [];
        let sub_question = [];
        for (let i = 0; i < response.length; i++) {
            images = [];
            sub_question = [];
            if (Object.entries(response[i].files).length !== 0) {
                // image
                images.push({
                    title: response[i].files.type2_image_1_title || "",
                    file_name: "",
                    image: null,
                    path: response[i].files.type2_image_1 || "",
                });
                images.push({
                    title: response[i].files.type2_image_2_title || "",
                    file_name: "",
                    image: null,
                    path: response[i].files.type2_image_2 || "",
                });
                images.push({
                    title: response[i].files.type2_image_3_title || "",
                    file_name: "",
                    image: null,
                    path: response[i].files.type2_image_3 || "",
                });
                images.push({
                    title: response[i].files.type2_image_4_title || "",
                    file_name: "",
                    image: null,
                    path: response[i].files.type2_image_4 || "",
                });
            }

            // Sub question
            for (let k = 0; k < response[i].sub_question.length; k++) {
                sub_question.push({
                    sub_question_id:
                        response[i].sub_question[k].sub_question_id,
                    question: response[i].sub_question[k].question,
                    mcq: response[i].sub_question[k].mcq,
                    fill_in: response[i].sub_question[k].fill_in,
                    fillin_answer:
                        response[i].sub_question[k].fillin_answer.length !== 0
                            ? response[i].sub_question[k].fillin_answer
                            : [""],
                    options:
                        response[i].sub_question[k].options.length !== 0
                            ? response[i].sub_question[k].options
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
                    marks: response[i].sub_question[k].marks.toString(),
                    negative_marks:
                        response[i].sub_question[k].negative_marks.toString(),
                });
            }

            // Main question
            data.push({
                question_random_id: response[i].question_random_id,
                question: response[i].question,
                explanation: response[i].explanation,
                pair_question_id: response[i].pair_question_id,
                is_file_uploaded:
                    Object.entries(response[i].files).length !== 0
                        ? true
                        : false,
                mcq:
                    response[i].sub_question[0].mcq !== undefined
                        ? response[i].sub_question[0].mcq
                        : false,
                fill_in:
                    response[i].sub_question[0].fill_in !== undefined
                        ? response[i].sub_question[0].fill_in
                        : false,
                sub_question: sub_question,
                content: {
                    images:
                        images.length === 0
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
                            : images,
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
        document.title = `${this.props.section_name} Type 2 - HOD | IQLabs`;

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

        if (data[this.state.activeQuestion].question === "") {
            this.setState({
                errorMsg: "Main question is required",
                showErrorAlert: true,
                page_loading: false,
            });
        } else if (data[this.state.activeQuestion].explanation === "") {
            this.setState({
                errorMsg: "Explanation is required",
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

            form_data.append(
                "main_question",
                JSON.stringify({
                    main_question: {
                        question: data[this.state.activeQuestion].question,
                        explanation:
                            data[this.state.activeQuestion].explanation,
                        properties: {
                            chapter_id:
                                data[this.state.activeQuestion].properties
                                    .chapter_id,
                        },
                    },
                })
            );
            form_data.append(
                "sub_question",
                JSON.stringify({
                    sub_question: data[this.state.activeQuestion].sub_question,
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
                        `type2_image_${i + 1}_title`,
                        data[this.state.activeQuestion].content.images[i].title
                    );
                    form_data.append(
                        `type2_image_${i + 1}`,
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
                `${this.url}/hod/subject/${this.subjectId}/simulation/${this.simulationId}/paper/${this.paperId}/type_two/`,
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
                                showMainEdit_option: false,
                                showSubEdit_option: false,
                                contentCollapsed: true,
                                filesCollapsed: true,
                                subContentCollapsed: true,
                                propertiesCollapsed: true,
                                activeQuestion: "",
                                activeSubQuestion: "",
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
                `${this.url}/hod/subject/${this.subjectId}/simulation/${this.simulationId}/paper/${this.paperId}/type_two/`,
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
                                showMainEdit_option: false,
                                showSubEdit_option: false,
                                contentCollapsed: true,
                                filesCollapsed: true,
                                subContentCollapsed: true,
                                propertiesCollapsed: true,
                                activeQuestion: "",
                                activeSubQuestion: "",
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
        values[this.state.activeQuestion].explanation = evt.editor.getData();
        await this.setState({
            questions: values,
        });
        window.MathJax.typeset();
    };

    onSubEditorChange = async (evt) => {
        const values = [...this.state.questions];
        values[this.state.activeQuestion].sub_question[
            this.state.activeSubQuestion
        ].question = evt.editor.getData();
        await this.setState({
            questions: values,
        });
        window.MathJax.typeset();
    };

    // -------------------------- Options --------------------------

    handleOptions_mcq = () => {
        const values = [...this.state.questions];
        // main_question
        values[this.state.activeQuestion].mcq =
            !values[this.state.activeQuestion].mcq;
        values[this.state.activeQuestion].fill_in =
            !values[this.state.activeQuestion].fill_in;
        for (
            let i = 0;
            i < values[this.state.activeQuestion].sub_question.length;
            i++
        ) {
            // sub_question
            values[this.state.activeQuestion].sub_question[i].mcq =
                !values[this.state.activeQuestion].sub_question[i].mcq;
            values[this.state.activeQuestion].sub_question[i].fill_in =
                !values[this.state.activeQuestion].sub_question[i].fill_in;
        }
        this.setState({
            questions: values,
        });
    };

    handleOptions_fillin = () => {
        const values = [...this.state.questions];
        // main_question
        values[this.state.activeQuestion].fill_in =
            !values[this.state.activeQuestion].fill_in;
        values[this.state.activeQuestion].mcq =
            !values[this.state.activeQuestion].mcq;
        for (
            let i = 0;
            i < values[this.state.activeQuestion].sub_question.length;
            i++
        ) {
            // sub_question
            values[this.state.activeQuestion].sub_question[i].fill_in =
                !values[this.state.activeQuestion].sub_question[i].fill_in;
            values[this.state.activeQuestion].sub_question[i].mcq =
                !values[this.state.activeQuestion].sub_question[i].mcq;
        }
        this.setState({
            questions: values,
        });
    };

    correctOption = (index) => {
        const values = [...this.state.questions];
        if (
            values[this.state.activeQuestion].sub_question[
                this.state.activeSubQuestion
            ].options[index].content !== ""
        ) {
            for (
                let i = 0;
                i <
                values[this.state.activeQuestion].sub_question[
                    this.state.activeSubQuestion
                ].options.length;
                i++
            ) {
                values[this.state.activeQuestion].sub_question[
                    this.state.activeSubQuestion
                ].options[i].correct = false;
            }
            values[this.state.activeQuestion].sub_question[
                this.state.activeSubQuestion
            ].options[index].correct =
                !values[this.state.activeQuestion].sub_question[
                    this.state.activeSubQuestion
                ].options[index].correct;
            this.setState({
                questions: values,
            });
        }
    };

    handleOptionChange = async (index, event) => {
        const values = [...this.state.questions];
        values[this.state.activeQuestion].sub_question[
            this.state.activeSubQuestion
        ].options[index].content = event.editor.getData();
        await this.setState({
            questions: values,
        });
        window.MathJax.typeset();
    };

    handleAddOptionFields = () => {
        const values = [...this.state.questions];
        values[this.state.activeQuestion].sub_question[
            this.state.activeSubQuestion
        ].options.push({
            correct: false,
            content: "",
        });
        this.setState({
            questions: values,
        });
    };

    handleRemoveOptionFields = (index) => {
        const values = [...this.state.questions];
        values[this.state.activeQuestion].sub_question[
            this.state.activeSubQuestion
        ].options.splice(index, 1);
        this.setState(
            {
                questions: values,
            },
            () => {
                if (
                    values[this.state.activeQuestion].sub_question[
                        this.state.activeSubQuestion
                    ].options.length === 0
                ) {
                    values[this.state.activeQuestion].sub_question[
                        this.state.activeSubQuestion
                    ].options.push({
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
        values[this.state.activeQuestion].sub_question[
            this.state.activeSubQuestion
        ].fillin_answer[index] = event.target.value;
        this.setState({
            questions: values,
        });
    };

    handleAddAnswerFields = () => {
        const values = [...this.state.questions];
        values[this.state.activeQuestion].sub_question[
            this.state.activeSubQuestion
        ].fillin_answer.push("");
        this.setState({
            questions: values,
        });
    };

    handleRemoveAnswerFields = (index) => {
        const values = [...this.state.questions];
        values[this.state.activeQuestion].sub_question[
            this.state.activeSubQuestion
        ].fillin_answer.splice(index, 1);
        this.setState(
            {
                questions: values,
            },
            () => {
                if (
                    values[this.state.activeQuestion].sub_question[
                        this.state.activeSubQuestion
                    ].fillin_answer.length === 0
                ) {
                    values[this.state.activeQuestion].sub_question[
                        this.state.activeSubQuestion
                    ].fillin_answer.push("");
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
            };
            body[`type2_image_${index + 1}_title`] =
                values[this.state.activeQuestion].content.images[index].title ||
                "title";

            fetch(
                `${this.url}/hod/subject/${this.subjectId}/simulation/${this.simulationId}/paper/${this.paperId}/type_two/`,
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

    // -------------------------- Properties --------------------------

    handleProperties = (event) => {
        let values = [...this.state.questions];
        values[this.state.activeQuestion].properties.chapter_id = event.value;

        this.setState({
            questions: values,
        });
    };

    handleMarks = (event) => {
        let values = [...this.state.questions];
        values[this.state.activeQuestion].sub_question[
            this.state.activeSubQuestion
        ].marks = event.target.value.toString();

        this.setState({
            questions: values,
        });
    };

    handleNegativeMarks = (event) => {
        let values = [...this.state.questions];
        values[this.state.activeQuestion].sub_question[
            this.state.activeSubQuestion
        ].negative_marks = event.target.value.toString();

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

    handleAddMainQuestion = () => {
        const values = [...this.state.questions];
        values.push({
            question_random_id: "",
            question: "<p>Main Question goes here</p>",
            explanation: "<p>Explanation goes here</p>",
            pair_question_id: "NOPAIR",
            is_file_uploaded: false,
            mcq: true,
            fill_in: false,
            sub_question: [
                {
                    sub_question_id: "",
                    question: "<p>Sub question goes here</p>",
                    mcq: true,
                    fill_in: false,
                    fillin_answer: [""],
                    options: [
                        { correct: false, content: "" },
                        { correct: false, content: "" },
                        { correct: false, content: "" },
                        { correct: false, content: "" },
                    ],
                    marks: "",
                    negative_marks: "0",
                },
            ],
            content: {
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

    handleAddSubQuestion = (index) => {
        const values = [...this.state.questions];
        values[index].sub_question.push({
            sub_question_id: "",
            question: "<p>Sub question goes here</p>",
            mcq: values[index].mcq,
            fill_in: values[index].fill_in,
            fillin_answer: [""],
            options: [
                { correct: false, content: "" },
                { correct: false, content: "" },
                { correct: false, content: "" },
                { correct: false, content: "" },
            ],
            marks: "",
            negative_marks: "0",
        });
        this.setState({
            questions: values,
            activeQuestion: index,
            activeSubQuestion: values[index].sub_question.length - 1,
        });
    };

    // --------------- Copy question ---------------

    copyQuestions = async (index) => {
        const values = [...this.state.questions];

        const sub_question = [];
        for (let i = 0; i < values[index].sub_question.length; i++) {
            const options = [];
            for (
                let j = 0;
                j < values[index].sub_question[i].options.length;
                j++
            ) {
                options[j] = {
                    content: values[index].sub_question[i].options[j].content,
                    correct: values[index].sub_question[i].options[j].correct,
                };
            }
            const fillin = [];
            for (
                let j = 0;
                j < values[index].sub_question[i].fillin_answer.length;
                j++
            ) {
                fillin[j] = values[index].sub_question[i].fillin_answer[j];
            }
            sub_question[i] = {
                sub_question_id: "",
                question: values[index].sub_question[i].question,
                mcq: values[index].mcq,
                fill_in: values[index].fill_in,
                fillin_answer: fillin,
                options: options,
                marks: values[index].sub_question[i].marks,
                negative_marks: values[index].sub_question[i].negative_marks,
            };
        }
        values.push({
            question_random_id: "",
            question: values[index].question,
            explanation: values[index].explanation,
            pair_question_id: "NOPAIR",
            is_file_uploaded: false,
            mcq: values[index].mcq,
            fill_in: values[index].fill_in,
            sub_question: sub_question,
            content: {
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

    copySubQuestions = async (main_index, sub_index) => {
        const values = [...this.state.questions];

        const options = [];
        for (
            let i = 0;
            i < values[main_index].sub_question[sub_index].options.length;
            i++
        ) {
            options[i] = {
                content:
                    values[main_index].sub_question[sub_index].options[i]
                        .content,
                correct:
                    values[main_index].sub_question[sub_index].options[i]
                        .correct,
            };
        }
        const fillin = [];
        for (
            let i = 0;
            i < values[main_index].sub_question[sub_index].fillin_answer.length;
            i++
        ) {
            fillin[i] =
                values[main_index].sub_question[sub_index].fillin_answer[i];
        }
        values[main_index].sub_question.push({
            sub_question_id: "",
            question: values[main_index].sub_question[sub_index].question,
            mcq: values[main_index].mcq,
            fill_in: values[main_index].fill_in,
            fillin_answer: fillin,
            options: options,
            marks: values[main_index].sub_question[sub_index].marks,
            negative_marks:
                values[main_index].sub_question[sub_index].negative_marks,
        });
        await this.setState({
            questions: values,
            activeQuestion: main_index,
            activeSubQuestion: values[main_index].sub_question.length,
        });
        window.MathJax.typeset();
    };

    // --------------- Edit question ---------------

    editQuestion = (index) => {
        this.setState({
            showMainEdit_option: true,
            showSubEdit_option: false,
            activeQuestion: index,
            showErrorAlert: false,
            showSuccessAlert: false,
            contentCollapsed: true,
            filesCollapsed: true,
            subContentCollapsed: true,
            propertiesCollapsed: true,
        });
    };

    editSubQuestion = (main_index, sub_index) => {
        this.setState({
            showMainEdit_option: false,
            showSubEdit_option: true,
            activeQuestion: main_index,
            activeSubQuestion: sub_index,
            showErrorAlert: false,
            showSuccessAlert: false,
            contentCollapsed: true,
            filesCollapsed: true,
            subContentCollapsed: true,
            propertiesCollapsed: true,
        });
    };

    // --------------- Delete question ---------------

    deleteQuestion = (index) => {
        const values = [...this.state.questions];
        this.setState({
            showMainEdit_option: false,
            showSubEdit_option: false,
            contentCollapsed: true,
            filesCollapsed: true,
            subContentCollapsed: true,
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
                            question_random_id: "",
                            question: "<p>Main Question goes here</p>",
                            explanation: "<p>Explanation goes here</p>",
                            pair_question_id: "NOPAIR",
                            is_file_uploaded: false,
                            mcq: true,
                            fill_in: false,
                            sub_question: [
                                {
                                    sub_question_id: "",
                                    question: "<p>Sub question goes here</p>",
                                    mcq: true,
                                    fill_in: false,
                                    fillin_answer: [""],
                                    options: [
                                        { correct: false, content: "" },
                                        { correct: false, content: "" },
                                        { correct: false, content: "" },
                                        { correct: false, content: "" },
                                    ],
                                    marks: "",
                                    negative_marks: "0",
                                },
                            ],
                            content: {
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
                        question_random_id: "",
                        question: "<p>Main Question goes here</p>",
                        explanation: "<p>Explanation goes here</p>",
                        pair_question_id: "NOPAIR",
                        is_file_uploaded: false,
                        mcq: true,
                        fill_in: false,
                        sub_question: [
                            {
                                sub_question_id: "",
                                question: "<p>Sub question goes here</p>",
                                mcq: true,
                                fill_in: false,
                                fillin_answer: [""],
                                options: [
                                    { correct: false, content: "" },
                                    { correct: false, content: "" },
                                    { correct: false, content: "" },
                                    { correct: false, content: "" },
                                ],
                                marks: "",
                                negative_marks: "0",
                            },
                        ],
                        content: {
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
        this.setState(
            {
                showMCQDelete_Modal: false,
                page_loading: true,
            },
            () => {
                this.loadMCQData();
            }
        );
    };

    deleteSubQuestion = (main_index, sub_index) => {
        const values = [...this.state.questions];
        this.setState({
            showMainEdit_option: false,
            showSubEdit_option: false,
            contentCollapsed: true,
            filesCollapsed: true,
            subContentCollapsed: true,
            propertiesCollapsed: true,
            activeQuestion: main_index,
            activeSubQuestion: sub_index,
        });

        if (values[main_index].sub_question[sub_index].sub_question_id !== "") {
            this.setState({
                selectedQuestion: values[main_index].question_random_id,
                selectedSubQuestion:
                    values[main_index].sub_question[sub_index].sub_question_id,
                showSubMCQDelete_Modal: !this.state.showSubMCQDelete_Modal,
            });
        } else {
            values[main_index].sub_question.splice(sub_index, 1);
            this.setState(
                {
                    questions: values,
                    activeSubQuestion: "",
                },
                () => {
                    if (values[main_index].sub_question.length === 0) {
                        values[main_index].sub_question.push({
                            sub_question_id: "",
                            question: "<p>Sub question goes here</p>",
                            mcq: values[main_index].mcq,
                            fill_in: values[main_index].fill_in,
                            fillin_answer: [""],
                            options: [
                                { correct: false, content: "" },
                                { correct: false, content: "" },
                                { correct: false, content: "" },
                                { correct: false, content: "" },
                            ],
                            marks: "",
                            negative_marks: "0",
                        });
                        this.setState({
                            questions: values,
                        });
                    }
                }
            );
        }
    };

    toggleSubDeleteModal = () => {
        this.setState({
            showSubMCQDelete_Modal: !this.state.showSubMCQDelete_Modal,
        });
    };

    handleSubMCQ_Deletion = () => {
        const values = [...this.state.questions];

        values[this.state.activeQuestion].sub_question.splice(
            this.state.activeSubQuestion,
            1
        );

        this.setState(
            {
                questions: values,
                activeSubQuestion: "",
            },
            () => {
                if (
                    values[this.state.activeQuestion].sub_question.length === 0
                ) {
                    values[this.state.activeQuestion].sub_question.push({
                        sub_question_id: "",
                        question: "<p>Sub question goes here</p>",
                        mcq: values[this.state.activeQuestion].mcq,
                        fill_in: values[this.state.activeQuestion].fill_in,
                        fillin_answer: [""],
                        options: [
                            { correct: false, content: "" },
                            { correct: false, content: "" },
                            { correct: false, content: "" },
                            { correct: false, content: "" },
                        ],
                        marks: "",
                        negative_marks: "0",
                    });
                    this.setState({
                        questions: values,
                    });
                }
            }
        );
        this.setState(
            {
                showSubMCQDelete_Modal: false,
                page_loading: true,
            },
            () => {
                this.loadMCQData();
            }
        );
    };

    // -------------------------- Pairing question --------------------------

    handlePair = (question, index) => {
        let values = [...this.state.questions];
        values.splice(index + 1, 0, {
            question_random_id: "",
            question: "<p>Main Question goes here</p>",
            explanation: "<p>Explanation goes here</p>",
            pair_question_id: question.question_random_id,
            is_file_uploaded: false,
            mcq: true,
            fill_in: false,
            sub_question: [
                {
                    sub_question_id: "",
                    question: "<p>Sub question goes here</p>",
                    mcq: true,
                    fill_in: false,
                    fillin_answer: [""],
                    options: [
                        { correct: false, content: "" },
                        { correct: false, content: "" },
                        { correct: false, content: "" },
                        { correct: false, content: "" },
                    ],
                    marks: "",
                    negative_marks: "0",
                },
            ],
            content: {
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
                        url={`${this.url}/hod/subject/${this.subjectId}/simulation/${this.simulationId}/paper/${this.paperId}/type_two/`}
                        type="question"
                        name=""
                        data={{
                            section_id: this.sectionId,
                            question_random_id: this.state.selectedQuestion,
                        }}
                    />
                ) : null}

                {/* Sub MCQ Deletion Modal */}
                {this.state.showSubMCQDelete_Modal ? (
                    <SingleContentDeleteModal
                        show={this.state.showSubMCQDelete_Modal}
                        onHide={this.toggleSubDeleteModal}
                        formSubmission={this.handleSubMCQ_Deletion}
                        url={`${this.url}/hod/subject/${this.subjectId}/simulation/${this.simulationId}/paper/${this.paperId}/type_two/`}
                        type="sub question"
                        name=""
                        data={{
                            section_id: this.sectionId,
                            question_random_id: this.state.selectedQuestion,
                            sub_question_id: this.state.selectedSubQuestion,
                        }}
                    />
                ) : null}

                <div className="row">
                    {/* ------------------------------ MCQ Column ------------------------------ */}
                    <div
                        className={`${
                            this.state.showMainEdit_option ||
                            this.state.showSubEdit_option
                                ? "col-md-9"
                                : "col-12"
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

                        {/* ----- Header area ----- */}
                        <h5 className="primary-text mb-4">
                            Type 2 - {this.section.category}
                        </h5>

                        {/* -------------------- Main question -------------------- */}
                        {this.state.questions.map((question, q_index) => {
                            return (
                                <div key={q_index}>
                                    <div className="row mb-3">
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
                                                                this.editQuestion(
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
                                                                this.deleteQuestion(
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
                                                                    Pair
                                                                    question
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
                                                className={`card mb-2 shadow-sm ${
                                                    this.state
                                                        .activeQuestion ===
                                                    q_index
                                                        ? "border-primary"
                                                        : ""
                                                }`}
                                                style={{
                                                    minHeight: "115px",
                                                }}
                                            >
                                                <div className="card-body">
                                                    <div className="d-flex">
                                                        {/* Questions */}
                                                        <div className="w-100">
                                                            <div
                                                                className="pb-2"
                                                                dangerouslySetInnerHTML={{
                                                                    __html: question.question,
                                                                }}
                                                            ></div>
                                                        </div>

                                                        {/* ----- image preview ----- */}
                                                        {question.content
                                                            .images[0].path !==
                                                            "" ||
                                                        question.content
                                                            .images[1].path !==
                                                            "" ||
                                                        question.content
                                                            .images[2].path !==
                                                            "" ||
                                                        question.content
                                                            .images[3].path !==
                                                            "" ? (
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
                                            <button
                                                className="btn btn-light bg-white btn-block shadow-sm"
                                                onClick={() =>
                                                    this.handleAddSubQuestion(
                                                        q_index
                                                    )
                                                }
                                                disabled={
                                                    this.sub_question_limit ===
                                                    question.sub_question.length
                                                        ? true
                                                        : false
                                                }
                                            >
                                                Add Sub question +
                                            </button>
                                        </div>
                                    </div>
                                    {/* ---------- Sub question ---------- */}
                                    <div className="ml-md-5 ml-3">
                                        {question.sub_question.map(
                                            (sub_question, sub_index) => {
                                                return (
                                                    <div
                                                        className="row mb-3"
                                                        key={sub_index}
                                                    >
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
                                                                            `${
                                                                                question.index
                                                                            }.${
                                                                                sub_index +
                                                                                1
                                                                            }`
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
                                                                                this.editSubQuestion(
                                                                                    q_index,
                                                                                    sub_index
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
                                                                                this.copySubQuestions(
                                                                                    q_index,
                                                                                    sub_index
                                                                                )
                                                                            }
                                                                            disabled={
                                                                                sub_question.sub_question_id ===
                                                                                ""
                                                                                    ? true
                                                                                    : false
                                                                            }
                                                                        >
                                                                            <i className="far fa-copy fa-sm"></i>
                                                                        </button>
                                                                    </OverlayTrigger>
                                                                </div>
                                                                <div className="col-md-12 col-3">
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
                                                                                this.deleteSubQuestion(
                                                                                    q_index,
                                                                                    sub_index
                                                                                )
                                                                            }
                                                                        >
                                                                            <i className="far fa-trash-alt fa-sm"></i>
                                                                        </button>
                                                                    </OverlayTrigger>
                                                                </div>
                                                            </div>
                                                        </div>

                                                        {/* ---------- Sub Question preview ---------- */}
                                                        <div className="col-md-11 pl-md-0">
                                                            <div
                                                                className={`card shadow-sm ${
                                                                    this.state
                                                                        .activeSubQuestion ===
                                                                        sub_index &&
                                                                    this.state
                                                                        .activeQuestion ===
                                                                        q_index
                                                                        ? "border-primary"
                                                                        : ""
                                                                }`}
                                                            >
                                                                <div className="card-body">
                                                                    <div
                                                                        className="pb-2"
                                                                        dangerouslySetInnerHTML={{
                                                                            __html: sub_question.question,
                                                                        }}
                                                                    ></div>

                                                                    {sub_question.mcq ? (
                                                                        <div className="row">
                                                                            {sub_question.options.map(
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
                                                                    {sub_question.fill_in ? (
                                                                        <div className="row">
                                                                            {sub_question.fillin_answer.map(
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
                                                                </div>
                                                                {/* ----- Answer type tag ----- */}
                                                                {sub_question.mcq ? (
                                                                    <div
                                                                        className="secondary-bg primary-text font-weight-bold px-2 py-1 position-absolute rounded-lg shadow-sm"
                                                                        style={{
                                                                            bottom: "5px",
                                                                            right: "5px",
                                                                            fontSize:
                                                                                "10px",
                                                                        }}
                                                                    >
                                                                        MCQ
                                                                    </div>
                                                                ) : sub_question.fill_in ? (
                                                                    <div
                                                                        className="secondary-bg primary-text font-weight-bold px-2 py-1 position-absolute rounded-lg shadow-sm"
                                                                        style={{
                                                                            bottom: "5px",
                                                                            right: "5px",
                                                                            fontSize:
                                                                                "10px",
                                                                        }}
                                                                    >
                                                                        Fill in
                                                                    </div>
                                                                ) : (
                                                                    ""
                                                                )}
                                                            </div>
                                                        </div>
                                                    </div>
                                                );
                                            }
                                        )}
                                    </div>
                                </div>
                            );
                        })}

                        <button
                            className="btn btn-primary btn-block shadow-none"
                            onClick={this.handleAddMainQuestion}
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

                    {/* ---------- Main Settings column ---------- */}
                    {this.state.showMainEdit_option ? (
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
                                            showMainEdit_option: false,
                                            showSubEdit_option: false,
                                            contentCollapsed: true,
                                            filesCollapsed: true,
                                            subContentCollapsed: true,
                                            propertiesCollapsed: true,
                                            activeQuestion: "",
                                            activeSubQuestion: "",
                                        });
                                    }}
                                >
                                    Close
                                </button>
                            </div>

                            <Accordion defaultActiveKey="">
                                {/* ----- Content ----- */}
                                <Card className="shadow-sm mb-2">
                                    <Accordion.Toggle
                                        as={Card.Body}
                                        variant="link"
                                        eventKey="0"
                                        className="text-dark"
                                        onClick={() =>
                                            this.toggleCollapse("content")
                                        }
                                        style={{ cursor: "default" }}
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

                                            {/* ---------- Explanation ---------- */}

                                            <div className="form-group">
                                                <label>Explanation</label>
                                                <CKeditor
                                                    data={
                                                        data[
                                                            this.state
                                                                .activeQuestion
                                                        ].explanation
                                                    }
                                                    onChange={
                                                        this.handleExplanation
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
                                                                    ].mcq
                                                                }
                                                                onChange={
                                                                    this
                                                                        .handleOptions_mcq
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
                                                                    ].fill_in
                                                                }
                                                                onChange={
                                                                    this
                                                                        .handleOptions_fillin
                                                                }
                                                            />
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </Card.Body>
                                    </Accordion.Collapse>
                                </Card>

                                {/* ----- Files ----- */}
                                <Card className="shadow-sm mb-2">
                                    <Accordion.Toggle
                                        as={Card.Body}
                                        variant="link"
                                        eventKey="1"
                                        className="text-dark"
                                        onClick={() =>
                                            this.toggleCollapse("files")
                                        }
                                        style={{ cursor: "default" }}
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
                                        onClick={() =>
                                            this.toggleCollapse("properties")
                                        }
                                        style={{ cursor: "default" }}
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

                    {/* ---------- Sub Settings column ---------- */}
                    {this.state.showSubEdit_option ? (
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
                                            showMainEdit_option: false,
                                            showSubEdit_option: false,
                                            contentCollapsed: true,
                                            filesCollapsed: true,
                                            subContentCollapsed: true,
                                            propertiesCollapsed: true,
                                            activeQuestion: "",
                                            activeSubQuestion: "",
                                        });
                                    }}
                                >
                                    Close
                                </button>
                            </div>

                            <Accordion defaultActiveKey="">
                                {/* Content */}
                                <Card className="shadow-sm mb-2">
                                    <Accordion.Toggle
                                        as={Card.Body}
                                        variant="link"
                                        eventKey="0"
                                        className="text-dark"
                                        onClick={() =>
                                            this.toggleCollapse("content")
                                        }
                                        style={{ cursor: "default" }}
                                    >
                                        <div className="d-flex justify-content-between align-items-center">
                                            Content
                                            {this.state.subContentCollapsed ? (
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
                                                        ].sub_question[
                                                            this.state
                                                                .activeSubQuestion
                                                        ].question
                                                    }
                                                    onChange={
                                                        this.onSubEditorChange
                                                    }
                                                />
                                            </div>

                                            {/* ---------- Options ---------- */}

                                            {data[this.state.activeQuestion]
                                                .sub_question[
                                                this.state.activeSubQuestion
                                            ].mcq ? (
                                                <>
                                                    <label>Options</label>
                                                    <div className="form-group row align-items-center">
                                                        {data[
                                                            this.state
                                                                .activeQuestion
                                                        ].sub_question[
                                                            this.state
                                                                .activeSubQuestion
                                                        ].options.map(
                                                            (
                                                                options,
                                                                index
                                                            ) => (
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
                                                        ].sub_question[
                                                            this.state
                                                                .activeSubQuestion
                                                        ].options.length <
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
                                                </>
                                            ) : data[this.state.activeQuestion]
                                                  .sub_question[
                                                  this.state.activeSubQuestion
                                              ].fill_in ? (
                                                <>
                                                    <label>Fill in</label>
                                                    <div className="form-group row">
                                                        {data[
                                                            this.state
                                                                .activeQuestion
                                                        ].sub_question[
                                                            this.state
                                                                .activeSubQuestion
                                                        ].fillin_answer.map(
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
                                                </>
                                            ) : (
                                                ""
                                            )}

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
                                                            ].sub_question[
                                                                this.state
                                                                    .activeSubQuestion
                                                            ].marks
                                                        }
                                                        onChange={(event) =>
                                                            this.handleMarks(
                                                                event
                                                            )
                                                        }
                                                        autoComplete="off"
                                                    />
                                                </div>
                                            </div>

                                            {/* ---------- Negative Marks ---------- */}
                                            <div className="form-group row align-items-center">
                                                <div className="col-4 small">
                                                    Negative Marks
                                                </div>
                                                <div className="col-8">
                                                    <input
                                                        type="text"
                                                        className="form-control form-control-sm border-secondary"
                                                        value={
                                                            data[
                                                                this.state
                                                                    .activeQuestion
                                                            ].sub_question[
                                                                this.state
                                                                    .activeSubQuestion
                                                            ].negative_marks
                                                        }
                                                        onChange={
                                                            this
                                                                .handleNegativeMarks
                                                        }
                                                        autoComplete="off"
                                                    />
                                                </div>
                                            </div>
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

export default connect(mapStateToProps)(HODSimulationType2);
