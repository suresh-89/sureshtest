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
    course_data: state.storage.response,
    course_name: state.content.course_name,
    chapter_name: state.content.chapter_name,
});

class CourseSummary extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: this.props.course_data.units,
            summaryData: "",
            chapterId: this.props.match.params.chapterId,
            chapter_name: this.props.chapter_name,

            errorMsg: "",
            successMsg: "",
            showErrorAlert: false,
            showSuccessAlert: false,
            page_loading: true,
        };
        this.subscriptionId = this.props.match.params.subscriptionId;
        this.courseId = this.props.match.params.courseId;
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
            `${this.url}/student/sub/${this.subscriptionId}/course/${this.courseId}/chapter/${this.state.chapterId}/summary/`,
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
                header={this.props.course_name}
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
                            <Link to="/hod">
                                <i className="fas fa-home fa-sm"></i>
                            </Link>
                        </li>
                        <li className="breadcrumb-item">
                            <Link to="#" onClick={this.props.history.goBack}>
                                {this.props.course_name}
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
                                    {this.state.data.length !== 0
                                        ? this.state.data.map(
                                              (unit, unit_index) => {
                                                  return (
                                                      <fieldset
                                                          className="border-secondary mb-2"
                                                          key={unit_index}
                                                      >
                                                          <legend className="text-secondary border-secondary">
                                                              {unit.unit_name}
                                                          </legend>
                                                          {/* ----- Chapter list ----- */}
                                                          <Nav
                                                              variant="pills"
                                                              className="flex-column"
                                                          >
                                                              {(
                                                                  unit.chapters ||
                                                                  []
                                                              ).map(
                                                                  (
                                                                      chapter,
                                                                      chapter_index
                                                                  ) => {
                                                                      return (
                                                                          <Nav.Item
                                                                              className="bg-light grey-item shadow-sm mb-2"
                                                                              key={
                                                                                  chapter_index
                                                                              }
                                                                              onClick={() =>
                                                                                  this.handleSelect(
                                                                                      chapter.chapter_id,
                                                                                      chapter.chapter_name
                                                                                  )
                                                                              }
                                                                          >
                                                                              <Nav.Link
                                                                                  eventKey={
                                                                                      chapter.chapter_id
                                                                                  }
                                                                                  style={{
                                                                                      padding:
                                                                                          "12px",
                                                                                  }}
                                                                              >
                                                                                  {
                                                                                      chapter.chapter_name
                                                                                  }
                                                                              </Nav.Link>
                                                                          </Nav.Item>
                                                                      );
                                                                  }
                                                              )}
                                                          </Nav>
                                                      </fieldset>
                                                  );
                                              }
                                          )
                                        : ""}
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
                                                                          <div className="h5 font-weight-bold-600 mb-3">
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

export default connect(mapStateToProps)(CourseSummary);
