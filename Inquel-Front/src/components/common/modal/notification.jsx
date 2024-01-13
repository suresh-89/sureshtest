import React, { useState, useEffect } from "react";
import {
    Modal,
    Alert,
    Spinner,
    Dropdown,
    OverlayTrigger,
    Tooltip,
} from "react-bootstrap";
import { Link } from "react-router-dom";
import dateFormat from "dateformat";
import userpic from "../../../assets/user-v1.png";
import { useSelector } from "react-redux";
import { NOTIFICATION } from "../../../redux/action";
import storeDispatch from "../../../redux/dispatch";
import Loading from "../../common/loader";
import AlertBox from "../../common/alert";

export default class NotificationModal extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            id: [],
            send_all: this.props.notify_all,
            message: "",

            responseMsg: "",
            showErrorAlert: false,
            showSuccessAlert: false,
            showLoader: false,
        };
        this.authToken = localStorage.getItem("Authorization");
        this.inquelAuth = localStorage.getItem("Inquel-Auth");
        this.headers = {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: this.authToken,
            "Inquel-Auth": this.inquelAuth,
        };
    }

    componentDidMount = () => {
        if (this.props.notify_all === false) {
            if (this.props.data && this.props.data.length !== 0) {
                let id = [];
                this.props.data.forEach((list) => {
                    id.push(list.id);
                });

                this.setState({
                    id: id,
                });
            }
        }
    };

    handleMessage = (event) => {
        this.setState({
            message: event.target.value,
        });
    };

    handleSendNotification = () => {
        this.setState({
            showLoader: true,
            showErrorAlert: false,
            showSuccessAlert: false,
        });

        let body = {
            send_all: this.state.send_all,
            message: this.state.message,
        };
        body[this.props.field] = this.state.id;

        if (this.state.message !== "") {
            fetch(`${this.props.url}`, {
                method: "POST",
                headers: this.headers,
                body: JSON.stringify(body),
            })
                .then((res) => res.json())
                .then((result) => {
                    if (result.sts === true) {
                        this.setState({
                            responseMsg: result.msg,
                            showSuccessAlert: true,
                            showLoader: false,
                        });
                        setTimeout(() => {
                            this.props.onHide();
                        }, 1000);
                    } else {
                        this.setState({
                            responseMsg: result.msg,
                            showErrorAlert: true,
                            showLoader: false,
                        });
                    }
                })
                .catch((err) => {
                    console.log(err);
                    this.setState({
                        responseMsg: "Notification could not sent!",
                        showErrorAlert: true,
                        showLoader: false,
                    });
                });
        } else {
            this.setState({
                responseMsg: "Enter message to send notification",
                showErrorAlert: true,
                showLoader: false,
            });
        }
    };

    render() {
        return (
            <Modal
                show={this.props.show}
                onHide={this.props.onHide}
                size="md"
                aria-labelledby="contained-modal-title-vcenter"
                centered
            >
                <Modal.Header closeButton>Notification</Modal.Header>
                <Modal.Body>
                    <Alert
                        variant="danger"
                        show={this.state.showErrorAlert}
                        onClose={() => {
                            this.setState({
                                showErrorAlert: false,
                            });
                        }}
                        dismissible
                    >
                        {this.state.responseMsg}
                    </Alert>
                    <Alert
                        variant="success"
                        show={this.state.showSuccessAlert}
                        onClose={() => {
                            this.setState({
                                showSuccessAlert: false,
                            });
                        }}
                        dismissible
                    >
                        {this.state.responseMsg}
                    </Alert>

                    <div className="form-group">
                        <label htmlFor="message">Message</label>
                        <textarea
                            name="message"
                            id="message"
                            rows="6"
                            className="form-control borders"
                            placeholder="Type your message here..."
                            onChange={this.handleMessage}
                            required
                        ></textarea>
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <button
                        className="btn btn-primary btn-block shadow-none"
                        onClick={this.handleSendNotification}
                    >
                        {this.state.showLoader ? (
                            <Spinner
                                as="span"
                                animation="border"
                                size="sm"
                                role="status"
                                aria-hidden="true"
                                className="mr-2"
                            />
                        ) : (
                            <i className="far fa-paper-plane mr-2"></i>
                        )}
                        Send notification
                    </button>
                </Modal.Footer>
            </Modal>
        );
    }
}

