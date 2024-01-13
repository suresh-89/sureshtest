import React from "react";
import Header from "./shared/navbar";
import Footer from "./shared/footer";
import { ErrorBoundary } from "react-error-boundary";
import ErrorFallback from "../common/ErrorFallback";
import { baseUrl, homeURL, studentUrl } from "../../shared/baseUrl";
import Loading from "../common/loader";
import Paginations from "../common/pagination";
import { paginationCount, SUBJECT_THUMBNAIL } from "../../shared/constant";
import AlertBox from "../common/alert";
import DetailModal from "../common/modal/courseDetail";
import { Link } from "react-router-dom";
import { TawkTo, ToggleTawkTo } from "../common/function/TawktoChatWidget";

class FreeCatalog extends React.Component {
    constructor() {
        super();
        this.state = {
            active_sub_category: {
                code: "",
                title: "",
            },
            active_level: { code: "", title: "" },
            // search_term: "",

            courses: [],
            sub_category: [],
            level: [],

            page: 1,
            count: 0,

            page_loading: true,
            responseMsg: "",
            showErrorAlert: false,
            showSuccessAlert: false,
            showModal: false,
            selectedData: "",
        };
        this.url = baseUrl + homeURL;
        this.headers = {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: localStorage.getItem("is_student")
                ? localStorage.getItem("Authorization")
                : undefined,
        };
    }

    componentDidMount = () => {
        document.title = "Free courses | IQ Labs Academy";
        window.scrollTo(0, 0);

        this.loadCourses();
        this.loadSubCategory();

        // Initialize tawk-to chat widget
        TawkTo();
        setTimeout(() => {
            ToggleTawkTo("show");
        }, 100);
    };

    componentWillUnmount = () => {
        // Toggle tawk-to chat widget
        ToggleTawkTo("hide");
    };

    getPath = () => {
        let path = `${this.url}/subscription/free/`;

        if (this.state.active_sub_category.code !== "") {
            path += `?sub_category=${this.state.active_sub_category.code}`;
        }
        if (this.state.active_level.code !== "") {
            path += `&level=${this.state.active_level.code}`;
        }
        if (this.state.page > 1) {
            path += `&page=${this.state.page}`;
        }

        return path;
    };

    loadCourses = () => {
        fetch(this.getPath(), {
            headers: this.headers,
            method: "GET",
        })
            .then((res) => res.json())
            .then((result) => {
                if (result.sts === true) {
                    this.setState({
                        courses: result.data.results,
                        count: result.data.count,
                        page_loading: false,
                    });
                } else {
                    this.setState({
                        responseMsg: result.msg,
                        showErrorAlert: true,
                        page_loading: false,
                    });
                }
            })
            .catch((err) => {
                console.log(err);
                this.setState({
                    responseMsg: "Something went wrong!",
                    showErrorAlert: true,
                    page_loading: false,
                });
            });
    };

    // ---------- Search term ----------

    // handleSearch = (e) => {
    //     e.preventDefault();
    //     if (this.state.search_term !== "") {
    //         this.setState(
    //             {
    //                 courses: [],
    //                 level: [],
    //                 page: 1,
    //                 active_sub_category: {
    //                     code: "",
    //                     title: "",
    //                 },
    //                 active_level: { code: "", title: "" },
    //                 page_loading: true,
    //             },
    //             () => {
    //                 fetch(
    //                     `${this.url}/subscription/free/search/?search_term=${this.state.search_term}`,
    //                     {
    //                         headers: this.headers,
    //                         method: "GET",
    //                     }
    //                 )
    //                     .then((res) => res.json())
    //                     .then((result) => {
    //                         if (result.sts === true) {
    //                             this.setState({
    //                                 courses: result.data.results,
    //                                 count: result.data.count,
    //                                 page_loading: false,
    //                             });
    //                         } else {
    //                             this.setState({
    //                                 responseMsg: result.msg,
    //                                 showErrorAlert: true,
    //                                 page_loading: false,
    //                             });
    //                         }
    //                     })
    //                     .catch((err) => {
    //                         console.log(err);
    //                         this.setState({
    //                             responseMsg: "Something went wrong!",
    //                             showErrorAlert: true,
    //                             page_loading: false,
    //                         });
    //                     });
    //             }
    //         );
    //     }
    // };

