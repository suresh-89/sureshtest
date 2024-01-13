import React from "react";
import { adminPathUrl, baseUrl } from "../../../shared/baseUrl.js";
import Loading from "../../common/loader";
import AlertBox from "../../common/alert";
import { connect } from "react-redux";

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
        this.url = baseUrl + adminPathUrl;
        this.headers = {
            Accept: "application/json",
            "Content-Type": "application/json",
            'Inquel-Auth': localStorage.getItem("Inquel-Auth"),
        };
    }

    handleInput = (event) => {
        let data = this.state.data;
        data[event.target.name] = event.target.value;
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

        fetch(`${this.url}/profile/`, {
            method: "PUT",
            headers: this.headers,
            body: JSON.stringify({
                first_name: data.first_name,
                last_name: data.last_name,
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

                <div className="card-header h5 mb-2">Update Profile</div>

                {/* card body */}
                <form onSubmit={this.handleSubmit} autoComplete="off">
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
                                        value={this.state.data.first_name}
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
                                        value={this.state.data.last_name}
                                        onChange={this.handleInput}
                                        required
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </form>

                {/* save button */}
                <div className="card-body pt-0">
                    <div className="row mb-1">
                        <div className="col-lg-4 col-md-6 col-sm-8">
                            <button
                                className="btn btn-primary btn-block shadow-none"
                                onClick={this.handleSubmit}
                            >
                                Save Changes
                            </button>
                        </div>
                    </div>
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
