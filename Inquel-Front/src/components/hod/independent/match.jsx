import React, { Component } from "react";
import Wrapper from "../wrapper";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { baseUrl, hodUrl } from "../../../shared/baseUrl.js";
import Loading from "../../common/loader";
import AlertBox from "../../common/alert";

const mapStateToProps = (state) => ({
    subject_name: state.content.subject_name,
    chapter_name: state.content.chapter_name,
    topic_name: state.content.topic_name,
});

class HODSubjectMatch extends Component {
    constructor(props) {
        super(props);
        this.state = {
            match: [],

            errorMsg: "",
            successMsg: "",
            showErrorAlert: false,
            showSuccessAlert: false,
            page_loading: true,
        };
        this.subjectId = this.props.match.params.subjectId;
        this.chapterId = this.props.match.params.chapterId;
        this.topicNum = this.props.match.params.topicNum;
        this.url = baseUrl + hodUrl;
        this.authToken = localStorage.getItem("Authorization");
        this.headers = {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: this.authToken,
        };
    }

    // -------------------------- Load match data --------------------------

    loadMatchData = async (path) => {
        var apiURL =
            path === undefined || path === null
                ? `${this.url}/hod/subject/${this.subjectId}/chapter/${this.chapterId}/${this.topicNum}/match/`
                : path;
        await fetch(apiURL, {
            headers: this.headers,
            method: "GET",
        })
            .then((res) => res.json())
            .then((result) => {
                if (result.sts === true) {
                    let data = [...this.state.match];
                    let response = result.data.results;
                    if (
                        response.match_terms.length !== 0 &&
                        response.match_definition.length !== 0
                    ) {
                        // combines both terms and definition as a single object
                        for (let i = 0; i < response.match_terms.length; i++) {
                            for (
                                let j = 0;
                                j < response.match_definition.length;
                                j++
                            ) {
                                if (
                                    response.match_terms[i].match_id ===
                                    response.match_definition[j].match_id
                                ) {
                                    data.push({
                                        match_id:
                                            response.match_terms[i].match_id,
                                        match_terms:
                                            response.match_terms[i].match_terms,
                                        match_definition:
                                            response.match_definition[j]
                                                .match_definition,
                                    });
                                }
                            }
                        }

                        this.setState(
                            {
                                match: data,
                            },
                            () => {
                                if (result.data.next !== null) {
                                    this.loadMatchData(result.data.next);
                                } else {
                                    this.setState({
                                        page_loading: false,
                                    });
                                }
                            }
                        );
                    } else {
                        this.setState({
                            page_loading: false,
                        });
                    }
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
        window.MathJax.typeset();
    };

    // -------------------------- Lifecycle --------------------------

    componentDidMount = () => {
        document.title = `${this.props.topic_name} : Match - HOD | IQLabs`;

        this.loadMatchData();
    };

    render() {
        return (
            <Wrapper
                header={this.props.subject_name}
                activeLink="dashboard"
                history={this.props.history}
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
                            <Link to={`/hod/subject/${this.subjectId}`}>
                                {this.props.subject_name}
                            </Link>
                        </li>
                        <li className="breadcrumb-item">
                            <Link to="#" onClick={this.props.history.goBack}>
                                {this.props.chapter_name}
                            </Link>
                        </li>
                        <li className="breadcrumb-item active">Match</li>
                    </ol>
                </nav>

                {/* Header area */}
                <h5 className="primary-text mb-4">
                    {`Match - ${this.props.topic_name}`}
                </h5>

                {this.state.match.length !== 0
                    ? this.state.match.map((match, match_index) => {
                          return (
                              <div
                                  className="d-flex align-items-start mb-3"
                                  key={match_index}
                              >
                                  <div
                                      className="bg-white small font-weight-bold-600 rounded-lg shadow-sm text-nowrap user-select-none mr-2"
                                      style={{
                                          paddingTop: "8px",
                                          paddingBottom: "8px",
                                          paddingLeft: "12px",
                                          paddingRight: "12px",
                                      }}
                                  >
                                      {match_index <= 8
                                          ? `0${match_index + 1}`
                                          : match_index + 1}
                                  </div>

                                  <div className="card shadow-sm w-100">
                                      <div className="card-body">
                                          <div className="row">
                                              {/* ----- Terms & Definition ----- */}
                                              <div className="col-md-6 mb-2 mb-md-0">
                                                  <div className="card bg-light">
                                                      <div
                                                          className="card-body py-3"
                                                          dangerouslySetInnerHTML={{
                                                              __html: match.match_terms,
                                                          }}
                                                      ></div>
                                                  </div>
                                              </div>
                                              <div className="col-md-6">
                                                  <div className="card bg-light">
                                                      <div
                                                          className="card-body py-3"
                                                          dangerouslySetInnerHTML={{
                                                              __html: match.match_definition,
                                                          }}
                                                      ></div>
                                                  </div>
                                              </div>
                                          </div>
                                      </div>
                                  </div>
                              </div>
                          );
                      })
                    : "No content to display..."}

                {/* Loading component */}
                {this.state.page_loading ? <Loading /> : ""}
            </Wrapper>
        );
    }
}

export default connect(mapStateToProps)(HODSubjectMatch);
