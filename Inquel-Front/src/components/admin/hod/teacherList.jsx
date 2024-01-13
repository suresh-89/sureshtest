import React, { Component } from "react";
import Wrapper from "../wrapper";
import profilepic from "../../../assets/user-v1.png";
import { Tab, Row, Col, Nav, Badge } from "react-bootstrap";
import { Link } from "react-router-dom";
import { baseUrl, adminPathUrl } from "../../../shared/baseUrl";
import Loading from "../../common/loader";
import AlertBox from "../../common/alert";
import { connect } from "react-redux";

const mapStateToProps = (state) => ({
    hod_data: state.storage.temp,
});

function EmptyData() {
    return (
        <Nav.Item>
            <Nav.Link eventKey="0">Data not available</Nav.Link>
        </Nav.Item>
    );
}

const TeacherInfoSection = (props) => {
    return (
        <Tab.Pane eventKey={props.index}>
            <div className="card shadow-sm">
                <div className="table-responsive">
                    <table className="table">
                        <thead className="secondary-bg primary-text">
                            <tr>
                                <th scope="col">Handling Group</th>
                                <th scope="col">
                                    <div className="row">
                                        <div className="col-6">
                                            Handling Subject
                                        </div>
                                        <div className="col-6">
                                            Handling Chapters
                                        </div>
                                    </div>
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {(props.list.handling || []).map((item, index) => {
                                return (
                                    <tr key={index}>
                                        <td>
                                            {item.group_name === "independent"
                                                ? ""
                                                : item.group_name}
                                        </td>
                                        <td>
                                            {(item.subjects || []).map(
                                                (subject, index) => {
                                                    return (
                                                        <div
                                                            className="row"
                                                            key={index}
                                                        >
                                                            <p className="col-6">
                                                                {
                                                                    subject.subject_name
                                                                }
                                                            </p>
                                                            <div className="col-6">
                                                                {(
                                                                    subject.chapters ||
                                                                    []
                                                                ).map(
                                                                    (
                                                                        chapter,
                                                                        index
                                                                    ) => {
                                                                        return (
                                                                            <p
                                                                                key={
                                                                                    index
                                                                                }
                                                                            >
                                                                                {
                                                                                    chapter.chapter_name
                                                                                }
                                                                            </p>
                                                                        );
                                                                    }
                                                                )}
                                                            </div>
                                                        </div>
                                                    );
                                                }
                                            )}
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>
        </Tab.Pane>
    );
};

class AdminHodTeacherList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            teacherItems: [],

            errorMsg: "",
            successMsg: "",
            showErrorAlert: false,
            showSuccessAlert: false,
            page_loading: true,
        };
        this.hodId = this.props.match.params.hodId;
        this.url = baseUrl + adminPathUrl;
        this.authToken = localStorage.getItem("Inquel-Auth");
        this.headers = {
            Accept: "application/json",
            "Content-Type": "application/json",
            "Inquel-Auth": this.authToken,
        };
    }

    componentDidMount = () => {
        document.title = "Teacher Profile - Admin | IQLabs";

        fetch(`${this.url}/hod/${this.hodId}/teacher/`, {
            headers: this.headers,
            method: "GET",
        })
            .then((res) => res.json())
            .then((result) => {
                if (result.sts === true) {
                    this.setState({
                        teacherItems: result.data.results,
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
                history={this.props.history}
                header="Teacher List"
                activeLink="profiles"
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
                            <Link to="/admin">
                                <i className="fas fa-home fa-sm"></i>
                            </Link>
                        </li>
                        <li className="breadcrumb-item">
                            <Link to="#" onClick={this.props.history.goBack}>
                                HOD
                            </Link>
                        </li>
                        <li className="breadcrumb-item active">Teacher</li>
                    </ol>
                </nav>

                {/* HOD Details */}
                <div className="row align-items-center mb-4">
                    <div className="col-md-6">
                        <div className="d-flex align-items-center">
                            <img
                                src={
                                    this.props.hod_data &&
                                    Object.keys(this.props.hod_data).length !==
                                        0
                                        ? this.props.hod_data.profile_link !==
                                          null
                                            ? this.props.hod_data.profile_link
                                            : profilepic
                                        : profilepic
                                }
                                alt={this.props.hod_data.full_name}
                                className="square-img-sm"
                            />
                            <div className="ml-3">
                                <h5 className="primary-text">
                                    {this.props.hod_data &&
                                    Object.keys(this.props.hod_data).length !==
                                        0
                                        ? this.props.hod_data.full_name !== ""
                                            ? this.props.hod_data.full_name
                                            : this.props.hod_data.username
                                        : ""}
                                </h5>
                                <p className="mb-0">
                                    {this.props.hod_data &&
                                    Object.keys(this.props.hod_data).length !==
                                        0 ? (
                                        this.props.hod_data.is_active ? (
                                            <Badge variant="success">
                                                Active
                                            </Badge>
                                        ) : (
                                            <Badge variant="danger">
                                                Not active
                                            </Badge>
                                        )
                                    ) : (
                                        ""
                                    )}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Teachers list */}
                <div className="card shadow-sm">
                    <div className="card-body">
                        <Tab.Container
                            id="left-tabs-example"
                            defaultActiveKey="0"
                        >
                            <Row>
                                <Col sm={3} className="mb-3 mb-md-0">
                                    <Nav
                                        variant="pills"
                                        className="flex-column"
                                    >
                                        {this.state.teacherItems.length !==
                                        0 ? (
                                            this.state.teacherItems.map(
                                                (list, index) => {
                                                    return (
                                                        <Nav.Item key={index}>
                                                            <Nav.Link
                                                                eventKey={index}
                                                            >
                                                                {list.full_name
                                                                    ? list.full_name
                                                                    : "No name"}
                                                            </Nav.Link>
                                                        </Nav.Item>
                                                    );
                                                }
                                            )
                                        ) : (
                                            <EmptyData />
                                        )}
                                    </Nav>
                                </Col>
                                <Col sm={9}>
                                    <Tab.Content>
                                        {this.state.teacherItems.map(
                                            (list, index) => {
                                                return (
                                                    <TeacherInfoSection
                                                        key={index}
                                                        list={list}
                                                        index={index}
                                                    />
                                                );
                                            }
                                        )}
                                    </Tab.Content>
                                </Col>
                            </Row>
                        </Tab.Container>
                    </div>
                </div>

                {/* Loading component */}
                {this.state.page_loading ? <Loading /> : ""}
            </Wrapper>
        );
    }
}

export default connect(mapStateToProps)(AdminHodTeacherList);
