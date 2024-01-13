import React, { Component } from "react";
import Wrapper from "./wrapper";
import { paginationCount } from "../../shared/constant.js";
import Paginations from "../common/pagination";
import StatisticsTable from "../common/table/statistics";
import { Link } from "react-router-dom";
import { baseUrl, inquelAdminUrl } from "../../shared/baseUrl";
import Loading from "../common/loader";
import AlertBox from "../common/alert";
import Select from "react-select";
import dateFormat from "dateformat";

class AdminStatistics extends Component {
    constructor(props) {
        super(props);
        this.state = {
            subscription_data: [],
            activePage: 1,
            totalCount: 0,
            overview_data: {},

            filter_data: {
                category: [],
                sub_category: [],
                level: [],
                subscription: [],
            },
            selection_criteria: {
                category: "",
                sub_category: "",
                level: "",
                from_date: "",
                to_date: "",
                subscription_id: "",
            },

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

    componentDidMount = () => {
        document.title = "Reports - Admin | IQLabs";

        let selection_criteria = this.state.selection_criteria;
        selection_criteria.from_date = `${
            this.getCurrentFinancialYear().start_year
        }-04-01 00:00:00`;
        selection_criteria.to_date = `${
            this.getCurrentFinancialYear().end_year
        }-03-31 00:00:00`;

        this.setState({
            selection_criteria,
        });

        this.loadCategory();
        this.loadSubscriptionData();
    };

    getCurrentFinancialYear() {
        var today = new Date();
        var start_year = today.getFullYear(),
            end_year = today.getFullYear();

        if (today.getMonth() + 1 <= 3) {
            start_year -= 1;
        } else {
            end_year += 1;
        }
        return { start_year, end_year };
    }

    // ----- Subscription table API -----

    loadSubscriptionData = () => {
        let selection_criteria = this.state.selection_criteria;
        let url = `${this.url}/report/search/?from_date=${selection_criteria.from_date}&to_date=${selection_criteria.to_date}`;

        if (selection_criteria.category !== "") {
            url = `${url}&category=${selection_criteria.category}`;
        }
        if (selection_criteria.sub_category !== "") {
            url = `${url}&sub_category=${selection_criteria.sub_category}`;
        }
        if (selection_criteria.level !== "") {
            url = `${url}&level=${selection_criteria.level}`;
        }
        if (selection_criteria.subscription_id !== "") {
            url = `${url}&subscription_id=${selection_criteria.subscription_id}`;
        }

        if (this.state.activePage > 1) {
            url = `${url}&page=${this.state.activePage}`;
        }

        fetch(url, {
            method: "GET",
            headers: this.headers,
        })
            .then((res) => res.json())
            .then((result) => {
                if (result.sts === true) {
                    this.setState({
                        subscription_data: result.data.results,
                        totalCount: result.data.count,
                        overview_data: result.data.overview_data,
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

    // ----- Filter API's -----

    loadCategory = () => {
        fetch(`${this.url}/report/filter/`, {
            method: "GET",
            headers: this.headers,
        })
            .then((res) => res.json())
            .then((result) => {
                if (result.sts === true) {
                    let filter_data = this.state.filter_data;
                    filter_data.category = result.data.category || [];
                    this.setState({
                        filter_data: filter_data,
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

    loadSubCategory = async (event) => {
        let data = this.state.selection_criteria;
        data.category = event.value;
        data.sub_category = "";
        data.level = "";
        data.subscription_id = "";

        let filter = this.state.filter_data;
        filter.sub_category = [];
        filter.level = [];
        filter.subscription = [];

        await this.setState({
            selection_criteria: data,
            filter_data: filter,
        });

        if (event.value !== "") {
            fetch(`${this.url}/report/filter/?category=${event.value}`, {
                headers: this.headers,
                method: "GET",
            })
                .then((res) => res.json())
                .then((result) => {
                    if (result.sts === true) {
                        let filter = this.state.filter_data;
                        filter.sub_category = result.data.sub_category || [];

                        this.setState({
                            filter_data: filter,
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

    loadLevels = async (event) => {
        let data = this.state.selection_criteria;
        data.sub_category = event.value;
        data.level = "";
        data.subscription_id = "";

        let filter = this.state.filter_data;
        filter.level = [];
        filter.subscription = [];

        await this.setState({
            selection_criteria: data,
            filter_data: filter,
        });

        if (event.value !== "") {
            fetch(
                `${this.url}/report/filter/?category=${data.category}&sub_category=${event.value}`,
                {
                    headers: this.headers,
                    method: "GET",
                }
            )
                .then((res) => res.json())
                .then((result) => {
                    if (result.sts === true) {
                        let filter = this.state.filter_data;
                        filter.level = result.data.level || [];

                        this.setState({
                            filter_data: filter,
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

    loadSubscriptionList = async (event) => {
        let data = this.state.selection_criteria;
        data.level = event.value;
        data.subscription_id = "";

        let filter = this.state.filter_data;
        filter.subscription = [];

        await this.setState({
            selection_criteria: data,
            filter_data: filter,
        });

        if (event.value !== "") {
            fetch(
                `${this.url}/report/filter/?category=${data.category}&sub_category=${data.sub_category}&level=${event.value}&from_date=${data.from_date}&to_date=${data.to_date}`,
                {
                    headers: this.headers,
                    method: "GET",
                }
            )
                .then((res) => res.json())
                .then((result) => {
                    if (result.sts === true) {
                        let filter = this.state.filter_data;
                        filter.subscription = result.data || [];

                        this.setState({
                            filter_data: filter,
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

    handleDate = (event) => {
        let selection_criteria = this.state.selection_criteria;
        selection_criteria[event.target.name] = dateFormat(
            event.target.value,
            "yyyy-mm-dd 00:00:00"
        );

        this.setState({
            selection_criteria,
        });
    };

    resetFilter = () => {
        let selection_criteria = this.state.selection_criteria;
        selection_criteria.category = "";
        selection_criteria.sub_category = "";
        selection_criteria.level = "";
        selection_criteria.from_date = `${
            this.getCurrentFinancialYear().start_year
        }-04-01 00:00:00`;
        selection_criteria.to_date = `${
            this.getCurrentFinancialYear().end_year
        }-03-31 00:00:00`;
        selection_criteria.subscription_id = "";

        this.setState(
            {
                selection_criteria,
                page_loading: true,
            },
            () => {
                this.loadSubscriptionData();
            }
        );
    };

    render() {
        const {
            category,
            sub_category,
            level,
            from_date,
            to_date,
            subscription_id,
        } = this.state.selection_criteria;
        return (
            <Wrapper
                history={this.props.history}
                header="Reports"
                activeLink="dashboard"
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
                        <li className="breadcrumb-item active">Reports</li>
                    </ol>
                </nav>

                {/* filter */}
                <div className="card shadow-sm mb-4">
                    <div className="card-header font-weight-bold-600 bg-transparent">
                        <div className="row align-items-center">
                            <div className="col-md-6 mb-2 mb-md-0">
                                Selection Criteria
                            </div>
                            <div className="col-md-6 text-right">
                                <button
                                    className="btn btn-outline-danger btn-sm shadow-none mr-1 px-3"
                                    onClick={this.resetFilter}
                                >
                                    <i className="fas fa-redo fa-sm mr-1"></i>{" "}
                                    Reset
                                </button>
                                <button
                                    className="btn btn-primary btn-sm shadow-none px-3"
                                    onClick={() => {
                                        this.setState(
                                            {
                                                page_loading: true,
                                                activePage: 1,
                                            },
                                            () => this.loadSubscriptionData()
                                        );
                                    }}
                                >
                                    <i className="fas fa-search mr-1"></i>{" "}
                                    Search
                                </button>
                            </div>
                        </div>
                    </div>
                    <div className="card-body">
                        <div className="row">
                            <div className="form-group col-md-4">
                                <label htmlFor="category">Category</label>
                                <Select
                                    className="basic-single border"
                                    placeholder="Select"
                                    isSearchable={true}
                                    name="category"
                                    id="category"
                                    options={(
                                        this.state.filter_data.category || []
                                    ).map((list) => {
                                        return {
                                            value: list.code,
                                            label: list.title,
                                        };
                                    })}
                                    value={(
                                        this.state.filter_data.category || []
                                    ).map((list) => {
                                        return category === list.code
                                            ? {
                                                  value: list.code,
                                                  label: list.title,
                                              }
                                            : "";
                                    })}
                                    onChange={this.loadSubCategory}
                                    required
                                />
                            </div>
                            <div className="form-group col-md-4">
                                <label htmlFor="sub_category">
                                    Sub Category
                                </label>
                                <Select
                                    className="basic-single border"
                                    placeholder="Select"
                                    isSearchable={true}
                                    name="sub_category"
                                    id="sub_category"
                                    options={(
                                        this.state.filter_data.sub_category ||
                                        []
                                    ).map((list) => {
                                        return {
                                            value: list.code,
                                            label: list.title,
                                        };
                                    })}
                                    value={(
                                        this.state.filter_data.sub_category ||
                                        []
                                    ).map((list) => {
                                        return sub_category === list.code
                                            ? {
                                                  value: list.code,
                                                  label: list.title,
                                              }
                                            : "";
                                    })}
                                    onChange={this.loadLevels}
                                    required
                                />
                            </div>
                            <div className="form-group col-md-4">
                                <label htmlFor="level">Level</label>
                                <Select
                                    className="basic-single border"
                                    placeholder="Select"
                                    isSearchable={true}
                                    name="level"
                                    id="level"
                                    options={(
                                        this.state.filter_data.level || []
                                    ).map((list) => {
                                        return {
                                            value: list.code,
                                            label: list.title,
                                        };
                                    })}
                                    value={(
                                        this.state.filter_data.level || []
                                    ).map((list) => {
                                        return level === list.code
                                            ? {
                                                  value: list.code,
                                                  label: list.title,
                                              }
                                            : "";
                                    })}
                                    onChange={this.loadSubscriptionList}
                                    required
                                />
                            </div>
                        </div>

                        <div className="row">
                            <div className="col-md-4 form-group">
                                <label htmlFor="from_date">From</label>
                                <input
                                    type="date"
                                    name="from_date"
                                    id="from_date"
                                    className="form-control form-control-lg border"
                                    value={dateFormat(from_date, "yyyy-mm-dd")}
                                    onChange={this.handleDate}
                                />
                            </div>
                            <div className="col-md-4 form-group">
                                <label htmlFor="to_date">To</label>
                                <input
                                    type="date"
                                    name="to_date"
                                    id="to_date"
                                    className="form-control form-control-lg border"
                                    value={dateFormat(to_date, "yyyy-mm-dd")}
                                    onChange={this.handleDate}
                                />
                            </div>
                        </div>

                        <div className="row align-items-end justify-content-between">
                            <div className="col-md-4">
                                <label htmlFor="subscription">
                                    Subscriptions
                                </label>
                                <Select
                                    className="basic-single border"
                                    placeholder="Select"
                                    isSearchable={true}
                                    name="subscription"
                                    id="subscription"
                                    options={(
                                        this.state.filter_data.subscription ||
                                        []
                                    ).map((list) => {
                                        return {
                                            value: list.subscription_id,
                                            label: list.title,
                                        };
                                    })}
                                    value={(
                                        this.state.filter_data.subscription ||
                                        []
                                    ).map((list) => {
                                        return subscription_id ===
                                            list.subscription_id
                                            ? {
                                                  value: list.subscription_id,
                                                  label: list.title,
                                              }
                                            : "";
                                    })}
                                    onChange={(event) => {
                                        let selection_criteria =
                                            this.state.selection_criteria;
                                        selection_criteria.subscription_id =
                                            event.value;
                                        this.setState({
                                            selection_criteria:
                                                selection_criteria,
                                        });
                                    }}
                                    required
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Quick stats */}
                <div className="row mb-4">
                    <div className="col-md-4 col-sm-6 mb-3 mb-md-0">
                        <div className="card shadow-sm p-2 h-100">
                            <div className="card-body">
                                <p className="small font-weight-bold-600 mb-2">
                                    Total Active Subscriptions
                                </p>
                                <h3 className="font-weight-bold primary-text">
                                    {
                                        this.state.overview_data
                                            .total_active_subscriptions
                                    }
                                </h3>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-4 col-sm-6 mb-3 mb-md-0">
                        <div className="card shadow-sm p-2 h-100">
                            <div className="card-body">
                                <p className="small font-weight-bold-600 mb-2">
                                    Total Registrations
                                </p>
                                <h3 className="font-weight-bold primary-text">
                                    {
                                        this.state.overview_data
                                            .total_bought_subscriptions
                                    }
                                </h3>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-4 col-sm-6">
                        <div className="card shadow-sm p-2 h-100">
                            <div className="card-body">
                                <p className="small font-weight-bold-600 mb-2">
                                    Total Annual Revenue
                                </p>
                                <h3 className="font-weight-bold primary-text">
                                    {this.state.overview_data.total_revenue}
                                </h3>
                            </div>
                        </div>
                    </div>
                </div>

                {/* statistic table */}
                <div className="card shadow-sm">
                    <StatisticsTable data={this.state.subscription_data} />
                    <div className="card-body p-3">
                        {this.state.totalCount > paginationCount ? (
                            <Paginations
                                activePage={this.state.activePage}
                                totalItemsCount={this.state.totalCount}
                                onChange={async (pageNumber) => {
                                    await this.setState({
                                        activePage: pageNumber,
                                        page_loading: true,
                                    });
                                    this.loadSubscriptionData();
                                }}
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

export default AdminStatistics;
