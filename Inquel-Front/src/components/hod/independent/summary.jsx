import React, { Component, lazy, Suspense } from "react";
import Wrapper from "../wrapper";
import { Link } from "react-router-dom";
import Loading from "../../common/loader";
import AlertBox from "../../common/alert";
import { baseUrl, hodUrl } from "../../../shared/baseUrl.js";
import { connect } from "react-redux";

const DirectPDF = lazy(() => import("../../common/preview/DirectPDF"));

const mapStateToProps = (state) => ({
    subject_name: state.content.subject_name,
    chapter_name: state.content.chapter_name,
});

class HODSubjectSummary extends Component {
    constructor(props) {
        super(props);
        this.state = {
            summaryData: "",

            errorMsg: "",
            successMsg: "",
            showErrorAlert: false,
            showSuccessAlert: false,
            page_loading: true,
        };
        this.subjectId = this.props.match.params.subjectId;
        this.chapterId = this.props.match.params.chapterId;
        this.url = baseUrl + hodUrl;
        this.authToken = localStorage.getItem("Authorization");
        this.headers = {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: this.authToken,
        };
    }

    componentDidMount = () => {
        document.title = `${this.props.chapter_name} : Summary - HOD | IQLabs`;

        this.loadSummaryData();
    };

    // loads summary data
    loadSummaryData = async () => {
        await fetch(
            `${this.url}/hod/subject/${this.subjectId}/chapter/${this.chapterId}/summary/`,
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

                {/* Breadcrumb */}
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
                        <li className="breadcrumb-item active">Summary</li>
                    </ol>
                </nav>

                <div className="card shadow-sm">
                    <div className="card-body">
                        {this.state.summaryData.length !== 0
                            ? this.state.summaryData.map((data, index) => {
                                  return data.direct_question_urls !==
                                      undefined ? (
                                      <div className="text-center" key={index}>
                                          <Suspense
                                              fallback={<div>Loading...</div>}
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
                                      <div key={index}>
                                          <div className="h5 font-weight-bold-600 mb-3">
                                              {data.summary_name}
                                          </div>
                                          <div
                                              dangerouslySetInnerHTML={{
                                                  __html: data.summary_content,
                                              }}
                                          ></div>
                                      </div>
                                  );
                              })
                            : "No content to display..."}
                    </div>
                </div>

                {/* Loading component */}
                {this.state.page_loading ? <Loading /> : ""}
            </Wrapper>
        );
    }
}

export default connect(mapStateToProps)(HODSubjectSummary);
