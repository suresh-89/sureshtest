import React, { Component } from "react";
import Wrapper from "./wrapper";
import { Link } from "react-router-dom";
import { Modal, Spinner, Alert, Tabs, Tab, Dropdown } from "react-bootstrap";
import { baseUrl, adminPathUrl } from "../../shared/baseUrl";
import Loading from "../common/loader";
import AlertBox from "../common/alert";
import { SingleContentDeleteModal } from "../common/modal/contentManagementModal";

class ContentAdding extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: {},
            errorMsg: "",
            successMsg: "",
            showErrorAlert: false,
            showSuccessAlert: false,
            showLoader: false,
        };
    }

    componentDidMount = () => {
        this.setState({
            data: this.props.data,
        });
    };

    handleSubmit = (event) => {
        event.preventDefault();
        this.setState({
            showLoader: true,
        });

        fetch(`${this.props.url}/data/master/`, {
            headers: this.props.headers,
            method: "PUT",
            body: JSON.stringify(this.state.data),
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
        let data = this.state.data;
        if (this.props.type === "category") {
            data.category[event.target.name] = event.target.value;
        }
        if (this.props.type === "sub_category") {
            data.category.sub_category[event.target.name] = event.target.value;
        }
        if (
            this.props.type === "discipline" ||
            this.props.type === "level" ||
            this.props.type === "subject"
        ) {
            data.category.sub_category[this.props.type][event.target.name] =
                event.target.value;
        }
        if (this.props.type === "board" || this.props.type === "course") {
            data[this.props.type][event.target.name] = event.target.value;
        }
        this.setState({
            data: data,
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
                <Modal.Header closeButton>Add master data</Modal.Header>
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
                            <label htmlFor="code">Code</label>
                            <input
                                type="text"
                                name="code"
                                id="code"
                                className="form-control borders"
                                onChange={this.handleInput}
                                placeholder="Enter code"
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="title">Title</label>
                            <input
                                type="text"
                                name="title"
                                id="title"
                                className="form-control borders"
                                onChange={this.handleInput}
                                placeholder="Enter title"
                                required
                            />
                        </div>
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

class ContentUpdate extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: {},
            code: "",
            title: "",

            errorMsg: "",
            successMsg: "",
            showErrorAlert: false,
            showSuccessAlert: false,
            showLoader: false,
        };
    }

    componentDidMount = () => {
        let code = this.state.code;
        let title = this.state.title;
        if (this.props.type === "category") {
            code = this.props.data.category.code;
            title = this.props.data.category.title;
        }
        if (this.props.type === "sub_category") {
            code = this.props.data.category.sub_category.code;
            title = this.props.data.category.sub_category.title;
        }
        if (
            this.props.type === "discipline" ||
            this.props.type === "level" ||
            this.props.type === "subject"
        ) {
            code = this.props.data.category.sub_category[this.props.type].code;
            title =
                this.props.data.category.sub_category[this.props.type].title;
        }
        if (this.props.type === "board" || this.props.type === "course") {
            code = this.props.data[this.props.type].code;
            title = this.props.data[this.props.type].title;
        }
        this.setState({
            data: this.props.data,
            code: code,
            title: title,
        });
    };

    handleSubmit = (event) => {
        event.preventDefault();
        this.setState({
            showLoader: true,
        });

        fetch(`${this.props.url}/data/master/`, {
            headers: this.props.headers,
            method: "PATCH",
            body: JSON.stringify(this.state.data),
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
        let data = this.state.data;
        if (this.props.type === "category") {
            data.category[event.target.name] = event.target.value;
        }
        if (this.props.type === "sub_category") {
            data.category.sub_category[event.target.name] = event.target.value;
        }
        if (
            this.props.type === "discipline" ||
            this.props.type === "level" ||
            this.props.type === "subject"
        ) {
            data.category.sub_category[this.props.type][event.target.name] =
                event.target.value;
        }
        if (this.props.type === "board" || this.props.type === "course") {
            data[this.props.type][event.target.name] = event.target.value;
        }
        this.setState({
            data: data,
            [event.target.name]: event.target.value,
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
                <Modal.Header closeButton>Update master data</Modal.Header>
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
                            <label htmlFor="code">Code</label>
                            <input
                                type="text"
                                name="code"
                                id="code"
                                className="form-control borders"
                                onChange={this.handleInput}
                                placeholder="Enter code"
                                value={this.state.code}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="title">Title</label>
                            <input
                                type="text"
                                name="title"
                                id="title"
                                className="form-control borders"
                                onChange={this.handleInput}
                                placeholder="Enter title"
                                value={this.state.title}
                                required
                            />
                        </div>
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

const DataNotAvailable = () => {
    return (
        <p className="small border-bottom p-2 mb-0">Data not available...</p>
    );
};

const DropDownBtn = (props) => {
    return (
        <Dropdown>
            <Dropdown.Toggle
                variant="Secondary"
                className="btn btn-sm text-muted shadow-none caret-off"
            >
                <i className="fas fa-ellipsis-v"></i>
            </Dropdown.Toggle>

            <Dropdown.Menu>
                <Dropdown.Item
                    onClick={() =>
                        props.handleEdit(props.code, props.title, props.type)
                    }
                >
                    <i className="far fa-edit mr-1"></i> Edit
                </Dropdown.Item>
                <Dropdown.Item
                    onClick={() => props.handleDelete(props.code, props.type)}
                >
                    <i className="far fa-trash-alt mr-1"></i> Delete
                </Dropdown.Item>
            </Dropdown.Menu>
        </Dropdown>
    );
};

const AddButton = (props) => {
    return (
        <div className="p-2">
            <button
                className="btn btn-light btn-sm btn-block border-secondary shadow-none"
                onClick={() => props.handleAdd(props.type)}
            >
                Add +
            </button>
        </div>
    );
};

const Category = (props) => {
    return (
        <div className="card border-secondary">
            <div className="card-header pinkrange-bg text-center font-weight-bold-600 p-2">
                Category
            </div>
            {props.category && props.category.length !== 0 ? (
                props.category.map((list, index) => {
                    return (
                        <div
                            className={`master-data-list border-bottom ${
                                props.selectedCategory === list.code
                                    ? "light-bg"
                                    : ""
                            }`}
                            style={{ cursor: "pointer" }}
                            key={index}
                        >
                            <p
                                className="small"
                                onClick={() => props.handleCategory(list.code)}
                            >
                                {list.code} - {list.title}{" "}
                                <i
                                    className={`fas fa-angle-right ml-2 master-data-arrow ${
                                        props.selectedCategory === list.code
                                            ? "master-data-arrow-active"
                                            : ""
                                    }`}
                                ></i>
                            </p>
                            <DropDownBtn
                                {...props}
                                code={list.code}
                                title={list.title}
                                type="category"
                            />
                        </div>
                    );
                })
            ) : (
                <DataNotAvailable />
            )}
            <AddButton {...props} type="category" />
        </div>
    );
};

const SubCategory = (props) => {
    return (
        <div className="card border-secondary">
            <div className="card-header pinkrange-bg text-center font-weight-bold-600 p-2">
                Sub Category
            </div>
            {props.sub_category && props.sub_category.length !== 0 ? (
                props.sub_category.map((list, index) => {
                    return (
                        <div
                            className={`master-data-list border-bottom ${
                                props.selectedSubcategory === list.code
                                    ? "light-bg"
                                    : ""
                            }`}
                            style={{ cursor: "pointer" }}
                            key={index}
                        >
                            <p
                                className="small"
                                onClick={() =>
                                    props.handleSubcategory(list.code)
                                }
                            >
                                {list.code} - {list.title}{" "}
                                <i
                                    className={`fas fa-angle-right ml-2 master-data-arrow ${
                                        props.selectedSubcategory === list.code
                                            ? "master-data-arrow-active"
                                            : ""
                                    }`}
                                ></i>
                            </p>
                            <DropDownBtn
                                {...props}
                                code={list.code}
                                title={list.title}
                                type="sub_category"
                            />
                        </div>
                    );
                })
            ) : (
                <DataNotAvailable />
            )}
            <AddButton {...props} type="sub_category" />
        </div>
    );
};

const Discipline = (props) => {
    return (
        <div className="card border-secondary">
            <div className="card-header pinkrange-bg text-center font-weight-bold-600 p-2">
                Discipline
            </div>
            {props.discipline && props.discipline.length !== 0 ? (
                Object.entries(props.discipline).map(([code, title], index) => {
                    return (
                        <div
                            className="master-data-list border-bottom"
                            key={index}
                        >
                            <p className="small">
                                {code} - {title}
                            </p>
                            <DropDownBtn
                                {...props}
                                code={code}
                                title={title}
                                type="discipline"
                            />
                        </div>
                    );
                })
            ) : (
                <DataNotAvailable />
            )}
            <AddButton {...props} type="discipline" />
        </div>
    );
};

const Level = (props) => {
    return (
        <div className="card border-secondary">
            <div className="card-header pinkrange-bg text-center font-weight-bold-600 p-2">
                Level
            </div>
            {props.levels && props.levels.length !== 0 ? (
                Object.entries(props.levels).map(([code, title], index) => {
                    return (
                        <div
                            className="master-data-list border-bottom"
                            key={index}
                        >
                            <p className="small">
                                {code} - {title}
                            </p>
                            <DropDownBtn
                                {...props}
                                code={code}
                                title={title}
                                type="level"
                            />
                        </div>
                    );
                })
            ) : (
                <DataNotAvailable />
            )}
            <AddButton {...props} type="level" />
        </div>
    );
};

const Subject = (props) => {
    return (
        <div className="card border-secondary">
            <div className="card-header pinkrange-bg text-center font-weight-bold-600 p-2">
                Subject
            </div>
            {props.subjects && props.subjects.length !== 0 ? (
                Object.entries(props.subjects).map(([code, title], index) => {
                    return (
                        <div
                            className="master-data-list border-bottom"
                            key={index}
                        >
                            <p className="small">
                                {code} - {title}
                            </p>
                            <DropDownBtn
                                {...props}
                                code={code}
                                title={title}
                                type="subject"
                            />
                        </div>
                    );
                })
            ) : (
                <DataNotAvailable />
            )}
            <AddButton {...props} type="subject" />
        </div>
    );
};

const Board = (props) => {
    return (
        <div className="row mt-3">
            <div className="col-md-4 mb-3 mb-md-0">
                <div className="card border-secondary">
                    <div className="card-header pinkrange-bg text-center font-weight-bold-600 p-2">
                        Board / University
                    </div>
                    {props.board && props.board.length !== 0 ? (
                        props.board.map((list, index) => {
                            return (
                                <div
                                    className="master-data-list border-bottom"
                                    key={index}
                                >
                                    <p className="small">
                                        {list.code} - {list.title}
                                    </p>
                                    <DropDownBtn
                                        {...props}
                                        code={list.code}
                                        title={list.title}
                                        type="board"
                                    />
                                </div>
                            );
                        })
                    ) : (
                        <DataNotAvailable />
                    )}
                    <AddButton {...props} type="board" />
                </div>
            </div>
        </div>
    );
};

const Type = (props) => {
    return (
        <div className="row mt-3">
            <div className="col-md-4 mb-3 mb-md-0">
                <div className="card border-secondary">
                    <div className="card-header pinkrange-bg text-center font-weight-bold-600 p-2">
                        Course
                    </div>
                    {props.type && props.type.length !== 0 ? (
                        props.type.map((list, index) => {
                            return (
                                <div
                                    className="master-data-list border-bottom"
                                    key={index}
                                >
                                    <p className="small">
                                        {list.code} - {list.title}
                                    </p>
                                    <DropDownBtn
                                        {...props}
                                        code={list.code}
                                        title={list.title}
                                        type="course"
                                    />
                                </div>
                            );
                        })
                    ) : (
                        <DataNotAvailable />
                    )}
                    <AddButton {...props} type="course" />
                </div>
            </div>
        </div>
    );
};

class AdminMasterData extends Component {
    constructor(props) {
        super(props);
        this.state = {
            showModal: false,
            showEditModal: false,
            showDeleteModal: false,

            selectedCategory: "",
            selectedSubcategory: "",
            contentAddingType: "",
            selectedData: "",

            category: [],
            sub_category: [],
            discipline: [],
            levels: [],
            subjects: [],
            board: [],
            type: [],

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

    loadMasterData = () => {
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
                        type: result.data.TYPE,
                        selectedCategory: "",
                        selectedSubcategory: "",
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
        document.title = "Master Data - Admin | IQLabs";

        this.loadMasterData();
    };

    handleCategory = (event) => {
        this.setState({
            selectedCategory: event,
            sub_category: [],
            selectedSubcategory: "",
            page_loading: true,
        });

        if (event.value !== "") {
            fetch(`${this.url}/data/filter/?category=${event}`, {
                headers: this.headers,
                method: "GET",
            })
                .then((res) => res.json())
                .then((result) => {
                    if (result.sts === true) {
                        this.setState({
                            sub_category: result.data.sub_category,
                            page_loading: false,
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
                        page_loading: false,
                    });
                });
        }
    };

    handleSubcategory = (event) => {
        this.setState({
            selectedSubcategory: event,
            page_loading: true,
        });

        if (event.value !== "") {
            fetch(
                `${this.url}/data/filter/?category=${this.state.selectedCategory}&sub_category=${event}`,
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
        }
    };

    handleAdd = (type) => {
        if (type === "category") {
            this.setState({
                selectedData: {
                    category: {
                        code: "",
                        title: "",
                    },
                    category_update: true,
                },
            });
        }
        if (type === "sub_category") {
            this.setState({
                selectedData: {
                    category: {
                        code: this.state.selectedCategory,
                        sub_category: {
                            code: "",
                            title: "",
                        },
                    },
                    sub_category_update: true,
                },
            });
        }
        if (type === "discipline" || type === "level" || type === "subject") {
            this.setState({
                selectedData: {
                    category: {
                        code: this.state.selectedCategory,
                        sub_category: {
                            code: this.state.selectedSubcategory,
                            [type]: {
                                code: "",
                                title: "",
                            },
                        },
                    },
                    [`${type}_update`]: true,
                },
            });
        }
        if (type === "board" || type === "course") {
            this.setState({
                selectedData: {
                    [type]: {
                        code: "",
                        title: "",
                    },
                    [`${type}_update`]: true,
                },
            });
        }
        this.setState({
            contentAddingType: type,
            showModal: !this.state.showModal,
        });
    };

    handleEdit = (code, title, type) => {
        if (type === "category") {
            this.setState({
                selectedData: {
                    category: {
                        old_code: code,
                        code: code,
                        title: title,
                    },
                    category_update: true,
                },
            });
        }
        if (type === "sub_category") {
            this.setState({
                selectedData: {
                    category: {
                        code: this.state.selectedCategory,
                        sub_category: {
                            old_code: code,
                            code: code,
                            title: title,
                        },
                    },
                    sub_category_update: true,
                },
            });
        }
        if (type === "discipline" || type === "level" || type === "subject") {
            this.setState({
                selectedData: {
                    category: {
                        code: this.state.selectedCategory,
                        sub_category: {
                            code: this.state.selectedSubcategory,
                            [type]: {
                                old_code: code,
                                code: code,
                                title: title,
                            },
                        },
                    },
                    [`${type}_update`]: true,
                },
            });
        }
        if (type === "board" || type === "course") {
            this.setState({
                selectedData: {
                    [type]: {
                        old_code: code,
                        code: code,
                        title: title,
                    },
                    [`${type}_update`]: true,
                },
            });
        }
        this.setState({
            contentAddingType: type,
            showEditModal: !this.state.showEditModal,
        });
    };

    handleDelete = (code, type) => {
        if (type === "category") {
            this.setState({
                selectedData: {
                    category: {
                        code: code,
                    },
                    category_delete: true,
                },
            });
        }
        if (type === "sub_category") {
            this.setState({
                selectedData: {
                    category: {
                        code: this.state.selectedCategory,
                        sub_category: {
                            code: code,
                        },
                    },
                    sub_category_delete: true,
                },
            });
        }
        if (type === "discipline" || type === "level" || type === "subject") {
            this.setState({
                selectedData: {
                    category: {
                        code: this.state.selectedCategory,
                        sub_category: {
                            code: this.state.selectedSubcategory,
                            [type]: {
                                code: code,
                            },
                        },
                    },
                    [`${type}_delete`]: true,
                },
            });
        }
        if (type === "board" || type === "course") {
            this.setState({
                selectedData: {
                    [type]: {
                        code: code,
                    },
                    [`${type}_delete`]: true,
                },
            });
        }
        this.setState({
            contentAddingType: type,
            showDeleteModal: !this.state.showDeleteModal,
        });
    };

    formSubmission = () => {
        setTimeout(() => {
            this.setState({
                showModal: false,
                showEditModal: false,
                showDeleteModal: false,
            });
            if (
                this.state.contentAddingType === "category" ||
                this.state.contentAddingType === "board" ||
                this.state.contentAddingType === "course"
            ) {
                this.loadMasterData();
            }
            if (this.state.contentAddingType === "sub_category") {
                this.handleCategory(this.state.selectedCategory);
            }
            if (
                this.state.contentAddingType === "discipline" ||
                this.state.contentAddingType === "level" ||
                this.state.contentAddingType === "subject"
            ) {
                this.handleSubcategory(this.state.selectedSubcategory);
            }
        }, 1000);
    };

    render() {
        return (
            <Wrapper
                history={this.props.history}
                header="Master Data"
                activeLink="data"
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

                {/* CREATE Modal */}
                {this.state.showModal ? (
                    <ContentAdding
                        show={this.state.showModal}
                        onHide={this.handleAdd}
                        formSubmission={this.formSubmission}
                        type={this.state.contentAddingType}
                        data={this.state.selectedData}
                        url={this.url}
                        headers={this.headers}
                    />
                ) : (
                    ""
                )}

                {/* UPDATE Modal */}
                {this.state.showEditModal ? (
                    <ContentUpdate
                        show={this.state.showEditModal}
                        onHide={this.handleEdit}
                        formSubmission={this.formSubmission}
                        type={this.state.contentAddingType}
                        data={this.state.selectedData}
                        url={this.url}
                        headers={this.headers}
                    />
                ) : (
                    ""
                )}

                {/* DELETE Modal */}
                {this.state.showDeleteModal ? (
                    <SingleContentDeleteModal
                        show={this.state.showDeleteModal}
                        onHide={this.handleDelete}
                        formSubmission={this.formSubmission}
                        url={`${this.url}/data/master/`}
                        name="this master data"
                        data={this.state.selectedData}
                        type="master data"
                    />
                ) : (
                    ""
                )}

                {/* Breadcrumb */}
                <nav aria-label="breadcrumb">
                    <ol className="breadcrumb mb-3">
                        <li className="breadcrumb-item">
                            <Link to="/admin">
                                <i className="fas fa-home fa-sm"></i>
                            </Link>
                        </li>
                        <li className="breadcrumb-item active">Master Data</li>
                    </ol>
                </nav>

                <Tabs
                    defaultActiveKey="categories"
                    id="uncontrolled-tab-example"
                >
                    {/* master filter */}
                    <Tab eventKey="categories" title="Categories">
                        <div className="form-row">
                            <div className="col-md-5">
                                <div className="form-row">
                                    <div className="col-md-6 mb-2 mb-md-0">
                                        <Category
                                            category={this.state.category}
                                            selectedCategory={
                                                this.state.selectedCategory
                                            }
                                            handleCategory={this.handleCategory}
                                            handleAdd={this.handleAdd}
                                            handleEdit={this.handleEdit}
                                            handleDelete={this.handleDelete}
                                        />
                                    </div>
                                    <div className="col-md-6 mb-3 mb-md-0">
                                        {this.state.selectedCategory !== "" ? (
                                            <SubCategory
                                                sub_category={
                                                    this.state.sub_category
                                                }
                                                selectedSubcategory={
                                                    this.state
                                                        .selectedSubcategory
                                                }
                                                handleSubcategory={
                                                    this.handleSubcategory
                                                }
                                                handleAdd={this.handleAdd}
                                                handleEdit={this.handleEdit}
                                                handleDelete={this.handleDelete}
                                            />
                                        ) : (
                                            ""
                                        )}
                                    </div>
                                </div>
                            </div>
                            <div className="col-md-7">
                                {this.state.selectedSubcategory !== "" ? (
                                    <div className="form-row">
                                        <div className="col-md-4 mb-3 mb-md-0">
                                            <Discipline
                                                discipline={
                                                    this.state.discipline
                                                }
                                                handleAdd={this.handleAdd}
                                                handleEdit={this.handleEdit}
                                                handleDelete={this.handleDelete}
                                            />
                                        </div>
                                        <div className="col-md-4 mb-3 mb-md-0">
                                            <Level
                                                levels={this.state.levels}
                                                handleAdd={this.handleAdd}
                                                handleEdit={this.handleEdit}
                                                handleDelete={this.handleDelete}
                                            />
                                        </div>
                                        <div className="col-md-4">
                                            <Subject
                                                subjects={this.state.subjects}
                                                handleAdd={this.handleAdd}
                                                handleEdit={this.handleEdit}
                                                handleDelete={this.handleDelete}
                                            />
                                        </div>
                                    </div>
                                ) : (
                                    ""
                                )}
                            </div>
                        </div>
                    </Tab>

                    {/* Board */}
                    <Tab eventKey="board" title="Board">
                        <Board
                            board={this.state.board}
                            handleAdd={this.handleAdd}
                            handleEdit={this.handleEdit}
                            handleDelete={this.handleDelete}
                        />
                    </Tab>

                    {/* Type */}
                    <Tab eventKey="type" title="Type">
                        <Type
                            type={this.state.type}
                            handleAdd={this.handleAdd}
                            handleEdit={this.handleEdit}
                            handleDelete={this.handleDelete}
                        />
                    </Tab>
                </Tabs>

                {/* Loading component */}
                {this.state.page_loading ? <Loading /> : ""}
            </Wrapper>
        );
    }
}

export default AdminMasterData;
