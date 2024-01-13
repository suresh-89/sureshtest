import React, { useState, useEffect } from "react";
import { baseUrl, studentUrl } from "../../../shared/baseUrl.js";
import Loading from "../../common/loader";
import AlertBox from "../../common/alert";
import storeDispatch from "../../../redux/dispatch/index.js";
import { RESET_STATE } from "../../../redux/action/index.js";

const url = baseUrl + studentUrl;
const headers = {
    Accept: "application/json",
    "Content-Type": "application/json",
};

const AccountDelete = () => {
    const [current_password, setCurrentPassword] = useState("");
    const [show_current_password, toggleCurrentPassword] = useState(false);

    const [isLoading, setLoading] = useState(false);
    const [responseMsg, setResponseMsg] = useState("");
    const [showErrorAlert, setErrorAlert] = useState(false);
    const [showSuccessAlert, setSuccessAlert] = useState(false);

    useEffect(() => {
        headers["Authorization"] = localStorage.getItem("Authorization");
    });

    const handleDelete = (event) => {
        event.preventDefault();
        setLoading(true);
        setErrorAlert(false);
        setSuccessAlert(false);

        if (current_password !== "") {
            fetch(`${url}/student/delete/`, {
                method: "DELETE",
                headers: headers,
                body: JSON.stringify({
                    password: current_password,
                }),
            })
                .then((res) => res.json())
                .then((result) => {
                    if (result.sts === true) {
                        setResponseMsg("Account deleted, logging you out...");
                        setSuccessAlert(true);

                        // removing localstorage
                        setTimeout(() => {
                            localStorage.clear();
                            storeDispatch(RESET_STATE);
                            setTimeout(() => {
                                window.location.reload();
                            }, 1000);
                        }, 1000);
                    } else {
                        setResponseMsg(result.msg);
                        setErrorAlert(true);
                        setLoading(false);
                    }
                })
                .catch((err) => {
                    console.log(err);
                    setResponseMsg("Something went wrong!");
                    setErrorAlert(true);
                    setLoading(false);
                });
        } else {
            setResponseMsg("Enter current password to delete account!");
            setErrorAlert(true);
            setLoading(false);
        }
    };

    return (
        <>
            {/* Alert message */}
            <AlertBox
                errorMsg={responseMsg}
                successMsg={responseMsg}
                showErrorAlert={showErrorAlert}
                showSuccessAlert={showSuccessAlert}
                toggleSuccessAlert={() => setSuccessAlert(false)}
                toggleErrorAlert={() => setErrorAlert(false)}
            />
            <div className="card-header h5">Delete account</div>

            <div className="card-body">
                <p className="">
                    Enter your current password to delete your account
                </p>
                {/* ----- current password ----- */}
                <div className="row">
                    <div className="col-md-6">
                        <label htmlFor="password">Password</label>
                        <div
                            className="input-group border-secondary mb-3"
                            style={{
                                borderRadius: "6px",
                            }}
                        >
                            <input
                                type={
                                    show_current_password ? "text" : "password"
                                }
                                name="password"
                                id="password"
                                className="form-control form-control-lg"
                                onChange={(event) =>
                                    setCurrentPassword(event.target.value)
                                }
                                value={current_password}
                                placeholder="**********"
                                required
                            />
                            <div className="input-group-append">
                                <button
                                    className="btn btn-link btn-sm bg-white shadow-none"
                                    type="button"
                                    id="button-addon2"
                                    onClick={() =>
                                        toggleCurrentPassword(
                                            !show_current_password
                                        )
                                    }
                                >
                                    {show_current_password ? (
                                        <i className="far fa-eye-slash"></i>
                                    ) : (
                                        <i className="far fa-eye"></i>
                                    )}
                                </button>
                            </div>
                        </div>
                        <button
                            className="btn btn-primary btn-sm shadow-none"
                            onClick={handleDelete}
                        >
                            <i className="far fa-trash-alt fa-sm mr-1"></i>{" "}
                            Delete account
                        </button>
                    </div>
                </div>
            </div>

            {/* Loading component */}
            {isLoading ? <Loading /> : ""}
        </>
    );
};

export default AccountDelete;
