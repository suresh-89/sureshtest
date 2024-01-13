import React, { Component } from "react";
import Wrapper from "./wrapper";
import { Link } from "react-router-dom";
import dateFormat from "dateformat";
import { Modal, Alert, Spinner } from "react-bootstrap";
import Select from "react-select";
import { baseUrl, inquelAdminUrl } from "../../shared/baseUrl";
import Loading from "../common/loader";
import AlertBox from "../common/alert";
import { paginationCount } from "../../shared/constant";
import Paginations from "../common/pagination";
import DiscountTable from "../common/table/discounts";

class DiscountModal extends Component {
    constructor() {
        super();
        this.state = {
            category: [],
            sub_category: [],
            discipline: [],
            levels: [],
            subjects: [],
            data: {
                coupon_id: "",
                coupon_name: "",
                title: "",
                valid_from: "",
                valid_to: "",
                category: "",
                sub_category: "",
                discipline: "",
                level: "",
                subject: "",

                min_points: "",
                max_points: "",
                deduction_points: "",
                points_in_decimal: "",

                fixed_price: "",
                percentage: "",

                currency: "INR",
                points_exists: false,
                percent_exists: false,
                price_exists: false,
            },

            subcategory_loading: false,
            content_loading: false,

            errorMsg: "",
            successMsg: "",
            showErrorAlert: false,
            showSuccessAlert: false,
            showLoader: false,
        };
        this.url = baseUrl + inquelAdminUrl;
        this.authToken = localStorage.getItem("Inquel-Auth");
        this.headers = {
            Accept: "application/json",
            "Content-Type": "application/json",
            "Inquel-Auth": this.authToken,
        };
    }

