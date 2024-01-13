import React, { Component } from "react";
import Wrapper from "../wrapper";
import { Tab, Row, Col, Nav } from "react-bootstrap";
import { Link } from "react-router-dom";
import { baseUrl, hodUrl } from "../../../shared/baseUrl.js";
import Loading from "../../common/loader";
import AlertBox from "../../common/alert";
import { connect } from "react-redux";

const mapStateToProps = (state) => ({
    profile: state.user.profile,
    group_name: state.content.group_name,
});

function EmptyData() {
    return (
        <Nav.Item>
            <Nav.Link eventKey="0">Data not available</Nav.Link>
        </Nav.Item>
    );
}

class HODGroupTeachers extends Component {
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
        document.title = `${this.props.group_name} : Teachers - HOD | IQLabs`;

        fetch(`${this.url}/hod/group/${this.groupId}/teacher/`, {
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

                {/* Filter area */}
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
                        <li className="breadcrumb-item active">Teacher</li>
                    </ol>
                </nav>

                {/* Teacher list */}
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
                                                                {list.full_name !==
                                                                ""
                                                                    ? list.full_name
                                                                    : list.username}
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
                                                    <Tab.Pane
                                                        key={index}
                                                        eventKey={index}
                                                    >
                                                        <div className="card shadow-sm">
                                                            <div className="table-responsive">
                                                                <table className="table">
                                                                    <thead className="secondary-bg primary-text">
                                                                        <tr>
                                                                            <th scope="col">
                                                                                Handling
                                                                                Group
                                                                            </th>
                                                                            <th scope="col">
                                                                                <div className="row">
                                                                                    <div className="col-6">
                                                                                        Handling
                                                                                        Subject
                                                                                    </div>
                                                                                    <div className="col-6">
                                                                                        Handling
                                                                                        Chapters
                                                                                    </div>
                                                                                </div>
                                                                            </th>
                                                                        </tr>
                                                                    </thead>
                                                                    <tbody>
                                                                        {list.handling.map(
                                                                            (
                                                                                item,
                                                                                index
                                                                            ) => {
                                                                                return (
                                                                                    <tr
                                                                                        key={
                                                                                            index
                                                                                        }
                                                                                    >
                                                                                        <td>
                                                                                            {item.group_name ===
                                                                                            "independent"
                                                                                                ? ""
                                                                                                : item.group_name}
                                                                                        </td>
                                                                                        <td>
                                                                                            {item.subjects.map(
                                                                                                (
                                                                                                    subject,
                                                                                                    index
                                                                                                ) => {
                                                                                                    return (
                                                                                                        <div
                                                                                                            className="row"
                                                                                                            key={
                                                                                                                index
                                                                                                            }
                                                                                                        >
                                                                                                            <p className="col-6">
                                                                                                                {
                                                                                                                    subject.subject_name
                                                                                                                }
                                                                                                            </p>
                                                                                                            <div className="col-6">
                                                                                                                {subject.chapters.map(
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
                                                                            }
                                                                        )}
                                                                    </tbody>
                                                                </table>
                                                            </div>
                                                        </div>
                                                    </Tab.Pane>
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

export default connect(mapStateToProps)(HODGroupTeachers);
