import React, { Component } from "react";
import Wrapper from "../wrapper";
import { Link } from "react-router-dom";
import { Badge, Spinner } from "react-bootstrap";
import profilepic from "../../../assets/user-v1.png";
import Select from "react-select";
import {
    paginationCount,
    SUBJECT_THUMBNAIL,
} from "../../../shared/constant.js";
import GroupTable from "../../common/table/group";
import Paginations from "../../common/pagination";
import ReactSwitch from "../../common/switchComponent";
import dateFormat from "dateformat";
import { baseUrl, adminPathUrl } from "../../../shared/baseUrl";
import Loading from "../../common/loader";
import AlertBox from "../../common/alert";
import storeDispatch from "../../../redux/dispatch";
import { TEMP } from "../../../redux/action";
import Slider from "react-slick";

const ConfigurationSection = (props) => {
    function customDataValidation(data) {
        let state = false;
        if (data) {
            state = data;
        }
        return state;
    }

    return (
        <>
            <div className="row mb-2">
                <div className="col-9">
                    <p className="primary-text small mb-0 font-weight-bold-600">
                        Progressive Score
                    </p>
                </div>
                <div className="col-3 text-right">
                    <ReactSwitch
                        checked={customDataValidation(
                            props.permissions.prog_sco_card
                        )}
                        onChange={() => props.handleSwitch("prog_sco_card")}
                    />
                </div>
            </div>
            <div className="row mb-2">
                <div className="col-9">
                    <p className="primary-text small mb-0 font-weight-bold-600">
                        Type 1
                    </p>
                </div>
                <div className="col-3 text-right">
                    <ReactSwitch
                        checked={customDataValidation(
                            props.permissions.type_1_q
                        )}
                        onChange={() => props.handleSwitch("type_1_q")}
                    />
                </div>
            </div>
            <div className="row mb-2">
                <div className="col-9">
                    <p className="primary-text small mb-0 font-weight-bold-600">
                        Type 2
                    </p>
                </div>
                <div className="col-3 text-right">
                    <ReactSwitch
                        checked={customDataValidation(
                            props.permissions.type_2_q
                        )}
                        onChange={() => props.handleSwitch("type_2_q")}
                    />
                </div>
            </div>
            <div className="row mb-2">
                <div className="col-9">
                    <p className="primary-text small mb-0 font-weight-bold-600">
                        Quiz
                    </p>
                </div>
                <div className="col-3 text-right">
                    <ReactSwitch
                        checked={customDataValidation(props.permissions.quiz)}
                        onChange={() => props.handleSwitch("quiz")}
                    />
                </div>
            </div>
            <div className="row mb-2">
                <div className="col-9">
                    <p className="primary-text small mb-0 font-weight-bold-600">
                        Match
                    </p>
                </div>
                <div className="col-3 text-right">
                    <ReactSwitch
                        checked={customDataValidation(props.permissions.match)}
                        onChange={() => props.handleSwitch("match")}
                    />
                </div>
            </div>
            <div className="row mb-2">
                <div className="col-9">
                    <p className="primary-text small mb-0 font-weight-bold-600">
                        Notes
                    </p>
                </div>
                <div className="col-3 text-right">
                    <ReactSwitch
                        checked={customDataValidation(
                            props.permissions.copy_download
                        )}
                        onChange={() => props.handleSwitch("copy_download")}
                    />
                </div>
            </div>
            <div className="row mb-2">
                <div className="col-9">
                    <p className="primary-text small mb-0 font-weight-bold-600">
                        Summary
                    </p>
                </div>
                <div className="col-3 text-right">
                    <ReactSwitch
                        checked={customDataValidation(
                            props.permissions.summary
                        )}
                        onChange={() => props.handleSwitch("summary")}
                    />
                </div>
            </div>
            <div className="row mb-2">
                <div className="col-9">
                    <p className="primary-text small mb-0 font-weight-bold-600">
                        Direct Questions
                    </p>
                </div>
                <div className="col-3 text-right">
                    <ReactSwitch
                        checked={customDataValidation(
                            props.permissions.direct_q
                        )}
                        onChange={() => props.handleSwitch("direct_q")}
                    />
                </div>
            </div>
            <div className="row mb-2">
                <div className="col-9">
                    <p className="primary-text small mb-0 font-weight-bold-600">
                        Course Config
                    </p>
                </div>
                <div className="col-3 text-right">
                    <ReactSwitch
                        checked={customDataValidation(
                            props.permissions.config_course
                        )}
                        onChange={() => props.handleSwitch("config_course")}
                    />
                </div>
            </div>
            <div className="row mb-2">
                <div className="col-9">
                    <p className="primary-text small mb-0 font-weight-bold-600">
                        Simulation Exam
                    </p>
                </div>
                <div className="col-3 text-right">
                    <ReactSwitch
                        checked={customDataValidation(
                            props.permissions.sim_exam
                        )}
                        onChange={() => props.handleSwitch("sim_exam")}
                    />
                </div>
            </div>
            <div className="row mb-2">
                <div className="col-9">
                    <p className="primary-text small mb-0 font-weight-bold-600">
                        Locking of Tests
                    </p>
                </div>
                <div className="col-3 text-right">
                    <ReactSwitch
                        checked={customDataValidation(
                            props.permissions.lock_test
                        )}
                        onChange={() => props.handleSwitch("lock_test")}
                    />
                </div>
            </div>
            <div className="row">
                <div className="col-9">
                    <p className="primary-text small mb-0 font-weight-bold-600">
                        Mobile App
                    </p>
                </div>
                <div className="col-3 text-right">
                    <ReactSwitch
                        checked={customDataValidation(
                            props.permissions.android_app
                        )}
                        onChange={() => props.handleSwitch("android_app")}
                    />
                </div>
            </div>
        </>
    );
};