    // ---------- Filter ----------

    loadSubCategory = () => {
        fetch(`${this.url}/subscription/free/filter/`, {
            headers: this.headers,
            method: "GET",
        })
            .then((res) => res.json())
            .then((result) => {
                if (result.sts === true) {
                    this.setState({
                        sub_category: result.data.sub_category,
                    });
                }
            })
            .catch((err) => {
                console.log(err);
            });
    };

    loadLevel = (list) => {
        this.setState({
            active_sub_category: list,
            page_loading: true,
        });

        if (list.code !== "ALL") {
            fetch(
                `${this.url}/subscription/free/filter/?sub_category=${list.code}`,
                {
                    headers: this.headers,
                    method: "GET",
                }
            )
                .then((res) => res.json())
                .then((result) => {
                    if (result.sts === true) {
                        this.setState(
                            {
                                level: result.data.level,
                            },
                            () => this.loadCourses()
                        );
                    }
                })
                .catch((err) => {
                    console.log(err);
                });
        } else {
            this.setState(
                {
                    active_level: { code: "", title: "" },
                    level: [],
                },
                () => this.loadCourses()
            );
        }
    };

    // ---------- Free trial ---------

    handleFreeTrial = (id) => {
        this.setState({
            page_loading: true,
            showErrorAlert: false,
            showSuccessAlert: false,
        });

        if (
            localStorage.getItem("Authorization") &&
            localStorage.getItem("is_student")
        ) {
            fetch(`${baseUrl}${studentUrl}/student/enroll/${id}/`, {
                headers: this.headers,
                method: "POST",
            })
                .then((res) => res.json())
                .then((result) => {
                    if (result.sts === true) {
                        this.setState({
                            responseMsg: result.msg,
                            showSuccessAlert: true,
                        });
                        this.loadCourses();
                    } else {
                        this.setState({
                            responseMsg: result.msg,
                            showErrorAlert: true,
                            page_loading: false,
                        });
                    }
                })
                .catch((err) => {
                    console.log(err);
                    this.setState({
                        responseMsg: "Something went wrong!",
                        showErrorAlert: true,
                        page_loading: false,
                    });
                });
        } else {
            this.props.history.push(`/login?redirect=${this.props.match.url}`);
        }
    };