const NotificationViewModal = (props) => {
    return (
        <Modal
            show={props.show}
            onHide={props.onHide}
            size="md"
            aria-labelledby="contained-modal-title-vcenter"
            centered
        >
            <Modal.Header closeButton>Notification</Modal.Header>
            <Modal.Body>
                <div className="d-flex">
                    <img
                        src={
                            props.data.sent_by.profile_link
                                ? props.data.sent_by.profile_link
                                : userpic
                        }
                        alt={props.data.sent_by.name}
                        className="profile-img-circle-lg mr-3 mt-1"
                    />
                    <div className="w-100">
                        <div className="d-flex align-items-center justify-content-between mb-1">
                            <div className="primary-text font-weight-bold-600">
                                {props.data.sent_by.name} -{" "}
                                <span className="small font-weight-bold-600">
                                    {props.data.sent_by_admin
                                        ? "Inquel"
                                        : props.data.sent_by_hod
                                        ? "HOD"
                                        : props.data.sent_by_student
                                        ? "Student"
                                        : props.data.sent_by_teacher
                                        ? "Teacher"
                                        : ""}
                                </span>
                            </div>
                            <div className="small text-secondary">
                                {dateFormat(
                                    props.data.sent_on,
                                    "mmmm dS, yyyy"
                                )}
                            </div>
                        </div>
                        <div className="message">{props.data.message}</div>
                    </div>
                </div>
            </Modal.Body>
            <Modal.Footer>
                <button
                    className="btn btn-link btn-sm shadow-none"
                    onClick={props.onHide}
                >
                    Close
                </button>
            </Modal.Footer>
        </Modal>
    );
};

