import React, { Component } from "react";
import Wrapper from "./wrapper";
import { Tabs, Tab, Modal, Alert, Spinner, Dropdown } from "react-bootstrap";
import { baseUrl, adminPathUrl } from "../../shared/baseUrl.js";
import { paginationCount } from "../../shared/constant.js";
import Select from "react-select";
import HODTable from "../common/table/hod";
import StudentTable from "../common/table/student";
import Paginations from "../common/pagination";
import ReactSwitch from "../common/switchComponent";
import dateFormat from "dateformat";
import { Link } from "react-router-dom";
import {
    UserDeleteModal,
    UserEnableDisableModal,
} from "../common/modal/userManagementModal";
import Loading from "../common/loader";
import AlertBox from "../common/alert";
import NotificationModal from "../common/modal/notification";

class HODModal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            email: "",
            username: "",
            password: "",
            categoryItems: [],
            subCategoryItems: [],
            disciplineItems: [],
            boardItems: [],

            category: "",
            sub_category: "",
            discipline: "",
            board: "",
            valid_from: "",
            valid_to: "",
            prog_sco_card: false,
            type_1_q: false,
            type_2_q: false,
            quiz: false,
            match: false,
            copy_download: false,
            summary: false,
            direct_q: false,
            config_course: false,
            sim_exam: false,
            lock_test: false,
            android_app: false,

            errorMsg: "",
            successMsg: "",
            showErrorAlert: false,
            showSuccessAlert: false,
            showLoader: false,
            subcategory_loading: false,
            discipline_loading: false,
            showPassword: false,
            selectAll: false,
        };
        this.url = baseUrl + adminPathUrl;
        this.authToken = localStorage.getItem("Inquel-Auth");
        this.headers = {
            Accept: "application/json",
            "Content-Type": "application/json",
            "Inquel-Auth": this.authToken,
        };
    }

    // Fetch Category & Board Data
    componentDidMount = () => {
        fetch(`${this.url}/data/filter/`, {
            headers: this.headers,
            method: "GET",
        })
            .then((res) => res.json())
            .then((result) => {
                if (result.sts === true) {
                    this.setState({
                        categoryItems: result.data.CATEGORY,
                        boardItems: result.data.BOARD,
                        category: "",
                        sub_category: "",
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

    handleSubmit = (event) => {
        event.preventDefault();
        this.setState({
            showLoader: true,
            showErrorAlert: false,
            showSuccessAlert: false,
        });
        if (this.state.password.length < 8) {
            this.setState({
                errorMsg: "Password is too short",
                showErrorAlert: true,
                showLoader: false,
            });
        } else {
            fetch(`${this.url}/create/hod/`, {
                headers: this.headers,
                method: "POST",
                body: JSON.stringify({
                    institute: {
                        hods: {
                            hod1: {
                                email: this.state.email,
                                username: this.state.username,
                                password: this.state.password,
                                category: this.state.category,
                                sub_category: this.state.sub_category,
                                discipline: this.state.discipline,
                                board: this.state.board,
                                valid_from: this.state.valid_from,
                                valid_to: this.state.valid_to,
                                prog_sco_card: this.state.prog_sco_card,
                                type_1_q: this.state.type_1_q,
                                type_2_q: this.state.type_2_q,
                                direct_q: this.state.direct_q,
                                quiz: this.state.quiz,
                                match: this.state.match,
                                config_course: this.state.config_course,
                                summary: this.state.summary,
                                sim_exam: this.state.sim_exam,
                                lock_test: this.state.lock_test,
                                copy_download: this.state.copy_download,
                                android_app: this.state.android_app,
                            },
                        },
                    },
                }),
            })
                .then((res) => res.json())
                .then((result) => {
                    if (result.sts) {
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

    handleCategory = (event) => {
        this.setState({
            category: event.value,
        });
        this.setState({
            subCategoryItems: [],
            disciplineItems: [],
            sub_category: "",
            discipline: "",
            subcategory_loading: true,
        });

        if (event.value !== "") {
            fetch(`${this.url}/data/filter/?category=${event.value}`, {
                headers: this.headers,
                method: "GET",
            })
                .then((res) => res.json())
                .then((result) => {
                    if (result.sts) {
                        this.setState({
                            subCategoryItems: result.data.sub_category,
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
        this.setState({
            sub_category: event.value,
        });
        this.setState({
            disciplineItems: [],
            discipline: "",
            discipline_loading: true,
        });

        if (event.value !== "") {
            fetch(
                `${this.url}/data/filter/?category=${this.state.category}&sub_category=${event.value}`,
                {
                    headers: this.headers,
                    method: "GET",
                }
            )
                .then((res) => res.json())
                .then((result) => {
                    if (result.sts) {
                        this.setState({
                            disciplineItems: result.data.DISCIPLINE,
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
        this.setState({
            discipline: event.value,
        });
    };

    handleBoard = (event) => {
        this.setState({
            board: event.value,
        });
    };

    handleDate = (event) => {
        this.setState({
            [event.target.name]: `${dateFormat(
                event.target.value,
                "yyyy-mm-dd"
            )} 00:00:00`,
        });
    };

    handleChange = (event) => {
        this.setState({
            [event.target.name]: event.target.value,
        });
    };

    handleSwitch = (type) => {
        this.setState({
            [type]: !this.state[type],
        });
    };

    handleSelectAll = () => {
        this.setState({
            selectAll: !this.state.selectAll,
            prog_sco_card: !this.state.selectAll,
            type_1_q: !this.state.selectAll,
            type_2_q: !this.state.selectAll,
            quiz: !this.state.selectAll,
            match: !this.state.selectAll,
            copy_download: !this.state.selectAll,
            summary: !this.state.selectAll,
            direct_q: !this.state.selectAll,
            config_course: !this.state.selectAll,
            sim_exam: !this.state.selectAll,
            lock_test: !this.state.selectAll,
            android_app: !this.state.selectAll,
        });
    };

    render() {
        return (
            <Modal
                show={this.props.show}
                onHide={this.props.onHide}
                size="lg"
                backdrop="static"
                aria-labelledby="contained-modal-title-vcenter"
                centered
            >
                <Modal.Header closeButton>Create HOD</Modal.Header>
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
                    <form
                        action=""
                        onSubmit={this.handleSubmit}
                        autoComplete="off"
                    >
                        <div className="row mb-2">
                            <div className="form-group col-md-4">
                                <label htmlFor="email">Email</label>
                                <input
                                    type="email"
                                    name="email"
                                    id="email"
                                    className="form-control form-shadow"
                                    placeholder="Enter email"
                                    onChange={this.handleChange}
                                    value={this.state.email}
                                    required
                                />
                            </div>
                            <div className="form-group col-md-4">
                                <label htmlFor="username">Username</label>
                                <input
                                    type="text"
                                    name="username"
                                    id="username"
                                    className="form-control form-shadow"
                                    placeholder="Enter username"
                                    onChange={this.handleChange}
                                    value={this.state.username}
                                    required
                                />
                            </div>
                            <div className="form-group col-md-4">
                                <label htmlFor="password">Password</label>
                                <div
                                    className="input-group form-shadow"
                                    style={{
                                        borderRadius: "6px",
                                    }}
                                >
                                    <input
                                        type={
                                            this.state.showPassword
                                                ? "text"
                                                : "password"
                                        }
                                        name="password"
                                        id="password"
                                        className="form-control"
                                        onChange={this.handleChange}
                                        value={this.state.password}
                                        placeholder="**********"
                                        required
                                    />
                                    <div className="input-group-append">
                                        <button
                                            className="btn btn-link btn-sm bg-white shadow-none"
                                            type="button"
                                            onClick={() =>
                                                this.setState({
                                                    showPassword:
                                                        !this.state
                                                            .showPassword,
                                                })
                                            }
                                        >
                                            {this.state.showPassword ? (
                                                <i className="far fa-eye-slash"></i>
                                            ) : (
                                                <i className="far fa-eye"></i>
                                            )}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="row mb-2">
                            <div className="col-md-6">
                                <h6 className="primary-text mb-3">Details</h6>
                                <div className="form-group">
                                    <label htmlFor="category">Category</label>
                                    <Select
                                        className="basic-single form-shadow"
                                        placeholder="Select category"
                                        isSearchable={true}
                                        name="category"
                                        options={this.state.categoryItems.map(
                                            function (list) {
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
                                    <label htmlFor="subcategory">
                                        Sub Category
                                    </label>
                                    <Select
                                        className="basic-single form-shadow"
                                        placeholder="Select subcategory"
                                        isDisabled={
                                            this.state.category === ""
                                                ? true
                                                : false
                                        }
                                        isLoading={
                                            this.state.subcategory_loading
                                                ? true
                                                : false
                                        }
                                        isSearchable={true}
                                        name="sub_category"
                                        options={this.state.subCategoryItems.map(
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
                                    <label htmlFor="discipline">
                                        Discipline
                                    </label>
                                    <Select
                                        className="basic-single form-shadow"
                                        placeholder="Select discipline"
                                        isDisabled={
                                            this.state.sub_category === ""
                                                ? true
                                                : false
                                        }
                                        isLoading={
                                            this.state.discipline_loading
                                                ? true
                                                : false
                                        }
                                        isSearchable={true}
                                        name="discipline"
                                        options={Object.entries(
                                            this.state.disciplineItems
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
                                    <label htmlFor="board">
                                        Board / University
                                    </label>
                                    <Select
                                        className="basic-single form-shadow"
                                        placeholder="Select board"
                                        isSearchable={true}
                                        name="board"
                                        options={this.state.boardItems.map(
                                            (list) => {
                                                return {
                                                    value: list.code,
                                                    label: list.title,
                                                };
                                            }
                                        )}
                                        onChange={this.handleBoard}
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="valid_from">
                                        Valid From
                                    </label>
                                    <input
                                        type="date"
                                        name="valid_from"
                                        id="valid_from"
                                        className="form-control form-shadow"
                                        onChange={this.handleDate}
                                    />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="valid_to">Valid To</label>
                                    <input
                                        type="date"
                                        name="valid_to"
                                        id="valid_to"
                                        className="form-control form-shadow"
                                        onChange={this.handleDate}
                                    />
                                </div>
                            </div>
                            <div className="col-md-6">
                                <div className="row align-items-center mb-3">
                                    <div className="col-6">
                                        <h6 className="primary-text">
                                            Configuration
                                        </h6>
                                    </div>
                                    <div className="col-6 text-right align-items-center">
                                        <label
                                            htmlFor="select-all"
                                            className="mr-2 mb-0"
                                        >
                                            Select All
                                        </label>
                                        <ReactSwitch
                                            checked={this.state.selectAll}
                                            onChange={this.handleSelectAll}
                                        />
                                    </div>
                                </div>
                                <div className="row mb-3">
                                    <div className="col-9">
                                        <p className="primary-text small mb-0 font-weight-bold">
                                            Progressive Score
                                        </p>
                                    </div>
                                    <div className="col-3 text-right">
                                        <ReactSwitch
                                            checked={this.state.prog_sco_card}
                                            onChange={() =>
                                                this.handleSwitch(
                                                    "prog_sco_card"
                                                )
                                            }
                                        />
                                    </div>
                                </div>
                                <div className="row mb-3">
                                    <div className="col-9">
                                        <p className="primary-text small mb-0 font-weight-bold">
                                            Type 1
                                        </p>
                                    </div>
                                    <div className="col-3 text-right">
                                        <ReactSwitch
                                            checked={this.state.type_1_q}
                                            onChange={() =>
                                                this.handleSwitch("type_1_q")
                                            }
                                        />
                                    </div>
                                </div>
                                <div className="row mb-3">
                                    <div className="col-9">
                                        <p className="primary-text small mb-0 font-weight-bold">
                                            Type 2
                                        </p>
                                    </div>
                                    <div className="col-3 text-right">
                                        <ReactSwitch
                                            checked={this.state.type_2_q}
                                            onChange={() =>
                                                this.handleSwitch("type_2_q")
                                            }
                                        />
                                    </div>
                                </div>
                                <div className="row mb-3">
                                    <div className="col-9">
                                        <p className="primary-text small mb-0 font-weight-bold">
                                            Quiz
                                        </p>
                                    </div>
                                    <div className="col-3 text-right">
                                        <ReactSwitch
                                            checked={this.state.quiz}
                                            onChange={() =>
                                                this.handleSwitch("quiz")
                                            }
                                        />
                                    </div>
                                </div>
                                <div className="row mb-3">
                                    <div className="col-9">
                                        <p className="primary-text small mb-0 font-weight-bold">
                                            Match
                                        </p>
                                    </div>
                                    <div className="col-3 text-right">
                                        <ReactSwitch
                                            checked={this.state.match}
                                            onChange={() =>
                                                this.handleSwitch("match")
                                            }
                                        />
                                    </div>
                                </div>
                                <div className="row mb-3">
                                    <div className="col-9">
                                        <p className="primary-text small mb-0 font-weight-bold">
                                            Notes
                                        </p>
                                    </div>
                                    <div className="col-3 text-right">
                                        <ReactSwitch
                                            checked={this.state.copy_download}
                                            onChange={() =>
                                                this.handleSwitch(
                                                    "copy_download"
                                                )
                                            }
                                        />
                                    </div>
                                </div>
                                <div className="row mb-3">
                                    <div className="col-9">
                                        <p className="primary-text small mb-0 font-weight-bold">
                                            Summary
                                        </p>
                                    </div>
                                    <div className="col-3 text-right">
                                        <ReactSwitch
                                            checked={this.state.summary}
                                            onChange={() =>
                                                this.handleSwitch("summary")
                                            }
                                        />
                                    </div>
                                </div>
                                <div className="row mb-3">
                                    <div className="col-9">
                                        <p className="primary-text small mb-0 font-weight-bold">
                                            Direct Questions
                                        </p>
                                    </div>
                                    <div className="col-3 text-right">
                                        <ReactSwitch
                                            checked={this.state.direct_q}
                                            onChange={() =>
                                                this.handleSwitch("direct_q")
                                            }
                                        />
                                    </div>
                                </div>
                                <div className="row mb-3">
                                    <div className="col-9">
                                        <p className="primary-text small mb-0 font-weight-bold">
                                            Configure
                                        </p>
                                    </div>
                                    <div className="col-3 text-right">
                                        <ReactSwitch
                                            checked={this.state.config_course}
                                            onChange={() =>
                                                this.handleSwitch(
                                                    "config_course"
                                                )
                                            }
                                        />
                                    </div>
                                </div>
                                <div className="row mb-3">
                                    <div className="col-9">
                                        <p className="primary-text small mb-0 font-weight-bold">
                                            Simulation Exam
                                        </p>
                                    </div>
                                    <div className="col-3 text-right">
                                        <ReactSwitch
                                            checked={this.state.sim_exam}
                                            onChange={() =>
                                                this.handleSwitch("sim_exam")
                                            }
                                        />
                                    </div>
                                </div>
                                <div className="row mb-3">
                                    <div className="col-9">
                                        <p className="primary-text small mb-0 font-weight-bold">
                                            Locking of Tests
                                        </p>
                                    </div>
                                    <div className="col-3 text-right">
                                        <ReactSwitch
                                            checked={this.state.lock_test}
                                            onChange={() =>
                                                this.handleSwitch("lock_test")
                                            }
                                        />
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-9">
                                        <p className="primary-text small mb-0 font-weight-bold">
                                            Mobile App
                                        </p>
                                    </div>
                                    <div className="col-3 text-right">
                                        <ReactSwitch
                                            checked={this.state.android_app}
                                            onChange={() =>
                                                this.handleSwitch("android_app")
                                            }
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="form-group">
                            <button
                                className="btn btn-primary btn-block shadow-none"
                                type="submit"
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
                                Create
                            </button>
                        </div>
                    </form>
                </Modal.Body>
            </Modal>
        );
    }
}

class AdminHODAndStudentList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            activeHODPage: 1,
            totalHODCount: 0,
            activeStudentPage: 1,
            totalStudentCount: 0,

            showModal: false,
            showHOD_DeleteModal: false,
            showHOD_EnableDisableModal: false,
            showStudent_DeleteModal: false,
            showStudent_EnableDisableModal: false,

            activeTab: "hod",
            notify_all: false,
            showNotificationModal: false,

            hodItems: [],
            studentItems: [],
            selectedHOD: [],
            selectedStudent: [],

            errorMsg: "",
            successMsg: "",
            showErrorAlert: false,
            showSuccessAlert: false,
            page_loading: true,
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

    handleSelect = (key) => {
        this.setState({ activeTab: key });
        this.props.history.push({ hash: key });
    };

    // Fetch HOD List
    loadHodData = (page) => {
        let URL =
            page && page > 1
                ? `${this.url}/hod/?page=${page}`
                : `${this.url}/hod/`;

        fetch(URL, {
            headers: this.headers,
            method: "GET",
        })
            .then((res) => res.json())
            .then((result) => {
                if (result.sts === true) {
                    this.setState({
                        hodItems: result.data.results,
                        totalHODCount: result.data.count,
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

    // Fetch Students list
    loadStudentData = (page) => {
        let URL =
            page && page > 1
                ? `${this.url}/student/?page=${page}`
                : `${this.url}/student/`;

        fetch(URL, {
            headers: this.headers,
            method: "GET",
        })
            .then((res) => res.json())
            .then((result) => {
                if (result.sts === true) {
                    this.setState({
                        studentItems: result.data.results,
                        totalStudentCount: result.data.count,
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
        if (!this.props.location.hash) {
            this.setState({ activeTab: "hod" });
        } else {
            this.setState({ activeTab: this.props.location.hash.substring(1) });
        }

        this.loadHodData();
        this.loadStudentData();
    };

    componentDidUpdate = (prevProps, prevState) => {
        if (!this.props.location.hash) {
            if (this.state.activeTab === "student") {
                this.setState({
                    activeTab: "hod",
                });
            }
        } else {
            if (
                this.props.location.hash.substring(1) !== this.state.activeTab
            ) {
                this.setState({
                    activeTab: this.props.location.hash.substring(1),
                });
            }
        }
    };

    handleDelete = () => {
        if (this.state.activeTab === "hod") {
            this.setState({
                showHOD_DeleteModal: !this.state.showHOD_DeleteModal,
            });
        } else if (this.state.activeTab === "student") {
            this.setState({
                showStudent_DeleteModal: !this.state.showStudent_DeleteModal,
            });
        }
    };

    handleEnableDisable = () => {
        if (this.state.activeTab === "hod") {
            this.setState({
                showHOD_EnableDisableModal:
                    !this.state.showHOD_EnableDisableModal,
            });
        } else if (this.state.activeTab === "student") {
            this.setState({
                showStudent_EnableDisableModal:
                    !this.state.showStudent_EnableDisableModal,
            });
        }
    };

    // Gets HOD ID from the HOD table
    handleHODId = (data) => {
        let value = [];
        const hodItems = this.state.hodItems;
        for (let i = 0; i < hodItems.length; i++) {
            if (data.includes(hodItems[i].id.toString())) {
                value.push({
                    id: hodItems[i].id.toString(),
                    username: hodItems[i].username,
                });
            } else {
                continue;
            }
        }
        this.setState({
            selectedHOD: value,
        });
    };

    // Gets Student ID from the Student table
    handleStudentId = (data) => {
        let value = [];
        const studentItems = this.state.studentItems;
        for (let i = 0; i < studentItems.length; i++) {
            if (data.includes(studentItems[i].id.toString())) {
                value.push({
                    id: studentItems[i].id.toString(),
                    username: studentItems[i].username,
                });
            } else {
                continue;
            }
        }
        this.setState({
            selectedStudent: value,
        });
    };

    formSubmission = () => {
        setTimeout(() => {
            this.setState({
                showModal: false,
                showHOD_DeleteModal: false,
                showHOD_EnableDisableModal: false,
            });
        }, 1000);
        this.loadHodData();
    };

    studentFormSubmission = () => {
        setTimeout(() => {
            this.setState({
                showStudent_DeleteModal: false,
                showStudent_EnableDisableModal: false,
            });
        }, 1000);
        this.loadStudentData();
    };

    handleHODPageChange(pageNumber) {
        this.setState({ activeHODPage: pageNumber, page_loading: true }, () => {
            this.loadHodData(this.state.activeHODPage);
        });
    }

    handleStudentPageChange(pageNumber) {
        this.setState(
            { activeStudentPage: pageNumber, page_loading: true },
            () => {
                this.loadStudentData(this.state.activeStudentPage);
            }
        );
    }

    render() {
        document.title =
            this.state.activeTab === "hod"
                ? "HOD List - Admin | IQLabs"
                : "Student List - Admin | IQLabs";
        return (
            <Wrapper
                history={this.props.history}
                header={`${
                    this.state.activeTab === "hod" ? "HOD List" : "Student List"
                }`}
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

                {/* HOD create Modal */}
                {this.state.showModal ? (
                    <HODModal
                        show={this.state.showModal}
                        onHide={this.toggleModal}
                        formSubmission={this.formSubmission}
                    />
                ) : (
                    ""
                )}

                {/* HOD Delete Modal */}
                {this.state.showHOD_DeleteModal ? (
                    <UserDeleteModal
                        show={this.state.showHOD_DeleteModal}
                        onHide={this.handleDelete}
                        toggleModal={this.handleDelete}
                        formSubmission={this.formSubmission}
                        url={`${this.url}/hod/`}
                        data={this.state.selectedHOD}
                        field="hod_ids"
                        type="HOD"
                        token="Inquel-Auth"
                    />
                ) : (
                    ""
                )}

                {/* HOD Enable Disable Modal */}
                {this.state.showHOD_EnableDisableModal ? (
                    <UserEnableDisableModal
                        show={this.state.showHOD_EnableDisableModal}
                        onHide={this.handleEnableDisable}
                        toggleModal={this.handleEnableDisable}
                        formSubmission={this.formSubmission}
                        url={`${this.url}/hod/`}
                        data={this.state.selectedHOD}
                        field="hod_ids"
                        type="HOD"
                        token="Inquel-Auth"
                    />
                ) : (
                    ""
                )}

                {/* Student Delete Modal */}
                {this.state.showStudent_DeleteModal ? (
                    <UserDeleteModal
                        show={this.state.showStudent_DeleteModal}
                        onHide={this.handleDelete}
                        toggleModal={this.handleDelete}
                        formSubmission={this.studentFormSubmission}
                        url={`${this.url}/student/`}
                        data={this.state.selectedStudent}
                        field="student_ids"
                        type="Student"
                        token="Inquel-Auth"
                    />
                ) : (
                    ""
                )}

                {/* Student Enable Disable Modal */}
                {this.state.showStudent_EnableDisableModal ? (
                    <UserEnableDisableModal
                        show={this.state.showStudent_EnableDisableModal}
                        onHide={this.handleEnableDisable}
                        toggleModal={this.handleEnableDisable}
                        formSubmission={this.studentFormSubmission}
                        url={`${this.url}/student/`}
                        data={this.state.selectedStudent}
                        field="student_ids"
                        type="Student"
                        token="Inquel-Auth"
                    />
                ) : (
                    ""
                )}

                {/* Notification Modal */}
                {this.state.showNotificationModal ? (
                    <NotificationModal
                        show={this.state.showNotificationModal}
                        onHide={() => {
                            this.setState({
                                showNotificationModal: false,
                            });
                        }}
                        url={
                            this.state.activeTab === "hod"
                                ? `${this.url}/hod/notify/`
                                : `${this.url}/student/notify/`
                        }
                        data={
                            this.state.activeTab === "hod"
                                ? this.state.selectedHOD
                                : this.state.selectedStudent
                        }
                        field={
                            this.state.activeTab === "hod"
                                ? "hod_id"
                                : "student_id"
                        }
                        notify_all={this.state.notify_all}
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
                                    <Link to="/admin">
                                        <i className="fas fa-home fa-sm"></i>
                                    </Link>
                                </li>
                                <li className="breadcrumb-item active">
                                    {this.state.activeTab === "hod"
                                        ? "HOD"
                                        : "Student"}
                                </li>
                            </ol>
                        </nav>
                    </div>
                    <div className="col-md-6 d-flex justify-content-end">
                        {this.state.activeTab === "hod" ? (
                            <button
                                className="btn btn-primary btn-sm shadow-none mr-1"
                                onClick={this.toggleModal}
                            >
                                Add New
                            </button>
                        ) : (
                            ""
                        )}
                        <button
                            className="btn btn-primary btn-sm shadow-none mr-1"
                            onClick={this.handleDelete}
                        >
                            Delete
                        </button>
                        <button
                            className="btn btn-primary btn-sm shadow-none mr-1"
                            onClick={this.handleEnableDisable}
                        >
                            Enable / Disable
                        </button>
                        <Dropdown>
                            <Dropdown.Toggle
                                variant="primary"
                                id="dropdown-basic"
                                className="btn-sm shadow-none"
                            >
                                Notify
                            </Dropdown.Toggle>

                            <Dropdown.Menu className="dropdown-menu-down dropdown-menu-down-btn">
                                <Dropdown.Item
                                    onClick={() => {
                                        this.setState({
                                            showNotificationModal: true,
                                            notify_all: true,
                                        });
                                    }}
                                >
                                    Notify All
                                </Dropdown.Item>
                                <div className="dropdown-divider"></div>
                                <Dropdown.Item
                                    onClick={() => {
                                        if (this.state.activeTab === "hod") {
                                            if (
                                                this.state.selectedHOD
                                                    .length !== 0
                                            ) {
                                                this.setState({
                                                    showNotificationModal: true,
                                                    notify_all: false,
                                                });
                                            } else {
                                                this.setState({
                                                    errorMsg:
                                                        "Select hod to send notification",
                                                    showErrorAlert: true,
                                                });
                                            }
                                        } else {
                                            if (
                                                this.state.selectedStudent
                                                    .length !== 0
                                            ) {
                                                this.setState({
                                                    showNotificationModal: true,
                                                    notify_all: false,
                                                });
                                            } else {
                                                this.setState({
                                                    errorMsg:
                                                        "Select student to send notification",
                                                    showErrorAlert: true,
                                                });
                                            }
                                        }
                                    }}
                                >
                                    Notify Selected
                                </Dropdown.Item>
                            </Dropdown.Menu>
                        </Dropdown>
                    </div>
                </div>

                <Tabs
                    activeKey={
                        !this.props.location.hash
                            ? "hod"
                            : this.props.location.hash.substring(1)
                    }
                    id="uncontrolled-tab-example"
                    onSelect={this.handleSelect}
                >
                    {/* HOD Table */}
                    <Tab eventKey="hod" title="HOD">
                        <div className="card shadow-sm">
                            <HODTable
                                hodItems={this.state.hodItems}
                                handleHODId={this.handleHODId}
                            />
                            <div className="card-body p-3">
                                {this.state.totalHODCount > paginationCount ? (
                                    <Paginations
                                        activePage={this.state.activeHODPage}
                                        totalItemsCount={
                                            this.state.totalHODCount
                                        }
                                        onChange={this.handleHODPageChange.bind(
                                            this
                                        )}
                                    />
                                ) : null}
                            </div>
                        </div>
                    </Tab>

                    {/* Student table */}
                    <Tab eventKey="student" title="Student">
                        <div className="card shadow-sm">
                            <StudentTable
                                studentItems={this.state.studentItems}
                                path="admin"
                                handleStudentId={this.handleStudentId}
                            />
                            <div className="card-body p-3">
                                {this.state.totalStudentCount >
                                paginationCount ? (
                                    <Paginations
                                        activePage={
                                            this.state.activeStudentPage
                                        }
                                        totalItemsCount={
                                            this.state.totalStudentCount
                                        }
                                        onChange={this.handleStudentPageChange.bind(
                                            this
                                        )}
                                    />
                                ) : null}
                            </div>
                        </div>
                    </Tab>
                </Tabs>

                {/* Loading component */}
                {this.state.page_loading ? <Loading /> : ""}
            </Wrapper>
        );
    }
}

export default AdminHODAndStudentList;