class AdminHodProfile extends Component {
    constructor(props) {
        super(props);
        this.state = {
            activeGroupPage: 1,
            totalGroupCount: 0,

            hodItems: [],
            group: [],
            courses: [],
            permissions: {},
            category: [],
            subcategory: [],
            discipline: [],
            board: [],

            subcategory_loading: false,
            discipline_loading: false,
            showConfigLoader: false,

            errorMsg: "",
            successMsg: "",
            showErrorAlert: false,
            showSuccessAlert: false,
            page_loading: true,
        };
        this.hodId = this.props.match.params.hodId;
        this.url = baseUrl + adminPathUrl;
        this.authToken = localStorage.getItem("Inquel-Auth");
        this.headers = {
            Accept: "application/json",
            "Content-Type": "application/json",
            "Inquel-Auth": this.authToken,
        };
    }

    loadHodData = () => {
        fetch(`${this.url}/hod/${this.hodId}/`, {
            headers: this.headers,
            method: "GET",
        })
            .then((res) => res.json())
            .then((result) => {
                if (result.sts === true) {
                    let permissions = result.data.permissions[0] || {};
                    permissions["valid_from"] = dateFormat(
                        result.data.permissions[0].valid_from,
                        "yyyy-mm-dd '00:00:00'"
                    );
                    permissions["valid_to"] = dateFormat(
                        result.data.permissions[0].valid_to,
                        "yyyy-mm-dd '00:00:00'"
                    );
                    this.setState(
                        {
                            hodItems: result.data,
                            courses: result.data.courses,
                            permissions: permissions,
                            page_loading: false,
                        },
                        () => {
                            this.handleCategory({
                                value: result.data.permissions[0].category,
                            });
                            this.handleSubcategory({
                                value: result.data.permissions[0].sub_category,
                            });
                        }
                    );
                    storeDispatch(TEMP, result.data);
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

    loadGroupData = () => {
        let API_URL =
            this.state.activeGroupPage > 1
                ? `${this.url}/hod/${this.hodId}/group/?page=${this.state.activeGroupPage}`
                : `${this.url}/hod/${this.hodId}/group/`;
        fetch(API_URL, {
            headers: this.headers,
            method: "GET",
        })
            .then((res) => res.json())
            .then((result) => {
                if (result.sts === true) {
                    this.setState({
                        group: result.data.results,
                        totalGroupCount: result.data.count,
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
        document.title = "HOD Profile - Admin | IQLabs";

        this.loadHodData();
        this.loadGroupData();

        fetch(`${this.url}/data/filter/`, {
            headers: this.headers,
            method: "GET",
        })
            .then((res) => res.json())
            .then((result) => {
                if (result.sts === true) {
                    this.setState({
                        category: result.data.CATEGORY,
                        board: result.data.BOARD,
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
    };

    handleCategory = (event) => {
        let permissions = this.state.permissions;
        permissions.category = event.value;
        this.setState({
            permissions: permissions,
            subcategory: [],
            discipline: [],
            subcategory_loading: true,
        });

        if (event.value !== "") {
            fetch(`${this.url}/data/filter/?category=${event.value}`, {
                headers: this.headers,
                method: "GET",
            })
                .then((res) => res.json())
                .then((result) => {
                    if (result.sts === true) {
                        this.setState({
                            subcategory: result.data.sub_category,
                            subcategory_loading: false,
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

    handleSubcategory = (event) => {
        let permissions = this.state.permissions;
        permissions.sub_category = event.value;
        this.setState({
            permissions: permissions,
            discipline: [],
            discipline_loading: true,
        });

        if (event.value !== "") {
            fetch(
                `${this.url}/data/filter/?category=${permissions.category}&sub_category=${event.value}`,
                {
                    headers: this.headers,
                    method: "GET",
                }
            )
                .then((res) => res.json())
                .then((result) => {
                    if (result.sts === true) {
                        this.setState({
                            discipline: result.data.DISCIPLINE,
                            discipline_loading: false,
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

    handleDiscipline = (event) => {
        let permissions = this.state.permissions;
        permissions.discipline = event.value;
        this.setState({
            permissions: permissions,
        });
    };

    handleBoard = (event) => {
        let permissions = this.state.permissions;
        permissions.board = event.value;
        this.setState({
            permissions: permissions,
        });
    };

    handleValid_from = (event) => {
        let permissions = this.state.permissions;
        permissions.valid_from = event.value`${dateFormat(
            event.target.value,
            "yyyy-mm-dd"
        )} 00:00:00`;
        this.setState({
            permissions: permissions,
        });
    };

    handleValid_to = (event) => {
        let permissions = this.state.permissions;
        permissions.valid_to = `${dateFormat(
            event.target.value,
            "yyyy-mm-dd"
        )} 00:00:00`;
        this.setState({
            permissions: permissions,
        });
    };

    handleDetails = () => {
        this.setState({
            page_loading: true,
            showErrorAlert: false,
            showSuccessAlert: false,
        });

        if (this.state.hodItems.is_active) {
            let permissions = this.state.permissions;
            fetch(`${this.url}/hod/${this.hodId}/`, {
                headers: this.headers,
                method: "PUT",
                body: JSON.stringify({
                    category: permissions.category,
                    sub_category: permissions.sub_category,
                    discipline: permissions.discipline,
                    board: permissions.board,
                    valid_from: permissions.valid_from,
                    valid_to: permissions.valid_to,
                }),
            })
                .then((res) => res.json())
                .then((result) => {
                    if (result.sts === true) {
                        this.setState({
                            successMsg: result.msg,
                            showSuccessAlert: true,
                            page_loading: true,
                        });
                        this.loadHodData();
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
                errorMsg: "Cannot update inactive HOD!",
                showErrorAlert: true,
                page_loading: false,
            });
        }
    };

    handleGroupPageChange(pageNumber) {
        this.setState(
            { activeGroupPage: pageNumber, page_loading: true },
            () => {
                this.loadGroupData();
            }
        );
    }

    handleSwitch = (type) => {
        let permissions = this.state.permissions;
        permissions[type] = !permissions[type];

        this.setState({
            permissions: permissions,
        });
    };

    handleConfiguration = () => {
        this.setState({
            showConfigLoader: true,
            showErrorAlert: false,
            showSuccessAlert: false,
        });

        if (this.state.hodItems.is_active) {
            let permissions = this.state.permissions;
            fetch(`${this.url}/hod/${this.hodId}/`, {
                headers: this.headers,
                method: "PUT",
                body: JSON.stringify({
                    prog_sco_card: permissions.prog_sco_card,
                    type_1_q: permissions.type_1_q,
                    type_2_q: permissions.type_2_q,
                    direct_q: permissions.direct_q,
                    quiz: permissions.quiz,
                    match: permissions.match,
                    config_course: permissions.config_course,
                    sim_exam: permissions.sim_exam,
                    lock_test: permissions.lock_test,
                    copy_download: permissions.copy_download,
                    android_app: permissions.android_app,
                    summary: permissions.summary,
                }),
            })
                .then((res) => res.json())
                .then((result) => {
                    if (result.sts === true) {
                        this.setState(
                            {
                                showConfigLoader: false,
                                successMsg: result.msg,
                                showSuccessAlert: true,
                                page_loading: true,
                            },
                            () => {
                                this.loadHodData();
                            }
                        );
                    } else {
                        this.setState({
                            errorMsg: result.msg,
                            showErrorAlert: true,
                            showConfigLoader: false,
                        });
                    }
                })
                .catch((err) => {
                    console.log(err);
                    this.setState({
                        errorMsg: "Something went wrong!",
                        showErrorAlert: true,
                        showConfigLoader: false,
                    });
                });
        } else {
            this.setState({
                errorMsg: "Cannot update inactive HOD!",
                showErrorAlert: true,
                showConfigLoader: false,
            });
        }
    };

    render() {
        var settings = {
            dots: true,
            infinite: false,
            speed: 500,
            slidesToShow: 3,
            slidesToScroll: 3,
            initialSlide: 0,
            responsive: [
                {
                    breakpoint: 1024,
                    settings: {
                        slidesToShow: 2,
                        slidesToScroll: 2,
                        dots: true,
                    },
                },
                {
                    breakpoint: 600,
                    settings: {
                        slidesToShow: 1,
                        slidesToScroll: 1,
                        dots: false,
                    },
                },
            ],
        };
        return (
            <Wrapper
                history={this.props.history}
                header="HOD Profile"
                activeLink="profiles"
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

                {/* Breadcrumb */}
                <nav aria-label="breadcrumb">
                    <ol className="breadcrumb mb-3">
                        <li className="breadcrumb-item">
                            <Link to="/admin">
                                <i className="fas fa-home fa-sm"></i>
                            </Link>
                        </li>
                        <li className="breadcrumb-item">
                            <Link to="#" onClick={this.props.history.goBack}>
                                HOD
                            </Link>
                        </li>
                        <li className="breadcrumb-item active">Profile</li>
                    </ol>
                </nav>

                <div className="row">
                    <div className="col-lg-9 mb-3 mb-lg-0">
                        {/* HOD Details */}
                        <div className="row align-items-center mb-4">
                            <div className="col-md-6 mb-3 mb-md-0">
                                <div className="d-flex align-items-center">
                                    <img
                                        src={
                                            this.state.hodItems.length !== 0
                                                ? this.state.hodItems
                                                      .profile_link !== null
                                                    ? this.state.hodItems
                                                          .profile_link
                                                    : profilepic
                                                : profilepic
                                        }
                                        alt={this.state.hodItems.full_name}
                                        className="square-img-sm"
                                    />
                                    <div className="ml-3">
                                        <h5 className="primary-text">
                                            {this.state.hodItems.length !== 0
                                                ? this.state.hodItems
                                                      .full_name !== ""
                                                    ? this.state.hodItems
                                                          .full_name
                                                    : this.state.hodItems
                                                          .username
                                                : ""}
                                        </h5>
                                        <p className="mb-0">
                                            {this.state.hodItems.length !==
                                            0 ? (
                                                this.state.hodItems
                                                    .is_active ? (
                                                    <Badge variant="success">
                                                        Active
                                                    </Badge>
                                                ) : (
                                                    <Badge variant="danger">
                                                        Not active
                                                    </Badge>
                                                )
                                            ) : (
                                                ""
                                            )}
                                        </p>
                                    </div>
                                </div>
                            </div>
                            <div className="col-md-6">
                                <div className="row">
                                    <div className="col-6">
                                        <Link
                                            to={`${this.props.match.url}/students`}
                                            style={{
                                                textDecoration: "none",
                                            }}
                                        >
                                            <button className="btn btn-primary btn-sm btn-block shadow-none">
                                                My Student Profiles
                                            </button>
                                        </Link>
                                    </div>
                                    <div className="col-6">
                                        <Link
                                            to={`${this.props.match.url}/teacher`}
                                            style={{
                                                textDecoration: "none",
                                            }}
                                        >
                                            <button className="btn btn-primary btn-sm btn-block shadow-none">
                                                My Teacher Profiles
                                            </button>
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="row mb-4">
                            <div className="col-md-2 col-sm-4 col-6 mb-4">
                                <p className="mb-1 font-weight-bold-600">
                                    First Name
                                </p>
                                <p className="text-break mb-0">
                                    {this.state.hodItems.first_name}
                                </p>
                            </div>
                            <div className="col-md-2 col-sm-4 col-6 mb-4">
                                <p className="mb-1 font-weight-bold-600">
                                    Last Name
                                </p>
                                <p className="text-break mb-0">
                                    {this.state.hodItems.last_name}
                                </p>
                            </div>
                            <div className="col-md-2 col-sm-4 col-6 mb-4">
                                <p className="mb-1 font-weight-bold-600">
                                    Email ID
                                </p>
                                <p className="text-break mb-0">
                                    {this.state.hodItems.email}
                                </p>
                            </div>
                            <div className="col-md-2 col-sm-4 col-6 mb-4">
                                <p className="mb-1 font-weight-bold-600">
                                    Mobile
                                </p>
                                <p className="text-break mb-0">
                                    {this.state.hodItems.country_code}
                                    {this.state.hodItems.phone_num}
                                </p>
                            </div>
                            <div className="col-md-2 col-sm-4 col-6 mb-4">
                                <p className="mb-1 font-weight-bold-600">
                                    Office Number
                                </p>
                                <p className="text-break mb-0">
                                    {this.state.hodItems.office_country_code}
                                    {this.state.hodItems.office_phone_num}
                                </p>
                            </div>
                            <div className="col-md-2 col-sm-4 col-6 mb-4">
                                <p className="mb-1 font-weight-bold-600">
                                    Department
                                </p>
                                <p className="text-break mb-0">
                                    {this.state.hodItems.department_name}
                                </p>
                            </div>

                            <div className="col-md-2 col-sm-4 col-6 mb-4">
                                <p className="mb-1 font-weight-bold-600">
                                    Address
                                </p>
                                <p className="text-break mb-0">
                                    {this.state.hodItems.address}
                                </p>
                            </div>
                            <div className="col-md-2 col-sm-4 col-6 mb-4">
                                <p className="mb-1 font-weight-bold-600">
                                    City
                                </p>
                                <p className="text-break mb-0">
                                    {this.state.hodItems.city}
                                </p>
                            </div>
                            <div className="col-md-2 col-sm-4 col-6 mb-4">
                                <p className="mb-1 font-weight-bold-600">
                                    District
                                </p>
                                <p className="text-break mb-0">
                                    {this.state.hodItems.district}
                                </p>
                            </div>
                            <div className="col-md-2 col-sm-4 col-6 mb-4">
                                <p className="mb-1 font-weight-bold-600">
                                    State
                                </p>
                                <p className="text-break mb-0">
                                    {this.state.hodItems.state}
                                </p>
                            </div>
                            <div className="col-md-2 col-sm-4 col-6 mb-4">
                                <p className="mb-1 font-weight-bold-600">
                                    Country
                                </p>
                                <p className="text-break mb-0">
                                    {this.state.hodItems.country}
                                </p>
                            </div>
                            <div className="col-md-2 col-sm-4 col-6 mb-4">
                                <p className="mb-1 font-weight-bold-600">
                                    Pincode
                                </p>
                                <p className="text-break mb-0">
                                    {this.state.hodItems.pincode}
                                </p>
                            </div>
                            <div className="col-md-3 col-sm-4 col-6 mb-4">
                                <p className="mb-1 font-weight-bold-600">
                                    Department Details
                                </p>
                                <p className="text-break mb-0">
                                    {this.state.hodItems.department_details}
                                </p>
                            </div>
                            <div className="col-md-3 col-sm-4 col-6 mb-4">
                                <p className="mb-1 font-weight-bold-600">
                                    Office Address
                                </p>
                                <p className="text-break mb-0">
                                    {this.state.hodItems.office_address}
                                </p>
                            </div>
                            <div className="col-md-3 col-sm-4 col-6 mb-4">
                                <p className="mb-1 font-weight-bold-600">
                                    Additional Details 1
                                </p>
                                <p className="text-break mb-0">
                                    {this.state.hodItems.additional_details_1}
                                </p>
                            </div>
                            <div className="col-md-3 col-sm-4 col-6 mb-4">
                                <p className="mb-1 font-weight-bold-600">
                                    Additional Details 2
                                </p>
                                <p className="text-break mb-0">
                                    {this.state.hodItems.additional_details_2}
                                </p>
                            </div>
                            <div className="col-md-3 col-sm-6 col-6">
                                <p className="mb-1 font-weight-bold-600">
                                    Watermark Image
                                </p>
                                {this.state.hodItems.watermark_image && (
                                    <img
                                        src={
                                            this.state.hodItems.watermark_image
                                        }
                                        alt={this.state.hodItems.full_name}
                                        className="img-fluid"
                                    />
                                )}
                            </div>
                        </div>

                        {/* Group Handling */}
                        <div className="card shadow-sm mb-4">
                            <div className="card-header pb-0">
                                <h5>Groups</h5>
                            </div>
                            <GroupTable
                                groupItems={this.state.group}
                                path={`admin/hod/${this.hodId}`}
                                view={true}
                            />
                            <div className="card-body p-3">
                                {this.state.totalGroupCount >
                                paginationCount ? (
                                    <Paginations
                                        activePage={this.state.activeGroupPage}
                                        totalItemsCount={
                                            this.state.totalGroupCount
                                        }
                                        onChange={this.handleGroupPageChange.bind(
                                            this
                                        )}
                                    />
                                ) : null}
                            </div>
                        </div>

                        {/* Courses configured */}
                        <div className="card shadow-sm">
                            <div className="card-header">
                                <h5>Courses configured</h5>
                            </div>
                            <div className="card-body">
                                {this.state.courses &&
                                this.state.courses.length !== 0 ? (
                                    <Slider {...settings}>
                                        {(this.state.courses || []).map(
                                            (data, index) => {
                                                return (
                                                    <div
                                                        className="px-3"
                                                        data-index={index}
                                                        key={index}
                                                    >
                                                        <div className="card">
                                                            <img
                                                                src={
                                                                    data.course_thumbnail_url
                                                                        ? data.course_thumbnail_url
                                                                        : SUBJECT_THUMBNAIL
                                                                }
                                                                className="card-img-top"
                                                                alt={
                                                                    data.course_name
                                                                }
                                                            />
                                                            <div className="card-body primary-bg text-white p-2">
                                                                {
                                                                    data.course_name
                                                                }
                                                            </div>
                                                        </div>
                                                    </div>
                                                );
                                            }
                                        )}
                                    </Slider>
                                ) : (
                                    "No data to display..."
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Personal details */}
                    <div className="col-lg-3">
                        <div className="card shadow-sm">
                            <div className="card-header pb-0">
                                <div className="row align-items-center">
                                    <div className="col-6">
                                        <h6 className="font-weight-bold-600 mb-0">
                                            Details
                                        </h6>
                                    </div>
                                    <div className="col-6 text-right">
                                        <button
                                            className="btn btn-primary btn-sm shadow-none"
                                            onClick={this.handleDetails}
                                        >
                                            Save
                                        </button>
                                    </div>
                                </div>
                            </div>
                            <div className="card-body">
                                <div className="form-group">
                                    <label
                                        htmlFor="category"
                                        className="primary-text font-weight-bold-600"
                                    >
                                        Category
                                    </label>
                                    <Select
                                        className="basic-single form-shadow"
                                        placeholder="Select category"
                                        isSearchable={true}
                                        name="category"
                                        value={this.state.category.map(
                                            (list) => {
                                                return this.state.permissions
                                                    .category
                                                    ? this.state.permissions
                                                          .category ===
                                                      list.code
                                                        ? {
                                                              value: list.code,
                                                              label: list.title,
                                                          }
                                                        : ""
                                                    : "";
                                            }
                                        )}
                                        options={this.state.category.map(
                                            (list) => {
                                                return {
                                                    value: list.code,
                                                    label: list.title,
                                                };
                                            }
                                        )}
                                        onChange={this.handleCategory}
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label
                                        htmlFor="subcategory"
                                        className="primary-text font-weight-bold-600"
                                    >
                                        Sub Category
                                    </label>
                                    <Select
                                        className="basic-single form-shadow"
                                        placeholder="Select subcategory"
                                        isLoading={
                                            this.state.subcategory_loading
                                                ? true
                                                : false
                                        }
                                        isSearchable={true}
                                        name="sub_category"
                                        value={this.state.subcategory.map(
                                            (list) => {
                                                return this.state.permissions
                                                    .sub_category
                                                    ? this.state.permissions
                                                          .sub_category ===
                                                      list.code
                                                        ? {
                                                              value: list.code,
                                                              label: list.title,
                                                          }
                                                        : ""
                                                    : "";
                                            }
                                        )}
                                        options={this.state.subcategory.map(
                                            function (list) {
                                                return {
                                                    value: list.code,
                                                    label: list.title,
                                                };
                                            }
                                        )}
                                        onChange={this.handleSubcategory}
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label
                                        htmlFor="discipline"
                                        className="primary-text font-weight-bold-600"
                                    >
                                        Discipline
                                    </label>
                                    <Select
                                        className="basic-single form-shadow"
                                        placeholder="Select discipline"
                                        isLoading={
                                            this.state.discipline_loading
                                                ? true
                                                : false
                                        }
                                        isSearchable={true}
                                        name="discipline"
                                        value={Object.entries(
                                            this.state.discipline
                                        ).map(([key, value]) => {
                                            return this.state.permissions
                                                .discipline
                                                ? this.state.permissions
                                                      .discipline === key
                                                    ? {
                                                          value: key,
                                                          label: value,
                                                      }
                                                    : ""
                                                : "";
                                        })}
                                        options={Object.entries(
                                            this.state.discipline
                                        ).map(([key, value]) => {
                                            return {
                                                value: key,
                                                label: value,
                                            };
                                        })}
                                        onChange={this.handleDiscipline}
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label
                                        htmlFor="board"
                                        className="primary-text font-weight-bold-600"
                                    >
                                        Board / University
                                    </label>
                                    <Select
                                        className="basic-single form-shadow"
                                        placeholder="Select board"
                                        isSearchable={true}
                                        name="board"
                                        value={this.state.board.map((list) => {
                                            return this.state.permissions.board
                                                ? this.state.permissions
                                                      .board === list.code
                                                    ? {
                                                          value: list.code,
                                                          label: list.title,
                                                      }
                                                    : ""
                                                : "";
                                        })}
                                        options={this.state.board.map(function (
                                            list
                                        ) {
                                            return {
                                                value: list.code,
                                                label: list.title,
                                            };
                                        })}
                                        onChange={this.handleBoard}
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label
                                        htmlFor="valid_from"
                                        className="primary-text font-weight-bold-600"
                                    >
                                        Valid From
                                    </label>
                                    <input
                                        type="date"
                                        name="valid_from"
                                        id="valid_from"
                                        className="form-control form-shadow"
                                        value={
                                            this.state.permissions.valid_from
                                                ? dateFormat(
                                                      this.state.permissions
                                                          .valid_from,
                                                      "yyyy-mm-dd"
                                                  )
                                                : ""
                                        }
                                        onChange={this.handleValid_from}
                                    />
                                </div>
                                <div className="form-group mb-0">
                                    <label
                                        htmlFor="valid_to"
                                        className="primary-text font-weight-bold-600"
                                    >
                                        Valid To
                                    </label>
                                    <input
                                        type="date"
                                        name="valid_to"
                                        id="valid_to"
                                        className="form-control form-shadow"
                                        value={
                                            this.state.permissions.valid_to
                                                ? dateFormat(
                                                      this.state.permissions
                                                          .valid_to,
                                                      "yyyy-mm-dd"
                                                  )
                                                : ""
                                        }
                                        onChange={this.handleValid_to}
                                    />
                                </div>
                            </div>
                            <div className="card-footer">
                                <div className="dropdown-divider"></div>
                            </div>

                            {/* Configuration */}
                            <div className="card-header pb-0">
                                <div className="row align-items-center">
                                    <div className="col-6">
                                        <h6 className="font-weight-bold-600 mb-0">
                                            Configuration
                                        </h6>
                                    </div>
                                    <div className="col-6 text-right">
                                        <button
                                            className="btn btn-primary btn-sm shadow-none"
                                            onClick={this.handleConfiguration}
                                        >
                                            {this.state.showConfigLoader ? (
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
                                    </div>
                                </div>
                            </div>
                            <div className="card-body">
                                <ConfigurationSection
                                    permissions={this.state.permissions || {}}
                                    handleSwitch={this.handleSwitch}
                                />
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

export default AdminHodProfile;
