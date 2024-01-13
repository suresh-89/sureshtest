import React, { Component } from "react";
import Wrapper from "../wrapper";
import { Link } from "react-router-dom";
import { baseUrl, studentUrl } from "../../../shared/baseUrl.js";
import Loading from "../../common/loader";
import AlertBox from "../../common/alert";
import Slider from "react-slick";
import { connect } from "react-redux";
import storeDispatch from "../../../redux/dispatch";
import { COURSE } from "../../../redux/action";
import { SUBJECT_THUMBNAIL } from "../../../shared/constant";

const mapStateToProps = (state) => ({
    subscription_name: state.content.subscription_name,
    profile: state.user.profile,
});

class Subscription extends Component {
    constructor(props) {
        super(props);
        this.state = {
            courses: [],

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
        this.subscriptionId = this.props.match.params.subscriptionId;
    }

    componentDidMount = () => {
        document.title = `${this.props.subscription_name} - Student | IQLabs`;

        fetch(`${this.url}/student/sub/${this.subscriptionId}/`, {
            method: "GET",
            headers: this.headers,
        })
            .then((res) => res.json())
            .then((result) => {
                if (result.sts === true) {
                    this.setState({
                        courses: result.data.courses,
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
                    errorMsg: "Cannot show courses at the moment!",
                    showErrorAlert: true,
                    page_loading: false,
                });
            });
    };

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
                header={this.props.subscription_name}
                activeLink="dashboard"
                history={this.props.history}
                waterMark={this.props.profile}
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
                            <span className="font-weight-bold-600">
                                Subscription:{" "}
                            </span>
                            {this.props.subscription_name}
                        </li>
                    </ol>
                </nav>

                {/* Courses list */}
                <div className="card shadow-sm mb-4">
                    <div className="card-header">
                        <h5 className="mb-0">Courses</h5>
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
                                                <Link
                                                    to={`${this.props.match.url}/course/${data.course_id}`}
                                                    className="text-decoration-none"
                                                    onClick={() =>
                                                        storeDispatch(
                                                            COURSE,
                                                            data.course_name
                                                        )
                                                    }
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
                                                        <div
                                                            className="card-body primary-bg text-white p-2"
                                                            style={{
                                                                cursor: "pointer",
                                                            }}
                                                        >
                                                            {data.course_name}
                                                        </div>
                                                    </div>
                                                </Link>
                                            </div>
                                        );
                                    }
                                )}
                            </Slider>
                        ) : null}
                    </div>
                </div>

                {/* Loading component */}
                {this.state.page_loading ? <Loading /> : ""}
            </Wrapper>
        );
    }
}

export default connect(mapStateToProps)(Subscription);
