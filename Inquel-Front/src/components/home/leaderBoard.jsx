import React, { Component } from "react";
import Header from "./shared/navbar";
import Footer from "./shared/footer";
import { Tabs, Tab } from "react-bootstrap";
import Loading from "../common/loader";
import LeaderboardTable from "../common/table/leaderboard";
import { baseUrl, homeURL } from "../../shared/baseUrl.js";
import { ErrorBoundary } from "react-error-boundary";
import ErrorFallback from "../common/ErrorFallback";
import AlertBox from "../common/alert";
import Select from "react-select";
import { TawkTo, ToggleTawkTo } from "../common/function/TawktoChatWidget";

class HomeLeaderboard extends Component {
    constructor() {
        super();
        this.state = {
            quiz_filter: [],
            quiz_leaderboard: [],
            quiz_selected_id: "",

            course_filter: [],
            course_leaderboard: [],
            course_selected_id: "",

            activeTab: "quiz",

            errorMsg: "",
            successMsg: "",
            showErrorAlert: false,
            showSuccessAlert: false,
            page_loading: true,
        };
        this.url = baseUrl + homeURL;
        this.authToken = localStorage.getItem("Authorization");
        this.headers = {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: this.authToken,
        };
    }

    componentDidMount = () => {
        document.title = "Leaderboard | IQ Labs Academy";

        this.loadQuizFilter();
        this.loadCourseFilter();

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

    // Quiz master
    loadQuizFilter = () => {
        fetch(`${this.url}/leaderboard/filter/`, {
            method: "GET",
            headers: this.headers,
        })
            .then((res) => res.json())
            .then((result) => {
                if (result.sts === true) {
                    this.setState(
                        {
                            quiz_filter: result.data,
                            quiz_selected_id: result.data[0].course_id,
                        },
                        () => this.loadQuizMasters()
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
                    errorMsg: "Cannot load filter data at the moment!",
                    showErrorAlert: true,
                    page_loading: false,
                });
            });
    };

    loadQuizMasters = () => {
        fetch(
            `${this.url}/leaderboard/?course_id=${this.state.quiz_selected_id}`,
            {
                method: "GET",
                headers: this.headers,
            }
        )
            .then((res) => res.json())
            .then((result) => {
                if (result.sts === true) {
                    let temp = [];
                    if (
                        result.data.results &&
                        result.data.results.length !== 0
                    ) {
                        // append serial number and course name
                        result.data.results.forEach((list, index) => {
                            if (list.scored_quiz_points) {
                                list["sl_no"] = index + 1;
                                list["course_name"] =
                                    this.state.quiz_filter.find(
                                        (el) =>
                                            el.course_id ===
                                            this.state.quiz_selected_id
                                    ).course_name;

                                temp.push(list);
                            }
                        });
                    }

                    this.setState({
                        quiz_leaderboard: temp,
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
                    errorMsg: "Cannot load data at the moment!",
                    showErrorAlert: true,
                    page_loading: false,
                });
            });
    };

    // Course topper
    loadCourseFilter = () => {
        fetch(`${this.url}/leaderboard/simulation/filter/`, {
            method: "GET",
            headers: this.headers,
        })
            .then((res) => res.json())
            .then((result) => {
                if (result.sts === true) {
                    this.setState(
                        {
                            course_filter: result.data,
                            course_selected_id: result.data[0].course_id,
                        },
                        () => this.loadCourseTopper()
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
                    errorMsg: "Cannot load filter data at the moment!",
                    showErrorAlert: true,
                    page_loading: false,
                });
            });
    };

    loadCourseTopper = () => {
        fetch(
            `${this.url}/leaderboard/simulation/?course_id=${this.state.course_selected_id}`,
            {
                method: "GET",
                headers: this.headers,
            }
        )
            .then((res) => res.json())
            .then((result) => {
                if (result.sts === true) {
                    let temp = [];
                    if (
                        result.data.results &&
                        result.data.results.length !== 0
                    ) {
                        // append serial number and course name
                        result.data.results.forEach((list, index) => {
                            if (list.simulation_average_points) {
                                list["sl_no"] = index + 1;
                                list["course_name"] =
                                    this.state.course_filter.find(
                                        (el) =>
                                            el.course_id ===
                                            this.state.course_selected_id
                                    ).course_name;

                                temp.push(list);
                            }
                        });
                    }

                    this.setState({
                        course_leaderboard: temp,
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
                    errorMsg: "Cannot load data at the moment!",
                    showErrorAlert: true,
                    page_loading: false,
                });
            });
    };

    render() {
        return (
            <>
                <Header activeLink="leaderboard" />

                <header className="jumbotron">
                    <h1 className="mb-0">Leader Board</h1>
                </header>

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

                <ErrorBoundary
                    FallbackComponent={ErrorFallback}
                    onReset={() => window.location.reload()}
                >
                    <main className="container mb-5">
                        <div className="card card-body shadow-sm">
                            {/* Leaderboard table */}
                            <Tabs
                                activeKey={this.state.activeTab}
                                id="uncontrolled-tab-example"
                                onSelect={(key) => {
                                    this.setState({ activeTab: key });
                                }}
                            >
                                {/* Quiz Table */}
                                <Tab eventKey="quiz" title="Quiz Masters">
                                    <div className="card shadow-sm">
                                        <div className="card-header">
                                            <div className="row">
                                                <div className="col-md-4">
                                                    <Select
                                                        className="basic-single border-secondary"
                                                        placeholder="Select course"
                                                        isSearchable={true}
                                                        name="course"
                                                        value={(
                                                            this.state
                                                                .quiz_filter ||
                                                            []
                                                        ).map((data) => {
                                                            return data.course_id ===
                                                                this.state
                                                                    .quiz_selected_id
                                                                ? {
                                                                      value: data.course_id,
                                                                      label: data.course_name,
                                                                  }
                                                                : "";
                                                        })}
                                                        options={(
                                                            this.state
                                                                .quiz_filter ||
                                                            []
                                                        ).map((data) => {
                                                            return {
                                                                value: data.course_id,
                                                                label: data.course_name,
                                                            };
                                                        })}
                                                        onChange={(event) => {
                                                            this.setState(
                                                                {
                                                                    quiz_selected_id:
                                                                        event.value,
                                                                    activeQuizPage: 1,
                                                                    page_loading: true,
                                                                },
                                                                () =>
                                                                    this.loadQuizMasters()
                                                            );
                                                        }}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                        <LeaderboardTable
                                            data={this.state.quiz_leaderboard}
                                            points={true}
                                        />
                                        <div className="card-footer"></div>
                                    </div>
                                </Tab>

                                {/* Course toppers table */}
                                <Tab eventKey="course" title="Course Toppers">
                                    <div className="card shadow-sm">
                                        <div className="card-header">
                                            <div className="row">
                                                <div className="col-md-4">
                                                    <Select
                                                        className="basic-single border-secondary"
                                                        placeholder="Select course"
                                                        isSearchable={true}
                                                        name="course"
                                                        value={(
                                                            this.state
                                                                .course_filter ||
                                                            []
                                                        ).map((data) => {
                                                            return data.course_id ===
                                                                this.state
                                                                    .course_selected_id
                                                                ? {
                                                                      value: data.course_id,
                                                                      label: data.course_name,
                                                                  }
                                                                : "";
                                                        })}
                                                        options={(
                                                            this.state
                                                                .course_filter ||
                                                            []
                                                        ).map((data) => {
                                                            return {
                                                                value: data.course_id,
                                                                label: data.course_name,
                                                            };
                                                        })}
                                                        onChange={(event) => {
                                                            this.setState(
                                                                {
                                                                    course_selected_id:
                                                                        event.value,
                                                                    activeCoursePage: 1,
                                                                    page_loading: true,
                                                                },
                                                                () =>
                                                                    this.loadCourseTopper()
                                                            );
                                                        }}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                        <LeaderboardTable
                                            data={this.state.course_leaderboard}
                                            average={true}
                                        />
                                        <div className="card-footer"></div>
                                    </div>
                                </Tab>
                            </Tabs>
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

export default HomeLeaderboard;