export const NotificationDropdown = (props) => {
    const [showModal, toggleModal] = useState(false);
    const [selected_data, setData] = useState({});
    const notification = useSelector((state) => state.storage.notification);

    useEffect(() => {
        fetchNotification();
        // eslint-disable-next-line
    }, []);

    // useEffect(() => {
    //     const timer = setInterval(() => {
    //         fetchNotification();
    //     }, 10000);
    //     // clearing interval
    //     return () => clearInterval(timer);
    // });

    const fetchNotification = () => {
        fetch(props.url, {
            method: "GET",
            headers: props.headers,
        })
            .then((res) => res.json())
            .then((result) => {
                if (result.sts === true) {
                    storeDispatch(NOTIFICATION, result.data);
                }
            })
            .catch((err) => {
                console.log(err);
            });
    };

    const handleMarkAsRead = () => {
        let body = {
            read_all: true,
            notification_id: "",
        };

        fetch(`${props.url}read/`, {
            method: "POST",
            headers: props.headers,
            body: JSON.stringify(body),
        })
            .then((res) => res.json())
            .then((result) => {
                if (result.sts === true) {
                    fetchNotification();
                }
            })
            .catch((err) => {
                console.log(err);
            });
    };

    return (
        <>
            {showModal ? (
                <NotificationViewModal
                    show={showModal}
                    onHide={() => toggleModal(false)}
                    data={selected_data}
                />
            ) : (
                ""
            )}

            <Dropdown className="notification">
                <Dropdown.Toggle
                    variant="light"
                    className="bg-white border-0 nav-link shadow-none caret-off"
                    id="dropdown-basic"
                >
                    <i className="far fa-bell fa-lg mr-2 mt-2"></i>
                    {notification && notification.length !== 0 ? (
                        <span className="badge">{notification.length}</span>
                    ) : (
                        ""
                    )}
                </Dropdown.Toggle>

                <Dropdown.Menu className="dropdown-menu-down">
                    <Dropdown.Header>
                        {notification && notification.length !== 0 ? (
                            <>
                                <span>
                                    <i className="far fa-bell mr-1"></i>{" "}
                                    Notifications
                                </span>
                                <span
                                    className="mark-all-read"
                                    onClick={() => handleMarkAsRead()}
                                >
                                    Mark all as read!
                                </span>
                            </>
                        ) : (
                            <span className="m-auto">
                                <i className="far fa-bell-slash mr-1"></i> You
                                don't have any notifications!
                            </span>
                        )}
                    </Dropdown.Header>

                    {notification && notification.length !== 0
                        ? (notification || [])
                              .slice(0, 4)
                              .map((list, index) => {
                                  return (
                                      <React.Fragment key={index}>
                                          <Dropdown.Item
                                              onClick={() => {
                                                  setData(list);
                                                  toggleModal(true);
                                              }}
                                          >
                                              <div className="d-flex">
                                                  <img
                                                      src={
                                                          list.sent_by
                                                              .profile_link
                                                              ? list.sent_by
                                                                    .profile_link
                                                              : userpic
                                                      }
                                                      alt={list.sent_by.name}
                                                      className="profile-img-circle-md mr-2 mt-1"
                                                  />
                                                  <div className="w-100">
                                                      <div className="d-flex align-items-center justify-content-between">
                                                          <div className="name">
                                                              {
                                                                  list.sent_by
                                                                      .name
                                                              }{" "}
                                                              -{" "}
                                                              <span>
                                                                  {list.sent_by_admin
                                                                      ? "Inquel"
                                                                      : list.sent_by_hod
                                                                      ? "HOD"
                                                                      : list.sent_by_student
                                                                      ? "Student"
                                                                      : list.sent_by_teacher
                                                                      ? "Teacher"
                                                                      : ""}
                                                              </span>
                                                          </div>
                                                          <div className="date">
                                                              {dateFormat(
                                                                  list.sent_on,
                                                                  "mmmm dS, yyyy"
                                                              )}
                                                          </div>
                                                      </div>
                                                      <div className="message">
                                                          {list.message.substring(
                                                              0,
                                                              34
                                                          )}
                                                          ...
                                                      </div>
                                                  </div>
                                              </div>
                                          </Dropdown.Item>
                                          <Dropdown.Divider className="m-0"></Dropdown.Divider>
                                      </React.Fragment>
                                  );
                              })
                        : ""}

                    {notification && notification.length !== 0 ? (
                        <Link to={`${props.path}/notification`}>
                            <div className="dropdown-footer">
                                See all notifications{" "}
                                <i className="fas fa-arrow-right fa-sm ml-1"></i>
                            </div>
                        </Link>
                    ) : (
                        ""
                    )}
                </Dropdown.Menu>
            </Dropdown>
        </>
    );
};

