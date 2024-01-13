import React, { useState, useEffect } from "react";
import {
    adminPathUrl,
    baseUrl,
    inquelAdminUrl,
} from "../../../shared/baseUrl.js";
import Loading from "../../common/loader";
import AlertBox from "../../common/alert";
import storeDispatch from "../../../redux/dispatch/index.js";
import { RESET_STATE } from "../../../redux/action/index.js";

const url = baseUrl + inquelAdminUrl;
const headers = {
    Accept: "application/json",
    "Content-Type": "application/json",
};

const UpdatePassword = () => {
    const [current_password, setCurrentPassword] = useState("");
    const [new_passwrod, setNewPassword] = useState("");
    const [confirm_password, setConfirmPassword] = useState("");
    const [token, setToken] = useState("");
    const [password_validated, setPasswordValidation] = useState(false);

    const [show_current_password, toggleCurrentPassword] = useState(false);
    const [show_new_passwrod, toggleNewPassword] = useState(false);
    const [show_confirm_password, toggleConfirmPassword] = useState(false);

    const [isLoading, setLoading] = useState(false);
    const [responseMsg, setResponseMsg] = useState("");
    const [showErrorAlert, setErrorAlert] = useState(false);
    const [showSuccessAlert, setSuccessAlert] = useState(false);

    useEffect(() => {
        headers["Inquel-Auth"] = localStorage.getItem("Inquel-Auth");
    });

    const handleLogout = () => {
        fetch(`${baseUrl}${adminPathUrl}/logout/`, {
            headers: headers,
            method: "POST",
        })
            .then((res) => res.json())
            .then((result) => {
                if (result.sts === true) {
                    localStorage.clear();
                    storeDispatch(RESET_STATE);
                    setTimeout(() => {
                        window.location.reload();
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
    };

    const handleCheck = (event) => {
        event.preventDefault();
        setLoading(true);
        setErrorAlert(false);
        setSuccessAlert(false);

        if (current_password !== "") {
            fetch(`${url}/authbeforepwdchange/`, {
                method: "POST",
                headers: headers,
                body: JSON.stringify({
                    password: current_password,
                }),
            })
                .then((res) => res.json())
                .then((result) => {
                    if (result.sts === true) {
                        setPasswordValidation(true);
                        setToken(result.token);
                        setLoading(false);
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
            setResponseMsg("Enter current password to validate!");
            setErrorAlert(true);
            setLoading(false);
        }
    };

    const handleUpdatePassword = (event) => {
        event.preventDefault();
        setLoading(true);
        setErrorAlert(false);
        setSuccessAlert(false);

        if (new_passwrod === "" && confirm_password === "") {
            setResponseMsg("Invalid password!");
            setErrorAlert(true);
            setLoading(false);
        } else if (new_passwrod.length < 8 && confirm_password.length < 8) {
            setResponseMsg("Invalid password!");
            setErrorAlert(true);
            setLoading(false);
        } else if (new_passwrod !== confirm_password) {
            setResponseMsg("Password did not match!");
            setErrorAlert(true);
            setLoading(false);
        } else {
            fetch(`${url}/changeapassword/`, {
                method: "POST",
                headers: headers,
                body: JSON.stringify({
                    password: new_passwrod,
                    confirm_password: confirm_password,
                    token: token,
                }),
            })
                .then((res) => res.json())
                .then((result) => {
                    if (result.sts === true) {
                        setResponseMsg("Password updated, logging you out...");
                        setSuccessAlert(true);
                        handleLogout();
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
            <div className="card-header h5">Update Password</div>

            <div className="card-body">
                {password_validated ? (
                    // ----- new password -----
                    <div className="row">
                        <div className="col-md-6">
                            <div className="form-group">
                                <label htmlFor="new_passwrod">
                                    New password
                                </label>
                                <div
                                    className="input-group border-secondary"
                                    style={{
                                        borderRadius: "6px",
                                    }}
                                >
                                    <input
                                        type={
                                            show_new_passwrod
                                                ? "text"
                                                : "password"
                                        }
                                        name="new_passwrod"
                                        id="new_passwrod"
                                        className="form-control form-control-lg"
                                        onChange={(event) =>
                                            setNewPassword(event.target.value)
                                        }
                                        value={new_passwrod}
                                        placeholder="**********"
                                        required
                                    />
                                    <div className="input-group-append">
                                        <button
                                            className="btn btn-link btn-sm bg-white shadow-none"
                                            type="button"
                                            id="button-addon2"
                                            onClick={() =>
                                                toggleNewPassword(
                                                    !show_new_passwrod
                                                )
                                            }
                                        >
                                            {show_new_passwrod ? (
                                                <i className="far fa-eye-slash"></i>
                                            ) : (
                                                <i className="far fa-eye"></i>
                                            )}
                                        </button>
                                    </div>
                                </div>
                            </div>
                            <div className="mb-1">
                                <label htmlFor="confirm_password">
                                    Confirm password
                                </label>
                                <div
                                    className="input-group border-secondary"
                                    style={{
                                        borderRadius: "6px",
                                    }}
                                >
                                    <input
                                        type={
                                            show_confirm_password
                                                ? "text"
                                                : "password"
                                        }
                                        name="confirm_password"
                                        id="confirm_password"
                                        className="form-control form-control-lg"
                                        onChange={(event) =>
                                            setConfirmPassword(
                                                event.target.value
                                            )
                                        }
                                        value={confirm_password}
                                        placeholder="**********"
                                        required
                                    />
                                    <div className="input-group-append">
                                        <button
                                            className="btn btn-link btn-sm bg-white shadow-none"
                                            type="button"
                                            id="button-addon2"
                                            onClick={() =>
                                                toggleConfirmPassword(
                                                    !show_confirm_password
                                                )
                                            }
                                        >
                                            {show_confirm_password ? (
                                                <i className="far fa-eye-slash"></i>
                                            ) : (
                                                <i className="far fa-eye"></i>
                                            )}
                                        </button>
                                    </div>
                                </div>
                            </div>
                            <small className="text-muted">
                                <b>Password must contain</b> <br />
                                A Uppercase letter, A Lowercase letter, A
                                number, A special character and Greater than 8
                                characters <br />
                            </small>
                            <button
                                className="btn btn-primary btn-sm shadow-none mt-3"
                                onClick={handleUpdatePassword}
                            >
                                Update password
                            </button>
                        </div>
                    </div>
                ) : (
                    // ----- current password -----
                    <div className="row">
                        <div className="col-md-6">
                            <label htmlFor="password">Current password</label>
                            <div
                                className="input-group border-secondary mb-3"
                                style={{
                                    borderRadius: "6px",
                                }}
                            >
                                <input
                                    type={
                                        show_current_password
                                            ? "text"
                                            : "password"
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
                                onClick={handleCheck}
                            >
                                Check password
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* Loading component */}
            {isLoading ? <Loading /> : ""}
        </>
    );
};

export default UpdatePassword;
