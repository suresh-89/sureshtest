import React, { Component } from "react";
import Wrapper from "../wrapper";
import { Link } from "react-router-dom";
import { baseUrl, hodUrl } from "../../../shared/baseUrl.js";
import Loading from "../../common/loader";
import AlertBox from "../../common/alert";
import { connect } from "react-redux";

const mapStateToProps = (state) => ({
    profile: state.user.profile,
    group_name: state.content.group_name,
});

class HODGroupDetails extends Component {
    constructor(props) {
        super(props);
        this.state = {
            groupItem: [],

            errorMsg: "",
            successMsg: "",
            showErrorAlert: false,
            showSuccessAlert: false,
            page_loading: true,
        };
        this.groupId = this.props.match.params.groupId;
        this.url = baseUrl + hodUrl;
        this.authToken = localStorage.getItem("Authorization");
        this.headers = {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: this.authToken,
        };
    }

    componentDidMount = () => {
        document.title = `${this.props.group_name} : Details - HOD | IQLabs`;

        fetch(`${this.url}/hod/group/${this.groupId}/`, {
            headers: this.headers,
            method: "GET",
        })
            .then((res) => res.json())
            .then((result) => {
                if (result.sts === true) {
                    this.setState({
                        groupItem: result.data,
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
                            <Link to="/hod">
                                <i className="fas fa-home fa-sm"></i>
                            </Link>
                        </li>
                        <li className="breadcrumb-item">
                            <Link to="#" onClick={this.props.history.goBack}>
                                {this.props.group_name}
                            </Link>
                        </li>
                        <li className="breadcrumb-item active">Details</li>
                    </ol>
                </nav>

                <div className="card shadow-sm">
                    <div className="table-responsive">
                        <table className="table table-xl">
                            <thead className="text-white primary-bg">
                                <tr>
                                    <th scope="col">Sl.No</th>
                                    <th scope="col">Subject</th>
                                    <th scope="col">
                                        <div className="row">
                                            <div className="col-4">
                                                Chapters
                                            </div>
                                            <div className="col-4">Status</div>
                                            <div className="col-4">Teacher</div>
                                        </div>
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {this.state.groupItem &&
                                this.state.groupItem.length !== 0
                                    ? this.state.groupItem.subjects.map(
                                          (data, index) => {
                                              return (
                                                  <tr key={index}>
                                                      <td>{index + 1}</td>
                                                      <td>
                                                          {data.subject_name}
                                                      </td>
                                                      <td>
                                                          {data.chapters
                                                              .length !== 0
                                                              ? data.chapters.map(
                                                                    (
                                                                        chapter,
                                                                        index
                                                                    ) => {
                                                                        return (
                                                                            <div
                                                                                className="row"
                                                                                key={
                                                                                    index
                                                                                }
                                                                            >
                                                                                <p className="col-4">
                                                                                    {
                                                                                        chapter.chapter_name
                                                                                    }
                                                                                </p>
                                                                                <p className="col-4">
                                                                                    {chapter.chapter_status.toLowerCase() ===
                                                                                    "yet to start" ? (
                                                                                        <span className="text-danger text-capitalize">
                                                                                            {
                                                                                                chapter.chapter_status
                                                                                            }
                                                                                        </span>
                                                                                    ) : chapter.chapter_status.toLowerCase() ===
                                                                                      "in progress" ? (
                                                                                        <span className="text-warning text-capitalize">
                                                                                            {
                                                                                                chapter.chapter_status
                                                                                            }
                                                                                        </span>
                                                                                    ) : chapter.chapter_status.toLowerCase() ===
                                                                                      "review" ? (
                                                                                        <span className="text-primary text-capitalize">
                                                                                            {
                                                                                                chapter.chapter_status
                                                                                            }
                                                                                        </span>
                                                                                    ) : chapter.chapter_status.toLowerCase() ===
                                                                                      "ready for review" ? (
                                                                                        <span className="text-primary text-capitalize">
                                                                                            {
                                                                                                chapter.chapter_status
                                                                                            }
                                                                                        </span>
                                                                                    ) : chapter.chapter_status.toLowerCase() ===
                                                                                      "approved" ? (
                                                                                        <span className="text-success text-capitalize">
                                                                                            {
                                                                                                chapter.chapter_status
                                                                                            }
                                                                                        </span>
                                                                                    ) : chapter.chapter_status.toLowerCase() ===
                                                                                      "published to group" ? (
                                                                                        <span className="text-success text-capitalize">
                                                                                            {
                                                                                                chapter.chapter_status
                                                                                            }
                                                                                        </span>
                                                                                    ) : (
                                                                                        chapter.chapter_status
                                                                                    )}
                                                                                </p>
                                                                                <div className="col-4">
                                                                                    <p>
                                                                                        {
                                                                                            chapter
                                                                                                .teacher
                                                                                                .full_name
                                                                                        }
                                                                                    </p>
                                                                                </div>
                                                                            </div>
                                                                        );
                                                                    }
                                                                )
                                                              : null}
                                                      </td>
                                                  </tr>
                                              );
                                          }
                                      )
                                    : null}
                            </tbody>
                        </table>
                    </div>
                </div>
                {/* Loading component */}
                {this.state.page_loading ? <Loading /> : ""}
            </Wrapper>
        );
    }
}

export default connect(mapStateToProps)(HODGroupDetails);
