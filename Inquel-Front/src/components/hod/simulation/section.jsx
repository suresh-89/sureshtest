import React, { Component } from "react";
import Wrapper from "../wrapper";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { Dropdown } from "react-bootstrap";
import { baseUrl, hodUrl } from "../../../shared/baseUrl.js";
import Loading from "../../common/loader";
import AlertBox from "../../common/alert";
import storeDispatch from "../../../redux/dispatch";
import { SECTION, TEMP } from "../../../redux/action";

const mapStateToProps = (state) => ({
    subject_name: state.content.subject_name,
    simulation_name: state.content.simulation_name,
    paper_name: state.content.paper_name,
    profile: state.user.profile,
});

class HODSimulationSection extends Component {
    constructor(props) {
        super(props);
        this.state = {
            sections: [
                {
                    section_id: "",
                    section_name: "",
                    question_type: "",
                    category: "",
                    total_questions: "",
                    any_questions: "",
                    marks: "",
                },
            ],
            filters: {},

            errorMsg: "",
            successMsg: "",
            showErrorAlert: false,
            showSuccessAlert: false,
            page_loading: true,
        };
        this.subjectId = this.props.match.params.subjectId;
        this.simulationId = this.props.match.params.simulationId;
        this.paperId = this.props.match.params.paperId;
        this.url = baseUrl + hodUrl;
        this.authToken = localStorage.getItem("Authorization");
        this.headers = {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: this.authToken,
        };
    }