    componentDidMount = () => {
        // check if the props contain data or add empty object in the state
        if (this.props.data && Object.keys(this.props.data).length !== 0) {
            let tempObj = {
                coupon_id: this.props.data.coupon_id,
                coupon_name: this.props.data.coupon_name,
                title: this.props.data.title,
                valid_from: `${dateFormat(
                    this.props.data.valid_from,
                    "yyyy-mm-dd"
                )} 00:00:00`,
                valid_to: `${dateFormat(
                    this.props.data.valid_to,
                    "yyyy-mm-dd"
                )} 00:00:00`,
                category: this.props.data.category,
                sub_category: this.props.data.sub_category,
                discipline: this.props.data.discipline,
                level: this.props.data.level,
                subject: this.props.data.subject,

                min_points: this.props.data.min_points || "",
                max_points: this.props.data.max_points || "",
                deduction_points: this.props.data.deduction_points || "",
                points_in_decimal: this.props.data.points_in_decimal || "",

                fixed_price: this.props.data.fixed_price || "",
                percentage: this.props.data.percentage || "",

                currency: this.props.data.currency || "",
                points_exists: this.props.data.points_exists || false,
                percent_exists: this.props.data.percent_exists || false,
                price_exists: this.props.data.price_exists || false,
            };

            this.setState(
                {
                    data: tempObj,
                },
                () => {
                    let category = {
                        value: this.props.data.category,
                    };
                    let sub_category = {
                        value: this.props.data.sub_category,
                    };
                    this.handleCategory(category);
                    this.handleSubcategory(sub_category);
                }
            );
        }

        // loads category list
        fetch(`${this.url}/coupon/filter/`, {
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

    // loads sub category list
    handleCategory = (event) => {
        let data = this.state.data;
        data.category = event.value;
        this.setState({
            data: data,
            sub_category: [],
            discipline: [],
            levels: [],
            subjects: [],
            subcategory_loading: true,
        });

        if (event.value !== "") {
            fetch(`${this.url}/coupon/filter/?category=${event.value}`, {
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
                    });
                });
        }
    };

    // loads discipline, levels & subjects data
    handleSubcategory = (event) => {
        let data = this.state.data;
        data.sub_category = event.value;
        this.setState({
            data: data,
            discipline: [],
            levels: [],
            subjects: [],
            content_loading: true,
        });

        if (event.value !== "") {
            fetch(
                `${this.url}/coupon/filter/?category=${data.category}&sub_category=${event.value}`,
                {
                    headers: this.headers,
                    method: "GET",
                }
            )
                .then((res) => res.json())
                .then((result) => {
                    if (result.sts === true) {
                        this.setState({
                            discipline: Object.assign(
                                {
                                    ALL: "All",
                                },
                                result.data.DISCIPLINE
                            ),
                            levels: Object.assign(
                                {
                                    ALL: "All",
                                },
                                result.data.LEVELS
                            ),
                            subjects: Object.assign(
                                {
                                    ALL: "All",
                                },
                                result.data.SUBJECTS
                            ),
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
        let data = this.state.data;
        data.discipline = event.value;
        this.setState({
            data: data,
        });
    };

    handleLevel = (event) => {
        let data = this.state.data;
        data.level = event.value;
        this.setState({
            data: data,
        });
    };

    handleSubject = (event) => {
        let data = this.state.data;
        data.subject = event.value;
        this.setState({
            data: data,
        });
    };

    handleInput = (event) => {
        let data = this.state.data;
        if (
            event.target.name === "min_points" ||
            event.target.name === "max_points" ||
            event.target.name === "deduction_points" ||
            event.target.name === "percentage" ||
            event.target.name === "fixed_price"
        ) {
            data[event.target.name] = Number(event.target.value) || "";
        } else if (event.target.name === "points_in_decimal") {
            data[event.target.name] = parseFloat(event.target.value) || 0;
        } else {
            data[event.target.name] = event.target.value;
        }

        if (
            (data.min_points !== "" && data.min_points !== 0) ||
            (data.max_points !== "" && data.max_points !== 0) ||
            (data.deduction_points !== "" && data.deduction_points !== 0) ||
            (data.points_in_decimal !== "" && data.points_in_decimal !== 0)
        ) {
            data.points_exists = true;
        } else if (data.percentage !== "" && data.percentage !== 0) {
            data.percent_exists = true;
        } else if (data.fixed_price !== "" && data.fixed_price !== 0) {
            data.price_exists = true;
        } else {
            data.points_exists = false;
            data.percent_exists = false;
            data.price_exists = false;
        }

        this.setState({
            data: data,
        });
    };

    handleDate = (event) => {
        let data = this.state.data;
        data[event.target.name] = `${dateFormat(
            event.target.value,
            "yyyy-mm-dd"
        )} 00:00:00`;

        this.setState({
            data: data,
        });
    };

    handleSubmit = () => {
        this.setState({
            showErrorAlert: false,
            showSuccessAlert: false,
            showLoader: true,
        });
        let data = this.state.data;

        fetch(
            `${
                data.coupon_id === ""
                    ? `${this.url}/coupon/`
                    : `${this.url}/coupon/${data.coupon_id}/`
            }`,
            {
                method: `${data.coupon_id === "" ? "POST" : "PUT"}`,
                headers: this.headers,
                body: JSON.stringify(data),
            }
        )
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
            >
                <Modal.Header closeButton>Discount Configuration</Modal.Header>
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

                    {/* Coupon ID & Title */}
                    <div className="form-row">
                        <div className="col-md-4 form-group">
                            <label htmlFor="coupon_name">Coupon ID</label>
                            <input
                                type="text"
                                name="coupon_name"
                                id="coupon_name"
                                value={this.state.data.coupon_name}
                                className="form-control borders"
                                onChange={this.handleInput}
                                placeholder="Enter coupon code"
                                autoComplete="off"
                                required
                            />
                        </div>
                        <div className="col-md-8 form-group">
                            <label htmlFor="title">Coupon Title</label>
                            <input
                                type="text"
                                name="title"
                                id="title"
                                value={this.state.data.title}
                                className="form-control borders"
                                onChange={this.handleInput}
                                placeholder="Enter coupon title"
                                autoComplete="off"
                                required
                            />
                        </div>
                    </div>

                    <div className="row">
                        <div className="col-md-4">
                            {/* Category & Sub category */}
                            <div className="mb-2">
                                <label htmlFor="category">Category</label>
                                <Select
                                    className="basic-single borders"
                                    placeholder="Select category"
                                    isSearchable={true}
                                    name="category"
                                    id="category"
                                    options={(this.state.category || []).map(
                                        (list) => {
                                            return {
                                                value: list.code,
                                                label: list.title,
                                            };
                                        }
                                    )}
                                    value={(this.state.category || []).map(
                                        (list) => {
                                            return this.state.data.category ===
                                                list.code
                                                ? {
                                                      value: list.code,
                                                      label: list.title,
                                                  }
                                                : "";
                                        }
                                    )}
                                    onChange={this.handleCategory}
                                    required
                                />
                            </div>
                            <div className="mb-2">
                                <label htmlFor="sub_category">
                                    Sub category
                                </label>
                                <Select
                                    className="basic-single borders"
                                    placeholder="Select subcategory"
                                    isSearchable={true}
                                    name="sub_category"
                                    id="sub_category"
                                    isLoading={
                                        this.state.subcategory_loading
                                            ? true
                                            : false
                                    }
                                    options={this.state.sub_category.map(
                                        (list) => {
                                            return {
                                                value: list.code,
                                                label: list.title,
                                            };
                                        }
                                    )}
                                    value={(this.state.sub_category || []).map(
                                        (list) => {
                                            return this.state.data
                                                .sub_category === list.code
                                                ? {
                                                      value: list.code,
                                                      label: list.title,
                                                  }
                                                : "";
                                        }
                                    )}
                                    isDisabled={
                                        this.state.data.category === ""
                                            ? true
                                            : false
                                    }
                                    onChange={this.handleSubcategory}
                                    required
                                />
                            </div>

                            {/* Discipline, Level & Subject */}
                            <div className="mb-2">
                                <label htmlFor="discipline">Discipline</label>
                                <Select
                                    className="basic-single borders"
                                    placeholder="Select discipline"
                                    isSearchable={true}
                                    name="discipline"
                                    id="discipline"
                                    isLoading={
                                        this.state.content_loading
                                            ? true
                                            : false
                                    }
                                    options={(
                                        Object.entries(this.state.discipline) ||
                                        []
                                    ).map(([key, value]) => {
                                        return {
                                            value: key,
                                            label: value,
                                        };
                                    })}
                                    value={(
                                        Object.entries(this.state.discipline) ||
                                        []
                                    ).map(([key, value]) => {
                                        return this.state.data.discipline ===
                                            key
                                            ? {
                                                  value: key,
                                                  label: value,
                                              }
                                            : "";
                                    })}
                                    isDisabled={
                                        this.state.data.sub_category === ""
                                            ? true
                                            : false
                                    }
                                    onChange={this.handleDiscipline}
                                    required
                                />
                            </div>
                            <div className="mb-2">
                                <label htmlFor="level">Level</label>
                                <Select
                                    className="basic-single borders"
                                    placeholder="Select level"
                                    isSearchable={true}
                                    name="level"
                                    id="level"
                                    isLoading={
                                        this.state.content_loading
                                            ? true
                                            : false
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
                                        return this.state.data.level === key
                                            ? {
                                                  value: key,
                                                  label: value,
                                              }
                                            : "";
                                    })}
                                    isDisabled={
                                        this.state.data.sub_category === ""
                                            ? true
                                            : false
                                    }
                                    onChange={this.handleLevel}
                                    required
                                />
                            </div>
                            <div className="mb-2">
                                <label htmlFor="subject">Subject</label>
                                <Select
                                    className="basic-single borders"
                                    placeholder="Select subject"
                                    isSearchable={true}
                                    name="subject"
                                    id="subject"
                                    isLoading={
                                        this.state.content_loading
                                            ? true
                                            : false
                                    }
                                    options={(
                                        Object.entries(this.state.subjects) ||
                                        []
                                    ).map(([key, value]) => {
                                        return {
                                            value: key,
                                            label: value,
                                        };
                                    })}
                                    value={(
                                        Object.entries(this.state.subjects) ||
                                        []
                                    ).map(([key, value]) => {
                                        return this.state.data.subject === key
                                            ? {
                                                  value: key,
                                                  label: value,
                                              }
                                            : "";
                                    })}
                                    isDisabled={
                                        this.state.data.sub_category === ""
                                            ? true
                                            : false
                                    }
                                    onChange={this.handleSubject}
                                    required
                                />
                            </div>
                        </div>
                        <div className="col-md-8">
                            {/* Valid from & Valid to */}
                            <div className="form-row">
                                <div className="col-md-6 form-group">
                                    <label htmlFor="valid_from">
                                        Valid from
                                    </label>
                                    <input
                                        type="date"
                                        name="valid_from"
                                        id="valid_from"
                                        value={dateFormat(
                                            this.state.data.valid_from,
                                            "yyyy-mm-dd"
                                        )}
                                        className="form-control borders"
                                        onChange={this.handleDate}
                                        required
                                    />
                                </div>
                                <div className="col-md-6 form-group">
                                    <label htmlFor="valid_to">Valid to</label>
                                    <input
                                        type="date"
                                        name="valid_to"
                                        id="valid_to"
                                        value={dateFormat(
                                            this.state.data.valid_to,
                                            "yyyy-mm-dd"
                                        )}
                                        className="form-control borders"
                                        onChange={this.handleDate}
                                        required
                                    />
                                </div>
                            </div>

                            {/* Min points, Max points & Points Decimal */}
                            <div className="form-row">
                                <div className="col-md-6 form-group">
                                    <label htmlFor="min_points">
                                        Minimum Points
                                    </label>
                                    <input
                                        type="number"
                                        name="min_points"
                                        id="min_points"
                                        value={this.state.data.min_points}
                                        className="form-control borders"
                                        onChange={this.handleInput}
                                        placeholder="Enter min points"
                                        autoComplete="off"
                                        disabled={
                                            this.state.data.percent_exists ||
                                            this.state.data.price_exists
                                                ? true
                                                : false
                                        }
                                        required
                                    />
                                </div>
                                <div className="col-md-6 form-group">
                                    <label htmlFor="max_points">
                                        Maximum Points
                                    </label>
                                    <input
                                        type="number"
                                        name="max_points"
                                        id="max_points"
                                        value={this.state.data.max_points}
                                        className="form-control borders"
                                        onChange={this.handleInput}
                                        placeholder="Enter max points"
                                        autoComplete="off"
                                        disabled={
                                            this.state.data.percent_exists ||
                                            this.state.data.price_exists
                                                ? true
                                                : false
                                        }
                                        required
                                    />
                                </div>
                            </div>
                            <div className="form-row">
                                <div className="col-md-6 form-group">
                                    <label htmlFor="deduction_points">
                                        Deduction points
                                    </label>
                                    <input
                                        type="number"
                                        name="deduction_points"
                                        id="deduction_points"
                                        value={this.state.data.deduction_points}
                                        className="form-control borders"
                                        onChange={this.handleInput}
                                        placeholder="Enter deduction points"
                                        autoComplete="off"
                                        disabled={
                                            this.state.data.percent_exists ||
                                            this.state.data.price_exists
                                                ? true
                                                : false
                                        }
                                        required
                                    />
                                </div>
                                <div className="col-md-6 form-group">
                                    <label htmlFor="points_in_decimal">
                                        Points in Decimal
                                    </label>
                                    <input
                                        type="number"
                                        name="points_in_decimal"
                                        id="points_in_decimal"
                                        value={
                                            this.state.data.points_in_decimal
                                        }
                                        className="form-control borders"
                                        onChange={this.handleInput}
                                        placeholder="Enter points in decimal"
                                        autoComplete="off"
                                        disabled={
                                            this.state.data.percent_exists ||
                                            this.state.data.price_exists
                                                ? true
                                                : false
                                        }
                                        step="0.1"
                                        required
                                    />
                                </div>
                            </div>

                            {/* Percentage, Fixed price & Currency */}
                            <div className="form-row">
                                <div className="col-md-6 form-group">
                                    <label htmlFor="percentage">
                                        Percentage
                                    </label>
                                    <input
                                        type="text"
                                        name="percentage"
                                        id="percentage"
                                        value={this.state.data.percentage}
                                        className="form-control borders"
                                        onChange={this.handleInput}
                                        placeholder="Enter percentage"
                                        autoComplete="off"
                                        disabled={
                                            this.state.data.points_exists
                                                ? true
                                                : false
                                        }
                                        required
                                    />
                                </div>
                                <div className="col-md-6 form-group">
                                    <label htmlFor="fixed_price">
                                        Fixed Price
                                    </label>
                                    <input
                                        type="text"
                                        name="fixed_price"
                                        id="fixed_price"
                                        value={this.state.data.fixed_price}
                                        className="form-control borders"
                                        onChange={this.handleInput}
                                        placeholder="Enter fixed price"
                                        autoComplete="off"
                                        disabled={
                                            this.state.data.points_exists
                                                ? true
                                                : false
                                        }
                                        required
                                    />
                                </div>
                            </div>
                            <div className="form-group">
                                <label htmlFor="currency">Currency</label>
                                <input
                                    type="text"
                                    name="currency"
                                    id="currency"
                                    value={this.state.data.currency}
                                    className="form-control borders"
                                    onChange={this.handleInput}
                                    placeholder="Enter currency"
                                    autoComplete="off"
                                    disabled
                                    required
                                />
                            </div>
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
                        {this.state.data.coupon_id === "" ? "Save" : "Update"}
                    </button>
                </Modal.Footer>
            </Modal>
        );
    }
}

class AdminDiscountConfiguration extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: [],
            selectedData: {},
            activeIndex: "",

            activePage: 1,
            totalCount: 0,

            showModal: false,
            errorMsg: "",
            successMsg: "",
            showErrorAlert: false,
            showSuccessAlert: false,
            page_loading: true,
        };
        this.url = baseUrl + inquelAdminUrl;
        this.authToken = localStorage.getItem("Inquel-Auth");
        this.headers = {
            Accept: "application/json",
            "Content-Type": "application/json",
            "Inquel-Auth": this.authToken,
        };
    }

    loadDiscountData = () => {
        let URL =
            this.state.activePage === 1
                ? `${this.url}/coupon/`
                : `${this.url}/coupon/?page=${this.state.activePage}`;

        fetch(URL, {
            method: "GET",
            headers: this.headers,
        })
            .then((res) => res.json())
            .then((response) => {
                if (response.sts === true) {
                    this.setState({
                        data: response.data.results,
                        totalCount: response.data.count,
                        page_loading: false,
                    });
                } else {
                    this.setState({
                        errorMsg: response.msg,
                        showErrorAlert: true,
                        page_loading: false,
                    });
                }
            })
            .catch((err) => {
                console.log(err);
                this.setState({
                    errorMsg: "Cannot load discount coupons at the moment!",
                    showErrorAlert: true,
                    page_loading: false,
                });
            });
    };

    componentDidMount = () => {
        document.title = "Discount Configuration - Admin | IQLabs";

        this.loadDiscountData();
    };

    formSubmission = () => {
        setTimeout(() => {
            this.setState({
                showModal: false,
            });
        }, 1000);
        this.loadDiscountData();
    };

    handlePageChange(pageNumber) {
        this.setState({ activePage: pageNumber, page_loading: true }, () => {
            this.loadDiscountData();
        });
    }

    handleEdit = (data) => {
        this.setState({
            showModal: !this.state.showModal,
            selectedData: data,
        });
    };

    handleDelete = (coupon_id) => {
        this.setState({
            page_loading: true,
        });

        fetch(`${this.url}/coupon/${coupon_id}/`, {
            method: "DELETE",
            headers: this.headers,
        })
            .then((res) => res.json())
            .then((result) => {
                if (result.sts === true) {
                    this.setState({
                        successMsg: result.msg,
                        showSuccessAlert: true,
                    });
                    this.loadDiscountData();
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

    render() {
        return (
            <Wrapper
                history={this.props.history}
                header="Discount Configuration"
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

                {/* ----- Discount Modal ----- */}
                {this.state.showModal ? (
                    <DiscountModal
                        show={this.state.showModal}
                        onHide={() =>
                            this.setState({
                                showModal: false,
                            })
                        }
                        data={this.state.selectedData}
                        formSubmission={this.formSubmission}
                    />
                ) : (
                    ""
                )}

                <div className="row align-items-center mb-3">
                    <div className="col-8">
                        {/* Breadcrumb */}
                        <nav aria-label="breadcrumb">
                            <ol className="breadcrumb">
                                <li className="breadcrumb-item">
                                    <Link to="/admin">
                                        <i className="fas fa-home fa-sm"></i>
                                    </Link>
                                </li>
                                <li className="breadcrumb-item active">
                                    Discount Configuration
                                </li>
                            </ol>
                        </nav>
                    </div>
                    <div className="col-4 text-right">
                        <button
                            className="btn btn-primary btn-sm shadow-none"
                            onClick={() =>
                                this.setState({
                                    showModal: true,
                                    selectedData: {},
                                })
                            }
                        >
                            Create Discount
                        </button>
                    </div>
                </div>

                {/* ----- Discount table ----- */}
                <div className="card shadow-sm">
                    <DiscountTable
                        data={this.state.data}
                        handleEdit={this.handleEdit}
                        handleDelete={this.handleDelete}
                    />
                    <div className="card-body p-3">
                        {this.state.totalCount > paginationCount ? (
                            <Paginations
                                activePage={this.state.activePage}
                                totalItemsCount={this.state.totalCount}
                                onChange={this.handlePageChange.bind(this)}
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

export default AdminDiscountConfiguration;
