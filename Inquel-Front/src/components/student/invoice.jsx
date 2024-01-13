import React, { Component } from "react";
import Wrapper from "./wrapper";
import { paginationCount } from "../../shared/constant.js";
import Paginations from "../common/pagination";
import { Link } from "react-router-dom";
import { baseUrl, studentUrl } from "../../shared/baseUrl";
import Loading from "../common/loader";
import AlertBox from "../common/alert";
import InvoiceTable from "../common/table/invoice";
import { renderToStaticMarkup } from "react-dom/server";
import dateFormat from "dateformat";

class StudentInvoice extends Component {
    constructor(props) {
        super(props);
        this.state = {
            purchase_data: [],
            subscription_data: [],
            activePage: 1,
            totalCount: 0,

            errorMsg: "",
            successMsg: "",
            showErrorAlert: false,
            showSuccessAlert: false,
            page_loading: true,
        };
        this.url = baseUrl + studentUrl;
        this.authToken = localStorage.getItem("Authorization");
        this.headers = {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: this.authToken,
        };
    }

    componentDidMount = () => {
        document.title = "Invoice - Student | IQLabs";

        this.fetchInvoices();
    };

    fetchInvoices = () => {
        fetch(
            this.state.activePage > 1
                ? `${this.url}/student/invoice/?page=${this.state.activePage}`
                : `${this.url}/student/invoice/`,
            {
                method: "GET",
                headers: this.headers,
            }
        )
            .then((res) => res.json())
            .then((result) => {
                if (result.sts === true) {
                    let purchase_data = [],
                        subscription_data = [];

                    // seperating purchase data and subscription data with receipt_id as a reference
                    if (result.data.results) {
                        result.data.results.forEach((list) => {
                            purchase_data.push({
                                order_id: list.order_id,
                                amount: list.amount,
                                currency: list.currency,
                                receipt_id: list.receipt_id,
                                payment_id: list.payment_id,
                                success: this.generateHTMLElement(list.success),
                                coupon_applied: list.coupon_applied
                                    ? "applied"
                                    : "",
                                coupon_price: list.coupon_price,
                                created_on: list.created_on,
                            });

                            if (list.subscription) {
                                list.subscription.forEach((item) => {
                                    let purchase_date = new Date(
                                            list.created_on
                                        ),
                                        current_date = new Date();

                                    if (item.duration_in_months !== 0) {
                                        purchase_date.setMonth(
                                            purchase_date.getMonth() +
                                                item.duration_in_months
                                        );
                                    }
                                    if (item.duration_in_days !== 0) {
                                        purchase_date.setDate(
                                            purchase_date.getDate() +
                                                item.duration_in_days
                                        );
                                    }

                                    subscription_data.push({
                                        receipt_id: list.receipt_id,
                                        title: item.title,
                                        description: item.description,
                                        duration: `${item.duration_in_months} Months ${item.duration_in_days} Days`,
                                        valid_to: dateFormat(
                                            purchase_date,
                                            "dd/mm/yyyy"
                                        ),
                                        created_on: list.created_on,
                                        status:
                                            purchase_date.getTime() >=
                                            current_date.getTime()
                                                ? true
                                                : false,
                                    });
                                });
                            }
                        });
                    }

                    this.setState({
                        purchase_data,
                        subscription_data,
                        totalCount: result.data.count,
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
                    errorMsg: "There is a problem in loading invoice data!",
                    showErrorAlert: true,
                    page_loading: false,
                });
            });
    };

    generateHTMLElement = (status) => {
        return renderToStaticMarkup(
            <span
                className={`${status ? "success-bg" : "danger-bg"} rounded-lg`}
                style={{ fontSize: "13px", padding: "3px 5px" }}
            >
                {status ? "Success" : "Failed"}
            </span>
        );
    };

    handlePageChange(pageNumber) {
        this.setState(
            {
                activePage: pageNumber,
                page_loading: true,
            },
            () => {
                this.fetchInvoices();
            }
        );
    }

    render() {
        return (
            <Wrapper
                history={this.props.history}
                header="Subscription summary"
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
                            <Link to="/dashboard">
                                <i className="fas fa-home fa-sm"></i>
                            </Link>
                        </li>
                        <li className="breadcrumb-item active">
                            Subscription summary
                        </li>
                    </ol>
                </nav>

                {/* statistic table */}
                <div className="card shadow-sm">
                    <InvoiceTable
                        purchase_data={this.state.purchase_data}
                        subscription_data={this.state.subscription_data}
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

export default StudentInvoice;