    // loads filters data
    loadFilterData = () => {
        fetch(
            `${this.url}/hod/subject/${this.subjectId}/simulation/${this.simulationId}/paper/filters/`,
            {
                method: "GET",
                headers: this.headers,
            }
        )
            .then((res) => res.json())
            .then((result) => {
                if (result.sts === true) {
                    this.setState({
                        filters: result.data,
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

    loadSectionData = () => {
        fetch(
            `${this.url}/hod/subject/${this.subjectId}/simulation/${this.simulationId}/paper/${this.paperId}/`,
            {
                method: "GET",
                headers: this.headers,
            }
        )
            .then((res) => res.json())
            .then((result) => {
                if (result.sts === true) {
                    if (result.data.length !== 0) {
                        let section = [];
                        for (let i = 0; i < result.data.length; i++) {
                            section.push({
                                section_id: result.data[i].section_id,
                                section_name: result.data[i].section_name,
                                question_type: result.data[i].question_type,
                                category: result.data[i].category,
                                total_questions: result.data[i].total_questions,
                                any_questions: result.data[i].any_questions,
                                marks: result.data[i].marks,
                            });
                        }
                        this.setState({
                            sections: section,
                            page_loading: false,
                        });
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
    };

    componentDidMount = () => {
        document.title = `${this.props.paper_name} - HOD | IQLabs`;

        this.loadFilterData();
        this.loadSectionData();
    };

    handleInput = (index, event, type) => {
        let section = [...this.state.sections];
        if (type === "name") {
            section[index].section_name = event.target.value;
        } else if (type === "questions") {
            section[index].total_questions = event.target.value;
        } else if (type === "any_questions") {
            section[index].any_questions = event.target.value;
        } else if (type === "marks") {
            section[index].marks = event.target.value;
        }

        this.setState({
            sections: section,
        });
    };

    handleType = (index, event) => {
        let section = [...this.state.sections];
        section[index].question_type = event.target.value;
        section[index].category = "";

        this.setState({
            sections: section,
        });
    };

    handleCategory = (index, event) => {
        let section = [...this.state.sections];
        section[index].category = event.target.value;

        this.setState({
            sections: section,
        });
    };

    handleSubmit = (index, event) => {
        event.preventDefault();

        this.setState({
            showErrorAlert: false,
            showSuccessAlert: false,
            page_loading: true,
        });

        const section = [...this.state.sections];

        if (section[index].section_name === "") {
            this.setState({
                errorMsg: "Enter the section name",
                showErrorAlert: true,
                page_loading: false,
            });
        } else if (section[index].question_type === "") {
            this.setState({
                errorMsg: "Select a question type",
                showErrorAlert: true,
                page_loading: false,
            });
        } else if (section[index].category === "") {
            this.setState({
                errorMsg: "Select a category",
                showErrorAlert: true,
                page_loading: false,
            });
        } else if (section[index].marks === "") {
            this.setState({
                errorMsg: "Enter marks",
                showErrorAlert: true,
                page_loading: false,
            });
        } else if (section[index].total_questions === "") {
            this.setState({
                errorMsg: "Enter total questions",
                showErrorAlert: true,
                page_loading: false,
            });
        } else if (section[index].any_questions === "") {
            this.setState({
                errorMsg: "Enter any questions",
                showErrorAlert: true,
                page_loading: false,
            });
        } else {
            if (section[index].section_id === "") {
                this.handlePOST(section, index);
            } else {
                this.handlePATCH(section, index);
            }
        }
    };

    handlePOST = (section, index) => {
        fetch(
            `${this.url}/hod/subject/${this.subjectId}/simulation/${this.simulationId}/paper/${this.paperId}/`,
            {
                method: "POST",
                headers: this.headers,
                body: JSON.stringify({
                    section_name: section[index].section_name,
                    question_type: section[index].question_type,
                    category: section[index].category,
                    total_questions: Number(section[index].total_questions),
                    any_questions: Number(section[index].any_questions),
                    marks: Number(section[index].marks),
                }),
            }
        )
            .then((res) => res.json())
            .then((result) => {
                if (result.sts === true) {
                    this.setState({
                        successMsg: result.msg,
                        showSuccessAlert: true,
                    });
                    this.setState(
                        {
                            page_loading: true,
                        },
                        () => {
                            this.loadSectionData();
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

    handlePATCH = (section, index) => {
        fetch(
            `${this.url}/hod/subject/${this.subjectId}/simulation/${this.simulationId}/paper/${this.paperId}/`,
            {
                method: "PATCH",
                headers: this.headers,
                body: JSON.stringify({
                    section_id: section[index].section_id,
                    section_name: section[index].section_name,
                    question_type: section[index].question_type,
                    category: section[index].category,
                    total_questions: Number(section[index].total_questions),
                    any_questions: Number(section[index].any_questions),
                    marks: Number(section[index].marks),
                }),
            }
        )
            .then((res) => res.json())
            .then((result) => {
                if (result.sts === true) {
                    this.setState(
                        {
                            successMsg: result.msg,
                            showSuccessAlert: true,
                        },
                        () => {
                            this.loadSectionData();
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

    handleAdd = () => {
        let sections = [...this.state.sections];
        sections.push({
            section_id: "",
            section_name: "",
            question_type: "",
            category: "",
            total_questions: "",
            any_questions: "",
            marks: "",
        });
        this.setState({
            sections: sections,
        });
    };

    handleDelete = (index, section_id) => {
        this.setState({
            showSuccessAlert: false,
            showErrorAlert: false,
            showLoader: true,
        });

        if (section_id !== "") {
            fetch(
                `${this.url}/hod/subject/${this.subjectId}/simulation/${this.simulationId}/paper/${this.paperId}/`,
                {
                    method: "DELETE",
                    headers: this.headers,
                    body: JSON.stringify({
                        section_id: section_id,
                    }),
                }
            )
                .then((res) => res.json())
                .then((result) => {
                    if (result.sts === true) {
                        this.setState({
                            successMsg: result.msg,
                            showSuccessAlert: true,
                            showLoader: true,
                        });

                        const sections = [...this.state.sections];
                        sections.splice(index, 1);
                        this.setState(
                            {
                                sections: sections,
                            },
                            () => {
                                if (this.state.sections.length === 0) {
                                    sections.push({
                                        section_id: "",
                                        section_name: "",
                                        question_type: "",
                                        category: "",
                                        total_questions: "",
                                        any_questions: "",
                                        marks: "",
                                    });
                                    this.setState({
                                        sections: sections,
                                    });
                                }
                            }
                        );
                    } else {
                        this.setState({
                            errorMsg: result.msg,
                            showErrorAlert: true,
                            showLoader: false,
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
        } else {
            const sections = [...this.state.sections];
            sections.splice(index, 1);
            this.setState(
                {
                    sections: sections,
                },
                () => {
                    if (this.state.sections.length === 0) {
                        sections.push({
                            section_id: "",
                            section_name: "",
                            question_type: "",
                            category: "",
                            total_questions: "",
                            any_questions: "",
                            marks: "",
                        });
                        this.setState({
                            sections: sections,
                        });
                    }
                }
            );
        }
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
                                {this.props.simulation_name}
                            </Link>
                        </li>
                        <li className="breadcrumb-item active">
                            {this.props.paper_name}
                        </li>
                    </ol>
                </nav>

                <div
                    className="card shadow-sm mb-3"
                    style={{ overflowX: "auto" }}
                >
                    <div
                        className="table-responsive"
                        style={{ minWidth: "1000px" }}
                    >
                        <table className="table table-hover">
                            <thead className="primary-bg text-white">
                                <tr style={{ whiteSpace: "nowrap" }}>
                                    <th scope="col">Section Description</th>
                                    <th scope="col">Question Type</th>
                                    <th scope="col">Category</th>
                                    <th scope="col">Total Questions</th>
                                    <th scope="col">Any Questions</th>
                                    <th scope="col">Marks</th>
                                    <th scope="col">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {this.state.sections.length !== 0
                                    ? this.state.sections.map(
                                          (section, index) => {
                                              return (
                                                  <tr key={index}>
                                                      <td>
                                                          <input
                                                              type="text"
                                                              className="form-control form-control-sm border-secondary"
                                                              placeholder={`Section Description ${
                                                                  index + 1
                                                              }`}
                                                              value={
                                                                  section.section_name
                                                              }
                                                              onChange={(
                                                                  event
                                                              ) =>
                                                                  this.handleInput(
                                                                      index,
                                                                      event,
                                                                      "name"
                                                                  )
                                                              }
                                                              required
                                                          />
                                                      </td>
                                                      <td>
                                                          <select
                                                              name="type"
                                                              id="type"
                                                              className="form-control form-control-sm border-secondary"
                                                              onChange={(
                                                                  event
                                                              ) =>
                                                                  this.handleType(
                                                                      index,
                                                                      event
                                                                  )
                                                              }
                                                              value={
                                                                  section.question_type
                                                              }
                                                              required
                                                          >
                                                              <option value="">
                                                                  Select type
                                                              </option>
                                                              {Object.entries(
                                                                  this.state
                                                                      .filters
                                                              ).length !== 0
                                                                  ? Object.entries(
                                                                        this
                                                                            .state
                                                                            .filters
                                                                    ).map(
                                                                        (
                                                                            [
                                                                                key,
                                                                                value,
                                                                            ],
                                                                            q_index
                                                                        ) => {
                                                                            return key !==
                                                                                "attempts" ? (
                                                                                key ===
                                                                                "type_1" ? (
                                                                                    this
                                                                                        .props
                                                                                        .profile
                                                                                        .permissions ? (
                                                                                        this
                                                                                            .props
                                                                                            .profile
                                                                                            .permissions
                                                                                            .type_1_q ? (
                                                                                            <option
                                                                                                value={
                                                                                                    key
                                                                                                }
                                                                                                key={
                                                                                                    q_index
                                                                                                }
                                                                                            >
                                                                                                Type
                                                                                                1
                                                                                            </option>
                                                                                        ) : null
                                                                                    ) : null
                                                                                ) : key ===
                                                                                  "type_2" ? (
                                                                                    this
                                                                                        .props
                                                                                        .profile
                                                                                        .permissions ? (
                                                                                        this
                                                                                            .props
                                                                                            .profile
                                                                                            .permissions
                                                                                            .type_2_q ? (
                                                                                            <option
                                                                                                value={
                                                                                                    key
                                                                                                }
                                                                                                key={
                                                                                                    q_index
                                                                                                }
                                                                                            >
                                                                                                Type
                                                                                                2
                                                                                            </option>
                                                                                        ) : null
                                                                                    ) : null
                                                                                ) : null
                                                                            ) : null;
                                                                        }
                                                                    )
                                                                  : null}
                                                          </select>
                                                      </td>
                                                      <td>
                                                          <select
                                                              name="category"
                                                              className="form-control form-control-sm border-secondary"
                                                              onChange={(
                                                                  event
                                                              ) =>
                                                                  this.handleCategory(
                                                                      index,
                                                                      event
                                                                  )
                                                              }
                                                              value={
                                                                  section.category
                                                              }
                                                              disabled={
                                                                  section.question_type ===
                                                                  ""
                                                                      ? true
                                                                      : false
                                                              }
                                                              required
                                                          >
                                                              <option value="">
                                                                  Select
                                                                  category
                                                              </option>
                                                              {Object.entries(
                                                                  this.state
                                                                      .filters
                                                              ).length !== 0
                                                                  ? this.state
                                                                        .filters[
                                                                        section
                                                                            .question_type
                                                                    ] !==
                                                                    undefined
                                                                      ? this.state.filters[
                                                                            section
                                                                                .question_type
                                                                        ].category.map(
                                                                            (
                                                                                data,
                                                                                c_index
                                                                            ) => {
                                                                                return (
                                                                                    <option
                                                                                        value={
                                                                                            data ||
                                                                                            ""
                                                                                        }
                                                                                        key={
                                                                                            c_index
                                                                                        }
                                                                                    >
                                                                                        {
                                                                                            data
                                                                                        }
                                                                                    </option>
                                                                                );
                                                                            }
                                                                        )
                                                                      : null
                                                                  : null}
                                                          </select>
                                                      </td>
                                                      <td>
                                                          <input
                                                              className="form-control form-control-sm border-secondary"
                                                              type="text"
                                                              value={
                                                                  section.total_questions
                                                              }
                                                              onChange={(
                                                                  event
                                                              ) =>
                                                                  this.handleInput(
                                                                      index,
                                                                      event,
                                                                      "questions"
                                                                  )
                                                              }
                                                              placeholder="Enter total questions"
                                                          />
                                                      </td>
                                                      <td>
                                                          <input
                                                              className="form-control form-control-sm border-secondary"
                                                              type="text"
                                                              value={
                                                                  section.any_questions ||
                                                                  ""
                                                              }
                                                              onChange={(
                                                                  event
                                                              ) =>
                                                                  this.handleInput(
                                                                      index,
                                                                      event,
                                                                      "any_questions"
                                                                  )
                                                              }
                                                              placeholder="Enter any questions"
                                                          />
                                                      </td>
                                                      <td>
                                                          <input
                                                              className="form-control form-control-sm border-secondary"
                                                              type="text"
                                                              value={
                                                                  section.marks
                                                              }
                                                              onChange={(
                                                                  event
                                                              ) =>
                                                                  this.handleInput(
                                                                      index,
                                                                      event,
                                                                      "marks"
                                                                  )
                                                              }
                                                              placeholder="Enter marks"
                                                          />
                                                      </td>
                                                      <td className="d-flex justify-content-end">
                                                          {section.section_id !==
                                                          "" ? (
                                                              <Link
                                                                  to={`${
                                                                      this.props
                                                                          .match
                                                                          .url
                                                                  }/section/${
                                                                      section.section_id
                                                                  }/${
                                                                      section.question_type ===
                                                                      "type_1"
                                                                          ? "type1"
                                                                          : "type2"
                                                                  }`}
                                                              >
                                                                  <button
                                                                      className="btn btn-primary-invert btn-sm shadow-sm"
                                                                      onClick={() => {
                                                                          storeDispatch(
                                                                              SECTION,
                                                                              section.section_name
                                                                          );
                                                                          storeDispatch(
                                                                              TEMP,
                                                                              section
                                                                          );
                                                                      }}
                                                                  >
                                                                      Add+
                                                                  </button>
                                                              </Link>
                                                          ) : null}

                                                          <Dropdown>
                                                              <Dropdown.Toggle
                                                                  variant="white"
                                                                  className="btn btn-link btn-sm shadow-none caret-off ml-2"
                                                              >
                                                                  <i className="fas fa-ellipsis-v"></i>
                                                              </Dropdown.Toggle>

                                                              <Dropdown.Menu
                                                                  className={`${
                                                                      this.state
                                                                          .sections
                                                                          .length <=
                                                                      2
                                                                          ? "position-fixed"
                                                                          : "position-absolute"
                                                                  }`}
                                                              >
                                                                  <Dropdown.Item
                                                                      onClick={(
                                                                          event
                                                                      ) =>
                                                                          this.handleSubmit(
                                                                              index,
                                                                              event
                                                                          )
                                                                      }
                                                                  >
                                                                      <i className="far fa-save fa-sm mr-1"></i>{" "}
                                                                      Save
                                                                  </Dropdown.Item>
                                                                  <Dropdown.Item
                                                                      onClick={() =>
                                                                          this.handleDelete(
                                                                              index,
                                                                              section.section_id
                                                                          )
                                                                      }
                                                                  >
                                                                      <i className="far fa-trash-alt fa-sm mr-1"></i>{" "}
                                                                      Delete
                                                                  </Dropdown.Item>
                                                              </Dropdown.Menu>
                                                          </Dropdown>
                                                      </td>
                                                  </tr>
                                              );
                                          }
                                      )
                                    : ""}
                            </tbody>
                        </table>
                    </div>
                </div>

                <button
                    className="btn btn-light bg-white btn-block shadow-sm shadow-none"
                    onClick={this.handleAdd}
                >
                    Add Section +
                </button>

                {/* Loading component */}
                {this.state.page_loading ? <Loading /> : ""}
            </Wrapper>
        );
    }
}

export default connect(mapStateToProps)(HODSimulationSection);
