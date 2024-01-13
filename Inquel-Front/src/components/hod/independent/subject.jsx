import React, { Component } from "react";
import Wrapper from "../wrapper";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import Select from "react-select";
import { Modal, Alert, Spinner, Dropdown } from "react-bootstrap";
import { baseUrl, hodUrl } from "../../../shared/baseUrl.js";
import Loading from "../../common/loader";
import AlertBox from "../../common/alert";
import {
    SingleContentDeleteModal,
    ContentUpdateModal,
} from "../../common/modal/contentManagementModal";
import ScoreCardTable from "../../common/scorecard";
import storeDispatch from "../../../redux/dispatch";
import { CHAPTER, SEMESTER, SIMULATION } from "../../../redux/action";

const mapStateToProps = (state) => ({
    subject_name: state.content.subject_name,
    profile: state.user.profile,
});

class Scorecard extends Component {
    constructor(props) {
        super(props);
        this.state = {
            scorecard: [],
            errorMsg: "",
            successMsg: "",
            showErrorAlert: false,
            showSuccessAlert: false,
            showLoader: false,
            page_loading: true,
        };
        this.subjectId = this.props.subjectId;
        this.chapterId = this.props.chapterId;
        this.url = baseUrl + hodUrl;
        this.authToken = localStorage.getItem("Authorization");
        this.headers = {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: this.authToken,
        };
    }

