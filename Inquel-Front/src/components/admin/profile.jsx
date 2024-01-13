import React, { Component } from "react";
import Wrapper from "./wrapper";
import axios from "axios";
import { Spinner, Modal, Alert } from "react-bootstrap";
import { baseUrl, adminPathUrl } from "../../shared/baseUrl.js";
import Loading from "../common/loader";
import userpic from "../../assets/user-v1.png";
import AlertBox from "../common/alert";
import { connect } from "react-redux";
import storeDispatch from "../../redux/dispatch";
import { PROFILE } from "../../redux/action";

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
        this.url = baseUrl + adminPathUrl;
        this.authToken = localStorage.getItem("Inquel-Auth");
    }

    handleImageFile = (event) => {
        this.setState({
            showSuccessAlert: false,
            showErrorAlert: false,
            showLoader: true,
        });

        let form_data = new FormData();
        form_data.append("profile_admin_image_1", event.target.files[0]);

        const options = {
            headers: {
                Accept: "application/json",
                "Content-Type": "multipart/form-data",
                "Inquel-Auth": this.authToken,
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
            if (this.props.profile_link === null) {
                axios
                    .post(`${this.url}/profile/`, form_data, options)
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
                        this.setState({
                            errorMsg: "Something went wrong!",
                            showErrorAlert: true,
                            showLoader: false,
                        });
                    });
            } else {
                axios
                    .patch(`${this.url}/profile/`, form_data, options)
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
                        this.setState({
                            errorMsg: "Something went wrong!",
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

class AdminProfile extends Component {
    constructor(props) {
        super(props);
        this.state = {
            showModal: false,
            profile: this.props.profile_data,

            errorMsg: "",
            successMsg: "",
            showErrorAlert: false,
            showSuccessAlert: false,
            page_loading: false,
        };
        this.url = baseUrl + adminPathUrl;
        this.authToken = localStorage.getItem("Inquel-Auth");
        this.headers = {
            Accept: "application/json",
            "Content-Type": "application/json",
            "Inquel-Auth": this.authToken,
        };
    }

    toggleModal = () => {
        this.setState({
            showModal: !this.state.showModal,
        });
    };

    componentDidMount = () => {
        document.title = "My Profile - Admin | IQLabs";
    };

    loadProfileData = () => {
        fetch(`${this.url}/profile/`, {
            method: "GET",
            headers: this.headers,
        })
            .then((res) => res.json())
            .then((result) => {
                if (result.sts === true) {
                    storeDispatch(PROFILE, result.data);
                    this.setState({
                        profile: result.data,
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

    formSubmission = () => {
        setTimeout(() => {
            this.loadProfileData();
            this.setState({
                showModal: false,
                page_loading: true,
            });
        }, 1000);
    };

    render() {
        return (
            <Wrapper
                header="My Profile"
                activeLink="account"
                history={this.props.history}
                hideBackButton={true}
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

                {/* Image modal */}
                {this.state.showModal ? (
                    <ImageUploadModal
                        show={this.state.showModal}
                        onHide={this.toggleModal}
                        profile_link={this.state.profile.profile_link}
                        formSubmission={this.formSubmission}
                    />
                ) : (
                    ""
                )}

                {/* ---------- Image header card ---------- */}
                <div
                    className="container shadow d-flex flex-column align-items-center p-3 mb-4"
                    style={{
                        background:
                            "linear-gradient(90deg, rgba(98,16,18,0.9336776947106968) 0%, rgba(239,210,172,0.9392799356070554) 100%)",
                        borderRadius: "12px",
                    }}
                >
                    <div className="position-relative">
                        <img
                            src={
                                this.state.profile.length !== 0
                                    ? this.state.profile.profile_link
                                        ? this.state.profile.profile_link
                                        : userpic
                                    : userpic
                            }
                            alt={this.state.profile.full_name}
                            className="shadow square-img mx-auto mb-2"
                        />
                        <button
                            className="btn btn-light btn-sm rounded-circle shadow"
                            onClick={() => this.toggleModal("profile")}
                            style={{
                                position: "absolute",
                                bottom: "10px",
                                right: "15px",
                            }}
                        >
                            <i className="fas fa-upload"></i>
                        </button>
                    </div>
                    <h4 className="text-white">
                        {this.state.profile.full_name}
                    </h4>
                    <span className="secondary-bg rounded-pill py-1 px-3 small font-weight-bold-600">
                        @{this.state.profile.username}
                    </span>
                </div>

                <div className="container">
                    <div className="row justify-content-center">
                        {/* ---------- Left column ---------- */}
                        <div className="col-md-9 px-0">
                            <div className="card shadow-sm mb-3">
                                <div className="card-body">
                                    <h5 className="primary-text mb-4">
                                        Personal Details
                                    </h5>
                                    <div className="row gutters">
                                        <div className="col-lg-4 col-sm-6 col-12">
                                            <div className="form-group">
                                                <p className="small font-weight-bold-600 mb-2">
                                                    Full Name
                                                </p>
                                                {this.state.profile.full_name}
                                            </div>
                                        </div>
                                        <div className="col-lg-4 col-sm-6 col-12">
                                            <div className="form-group">
                                                <p className="small font-weight-bold-600 mb-2">
                                                    Username
                                                </p>
                                                {this.state.profile.username}
                                            </div>
                                        </div>
                                        <div className="col-lg-4 col-sm-6 col-12">
                                            <div className="form-group">
                                                <p className="small font-weight-bold-600 mb-2">
                                                    Email
                                                </p>
                                                {this.state.profile.email}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Loading component */}
                {this.state.page_loading ? <Loading /> : ""}
            </Wrapper>
        );
    }
}

export default connect(mapStateToProps)(AdminProfile);
