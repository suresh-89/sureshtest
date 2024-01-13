import React, { Component } from "react";
import Wrapper from "./wrapper";
import { Link } from "react-router-dom";
import { baseUrl, studentUrl } from "../../shared/baseUrl.js";
import Footer from "../home/shared/footer";
import Loading from "../common/loader";
import AlertBox from "../common/alert";
import { connect } from "react-redux";
import storeDispatch from "../../redux/dispatch";
import { CART_COUNT, GROUP, SUBSCRIPTION } from "../../redux/action";
import Slider from "react-slick";
import { GROUP_THUMBNAIL, SUBJECT_THUMBNAIL } from "../../shared/constant";
import DetailModal from "../common/modal/courseDetail";

const mapStateToProps = (state) => ({
    profile: state.user.profile,
});

class FlashNews extends Component {
    constructor() {
        super();
        this.state = {
            flash_news: "",
            is_active: false,

            errorMsg: "",
            successMsg: "",
            showErrorAlert: false,
            showSuccessAlert: false,
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
        fetch(`${this.url}/student/flashnews/`, {
            method: "GET",
            headers: this.headers,
        })
            .then((res) => res.json())
            .then((result) => {
                if (result.sts === true) {
                    this.setState({
                        flash_news: result.data.flash_news,
                        is_active: result.data.is_active,
                    });
                }
            })
            .catch((err) => {
                console.log(err);
                this.setState({
                    errorMsg: "Cannot show flash news at the moment!",
                    showErrorAlert: true,
                });
            });
    };

    render() {
        return this.state.is_active === true && this.state.flash_news !== "" ? (
            <>
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

                <div className="card shadow-sm mb-4">
                    <div className="card-header">
                        <h5 className="mb-0">Flash News</h5>
                    </div>
                    <div
                        className="card-body"
                        dangerouslySetInnerHTML={{
                            __html: this.state.flash_news,
                        }}
                    ></div>
                </div>
            </>
        ) : (
            ""
        );
    }
}

const Group = (props) => {
    return props.group && Object.keys(props.group).length !== 0 ? (
        props.profile && Object.entries(props.profile).length !== 0 ? (
            props.profile.is_independent_student === false ? (
                <div className="card shadow-sm mb-4">
                    <div className="card-header">
                        <h5 className="mb-0">Group</h5>
                    </div>
                    <div className="card-body">
                        <div className="row">
                            <div className="col-lg-3 col-md-4 col-sm-6">
                                <Link
                                    to={`/dashboard/group/${props.group.id}`}
                                    className="text-decoration-none"
                                    onClick={() =>
                                        storeDispatch(
                                            GROUP,
                                            props.group.group_name
                                        )
                                    }
                                >
                                    <div className="card">
                                        <img
                                            src={GROUP_THUMBNAIL}
                                            className="card-img-top"
                                            alt={props.group.group_name}
                                        />
                                        <div
                                            className="card-body primary-bg text-white p-2"
                                            style={{
                                                cursor: "pointer",
                                            }}
                                        >
                                            {props.group.group_name}
                                        </div>
                                    </div>
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            ) : null
        ) : null
    ) : null;
};

class Subscriptions extends Component {
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
        return this.props.subscriptions &&
            this.props.subscriptions.length !== 0 ? (
            <div className="card shadow-sm mb-4">
                <div className="card-header">
                    <h5 className="mb-0">Subscribed Course</h5>
                </div>
                <div className="card-body">
                    <Slider {...settings}>
                        {(this.props.subscriptions || []).map((data, index) => {
                            return (
                                <div
                                    className="px-3"
                                    data-index={index}
                                    key={index}
                                >
                                    <Link
                                        to={`/dashboard/subscription/${data.subscription_id}`}
                                        className="text-decoration-none"
                                        onClick={() =>
                                            storeDispatch(
                                                SUBSCRIPTION,
                                                data.title
                                            )
                                        }
                                    >
                                        <div className="card">
                                            <img
                                                src={
                                                    data.subscription_file_link
                                                        .subscription_image_1
                                                        ? data
                                                              .subscription_file_link
                                                              .subscription_image_1
                                                        : SUBJECT_THUMBNAIL
                                                }
                                                className="card-img-top"
                                                alt={data.title}
                                            />
                                            <div
                                                className="card-body primary-bg text-white p-2"
                                                style={{
                                                    cursor: "pointer",
                                                }}
                                            >
                                                {data.title}
                                            </div>
                                        </div>
                                    </Link>
                                </div>
                            );
                        })}
                    </Slider>
                </div>
            </div>
        ) : null;
    }
}

