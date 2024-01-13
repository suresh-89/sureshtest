import React, { Component, Fragment } from "react";
import Wrapper from "../wrapper";
import { connect } from "react-redux";
import axios from "axios";
import { Link } from "react-router-dom";
import CKeditor from "../../common/CKEditor";
import ReactSwitch from "../../common/switchComponent";
import { Accordion, Card } from "react-bootstrap";
import { baseUrl, teacherUrl } from "../../../shared/baseUrl.js";
import ReactCardFlip from "react-card-flip";
import Loading from "../../common/loader";
import AlertBox from "../../common/alert";
import FileModal from "../shared/fileExplorer";
import { SingleContentDeleteModal } from "../../common/modal/contentManagementModal";
import TemplateUpload from "../shared/templateUpload";
import { CONCEPT_TEMPLATE } from "../../../shared/constant";

const mapStateToProps = (state) => ({
    group_name: state.content.group_name,
    subject_name: state.content.subject_name,
    chapter_name: state.content.chapter_name,
    topic_name: state.content.topic_name,
});

class TeacherConcepts extends Component {
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
            showConceptDelete_Modal: false,

            contentCollapsed: true,
            filesCollapsed: true,
            settingsCollapsed: true,
            showEdit_option: false,
            isForm_submitted: false,

            activeConcept: "",
            selectedImage: "",
            selectedVideo: "",
            selectedAudio: "",
            flipState: [false],
            selectedConcept: "",

