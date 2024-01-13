import React, { Component, lazy, Suspense } from "react";
import Wrapper from "../wrapper";
import { Tab, Nav } from "react-bootstrap";
import { Link } from "react-router-dom";
import Loading from "../../common/loader";
import AlertBox from "../../common/alert";
import { baseUrl, studentUrl } from "../../../shared/baseUrl.js";
import { connect } from "react-redux";

const DirectPDF = lazy(() => import("../../common/preview/DirectPDF"));

const mapStateToProps = (state) => ({
    subject_data: state.storage.response,
    subject_name: state.content.subject_name,
    chapter_name: state.content.chapter_name,
});

class Summary extends Component {
    constructor(props) {
        super(props);
        this.state = {
            summaryData: "",
            chapterId: this.props.match.params.chapterId,
            chapter_name: this.props.chapter_name,

            errorMsg: "",
            successMsg: "",
            showErrorAlert: false,
            showSuccessAlert: false,
            page_loading: true,
        };
        this.subjectId = this.props.match.params.subjectId;
        this.url = baseUrl + studentUrl;
        this.authToken = localStorage.getItem("Authorization");
        this.headers = {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: this.authToken,
        };
    }

    componentDidMount = () => {
        this.setState(
            {
                chapterId: this.props.match.params.chapterId,
            },
            () => {
                this.loadSummaryData();
            }
        );
    };

    // loads summary data
    loadSummaryData = async () => {
        await fetch(
            `${this.url}/student/subject/${this.subjectId}/chapter/${this.state.chapterId}/summary/`,
            {
                method: "GET",
                headers: this.headers,
            }
        )
            .then((res) => res.json())
            .then((result) => {
                if (result.sts === true) {
                    this.setState({
                        summaryData: result.data,
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
        window.MathJax.typeset();
    };

    // loads data on selecting a chapter
    handleSelect = (index, chapter_name) => {
        this.setState(
            {
                chapterId: index,
                chapter_name: chapter_name,
                page_loading: true,
            },
            () => {
                this.loadSummaryData();
            }
        );
    };

    render() {
        document.title = `${this.state.chapter_name} : Summary - Student | IQLabs`;
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

                {/* Breadcrumb */}
                <nav aria-label="breadcrumb">
                    <ol className="breadcrumb mb-3">
                        <li className="breadcrumb-item">
                            <Link to="/dashboard">
                                <i className="fas fa-home fa-sm"></i>
                            </Link>
                        </li>
                        <li className="breadcrumb-item">
                            <Link to="#" onClick={this.props.history.goBack}>
                                {this.props.subject_name}
                            </Link>
                        </li>
                        <li className="breadcrumb-item active">Summary</li>
                    </ol>
                </nav>

                <div className="card shadow-sm">
                    <div className="card-body">
                        <Tab.Container
                            id="left-tabs-example"
                            defaultActiveKey={this.state.chapterId}
                        >
                            <div className="row">
                                {/* ----- chapter list ----- */}
                                <div className="col-md-3 mb-2 mb-md-0 border-right">
                                    <Nav
                                        variant="pills"
                                        className="flex-column"
                                    >
                                        {this.props.subject_data &&
                                        Object.keys(this.props.subject_data)
                                            .length !== 0
                                            ? (
                                                  this.props.subject_data
                                                      .chapters || []
                                              ).map((data, index) => {
                                                  return (
                                                      <Nav.Item
                                                          className="bg-light grey-item shadow-sm mb-2"
                                                          key={index}
                                                          onClick={() =>
                                                              this.handleSelect(
                                                                  data.chapter_id,
                                                                  data.chapter_name
                                                              )
                                                          }
                                                      >
                                                          <Nav.Link
                                                              eventKey={
                                                                  data.chapter_id
                                                              }
                                                              style={{
                                                                  padding:
                                                                      "12px",
                                                                  cursor: "default",
                                                              }}
                                                          >
                                                              {
                                                                  data.chapter_name
                                                              }
                                                          </Nav.Link>
                                                      </Nav.Item>
                                                  );
                                              })
                                            : null}
                                    </Nav>
                                </div>

                                {/* ----- Summary data ----- */}

                                <div className="col-md-9 pl-md-0">
                                    <Tab.Content>
                                        <Tab.Pane
                                            eventKey={this.state.chapterId}
                                        >
                                            <div className="card">
                                                <div className="card-body py-0">
                                                    {this.state.summaryData &&
                                                    this.state.summaryData
                                                        .length !== 0
                                                        ? this.state.summaryData.map(
                                                              (data, index) => {
                                                                  return data.direct_question_urls !==
                                                                      undefined ? (
                                                                      <div
                                                                          className="text-center"
                                                                          key={
                                                                              index
                                                                          }
                                                                      >
                                                                          <Suspense
                                                                              fallback={
                                                                                  <div>
                                                                                      Loading...
                                                                                  </div>
                                                                              }
                                                                          >
                                                                              <DirectPDF
                                                                                  file_url={
                                                                                      data
                                                                                          .direct_question_urls[0]
                                                                                  }
                                                                              />
                                                                          </Suspense>
                                                                      </div>
                                                                  ) : (
                                                                      <div
                                                                          key={
                                                                              index
                                                                          }
                                                                          className="user-select-none"
                                                                      >
                                                                          <div className="h5 font-weight-bold-600 mb-2">
                                                                              {
                                                                                  data.summary_name
                                                                              }
                                                                          </div>
                                                                          <div
                                                                              dangerouslySetInnerHTML={{
                                                                                  __html: data.summary_content,
                                                                              }}
                                                                          ></div>
                                                                      </div>
                                                                  );
                                                              }
                                                          )
                                                        : "No content to display..."}
                                                </div>
                                            </div>
                                        </Tab.Pane>
                                    </Tab.Content>
                                </div>
                            </div>
                        </Tab.Container>
                    </div>
                </div>

                {/* Loading component */}
                {this.state.page_loading ? <Loading /> : ""}
            </Wrapper>
        );
    }
}

export default connect(mapStateToProps)(Summary);
