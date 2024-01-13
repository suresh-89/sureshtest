import React, { Component } from "react";
import Wrapper from "./wrapper";
import profilepic from "../../assets/user-v1.png";
import { Link } from "react-router-dom";
import { Badge } from "react-bootstrap";
import { baseUrl, hodUrl } from "../../shared/baseUrl";
import Loading from "../common/loader";
import GroupTable from "../common/table/group";
import SubjectTable from "../common/table/subject";
import AlertBox from "../common/alert";
import dateFormat from "dateformat";

class HODTeacherProfile extends Component {
    constructor(props) {
        super(props);
        this.state = {
            teacherItems: [],
            groupItems: [],
            subjectItems: [],

            errorMsg: "",
            successMsg: "",
            showErrorAlert: false,
            showSuccessAlert: false,
            page_loading: true,
        };
        this.teacherId = this.props.match.params.teacherId;
        this.url = baseUrl + hodUrl;
        this.authToken = localStorage.getItem("Authorization");
        this.headers = {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: this.authToken,
        };
    }

    componentDidMount = () => {
        document.title = "Teacher Profile - HOD | IQLabs";

        fetch(`${this.url}/hod/teacher/${this.teacherId}/`, {
            headers: this.headers,
            method: "GET",
        })
            .then((res) => res.json())
            .then((result) => {
                if (result.sts === true) {
                    this.setState({
                        teacherItems: result.data.teacher_profile,
                        groupItems: result.data.group_data,
                        subjectItems: result.data.independent_subject_data,
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
                header="Teacher Profile"
                activeLink="profiles"
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
                                Teacher
                            </Link>
                        </li>
                        <li className="breadcrumb-item active">Profile</li>
                    </ol>
                </nav>

                {/* Teacher Details */}
                <div className="row align-items-center mb-4">
                    <div className="col-md-6">
                        <div className="d-flex align-items-center">
                            <img
                                src={
                                    this.state.teacherItems.profile_link !==
                                    null
                                        ? this.state.teacherItems.profile_link
                                        : profilepic
                                }
                                alt={this.state.teacherItems.full_name}
                                className="square-img-sm"
                            />
                            <div className="ml-3">
                                <h5 className="primary-text">
                                    {this.state.teacherItems.full_name !== ""
                                        ? this.state.teacherItems.full_name
                                        : this.state.teacherItems.username}
                                </h5>
                                <p className="mb-0">
                                    {this.state.teacherItems.length !== 0 ? (
                                        this.state.teacherItems.is_active ? (
                                            <Badge variant="success">
                                                Active
                                            </Badge>
                                        ) : (
                                            <Badge variant="danger">
                                                Inactive
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
                    <div className="col-md-2 col-6 mb-3 mb-md-0">
                        <p className="font-weight-bold-600 mb-2">First Name</p>
                        <p className="text-break mb-0">
                            {this.state.teacherItems.first_name}
                        </p>
                    </div>
                    <div className="col-md-2 col-6 mb-3 mb-md-0">
                        <p className="font-weight-bold-600 mb-2">Last Name</p>
                        <p className="text-break mb-0">
                            {this.state.teacherItems.last_name}
                        </p>
                    </div>
                    <div className="col-md-2 col-6 mb-3 mb-md-0">
                        <p className="font-weight-bold-600 mb-2">Designation</p>
                        <p className="text-break mb-0">
                            {this.state.teacherItems.designation}
                        </p>
                    </div>
                    <div className="col-md-2 col-6 mb-3 mb-md-0">
                        <p className="font-weight-bold-600 mb-2">Email ID</p>
                        <p className="text-break mb-0">
                            {this.state.teacherItems.email}
                        </p>
                    </div>
                    <div className="col-md-2 col-6 mb-3 mb-md-0">
                        <p className="font-weight-bold-600 mb-2">Mobile</p>
                        <p className="text-break mb-0">
                            {this.state.teacherItems.country_code}
                            {this.state.teacherItems.phone_num}
                        </p>
                    </div>
                    <div className="col-md-2 col-sm-4 col-6 mb-3">
                        <p className="mb-1 font-weight-bold-600">
                            Date of Birth
                        </p>
                        <p className="text-break mb-0">
                            {dateFormat(
                                this.state.teacherItems.date_of_birth,
                                "dS mmm, yyyy"
                            )}
                        </p>
                    </div>

                    <div className="col-md-2 col-sm-4 col-6 mb-3">
                        <p className="mb-1 font-weight-bold-600 mb-2">
                            Address
                        </p>
                        <p className="text-break mb-0">
                            {this.state.teacherItems.address}
                        </p>
                    </div>
                    <div className="col-md-2 col-sm-4 col-6 mb-3">
                        <p className="mb-1 font-weight-bold-600 mb-2">City</p>
                        <p className="text-break mb-0">
                            {this.state.teacherItems.city}
                        </p>
                    </div>
                    <div className="col-md-2 col-sm-4 col-6 mb-3">
                        <p className="mb-1 font-weight-bold-600 mb-2">
                            District
                        </p>
                        <p className="text-break mb-0">
                            {this.state.teacherItems.district}
                        </p>
                    </div>
                    <div className="col-md-2 col-sm-4 col-6 mb-3">
                        <p className="mb-1 font-weight-bold-600 mb-2">State</p>
                        <p className="text-break mb-0">
                            {this.state.teacherItems.state}
                        </p>
                    </div>
                    <div className="col-md-2 col-sm-4 col-6">
                        <p className="mb-1 font-weight-bold-600 mb-2">
                            Country
                        </p>
                        <p className="text-break mb-0">
                            {this.state.teacherItems.country}
                        </p>
                    </div>
                    <div className="col-md-2 col-sm-4 col-6">
                        <p className="mb-1 font-weight-bold-600 mb-2">
                            Pincode
                        </p>
                        <p className="text-break mb-0">
                            {this.state.teacherItems.pincode}
                        </p>
                    </div>

                    <div className="col-md-2 col-sm-4 col-6">
                        <p className="mb-1 font-weight-bold-600 mb-2">
                            Institution Name
                        </p>
                        <p className="text-break mb-0">
                            {this.state.teacherItems.institution_name}
                        </p>
                    </div>
                    <div className="col-md-2 col-sm-4 col-6">
                        <p className="mb-1 font-weight-bold-600 mb-2">
                            Institution Details
                        </p>
                        <p className="text-break mb-0">
                            {this.state.teacherItems.institution_detail}
                        </p>
                    </div>
                </div>

                {/* Group Handling */}
                <div className="card shadow-sm mb-4">
                    <div className="card-header">
                        <h5>Handling Groups</h5>
                    </div>
                    <GroupTable
                        groupItems={this.state.groupItems}
                        path="hod"
                        view={true}
                    />
                    <div className="card-footer"></div>
                </div>

                {/* Subject Handling */}
                <div className="card shadow-sm">
                    <div className="card-header">
                        <h5>Handling Subjects</h5>
                    </div>
                    <SubjectTable
                        subjectItems={this.state.subjectItems}
                        path="hod"
                    />
                    <div className="card-footer"></div>
                </div>

                {/* Loading component */}
                {this.state.page_loading ? <Loading /> : ""}
            </Wrapper>
        );
    }
}

export default HODTeacherProfile;
