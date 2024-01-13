import React from "react";
import { baseUrl, inquelAdminUrl } from "../../../../shared/baseUrl.js";
import Loading from "../../../common/loader";
import AlertBox from "../../../common/alert";
import CKeditor from "../../../common/CKEditor.jsx";
import ReactSwitch from "../../../common/switchComponent";

class TermsAndCondition extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            data: "",
            is_active: true,

            isLoading: false,
            responseMsg: "",
            showErrorAlert: false,
            showSuccessAlert: false,
        };
        this.url = baseUrl + inquelAdminUrl;
        this.headers = {
            Accept: "application/json",
            "Content-Type": "application/json",
            "Inquel-Auth": localStorage.getItem("Inquel-Auth"),
        };
    }

    componentDidMount = () => {
        this.fetchData();
    };

    fetchData = () => {
        fetch(`${this.url}/termscondition/`, {
            method: "GET",
            headers: this.headers,
        })
            .then((res) => res.json())
            .then((result) => {
                if (result.sts === true) {
                    this.setState({
                        data: result.data.terms_condition || "",
                        is_active: result.data.is_active,
                        isLoading: false,
                    });
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
                    responseMsg: "There is a problem in loading the data!",
                    showErrorAlert: true,
                    isLoading: false,
                });
            });
    };

    handleStatus = () => {
        this.setState({
            isLoading: true,
            showSuccessAlert: false,
            showErrorAlert: false,
        });

        fetch(`${this.url}/termscondition/`, {
            method: "PATCH",
            headers: this.headers,
        })
            .then((res) => res.json())
            .then((result) => {
                if (result.sts === true) {
                    this.setState({
                        responseMsg: result.msg,
                        showSuccessAlert: true,
                        isLoading: false,
                        is_active: !this.state.is_active,
                    });
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

    handleSave = () => {
        this.setState({
            isLoading: true,
            showSuccessAlert: false,
            showErrorAlert: false,
        });

        if (this.state.data !== "") {
            fetch(`${this.url}/termscondition/`, {
                method: "POST",
                headers: this.headers,
                body: JSON.stringify({
                    terms_condition: this.state.data,
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
                        this.fetchData();
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
        } else {
            this.setState({
                responseMsg: "Content is required",
                showErrorAlert: true,
                isLoading: false,
            });
        }
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

                <div className="card-header mb-2">
                    <div className="row align-items-center">
                        <div className="col-6 h5 mb-0">Terms and condition</div>
                        <div className="col-6 d-flex align-items-center justify-content-end">
                            <span className="mr-2">Status</span>
                            <ReactSwitch
                                checked={this.state.is_active}
                                onChange={this.handleStatus}
                            />
                        </div>
                    </div>
                </div>

                {/* card body */}
                <div className="card-body">
                    <CKeditor
                        data={this.state.data}
                        onChange={(event) =>
                            this.setState({
                                data: event.editor.getData(),
                            })
                        }
                    />
                </div>

                {/* save button */}
                <div className="card-body pt-0">
                    <div className="row">
                        <div className="col-lg-4 col-md-6 col-sm-8">
                            <button
                                className="btn btn-primary btn-block shadow-none"
                                onClick={this.handleSave}
                            >
                                Save Changes
                            </button>
                        </div>
                    </div>
                </div>

                {/* Loading component */}
                {this.state.isLoading ? <Loading /> : ""}
            </>
        );
    }
}

export default TermsAndCondition;