            concepts: [
                {
                    concepts_random_id: "",
                    chapter_id: this.props.match.params.chapterId,
                    topic_num: this.props.match.params.topicNum,
                    is_file_uploaded: false,
                    content: {
                        terms: "<p>Terms goes here</p>",
                        definition: "<p>Definition goes here</p>",
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
                    settings: {
                        virtual_keyboard: [],
                        limited: false,
                    },
                },
            ],
        };
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
        this.loadConceptData();
    };

    // -------------------------- Load concept data --------------------------

    loadConceptData = async () => {
        await fetch(
            `${this.url}/teacher/subject/${this.subjectId}/chapter/concepts/?chapter_id=${this.chapterId}&topic_num=${this.topicNum}`,
            {
                method: "GET",
                headers: this.headers,
            }
        )
            .then((res) => res.json())
            .then((result) => {
                if (result.sts === true) {
                    let data = [];
                    let response = result.data.results;
                    if (response.length !== 0) {
                        let conceptData = this.loopConceptData(data, response);
                        this.setState(
                            {
                                concepts: conceptData.concepts,
                            },
                            () => {
                                if (result.data.next !== null) {
                                    this.loadNextConceptData(result.data.next);
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

    loadNextConceptData = async (path) => {
        await fetch(path, {
            headers: this.headers,
            method: "GET",
        })
            .then((res) => res.json())
            .then((result) => {
                if (result.sts === true) {
                    let data = [...this.state.concepts];
                    let response = result.data.results;
                    if (response.length !== 0) {
                        let conceptData = this.loopConceptData(data, response);
                        this.setState(
                            {
                                concepts: conceptData.concepts,
                            },
                            () => {
                                if (result.data.next !== null) {
                                    this.loadNextConceptData(result.data.next);
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

    loopConceptData = (data, response) => {
        let imgArr = [];
        let audioArr = [];
        for (let i = 0; i < response.length; i++) {
            imgArr = [];
            audioArr = [];
            if (response[i].files.length !== 0) {
                // image
                imgArr.push({
                    title: response[i].files.concepts_image_1_title || "",
                    file_name: "",
                    image: null,
                    path: response[i].files.concepts_image_1 || "",
                });
                imgArr.push({
                    title: response[i].files.concepts_image_2_title || "",
                    file_name: "",
                    image: null,
                    path: response[i].files.concepts_image_2 || "",
                });
                imgArr.push({
                    title: response[i].files.concepts_image_3_title || "",
                    file_name: "",
                    image: null,
                    path: response[i].files.concepts_image_3 || "",
                });
                imgArr.push({
                    title: response[i].files.concepts_image_4_title || "",
                    file_name: "",
                    image: null,
                    path: response[i].files.concepts_image_4 || "",
                });

                // audio
                audioArr.push({
                    title: response[i].files.concepts_audio_1_title || "",
                    file_name: "",
                    audio: null,
                    path: response[i].files.concepts_audio_1 || "",
                });
                audioArr.push({
                    title: response[i].files.concepts_audio_2_title || "",
                    file_name: "",
                    audio: null,
                    path: response[i].files.concepts_audio_2 || "",
                });
            }

            // video
            var path = "";
            if (response[i].files.length !== 0) {
                if (response[i].files.paste_video_url) {
                    path = response[i].files.paste_video_url;
                }
                if (response[i].files.concepts_video_1) {
                    path = response[i].files.concepts_video_1;
                }
            }

            data.push({
                chapter_id: this.props.match.params.chapterId,
                topic_num: this.props.match.params.topicNum,
                concepts_random_id: response[i].concepts_random_id,
                is_file_uploaded:
                    Object.keys(response[i].files).length !== 0 ? true : false,
                content: {
                    terms: response[i].terms,
                    definition: response[i].definition,
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
                            response[i].files.concepts_video_1_title
                                ? response[i].files.concepts_video_1_title
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
                settings: {
                    virtual_keyboard: response[i].settings.virtual_keyboard,
                    limited: response[i].settings.limited,
                },
            });
        }

        return {
            concepts: data,
        };
    };

    // -------------------------- Lifecycle --------------------------

    componentDidMount = () => {
        document.title = `${this.props.topic_name} Concepts - Teacher | IQLabs`;

        this.loadConceptData();
    };

    // -------------------------- Data submission --------------------------

    handleSubmit = () => {
        this.setState({
            page_loading: true,
            showErrorAlert: false,
            showSuccessAlert: false,
        });

        const data = [...this.state.concepts];

        if (data[this.state.activeConcept].content.terms === "") {
            this.setState({
                errorMsg: "Terms is required",
                showErrorAlert: true,
                page_loading: false,
            });
        } else if (data[this.state.activeConcept].content.definition === "") {
            this.setState({
                errorMsg: "Definition is required",
                showErrorAlert: true,
                page_loading: false,
            });
        } else {
            if (data[this.state.activeConcept].concepts_random_id === "") {
                this.handlePOST(data);
            } else {
                this.handlePUT(data);
            }
        }
    };

    handlePOST = (data) => {
        fetch(
            `${this.url}/teacher/subject/${this.subjectId}/chapter/concepts/`,
            {
                headers: this.headers,
                method: "POST",
                body: JSON.stringify({
                    chapter_id: this.chapterId,
                    topic_num: this.topicNum,
                    content: {
                        terms: data[this.state.activeConcept].content.terms,
                        definition:
                            data[this.state.activeConcept].content.definition,
                    },
                    settings: {
                        virtual_keyboard:
                            data[this.state.activeConcept].settings
                                .virtual_keyboard,
                        limited:
                            data[this.state.activeConcept].settings.limited,
                    },
                }),
            }
        )
            .then((res) => res.json())
            .then((result) => {
                if (result.sts === true) {
                    data[this.state.activeConcept].concepts_random_id =
                        result.concepts_random_id;
                    this.setState({
                        concepts: data,
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
        fetch(
            `${this.url}/teacher/subject/${this.subjectId}/chapter/concepts/`,
            {
                headers: this.headers,
                method: "PUT",
                body: JSON.stringify({
                    chapter_id: this.chapterId,
                    topic_num: this.topicNum,
                    concepts_random_id:
                        data[this.state.activeConcept].concepts_random_id,
                    content: {
                        terms: data[this.state.activeConcept].content.terms,
                        definition:
                            data[this.state.activeConcept].content.definition,
                    },
                    settings: {
                        virtual_keyboard:
                            data[this.state.activeConcept].settings
                                .virtual_keyboard,
                        limited:
                            data[this.state.activeConcept].settings.limited,
                    },
                }),
            }
        )
            .then((res) => res.json())
            .then((result) => {
                if (result.sts === true) {
                    data[this.state.activeConcept].concepts_random_id =
                        result.concepts_random_id;
                    this.setState({
                        concepts: data,
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

    // Run the image API once the concepts is added
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

            const conceptValues = [...this.state.concepts];

            let form_data = new FormData();

            form_data.append("chapter_id", this.chapterId);
            form_data.append("topic_num", this.topicNum);
            form_data.append(
                "concepts_random_id",
                conceptValues[this.state.activeConcept].concepts_random_id
            );

            if (
                conceptValues[this.state.activeConcept].content.video.url !== ""
            ) {
                form_data.append(
                    "video_url",
                    conceptValues[this.state.activeConcept].content.video.url
                );
            }

            if (
                conceptValues[this.state.activeConcept].content.video.video !==
                null
            ) {
                form_data.append(
                    "concepts_video_1_title",
                    conceptValues[this.state.activeConcept].content.video.title
                );
                form_data.append(
                    "concepts_video_1",
                    conceptValues[this.state.activeConcept].content.video.video
                );
            }

            for (
                let i = 0;
                i <
                conceptValues[this.state.activeConcept].content.images.length;
                i++
            ) {
                if (
                    conceptValues[this.state.activeConcept].content.images[i]
                        .image !== null
                ) {
                    form_data.append(
                        `concepts_image_${i + 1}_title`,
                        conceptValues[this.state.activeConcept].content.images[
                            i
                        ].title
                    );
                    form_data.append(
                        `concepts_image_${i + 1}`,
                        conceptValues[this.state.activeConcept].content.images[
                            i
                        ].image
                    );
                } else {
                    continue;
                }
            }

            for (
                let i = 0;
                i <
                conceptValues[this.state.activeConcept].content.audio.length;
                i++
            ) {
                if (
                    conceptValues[this.state.activeConcept].content.audio[i]
                        .audio !== null
                ) {
                    form_data.append(
                        `concepts_audio_${i + 1}_title`,
                        conceptValues[this.state.activeConcept].content.audio[i]
                            .title
                    );
                    form_data.append(
                        `concepts_audio_${i + 1}`,
                        conceptValues[this.state.activeConcept].content.audio[i]
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
                    conceptValues[this.state.activeConcept].is_file_uploaded ===
                    false
                ) {
                    this.handleImgPOST(options, form_data, conceptValues);
                } else {
                    this.handleImgPATCH(options, form_data, conceptValues);
                }
            } else {
                this.setState(
                    {
                        concepts: conceptValues,
                        successMsg: "Concepts added",
                        showSuccessAlert: true,
                    },
                    () => {
                        setTimeout(() => {
                            this.setState({
                                showEdit_option: false,
                                contentCollapsed: true,
                                filesCollapsed: true,
                                settingsCollapsed: true,
                                activeConcept: "",
                            });
                        }, 1000);
                        this.loadConceptData();
                    }
                );
            }
        }
    };

    handleImgPOST = (options, form_data, conceptValues) => {
        axios
            .post(
                `${this.url}/teacher/subject/${this.subjectId}/chapter/concepts/files/`,
                form_data,
                options
            )
            .then((result) => {
                if (result.data.sts === true) {
                    this.setState(
                        {
                            concepts: conceptValues,
                            successMsg: result.data.msg,
                            showSuccessAlert: true,
                            page_loading: false,
                        },
                        () => {
                            setTimeout(() => {
                                this.setState({
                                    showEdit_option: false,
                                    contentCollapsed: true,
                                    filesCollapsed: true,
                                    settingsCollapsed: true,
                                    page_loading: true,
                                    activeConcept: "",
                                });
                                this.loadConceptData();
                            }, 1000);
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

    handleImgPATCH = (options, form_data, conceptValues) => {
        axios
            .patch(
                `${this.url}/teacher/subject/${this.subjectId}/chapter/concepts/files/`,
                form_data,
                options
            )
            .then((result) => {
                if (result.data.sts === true) {
                    this.setState(
                        {
                            concepts: conceptValues,
                            successMsg: result.data.msg,
                            showSuccessAlert: true,
                            page_loading: false,
                        },
                        () => {
                            setTimeout(() => {
                                this.setState({
                                    showEdit_option: false,
                                    contentCollapsed: true,
                                    filesCollapsed: true,
                                    settingsCollapsed: true,
                                    page_loading: true,
                                    activeConcept: "",
                                });
                                this.loadConceptData();
                            }, 1000);
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

    // -------------------------- Terms & Definition --------------------------

    onEditorChange = async (evt) => {
        const values = [...this.state.concepts];
        values[this.state.activeConcept].content.terms = evt.editor.getData();
        await this.setState({
            concepts: values,
        });
        window.MathJax.typeset();
    };

    handleDefinition = async (evt) => {
        const values = [...this.state.concepts];
        values[this.state.activeConcept].content.definition =
            evt.editor.getData();
        await this.setState({
            concepts: values,
        });
        window.MathJax.typeset();
    };

    // -------------------------- Image --------------------------

    handleImageTitle = (index, event) => {
        const values = [...this.state.concepts];
        values[this.state.activeConcept].content.images[index].title =
            event.target.value;
        this.setState({
            concepts: values,
        });
    };

    handleDeleteImages = (index) => {
        const values = [...this.state.concepts];

        this.setState({
            showSuccessAlert: false,
            showErrorAlert: false,
        });

        if (
            values[this.state.activeConcept].concepts_random_id !== "" &&
            values[this.state.activeConcept].is_file_uploaded === true &&
            values[this.state.activeConcept].content.images[index].file_name ===
                "" &&
            values[this.state.activeConcept].content.images[index].path !== ""
        ) {
            let body = {
                chapter_id: this.chapterId,
                topic_num: this.topicNum,
                concepts_random_id:
                    values[this.state.activeConcept].concepts_random_id,
            };
            body[`concepts_image_${index + 1}_title`] =
                values[this.state.activeConcept].content.images[index].title ||
                "title";

            fetch(
                `${this.url}/teacher/subject/${this.subjectId}/chapter/concepts/files/`,
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
                        values[this.state.activeConcept].content.images[index] =
                            {
                                title: "",
                                file_name: "",
                                image: null,
                                path: "",
                            };
                        this.setState({
                            concepts: values,
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
            values[this.state.activeConcept].content.images[index] = {
                title: "",
                file_name: "",
                image: null,
                path: "",
            };
            this.setState({
                concepts: values,
            });
        }
    };

    handleImageFile = (index, event) => {
        this.setState({
            showErrorAlert: false,
        });

        let values = [...this.state.concepts];
        const file = event.target.files[0].name.toLowerCase();
        if (!file.match(/\.(jpg|jpeg|png|webp)$/)) {
            this.setState({
                errorMsg: "Please select valid image file",
                showErrorAlert: true,
                btnDisabled: true,
            });
        } else {
            values[this.state.activeConcept].content.images[index].file_name =
                event.target.files[0].name;
            values[this.state.activeConcept].content.images[index].path =
                URL.createObjectURL(event.target.files[0]);
            values[this.state.activeConcept].content.images[index].image =
                event.target.files[0];
            this.setState({
                concepts: values,
                btnDisabled: false,
                showErrorAlert: false,
            });
        }
    };

    clearImages = () => {
        const values = [...this.state.concepts];
        this.setState({
            showErrorAlert: false,
            showSuccessAlert: false,
        });
        for (
            let i = 0;
            i < values[this.state.activeConcept].content.images.length;
            i++
        ) {
            this.handleDeleteImages(i);
        }
    };

    // -------------------------- Video --------------------------

    handleVideoTitle = (event) => {
        const values = [...this.state.concepts];
        values[this.state.activeConcept].content.video.title =
            event.target.value;
        this.setState({
            concepts: values,
        });
    };

    handleVideoFile = (event) => {
        this.setState({
            showErrorAlert: false,
        });

        let values = [...this.state.concepts];
        const file = event.target.files[0].name.toLowerCase();
        if (!file.match(/\.(mpeg|flv|avi|mov|mp4|mkv)$/)) {
            this.setState({
                errorMsg: "Please select valid video file",
                showErrorAlert: true,
                btnDisabled: true,
            });
        } else {
            values[this.state.activeConcept].content.video.file_name =
                event.target.files[0].name;
            values[this.state.activeConcept].content.video.path =
                URL.createObjectURL(event.target.files[0]);
            values[this.state.activeConcept].content.video.video =
                event.target.files[0];
            values[this.state.activeConcept].content.video.url = "";
            this.setState({
                concepts: values,
                btnDisabled: false,
                showErrorAlert: false,
            });
        }
    };

    handleVideoUrl = (event) => {
        const values = [...this.state.concepts];
        values[this.state.activeConcept].content.video.url = event.target.value;
        values[this.state.activeConcept].content.video.path =
            event.target.value;
        values[this.state.activeConcept].content.video.file_name = "";
        values[this.state.activeConcept].content.video.path = "";
        this.setState({
            concepts: values,
        });
    };

    clearVideo = () => {
        const values = [...this.state.concepts];

        if (
            values[this.state.activeConcept].concepts_random_id !== "" &&
            values[this.state.activeConcept].is_file_uploaded === true &&
            values[this.state.activeConcept].content.video.file_name === "" &&
            values[this.state.activeConcept].content.video.path !== ""
        ) {
            fetch(
                `${this.url}/teacher/subject/${this.subjectId}/chapter/concepts/files/`,
                {
                    method: "DELETE",
                    headers: this.headers,
                    body: JSON.stringify({
                        chapter_id: this.chapterId,
                        topic_num: this.topicNum,
                        concepts_random_id:
                            values[this.state.activeConcept].concepts_random_id,
                        concepts_video_1_title:
                            values[this.state.activeConcept].content.video
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
                        values[this.state.activeConcept].content.video.title =
                            "";
                        values[
                            this.state.activeConcept
                        ].content.video.file_name = "";
                        values[this.state.activeConcept].content.video.video =
                            null;
                        values[this.state.activeConcept].content.video.path =
                            "";
                        values[this.state.activeConcept].content.video.url = "";
                        this.setState({
                            concepts: values,
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
            values[this.state.activeConcept].content.video.title = "";
            values[this.state.activeConcept].content.video.file_name = "";
            values[this.state.activeConcept].content.video.video = null;
            values[this.state.activeConcept].content.video.path = "";
            values[this.state.activeConcept].content.video.url = "";
            this.setState({
                concepts: values,
            });
        }
    };

    // -------------------------- Audio --------------------------

    handleAudioTitle = (index, event) => {
        const values = [...this.state.concepts];
        values[this.state.activeConcept].content.audio[index].title =
            event.target.value;
        this.setState({
            concepts: values,
        });
    };

    handleDeleteAudio = (index) => {
        const values = [...this.state.concepts];

        this.setState({
            showSuccessAlert: false,
            showErrorAlert: false,
        });

        if (
            values[this.state.activeConcept].concepts_random_id !== "" &&
            values[this.state.activeConcept].is_file_uploaded === true &&
            values[this.state.activeConcept].content.audio[index].file_name ===
                "" &&
            values[this.state.activeConcept].content.audio[index].path !== ""
        ) {
            let body = {
                chapter_id: this.chapterId,
                topic_num: this.topicNum,
                concepts_random_id:
                    values[this.state.activeConcept].concepts_random_id,
            };
            body[`concepts_audio_${index + 1}_title`] =
                values[this.state.activeConcept].content.audio[index].title ||
                "title";

            fetch(
                `${this.url}/teacher/subject/${this.subjectId}/chapter/concepts/files/`,
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
                        values[this.state.activeConcept].content.audio[index] =
                            {
                                title: "",
                                file_name: "",
                                audio: null,
                                path: "",
                            };
                        this.setState({
                            concepts: values,
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
            values[this.state.activeConcept].content.audio[index] = {
                title: "",
                file_name: "",
                audio: null,
                path: "",
            };
            this.setState({
                concepts: values,
            });
        }
    };

    handleAudioFile = (index, event) => {
        this.setState({
            showErrorAlert: false,
        });

        const values = [...this.state.concepts];
        const file = event.target.files[0].name.toLowerCase();
        if (!file.match(/\.(wav|mp3)$/)) {
            this.setState({
                errorMsg: "Please select valid audio file",
                showErrorAlert: true,
                btnDisabled: true,
            });
        } else {
            values[this.state.activeConcept].content.audio[index].file_name =
                event.target.files[0].name;
            values[this.state.activeConcept].content.audio[index].path =
                URL.createObjectURL(event.target.files[0]);
            values[this.state.activeConcept].content.audio[index].audio =
                event.target.files[0];
            this.setState({
                concepts: values,
                btnDisabled: false,
                showErrorAlert: false,
            });
        }
    };

    clearAudios = () => {
        const values = [...this.state.concepts];
        this.setState({
            showErrorAlert: false,
            showSuccessAlert: false,
        });
        for (
            let i = 0;
            i < values[this.state.activeConcept].content.audio.length;
            i++
        ) {
            this.handleDeleteAudio(i);
        }
    };

    // -------------------------- Settings --------------------------

    handleLimited = () => {
        const values = [...this.state.concepts];
        values[this.state.activeConcept].settings.limited =
            !values[this.state.activeConcept].settings.limited;
        this.setState({
            concepts: values,
        });
    };

    // -------------------------- Collapse --------------------------

    toggleCollapse = (component) => {
        this.setState({
            contentCollapsed: true,
            filesCollapsed: true,
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
        } else {
            this.setState({
                settingsCollapsed: !this.state.settingsCollapsed,
            });
        }
    };

    // -------------------------- Adding new concept --------------------------

    handleAddConcept = () => {
        const values = [...this.state.concepts];
        const flips = [...this.state.flipState];
        flips.push(false);
        values.push({
            chapter_id: this.props.match.params.chapterId,
            topic_num: this.props.match.params.topicNum,
            concepts_random_id: "",
            is_file_uploaded: false,
            content: {
                terms: "<p>Terms goes here</p>",
                definition: "<p>Definition goes here</p>",
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
            settings: {
                virtual_keyboard: [],
                limited: false,
            },
        });
        this.setState({
            concepts: values,
            flipState: flips,
            activeConcept: values.length - 1,
        });
    };

    copyConcept = async (index) => {
        const values = [...this.state.concepts];
        const flips = [...this.state.flipState];

        flips.push(flips[index]);
        values.splice(index + 1, 0, {
            chapter_id: this.chapterId,
            topic_num: this.topicNum,
            concepts_random_id: "",
            is_file_uploaded: false,
            content: {
                terms: values[index].content.terms,
                definition: values[index].content.definition,
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
            settings: {
                virtual_keyboard: values[index].settings.virtual_keyboard,
                limited: values[index].settings.limited,
            },
        });
        await this.setState({
            concepts: values,
            flipState: flips,
            activeConcept: index + 1,
        });
        window.MathJax.typeset();
    };

    editConcept = (index, concept) => {
        this.setState({
            showEdit_option: true,
            activeConcept: index,
            showErrorAlert: false,
            showSuccessAlert: false,
        });
    };

    deleteConcept = (index) => {
        const values = [...this.state.concepts];
        const flips = [...this.state.flipState];

        this.setState({
            showEdit_option: false,
            contentCollapsed: true,
            filesCollapsed: true,
            settingsCollapsed: true,
            activeConcept: index,
        });

        if (values[index].concepts_random_id !== "") {
            this.setState({
                selectedConcept: values[index].concepts_random_id,
                showConceptDelete_Modal: !this.state.showConceptDelete_Modal,
            });
        } else {
            flips.splice(index, 1);
            values.splice(index, 1);
            this.setState(
                {
                    concepts: values,
                    flipState: flips,
                    activeConcept: "",
                },
                () => {
                    if (values.length === 0) {
                        flips.push(false);
                        values.push({
                            chapter_id: this.props.match.params.chapterId,
                            topic_num: this.props.match.params.topicNum,
                            concepts_random_id: "",
                            is_file_uploaded: false,
                            content: {
                                terms: "<p>Terms goes here</p>",
                                definition: "<p>Definition goes here</p>",
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
                            settings: {
                                virtual_keyboard: [],
                                limited: false,
                            },
                        });
                        this.setState({
                            concepts: values,
                            flipState: flips,
                        });
                    }
                }
            );
        }
    };

    toggleDeleteModal = () => {
        this.setState({
            showConceptDelete_Modal: !this.state.showConceptDelete_Modal,
        });
    };

    handleConcept_Deletion = () => {
        const values = [...this.state.concepts];
        const flips = [...this.state.flipState];

        flips.splice(this.state.activeConcept, 1);
        values.splice(this.state.activeConcept, 1);

        this.setState(
            {
                concepts: values,
                flipState: flips,
                activeConcept: "",
            },
            () => {
                if (values.length === 0) {
                    flips.push(false);
                    values.push({
                        chapter_id: this.props.match.params.chapterId,
                        topic_num: this.props.match.params.topicNum,
                        concepts_random_id: "",
                        is_file_uploaded: false,
                        content: {
                            terms: "<p>Terms goes here</p>",
                            definition: "<p>Definition goes here</p>",
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
                        settings: {
                            virtual_keyboard: [],
                            limited: false,
                        },
                    });
                    this.setState({
                        concepts: values,
                        flipState: flips,
                    });
                }
            }
        );
        setTimeout(() => {
            this.setState(
                {
                    showConceptDelete_Modal: false,
                    page_loading: true,
                },
                () => {
                    this.loadConceptData();
                }
            );
        }, 1000);
    };

    // -------------------------- Publishing the concept --------------------------

    handlePublish = () => {
        this.setState({
            showSuccessAlert: false,
            showErrorAlert: false,
            page_loading: true,
        });

        const concepts = [...this.state.concepts];
        let id = [];
        for (let i = 0; i < concepts.length; i++) {
            if (concepts[i].concepts_random_id !== "") {
                id.push(concepts[i].concepts_random_id);
            } else {
                continue;
            }
        }

        if (id.length !== 0) {
            fetch(
                `${this.url}/teacher/subject/${this.subjectId}/chapter/concepts/publish/`,
                {
                    headers: this.headers,
                    method: "POST",
                    body: JSON.stringify({
                        concept_ids: id,
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

    handleFlip = (index) => {
        const flips = [...this.state.flipState];
        flips[index] = !flips[index];
        this.setState({
            flipState: flips,
        });
    };

    render() {
        let data = [...this.state.concepts];
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

                {/* Concept Deletion Modal */}
                {this.state.showConceptDelete_Modal ? (
                    <SingleContentDeleteModal
                        show={this.state.showConceptDelete_Modal}
                        onHide={this.toggleDeleteModal}
                        formSubmission={this.handleConcept_Deletion}
                        url={`${this.url}/teacher/subject/${this.subjectId}/chapter/concepts/`}
                        type="concept"
                        name=""
                        data={{
                            chapter_id: this.chapterId,
                            topic_num: this.topicNum,
                            concepts_random_id: this.state.selectedConcept,
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
                        url={`${this.url}/teacher/subject/${this.subjectId}/chapter/concepts/upload/`}
                        type="concept"
                        subjectId={this.subjectId}
                        chapterId={this.chapterId}
                        topic_num={this.topicNum}
                    />
                ) : null}

                <div className="row">
                    {/* ------------------------------ Terms Column ------------------------------ */}
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
                                    Concepts
                                </li>
                            </ol>
                        </nav>

                        {/* Header area */}
                        <div className="row align-items-center mb-4">
                            <div className="col-md-6">
                                <h5 className="primary-text mb-0">
                                    {`Concepts - ${this.props.topic_name}`}
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
                                        href={CONCEPT_TEMPLATE}
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

                        {/* -------------------- Concepts -------------------- */}
                        {this.state.concepts.map((concept, c_index) => {
                            return (
                                <div className="row mb-3" key={c_index}>
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
                                                    {c_index <= 8
                                                        ? `0${c_index + 1}`
                                                        : c_index + 1}
                                                </button>
                                            </div>
                                            <div className="col-md-12 col-3 mb-1">
                                                <button
                                                    type="button"
                                                    className="btn btn-light bg-white btn-block shadow-sm mr-2"
                                                    onClick={() =>
                                                        this.editConcept(
                                                            c_index,
                                                            concept
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
                                                        this.copyConcept(
                                                            c_index
                                                        )
                                                    }
                                                    disabled={
                                                        concept.concepts_random_id ===
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
                                                        this.deleteConcept(
                                                            c_index
                                                        )
                                                    }
                                                >
                                                    <i className="far fa-trash-alt fa-sm"></i>
                                                </button>
                                            </div>
                                        </div>
                                    </div>

                                    {/* ---------- Concept preview ---------- */}
                                    <div className="col-md-11 pl-md-0">
                                        <ReactCardFlip
                                            isFlipped={
                                                this.state.flipState[c_index]
                                            }
                                            flipDirection="vertical"
                                        >
                                            <div
                                                className={`card shadow-sm ${
                                                    this.state.activeConcept ===
                                                    c_index
                                                        ? "border-primary"
                                                        : ""
                                                }`}
                                                onClick={() =>
                                                    this.handleFlip(c_index)
                                                }
                                                style={{
                                                    minHeight: "120px",
                                                }}
                                            >
                                                <div className="card-body">
                                                    <div className="row">
                                                        {/* term */}
                                                        <div className="col-md-11 pr-md-0">
                                                            <div
                                                                dangerouslySetInnerHTML={{
                                                                    __html: concept
                                                                        .content
                                                                        .terms,
                                                                }}
                                                            ></div>
                                                        </div>
                                                        {/* File modal button */}
                                                        <div className="col-1 pl-0 text-right">
                                                            <button
                                                                className="btn btn-light bg-white shadow-sm"
                                                                onClick={(
                                                                    e
                                                                ) => {
                                                                    this.toggleModal(
                                                                        concept
                                                                            .content
                                                                            .images,
                                                                        concept
                                                                            .content
                                                                            .video,
                                                                        concept
                                                                            .content
                                                                            .audio
                                                                    );
                                                                    e.stopPropagation();
                                                                }}
                                                            >
                                                                <i className="far fa-folder-open"></i>
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div
                                                className={`card shadow-sm ${
                                                    this.state.activeConcept ===
                                                    c_index
                                                        ? "border-primary"
                                                        : ""
                                                }`}
                                                onClick={() =>
                                                    this.handleFlip(c_index)
                                                }
                                                style={{
                                                    minHeight: "120px",
                                                }}
                                            >
                                                <div className="card-body">
                                                    <div className="row">
                                                        {/* definition */}
                                                        <div className="col-md-11 pr-md-0">
                                                            <div
                                                                dangerouslySetInnerHTML={{
                                                                    __html: concept
                                                                        .content
                                                                        .definition,
                                                                }}
                                                            ></div>
                                                        </div>
                                                        {/* File modal button */}
                                                        <div className="col-1 pl-0 text-right">
                                                            <button
                                                                className="btn btn-light bg-white shadow-sm"
                                                                onClick={(
                                                                    e
                                                                ) => {
                                                                    this.toggleModal(
                                                                        concept
                                                                            .content
                                                                            .images,
                                                                        concept
                                                                            .content
                                                                            .video,
                                                                        concept
                                                                            .content
                                                                            .audio
                                                                    );
                                                                    e.stopPropagation();
                                                                }}
                                                            >
                                                                <i className="far fa-folder-open"></i>
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </ReactCardFlip>
                                    </div>
                                </div>
                            );
                        })}

                        <button
                            className="btn btn-primary btn-block shadow-none"
                            onClick={this.handleAddConcept}
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
                                            settingsCollapsed: true,
                                            activeConcept: "",
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
                                            {/* ---------- Terms ---------- */}
                                            <div className="form-group">
                                                <label>Terms</label>
                                                <CKeditor
                                                    data={
                                                        data[
                                                            this.state
                                                                .activeConcept
                                                        ].content.terms
                                                    }
                                                    onChange={
                                                        this.onEditorChange
                                                    }
                                                />
                                            </div>

                                            {/* ---------- Definition ---------- */}
                                            <div className="form-group">
                                                <label>Definition</label>
                                                <CKeditor
                                                    data={
                                                        data[
                                                            this.state
                                                                .activeConcept
                                                        ].content.definition
                                                    }
                                                    onChange={
                                                        this.handleDefinition
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
                                                    this.state.activeConcept
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
                                                                .activeConcept
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
                                                                    .activeConcept
                                                            ].content.video
                                                                .file_name !==
                                                                "" ||
                                                            data[
                                                                this.state
                                                                    .activeConcept
                                                            ].content.video
                                                                .path !== "" ||
                                                            data[
                                                                this.state
                                                                    .activeConcept
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
                                                                .activeConcept
                                                        ].content.video
                                                            .file_name === ""
                                                            ? "Choose file"
                                                            : data[
                                                                  this.state
                                                                      .activeConcept
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
                                                                .activeConcept
                                                        ].content.video.url
                                                    }
                                                    disabled={
                                                        data[
                                                            this.state
                                                                .activeConcept
                                                        ].content.video
                                                            .file_name !== "" ||
                                                        data[
                                                            this.state
                                                                .activeConcept
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
                                                    this.state.activeConcept
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

                                {/* ---------- Settings ---------- */}
                                {!this.groupId ? (
                                    <Card className="shadow-sm mb-2">
                                        <Accordion.Toggle
                                            as={Card.Body}
                                            variant="link"
                                            eventKey="2"
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

                                        <Accordion.Collapse eventKey="2">
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
                                                                                .activeConcept
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

export default connect(mapStateToProps)(TeacherConcepts);