    loadScoreCard = () => {
        fetch(`${this.url}/hod/subject/${this.subjectId}/scorecard/`, {
            method: "GET",
            headers: this.headers,
        })
            .then((res) => res.json())
            .then((result) => {
                if (result.sts === true) {
                    this.setState({
                        scorecard: result.data.score_card_config,
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

        fetch(`${this.url}/hod/subject/${this.subjectId}/scorecard/`, {
            method: "POST",
            headers: this.headers,
            body: JSON.stringify({
                score_card_config: this.state.scorecard,
            }),
        })
            .then((res) => res.json())
            .then((result) => {
                if (result.sts === true) {
                    this.setState({
                        successMsg: result.msg,
                        showSuccessAlert: true,
                        showLoader: false,
                    });
                    this.props.onHide();
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
                        Save
                    </button>
                </Modal.Footer>
            </Modal>
        );
    }
}

class ChapterModal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            teacherData: [],
            chapter: "",
            teacher: "",
            weightage: "",

            errorMsg: "",
            successMsg: "",
            showErrorAlert: false,
            showSuccessAlert: false,
            showLoader: false,
        };
    }

    handleInput = (event) => {
        this.setState({
            [event.target.name]: event.target.value,
        });
    };

    handleTeacher = (event) => {
        this.setState({
            teacher: event.value.toString(),
        });
    };

    componentDidMount = () => {
        var url = baseUrl + hodUrl;
        var authToken = localStorage.getItem("Authorization");
        var headers = {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: authToken,
        };

        fetch(`${url}/hod/teacher/`, {
            headers: headers,
            method: "GET",
        })
            .then((res) => res.json())
            .then((result) => {
                this.setState({
                    teacherData: result.data,
                });
            })
            .catch((err) => {
                console.log(err);
                this.setState({
                    errorMsg: "Something went wrong!",
                    showErrorAlert: true,
                });
            });
    };

    handleSubmit = (event) => {
        event.preventDefault();

        this.setState({
            showErrorAlert: false,
            showSuccessAlert: false,
            showLoader: true,
        });

        var url = baseUrl + hodUrl;
        var authToken = localStorage.getItem("Authorization");
        var headers = {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: authToken,
        };

        if (this.state.chapter === "") {
            this.setState({
                errorMsg: "Enter chapter name",
                showErrorAlert: true,
                showLoader: false,
            });
        } else if (this.state.teacher === "") {
            this.setState({
                errorMsg: "Select teacher from the list",
                showErrorAlert: true,
                showLoader: false,
            });
        } else if (this.state.weightage === "") {
            this.setState({
                errorMsg: "Enter weightage",
                showErrorAlert: true,
                showLoader: false,
            });
        } else {
            fetch(
                `${url}/hod/subject/${this.props.subjectId}/assign/teacher/`,
                {
                    headers: headers,
                    method: "POST",
                    body: JSON.stringify({
                        chapter_name: this.state.chapter,
                        teacher_id: this.state.teacher,
                        weightage: this.state.weightage,
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
        }
    };

    render() {
        return (
            <Modal
                show={this.props.show}
                onHide={this.props.onHide}
                size="md"
                aria-labelledby="contained-modal-title-vcenter"
                centered
            >
                <Modal.Header closeButton>Create Chapter</Modal.Header>
                <form onSubmit={this.handleSubmit} autoComplete="off">
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
                        <div className="form-group">
                            <label htmlFor="chapter">Chapter name</label>
                            <input
                                type="text"
                                name="chapter"
                                id="chapter"
                                className="form-control borders"
                                onChange={this.handleInput}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="teacher">Teacher</label>
                            <Select
                                className="basic-single borders"
                                placeholder="Select teacher"
                                isSearchable={true}
                                name="teacher_id"
                                id="teacher_id"
                                options={this.state.teacherData.map((list) => {
                                    return {
                                        value: list.id,
                                        label:
                                            list.full_name !== ""
                                                ? list.full_name
                                                : list.username,
                                    };
                                })}
                                onChange={this.handleTeacher}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="weightage">Weightage</label>
                            <input
                                type="text"
                                name="weightage"
                                id="weightage"
                                className="form-control borders"
                                onChange={this.handleInput}
                                required
                            />
                        </div>
                    </Modal.Body>
                    <Modal.Footer>
                        <button
                            type="submit"
                            className="btn btn-primary btn-block shadow-none"
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
                            Save
                        </button>
                    </Modal.Footer>
                </form>
            </Modal>
        );
    }
}

class ChapterReassignModal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            teacherData: [],
            teacher: "",

            errorMsg: "",
            successMsg: "",
            showErrorAlert: false,
            showSuccessAlert: false,
            showLoader: false,
        };
        this.url = baseUrl + hodUrl;
        this.authToken = localStorage.getItem("Authorization");
        this.headers = {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: this.authToken,
        };
    }

    handleInput = (event) => {
        this.setState({
            teacher: event.value.toString(),
        });
    };

    componentDidMount = () => {
        fetch(`${this.url}/hod/teacher/`, {
            headers: this.headers,
            method: "GET",
        })
            .then((res) => res.json())
            .then((result) => {
                this.setState({
                    teacherData: result.data,
                });
            })
            .catch((err) => {
                console.log(err);
                this.setState({
                    errorMsg: "Something went wrong!",
                    showErrorAlert: true,
                });
            });
    };

    handleSubmit = (event) => {
        event.preventDefault();

        this.setState({
            showErrorAlert: false,
            showSuccessAlert: false,
            showLoader: true,
        });

        if (this.state.teacher === "") {
            this.setState({
                errorMsg: "Please select a teacher to assign",
                showErrorAlert: true,
                showLoader: false,
            });
        } else {
            fetch(
                `${this.url}/hod/subject/${this.props.subjectId}/assign/teacher/`,
                {
                    headers: this.headers,
                    method: "PATCH",
                    body: JSON.stringify({
                        chapter_id: this.props.chapter_id,
                        teacher_id: this.state.teacher,
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
        }
    };

    render() {
        return (
            <Modal
                show={this.props.show}
                onHide={this.props.onHide}
                size="md"
                aria-labelledby="contained-modal-title-vcenter"
                centered
            >
                <Modal.Header closeButton>Chapter Re-assigning</Modal.Header>
                <form onSubmit={this.handleSubmit} autoComplete="off">
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
                        <label htmlFor="teacher">Teacher</label>
                        <Select
                            className="basic-single borders"
                            placeholder="Select teacher"
                            isSearchable={true}
                            name="teacher_id"
                            id="teacher_id"
                            options={this.state.teacherData.map((list) => {
                                return {
                                    value: list.id,
                                    label:
                                        list.full_name !== ""
                                            ? list.full_name
                                            : list.username,
                                };
                            })}
                            onChange={this.handleInput}
                            required
                        />
                    </Modal.Body>
                    <Modal.Footer>
                        <button
                            type="submit"
                            className="btn btn-primary btn-block shadow-none"
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
                            Save
                        </button>
                    </Modal.Footer>
                </form>
            </Modal>
        );
    }
}

class SimulationModal extends Component {
    constructor() {
        super();
        this.state = {
            simulation_exam_name: "",
            errorMsg: "",
            successMsg: "",
            showErrorAlert: false,
            showSuccessAlert: false,
            showLoader: false,
        };
        this.url = baseUrl + hodUrl;
        this.authToken = localStorage.getItem("Authorization");
        this.headers = {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: this.authToken,
        };
    }

    handleSubmit = (event) => {
        event.preventDefault();
        this.setState({
            showLoader: true,
        });

        fetch(`${this.url}/hod/subject/${this.props.subjectId}/simulation/`, {
            headers: this.headers,
            method: "POST",
            body: JSON.stringify({
                simulation_exam_name: this.state.simulation_exam_name,
            }),
        })
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

    handleInput = (event) => {
        this.setState({
            simulation_exam_name: event.target.value,
        });
    };

    render() {
        return (
            <Modal
                show={this.props.show}
                onHide={this.props.onHide}
                size="md"
                aria-labelledby="contained-modal-title-vcenter"
                centered
            >
                <Modal.Header closeButton>Create Simulation Exam</Modal.Header>
                <form onSubmit={this.handleSubmit} autoComplete="off">
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

                        <label htmlFor="simulation">Simulation name</label>
                        <input
                            type="text"
                            name="simulation"
                            id="simulation"
                            className="form-control borders"
                            onChange={this.handleInput}
                            placeholder="Enter simulation title"
                            required
                        />
                    </Modal.Body>
                    <Modal.Footer>
                        <button className="btn btn-primary btn-block shadow-none">
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
                            Add
                        </button>
                    </Modal.Footer>
                </form>
            </Modal>
        );
    }
}

class HODSubject extends Component {
    constructor(props) {
        super(props);
        this.state = {
            showModal: false,
            showReassignModal: false,
            showChapterDeleteModal: false,
            showSimulationModal: false,
            showSimulationUpdateModal: false,
            showSimulationDeleteModal: false,
            showScorecardModal: false,

            chapterData: [],
            chapter_id: "",
            semesters: [],
            simulation: [],
            selectedData: {},
            permissions: this.props.profile.permissions,

            errorMsg: "",
            successMsg: "",
            showErrorAlert: false,
            showSuccessAlert: false,
            page_loading: true,
        };
        this.subjectId = this.props.match.params.subjectId;
        this.url = baseUrl + hodUrl;
        this.authToken = localStorage.getItem("Authorization");
        this.headers = {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: this.authToken,
        };
    }

    toggleModal = () => {
        this.setState({ showModal: !this.state.showModal });
    };

    toggleReassignModal = (data) => {
        this.setState({
            showReassignModal: !this.state.showReassignModal,
            chapter_id: data,
        });
    };

    toggleChapterDeleteModal = (data) => {
        this.setState({
            showChapterDeleteModal: !this.state.showChapterDeleteModal,
            selectedData: data,
        });
    };

    toggleSimulationModal = (type, data) => {
        if (type === "ADD") {
            this.setState({
                showSimulationModal: !this.state.showSimulationModal,
            });
        } else if (type === "UPDATE") {
            this.setState({
                showSimulationUpdateModal:
                    !this.state.showSimulationUpdateModal,
                selectedData: data,
            });
        } else if (type === "DELETE") {
            this.setState({
                showSimulationDeleteModal:
                    !this.state.showSimulationDeleteModal,
                selectedData: data,
            });
        }
    };

    toggleScorecardModal = () => {
        this.setState({
            showScorecardModal: !this.state.showScorecardModal,
        });
    };

    loadSubjectData = () => {
        fetch(`${this.url}/hod/subject/${this.subjectId}/`, {
            headers: this.headers,
            method: "GET",
        })
            .then((res) => res.json())
            .then((result) => {
                if (result.sts === true) {
                    this.setState({
                        chapterData: result.data.chapters,
                        semesters: result.data.semesters,
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
    };

    loadSimulationData = () => {
        fetch(`${this.url}/hod/subject/${this.subjectId}/simulation/`, {
            headers: this.headers,
            method: "GET",
        })
            .then((res) => res.json())
            .then((result) => {
                if (result.sts === true) {
                    this.setState({
                        simulation: result.data,
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
    };

    componentDidMount = () => {
        document.title = `${this.props.subject_name} - HOD | IQLabs`;

        this.loadSubjectData();
        this.loadSimulationData();
    };

    formSubmission = () => {
        setTimeout(() => {
            this.setState({
                showModal: false,
                showReassignModal: false,
                showChapterDeleteModal: false,
            });
        }, 1000);
        this.loadSubjectData();
    };

    simulationFormSubmission = () => {
        setTimeout(() => {
            this.setState({
                showSimulationModal: false,
                showSimulationUpdateModal: false,
                showSimulationDeleteModal: false,
            });
        }, 1000);
        this.loadSimulationData();
    };

    render() {
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

                {/* Chapter Modal */}
                {this.state.showModal ? (
                    <ChapterModal
                        show={this.state.showModal}
                        onHide={this.toggleModal}
                        formSubmission={this.formSubmission}
                        subjectId={this.subjectId}
                    />
                ) : null}

                {/* Chapter reassign Modal */}
                {this.state.showReassignModal ? (
                    <ChapterReassignModal
                        show={this.state.showReassignModal}
                        onHide={this.toggleReassignModal}
                        formSubmission={this.formSubmission}
                        subjectId={this.subjectId}
                        chapter_id={this.state.chapter_id}
                    />
                ) : null}

                {/* Chapter Delete modal */}
                {this.state.showChapterDeleteModal ? (
                    <SingleContentDeleteModal
                        show={this.state.showChapterDeleteModal}
                        onHide={this.toggleChapterDeleteModal}
                        formSubmission={this.formSubmission}
                        url={`${this.url}/hod/subject/${this.subjectId}/assign/teacher/`}
                        type="Chapter"
                        name={this.state.selectedData.chapter_name}
                        data={{
                            chapter_id: this.state.selectedData.chapter_id,
                        }}
                    />
                ) : (
                    ""
                )}

                {/* Simulation create modal */}
                {this.state.showSimulationModal ? (
                    <SimulationModal
                        show={this.state.showSimulationModal}
                        onHide={() => this.toggleSimulationModal("ADD")}
                        formSubmission={this.simulationFormSubmission}
                        subjectId={this.subjectId}
                    />
                ) : null}

                {/* Simulation update modal */}
                {this.state.showSimulationUpdateModal ? (
                    <ContentUpdateModal
                        show={this.state.showSimulationUpdateModal}
                        onHide={() => this.toggleSimulationModal("UPDATE")}
                        formSubmission={this.simulationFormSubmission}
                        url={`${this.url}/hod/subject/${this.subjectId}/simulation/`}
                        type="Simulation exam"
                        name={this.state.selectedData.simulation_name}
                        data={{
                            simulation_id:
                                this.state.selectedData.simulation_id,
                        }}
                    />
                ) : (
                    ""
                )}

                {/* Simulation Delete modal */}
                {this.state.showSimulationDeleteModal ? (
                    <SingleContentDeleteModal
                        show={this.state.showSimulationDeleteModal}
                        onHide={() => this.toggleSimulationModal("DELETE")}
                        formSubmission={this.simulationFormSubmission}
                        url={`${this.url}/hod/subject/${this.subjectId}/simulation/`}
                        type="Simulation exam"
                        name={this.state.selectedData.simulation_name}
                        data={{
                            simulation_id:
                                this.state.selectedData.simulation_id,
                        }}
                    />
                ) : (
                    ""
                )}

                {/* Scorecard modal */}
                {this.state.showScorecardModal ? (
                    <Scorecard
                        show={this.state.showScorecardModal}
                        onHide={this.toggleScorecardModal}
                        subjectId={this.subjectId}
                        chapterId={this.chapterId}
                    />
                ) : (
                    ""
                )}

                <div className="row align-items-center mb-3">
                    <div className="col-md-6">
                        {/* Breadcrumb */}
                        <nav aria-label="breadcrumb">
                            <ol className="breadcrumb">
                                <li className="breadcrumb-item">
                                    <Link to="/hod">
                                        <i className="fas fa-home fa-sm"></i>
                                    </Link>
                                </li>
                                <li className="breadcrumb-item active">
                                    <span>Subject:</span>
                                    {this.props.subject_name}
                                </li>
                            </ol>
                        </nav>
                    </div>
                    <div className="col-md-6 text-right">
                        <button
                            className="btn btn-primary btn-sm shadow-none mr-1"
                            onClick={this.toggleModal}
                        >
                            Add Chapter
                        </button>
                        {Object.entries(this.state.permissions).length !== 0 ? (
                            this.state.permissions.sim_exam === true ? (
                                <button
                                    className="btn btn-primary btn-sm shadow-none mr-1"
                                    onClick={() =>
                                        this.toggleSimulationModal("ADD")
                                    }
                                >
                                    Add Simulation
                                </button>
                            ) : (
                                ""
                            )
                        ) : (
                            ""
                        )}
                        <button
                            className="btn btn-primary btn-sm shadow-none mr-1"
                            onClick={this.toggleScorecardModal}
                        >
                            Scorecard
                        </button>
                        <Link to={`${this.props.match.url}/course`}>
                            <button className="btn btn-primary btn-sm shadow-none">
                                Configure Course
                            </button>
                        </Link>
                    </div>
                </div>

                <div className="card shadow-sm">
                    <div className="table-responsive">
                        <table className="table">
                            <thead className="secondary-bg">
                                <tr>
                                    <th scope="col">Course structure</th>
                                    <th scope="col">Status</th>
                                    <th scope="col">Teacher assigned</th>
                                    <th scope="col"></th>
                                    <th scope="col" className="text-right">
                                        Action
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {/* Chapter list */}
                                {this.state.chapterData.length !== 0
                                    ? this.state.chapterData.map(
                                          (list, index) => {
                                              return (
                                                  <tr key={index}>
                                                      <td>
                                                          {list.chapter_name}
                                                      </td>
                                                      <td>
                                                          {list.chapter_status.toLowerCase() ===
                                                          "yet to start" ? (
                                                              <span className="text-danger text-capitalize">
                                                                  {
                                                                      list.chapter_status
                                                                  }
                                                              </span>
                                                          ) : list.chapter_status.toLowerCase() ===
                                                            "in progress" ? (
                                                              <span className="text-warning text-capitalize">
                                                                  {
                                                                      list.chapter_status
                                                                  }
                                                              </span>
                                                          ) : list.chapter_status.toLowerCase() ===
                                                            "ready for review" ? (
                                                              <span className="text-primary text-capitalize">
                                                                  {
                                                                      list.chapter_status
                                                                  }
                                                              </span>
                                                          ) : list.chapter_status.toLowerCase() ===
                                                            "approved" ? (
                                                              <span className="text-success text-capitalize">
                                                                  {
                                                                      list.chapter_status
                                                                  }
                                                              </span>
                                                          ) : (
                                                              list.chapter_status
                                                          )}
                                                      </td>
                                                      <td>
                                                          {
                                                              list.teacher
                                                                  .full_name
                                                          }
                                                      </td>
                                                      <td>
                                                          <button
                                                              className="btn btn-primary-invert btn-sm"
                                                              onClick={() =>
                                                                  this.toggleReassignModal(
                                                                      list.chapter_id
                                                                  )
                                                              }
                                                          >
                                                              Re assign
                                                          </button>
                                                      </td>
                                                      <td className="d-flex justify-content-end">
                                                          {list.publish ===
                                                          true ? (
                                                              <Link
                                                                  to={`${this.props.match.url}/chapter/${list.chapter_id}`}
                                                              >
                                                                  <button
                                                                      className="btn btn-primary-invert btn-sm shadow-sm"
                                                                      onClick={() => {
                                                                          storeDispatch(
                                                                              CHAPTER,
                                                                              list.chapter_name
                                                                          );
                                                                      }}
                                                                  >
                                                                      <i className="far fa-eye"></i>
                                                                  </button>
                                                              </Link>
                                                          ) : (
                                                              <button
                                                                  className="btn btn-primary-invert btn-sm shadow-sm"
                                                                  disabled
                                                              >
                                                                  <i className="far fa-eye"></i>
                                                              </button>
                                                          )}
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
                                                                          .chapterData
                                                                          .length <=
                                                                      2
                                                                          ? "position-fixed"
                                                                          : "position-absolute"
                                                                  }`}
                                                              >
                                                                  <Dropdown.Item
                                                                      onClick={() =>
                                                                          this.toggleChapterDeleteModal(
                                                                              list
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
                                    : null}

                                {/* Semester list */}
                                {this.state.semesters.length !== 0
                                    ? this.state.semesters.map(
                                          (list, index) => {
                                              return (
                                                  <tr key={index}>
                                                      <td>
                                                          {list.semester_name}
                                                      </td>
                                                      <td></td>
                                                      <td></td>
                                                      <td></td>
                                                      <td className="text-right">
                                                          <Link
                                                              to={`${this.props.match.url}/semester/${list.semester_id}`}
                                                          >
                                                              <button
                                                                  className="btn btn-primary-invert btn-sm shadow-sm mr-2"
                                                                  onClick={() => {
                                                                      storeDispatch(
                                                                          SEMESTER,
                                                                          list.semester_name
                                                                      );
                                                                  }}
                                                              >
                                                                  <i className="far fa-eye"></i>
                                                              </button>
                                                          </Link>
                                                          <button
                                                              className="btn btn-primary-invert btn-sm shadow-sm invisible"
                                                          >
                                                              <i className="fas fa-ellipsis-v"></i>
                                                          </button>
                                                      </td>
                                                  </tr>
                                              );
                                          }
                                      )
                                    : null}

                                {/* ----- Simulation list ----- */}
                                {this.state.simulation.length !== 0
                                    ? this.state.simulation.map(
                                          (item, index) => {
                                              return (
                                                  <tr key={index}>
                                                      <td>
                                                          {item.simulation_name}
                                                      </td>
                                                      <td></td>
                                                      <td></td>
                                                      <td></td>
                                                      <td className="d-flex justify-content-end">
                                                          <Link
                                                              to={`${this.props.match.url}/simulation/${item.simulation_id}`}
                                                          >
                                                              <button
                                                                  className="btn btn-primary-invert btn-sm shadow-sm"
                                                                  onClick={() => {
                                                                      storeDispatch(
                                                                          SIMULATION,
                                                                          item.simulation_name
                                                                      );
                                                                  }}
                                                              >
                                                                  View / Edit
                                                              </button>
                                                          </Link>

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
                                                                          .simulation
                                                                          .length <=
                                                                      2
                                                                          ? "position-fixed"
                                                                          : "position-absolute"
                                                                  }`}
                                                              >
                                                                  <Dropdown.Item
                                                                      onClick={() =>
                                                                          this.toggleSimulationModal(
                                                                              "UPDATE",
                                                                              item
                                                                          )
                                                                      }
                                                                  >
                                                                      <i className="far fa-edit fa-sm mr-1"></i>{" "}
                                                                      Edit
                                                                  </Dropdown.Item>
                                                                  <Dropdown.Item
                                                                      onClick={() =>
                                                                          this.toggleSimulationModal(
                                                                              "DELETE",
                                                                              item
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
                                    : null}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Loading component */}
                {this.state.page_loading ? <Loading /> : ""}
            </Wrapper>
        );
    }
}

export default connect(mapStateToProps)(HODSubject);
