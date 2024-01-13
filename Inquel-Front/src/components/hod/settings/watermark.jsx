import React, { Component, useState } from "react";
import { connect } from "react-redux";
import { baseUrl, hodUrl } from "../../../shared/baseUrl.js";
import { Modal, Alert, Spinner } from "react-bootstrap";
import axios from "axios";
import AlertBox from "../../common/alert";
import Loading from "../../common/loader";

const mapStateToProps = (state) => ({
    profile_data: state.user.profile,
});

class ImageUploadModal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            image: "",
            errorMsg: "",
            successMsg: "",
            showErrorAlert: false,
            showSuccessAlert: false,
            showLoader: false,
        };
        this.url = baseUrl + hodUrl;
        this.authToken = localStorage.getItem("Authorization");
    }

    handleImageFile = (event) => {
        this.setState({
            showSuccessAlert: false,
            showErrorAlert: false,
            showLoader: true,
        });

        let form_data = new FormData();
        form_data.append("watermark_image_1", event.target.files[0]);

        const options = {
            headers: {
                Accept: "application/json",
                "Content-Type": "multipart/form-data",
                Authorization: this.authToken,
            },
        };

        let extension = event.target.files[0].name.split(".");
        let format = ["jpg", "jpeg", "png", "webp"];

        if (!format.includes(extension[extension.length - 1].toLowerCase())) {
            this.setState({
                errorMsg: "Invalid file format!",
                showErrorAlert: true,
                showLoader: false,
            });
        } else if (event.target.files[0].size > 5242880) {
            this.setState({
                errorMsg: "File size exceeds more then 5MB!",
                showErrorAlert: true,
                showLoader: false,
            });
        } else {
            if (
                this.props.watermark_image === null ||
                this.props.watermark_image === ""
            ) {
                axios
                    .post(
                        `${this.url}/hod/profile/watermark/`,
                        form_data,
                        options
                    )
                    .then((result) => {
                        if (result.data.sts === true) {
                            this.setState({
                                successMsg: result.data.msg,
                                showSuccessAlert: true,
                                showLoader: false,
                            });
                            this.props.formSubmission();
                        } else {
                            this.setState({
                                errorMsg: result.data.msg,
                                showErrorAlert: true,
                                showLoader: false,
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
                            showLoader: false,
                        });
                    });
            } else {
                axios
                    .patch(
                        `${this.url}/hod/profile/watermark/`,
                        form_data,
                        options
                    )
                    .then((result) => {
                        if (result.data.sts === true) {
                            this.setState({
                                successMsg: result.data.msg,
                                showSuccessAlert: true,
                                showLoader: false,
                            });
                            this.props.formSubmission();
                        } else {
                            this.setState({
                                errorMsg: result.data.msg,
                                showErrorAlert: true,
                                showLoader: false,
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
                            showLoader: false,
                        });
                    });
            }
        }
    };

    render() {
        return (
            <>
                <Modal
                    show={this.props.show}
                    onHide={this.props.onHide}
                    size="md"
                    aria-labelledby="contained-modal-title-vcenter"
                    centered
                >
                    <Modal.Header closeButton className="align-items-center">
                        Upload Image
                        {this.state.showLoader ? (
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

                        <div className="custom-file">
                            <input
                                type="file"
                                className="custom-file-input"
                                id="img1"
                                accept="image/*"
                                aria-describedby="inputGroupFileAddon01"
                                onChange={(event) =>
                                    this.handleImageFile(event)
                                }
                            />
                            <label className="custom-file-label" htmlFor="img1">
                                Choose file
                            </label>
                        </div>
                        <small
                            className="form-text text-muted mb-2"
                            style={{ marginTop: "0px" }}
                        >
                            Select only .png .jpg .jpeg .webp format. Max size
                            is 5MB
                        </small>
                    </Modal.Body>
                </Modal>
            </>
        );
    }
}

const UpdateWatermark = (props) => {
    const url = baseUrl + hodUrl;
    const headers = {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: localStorage.getItem("Authorization"),
    };
    const [showModal, toggleModal] = useState(false);
    const [isLoading, setLoading] = useState(false);
    const [responseMsg, setResponseMsg] = useState("");
    const [showErrorAlert, setErrorAlert] = useState(false);
    const [showSuccessAlert, setSuccessAlert] = useState(false);

    const handleWatermarkDelete = () => {
        setErrorAlert(false);
        setSuccessAlert(false);
        setLoading(true);

        fetch(`${url}/hod/profile/watermark/`, {
            method: "DELETE",
            headers: headers,
            body: JSON.stringify({
                watermark_url: props.profile_data.watermark_image,
            }),
        })
            .then((res) => res.json())
            .then((result) => {
                if (result.sts === true) {
                    setResponseMsg(result.msg);
                    setSuccessAlert(true);
                    setLoading(false);
                    props.loadData();
                } else {
                    setResponseMsg(result.msg);
                    setErrorAlert(true);
                    setLoading(false);
                }
            })
            .catch((err) => {
                console.log(err);
                setResponseMsg("Something went wrong!");
                setErrorAlert(true);
                setLoading(false);
            });
    };

    return (
        <>
            {/* Alert message */}
            <AlertBox
                errorMsg={responseMsg}
                successMsg={responseMsg}
                showErrorAlert={showErrorAlert}
                showSuccessAlert={showSuccessAlert}
                toggleSuccessAlert={() => setSuccessAlert(false)}
                toggleErrorAlert={() => setErrorAlert(false)}
            />

            {/* Image modal */}
            {showModal ? (
                <ImageUploadModal
                    show={showModal}
                    onHide={() => toggleModal(!showModal)}
                    watermark_image={props.profile_data.watermark_image}
                    formSubmission={props.loadData}
                />
            ) : (
                ""
            )}

            <div className="card-header h5">Upload Watermark</div>

            <div className="card-body">
                {props.profile_data.watermark_image !== null &&
                props.profile_data.watermark_image !== "" ? (
                    <>
                        <div className="row mb-3">
                            <div className="col-lg-3 col-md-6 col-sm-8 col-12">
                                <img
                                    src={props.profile_data.watermark_image}
                                    alt={props.profile_data.full_name}
                                    className="img-fluid"
                                />
                            </div>
                        </div>
                        <button
                            className="btn btn-outline-danger btn-sm"
                            onClick={handleWatermarkDelete}
                        >
                            <i className="far fa-trash-alt mr-1"></i> Delete watermark
                        </button>
                    </>
                ) : (
                    <button
                        className="btn btn-primary btn-sm shadow-none"
                        onClick={() => toggleModal(true)}
                    >
                        Upload Watermark
                    </button>
                )}
            </div>

            {/* Loading component */}
            {isLoading ? <Loading /> : ""}
        </>
    );
};

export default connect(mapStateToProps)(UpdateWatermark);
