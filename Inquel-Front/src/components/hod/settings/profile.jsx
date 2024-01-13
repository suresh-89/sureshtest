import React from "react";
import dateFormat from "dateformat";
import { baseUrl, hodUrl } from "../../../shared/baseUrl.js";
import Loading from "../../common/loader";
import AlertBox from "../../common/alert";
import { connect } from "react-redux";
import { country } from "../../../shared/countries.js";
import Select from "react-select";
import { Tabs, Tab } from "react-bootstrap";

const mapStateToProps = (state) => ({
    profile_data: state.user.profile,
});

class UpdateProfile extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            data: this.props.profile_data,

            isLoading: false,
            responseMsg: "",
            showErrorAlert: false,
            showSuccessAlert: false,
        };
        this.url = baseUrl + hodUrl;
        this.headers = {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: localStorage.getItem("Authorization"),
        };
    }

    componentDidMount = () => {
        let profile_data = this.props.profile_data;
        profile_data.date_of_birth = dateFormat(
            this.props.profile_data.date_of_birth,
            "yyyy-mm-dd"
        );

        this.setState({
            data: profile_data,
        });
    };

    handleInput = (event) => {
        let data = this.state.data;
        data[event.target.name] = event.target.value;
        this.setState({
            data: data,
        });
    };

    handleDate = (event) => {
        let data = this.state.data;
        data.date_of_birth = dateFormat(event.target.value, "yyyy-mm-dd");
        this.setState({
            data: data,
        });
    };

    handleSelect = (event, type) => {
        let data = this.state.data;
        if (type === "country_code") {
            data.country_code = event.value;
        } else if (type === "office_country_code") {
            data.office_country_code = event.value;
        }

        this.setState({
            data: data,
        });
    };

    handleSubmit = (event) => {
        event.preventDefault();
        this.setState({
            isLoading: true,
            showSuccessAlert: false,
            showErrorAlert: false,
        });
        let data = this.state.data;

        if (
            data.first_name === "" ||
            data.last_name === "" ||
            data.username === "" ||
            data.country_code === "" ||
            data.phone_num === "" ||
            data.date_of_birth === ""
        ) {
            this.setState({
                responseMsg: "Enter all the required fields",
                showErrorAlert: true,
                isLoading: false,
            });
        } else {
            fetch(`${this.url}/hod/profile/`, {
                method: "PUT",
                headers: this.headers,
                body: JSON.stringify({
                    first_name: data.first_name,
                    last_name: data.last_name,
                    username: data.username,
                    country_code: data.country_code,
                    phone_num: `${data.country_code}${data.phone_num}`,
                    office_country_code: data.office_country_code,
                    office_phone_num: `${data.office_country_code}${data.office_phone_num}`,
                    date_of_birth: dateFormat(data.date_of_birth, "yyyy-mm-dd"),
                    address: data.address || "",
                    city: data.city || "",
                    district: data.district || "",
                    state: data.state || "",
                    country: data.country || "",
                    pincode: data.pincode || "",
                    department_name: data.department_name || "",
                    department_details: data.department_details || "",
                    office_address: data.office_address || "",
                    additional_details_1: data.additional_details_1 || "",
                    additional_details_2: data.additional_details_2 || "",
                }),
            })
                .then((res) => res.json())
                .then((result) => {
                    if (result.sts === true) {
                        this.setState({
                            responseMsg: result.msg,
                            showSuccessAlert: true,
                            isLoading: false,
                        });
                        this.props.loadData();
                    } else {
                        this.setState({
                            responseMsg: result.msg,
                            showErrorAlert: true,
                            isLoading: false,
                        });
                    }
                })
                .catch((err) => {
                    console.log(err);
                    this.setState({
                        responseMsg:
                            "There is a problem in saving the data, try again!",
                        showErrorAlert: true,
                        isLoading: false,
                    });
                });
        }
    };

    renderValue = (data) => {
        return (
            <span>
                <img
                    src={data.flag}
                    alt=""
                    className="img-fluid"
                    width="25px"
                    height="auto"
                />{" "}
                {data.isoCode} - {data.dialCode}
            </span>
        );
    };

    render() {
        return (
            <>
                {/* Alert message */}
                <AlertBox
                    errorMsg={this.state.responseMsg}
                    successMsg={this.state.responseMsg}
                    showErrorAlert={this.state.showErrorAlert}
                    showSuccessAlert={this.state.showSuccessAlert}
                    toggleSuccessAlert={() =>
                        this.setState({
                            showSuccessAlert: false,
                        })
                    }
                    toggleErrorAlert={() =>
                        this.setState({
                            showErrorAlert: false,
                        })
                    }
                />

                <div className="card-header h5 mb-2">
                    <div className="row align-items-center">
                        <div className="col-6">Update Profile</div>
                        <div className="col-6 text-right">
                            <button
                                className="btn btn-primary shadow-none"
                                onClick={this.handleSubmit}
                            >
                                <i className="fas fa-save mr-1"></i> Save
                                Changes
                            </button>
                        </div>
                    </div>
                </div>

                {/* card body */}
                <form onSubmit={this.handleSubmit} autoComplete="off">
                    <Tabs
                        defaultActiveKey="personal"
                        id="uncontrolled-tab-example"
                    >
                        <Tab eventKey="personal" title="Personal Details">
                            <div className="card-body pt-2">
                                <div className="row">
                                    <div className="col-lg-6 col-md-8">
                                        <div className="form-group">
                                            <label htmlFor="first_name">
                                                First name{" "}
                                                <span className="text-danger font-weight-bold">
                                                    *
                                                </span>
                                            </label>
                                            <input
                                                type="text"
                                                name="first_name"
                                                id="first_name"
                                                className="form-control border-secondary"
                                                value={
                                                    this.state.data.first_name
                                                }
                                                onChange={this.handleInput}
                                                required
                                            />
                                        </div>
                                        <div className="form-group">
                                            <label htmlFor="last_name">
                                                Last name{" "}
                                                <span className="text-danger font-weight-bold">
                                                    *
                                                </span>
                                            </label>
                                            <input
                                                type="text"
                                                name="last_name"
                                                id="last_name"
                                                className="form-control border-secondary"
                                                value={
                                                    this.state.data.last_name
                                                }
                                                onChange={this.handleInput}
                                                required
                                            />
                                        </div>
                                        <div className="form-group">
                                            <label htmlFor="username">
                                                Username{" "}
                                                <span className="text-danger font-weight-bold">
                                                    *
                                                </span>
                                            </label>
                                            <input
                                                type="text"
                                                name="username"
                                                id="username"
                                                className="form-control border-secondary"
                                                value={this.state.data.username}
                                                onChange={this.handleInput}
                                                required
                                            />
                                        </div>
                                        <div className="form-group">
                                            <label htmlFor="phone_num">
                                                Mobile number{" "}
                                                <span className="text-danger font-weight-bold">
                                                    *
                                                </span>
                                            </label>
                                            <div className="d-flex border-secondary rounded-lg">
                                                <div
                                                    style={{
                                                        width: "35%",
                                                    }}
                                                >
                                                    <Select
                                                        className="basic-single border-right"
                                                        isSearchable={false}
                                                        name="country_code"
                                                        value={country.map(
                                                            (list) => {
                                                                return list.dialCode ===
                                                                    this.state
                                                                        .data
                                                                        .country_code
                                                                    ? {
                                                                          value: list.dialCode,
                                                                          label: this.renderValue(
                                                                              list
                                                                          ),
                                                                      }
                                                                    : "";
                                                            }
                                                        )}
                                                        options={country.map(
                                                            (list) => {
                                                                return {
                                                                    value: list.dialCode,
                                                                    label: this.renderValue(
                                                                        list
                                                                    ),
                                                                };
                                                            }
                                                        )}
                                                        onChange={(event) =>
                                                            this.handleSelect(
                                                                event,
                                                                "country_code"
                                                            )
                                                        }
                                                        required
                                                    />
                                                </div>
                                                <div>
                                                    <input
                                                        type="text"
                                                        name="phone_num"
                                                        id="phone_num"
                                                        className="form-control form-control-lg"
                                                        onChange={
                                                            this.handleInput
                                                        }
                                                        value={
                                                            this.state.data
                                                                .phone_num
                                                        }
                                                        placeholder="Enter phone number"
                                                        required
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                        <div className="form-group">
                                            <label htmlFor="office_phone_num">
                                                Office phone
                                            </label>
                                            <div className="d-flex border-secondary rounded-lg">
                                                <div
                                                    style={{
                                                        width: "35%",
                                                    }}
                                                >
                                                    <Select
                                                        className="basic-single border-right"
                                                        isSearchable={false}
                                                        name="country_code"
                                                        value={country.map(
                                                            (list) => {
                                                                return list.dialCode ===
                                                                    this.state
                                                                        .data
                                                                        .office_country_code
                                                                    ? {
                                                                          value: list.dialCode,
                                                                          label: this.renderValue(
                                                                              list
                                                                          ),
                                                                      }
                                                                    : "";
                                                            }
                                                        )}
                                                        options={country.map(
                                                            (list) => {
                                                                return {
                                                                    value: list.dialCode,
                                                                    label: this.renderValue(
                                                                        list
                                                                    ),
                                                                };
                                                            }
                                                        )}
                                                        onChange={(event) =>
                                                            this.handleSelect(
                                                                event,
                                                                "office_country_code"
                                                            )
                                                        }
                                                        required
                                                    />
                                                </div>
                                                <div>
                                                    <input
                                                        type="text"
                                                        name="office_phone_num"
                                                        id="office_phone_num"
                                                        className="form-control form-control-lg"
                                                        onChange={
                                                            this.handleInput
                                                        }
                                                        value={
                                                            this.state.data
                                                                .office_phone_num
                                                        }
                                                        placeholder="Enter phone number"
                                                        required
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                        <label htmlFor="date_of_birth">
                                            Date of Birth{" "}
                                            <span className="text-danger font-weight-bold">
                                                *
                                            </span>
                                        </label>
                                        <input
                                            type="date"
                                            name="date_of_birth"
                                            id="date_of_birth"
                                            className="form-control border-secondary"
                                            value={dateFormat(
                                                this.state.data.date_of_birth,
                                                "yyyy-mm-dd"
                                            )}
                                            onChange={this.handleDate}
                                        />
                                    </div>
                                </div>
                            </div>
                        </Tab>

                        <Tab eventKey="address" title="Address Info">
                            <div className="card-body pt-2">
                                <div className="row">
                                    <div className="col-lg-6 col-md-8">
                                        <div className="form-group">
                                            <label htmlFor="address">
                                                Address line
                                            </label>
                                            <input
                                                type="text"
                                                name="address"
                                                id="address"
                                                className="form-control border-secondary"
                                                value={this.state.data.address}
                                                onChange={this.handleInput}
                                            />
                                        </div>
                                        <div className="form-group">
                                            <label htmlFor="city">City</label>
                                            <input
                                                type="text"
                                                name="city"
                                                id="city"
                                                className="form-control border-secondary"
                                                value={this.state.data.city}
                                                onChange={this.handleInput}
                                            />
                                        </div>
                                        <div className="form-group">
                                            <label htmlFor="district">
                                                District
                                            </label>
                                            <input
                                                type="text"
                                                name="district"
                                                id="district"
                                                className="form-control border-secondary"
                                                value={this.state.data.district}
                                                onChange={this.handleInput}
                                            />
                                        </div>
                                        <div className="form-group">
                                            <label htmlFor="state">State</label>
                                            <input
                                                type="text"
                                                name="state"
                                                id="state"
                                                className="form-control border-secondary"
                                                value={this.state.data.state}
                                                onChange={this.handleInput}
                                            />
                                        </div>
                                        <div className="form-group">
                                            <label htmlFor="country">
                                                Country
                                            </label>
                                            <input
                                                type="text"
                                                name="country"
                                                id="country"
                                                className="form-control border-secondary"
                                                value={this.state.data.country}
                                                onChange={this.handleInput}
                                            />
                                        </div>
                                        <div>
                                            <label htmlFor="pincode">
                                                Pincode
                                            </label>
                                            <input
                                                type="text"
                                                name="pincode"
                                                id="pincode"
                                                className="form-control border-secondary"
                                                value={this.state.data.pincode}
                                                onChange={this.handleInput}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </Tab>

                        <Tab eventKey="institution" title="Institution Details">
                            <div className="card-body pt-2">
                                <div className="row">
                                    <div className="col-lg-6 col-md-8">
                                        <div className="form-group">
                                            <label htmlFor="department_name">
                                                Department Name
                                            </label>
                                            <input
                                                type="text"
                                                name="department_name"
                                                id="department_name"
                                                className="form-control border-secondary"
                                                value={
                                                    this.state.data
                                                        .department_name
                                                }
                                                onChange={this.handleInput}
                                            />
                                        </div>
                                        <div className="form-group">
                                            <label htmlFor="department_details">
                                                Department details
                                            </label>
                                            <input
                                                type="text"
                                                name="department_details"
                                                id="department_details"
                                                className="form-control border-secondary"
                                                value={
                                                    this.state.data
                                                        .department_details
                                                }
                                                onChange={this.handleInput}
                                            />
                                        </div>
                                        <div className="form-group">
                                            <label htmlFor="office_address">
                                                Office address
                                            </label>
                                            <input
                                                type="text"
                                                name="office_address"
                                                id="office_address"
                                                className="form-control border-secondary"
                                                value={
                                                    this.state.data
                                                        .office_address
                                                }
                                                onChange={this.handleInput}
                                            />
                                        </div>
                                        <div className="form-group">
                                            <label htmlFor="additional_details_1">
                                                Additional details 1
                                            </label>
                                            <textarea
                                                name="additional_details_1"
                                                id="additional_details_1"
                                                rows="4"
                                                className="form-control border-secondary"
                                                onChange={this.handleInput}
                                                value={
                                                    this.state.data
                                                        .additional_details_1
                                                }
                                            ></textarea>
                                        </div>
                                        <div>
                                            <label htmlFor="additional_details_2">
                                                Additional details 2
                                            </label>
                                            <textarea
                                                name="additional_details_2"
                                                id="additional_details_2"
                                                rows="4"
                                                className="form-control border-secondary"
                                                onChange={this.handleInput}
                                                value={
                                                    this.state.data
                                                        .additional_details_2
                                                }
                                            ></textarea>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </Tab>
                    </Tabs>
                </form>

                {/* save button */}
                <div className="card-body pt-0">
                    <small className="text-muted">
                        Field marked as{" "}
                        <span className="text-danger font-weight-bold">*</span>{" "}
                        are mandatory fields
                    </small>
                </div>

                {/* Loading component */}
                {this.state.isLoading ? <Loading /> : ""}
            </>
        );
    }
}

export default connect(mapStateToProps)(UpdateProfile);
