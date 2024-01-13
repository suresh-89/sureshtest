import React, { Component } from "react";
import Wrapper from "./wrapper";
import { baseUrl, teacherUrl } from "../../shared/baseUrl.js";
import { GROUP_THUMBNAIL, paginationCount } from "../../shared/constant.js";
import Loading from "../common/loader";
import GroupTable from "../common/table/group";
import SubjectTable from "../common/table/subject";
import Paginations from "../common/pagination";
import AlertBox from "../common/alert";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import Slider from "react-slick";
import storeDispatch from "../../redux/dispatch";
import { GROUP } from "../../redux/action";
import { Link } from "react-router-dom";

class TeacherDashboard extends Component {
    constructor(props) {
        super(props);
        this.state = {
            groupItem: [],
            subjectItem: [],

            activeGroupPage: 1,
            totalGroupCount: 0,
            activeSubjectPage: 1,
            totalSubjectCount: 0,

            isTableView: true,

            errorMsg: "",
            successMsg: "",
            showErrorAlert: false,
            showSuccessAlert: false,
            page_loading: true,
        };
        this.url = baseUrl + teacherUrl;
        this.authToken = localStorage.getItem("Authorization");
        this.headers = {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: this.authToken,
        };
    }

    componentDidMount = () => {
        document.title = "Dashboard - Teacher | IQLabs";
        this.loadGroupData();
        this.loadSubjectData();
    };

    loadGroupData = () => {
        fetch(
            this.state.activeGroupPage > 1
                ? `${this.url}/teacher/group/?page=${this.state.activeGroupPage}`
                : `${this.url}/teacher/group/`,
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

    loadSubjectData = () => {
        fetch(
            this.state.activeSubjectPage > 1
                ? `${this.url}/teacher/subject/?page=${this.state.activeSubjectPage}`
                : `${this.url}/teacher/subject/`,
            {
                headers: this.headers,
                method: "GET",
            }
        )
            .then((res) => res.json())
            .then((result) => {
                if (result.sts === true) {
                    this.setState({
                        subjectItem: result.data.results,
                        totalSubjectCount: result.data.count,
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
        var settings = {
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
                {/* Welcome */}
                <div className="card shadow-sm mb-4">
                    <div className="card-body text-center p-4">
                        <h3 className="primary-text mb-0">WELCOME BACK</h3>
                    </div>
                </div>

                {/* Group table */}
                <div className="card shadow-sm mb-4">
                    <div className="card-header">
                        <div className="row">
                            <div className="col-6">
                                <h5 className="mb-0">Groups</h5>
                            </div>
                            <div className="col-6 text-right">
                                <div
                                    className="btn-group btn-group-sm btn-group-toggle"
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
                                                this.state.isTableView
                                                    ? "active"
                                                    : ""
                                            }`}
                                        >
                                            <input
                                                type="radio"
                                                name="options"
                                                id="tableview"
                                                onChange={() => {
                                                    this.setState({
                                                        isTableView: true,
                                                    });
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
                                                !this.state.isTableView
                                                    ? "active"
                                                    : ""
                                            }`}
                                        >
                                            <input
                                                type="radio"
                                                name="options"
                                                id="cardview"
                                                onChange={() => {
                                                    this.setState({
                                                        isTableView: false,
                                                    });
                                                }}
                                            />{" "}
                                            <i className="fas fa-th-large"></i>
                                        </label>
                                    </OverlayTrigger>
                                </div>
                            </div>
                        </div>
                    </div>

                    {this.state.isTableView ? (
                        <>
                            <GroupTable
                                groupItems={this.state.groupItem}
                                path="teacher"
                                view={true}
                                status={true}
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
                        </>
                    ) : (
                        <div className="card-body">
                            <Slider {...settings}>
                                {(this.state.groupItem || []).map(
                                    (data, index) => {
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
                                                    <Link
                                                        to={`${this.props.match.url}/group/${data.id}`}
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
                                    }
                                )}
                            </Slider>
                        </div>
                    )}
                </div>

                {/* Subject Table */}
                <div className="card shadow-sm">
                    <div className="card-header">
                        <h5 className="mb-0">Subjects</h5>
                    </div>
                    <SubjectTable
                        subjectItems={this.state.subjectItem}
                        path="teacher"
                        category={true}
                        sub_category={true}
                        discipline={true}
                        level={true}
                        subject={true}
                    />
                    <div className="card-body p-3">
                        {this.state.totalSubjectCount > paginationCount ? (
                            <Paginations
                                activePage={this.state.activeSubjectPage}
                                totalItemsCount={this.state.totalSubjectCount}
                                onChange={this.handleSubjectPageChange.bind(
                                    this
                                )}
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

export default TeacherDashboard;
