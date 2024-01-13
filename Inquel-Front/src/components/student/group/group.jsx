import React, { Component } from "react";
import Wrapper from "../wrapper";
import { Link } from "react-router-dom";
import { baseUrl, studentUrl } from "../../../shared/baseUrl.js";
import Loading from "../../common/loader";
import AlertBox from "../../common/alert";
import Slider from "react-slick";
import { connect } from "react-redux";
import storeDispatch from "../../../redux/dispatch";
import { SUBJECT } from "../../../redux/action";
import { SUBJECT_THUMBNAIL } from "../../../shared/constant";

const mapStateToProps = (state) => ({
    group_name: state.content.group_name,
    profile: state.user.profile,
});

class Group extends Component {
    constructor(props) {
        super(props);
        this.state = {
            subjectItems: [],

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
        document.title = `${this.props.group_name} - Student | IQLabs`;

        fetch(`${this.url}/student/subject/`, {
            method: "GET",
            headers: this.headers,
        })
            .then((res) => res.json())
            .then((result) => {
                if (result.sts === true) {
                    this.setState({
                        subjectItems: result.data,
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
                {
                    breakpoint: 480,
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
                header={this.props.group_name}
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
                                Group:{" "}
                            </span>
                            {this.props.group_name}
                        </li>
                    </ol>
                </nav>

                {/* Assigned subjects */}
                <div className="card shadow-sm mb-4">
                    <div className="card-header">
                        <h5 className="mb-0">Subjects</h5>
                    </div>
                    <div className="card-body">
                        {this.state.subjectItems &&
                        this.state.subjectItems.length > 0 ? (
                            <Slider {...settings}>
                                {(this.state.subjectItems || []).map(
                                    (data, index) => {
                                        return (
                                            <div
                                                className="px-3"
                                                data-index={index}
                                                key={index}
                                            >
                                                <Link
                                                    to={`/dashboard/subject/${data.id}`}
                                                    className="text-decoration-none"
                                                    onClick={() =>
                                                        storeDispatch(
                                                            SUBJECT,
                                                            data.subject_name
                                                        )
                                                    }
                                                >
                                                    <div className="card">
                                                        <img
                                                            src={SUBJECT_THUMBNAIL}
                                                            className="card-img-top"
                                                            alt={data.subject_name}
                                                        />
                                                        <div
                                                            className="card-body primary-bg text-white p-2"
                                                            style={{
                                                                cursor: "pointer",
                                                            }}
                                                        >
                                                            {data.subject_name}
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

export default connect(mapStateToProps)(Group);