    render() {
        return (
            <>
                <Header activeLink="course" />

                {/* Alert message */}
                <AlertBox
                    errorMsg={this.state.responseMsg}
                    successMsg={this.state.responseMsg}
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

                <ErrorBoundary
                    FallbackComponent={ErrorFallback}
                    onReset={() => window.location.reload()}
                >
                    <main className="catalog container">
                        <div className="row">
                            {/* ----------- Filter column ----------- */}
                            <div className="col-md-3 mb-3">
                                <nav aria-label="breadcrumb">
                                    <ol className="breadcrumb mb-3">
                                        <li className="breadcrumb-item">
                                            <Link to="/">
                                                <i className="fas fa-home fa-sm"></i>{" "}
                                                Home
                                            </Link>
                                        </li>
                                        <li className="breadcrumb-item active">
                                            Catalog
                                        </li>
                                    </ol>
                                </nav>

                                {/* ----- search ----- */}
                                {/* <div className="search">
                                    <form onSubmit={this.handleSearch}>
                                        <div className="form-row align-items-center">
                                            <div className="col-10 pr-0">
                                                <input
                                                    type="search"
                                                    name="search"
                                                    id="search"
                                                    placeholder="Search..."
                                                    className="form-control"
                                                    autoComplete="off"
                                                    onChange={(event) => {
                                                        this.setState({
                                                            search_term:
                                                                event.target
                                                                    .value,
                                                        });
                                                        if (
                                                            event.target
                                                                .value === ""
                                                        ) {
                                                            this.setState(
                                                                {
                                                                    page_loading: true,
                                                                },
                                                                () =>
                                                                    this.loadCourses()
                                                            );
                                                        }
                                                    }}
                                                    required
                                                />
                                            </div>
                                            <div className="col-2 pr-0">
                                                <button
                                                    type="submit"
                                                    className="btn bg-transparent btn-sm shadow-none"
                                                    onClick={this.handleSearch}
                                                >
                                                    <i className="fas fa-search"></i>
                                                </button>
                                            </div>
                                        </div>
                                    </form>
                                </div>

                                <div className="border-bottom mt-3 mb-1"></div> */}

                                {/* ----- sub_category ----- */}
                                {this.state.sub_category &&
                                this.state.sub_category.length !== 0 ? (
                                    <div className="category">
                                        <p className="text-muted font-weight-bold-600">
                                            Filter by
                                        </p>
                                        {(this.state.sub_category || []).map(
                                            (list, index) => {
                                                return (
                                                    <p
                                                        className={`tab ${
                                                            this.state
                                                                .active_sub_category
                                                                .code ===
                                                            list.code
                                                                ? "active"
                                                                : ""
                                                        }`}
                                                        key={index}
                                                        onClick={() =>
                                                            this.loadLevel(list)
                                                        }
                                                    >
                                                        {this.state
                                                            .active_sub_category
                                                            .code ===
                                                        list.code ? (
                                                            <i className="fas fa-check-circle fa-sm mr-1"></i>
                                                        ) : (
                                                            <i className="far fa-circle fa-sm mr-1"></i>
                                                        )}{" "}
                                                        {list.title}
                                                    </p>
                                                );
                                            }
                                        )}
                                    </div>
                                ) : (
                                    ""
                                )}

                                {/* ----- level ----- */}
                                {this.state.level &&
                                this.state.level.length !== 0 ? (
                                    <>
                                        <div className="border-bottom mb-2"></div>
                                        <div className="category">
                                            <p className="text-muted font-weight-bold-600">
                                                Level
                                            </p>
                                            {(this.state.level || []).map(
                                                (list, index) => {
                                                    return (
                                                        <p
                                                            className={`tab ${
                                                                this.state
                                                                    .active_level
                                                                    .code ===
                                                                list.code
                                                                    ? "active"
                                                                    : ""
                                                            }`}
                                                            key={index}
                                                            onClick={() => {
                                                                this.setState(
                                                                    {
                                                                        active_level:
                                                                            list,
                                                                        page_loading: true,
                                                                    },
                                                                    () =>
                                                                        this.loadCourses()
                                                                );
                                                            }}
                                                        >
                                                            {this.state
                                                                .active_level
                                                                .code ===
                                                            list.code ? (
                                                                <i className="fas fa-check-circle fa-sm mr-1"></i>
                                                            ) : (
                                                                <i className="far fa-circle fa-sm mr-1"></i>
                                                            )}{" "}
                                                            {list.title}
                                                        </p>
                                                    );
                                                }
                                            )}
                                        </div>
                                    </>
                                ) : (
                                    ""
                                )}
                            </div>

                            {/* ---------- Course list column ---------- */}
                            <div className="col-md-9">
                                {this.state.courses &&
                                this.state.courses.length !== 0 ? (
                                    <>
                                        <div className="header border-bottom">
                                            <div className="row">
                                                <div className="col-md-6">
                                                    Free Courses
                                                </div>
                                                <div className="col-md-6"></div>
                                            </div>
                                        </div>
                                        <div className="form-row">
                                            {(this.state.courses || []).map(
                                                (item, index) => {
                                                    return (
                                                        <div
                                                            className="col-lg-4 col-md-6 col-12 mb-4"
                                                            key={index}
                                                        >
                                                            <div className="card">
                                                                <div className="px-2 pt-2">
                                                                    <img
                                                                        src={
                                                                            item
                                                                                .subscription_file_link
                                                                                .subscription_image_1
                                                                                ? item
                                                                                      .subscription_file_link
                                                                                      .subscription_image_1
                                                                                : SUBJECT_THUMBNAIL
                                                                        }
                                                                        alt={
                                                                            item.title
                                                                        }
                                                                        className="card-img-top shadow-sm"
                                                                    />
                                                                </div>
                                                                <div className="card-body p-3">
                                                                    <p className="title text-truncate">
                                                                        {
                                                                            item.title
                                                                        }
                                                                    </p>
                                                                    <p className="description">
                                                                        {item.description.substring(
                                                                            0,
                                                                            80
                                                                        )}
                                                                        {item.description
                                                                            ? item
                                                                                  .description
                                                                                  .length >
                                                                              80
                                                                                ? "..."
                                                                                : ""
                                                                            : ""}

                                                                        <span
                                                                            className="read-more ml-1"
                                                                            onClick={() => {
                                                                                this.setState(
                                                                                    {
                                                                                        showModal: true,
                                                                                        selectedData:
                                                                                            item,
                                                                                    }
                                                                                );
                                                                            }}
                                                                        >
                                                                            Read
                                                                            more
                                                                        </span>
                                                                    </p>
                                                                    {/* <div className="d-flex align-items-center mb-3">
                                                                        <span className="font-weight-bold light-bg primary-text rounded-pill small py-1 px-2 mr-2">
                                                                            <i className="fas fa-rupee-sign fa-sm"></i>{" "}
                                                                            {
                                                                                item.discounted_price
                                                                            }
                                                                        </span>
                                                                        {item.discounted_price <
                                                                        item.total_price ? (
                                                                            <span
                                                                                className="text-muted small"
                                                                                style={{
                                                                                    textDecoration:
                                                                                        "line-through",
                                                                                }}
                                                                            >
                                                                                <i className="fas fa-rupee-sign fa-sm"></i>{" "}
                                                                                {
                                                                                    item.total_price
                                                                                }
                                                                            </span>
                                                                        ) : (
                                                                            ""
                                                                        )}
                                                                    </div> */}
                                                                    {/* check if the subscription is free one */}

                                                                    <button
                                                                        className="btn btn-primary btn-sm btn-block shadow-none mt-auto"
                                                                        onClick={() =>
                                                                            this.handleFreeTrial(
                                                                                item.subscription_id
                                                                            )
                                                                        }
                                                                    >
                                                                        Enroll
                                                                        now
                                                                    </button>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    );
                                                }
                                            )}
                                        </div>
                                        {this.state.count > paginationCount ? (
                                            <div className="d-flex justify-content-center w-100 mb-5">
                                                <Paginations
                                                    activePage={this.state.page}
                                                    totalItemsCount={
                                                        this.state.count
                                                    }
                                                    onChange={(page) => {
                                                        this.setState(
                                                            {
                                                                page: page,
                                                                page_loading: true,
                                                            },
                                                            () =>
                                                                this.loadCourses()
                                                        );
                                                    }}
                                                />
                                            </div>
                                        ) : (
                                            ""
                                        )}
                                    </>
                                ) : (
                                    <div
                                        className="mb-3"
                                        style={{
                                            height: "100%",
                                            display: "flex",
                                            flexDirection: "column",
                                            justifyContent: "center",
                                            alignItems: "center",
                                        }}
                                    >
                                        {!this.state.page_loading ? (
                                            <>
                                                <h1 className="text-center display-4">
                                                    <i className="far fa-folder-open"></i>
                                                </h1>
                                                <h4 className="text-center">
                                                    Catalog is empty, no courses
                                                    to display...
                                                </h4>
                                            </>
                                        ) : (
                                            ""
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>
                    </main>

                    {/* Loading component */}
                    {this.state.page_loading ? <Loading /> : ""}
                </ErrorBoundary>

                <Footer />
            </>
        );
    }
}

export default FreeCatalog;
