import React, { Component, useState } from "react";
import Wrapper from "./wrapper";
import { Link } from "react-router-dom";
import {
    Modal,
    Alert,
    Spinner,
    Dropdown,
    OverlayTrigger,
    Tooltip,
} from "react-bootstrap";
import { baseUrl, hodUrl } from "../../shared/baseUrl";
import {
    GROUP_THUMBNAIL,
    paginationCount,
    SUBJECT_THUMBNAIL,
} from "../../shared/constant";
import Loading from "../common/loader";
import GroupTable from "../common/table/group";
import SubjectTable from "../common/table/subject";
import Paginations from "../common/pagination";
import AlertBox from "../common/alert";
import {
    SingleContentDeleteModal,
    MultiContentDeleteModal,
    SingleContentEnableDisableModal,
    MultiContentEnableDisableModal,
} from "../common/modal/contentManagementModal";
import { connect } from "react-redux";
import Slider from "react-slick";
import Select from "react-select";
import storeDispatch from "../../redux/dispatch";
import { COURSE, GROUP } from "../../redux/action";
import CourseTable from "../common/table/course";
import dateFormat from "dateformat";

const mapStateToProps = (state) => ({
    profile: state.user.profile,
});

class GroupEditModal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            group_name: this.props.data.group_name,
            valid_from: "",
            valid_to: "",

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

    componentDidMount = () => {
        this.setState({
            valid_from: `${dateFormat(
                this.props.data.valid_from,
                "yyyy-mm-dd"
            )} 00:00:00`,
            valid_to: `${dateFormat(
                this.props.data.valid_to,
                "yyyy-mm-dd"
            )} 00:00:00`,
        });
    };

    handleInput = (event) => {
        this.setState({
            group_name: event.target.value,
        });
    };

    handleDate = (event) => {
        const name = event.target.name;
        const value = event.target.value;
        this.setState({
            [name]: `${dateFormat(value, "yyyy-mm-dd")} 00:00:00`,
        });
    };

    handleSubmit = (event) => {
        event.preventDefault();

        this.setState({
            showLoader: true,
        });

        fetch(`${this.url}/hod/group/${this.props.data.id}/`, {
            headers: this.headers,
            method: "PATCH",
            body: JSON.stringify({
                group_name: this.state.group_name,
                valid_from: this.state.valid_from,
                valid_to: this.state.valid_to,
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

    render() {
        return (
            <Modal
                show={this.props.show}
                onHide={this.props.onHide}
                size="md"
                aria-labelledby="contained-modal-title-vcenter"
                centered
            >
                <Modal.Header closeButton>Edit Group</Modal.Header>
                <Modal.Body>
                    <Alert
                        className="sticky-top"
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
                        className="sticky-top"
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
                        <label htmlFor="subject">Group name</label>
                        <input
                            type="text"
                            name="group_name"
                            id="group_name"
                            className="form-control form-control-lg borders"
                            onChange={this.handleInput}
                            value={this.state.group_name}
                            placeholder="Enter group name"
                            autoComplete="off"
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="valid_from">Valid from</label>
                        <input
                            type="date"
                            name="valid_from"
                            id="valid_from"
                            className="form-control borders"
                            min={this.props.hod_valid_from}
                            max={this.props.hod_valid_to}
                            onChange={this.handleDate}
                            value={dateFormat(
                                this.state.valid_from,
                                "yyyy-mm-dd"
                            )}
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="valid_to">Valid to</label>
                        <input
                            type="date"
                            name="valid_to"
                            id="valid_to"
                            className="form-control borders"
                            min={this.props.hod_valid_from}
                            max={this.props.hod_valid_to}
                            onChange={this.handleDate}
                            value={dateFormat(
                                this.state.valid_to,
                                "yyyy-mm-dd"
                            )}
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
                        Save changes
                    </button>
                </Modal.Footer>
            </Modal>
        );
    }
}

class SubjectModal extends Component {
    constructor() {
        super();
        this.state = {
            category: [],
            sub_category: [],
            discipline: [],
            levels: [],
            subjects: [],
            subjectName: "",

            selectedCategory: { label: "", value: "" },
            selectedSubcategory: { label: "", value: "" },
            selectedDiscipline: { label: "", value: "" },
            selectedlevels: { label: "", value: "" },
            selectedSubjects: { label: "", value: "" },

            subcategory_loading: false,
            content_loading: false,

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

    componentDidMount = () => {
        fetch(`${this.url}/hod/levels/`, {
            headers: this.headers,
            method: "GET",
        })
            .then((res) => res.json())
            .then((result) => {
                if (result.sts === true) {
                    this.setState({
                        category: result.data.CATEGORY,
                    });
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
            subjectName: event.target.value,
        });
    };

    handleCategory = (event) => {
        let category = this.state.selectedCategory;
        category.label = event.label;
        category.value = event.value;
        this.setState({
            selectedCategory: category,
            sub_category: [],
            discipline: [],
            levels: [],
            subjects: [],
            selectedSubcategory: { label: "", value: "" },
            subcategory_loading: true,
        });

        if (event.value !== "") {
            fetch(`${this.url}/hod/levels/?category=${event.value}`, {
                headers: this.headers,
                method: "GET",
            })
                .then((res) => res.json())
                .then((result) => {
                    if (result.sts === true) {
                        this.setState({
                            sub_category: result.data.sub_category,
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
                        subcategory_loading: false,
                    });
                });
        }
    };

    handleSubcategory = (event) => {
        let sub_category = this.state.selectedSubcategory;
        sub_category.label = event.label;
        sub_category.value = event.value;
        this.setState({
            selectedSubcategory: sub_category,
            discipline: [],
            levels: [],
            subjects: [],
            content_loading: true,
        });

        if (event.value !== "") {
            fetch(
                `${this.url}/hod/levels/?category=${this.state.selectedCategory.value}&sub_category=${event.value}`,
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
                            levels: result.data.LEVELS,
                            subjects: result.data.SUBJECTS,
                            content_loading: false,
                        });
                    } else {
                        this.setState({
                            errorMsg: result.msg,
                            showErrorAlert: true,
                            content_loading: false,
                        });
                    }
                })
                .catch((err) => {
                    console.log(err);
                    this.setState({
                        errorMsg: "Something went wrong!",
                        showErrorAlert: true,
                        content_loading: false,
                    });
                });
        }
    };

    handleDiscipline = (event) => {
        let discipline = this.state.selectedDiscipline;
        discipline.label = event.label;
        discipline.value = event.value;
        this.setState({
            selectedDiscipline: discipline,
        });
    };

    handleLevel = (event) => {
        let level = this.state.selectedlevels;
        level.label = event.label;
        level.value = event.value;
        this.setState({
            selectedlevels: level,
        });
    };

    handleSubject = (event) => {
        let subject = this.state.selectedSubjects;
        subject.label = event.label;
        subject.value = event.value;
        this.setState({
            selectedSubjects: subject,
        });
    };

    handleSubmit = (event) => {
        event.preventDefault();

        this.setState({
            showLoader: true,
        });

        fetch(`${this.url}/hod/subject/`, {
            headers: this.headers,
            method: "POST",
            body: JSON.stringify({
                subject_name: this.state.subjectName,
                category: this.state.selectedCategory.value,
                sub_category: this.state.selectedSubcategory.value,
                discipline: this.state.selectedDiscipline.value,
                level: this.state.selectedlevels.value,
                subject: this.state.selectedSubjects.value,
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

    render() {
        return (
            <Modal
                show={this.props.show}
                onHide={this.props.onHide}
                size="md"
                aria-labelledby="contained-modal-title-vcenter"
                centered
                // scrollable
            >
                <Modal.Header closeButton>Create Subject</Modal.Header>
                <Modal.Body>
                    <Alert
                        className="sticky-top"
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
                        className="sticky-top"
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
                        <label htmlFor="subject">Subject name</label>
                        <input
                            type="text"
                            name="subject"
                            id="subject"
                            className="form-control form-control-lg borders"
                            onChange={this.handleInput}
                            placeholder="Enter subject name"
                            autoComplete="off"
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="category">Category</label>
                        <Select
                            className="basic-single borders"
                            placeholder="Select category"
                            isSearchable={true}
                            name="category"
                            id="category"
                            options={(this.state.category || []).map((list) => {
                                return {
                                    value: list.code,
                                    label: list.title,
                                };
                            })}
                            value={(this.state.category || []).map((list) => {
                                return this.state.selectedCategory.value ===
                                    list.code
                                    ? {
                                          value: list.code,
                                          label: list.title,
                                      }
                                    : "";
                            })}
                            onChange={this.handleCategory}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="sub_category">Sub Category</label>
                        <Select
                            className="basic-single borders"
                            placeholder="Select subcategory"
                            isSearchable={true}
                            name="sub_category"
                            id="sub_category"
                            isLoading={
                                this.state.subcategory_loading ? true : false
                            }
                            options={this.state.sub_category.map((list) => {
                                return {
                                    value: list.code,
                                    label: list.title,
                                };
                            })}
                            value={(this.state.sub_category || []).map(
                                (list) => {
                                    return this.state.selectedSubcategory
                                        .value === list.code
                                        ? {
                                              value: list.code,
                                              label: list.title,
                                          }
                                        : "";
                                }
                            )}
                            isDisabled={
                                this.state.selectedCategory.value === ""
                                    ? true
                                    : false
                            }
                            onChange={this.handleSubcategory}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="discipline">Discipline</label>
                        <Select
                            className="basic-single borders"
                            placeholder="Select discipline"
                            isSearchable={true}
                            name="discipline"
                            id="discipline"
                            isLoading={
                                this.state.content_loading ? true : false
                            }
                            options={(
                                Object.entries(this.state.discipline) || []
                            ).map(([key, value]) => {
                                return {
                                    value: key,
                                    label: value,
                                };
                            })}
                            value={(
                                Object.entries(this.state.discipline) || []
                            ).map(([key, value]) => {
                                return this.state.selectedDiscipline.value ===
                                    key
                                    ? {
                                          value: key,
                                          label: value,
                                      }
                                    : "";
                            })}
                            isDisabled={
                                this.state.selectedSubcategory.value === ""
                                    ? true
                                    : false
                            }
                            onChange={this.handleDiscipline}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="level">Level</label>
                        <Select
                            className="basic-single borders"
                            placeholder="Select level"
                            isSearchable={true}
                            name="level"
                            id="level"
                            isLoading={
                                this.state.content_loading ? true : false
                            }
                            options={(
                                Object.entries(this.state.levels) || []
                            ).map(([key, value]) => {
                                return {
                                    value: key,
                                    label: value,
                                };
                            })}
                            value={(
                                Object.entries(this.state.levels) || []
                            ).map(([key, value]) => {
                                return this.state.selectedlevels.value === key
                                    ? {
                                          value: key,
                                          label: value,
                                      }
                                    : "";
                            })}
                            isDisabled={
                                this.state.selectedSubcategory.value === ""
                                    ? true
                                    : false
                            }
                            onChange={this.handleLevel}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="subject">Subject</label>
                        <Select
                            className="basic-single borders"
                            placeholder="Select subject"
                            isSearchable={true}
                            name="subject"
                            id="subject"
                            isLoading={
                                this.state.content_loading ? true : false
                            }
                            options={(
                                Object.entries(this.state.subjects) || []
                            ).map(([key, value]) => {
                                return {
                                    value: key,
                                    label: value,
                                };
                            })}
                            value={(
                                Object.entries(this.state.subjects) || []
                            ).map(([key, value]) => {
                                return this.state.selectedSubjects.value === key
                                    ? {
                                          value: key,
                                          label: value,
                                      }
                                    : "";
                            })}
                            isDisabled={
                                this.state.selectedSubcategory.value === ""
                                    ? true
                                    : false
                            }
                            onChange={this.handleSubject}
                            required
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
                        Create Subject
                    </button>
                </Modal.Footer>
            </Modal>
        );
    }
}

class SubjectEditModal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            subject_name: this.props.data.subject_name,

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
            subject_name: event.target.value,
        });
    };

    handleSubmit = (event) => {
        event.preventDefault();

        this.setState({
            showLoader: true,
        });

        fetch(`${this.url}/hod/group/subject/`, {
            headers: this.headers,
            method: "PATCH",
            body: JSON.stringify({
                subject_id: this.props.data.id,
                subject_name: this.state.subject_name,
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

    render() {
        return (
            <Modal
                show={this.props.show}
                onHide={this.props.onHide}
                size="md"
                aria-labelledby="contained-modal-title-vcenter"
                centered
            >
                <Modal.Header closeButton>Edit Subject</Modal.Header>
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

                    <label htmlFor="subject">Subject name</label>
                    <input
                        type="text"
                        name="subject_name"
                        id="subject_name"
                        className="form-control form-control-lg borders"
                        onChange={this.handleInput}
                        value={this.state.subject_name}
                        placeholder="Enter subject name"
                        autoComplete="off"
                        required
                    />
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
                        Save changes
                    </button>
                </Modal.Footer>
            </Modal>
        );
    }
}

const GroupSection = (props) => {
    const settings = {
        dots: true,
        infinite: false,
        speed: 500,
        slidesToShow: 4,
        slidesToScroll: 4,
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
    const [tab, setTab] = useState("table");
    const [selected_data, setData] = useState([]);
    const [showModal, toggleModal] = useState(false);
    const [showEditModal, toggleEditModal] = useState(false);

    const formSubmission = () => {
        setTimeout(() => {
            toggleModal(false);
            toggleEditModal(false);
        }, 1000);
        props.loadData();
    };

    const handleGroupId = (data) => {
        let value = [];
        const group_data = props.data;
        for (let i = 0; i < group_data.length; i++) {
            if (data.includes(group_data[i].id.toString())) {
                value.push({
                    id: group_data[i].id.toString(),
                    name: group_data[i].group_name,
                });
            } else {
                continue;
            }
        }
        setData(value);
    };

    return (
        <>
            {/* Delete Modal */}
            {showModal ? (
                <MultiContentDeleteModal
                    show={showModal}
                    onHide={() => toggleModal(!showModal)}
                    formSubmission={formSubmission}
                    url={`${props.url}/hod/group/delete/`}
                    data={selected_data}
                    field="group_ids"
                    type="Group"
                />
            ) : (
                ""
            )}

            {/* Edit Modal */}
            {showEditModal ? (
                <GroupEditModal
                    show={showEditModal}
                    onHide={() => toggleEditModal(!showEditModal)}
                    formSubmission={formSubmission}
                    data={selected_data}
                    hod_valid_from={props.hod_valid_from}
                    hod_valid_to={props.hod_valid_to}
                />
            ) : (
                ""
            )}

            <div className="card shadow-sm mb-4">
                <div className="card-header">
                    <div className="row align-items-center">
                        <div className="col-md-6 mb-2 mb-md-0">
                            <h5>Groups</h5>
                        </div>
                        <div className="col-md-6 text-right">
                            <Link to={`${props.match.url}/group`}>
                                <button className="btn btn-primary btn-sm shadow-none mr-1">
                                    Group Configuration
                                </button>
                            </Link>
                            {tab === "table" ? (
                                <button
                                    className="btn btn-primary btn-sm shadow-none"
                                    onClick={() => toggleModal(!showModal)}
                                >
                                    Delete
                                </button>
                            ) : (
                                ""
                            )}
                            <div
                                className="btn-group btn-group-sm btn-group-toggle ml-2"
                                data-toggle="buttons"
                            >
                                <OverlayTrigger
                                    key="group_table"
                                    placement="top"
                                    overlay={
                                        <Tooltip
                                            id="tooltip"
                                            className="text-left"
                                        >
                                            Table View
                                        </Tooltip>
                                    }
                                >
                                    <label
                                        className={`btn btn-light ${
                                            tab === "table" ? "active" : ""
                                        }`}
                                    >
                                        <input
                                            type="radio"
                                            name="options"
                                            id="tableview"
                                            onChange={() => {
                                                setTab("table");
                                            }}
                                        />{" "}
                                        <i className="fas fa-th-list"></i>
                                    </label>
                                </OverlayTrigger>
                                <OverlayTrigger
                                    key="group_card"
                                    placement="top"
                                    overlay={
                                        <Tooltip
                                            id="tooltip"
                                            className="text-left"
                                        >
                                            Card View
                                        </Tooltip>
                                    }
                                >
                                    <label
                                        className={`btn btn-light ${
                                            tab === "card" ? "active" : ""
                                        }`}
                                    >
                                        <input
                                            type="radio"
                                            name="options"
                                            id="cardview"
                                            onChange={() => {
                                                setTab("card");
                                            }}
                                        />{" "}
                                        <i className="fas fa-th-large"></i>
                                    </label>
                                </OverlayTrigger>
                            </div>
                        </div>
                    </div>
                </div>

                {tab === "table" ? (
                    <>
                        <GroupTable
                            groupItems={props.data}
                            path="hod"
                            check={true}
                            status={true}
                            view={true}
                            hasEdit={true}
                            handleGroupId={handleGroupId}
                            handleEdit={(data) => {
                                setData(data);
                                toggleEditModal(true);
                            }}
                        />
                        <div className="card-body p-3">
                            {props.totalCount > paginationCount ? (
                                <Paginations
                                    activePage={props.activePage}
                                    totalItemsCount={props.totalCount}
                                    onChange={props.handlePageChange.bind(this)}
                                />
                            ) : null}
                        </div>
                    </>
                ) : (
                    <div className="card-body">
                        <Slider {...settings}>
                            {(props.data || []).map((data, index) => {
                                return (
                                    <div
                                        className="px-3"
                                        data-index={index}
                                        key={index}
                                    >
                                        <div className="card">
                                            <img
                                                src={GROUP_THUMBNAIL}
                                                className="card-img-top"
                                                alt={data.group_name}
                                            />
                                            <div
                                                className="text-right mt-2"
                                                style={{
                                                    position: "absolute",
                                                    right: "7px",
                                                }}
                                            >
                                                <Dropdown>
                                                    <Dropdown.Toggle
                                                        variant="white"
                                                        className="btn text-dark bg-light btn-sm shadow-none caret-off"
                                                    >
                                                        <i className="fas fa-ellipsis-v"></i>
                                                    </Dropdown.Toggle>

                                                    <Dropdown.Menu>
                                                        <Dropdown.Item
                                                            onClick={() => {
                                                                setData(data);
                                                                toggleEditModal(
                                                                    true
                                                                );
                                                            }}
                                                        >
                                                            <i className="far fa-edit mr-1"></i>{" "}
                                                            Edit
                                                        </Dropdown.Item>
                                                        <Dropdown.Item
                                                            onClick={() => {
                                                                handleGroupId([
                                                                    data.id,
                                                                ]);
                                                                toggleModal(
                                                                    !showModal
                                                                );
                                                            }}
                                                        >
                                                            <i className="far fa-trash-alt mr-1"></i>{" "}
                                                            Delete
                                                        </Dropdown.Item>
                                                    </Dropdown.Menu>
                                                </Dropdown>
                                            </div>
                                            <Link
                                                to={`${props.match.url}/group/${data.id}`}
                                                className="text-decoration-none"
                                                onClick={() => {
                                                    storeDispatch(
                                                        GROUP,
                                                        data.group_name
                                                    );
                                                }}
                                            >
                                                <div
                                                    className="card-body primary-bg text-white p-2"
                                                    style={{
                                                        cursor: "pointer",
                                                    }}
                                                >
                                                    {data.group_name}
                                                </div>
                                            </Link>
                                        </div>
                                    </div>
                                );
                            })}
                        </Slider>
                    </div>
                )}
            </div>
        </>
    );
};

const SubjectSection = (props) => {
    const [selected_data, setData] = useState({});
    const [showModal, toggleModal] = useState(false);
    const [type, setType] = useState("");
    const [showEditModal, toggleEditModal] = useState(false);

    const formSubmission = () => {
        setTimeout(() => {
            toggleModal(false);
            toggleEditModal(false);
        }, 1000);
        props.loadData();
    };

    const handleSubjectId = (data) => {
        let value = [];
        const subject_data = props.data;
        for (let i = 0; i < subject_data.length; i++) {
            if (data.includes(subject_data[i].id.toString())) {
                value.push({
                    id: subject_data[i].id.toString(),
                    name: subject_data[i].subject_name,
                });
            } else {
                continue;
            }
        }
        setData(value);
    };

    return (
        <>
            {/* Create modal */}
            {showModal && type === "ADD" ? (
                <SubjectModal
                    show={showModal}
                    onHide={() => toggleModal(!showModal)}
                    formSubmission={formSubmission}
                />
            ) : (
                ""
            )}

            {/* Delete Modal */}
            {showModal && type === "DELETE" ? (
                <MultiContentDeleteModal
                    show={showModal}
                    onHide={() => toggleModal(!showModal)}
                    formSubmission={formSubmission}
                    url={`${props.url}/hod/group/subject/`}
                    data={selected_data}
                    field="subject_ids"
                    type="subject"
                />
            ) : (
                ""
            )}

            {/* Enable / Disable Modal */}
            {showModal && type === "ENABLE/DISABLE" ? (
                <MultiContentEnableDisableModal
                    show={showModal}
                    onHide={() => toggleModal(!showModal)}
                    formSubmission={formSubmission}
                    url={`${props.url}/hod/group/subject/`}
                    data={selected_data}
                    field="subject_ids"
                    type="subject"
                />
            ) : (
                ""
            )}

            {/* Edit Modal */}
            {showEditModal ? (
                <SubjectEditModal
                    show={showEditModal}
                    onHide={() => toggleEditModal(!showEditModal)}
                    formSubmission={formSubmission}
                    data={selected_data}
                />
            ) : (
                ""
            )}

            <div className="card shadow-sm mb-4">
                <div className="card-header">
                    <div className="row align-items-center">
                        <div className="col-md-3 mb-2 mb-md-0">
                            <h5 className="mb-0">Subjects</h5>
                        </div>
                        <div className="col-md-9 text-right">
                            <button
                                className="btn btn-primary btn-sm shadow-none mr-1"
                                onClick={() => {
                                    setType("ADD");
                                    toggleModal(!showModal);
                                }}
                            >
                                Create
                            </button>
                            <button
                                className="btn btn-primary btn-sm shadow-none mr-1"
                                onClick={() => {
                                    setType("DELETE");
                                    toggleModal(!showModal);
                                }}
                            >
                                Delete
                            </button>
                            <button
                                className="btn btn-primary btn-sm shadow-none"
                                onClick={() => {
                                    setType("ENABLE/DISABLE");
                                    toggleModal(!showModal);
                                }}
                            >
                                Enable / Disable
                            </button>
                        </div>
                    </div>
                </div>
                <SubjectTable
                    subjectItems={props.data}
                    path="hod"
                    check={true}
                    status={true}
                    category={true}
                    sub_category={true}
                    discipline={true}
                    level={true}
                    subject={true}
                    hasEdit={true}
                    handleSubjectId={handleSubjectId}
                    handleEdit={(data) => {
                        setData(data);
                        toggleEditModal(true);
                    }}
                />
                <div className="card-body p-3">
                    {props.totalCount > paginationCount ? (
                        <Paginations
                            activePage={props.activePage}
                            totalItemsCount={props.totalCount}
                            onChange={props.handlePageChange.bind(this)}
                        />
                    ) : null}
                </div>
            </div>
        </>
    );
};

const CourseSection = (props) => {
    const settings = {
        dots: true,
        infinite: false,
        speed: 500,
        slidesToShow: 4,
        slidesToScroll: 4,
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
    const [tab, setTab] = useState("table");
    const [selected_data, setData] = useState({});
    const [showModal, toggleModal] = useState(false);
    const [type, setType] = useState("");

    const handleCRUD = (data, type) => {
        setData(data);
        setType(type);
        toggleModal(!showModal);
    };

    const formSubmission = () => {
        setTimeout(() => {
            toggleModal(false);
        }, 1000);
        props.loadData();
    };

    return (
        <>
            {/* Delete Modal */}
            {showModal && type === "DELETE" ? (
                <SingleContentDeleteModal
                    show={showModal}
                    onHide={() => toggleModal(!showModal)}
                    formSubmission={formSubmission}
                    url={`${props.url}/hod/course/${selected_data.course_id}/`}
                    name={selected_data.course_name}
                    type="course"
                />
            ) : (
                ""
            )}

            {/* Enable / Disable Modal */}
            {showModal && type === "Enable/Disable" ? (
                <SingleContentEnableDisableModal
                    show={showModal}
                    onHide={() => toggleModal(!showModal)}
                    formSubmission={formSubmission}
                    url={`${props.url}/hod/course/${selected_data.course_id}/status/`}
                    name={selected_data.course_name}
                    method="PATCH"
                />
            ) : (
                ""
            )}

            <div className="card shadow-sm">
                <div className="card-header">
                    <div className="row">
                        <div className="col-6">
                            <h5 className="mb-0">Course</h5>
                        </div>
                        <div className="col-6 text-right">
                            <div
                                className="btn-group btn-group-sm btn-group-toggle"
                                data-toggle="buttons"
                            >
                                <OverlayTrigger
                                    key="course_table"
                                    placement="top"
                                    overlay={
                                        <Tooltip
                                            id="tooltip"
                                            className="text-left"
                                        >
                                            Table View
                                        </Tooltip>
                                    }
                                >
                                    <label
                                        className={`btn btn-light ${
                                            tab === "table" ? "active" : ""
                                        }`}
                                    >
                                        <input
                                            type="radio"
                                            name="options"
                                            id="tableview"
                                            onChange={() => {
                                                setTab("table");
                                            }}
                                        />{" "}
                                        <i className="fas fa-th-list"></i>
                                    </label>
                                </OverlayTrigger>
                                <OverlayTrigger
                                    key="course_card"
                                    placement="top"
                                    overlay={
                                        <Tooltip
                                            id="tooltip"
                                            className="text-left"
                                        >
                                            Card View
                                        </Tooltip>
                                    }
                                >
                                    <label
                                        className={`btn btn-light ${
                                            tab === "card" ? "active" : ""
                                        }`}
                                    >
                                        <input
                                            type="radio"
                                            name="options"
                                            id="cardview"
                                            onChange={() => {
                                                setTab("card");
                                            }}
                                        />{" "}
                                        <i className="fas fa-th-large"></i>
                                    </label>
                                </OverlayTrigger>
                            </div>
                        </div>
                    </div>
                </div>
                {tab === "table" ? (
                    <>
                        <CourseTable
                            data={props.data}
                            handleCRUD={handleCRUD}
                            path={props.match.url}
                            action={true}
                            status={true}
                        />
                        <div className="card-footer"></div>
                    </>
                ) : (
                    <div className="card-body">
                        <Slider {...settings}>
                            {(props.data || []).map((data, index) => {
                                return (
                                    <div
                                        className="px-3"
                                        data-index={index}
                                        key={index}
                                    >
                                        <div className="card">
                                            <img
                                                src={
                                                    data.course_thumbnail_url ===
                                                    null
                                                        ? SUBJECT_THUMBNAIL
                                                        : data.course_thumbnail_url
                                                }
                                                className="card-img-top"
                                                alt={data.course_name}
                                            />
                                            <div
                                                className="text-right mt-2"
                                                style={{
                                                    position: "absolute",
                                                    right: "7px",
                                                }}
                                            >
                                                <Dropdown>
                                                    <Dropdown.Toggle
                                                        variant="white"
                                                        className="btn text-dark bg-light btn-sm shadow-none caret-off"
                                                    >
                                                        <i className="fas fa-ellipsis-v"></i>
                                                    </Dropdown.Toggle>

                                                    <Dropdown.Menu>
                                                        <Dropdown.Item
                                                            onClick={() => {
                                                                handleCRUD(
                                                                    data,
                                                                    "DELETE"
                                                                );
                                                            }}
                                                        >
                                                            <i className="far fa-trash-alt mr-1"></i>{" "}
                                                            Delete
                                                        </Dropdown.Item>
                                                        <Dropdown.Item
                                                            onClick={() => {
                                                                handleCRUD(
                                                                    data,
                                                                    "Enable/Disable"
                                                                );
                                                            }}
                                                        >
                                                            <i className="fas fa-ban mr-1"></i>{" "}
                                                            Enable / Disable
                                                        </Dropdown.Item>
                                                    </Dropdown.Menu>
                                                </Dropdown>
                                            </div>
                                            <Link
                                                to={`${props.match.url}/course/${data.course_id}`}
                                                className="text-decoration-none"
                                                onClick={() => {
                                                    storeDispatch(
                                                        COURSE,
                                                        data.course_name
                                                    );
                                                }}
                                            >
                                                <div
                                                    className="card-body primary-bg text-white p-2"
                                                    style={{
                                                        cursor: "pointer",
                                                    }}
                                                >
                                                    {data.course_name}
                                                </div>
                                            </Link>
                                        </div>
                                    </div>
                                );
                            })}
                        </Slider>
                    </div>
                )}
            </div>
        </>
    );
};

class HODDashboard extends Component {
    constructor(props) {
        super(props);
        this.state = {
            group_data: [],
            subject_data: [],
            course_data: [],
            selectedData: [],

            hod_valid_from: "",
            hod_valid_to: "",

            activeGroupPage: 1,
            totalGroupCount: 0,
            activeSubjectPage: 1,
            totalSubjectCount: 0,

            errorMsg: "",
            successMsg: "",
            showErrorAlert: false,
            showSuccessAlert: false,
            page_loading: true,
        };
        this.url = baseUrl + hodUrl;
        this.authToken = localStorage.getItem("Authorization");
        this.headers = {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: this.authToken,
        };
    }

    componentDidMount = () => {
        document.title = "Dashboard - HOD | IQLabs";

        this.loadGroupData();
        this.loadSubjectData();
        this.loadCourseData();
    };

    loadGroupData = () => {
        let API_URL =
            this.state.activeGroupPage > 1
                ? `${this.url}/hod/group/?page=${this.state.activeGroupPage}`
                : `${this.url}/hod/group/`;

        fetch(API_URL, {
            headers: this.headers,
            method: "GET",
        })
            .then((res) => res.json())
            .then((result) => {
                if (result.sts === true) {
                    this.setState({
                        group_data: result.data.results,
                        totalGroupCount: result.data.count,
                        hod_valid_from: dateFormat(
                            result.data.hod_valid_from,
                            "yyyy-mm-dd"
                        ),
                        hod_valid_to: dateFormat(
                            result.data.hod_valid_to,
                            "yyyy-mm-dd"
                        ),
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
                    errorMsg: "Cannot load group at the moment!",
                    showErrorAlert: true,
                    page_loading: false,
                });
            });
    };

    loadSubjectData = () => {
        let API_URL =
            this.state.activeSubjectPage > 1
                ? `${this.url}/hod/subject/?page=${this.state.activeSubjectPage}`
                : `${this.url}/hod/subject/`;

        fetch(API_URL, {
            headers: this.headers,
            method: "GET",
        })
            .then((res) => res.json())
            .then((result) => {
                if (result.sts === true) {
                    this.setState({
                        subject_data: result.data.results,
                        totalSubjectCount: result.data.count,
                        page_loading: false,
                    });
                } else {
                    console.log(result.msg);
                    this.setState({
                        page_loading: false,
                    });
                }
            })
            .catch((err) => {
                console.log(err);
                this.setState({
                    errorMsg: "Cannot load subject at the moment!",
                    showErrorAlert: true,
                    page_loading: false,
                });
            });
    };

    loadCourseData = () => {
        fetch(`${this.url}/hod/course/`, {
            headers: this.headers,
            method: "GET",
        })
            .then((res) => res.json())
            .then((result) => {
                if (result.sts === true) {
                    this.setState({
                        course_data: result.data,
                        page_loading: false,
                    });
                } else {
                    console.log(result.msg);
                    this.setState({
                        page_loading: false,
                    });
                }
            })
            .catch((err) => {
                console.log(err);
                this.setState({
                    errorMsg: "Cannot load courses at the moment!",
                    showErrorAlert: true,
                    page_loading: false,
                });
            });
    };

    handleGroupPageChange(pageNumber) {
        this.setState(
            { activeGroupPage: pageNumber, page_loading: true },
            () => {
                this.loadGroupData();
            }
        );
    }

    handleSubjectPageChange(pageNumber) {
        this.setState(
            { activeSubjectPage: pageNumber, page_loading: true },
            () => {
                this.loadSubjectData();
            }
        );
    }

    render() {
        return (
            <Wrapper
                header="Dashboard"
                activeLink="dashboard"
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

                {/* ----- Welcome ----- */}
                <div className="card shadow-sm mb-4">
                    <div className="card-body text-center p-4">
                        <h3 className="primary-text mb-0">WELCOME BACK</h3>
                    </div>
                </div>

                {/* ----- Group card ----- */}
                <GroupSection
                    {...this.props}
                    data={this.state.group_data}
                    hod_valid_from={this.state.hod_valid_from}
                    hod_valid_to={this.state.hod_valid_to}
                    loadData={this.loadGroupData}
                    totalCount={this.state.totalGroupCount}
                    activePage={this.state.activeGroupPage}
                    handlePageChange={this.handleGroupPageChange}
                    url={this.url}
                />

                {/* check if the hod has course config permissions */}
                {this.props.profile &&
                Object.keys(this.props.profile).length !== 0 ? (
                    this.props.profile.permissions !== undefined ? (
                        this.props.profile.permissions.config_course ===
                        true ? (
                            <>
                                {/* ----- Subject card ----- */}
                                <SubjectSection
                                    {...this.props}
                                    data={this.state.subject_data}
                                    loadData={this.loadSubjectData}
                                    totalCount={this.state.totalSubjectCount}
                                    activePage={this.state.activeSubjectPage}
                                    handlePageChange={
                                        this.handleSubjectPageChange
                                    }
                                    url={this.url}
                                />

                                {/* ----- Course card ----- */}
                                <CourseSection
                                    {...this.props}
                                    data={this.state.course_data}
                                    loadData={this.loadCourseData}
                                    url={this.url}
                                />
                            </>
                        ) : (
                            ""
                        )
                    ) : (
                        ""
                    )
                ) : (
                    ""
                )}

                {/* Loading component */}
                {this.state.page_loading ? <Loading /> : ""}
            </Wrapper>
        );
    }
}

export default connect(mapStateToProps)(HODDashboard);