class RecommendedCourses extends Component {
    constructor() {
        super();
        this.state = {
            selectedData: {},
            showModal: false,

            errorMsg: "",
            successMsg: "",
            showErrorAlert: false,
            showSuccessAlert: false,
            page_loading: false,
        };
        this.url = baseUrl + studentUrl;
        this.authToken = localStorage.getItem("Authorization");
        this.headers = {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: this.authToken,
        };
    }

    // ----- Free trial -----

    loadCartData = () => {
        fetch(`${this.url}/student/cart/checkout/`, {
            headers: this.headers,
            method: "GET",
        })
            .then((res) => res.json())
            .then((result) => {
                if (result.sts === true) {
                    storeDispatch(
                        CART_COUNT,
                        result.data.cart_items.length || 0
                    );
                }
            })
            .catch((err) => {
                console.log(err);
            });
    };

    handleFreeTrial = (id) => {
        this.setState({
            page_loading: true,
            showErrorAlert: false,
            showSuccessAlert: false,
        });

        fetch(`${this.url}/student/enroll/${id}/`, {
            headers: this.headers,
            method: "POST",
        })
            .then((res) => res.json())
            .then((result) => {
                if (result.sts === true) {
                    this.setState(
                        {
                            successMsg: result.msg,
                            showSuccessAlert: true,
                        },
                        () => {
                            this.props.fetchCourses();
                            this.loadCartData();
                        }
                    );
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
            ],
        };
        return (
            <>
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

                {this.state.showModal ? (
                    <DetailModal
                        show={this.state.showModal}
                        onHide={() =>
                            this.setState({
                                showModal: false,
                            })
                        }
                        data={this.state.selectedData}
                    />
                ) : (
                    ""
                )}

                {this.props.recommend_courses &&
                this.props.recommend_courses.length !== 0 ? (
                    <div className="card shadow-sm">
                        <div className="card-header">
                            <h5 className="mb-0">
                                {this.props.subscriptions &&
                                this.props.subscriptions.length === 0
                                    ? "Popular course"
                                    : "Recommended Course"}
                            </h5>
                        </div>
                        <div className="card-body">
                            <Slider {...settings}>
                                {(this.props.recommend_courses || []).map(
                                    (data, index) => {
                                        return (
                                            <div
                                                className="px-2 mb-2"
                                                data-index={index}
                                                key={index}
                                            >
                                                <div className="card borders">
                                                    <div className="px-2 pt-2">
                                                        <img
                                                            src={
                                                                data
                                                                    .subscription_file_link
                                                                    .subscription_image_1
                                                                    ? data
                                                                          .subscription_file_link
                                                                          .subscription_image_1
                                                                    : SUBJECT_THUMBNAIL
                                                            }
                                                            alt={data.title}
                                                            className="card-img-top shadow-sm"
                                                        />
                                                    </div>
                                                    <div className="card-body p-3">
                                                        <p className="font-weight-bold-600 mb-2 text-truncate">
                                                            {data.title}
                                                        </p>
                                                        <p className="small">
                                                            {data.description.substring(
                                                                0,
                                                                60
                                                            )}
                                                            {data.description
                                                                ? data
                                                                      .description
                                                                      .length >
                                                                  60
                                                                    ? "..."
                                                                    : ""
                                                                : ""}

                                                            <span
                                                                className="primary-text font-weight-bold-600 ml-1"
                                                                style={{
                                                                    cursor: "pointer",
                                                                }}
                                                                onClick={() => {
                                                                    this.setState(
                                                                        {
                                                                            showModal: true,
                                                                            selectedData:
                                                                                data,
                                                                        }
                                                                    );
                                                                }}
                                                            >
                                                                Read more
                                                            </span>
                                                        </p>
                                                        <div className="d-flex align-items-center mb-3">
                                                            <span className="font-weight-bold light-bg primary-text rounded-pill small py-1 px-2 mr-2">
                                                                <i className="fas fa-rupee-sign fa-sm"></i>{" "}
                                                                {
                                                                    data.discounted_price
                                                                }
                                                            </span>
                                                            {data.discounted_price <
                                                            data.total_price ? (
                                                                <span
                                                                    className="text-muted small"
                                                                    style={{
                                                                        textDecoration:
                                                                            "line-through",
                                                                    }}
                                                                >
                                                                    <i className="fas fa-rupee-sign fa-sm"></i>{" "}
                                                                    {
                                                                        data.total_price
                                                                    }
                                                                </span>
                                                            ) : (
                                                                ""
                                                            )}
                                                        </div>

                                                        {/* check if the subscription is free one */}
                                                        {data.enroll_now ===
                                                        true ? (
                                                            <button
                                                                className="btn btn-primary btn-sm btn-block shadow-none mt-auto"
                                                                onClick={() =>
                                                                    this.handleFreeTrial(
                                                                        data.subscription_id
                                                                    )
                                                                }
                                                            >
                                                                Free Trial
                                                            </button>
                                                        ) : // check if the subscription is added in the cart
                                                        data.added_to_cart ? (
                                                            <div className="mt-auto">
                                                                <Link
                                                                    className="text-decoration-none"
                                                                    to="/cart"
                                                                >
                                                                    <button className="btn btn-primary btn-sm btn-block shadow-none">
                                                                        Added to
                                                                        cart{" "}
                                                                        <i className="fas fa-check-circle fa-sm ml-1"></i>
                                                                    </button>
                                                                </Link>
                                                            </div>
                                                        ) : (
                                                            // else show the enroll button
                                                            <div className="mt-auto enroll">
                                                                <Link
                                                                    to={`/checkout/${data.subscription_id}`}
                                                                    className="text-decoration-none"
                                                                >
                                                                    <button className="btn btn-primary btn-sm btn-block shadow-none">
                                                                        Enroll
                                                                        now{" "}
                                                                        <i className="fas fa-arrow-right fa-sm ml-1"></i>
                                                                    </button>
                                                                </Link>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    }
                                )}
                            </Slider>
                        </div>
                    </div>
                ) : null}

                {/* Loading component */}
                {this.state.page_loading ? <Loading /> : ""}
            </>
        );
    }
}

class Dashboard extends Component {
    constructor(props) {
        super(props);
        this.state = {
            group: {},
            subscriptions: [],
            recommend_courses: [],

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
        document.title = "Dashboard - Student | IQLabs";

        window.scrollTo(0, 0);

        this.fetchSubscriptions();
        this.fetchGroup();
    };

    fetchGroup = () => {
        fetch(`${this.url}/student/group/`, {
            method: "GET",
            headers: this.headers,
        })
            .then((res) => res.json())
            .then((result) => {
                if (result.sts === true) {
                    this.setState({
                        group: result.data,
                        page_loading: false,
                    });
                } else {
                    this.setState({
                        page_loading: false,
                    });
                }
            })
            .catch((err) => {
                console.log(err);
                this.setState({
                    errorMsg: "Cannot show group data at the moment!",
                    showErrorAlert: true,
                    page_loading: false,
                });
            });
    };

    fetchSubscriptions = (path) => {
        fetch(path ? path : `${this.url}/student/sub/`, {
            method: "GET",
            headers: this.headers,
        })
            .then((res) => res.json())
            .then((result) => {
                if (result.sts === true) {
                    let data = [...this.state.subscriptions];
                    data.push(...result.data.results);
                    this.setState(
                        {
                            subscriptions: data,
                        },
                        () => {
                            if (result.data.next !== null) {
                                this.fetchSubscriptions(result.data.next);
                            } else {
                                this.setState({
                                    page_loading: false,
                                });
                                this.fetchRecommendCourses();
                            }
                        }
                    );
                } else {
                    this.setState({
                        page_loading: false,
                    });
                    this.fetchRecommendCourses();
                }
            })
            .catch((err) => {
                console.log(err);
                this.setState({
                    errorMsg: "Cannot show courses at the moment!",
                    showErrorAlert: true,
                    page_loading: false,
                });
                this.fetchRecommendCourses();
            });
    };

    fetchRecommendCourses = () => {
        fetch(`${this.url}/student/recommended/`, {
            method: "GET",
            headers: this.headers,
        })
            .then((res) => res.json())
            .then((result) => {
                if (result.sts === true) {
                    this.setState({
                        recommend_courses: result.data.results,
                        page_loading: false,
                    });
                } else {
                    this.setState({
                        page_loading: false,
                    });
                }
            })
            .catch((err) => {
                console.log(err);
                this.setState({
                    errorMsg: "Cannot show recommend courses at the moment!",
                    showErrorAlert: true,
                    page_loading: false,
                });
            });
    };

    render() {
        return (
            <>
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

                    {/* Flash news */}
                    <FlashNews />

                    {/* Subscriptions */}
                    <Subscriptions subscriptions={this.state.subscriptions} />

                    {/* Group section */}
                    <Group
                        profile={this.props.profile}
                        group={this.state.group}
                    />

                    {/* Recommended course */}
                    <RecommendedCourses
                        recommend_courses={this.state.recommend_courses}
                        fetchCourses={this.fetchRecommendCourses}
                        subscriptions={this.state.subscriptions}
                    />

                    {/* Loading component */}
                    {this.state.page_loading ? <Loading /> : ""}
                </Wrapper>

                {/* Footer */}
                <Footer />
            </>
        );
    }
}

export default connect(mapStateToProps)(Dashboard);
