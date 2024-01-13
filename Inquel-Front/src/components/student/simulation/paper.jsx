import React, { Component } from "react";
import Header from "../shared/examNavbar";
import { baseUrl, studentUrl } from "../../../shared/baseUrl.js";
import AlertBox from "../../common/alert";
import Loading from "../../common/loader";
import { batch, connect } from "react-redux";
import { Link } from "react-router-dom";
import storeDispatch from "../../../redux/dispatch";
import { PAPER, TEMP } from "../../../redux/action";

const mapStateToProps = (state) => ({
    course_name: state.content.course_name,
    simulation_name: state.content.simulation_name,
});

class SimulationExam extends Component {
    constructor(props) {
        super(props);
        this.state = {
            simulation_data: [],

            errorMsg: "",
            successMsg: "",
            showErrorAlert: false,
            showSuccessAlert: false,
            page_loading: true,
        };
        this.subscriptionId = this.props.match.params.subscriptionId;
        this.courseId = this.props.match.params.courseId;
        this.simulationId = this.props.match.params.simulationId;
        this.url = baseUrl + studentUrl;
        this.authToken = localStorage.getItem("Authorization");
        this.headers = {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: this.authToken,
        };
    }

    componentDidMount = () => {
        document.title = `${this.props.simulation_name} - Student | IQLabs`;

        this.loadSimulationData();
    };

    loadSimulationData = () => {
        fetch(
            `${this.url}/student/sub/${this.subscriptionId}/course/${this.courseId}/simulation/${this.simulationId}/`,
            {
                method: "GET",
                headers: this.headers,
            }
        )
            .then((res) => res.json())
            .then((result) => {
                if (result.sts === true) {
                    this.setState({
                        simulation_data: result.data,
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
                    errorMsg: "Cannot load simulation data at the moment!",
                    showErrorAlert: true,
                    page_loading: false,
                });
            });
    };

    render() {
        return (
            <>
                {/* Navbar */}
                <Header
                    name={this.props.course_name}
                    chapter_name=""
                    goBack={this.props.history.goBack}
                />

                {/* ALert message */}
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

                <div className="exam-section">
                    {/* ----- Section details ----- */}
                    <div className="container">
                        <div className="font-weight-bold-600 primary-text mb-3">
                            {this.props.simulation_name}
                        </div>

                        <div className="card card-body secondary-bg shadow-sm mb-3">
                            <div className="row align-items-center font-weight-bold-600 small">
                                <div className="col-md-4 text-center text-md-left font-weight-bold mb-2 mb-md-0">
                                    Paper description
                                </div>
                                <div className="col-md-7">
                                    <div className="row align-items-center">
                                        <div className="col-3">Type</div>
                                        <div className="col-3">Sections</div>
                                        <div className="col-3">Duration</div>
                                        <div className="col-3">Total marks</div>
                                    </div>
                                </div>
                                <div className="col-md-1"></div>
                            </div>
                        </div>

                        {this.state.simulation_data &&
                        this.state.simulation_data.length !== 0
                            ? (this.state.simulation_data || []).map(
                                  (list, index) => {
                                      return (
                                          <div
                                              className="card card-body light-bg shadow-sm p-3 mb-2"
                                              key={index}
                                          >
                                              <div className="row align-items-center small">
                                                  <div className="col-md-4 text-center text-md-left font-weight-bold-600 mb-2 mb-md-0">
                                                      {list.paper_name}
                                                  </div>
                                                  <div className="col-md-7 mb-2 mb-md-0">
                                                      <div className="row">
                                                          <div className="col-3">
                                                              {list.paper_type}
                                                          </div>
                                                          <div className="col-3">
                                                              {list.sections}{" "}
                                                              Sections
                                                          </div>
                                                          <div className="col-3">
                                                              {
                                                                  list.time_duration
                                                              }{" "}
                                                              mins
                                                          </div>
                                                          <div className="col-3">
                                                              {list.total_marks}{" "}
                                                              marks
                                                          </div>
                                                      </div>
                                                  </div>
                                                  <div className="col-md-1 text-center text-md-right">
                                                      <Link
                                                          to={`${this.props.match.url}/paper/${list.paper_id}`}
                                                      >
                                                          <button
                                                              className="btn btn-primary btn-sm shadow-none"
                                                              onClick={() =>
                                                                  batch(() => {
                                                                      storeDispatch(
                                                                          PAPER,
                                                                          list.paper_name
                                                                      );
                                                                      storeDispatch(
                                                                          TEMP,
                                                                          list
                                                                      );
                                                                  })
                                                              }
                                                          >
                                                              Proceed
                                                          </button>
                                                      </Link>
                                                  </div>
                                              </div>
                                          </div>
                                      );
                                  }
                              )
                            : ""}
                    </div>
                </div>

                {/* Loading component */}
                {this.state.page_loading ? <Loading /> : ""}
            </>
        );
    }
}

export default connect(mapStateToProps)(SimulationExam);
