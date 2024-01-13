import React, { Component } from "react";
import Wrapper from "../wrapper";
import { connect } from "react-redux";
import Select from "react-select";
import { Link } from "react-router-dom";
import { Modal, Alert, Spinner, Dropdown } from "react-bootstrap";
import { baseUrl, teacherUrl } from "../../../shared/baseUrl.js";
import Loading from "../../common/loader";
import AlertBox from "../../common/alert";
import ScoreCardTable from "../../common/scorecard";

const mapStateToProps = (state) => ({
    group_name: state.content.group_name,
    subject_name: state.content.subject_name,
    chapter_name: state.content.chapter_name,
    cycle_name: state.content.cycle_name,
});

class Scorecard extends Component {
    constructor(props) {
        super(props);
        this.state = {
            errorMsg: "",
            successMsg: "",
            showErrorAlert: false,
            showSuccessAlert: false,
            showLoader: false,
            scorecard: [],
            page_loading: true,
        };
        this.subjectId = this.props.subjectId;
        this.chapterId = this.props.chapterId;
        this.cycle_testId = this.props.cycle_testId;
        this.url = baseUrl + teacherUrl;
        this.authToken = localStorage.getItem("Authorization");
        this.headers = {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: this.authToken,
        };
    }

    loadDefault_ScoreCard = () => {
        fetch(
            `${this.url}/teacher/subject/${this.subjectId}/cycle/scorecard/`,
            {
                method: "GET",
                headers: this.headers,
            }
        )
            .then((res) => res.json())
            .then((result) => {
                if (result.sts === true) {
                    this.setState({
                        scorecard: result.data,
                    });
                } else {
                    this.setState({
                        errorMsg: result.msg,
                        showErrorAlert: true,
                    });
                }
                this.setState({
                    page_loading: false,
                });
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

    loadScoreCard = () => {
        fetch(
            `${this.url}/teacher/subject/${this.subjectId}/cycle/scorecard/?cycle_test_id=${this.cycle_testId}`,
            {
                method: "GET",
                headers: this.headers,
            }
        )
            .then((res) => res.json())
            .then((result) => {
                if (result.sts === true) {
                    if (
                        Object.keys(result.data.score_card_config).length !== 0
                    ) {
                        this.setState({
                            scorecard: result.data.score_card_config,
                            page_loading: false,
                        });
                    } else {
                        this.loadDefault_ScoreCard();
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
    };

    componentDidMount = () => {
        this.loadScoreCard();
    };

    handleData = (event, category, type, index) => {
        let scorecard = this.state.scorecard;

        if (type === "remarks") {
            var temp = Object.entries(scorecard);
            for (let i = 0; i < Object.keys(scorecard).length; i++) {
                if (temp[i][0] === category) {
                    temp[i][0] = event.target.value;
                } else {
                    continue;
                }
            }
            scorecard = Object.fromEntries(temp);
        } else if (type === "range") {
            scorecard[category][type][index] = Number(event.target.value);
        } else if (type === "retake" || type === "reduction_duration") {
            scorecard[category][type] = `${event.target.value.trim()} week`;
        } else if (type === "reduction") {
            scorecard[category][type] = `${event.target.value.trim()}%`;
        } else {
            scorecard[category][type] = event.target.value;
        }

        this.setState({
            scorecard: scorecard,
        });
    };

    handleSubmit = () => {
        this.setState({
            showErrorAlert: false,
            showSuccessAlert: false,
            showLoader: true,
        });

        fetch(
            `${this.url}/teacher/subject/${this.subjectId}/cycle/scorecard/`,
            {
                method: "POST",
                headers: this.headers,
                body: JSON.stringify({
                    cycle_test_id: this.cycle_testId,
                    score_card_config: this.state.scorecard,
                }),
            }
        )
            .then((res) => res.json())
            .then((result) => {
                if (result.sts === true) {
                    this.setState({
                        successMsg: result.msg,
                        showSuccessAlert: true,
                        showLoader: false,
                    });
                    this.props.formSubmission();
                } else {
                    this.setState({
                        errorMsg: result.msg,
                        showErrorAlert: true,
                        showLoader: false,
                    });
                }
            })
            .catch((err) => {
                console.log(err);
                this.setState({
                    errorMsg: "Something went wrong!",
                    showErrorAlert: true,
                    showLoader: false,
                });
            });
    };

    render() {
        return (
            <Modal
                show={this.props.show}
                onHide={this.props.onHide}
                size="xl"
                aria-labelledby="contained-modal-title-vcenter"
                centered
            >
                <Modal.Header closeButton className="align-items-center">
                    Scorecard Configuration
                    {this.state.page_loading ? (
                        <Spinner
                            as="span"
                            animation="border"
                            size="sm"
                            role="status"
                            aria-hidden="true"
                            className="ml-3 mb-0"
                        />
                    ) : (
                        ""
                    )}
                </Modal.Header>
                <Modal.Body>
                    <Alert
                        variant="danger"
                        show={this.state.showErrorAlert}
                        onClose={() => {
                            this.setState({
                                showErrorAlert: false,
                            });
                        }}
                        dismissible
                    >
                        {this.state.errorMsg}
                    </Alert>
                    <Alert
                        variant="success"
                        show={this.state.showSuccessAlert}
                        onClose={() => {
                            this.setState({
                                showSuccessAlert: false,
                            });
                        }}
                        dismissible
                    >
                        {this.state.successMsg}
                    </Alert>

                    {/* <!----- Scorecard Table -----> */}

                    <ScoreCardTable
                        scorecard={this.state.scorecard}
                        handleData={this.handleData}
                    />
                </Modal.Body>
                <Modal.Footer className="text-right">
                    <button
                        className="btn btn-primary btn-sm shadow-none"
                        onClick={this.handleSubmit}
                    >
                        {this.state.showLoader ? (
                            <Spinner
                                as="span"
                                animation="border"
                                size="sm"
                                role="status"
                                aria-hidden="true"
                                className="mr-2"
                            />
                        ) : (
                            ""
                        )}
                        Save & Close
                    </button>
                </Modal.Footer>
            </Modal>
        );
    }
}

class TeacherCycleTestAuto extends Component {
    constructor(props) {
        super(props);
        this.state = {
            showModal: false,
            sections: [
                {
                    section_id: "",
                    section_description: "",
                    question_type: "",
                    category: "",
                    any_questions: "",
                    no_questions: "",
                    total_questions: "",
                    marks: "",
                    total_marks: "",
                },
            ],
            filterData: [{ category: [], marks: [] }],
            duration: "",
            attempts: [],
            selectedAttempt: "",
            question_type: [],
            publish: false,

            section_description_update: false,
            questions_update: false,

            errorMsg: "",
            successMsg: "",
            showErrorAlert: false,
            showSuccessAlert: false,
            page_loading: true,
        };
        this.groupId = this.props.match.params.groupId;
        this.subjectId = this.props.match.params.subjectId;
        this.chapterId = this.props.match.params.chapterId;
        this.cycle_testId = this.props.match.params.cycle_testId;
        this.url = baseUrl + teacherUrl;
        this.filterURL = `${this.url}/teacher/subject/${this.subjectId}/cycle/${this.cycle_testId}/filter/?chapter_id=${this.chapterId}`;
        this.authToken = localStorage.getItem("Authorization");
        this.headers = {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: this.authToken,
        };
    }

    componentDidMount = () => {
        this.loadAttemptData();
        this.loadSectionData();
    };

    // loads attempt and question type data
    loadAttemptData = () => {
        fetch(
            `${this.url}/teacher/subject/${this.subjectId}/cycle/${this.cycle_testId}/filter/?chapter_id=${this.chapterId}`,
            {
                method: "GET",
                headers: this.headers,
            }
        )
            .then((res) => res.json())
            .then((result) => {
                if (result.sts === true) {
                    if (result.data.attempts !== undefined) {
                        this.setState({
                            attempts: result.data.attempts,
                            selectedAttempt: result.data.attempts[0],
                            question_type: result.data.question_type,
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
    };

    loadSectionData = () => {
        fetch(
            `${this.url}/teacher/subject/${this.subjectId}/cycle/${this.cycle_testId}/auto/`,
            {
                method: "GET",
                headers: this.headers,
            }
        )
            .then((res) => res.json())
            .then((result) => {
                if (result.sts === true) {
                    if (
                        result.data.auto_test !== undefined &&
                        result.data.auto_test.length !== 0
                    ) {
                        const section = [];
                        let duration = "";
                        for (let i = 0; i < result.data.auto_test.length; i++) {
                            section.push({
                                section_id: result.data.auto_test[i].section_id,
                                section_description:
                                    result.data.auto_test[i]
                                        .section_description,
                                question_type:
                                    result.data.auto_test[i].question_type,
                                category: result.data.auto_test[i].category,
                                any_questions:
                                    result.data.auto_test[i].any_questions,
                                no_questions:
                                    result.data.auto_test[i].total_questions,
                                total_questions: "",
                                marks: result.data.auto_test[i].mark,
                                total_marks:
                                    result.data.auto_test[i].total_marks,
                            });
                            duration =
                                result.duration !== null ? result.duration : "";
                        }
                        this.setState(
                            {
                                sections: section,
                                publish: result.data.publish,
                                duration: duration,
                            },
                            () => {
                                this.loadsFilterData();
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
    };

    loadsFilterData = () => {
        const data = [...this.state.sections];
        let filterData = [];
        for (let i = 0; i < data.length; i++) {
            Promise.all([
                fetch(
                    `${this.filterURL}&question_type=${data[i].question_type}`,
                    {
                        method: "GET",
                        headers: this.headers,
                    }
                ).then((res) => res.json()),
                fetch(
                    `${this.filterURL}&question_type=${
                        data[i].question_type
                    }&category=${data[i].category.replace("&", "%26")}`,
                    {
                        method: "GET",
                        headers: this.headers,
                    }
                ).then((res) => res.json()),
                fetch(
                    `${this.filterURL}&question_type=${
                        data[i].question_type
                    }&category=${data[i].category.replace("&", "%26")}&marks=${
                        data[i].marks
                    }`,
                    {
                        method: "GET",
                        headers: this.headers,
                    }
                ).then((res) => res.json()),
            ])
                .then((result) => {
                    filterData[i] = {
                        category: result[0].data.category,
                        marks: result[1].data.marks,
                    };
                    data[i].total_questions = result[2].data.total_questions;
                    this.setState({
                        sections: data,
                        filterData: filterData,
                        page_loading: false,
                    });
                })
                .catch((err) => {
                    console.log(err);
                    this.setState({
                        errorMsg: "Something went wrong!",
                        showErrorAlert: true,
                        page_loading: false,
                    });
                });
        }
    };

    handleAttempt = (event) => {
        this.setState({
            selectedAttempt: event.value,
        });
    };

    // loads category data on selecting question type
    handleType = (index, event) => {
        let section = [...this.state.sections];
        let filterData = [...this.state.filterData];
        section[index].question_type = event.target.value;
        if (filterData[index] === undefined) {
            filterData.push({ category: [], marks: [] });
        } else {
            filterData[index].category = [];
        }
        section[index].category = "";
        section[index].marks = "";
        section[index].total_questions = "";
        section[index].no_questions = "";
        section[index].any_questions = "";
        section[index].total_marks = "";
        filterData[index].marks = [];
        this.setState({
            sections: section,
            filterData: filterData,
        });

        if (event.target.value !== "") {
            fetch(`${this.filterURL}&question_type=${event.target.value}`, {
                method: "GET",
                headers: this.headers,
            })
                .then((res) => res.json())
                .then((result) => {
                    if (result.sts === true) {
                        const filterData = [...this.state.filterData];
                        filterData[index].category = result.data.category;
                        this.setState({
                            filterData: filterData,
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
            const filterData = [...this.state.filterData];
            filterData[index].category = [];
            this.setState({
                filterData: filterData,
            });
        }
    };

    // loads marks data on selecting a category
    handleCategory = (index, event) => {
        const filterData = [...this.state.filterData];
        const section = [...this.state.sections];
        section[index].category = event.target.value;
        section[index].marks = "";
        section[index].total_questions = "";
        section[index].no_questions = "";
        section[index].any_questions = "";
        section[index].total_marks = "";
        filterData[index].marks = [];
        this.setState({
            sections: section,
            filterData: filterData,
        });

        if (event.target.value !== "") {
            fetch(
                `${this.filterURL}&question_type=${
                    section[index].question_type
                }&category=${event.target.value.replace("&", "%26")}`,
                {
                    method: "GET",
                    headers: this.headers,
                }
            )
                .then((res) => res.json())
                .then((result) => {
                    if (result.sts === true) {
                        filterData[index].marks = result.data.marks;
                        this.setState({
                            filterData: filterData,
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
        }
    };

    // loads total question on selecting marks
    handleMarks = (index, event) => {
        const section = [...this.state.sections];

        if (event.target.value !== "") {
            section[index].marks = parseFloat(event.target.value);

            fetch(
                `${this.filterURL}&question_type=${
                    section[index].question_type
                }&category=${section[index].category.replace(
                    "&",
                    "%26"
                )}&marks=${event.target.value}`,
                {
                    method: "GET",
                    headers: this.headers,
                }
            )
                .then((res) => res.json())
                .then((result) => {
                    if (result.sts === true) {
                        section[index].total_questions =
                            result.data.total_questions;
                        this.setState({
                            sections: section,
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
            section[index].marks = "";
            section[index].total_questions = "";
            this.setState({
                sections: section,
            });
        }
    };

    handleDuration = (event) => {
        this.setState({
            duration: event.target.value,
            section_description_update: true,
        });
    };

    handleSectionData = (index, event, type) => {
        const section = [...this.state.sections];
        if (type === "name") {
            section[index].section_description = event.target.value;
            if (section[index].section_id !== "") {
                this.setState({
                    section_description_update: true,
                });
            }
        } else if (type === "any_questions") {
            if (section[index].marks !== "") {
                section[index].any_questions = Number(event.target.value);
                section[index].total_marks =
                    Number(section[index].marks) * Number(event.target.value);
            } else {
                section[index].any_questions = event.target.value;
            }
            if (section[index].section_id !== "") {
                this.setState({
                    questions_update: true,
                });
            }
        } else if (type === "no_questions") {
            if (event.target.value !== "") {
                section[index].no_questions = Number(event.target.value);
            } else {
                section[index].no_questions = event.target.value;
            }
            if (section[index].section_id !== "") {
                this.setState({
                    questions_update: true,
                });
            }
        }
        this.setState({
            sections: section,
        });
    };

    handleSubmit = (index, event) => {
        event.preventDefault();

        this.setState({
            showErrorAlert: false,
            showSuccessAlert: false,
            page_loading: true,
        });

        const section = [...this.state.sections];

        if (
            Number(this.state.duration) <= 0 ||
            Number(this.state.duration) > 360
        ) {
            this.setState({
                errorMsg: "Duration minutes should in between 1 to 360",
                showErrorAlert: true,
                page_loading: false,
            });
        } else if (section[index].section_description === "") {
            this.setState({
                errorMsg: "Enter the section name",
                showErrorAlert: true,
                page_loading: false,
            });
        } else if (section[index].question_type === "") {
            this.setState({
                errorMsg: "Select a question type",
                showErrorAlert: true,
                page_loading: false,
            });
        } else if (section[index].category === "") {
            this.setState({
                errorMsg: "Select a category",
                showErrorAlert: true,
                page_loading: false,
            });
        } else if (section[index].marks === "") {
            this.setState({
                errorMsg: "Select marks",
                showErrorAlert: true,
                page_loading: false,
            });
        } else if (
            section[index].any_questions === "" ||
            section[index].any_questions === 0 ||
            section[index].any_questions > section[index].no_questions
        ) {
            this.setState({
                errorMsg:
                    "Enter any questions within the range of No. of question",
                showErrorAlert: true,
                page_loading: false,
            });
        } else if (
            section[index].no_questions === "" ||
            section[index].no_questions === 0 ||
            section[index].no_questions > section[index].total_questions
        ) {
            this.setState({
                errorMsg:
                    "Enter no. of questions within the range of Total question",
                showErrorAlert: true,
                page_loading: false,
            });
        } else {
            if (section[index].section_id === "") {
                this.handlePOST(section, index);
            } else {
                this.handlePUT(section, index);
            }
        }
    };

    handlePOST = (section, index) => {
        fetch(
            `${this.url}/teacher/subject/${this.subjectId}/cycle/${this.cycle_testId}/auto/`,
            {
                method: "POST",
                headers: this.headers,
                body: JSON.stringify({
                    cycle_test_id: this.cycle_testId,
                    chapter_id: this.chapterId,
                    duration: this.state.duration.toString(),
                    section_description: section[index].section_description,
                    question_type: section[index].question_type,
                    category: section[index].category,
                    total_questions: section[index].no_questions,
                    any_questions: section[index].any_questions,
                    mark: section[index].marks,
                    total_marks: section[index].total_marks,
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
                    this.setState(
                        {
                            page_loading: true,
                        },
                        () => {
                            this.loadSectionData();
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

    handlePUT = (section, index) => {
        if (this.state.questions_update === true) {
            fetch(
                `${this.url}/teacher/subject/${this.subjectId}/cycle/${this.cycle_testId}/auto/`,
                {
                    method: "PUT",
                    headers: this.headers,
                    body: JSON.stringify({
                        cycle_test_id: this.cycle_testId,
                        chapter_id: this.chapterId,
                        question_type: section[index].question_type,
                        category: section[index].category,
                        total_questions: section[index].no_questions,
                        any_questions: section[index].any_questions,
                        mark: section[index].marks,
                        total_marks: section[index].total_marks,
                        section_id: section[index].section_id,
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
                                this.loadSectionData();
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
        }

        if (this.state.section_description_update === true) {
            fetch(
                `${this.url}/teacher/subject/${this.subjectId}/cycle/${this.cycle_testId}/auto/`,
                {
                    method: "PATCH",
                    headers: this.headers,
                    body: JSON.stringify({
                        chapter_id: this.chapterId,
                        section_id: section[index].section_id,
                        duration: this.state.duration.toString(),
                        section_description: section[index].section_description,
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
                                this.loadSectionData();
                            }
                        );
                    } else {
                        this.setState({
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
        }

        if(this.state.section_description_update === false && this.state.questions_update === false) {
            this.setState({
                page_loading: false
            })
        }

        this.setState({
            section_description_update: false,
            questions_update: false,
        });
    };

    addSection = () => {
        let filterData = [...this.state.filterData];
        let sections = [...this.state.sections];
        sections.push({
            section_id: "",
            section_description: "",
            question_type: "",
            category: "",
            any_questions: "",
            no_questions: "",
            total_questions: "",
            marks: "",
            total_marks: "",
        });
        filterData.push({ category: [], marks: [] });
        this.setState({
            sections: sections,
            filterData: filterData,
        });
    };

    removeSection = (index, section_id) => {
        this.setState({
            showSuccessAlert: false,
            showErrorAlert: false,
            showLoader: true,
        });

        if (section_id !== "") {
            fetch(
                `${this.url}/teacher/subject/${this.subjectId}/cycle/${this.cycle_testId}/auto/`,
                {
                    method: "DELETE",
                    headers: this.headers,
                    body: JSON.stringify({
                        chapter_id: this.chapterId,
                        section_id: section_id,
                    }),
                }
            )
                .then((res) => res.json())
                .then((result) => {
                    if (result.sts === true) {
                        this.setState({
                            successMsg: result.msg,
                            showSuccessAlert: true,
                            showLoader: true,
                        });

                        const filterData = [...this.state.filterData];
                        const sections = [...this.state.sections];
                        sections.splice(index, 1);
                        filterData.splice(index, 1);
                        this.setState(
                            {
                                sections: sections,
                                filterData: filterData,
                            },
                            () => {
                                if (this.state.sections.length === 0) {
                                    sections.push({
                                        section_id: "",
                                        section_description: "",
                                        question_type: "",
                                        category: "",
                                        any_questions: "",
                                        no_questions: "",
                                        total_questions: "",
                                        marks: "",
                                        total_marks: "",
                                    });
                                    filterData.push({
                                        category: [],
                                        marks: [],
                                    });
                                    this.setState({
                                        sections: sections,
                                        filterData: filterData,
                                    });
                                }
                            }
                        );
                    } else {
                        this.setState({
                            errorMsg: result.msg,
                            showErrorAlert: true,
                            showLoader: false,
                        });
                    }
                })
                .catch((err) => {
                    console.log(err);
                    this.setState({
                        errorMsg: "Something went wrong!",
                        showErrorAlert: true,
                        showLoader: false,
                    });
                });
        } else {
            const filterData = [...this.state.filterData];
            const sections = [...this.state.sections];
            sections.splice(index, 1);
            filterData.splice(index, 1);
            this.setState(
                {
                    sections: sections,
                    filterData: filterData,
                },
                () => {
                    if (this.state.sections.length === 0) {
                        sections.push({
                            section_id: "",
                            section_description: "",
                            question_type: "",
                            category: "",
                            any_questions: "",
                            no_questions: "",
                            total_questions: "",
                            marks: "",
                            total_marks: "",
                        });
                        filterData.push({ category: [], marks: [] });
                        this.setState({
                            sections: sections,
                            filterData: filterData,
                        });
                    }
                }
            );
        }
    };

    sectionRedirect = (id) => {
        this.setState({
            showErrorAlert: false,
        });
        if (this.state.selectedAttempt === "") {
            this.setState({
                errorMsg: "Select attempt to preview section details",
                showErrorAlert: true,
            });
        } else {
            this.props.history.push(
                `${this.props.match.url}/section/${id}/?attempt=${this.state.selectedAttempt}`
            );
        }
    };

    handlePublish = () => {
        this.setState({
            showErrorAlert: false,
            showSuccessAlert: false,
            page_loading: true,
        });

        fetch(`${this.url}/teacher/subject/${this.subjectId}/cycle/publish/`, {
            method: "POST",
            headers: this.headers,
            body: JSON.stringify({
                chapter_id: this.chapterId,
                cycle_test_id: this.cycle_testId,
            }),
        })
            .then((res) => res.json())
            .then((result) => {
                if (result.sts === true) {
                    this.setState({
                        successMsg: `Cycle test ${
                            this.state.publish === false
                                ? "published"
                                : "unpublished"
                        }`,
                        showSuccessAlert: true,
                        page_loading: false,
                        publish: !this.state.publish,
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

    toggleModal = () => {
        this.setState({
            showModal: !this.state.showModal,
        });
    };

    formSubmission = () => {
        setTimeout(() => {
            this.setState({
                showModal: !this.state.showModal,
            });
        }, 1000);
    };

    render() {
        document.title = `${this.props.cycle_name} - Teacher | IQLabs`;
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

                {/* Scorecard modal */}
                {this.state.showModal ? (
                    <Scorecard
                        show={this.state.showModal}
                        onHide={this.toggleModal}
                        subjectId={this.subjectId}
                        chapterId={this.chapterId}
                        cycle_testId={this.cycle_testId}
                        formSubmission={this.formSubmission}
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
                                {this.props.chapter_name}
                            </Link>
                        </li>
                        <li className="breadcrumb-item active">
                            {this.props.cycle_name}
                        </li>
                    </ol>
                </nav>

                {/* Header configuration */}
                <div className="row align-items-center mb-3">
                    <div className="col-md-6">
                        <div className="row align-items-center">
                            <div className="col-md-6">
                                <input
                                    type="number"
                                    name="duration"
                                    className="form-control form-shadow"
                                    placeholder="Enter duration (In minutes)"
                                    onChange={this.handleDuration}
                                    value={this.state.duration || ""}
                                    autoComplete="off"
                                    min="1"
                                    max="360"
                                    required
                                />
                            </div>
                            <div className="col-md-6">
                                <Select
                                    className="basic-single form-shadow"
                                    placeholder="Select attempt"
                                    isSearchable={true}
                                    name="attempt"
                                    value={(this.state.attempts || []).map(
                                        (data) => {
                                            return data ===
                                                this.state.selectedAttempt
                                                ? {
                                                      value: data,
                                                      label: data,
                                                  }
                                                : "";
                                        }
                                    )}
                                    options={(this.state.attempts || []).map(
                                        (data) => {
                                            return {
                                                value: data,
                                                label: data,
                                            };
                                        }
                                    )}
                                    onChange={this.handleAttempt}
                                    required
                                />
                            </div>
                        </div>
                    </div>
                    <div className="col-md-6 text-right">
                        {this.state.sections.length !== 0 ? (
                            this.state.sections[0].section_id !== "" ? (
                                <button
                                    className="btn btn-primary btn-sm shadow-none"
                                    onClick={(event) => {
                                        this.setState(
                                            {
                                                page_loading: true,
                                                section_description_update: true,
                                            },
                                            () => {
                                                this.handlePUT(
                                                    this.state.sections,
                                                    0
                                                );
                                            }
                                        );
                                    }}
                                >
                                    Save
                                </button>
                            ) : null
                        ) : null}
                        <button
                            className="btn btn-primary btn-sm shadow-none ml-1"
                            onClick={this.toggleModal}
                        >
                            Score Configuration
                        </button>
                        <button
                            className="btn btn-primary btn-sm shadow-none ml-1"
                            onClick={this.handlePublish}
                            disabled={
                                this.state.sections.length !== 0
                                    ? this.state.sections[0].section_id === ""
                                        ? true
                                        : false
                                    : true
                            }
                        >
                            {this.state.publish ? "Unpublish" : "Publish"}
                        </button>
                    </div>
                </div>

                <div
                    className="card shadow-sm mb-3"
                    style={{ overflowX: "auto" }}
                >
                    <div
                        className="table-responsive"
                        style={{ minWidth: "1000px" }}
                    >
                        <table className="table table-hover">
                            <thead className="primary-bg text-white">
                                <tr style={{ whiteSpace: "nowrap" }}>
                                    <th scope="col">Section Description</th>
                                    <th scope="col">Question Type</th>
                                    <th scope="col">Category</th>
                                    <th scope="col">Marks</th>
                                    <th scope="col">Total Questions</th>
                                    <th scope="col">No. of Questions</th>
                                    <th scope="col">Any Questions</th>
                                    <th scope="col">Total Marks</th>
                                    <th scope="col">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {this.state.sections.length !== 0
                                    ? this.state.sections.map(
                                          (section, index) => {
                                              return (
                                                  <tr key={index}>
                                                      <td>
                                                          <input
                                                              type="text"
                                                              className="form-control form-control-sm border-secondary"
                                                              placeholder={`Section Description ${
                                                                  index + 1
                                                              }`}
                                                              value={
                                                                  section.section_description ||
                                                                  ""
                                                              }
                                                              onChange={(
                                                                  event
                                                              ) =>
                                                                  this.handleSectionData(
                                                                      index,
                                                                      event,
                                                                      "name"
                                                                  )
                                                              }
                                                              required
                                                          />
                                                      </td>
                                                      <td>
                                                          <select
                                                              name="type"
                                                              id="type"
                                                              className="form-control form-control-sm border-secondary"
                                                              onChange={(
                                                                  event
                                                              ) =>
                                                                  this.handleType(
                                                                      index,
                                                                      event
                                                                  )
                                                              }
                                                              value={
                                                                  section.question_type ||
                                                                  ""
                                                              }
                                                              required
                                                          >
                                                              <option value="">
                                                                  Select type
                                                              </option>
                                                              {this.state
                                                                  .question_type
                                                                  .length !== 0
                                                                  ? this.state.question_type.map(
                                                                        (
                                                                            data,
                                                                            index
                                                                        ) => {
                                                                            return (
                                                                                <option
                                                                                    value={
                                                                                        data ||
                                                                                        ""
                                                                                    }
                                                                                    key={
                                                                                        index
                                                                                    }
                                                                                >
                                                                                    {data ===
                                                                                    "type_1"
                                                                                        ? "Type 1"
                                                                                        : "type_2"
                                                                                        ? "Type 2"
                                                                                        : ""}
                                                                                </option>
                                                                            );
                                                                        }
                                                                    )
                                                                  : null}
                                                          </select>
                                                      </td>
                                                      <td>
                                                          <select
                                                              name="category"
                                                              className="form-control form-control-sm border-secondary"
                                                              onChange={(
                                                                  event
                                                              ) =>
                                                                  this.handleCategory(
                                                                      index,
                                                                      event
                                                                  )
                                                              }
                                                              value={
                                                                  section.category ||
                                                                  ""
                                                              }
                                                              disabled={
                                                                  section.question_type ===
                                                                  ""
                                                                      ? true
                                                                      : false
                                                              }
                                                              required
                                                          >
                                                              <option value="">
                                                                  Select
                                                                  category
                                                              </option>
                                                              {this.state
                                                                  .filterData[
                                                                  index
                                                              ] !== undefined
                                                                  ? this.state
                                                                        .filterData[
                                                                        index
                                                                    ].category
                                                                        .length !==
                                                                    0
                                                                      ? this.state.filterData[
                                                                            index
                                                                        ].category.map(
                                                                            (
                                                                                data,
                                                                                c_index
                                                                            ) => {
                                                                                return (
                                                                                    <option
                                                                                        value={
                                                                                            data ||
                                                                                            ""
                                                                                        }
                                                                                        key={
                                                                                            c_index
                                                                                        }
                                                                                    >
                                                                                        {
                                                                                            data
                                                                                        }
                                                                                    </option>
                                                                                );
                                                                            }
                                                                        )
                                                                      : null
                                                                  : null}
                                                          </select>
                                                      </td>
                                                      <td>
                                                          <select
                                                              name="marks"
                                                              id="marks"
                                                              className="form-control form-control-sm border-secondary"
                                                              value={
                                                                  section.marks ||
                                                                  ""
                                                              }
                                                              onChange={(
                                                                  event
                                                              ) =>
                                                                  this.handleMarks(
                                                                      index,
                                                                      event
                                                                  )
                                                              }
                                                              disabled={
                                                                  section.category ===
                                                                  ""
                                                                      ? true
                                                                      : false
                                                              }
                                                              required
                                                          >
                                                              <option value="">
                                                                  Select marks
                                                              </option>
                                                              {this.state
                                                                  .filterData[
                                                                  index
                                                              ] !== undefined
                                                                  ? this.state
                                                                        .filterData[
                                                                        index
                                                                    ].marks
                                                                        .length !==
                                                                    0
                                                                      ? this.state.filterData[
                                                                            index
                                                                        ].marks.map(
                                                                            (
                                                                                data,
                                                                                c_index
                                                                            ) => {
                                                                                return (
                                                                                    <option
                                                                                        value={
                                                                                            data ||
                                                                                            ""
                                                                                        }
                                                                                        key={
                                                                                            c_index
                                                                                        }
                                                                                    >
                                                                                        {
                                                                                            data
                                                                                        }
                                                                                    </option>
                                                                                );
                                                                            }
                                                                        )
                                                                      : null
                                                                  : null}
                                                          </select>
                                                      </td>
                                                      <td>
                                                          <input
                                                              className="form-control form-control-sm border-secondary"
                                                              type="text"
                                                              value={
                                                                  section.total_questions ||
                                                                  ""
                                                              }
                                                              placeholder="Total question"
                                                              disabled
                                                          />
                                                      </td>
                                                      <td>
                                                          <input
                                                              className="form-control form-control-sm border-secondary"
                                                              type="text"
                                                              value={
                                                                  section.no_questions ||
                                                                  ""
                                                              }
                                                              placeholder="No. of questions"
                                                              onChange={(
                                                                  event
                                                              ) =>
                                                                  this.handleSectionData(
                                                                      index,
                                                                      event,
                                                                      "no_questions"
                                                                  )
                                                              }
                                                              disabled={
                                                                  section.total_questions ===
                                                                  ""
                                                                      ? true
                                                                      : false
                                                              }
                                                              required
                                                          />
                                                      </td>
                                                      <td>
                                                          <input
                                                              className="form-control form-control-sm border-secondary"
                                                              type="text"
                                                              value={
                                                                  section.any_questions ||
                                                                  ""
                                                              }
                                                              placeholder="Any questions"
                                                              onChange={(
                                                                  event
                                                              ) =>
                                                                  this.handleSectionData(
                                                                      index,
                                                                      event,
                                                                      "any_questions"
                                                                  )
                                                              }
                                                              disabled={
                                                                  section.no_questions ===
                                                                  ""
                                                                      ? true
                                                                      : false
                                                              }
                                                              required
                                                          />
                                                      </td>
                                                      <td>
                                                          <input
                                                              className="form-control form-control-sm border-secondary"
                                                              type="text"
                                                              placeholder="Total marks"
                                                              value={
                                                                  section.total_marks ||
                                                                  ""
                                                              }
                                                              disabled
                                                          />
                                                      </td>
                                                      <td className="d-flex justify-content-end">
                                                          {section.section_id !==
                                                          "" ? (
                                                              <button
                                                                  className="btn btn-primary-invert btn-sm shadow-sm"
                                                                  onClick={() => {
                                                                      this.sectionRedirect(
                                                                          section.section_id
                                                                      );
                                                                  }}
                                                              >
                                                                  <i className="fas fa-eye"></i>
                                                              </button>
                                                          ) : null}

                                                          <Dropdown>
                                                              <Dropdown.Toggle
                                                                  variant="white"
                                                                  className="btn btn-link btn-sm shadow-none caret-off ml-2"
                                                              >
                                                                  <i className="fas fa-ellipsis-v"></i>
                                                              </Dropdown.Toggle>

                                                              <Dropdown.Menu
                                                                  className={`${
                                                                      this.state
                                                                          .sections
                                                                          .length <=
                                                                      2
                                                                          ? "position-fixed"
                                                                          : "position-absolute"
                                                                  }`}
                                                              >
                                                                  <Dropdown.Item
                                                                      onClick={(
                                                                          event
                                                                      ) =>
                                                                          this.handleSubmit(
                                                                              index,
                                                                              event
                                                                          )
                                                                      }
                                                                  >
                                                                      <i className="far fa-save fa-sm mr-1"></i>{" "}
                                                                      Save
                                                                  </Dropdown.Item>
                                                                  <Dropdown.Item
                                                                      onClick={() =>
                                                                          this.removeSection(
                                                                              index,
                                                                              section.section_id
                                                                          )
                                                                      }
                                                                  >
                                                                      <i className="far fa-trash-alt fa-sm mr-1"></i>{" "}
                                                                      Delete
                                                                  </Dropdown.Item>
                                                              </Dropdown.Menu>
                                                          </Dropdown>
                                                      </td>
                                                  </tr>
                                              );
                                          }
                                      )
                                    : ""}
                            </tbody>
                        </table>
                    </div>
                </div>

                <button
                    className="btn btn-light bg-white btn-block shadow-sm shadow-none"
                    onClick={this.addSection}
                >
                    Add Section +
                </button>

                {/* Loading component */}
                {this.state.page_loading ? <Loading /> : ""}
            </Wrapper>
        );
    }
}

export default connect(mapStateToProps)(TeacherCycleTestAuto);
