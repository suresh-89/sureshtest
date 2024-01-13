import React, { Component } from "react";
import { Modal, Alert, Spinner } from "react-bootstrap";
import { baseUrl, teacherUrl } from "../../../shared/baseUrl.js";
import ReactSwitch from "../../common/switchComponent";

export class TopicModal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            topic_name: "",
            topics: this.props.topics,
            errorMsg: "",
            successMsg: "",
            showErrorAlert: false,
            showSuccessAlert: false,
            showLoader: false,
        };
        this.url = baseUrl + teacherUrl;
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
            showErrorAlert: false,
            showSuccessAlert: false,
        });

        const topics = this.state.topics;
        let body = {};

        // function formatData(arr, parentId, topic_name, ancestor) {
        //     arr.forEach((i) => {
        //         if (i.topic_num === parentId) {
        //             i.child = [
        //                 ...i.child,
        //                 {
        //                     topic_name: topic_name,
        //                     topic_num: `${parentId}.${i.child.length + 1}`,
        //                     parent_id: parentId,
        //                     next_topic: "",
        //                     child: [],
        //                     ancestor: ancestor,
        //                 },
        //             ];
        //         } else {
        //             formatData(i.child, parentId, topic_name, ancestor);
        //         }
        //     });
        //     return arr;
        // }

        function getKeyIndex(data) {
            let index = 1;

            if (data.length > 0) {
                let topic_num = data[data.length - 1].topic_num;
                let split = topic_num.split(".");
                index = Number(split[split.length - 1]) + 1;
            }

            return index;
        }

        function formatData(arr, parentId, ancestor, chapterId, topic_name) {
            arr.forEach((i) => {
                if (i.topic_num === parentId) {
                    body["chapter_id"] = chapterId;
                    body["topic_name"] = topic_name;
                    body["topic_num"] = `${parentId}.${getKeyIndex(i.child)}`;
                    body["parent_id"] = parentId;
                    body["ancestor"] = ancestor;
                } else {
                    formatData(
                        i.child,
                        parentId,
                        ancestor,
                        chapterId,
                        topic_name
                    );
                }
            });
            return body;
        }

        if (Number.isInteger(this.props.activeTopic)) {
            body["chapter_id"] = this.props.chapterId;
            body["topic_name"] = this.state.topic_name;
            body["topic_num"] = `${this.props.activeTopic}.${getKeyIndex(
                topics
            )}`;
            body["parent_id"] = "";
            body["ancestor"] = "";
        } else {
            body = formatData(
                topics,
                this.props.activeTopic,
                this.props.ancestor,
                this.props.chapterId,
                this.state.topic_name
            );
        }

        fetch(
            `${this.url}/teacher/subject/${this.props.subjectId}/chapter/topics/`,
            {
                headers: this.headers,
                method: "POST",
                body: JSON.stringify(body),
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

    handleTopic = (event) => {
        this.setState({
            topic_name: event.target.value,
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
                <Modal.Header closeButton>Create Topic</Modal.Header>
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

                        <label htmlFor="topic">Topic name</label>
                        <input
                            type="text"
                            name="topic"
                            id="topic"
                            className="form-control borders"
                            onChange={this.handleTopic}
                            placeholder="Topic name"
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

export class CycleTestModal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            cycle_test: "",
            chapter_id: this.props.chapter_id,
            errorMsg: "",
            successMsg: "",
            showErrorAlert: false,
            showSuccessAlert: false,
            showLoader: false,
        };
        this.url = baseUrl + teacherUrl;
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
            showErrorAlert: false,
            showSuccessAlert: false,
        });

        fetch(`${this.url}/teacher/subject/${this.props.subjectId}/cycle/`, {
            headers: this.headers,
            method: "POST",
            body: JSON.stringify({
                chapter_id: this.state.chapter_id,
                cycle_test_name: this.state.cycle_test,
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

    handleCycleTest = (event) => {
        this.setState({
            cycle_test: event.target.value,
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
                <Modal.Header closeButton>Create Cycle test</Modal.Header>
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

                        <label htmlFor="cycle_test">Cycle test name</label>
                        <input
                            type="text"
                            name="cycle_test"
                            id="cycle_test"
                            className="form-control borders"
                            onChange={this.handleCycleTest}
                            placeholder="Cycle test name"
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

export class IndependentCycleTestModal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            cycle_test: "",
            limited: false,
            chapter_id: this.props.chapter_id,
            errorMsg: "",
            successMsg: "",
            showErrorAlert: false,
            showSuccessAlert: false,
            showLoader: false,
        };
        this.url = baseUrl + teacherUrl;
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
            showErrorAlert: false,
            showSuccessAlert: false,
        });

        fetch(
            `${this.url}/teacher/independent/subject/${this.props.subjectId}/cycle/`,
            {
                headers: this.headers,
                method: "POST",
                body: JSON.stringify({
                    chapter_id: this.state.chapter_id,
                    cycle_test_name: this.state.cycle_test,
                    limited: this.state.limited,
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

    handleCycleTest = (event) => {
        this.setState({
            cycle_test: event.target.value,
        });
    };

    handleSwitch = () => {
        this.setState({
            limited: !this.state.limited,
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
                <Modal.Header closeButton>Create Cycle test</Modal.Header>
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

                        <div className="d-flex justify-content-end">
                            <div className="d-flex align-items-center">
                                <span className="mr-4">Limited</span>
                                <ReactSwitch
                                    onChange={this.handleSwitch}
                                    checked={this.state.limited}
                                />
                            </div>
                        </div>

                        <label htmlFor="cycle_test">Cycle test name</label>
                        <input
                            type="text"
                            name="cycle_test"
                            id="cycle_test"
                            className="form-control borders"
                            onChange={this.handleCycleTest}
                            placeholder="Cycle test name"
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

export class IndependentCycleEditModal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            cycle_test: this.props.data.cycle_test_name,
            limited: this.props.data.limited,
            chapter_id: this.props.chapter_id,
            errorMsg: "",
            successMsg: "",
            showErrorAlert: false,
            showSuccessAlert: false,
            showLoader: false,
        };
        this.url = baseUrl + teacherUrl;
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
            showErrorAlert: false,
            showSuccessAlert: false,
        });

        fetch(
            `${this.url}/teacher/independent/subject/${this.props.subjectId}/cycle/`,
            {
                headers: this.headers,
                method: "PATCH",
                body: JSON.stringify({
                    chapter_id: this.state.chapter_id,
                    cycle_test_id: this.props.data.cycle_test_id,
                    cycle_test_name: this.state.cycle_test,
                    limited: this.state.limited,
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

    handleCycleTest = (event) => {
        this.setState({
            cycle_test: event.target.value,
        });
    };

    handleSwitch = () => {
        this.setState({
            limited: !this.state.limited,
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
                <Modal.Header closeButton>Edit Cycle test</Modal.Header>
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

                        <div className="d-flex justify-content-end">
                            <div className="d-flex align-items-center">
                                <span className="mr-4">Limited</span>
                                <ReactSwitch
                                    onChange={this.handleSwitch}
                                    checked={this.state.limited}
                                />
                            </div>
                        </div>

                        <label htmlFor="cycle_test">Cycle test name</label>
                        <input
                            type="text"
                            name="cycle_test"
                            id="cycle_test"
                            className="form-control borders"
                            onChange={this.handleCycleTest}
                            placeholder="Cycle test name"
                            value={this.state.cycle_test}
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
                            Update
                        </button>
                    </Modal.Footer>
                </form>
            </Modal>
        );
    }
}

export class QuizModal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            quiz_name: "",
            errorMsg: "",
            successMsg: "",
            showErrorAlert: false,
            showSuccessAlert: false,
            showLoader: false,
        };
        this.url = baseUrl + teacherUrl;
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
            showErrorAlert: false,
            showSuccessAlert: false,
        });

        fetch(
            `${this.url}/teacher/subject/${this.props.subjectId}/chapter/${this.props.chapterId}/quiz/`,
            {
                headers: this.headers,
                method: "POST",
                body: JSON.stringify({
                    chapter_id: this.props.chapter_id,
                    quiz_name: this.state.quiz_name,
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

    handleQuizName = (event) => {
        this.setState({
            quiz_name: event.target.value,
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
                <Modal.Header closeButton>Create Quiz</Modal.Header>
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

                        <label htmlFor="quiz_name">Quiz name</label>
                        <input
                            type="text"
                            name="quiz_name"
                            id="quiz_name"
                            className="form-control borders"
                            onChange={this.handleQuizName}
                            placeholder="Quiz name"
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
