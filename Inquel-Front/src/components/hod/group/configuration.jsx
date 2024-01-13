import React, { Component } from "react";
import Wrapper from "../wrapper";
import { Modal, Alert, Spinner } from "react-bootstrap";
import { Link } from "react-router-dom";
import { baseUrl, hodUrl } from "../../../shared/baseUrl.js";
import { paginationCount } from "../../../shared/constant.js";
import Loading from "../../common/loader";
import GroupTable from "../../common/table/group";
import Paginations from "../../common/pagination";
import dateFormat from "dateformat";
import AlertBox from "../../common/alert";

class GroupModal extends Component {
    constructor() {
        super();
        this.state = {
            groupName: "",
            groupDesc: "",
            level_code: "",
            level_name: "",
            valid_from: "",
            valid_to: "",

            levelItems: [],

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
        fetch(
            `${this.url}/hod/group/levels/?category=${this.props.category}&sub_category=${this.props.sub_category}`,
            {
                headers: this.headers,
                method: "GET",
            }
        )
            .then((res) => res.json())
            .then((result) => {
                if (result.sts === true) {
                    this.setState({
                        levelItems: result.data.LEVELS,
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

    handleGroupData = (event) => {
        const name = event.target.name;
        const value = event.target.value;
        this.setState({
            [name]: value,
        });
    };

    handleDate = (event) => {
        const name = event.target.name;
        const value = event.target.value;
        this.setState({
            [name]: `${dateFormat(value, "yyyy-mm-dd")} 00:00:00`,
        });
    };

    handleLevels = (event) => {
        let temp = Object.entries(this.state.levelItems);
        let code = "";
        let name = "";
        for (let i = 0; i < Object.keys(this.state.levelItems).length; i++) {
            if (temp[i][0] === event.target.value) {
                code = temp[i][0];
                name = temp[i][1];
            } else {
                continue;
            }
        }
        this.setState({
            level_code: code,
            level_name: name,
        });
    };

    handleSubmit = (event) => {
        event.preventDefault();
        var url = baseUrl + hodUrl;
        var authToken = localStorage.getItem("Authorization");
        var headers = {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: authToken,
        };

        this.setState({
            showLoader: true,
            showErrorAlert: false,
            showSuccessAlert: false,
        });

        fetch(`${url}/hod/group/`, {
            headers: headers,
            method: "POST",
            body: JSON.stringify({
                group_name: this.state.groupName,
                group_description: this.state.groupDesc,
                level_code: this.state.level_code,
                level_name: this.state.level_name,
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
                    setTimeout(() => {
                        this.setState({
                            showSuccessAlert: false,
                        });
                    }, 3000);
                    this.props.formSubmission();
                } else {
                    this.setState({
                        errorMsg: result.msg,
                        showErrorAlert: true,
                        showLoader: false,
                    });
                    setTimeout(() => {
                        this.setState({
                            showErrorAlert: false,
                        });
                    }, 4000);
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
                scrollable
            >
                <Modal.Header closeButton>Create Group</Modal.Header>
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
                        <label htmlFor="groupName">Group name</label>
                        <input
                            type="text"
                            name="groupName"
                            id="groupName"
                            className="form-control borders"
                            onChange={this.handleGroupData}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="groupDesc">Description</label>
                        <textarea
                            name="groupDesc"
                            id="groupDesc"
                            rows="4"
                            className="form-control borders"
                            onChange={this.handleGroupData}
                            required
                        ></textarea>
                    </div>
                    <div className="row">
                        <div className="form-group col-md-4">
                            <label htmlFor="category">Category</label>
                            <input
                                type="text"
                                name="category"
                                id="category"
                                value={this.props.category}
                                className="form-control borders"
                                disabled
                            />
                        </div>
                        <div className="form-group col-md-4">
                            <label htmlFor="sub_category">Sub Category</label>
                            <input
                                type="text"
                                name="sub_category"
                                id="sub_category"
                                value={this.props.sub_category}
                                className="form-control borders"
                                disabled
                            />
                        </div>
                        <div className="form-group col-md-4">
                            <label htmlFor="discipline">Discipline</label>
                            <input
                                type="text"
                                name="discipline"
                                id="discipline"
                                value={this.props.discipline}
                                className="form-control borders"
                                disabled
                            />
                        </div>
                    </div>
                    <div className="form-group">
                        <label htmlFor="levels">Level</label>
                        <select
                            name="levels"
                            id="levels"
                            onChange={this.handleLevels}
                            className="form-control borders"
                            required
                        >
                            <option value="">Select levels</option>
                            {Object.keys(this.state.levelItems).length !== 0
                                ? Object.entries(this.state.levelItems).map(
                                      ([key, value], index) => {
                                          return (
                                              <option value={key} key={index}>
                                                  {value}
                                              </option>
                                          );
                                      }
                                  )
                                : null}
                        </select>
                    </div>
                    <div className="row">
                        <div className="col-md-6 form-group">
                            <label htmlFor="valid_from">Valid from</label>
                            <input
                                type="date"
                                name="valid_from"
                                id="valid_from"
                                className="form-control borders"
                                min={this.props.valid_from}
                                max={this.props.valid_to}
                                onChange={this.handleDate}
                            />
                        </div>
                        <div className="col-md-6 form-group">
                            <label htmlFor="valid_to">Valid to</label>
                            <input
                                type="date"
                                name="valid_to"
                                id="valid_to"
                                className="form-control borders"
                                min={this.props.valid_from}
                                max={this.props.valid_to}
                                onChange={this.handleDate}
                            />
                        </div>
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
                        Create Group
                    </button>
                </Modal.Footer>
            </Modal>
        );
    }
}

class HODGroupConfiguration extends Component {
    constructor(props) {
        super(props);
        this.state = {
            showModal: false,
            groupItem: [],
            activeGroupPage: 1,
            totalGroupCount: 0,
            category: "",
            sub_category: "",
            discipline: "",
            valid_from: "",
            valid_to: "",

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
        document.title = "Group Configurations - HOD | IQLabs";

        this.loadGroupData();
    };

    loadGroupData = () => {
        fetch(
            this.state.activeGroupPage > 1
                ? `${this.url}/hod/group/?page=${this.state.activeGroupPage}`
                : `${this.url}/hod/group/`,
            {
                headers: this.headers,
                method: "GET",
            }
        )
            .then((res) => res.json())
            .then((result) => {
                if (result.sts === true) {
                    this.setState({
                        groupItem: result.data.results,
                        totalGroupCount: result.data.count,
                        category: result.data.category,
                        sub_category: result.data.sub_category,
                        discipline: result.data.discipline,
                        valid_from: dateFormat(
                            result.data.hod_valid_from,
                            "yyyy-mm-dd"
                        ),
                        valid_to: dateFormat(
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
                    errorMsg: "Something went wrong!",
                    showErrorAlert: true,
                    page_loading: false,
                });
            });
    };

    toggleModal = () => {
        this.setState({
            showModal: !this.state.showModal,
        });
    };

    formSubmission = () => {
        setTimeout(() => {
            this.setState({
                showModal: false,
            });
        }, 1000);
        this.loadGroupData();
    };

    handleGroupPageChange(pageNumber) {
        this.setState(
            { activeGroupPage: pageNumber, page_loading: true },
            () => {
                this.loadGroupData();
            }
        );
    }

    render() {
        return (
            <Wrapper
                header="Groups"
                activeLink="dashboard"
                history={this.props.history}
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

                {/* Add Group modal */}
                {this.state.showModal ? (
                    <GroupModal
                        show={this.state.showModal}
                        onHide={this.toggleModal}
                        formSubmission={this.formSubmission}
                        category={this.state.category}
                        sub_category={this.state.sub_category}
                        discipline={this.state.discipline}
                        valid_from={this.state.valid_from}
                        valid_to={this.state.valid_to}
                    />
                ) : (
                    ""
                )}

                <div className="row align-items-center mb-3">
                    <div className="col-6">
                        {/* Breadcrumb */}
                        <nav aria-label="breadcrumb">
                            <ol className="breadcrumb">
                                <li className="breadcrumb-item">
                                    <Link to="/hod">
                                        <i className="fas fa-home fa-sm"></i>
                                    </Link>
                                </li>
                                <li className="breadcrumb-item active">
                                    Group Configuration
                                </li>
                            </ol>
                        </nav>
                    </div>
                    <div className="col-6 text-right">
                        <button
                            className="btn btn-primary btn-sm shadow-none"
                            onClick={this.toggleModal}
                        >
                            Add new
                        </button>
                    </div>
                </div>

                <div className="card shadow-sm">
                    <GroupTable
                        groupItems={this.state.groupItem}
                        path={`hod/group/${this.groupId}`}
                        valid_from={true}
                        valid_to={true}
                        teacher={true}
                        student={true}
                        details={true}
                    />
                    <div className="card-body p-3">
                        {this.state.totalGroupCount > paginationCount ? (
                            <Paginations
                                activePage={this.state.activeGroupPage}
                                totalItemsCount={this.state.totalGroupCount}
                                onChange={this.handleGroupPageChange.bind(this)}
                            />
                        ) : null}
                    </div>
                </div>

                {/* Loading component */}
                {this.state.page_loading ? <Loading /> : ""}
            </Wrapper>
        );
    }
}

export default HODGroupConfiguration;
