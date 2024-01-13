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
    subject_name: state.content.subject_name,
});

class HODGroupSubject extends Component {
    constructor(props) {
        super(props);
        this.state = {
            chapters: [],
            semesters: [],

            errorMsg: "",
            successMsg: "",
            showErrorAlert: false,
            showSuccessAlert: false,
            page_loading: true,
        };
        this.groupId = this.props.match.params.groupId;
        this.subjectId = this.props.match.params.subjectId;
        this.url = baseUrl + hodUrl;
        this.authToken = localStorage.getItem("Authorization");
        this.headers = {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: this.authToken,
        };
    }

    componentDidMount = () => {
        document.title = this.props.subject_name + " - HOD | IQLabs";

        this.loadSubjectData();
    };

    loadSubjectData = () => {
        fetch(`${this.url}/hod/subject/${this.subjectId}/chapters/`, {
            headers: this.headers,
            method: "GET",
        })
            .then((res) => res.json())
            .then((result) => {
                if (result.sts === true) {
                    this.setState({
                        chapters: result.data.chapters,
                        semesters: result.data.semesters,
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

                {/* ----- Breadcrumb ----- */}
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
                        <li className="breadcrumb-item active">
                            <span>Subject:</span>
                            {this.props.subject_name}
                        </li>
                    </ol>
                </nav>

                <div className="card shadow-sm">
                    <div className="table-responsive">
                        <table className="table">
                            <thead className="secondary-bg">
                                <tr>
                                    <th scope="col">Course structure</th>
                                    <th scope="col">Status</th>
                                    <th scope="col">Teacher assigned</th>
                                </tr>
                            </thead>
                            <tbody>
                                {this.state.chapters.length !== 0
                                    ? this.state.chapters.map((list, index) => {
                                          return (
                                              <tr key={index}>
                                                  <td>{list.chapter_name}</td>
                                                  <td>
                                                      {list.chapter_status.toLowerCase() ===
                                                      "yet to start" ? (
                                                          <span className="text-danger text-capitalize">
                                                              {
                                                                  list.chapter_status
                                                              }
                                                          </span>
                                                      ) : list.chapter_status.toLowerCase() ===
                                                        "in progress" ? (
                                                          <span className="text-warning text-capitalize">
                                                              {
                                                                  list.chapter_status
                                                              }
                                                          </span>
                                                      ) : list.chapter_status.toLowerCase() ===
                                                        "review" ? (
                                                          <span className="text-primary text-capitalize">
                                                              {
                                                                  list.chapter_status
                                                              }
                                                          </span>
                                                      ) : list.chapter_status.toLowerCase() ===
                                                        "ready for review" ? (
                                                          <span className="text-primary text-capitalize">
                                                              {
                                                                  list.chapter_status
                                                              }
                                                          </span>
                                                      ) : list.chapter_status.toLowerCase() ===
                                                        "approved" ? (
                                                          <span className="text-success text-capitalize">
                                                              {
                                                                  list.chapter_status
                                                              }
                                                          </span>
                                                      ) : list.chapter_status.toLowerCase() ===
                                                        "published to group" ? (
                                                          <span className="text-success text-capitalize">
                                                              {
                                                                  list.chapter_status
                                                              }
                                                          </span>
                                                      ) : (
                                                          list.chapter_status
                                                      )}
                                                  </td>
                                                  <td>
                                                      {list.teacher.full_name}
                                                  </td>
                                              </tr>
                                          );
                                      })
                                    : null}
                                {/* Semester list */}
                                {this.state.semesters.length !== 0
                                    ? this.state.semesters.map(
                                          (list, index) => {
                                              return (
                                                  <tr key={index}>
                                                      <td>
                                                          {list.semester_name}
                                                      </td>
                                                      <td></td>
                                                      <td></td>
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

export default connect(mapStateToProps)(HODGroupSubject);
