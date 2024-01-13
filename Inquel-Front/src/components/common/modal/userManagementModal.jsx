import React, { Component } from "react";
import { Modal, Spinner, Alert } from "react-bootstrap";

// User DELETE modal
export class UserDeleteModal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            errorMsg: "",
            successMsg: "",
            showErrorAlert: false,
            showSuccessAlert: false,
            showLoader: false,
        };
        this.headers = {
            Accept: "application/json",
            "Content-Type": "application/json",
        };
        this.headers[this.props.token] = localStorage.getItem(this.props.token);
    }

    handleDelete = () => {
        this.setState({
            showSuccessAlert: false,
            showErrorAlert: false,
            showLoader: true,
        });

        if (this.props.data.length !== 0) {
            let temp = [];
            let body = {};
            this.props.data.forEach((data) => {
                temp.push(data.id);
            });
            body[this.props.field] = temp;

            fetch(`${this.props.url}`, {
                method: "DELETE",
                headers: this.headers,
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
                        errorMsg: `Cannot delete user at the moment!`,
                        showErrorAlert: true,
                        showLoader: false,
                    });
                });
        } else {
            this.setState({
                errorMsg: `Please select a ${this.props.type} to delete`,
                showErrorAlert: true,
                showLoader: false,
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
                <Modal.Header closeButton>
                    Delete {this.props.type}
                </Modal.Header>
                <Modal.Body>
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
                    <p>
                        Are you sure that you want to delete this{" "}
                        {this.props.type}?
                    </p>
                    {this.props.data.map((item, index) => {
                        return (
                            <p className="small mb-2" key={index}>
                                {index + 1}. {item.username}
                            </p>
                        );
                    })}
                </Modal.Body>
                <Modal.Footer>
                    <button
                        className="btn btn-link btn-sm shadow-none mr-2"
                        onClick={this.props.toggleModal}
                    >
                        Cancel
                    </button>
                    <button
                        className="btn btn-primary btn-sm shadow-none"
                        onClick={this.handleDelete}
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
                        Delete
                    </button>
                </Modal.Footer>
            </Modal>
        );
    }
}

// User ENABLE / DISABLE modal
export class UserEnableDisableModal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            errorMsg: "",
            successMsg: "",
            showErrorAlert: false,
            showSuccessAlert: false,
            showLoader: false,
        };
        this.headers = {
            Accept: "application/json",
            "Content-Type": "application/json",
        };
        this.headers[this.props.token] = localStorage.getItem(this.props.token);
    }

    handleStatus = () => {
        this.setState({
            showSuccessAlert: false,
            showErrorAlert: false,
            showLoader: true,
        });

        if (this.props.data.length !== 0) {
            let temp = [];
            let body = {};
            this.props.data.forEach((data) => {
                temp.push(data.id);
            });
            body[this.props.field] = temp;

            fetch(`${this.props.url}`, {
                method: "PUT",
                headers: this.headers,
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
                        errorMsg: "Cannot update status at the moment!",
                        showErrorAlert: true,
                        showLoader: false,
                    });
                });
        } else {
            this.setState({
                errorMsg: `Please select a ${this.props.type} to enable / disable`,
                showErrorAlert: true,
                showLoader: false,
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
                <Modal.Header closeButton>Update Status</Modal.Header>
                <Modal.Body>
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
                    <p>
                        Are you sure that you want to enable / disable this{" "}
                        {this.props.type}?
                    </p>
                    {this.props.data.map((item, index) => {
                        return (
                            <p className="small mb-2" key={index}>
                                {index + 1}. {item.username}
                            </p>
                        );
                    })}
                </Modal.Body>
                <Modal.Footer>
                    <button
                        className="btn btn-link btn-sm shadow-none mr-2"
                        onClick={this.props.toggleModal}
                    >
                        Cancel
                    </button>
                    <button
                        className="btn btn-primary btn-sm shadow-none"
                        onClick={this.handleStatus}
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
                        Update
                    </button>
                </Modal.Footer>
            </Modal>
        );
    }
}

// User REMOVE modal
export class UserRemoveModal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            errorMsg: "",
            successMsg: "",
            showErrorAlert: false,
            showSuccessAlert: false,
            showLoader: false,
        };
        this.headers = {
            Accept: "application/json",
            "Content-Type": "application/json",
        };
        this.headers[this.props.token] = localStorage.getItem(this.props.token);
    }

    handleRemove = () => {
        this.setState({
            showSuccessAlert: false,
            showErrorAlert: false,
            showLoader: true,
        });

        if (this.props.data.length !== 0) {
            let temp = [];
            let body = {};
            this.props.data.forEach((data) => {
                temp.push(data.id);
            });
            body[this.props.field] = temp;

            fetch(`${this.props.url}`, {
                method: "PUT",
                headers: this.headers,
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
                        errorMsg: `Cannot remove user at the moment!`,
                        showErrorAlert: true,
                        showLoader: false,
                    });
                });
        } else {
            this.setState({
                errorMsg: `Please select a ${this.props.type} to remove`,
                showErrorAlert: true,
                showLoader: false,
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
                <Modal.Header closeButton>
                    Remove {this.props.type}
                </Modal.Header>
                <Modal.Body>
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
                    <p>
                        Are you sure that you want to remove this{" "}
                        {this.props.type}?
                    </p>
                    {this.props.data.map((item, index) => {
                        return (
                            <p className="small mb-2" key={index}>
                                {index + 1}. {item.username}
                            </p>
                        );
                    })}
                </Modal.Body>
                <Modal.Footer>
                    <button
                        className="btn btn-link btn-sm shadow-none mr-2"
                        onClick={this.props.toggleModal}
                    >
                        Cancel
                    </button>
                    <button
                        className="btn btn-primary btn-sm shadow-none"
                        onClick={this.handleRemove}
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
                        Remove
                    </button>
                </Modal.Footer>
            </Modal>
        );
    }
}