export const NotificationPage = (props) => {
    const notification = useSelector((state) => state.storage.notification);
    const [isLoading, setLoading] = useState(false);
    const [responseMsg, setResponseMsg] = useState("");
    const [showErrorAlert, setErrorAlert] = useState(false);
    const [showSuccessAlert, setSuccessAlert] = useState(false);

    const fetchNotification = () => {
        fetch(props.url, {
            method: "GET",
            headers: props.headers,
        })
            .then((res) => res.json())
            .then((result) => {
                if (result.sts === true) {
                    storeDispatch(NOTIFICATION, result.data);
                    setLoading(false);
                }
            })
            .catch((err) => {
                console.log(err);
            });
    };

    const handleMarkAsRead = (read_all, data) => {
        setLoading(true);
        let body = {
            read_all: read_all,
            notification_id: "",
        };
        if (read_all === false) {
            body.notification_id = data.notification_id;
        }

        fetch(`${props.url}read/`, {
            method: "POST",
            headers: props.headers,
            body: JSON.stringify(body),
        })
            .then((res) => res.json())
            .then((result) => {
                if (result.sts === true) {
                    fetchNotification();
                } else {
                    setResponseMsg(result.msg);
                    setErrorAlert(true);
                    setLoading(false);
                }
            })
            .catch((err) => {
                console.log(err);
                setResponseMsg("Cannot update notification at the moment!");
                setErrorAlert(true);
                setLoading(false);
            });
    };

    return (
        <>
            {/* Alert message */}
            <AlertBox
                errorMsg={responseMsg}
                successMsg={responseMsg}
                showErrorAlert={showErrorAlert}
                showSuccessAlert={showSuccessAlert}
                toggleSuccessAlert={() => {
                    setSuccessAlert(false);
                }}
                toggleErrorAlert={() => {
                    setErrorAlert(false);
                }}
            />

            <div className="d-flex align-items-center justify-content-between mb-3">
                <span className="font-weight-bold-600 primary-text">
                    <i className="far fa-bell fa-lg mr-2"></i> All Notifications
                </span>
                <button
                    className="btn btn-link btn-sm shadow-none"
                    onClick={() => {
                        handleMarkAsRead(true, notification);
                    }}
                    disabled={
                        notification && notification.length === 0 ? true : false
                    }
                >
                    Mark all as read!
                </button>
            </div>

            {notification && notification.length !== 0 ? (
                <div className="card shadow-sm">
                    {(notification || []).map((list, index) => {
                        return (
                            <React.Fragment key={index}>
                                <div className="card-body">
                                    <div className="d-flex">
                                        <img
                                            src={
                                                list.sent_by.profile_link
                                                    ? list.sent_by.profile_link
                                                    : userpic
                                            }
                                            alt={list.sent_by.name}
                                            className="profile-img-circle-lg mr-3"
                                        />

                                        <div className="w-100">
                                            <div className="d-flex align-items-center justify-content-between mb-1">
                                                <div className="primary-text h6 mb-0">
                                                    {list.sent_by.name} -{" "}
                                                    <span className="small font-weight-bold-600">
                                                        {list.sent_by_admin
                                                            ? "Inquel"
                                                            : list.sent_by_hod
                                                            ? "HOD"
                                                            : list.sent_by_student
                                                            ? "Student"
                                                            : list.sent_by_teacher
                                                            ? "Teacher"
                                                            : ""}
                                                    </span>
                                                </div>
                                                <div className="small text-secondary font-weight-bold-600">
                                                    <i className="far fa-clock"></i>{" "}
                                                    {dateFormat(
                                                        list.sent_on,
                                                        "mmmm dS, yyyy, hh:MM TT"
                                                    )}
                                                </div>
                                            </div>

                                            <div className="d-flex align-items-center">
                                                <div
                                                    className="text-secondary w-100 mr-3"
                                                    style={{
                                                        fontSize: "15px",
                                                    }}
                                                >
                                                    {list.message}
                                                </div>

                                                <OverlayTrigger
                                                    key="top"
                                                    placement="top"
                                                    overlay={
                                                        <Tooltip id="tooltip">
                                                            Mark as read
                                                        </Tooltip>
                                                    }
                                                >
                                                    <button
                                                        className="btn btn-light btn-sm shadow-none"
                                                        onClick={() => {
                                                            handleMarkAsRead(
                                                                false,
                                                                list
                                                            );
                                                        }}
                                                    >
                                                        <i className="far fa-eye fa-sm"></i>
                                                    </button>
                                                </OverlayTrigger>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                {index + 1 < notification.length ? (
                                    <div className="dropdown-divider my-0"></div>
                                ) : (
                                    ""
                                )}
                            </React.Fragment>
                        );
                    })}
                </div>
            ) : (
                <div className="card" style={{ height: "60vh" }}>
                    <div className="card-body d-flex flex-column align-items-center justify-content-center">
                        <h1 className="display-4 text-secondary mb-3">
                            <i className="far fa-bell-slash"></i>
                        </h1>
                        <p className="text-secondary font-weight-bold-600 mb-0">
                            You don't have any notifications!
                        </p>
                    </div>
                </div>
            )}

            {/* Loading component */}
            {isLoading ? <Loading /> : ""}
        </>
    );
};
