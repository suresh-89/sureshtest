import React, { Component } from "react";
import Wrapper from "./wrapper";
import { Link } from "react-router-dom";
import profilepic from "../../assets/user-v1.png";
import { Badge } from "react-bootstrap";
import { baseUrl, adminPathUrl } from "../../shared/baseUrl";
import Loading from "../common/loader";
import AlertBox from "../common/alert";
import dateFormat from "dateformat";
import StudentSubscriptionTable from "../common/table/student_subscription";

class AdminStudentProfile extends Component {
    constructor(props) {
        super(props);
        this.state = {
            studentItems: [],

            errorMsg: "",
            successMsg: "",
            showErrorAlert: false,
            showSuccessAlert: false,
            page_loading: true,
        };
        this.hodId = this.props.match.params.hodId;
        this.studentId = this.props.match.params.studentId;
        this.url = baseUrl + adminPathUrl;
        this.authToken = localStorage.getItem("Inquel-Auth");
        this.headers = {
            Accept: "application/json",
            "Content-Type": "application/json",
            "Inquel-Auth": this.authToken,
        };
    }

    componentDidMount = () => {
        document.title = "Student Profile - Admin | IQLabs";

        fetch(
            this.hodId
                ? `${this.url}/hod/${this.hodId}/student/${this.studentId}/`
                : `${this.url}/student/${this.studentId}/`,
            {
                headers: this.headers,
                method: "GET",
            }
        )
            .then((res) => res.json())
            .then((result) => {
                if (result.sts === true) {
                    this.setState({
                        studentItems: result.data,
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
                header="Student Profile"
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
                        {this.hodId ? (
                            <li className="breadcrumb-item">
                                <Link to={`/admin/hod/${this.hodId}`}>HOD</Link>
                            </li>
                        ) : (
                            ""
                        )}
                        <li className="breadcrumb-item">
                            <Link to="#" onClick={this.props.history.goBack}>
                                Student
                            </Link>
                        </li>
                        <li className="breadcrumb-item active">Profile</li>
                    </ol>
                </nav>

                {/* Student details */}
                <div className="row align-items-center mb-4">
                    <div className="col-md-6">
                        <div className="d-flex align-items-center">
                            <img
                                src={
                                    this.state.studentItems.length !== 0
                                        ? this.state.studentItems
                                              .profile_link !== null
                                            ? this.state.studentItems
                                                  .profile_link
                                            : profilepic
                                        : profilepic
                                }
                                alt={this.state.studentItems.full_name}
                                className="square-img-sm"
                            />
                            <div className="ml-3">
                                <h5 className="primary-text">
                                    {this.state.studentItems.length !== 0
                                        ? this.state.studentItems.full_name !==
                                          ""
                                            ? this.state.studentItems.full_name
                                            : this.state.studentItems.username
                                        : ""}
                                </h5>
                                <p className="mb-0">
                                    {this.state.studentItems.length !== 0 ? (
                                        this.state.studentItems.is_active ? (
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
                <div className="row mb-4">
                    <div className="col-md-2 col-sm-4 col-6 mb-3">
                        <p className="mb-1 font-weight-bold-600">First Name</p>
                        <p className="text-break mb-0">
                            {this.state.studentItems.first_name}
                        </p>
                    </div>
                    <div className="col-md-2 col-sm-4 col-6 mb-3">
                        <p className="mb-1 font-weight-bold-600">Last Name</p>
                        <p className="text-break mb-0">
                            {this.state.studentItems.last_name}
                        </p>
                    </div>
                    <div className="col-md-2 col-sm-4 col-6 mb-3">
                        <p className="mb-1 font-weight-bold-600">Email ID</p>
                        <p className="text-break mb-0">
                            {this.state.studentItems.email}
                        </p>
                    </div>
                    <div className="col-md-2 col-sm-4 col-6 mb-3">
                        <p className="mb-1 font-weight-bold-600">
                            Mentor Email
                        </p>
                        <p className="text-break mb-0">
                            {this.state.studentItems.mentor_email}
                        </p>
                    </div>
                    <div className="col-md-2 col-sm-4 col-6 mb-3">
                        <p className="mb-1 font-weight-bold-600">Mobile</p>
                        <p className="text-break mb-0">
                            {this.state.studentItems.country_code}
                            {this.state.studentItems.phone_num}
                        </p>
                    </div>
                    <div className="col-md-2 col-sm-4 col-6 mb-3">
                        <p className="mb-1 font-weight-bold-600">
                            Date of Birth
                        </p>
                        <p className="text-break mb-0">
                            {dateFormat(
                                this.state.studentItems.date_of_birth,
                                "dS mmm, yyyy"
                            )}
                        </p>
                    </div>
                    <div className="col-md-2 col-sm-4 col-6 mb-3">
                        <p className="mb-1 font-weight-bold-600">Address</p>
                        <p className="text-break mb-0">
                            {this.state.studentItems.address}
                        </p>
                    </div>
                    <div className="col-md-2 col-sm-4 col-6 mb-3">
                        <p className="mb-1 font-weight-bold-600">City</p>
                        <p className="text-break mb-0">
                            {this.state.studentItems.city}
                        </p>
                    </div>
                    <div className="col-md-2 col-sm-4 col-6 mb-3">
                        <p className="mb-1 font-weight-bold-600">District</p>
                        <p className="text-break mb-0">
                            {this.state.studentItems.district}
                        </p>
                    </div>
                    <div className="col-md-2 col-sm-4 col-6 mb-3">
                        <p className="mb-1 font-weight-bold-600">State</p>
                        <p className="text-break mb-0">
                            {this.state.studentItems.state}
                        </p>
                    </div>
                    <div className="col-md-2 col-sm-4 col-6">
                        <p className="mb-1 font-weight-bold-600">Country</p>
                        <p className="text-break mb-0">
                            {this.state.studentItems.country}
                        </p>
                    </div>
                    <div className="col-md-2 col-sm-4 col-6">
                        <p className="mb-1 font-weight-bold-600">Pincode</p>
                        <p className="text-break mb-0">
                            {this.state.studentItems.pincode}
                        </p>
                    </div>
                    <div className="col-md-2 col-sm-4 col-6 mb-3">
                        <p className="mb-1 font-weight-bold-600">Institution</p>
                        <p className="text-break mb-0">
                            {this.state.studentItems.institution_name}
                        </p>
                    </div>
                    {!this.hodId && (
                        <div className="col-md-2 col-sm-4 col-6 mb-3">
                            <p className="mb-1 font-weight-bold-600">
                                Terms and condition
                            </p>
                            <p className="text-break mb-0">
                                {this.state.studentItems.terms_and_condition ? (
                                    <Badge variant="success">Approved</Badge>
                                ) : (
                                    <Badge variant="danger">Not Approved</Badge>
                                )}
                            </p>
                        </div>
                    )}
                </div>

                {/* subscribed course list */}
                <div className="card shadow-sm">
                    <StudentSubscriptionTable
                        data={this.state.studentItems.subscriptions || []}
                    />
                    <div className="card-footer"></div>
                </div>

                {/* Loading component */}
                {this.state.page_loading ? <Loading /> : ""}
            </Wrapper>
        );
    }
}

export default AdminStudentProfile;
