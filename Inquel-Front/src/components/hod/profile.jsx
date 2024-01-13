import React, { Component } from "react";
import Wrapper from "./wrapper";
import axios from "axios";
import { Spinner, Modal, Alert } from "react-bootstrap";
import { baseUrl, hodUrl } from "../../shared/baseUrl.js";
import Loading from "../common/loader";
import userpic from "../../assets/user-v1.png";
import AlertBox from "../common/alert";
import dateFormat from "dateformat";
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
        form_data.append("profile_hod_image_1", event.target.files[0]);

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
            // If image upload type is profile then perform profile pic Submission
            if (this.props.profile_link === null) {
                axios
                    .post(`${this.url}/hod/profile/`, form_data, options)
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
                    .patch(`${this.url}/hod/profile/`, form_data, options)
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

class HODProfile extends Component {
    constructor(props) {
        super(props);
        this.state = {
            showModal: false,
            profile: this.props.profile_data,

            errorMsg: "",
            successMsg: "",
            showErrorAlert: false,
            showSuccessAlert: false,
            showLoader: false,
            page_loading: false,
        };
        this.url = baseUrl + hodUrl;
        this.authToken = localStorage.getItem("Authorization");
        this.headers = {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: this.authToken,
        };
    }

    toggleModal = (type) => {
        this.setState({
            showModal: !this.state.showModal,
        });
    };

    loadHodData = () => {
        fetch(`${this.url}/hod/profile/`, {
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

    componentDidMount = () => {
        document.title = "My Profile - HOD | IQLabs";
    };

    formSubmission = () => {
        setTimeout(() => {
            this.loadHodData();
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
                    <div className="row">
                        {/* ---------- Left column ---------- */}
                        <div className="col-md-9 mb-3 mb-md-0">
                            <div className="card shadow-sm mb-3">
                                <div className="card-body">
                                    <h5 className="primary-text mb-4">
                                        Personal Details
                                    </h5>
                                    <div className="row gutters">
                                        <div className="col-lg-4 col-sm-6 col-12">
                                            <div className="form-group">
                                                <p className="small font-weight-bold-600 mb-2">
                                                    First Name
                                                </p>
                                                {this.state.profile.first_name}
                                            </div>
                                        </div>
                                        <div className="col-lg-4 col-sm-6 col-12">
                                            <div className="form-group">
                                                <p className="small font-weight-bold-600 mb-2">
                                                    Last Name
                                                </p>
                                                {this.state.profile.last_name}
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
                                        <div className="col-lg-4 col-sm-6 col-12">
                                            <div className="form-group">
                                                <p className="small font-weight-bold-600 mb-2">
                                                    Mobile number
                                                </p>
                                                {
                                                    this.state.profile
                                                        .country_code
                                                }
                                                {this.state.profile.phone_num}
                                            </div>
                                        </div>
                                        <div className="col-lg-4 col-sm-6 col-12">
                                            <div className="form-group">
                                                <p className="small font-weight-bold-600 mb-2">
                                                    Office phone
                                                </p>
                                                {
                                                    this.state.profile
                                                        .office_country_code
                                                }
                                                {
                                                    this.state.profile
                                                        .office_phone_num
                                                }
                                            </div>
                                        </div>
                                        <div className="col-lg-4 col-sm-6 col-12">
                                            <div>
                                                <p className="small font-weight-bold-600 mb-2">
                                                    Date of Birth
                                                </p>
                                                {dateFormat(
                                                    this.state.profile
                                                        .date_of_birth,
                                                    "mmmm dS, yyyy"
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* ----- Address details card ----- */}

                            <div className="card shadow-sm mb-3">
                                <div className="card-body">
                                    <h5 className="primary-text mb-4">
                                        Address
                                    </h5>
                                    <div className="row align-items-center mb-3">
                                        <div className="col-3 font-weight-bold-600 small">
                                            Address line
                                        </div>
                                        <div className="col-1">-</div>
                                        <div className="col-8">
                                            {this.state.profile.address}
                                        </div>
                                    </div>
                                    <div className="row align-items-center mb-3">
                                        <div className="col-3 font-weight-bold-600 small">
                                            City
                                        </div>
                                        <div className="col-1">-</div>
                                        <div className="col-8">
                                            {this.state.profile.city}
                                        </div>
                                    </div>
                                    <div className="row align-items-center mb-3">
                                        <div className="col-3 font-weight-bold-600 small">
                                            District
                                        </div>
                                        <div className="col-1">-</div>
                                        <div className="col-8">
                                            {this.state.profile.district}
                                        </div>
                                    </div>
                                    <div className="row align-items-center mb-3">
                                        <div className="col-3 font-weight-bold-600 small">
                                            State
                                        </div>
                                        <div className="col-1">-</div>
                                        <div className="col-8">
                                            {this.state.profile.state}
                                        </div>
                                    </div>
                                    <div className="row align-items-center mb-3">
                                        <div className="col-3 font-weight-bold-600 small">
                                            Country
                                        </div>
                                        <div className="col-1">-</div>
                                        <div className="col-8">
                                            {this.state.profile.country}
                                        </div>
                                    </div>
                                    <div className="row align-items-center">
                                        <div className="col-3 font-weight-bold-600 small">
                                            Pincode
                                        </div>
                                        <div className="col-1">-</div>
                                        <div className="col-8">
                                            {this.state.profile.pincode}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* ----- Institution details card ----- */}

                            <div className="card shadow-sm mb-3">
                                <div className="card-body">
                                    <h5 className="primary-text mb-4">
                                        Institution Details
                                    </h5>
                                    <div className="row align-items-center mb-3">
                                        <div className="col-3 font-weight-bold-600 small">
                                            Department Name
                                        </div>
                                        <div className="col-1">-</div>
                                        <div className="col-8">
                                            {this.state.profile.department_name}
                                        </div>
                                    </div>
                                    <div className="row align-items-center mb-3">
                                        <div className="col-3 font-weight-bold-600 small">
                                            Department details
                                        </div>
                                        <div className="col-1">-</div>
                                        <div className="col-8">
                                            {
                                                this.state.profile
                                                    .department_details
                                            }
                                        </div>
                                    </div>
                                    <div className="row align-items-center mb-3">
                                        <div className="col-3 font-weight-bold-600 small">
                                            Office address
                                        </div>
                                        <div className="col-1">-</div>
                                        <div className="col-8">
                                            {this.state.profile.office_address}
                                        </div>
                                    </div>
                                    <div className="row align-items-center mb-3">
                                        <div className="col-3 font-weight-bold-600 small">
                                            Additional details 1
                                        </div>
                                        <div className="col-1">-</div>
                                        <div className="col-8">
                                            {
                                                this.state.profile
                                                    .additional_details_1
                                            }
                                        </div>
                                    </div>
                                    <div className="row align-items-center">
                                        <div className="col-3 font-weight-bold-600 small">
                                            Additional details 2
                                        </div>
                                        <div className="col-1">-</div>
                                        <div className="col-8">
                                            {
                                                this.state.profile
                                                    .additional_details_2
                                            }
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* ----- Watermark image card ----- */}

                            <div className="card shadow-sm">
                                <div className="card-body">
                                    <h5 className="primary-text mb-4">
                                        Watermark Image
                                    </h5>
                                    {this.state.profile.watermark_image !==
                                        null &&
                                    this.state.profile.watermark_image !==
                                        "" ? (
                                        <div className="row">
                                            <div className="col-lg-3 col-md-4 col-6">
                                                <img
                                                    src={
                                                        this.state.profile
                                                            .watermark_image
                                                    }
                                                    alt={
                                                        this.state.profile
                                                            .full_name
                                                    }
                                                    className="img-fluid"
                                                />
                                            </div>
                                        </div>
                                    ) : null}
                                </div>
                            </div>
                        </div>

                        {/* ---------- Right column ---------- */}
                        <div className="col-md-3">
                            <div className="card shadow-sm mb-2">
                                <div className="card-body">
                                    <h6 className="primary-text mb-4">
                                        Configurations
                                    </h6>
                                    {this.state.profile.permissions !==
                                    undefined ? (
                                        <>
                                            <div className="row align-items-center small mb-3">
                                                <div className="col-6">
                                                    <p className="mb-0 font-weight-bold-600">
                                                        Category
                                                    </p>
                                                </div>
                                                <div className="col-6">
                                                    {
                                                        this.state.profile
                                                            .permissions
                                                            .category
                                                    }
                                                </div>
                                            </div>
                                            <div className="row align-items-center small mb-3">
                                                <div className="col-6">
                                                    <p className="mb-0 font-weight-bold-600">
                                                        Sub category
                                                    </p>
                                                </div>
                                                <div className="col-6">
                                                    {
                                                        this.state.profile
                                                            .permissions
                                                            .sub_category
                                                    }
                                                </div>
                                            </div>
                                            <div className="row align-items-center small mb-3">
                                                <div className="col-6">
                                                    <p className="mb-0 font-weight-bold-600">
                                                        Discipline
                                                    </p>
                                                </div>
                                                <div className="col-6">
                                                    {
                                                        this.state.profile
                                                            .permissions
                                                            .discipline
                                                    }
                                                </div>
                                            </div>
                                            <div className="row align-items-center small mb-3">
                                                <div className="col-6">
                                                    <p className="mb-0 font-weight-bold-600">
                                                        Board
                                                    </p>
                                                </div>
                                                <div className="col-6">
                                                    {
                                                        this.state.profile
                                                            .permissions.board
                                                    }
                                                </div>
                                            </div>
                                            <div className="row align-items-center small mb-3">
                                                <div className="col-6">
                                                    <p className="mb-0 font-weight-bold-600">
                                                        Valid From
                                                    </p>
                                                </div>
                                                <div className="col-6">
                                                    {dateFormat(
                                                        this.state.profile
                                                            .permissions
                                                            .valid_from,
                                                        "dd/mm/yyyy"
                                                    )}
                                                </div>
                                            </div>
                                            <div className="row align-items-center small">
                                                <div className="col-6">
                                                    <p className="mb-0 font-weight-bold-600">
                                                        Valid To
                                                    </p>
                                                </div>
                                                <div className="col-6">
                                                    {dateFormat(
                                                        this.state.profile
                                                            .permissions
                                                            .valid_to,
                                                        "dd/mm/yyyy"
                                                    )}
                                                </div>
                                            </div>
                                        </>
                                    ) : null}
                                </div>
                            </div>
                            <div className="card shadow-sm">
                                <div className="card-body">
                                    <h6 className="primary-text mb-4">
                                        Permissions
                                    </h6>
                                    {this.state.profile.permissions !==
                                    undefined ? (
                                        <>
                                            <div className="row mb-2">
                                                <div className="col-10">
                                                    <p className="small mb-0 font-weight-bold-600">
                                                        Progressive Score
                                                    </p>
                                                </div>
                                                <div className="col-2 text-right">
                                                    {this.state.profile
                                                        .permissions
                                                        .prog_sco_card ===
                                                    true ? (
                                                        <i className="fas fa-check-circle text-success"></i>
                                                    ) : (
                                                        <i className="fas fa-times-circle text-danger"></i>
                                                    )}
                                                </div>
                                            </div>
                                            <div className="row mb-2">
                                                <div className="col-10">
                                                    <p className="small mb-0 font-weight-bold-600">
                                                        Type 1
                                                    </p>
                                                </div>
                                                <div className="col-2 text-right">
                                                    {this.state.profile
                                                        .permissions
                                                        .type_1_q === true ? (
                                                        <i className="fas fa-check-circle text-success"></i>
                                                    ) : (
                                                        <i className="fas fa-times-circle text-danger"></i>
                                                    )}
                                                </div>
                                            </div>
                                            <div className="row mb-2">
                                                <div className="col-10">
                                                    <p className="small mb-0 font-weight-bold-600">
                                                        Type 2
                                                    </p>
                                                </div>
                                                <div className="col-2 text-right">
                                                    {this.state.profile
                                                        .permissions
                                                        .type_2_q === true ? (
                                                        <i className="fas fa-check-circle text-success"></i>
                                                    ) : (
                                                        <i className="fas fa-times-circle text-danger"></i>
                                                    )}
                                                </div>
                                            </div>
                                            <div className="row mb-2">
                                                <div className="col-10">
                                                    <p className="small mb-0 font-weight-bold-600">
                                                        Quiz
                                                    </p>
                                                </div>
                                                <div className="col-2 text-right">
                                                    {this.state.profile
                                                        .permissions.quiz ===
                                                    true ? (
                                                        <i className="fas fa-check-circle text-success"></i>
                                                    ) : (
                                                        <i className="fas fa-times-circle text-danger"></i>
                                                    )}
                                                </div>
                                            </div>
                                            <div className="row mb-2">
                                                <div className="col-10">
                                                    <p className="small mb-0 font-weight-bold-600">
                                                        Match
                                                    </p>
                                                </div>
                                                <div className="col-2 text-right">
                                                    {this.state.profile
                                                        .permissions.match ===
                                                    true ? (
                                                        <i className="fas fa-check-circle text-success"></i>
                                                    ) : (
                                                        <i className="fas fa-times-circle text-danger"></i>
                                                    )}
                                                </div>
                                            </div>
                                            <div className="row mb-2">
                                                <div className="col-10">
                                                    <p className="small mb-0 font-weight-bold-600">
                                                        Notes
                                                    </p>
                                                </div>
                                                <div className="col-2 text-right">
                                                    {this.state.profile
                                                        .permissions
                                                        .copy_download ===
                                                    true ? (
                                                        <i className="fas fa-check-circle text-success"></i>
                                                    ) : (
                                                        <i className="fas fa-times-circle text-danger"></i>
                                                    )}
                                                </div>
                                            </div>
                                            <div className="row mb-2">
                                                <div className="col-10">
                                                    <p className="small mb-0 font-weight-bold-600">
                                                        Summary
                                                    </p>
                                                </div>
                                                <div className="col-2 text-right">
                                                    {this.state.profile
                                                        .permissions.summary ===
                                                    true ? (
                                                        <i className="fas fa-check-circle text-success"></i>
                                                    ) : (
                                                        <i className="fas fa-times-circle text-danger"></i>
                                                    )}
                                                </div>
                                            </div>
                                            <div className="row mb-2">
                                                <div className="col-10">
                                                    <p className="small mb-0 font-weight-bold-600">
                                                        Direct Questions
                                                    </p>
                                                </div>
                                                <div className="col-2 text-right">
                                                    {this.state.profile
                                                        .permissions
                                                        .direct_q === true ? (
                                                        <i className="fas fa-check-circle text-success"></i>
                                                    ) : (
                                                        <i className="fas fa-times-circle text-danger"></i>
                                                    )}
                                                </div>
                                            </div>
                                            <div className="row mb-2">
                                                <div className="col-10">
                                                    <p className="small mb-0 font-weight-bold-600">
                                                        Configure
                                                    </p>
                                                </div>
                                                <div className="col-2 text-right">
                                                    {this.state.profile
                                                        .permissions
                                                        .config_course ===
                                                    true ? (
                                                        <i className="fas fa-check-circle text-success"></i>
                                                    ) : (
                                                        <i className="fas fa-times-circle text-danger"></i>
                                                    )}
                                                </div>
                                            </div>
                                            <div className="row mb-2">
                                                <div className="col-10">
                                                    <p className="small mb-0 font-weight-bold-600">
                                                        Simulation Exam
                                                    </p>
                                                </div>
                                                <div className="col-2 text-right">
                                                    {this.state.profile
                                                        .permissions
                                                        .sim_exam === true ? (
                                                        <i className="fas fa-check-circle text-success"></i>
                                                    ) : (
                                                        <i className="fas fa-times-circle text-danger"></i>
                                                    )}
                                                </div>
                                            </div>
                                            <div className="row mb-2">
                                                <div className="col-10">
                                                    <p className="small mb-0 font-weight-bold-600">
                                                        Locking of Tests
                                                    </p>
                                                </div>
                                                <div className="col-2 text-right">
                                                    {this.state.profile
                                                        .permissions
                                                        .lock_test === true ? (
                                                        <i className="fas fa-check-circle text-success"></i>
                                                    ) : (
                                                        <i className="fas fa-times-circle text-danger"></i>
                                                    )}
                                                </div>
                                            </div>
                                            <div className="row">
                                                <div className="col-10">
                                                    <p className="small mb-0 font-weight-bold-600">
                                                        Mobile App
                                                    </p>
                                                </div>
                                                <div className="col-2 text-right">
                                                    {this.state.profile
                                                        .permissions
                                                        .android_app ===
                                                    true ? (
                                                        <i className="fas fa-check-circle text-success"></i>
                                                    ) : (
                                                        <i className="fas fa-times-circle text-danger"></i>
                                                    )}
                                                </div>
                                            </div>
                                        </>
                                    ) : null}
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

export default connect(mapStateToProps)(HODProfile);
