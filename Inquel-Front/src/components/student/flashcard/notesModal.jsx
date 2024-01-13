import React, { Component } from "react";
import { baseUrl, studentUrl } from "../../../shared/baseUrl.js";
import { Modal, Spinner, Alert } from "react-bootstrap";
import CKeditor from "../../common/CKEditor";

class PersonalNotes extends Component {
    constructor(props) {
        super(props);
        this.state = {
            errorMsg: "",
            successMsg: "",
            showErrorAlert: false,
            showSuccessAlert: false,
            showLoader: false,

            personal_notes_id: this.props.data.personal_notes_id || "",
            title: this.props.data.personal_notes_title || "",
            content: this.props.data.personal_notes_content || "",
        };
        this.url = baseUrl + studentUrl;
        this.authToken = localStorage.getItem("Authorization");
        this.headers = {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: this.authToken,
        };
    }

    onEditorChange = async (evt) => {
        await this.setState({
            content: evt.editor.getData(),
        });
        window.MathJax.typeset();
    };

    handleTitle = (event) => {
        this.setState({
            title: event.target.value,
        });
    };

    handleSubmit = () => {
        this.setState({
            showLoader: true,
            showErrorAlert: false,
            showSuccessAlert: false,
        });
        if (this.state.title === "") {
            this.setState({
                errorMsg: "Enter notes title",
                showErrorAlert: true,
                showLoader: false,
            });
        } else if (this.state.content === "") {
            this.setState({
                errorMsg: "Enter notes content",
                showErrorAlert: true,
                showLoader: false,
            });
        } else {
            let body = {
                topic_num: this.props.topic_num,
                personal_notes_title: this.state.title,
                personal_notes_content: this.state.content,
            };

            if (this.state.personal_notes_id === "") {
                this.handlePOST(body);
            } else {
                this.handlePUT(body);
            }
        }
    };

    handlePOST = (body) => {
        if (this.props.type === "concept") {
            body["concept_id"] = this.props.id;
        } else {
            body["question_id"] = this.props.id;
        }
        let API_URL = this.props.courseId
            ? `${this.url}/student/sub/${this.props.subscriptionId}/course/${this.props.courseId}/chapter/${this.props.chapterId}/personal_notes/`
            : `${this.url}/student/subject/${this.props.subjectId}/chapter/${this.props.chapterId}/personalnotes/`;

        fetch(API_URL, {
            headers: this.headers,
            method: "POST",
            body: JSON.stringify(body),
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

    handlePUT = (body) => {
        if (this.props.type === "concept") {
            body["concept"] = true;
            body["question"] = false;
        } else {
            body["concept"] = false;
            body["question"] = true;
        }
        body["personal_notes_id"] = this.state.personal_notes_id;
        
        let API_URL = this.props.courseId
            ? `${this.url}/student/sub/${this.props.subscriptionId}/course/${this.props.courseId}/chapter/${this.props.chapterId}/personal_notes/`
            : `${this.url}/student/subject/${this.props.subjectId}/chapter/${this.props.chapterId}/personalnotes/`;

        fetch(API_URL, {
            headers: this.headers,
            method: "PUT",
            body: JSON.stringify(body),
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

    render() {
        return (
            <Modal
                show={this.props.show}
                onHide={this.props.onHide}
                size="xl"
                aria-labelledby="contained-modal-title-vcenter"
                centered
                scrollable
                enforceFocus={false}
            >
                <Modal.Header closeButton>Personal notes</Modal.Header>
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
                        <input
                            type="text"
                            name="title"
                            id="title"
                            value={this.state.title}
                            className="form-control border-secondary"
                            placeholder="Add notes title"
                            onChange={this.handleTitle}
                            autoComplete="off"
                            required
                        />
                    </div>
                    <div className="form-group">
                        <CKeditor
                            data={this.state.content}
                            onChange={this.onEditorChange}
                        />
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <button
                        className="btn btn-primary btn-block shadow-none"
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

export default PersonalNotes;
