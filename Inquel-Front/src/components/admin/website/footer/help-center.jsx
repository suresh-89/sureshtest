import React, { useState } from "react";
import { baseUrl, inquelAdminUrl } from "../../../../shared/baseUrl.js";
import Loading from "../../../common/loader";
import AlertBox from "../../../common/alert";
import CKeditor from "../../../common/CKEditor.jsx";
import {
    Accordion,
    Card,
    Dropdown,
    Modal,
    Alert,
    Spinner,
} from "react-bootstrap";
import { SingleContentDeleteModal } from "../../../common/modal/contentManagementModal.jsx";
import ReactSwitch from "../../../common/switchComponent";

const FAQModal = (props) => {
    const help_center_id = props.data.help_center_id || "";
    const [question, setQuestion] = useState(props.data.question || "");
    const [answer, setAnswer] = useState(props.data.answer || "");

    const [responseMsg, setResponseMsg] = useState("");
    const [showErrorAlert, setErrorAlert] = useState(false);
    const [showSuccessAlert, setSuccessAlert] = useState(false);
    const [showLoader, setLoader] = useState(false);

    const handleSubmit = () => {
        setLoader(true);
        setErrorAlert(false);
        setSuccessAlert(false);

        if (question === "") {
            setResponseMsg("Question is required!");
            setErrorAlert(true);
            setLoader(false);
        } else if (answer === "") {
            setResponseMsg("Answer is required!");
            setErrorAlert(true);
            setLoader(false);
        } else {
            if (help_center_id === "") {
                fetch(`${baseUrl}${inquelAdminUrl}/helpcenter/`, {
                    method: "POST",
                    headers: {
                        Accept: "application/json",
                        "Content-Type": "application/json",
                        "Inquel-Auth": localStorage.getItem("Inquel-Auth"),
                    },
                    body: JSON.stringify({
                        question,
                        answer,
                    }),
                })
                    .then((res) => res.json())
                    .then((result) => {
                        if (result.sts === true) {
                            setResponseMsg(result.msg);
                            setSuccessAlert(true);
                            setLoader(false);
                            props.onModalSuccess();
                        } else {
                            setResponseMsg(result.msg);
                            setErrorAlert(true);
                            setLoader(false);
                        }
                    })
                    .catch((err) => {
                        console.log(err);
                        setResponseMsg(
                            "There is a problem in adding help center at the moment!"
                        );
                        setErrorAlert(true);
                        setLoader(false);
                    });
            } else {
                fetch(`${baseUrl}${inquelAdminUrl}/helpcenter/`, {
                    method: "PUT",
                    headers: {
                        Accept: "application/json",
                        "Content-Type": "application/json",
                        "Inquel-Auth": localStorage.getItem("Inquel-Auth"),
                    },
                    body: JSON.stringify({
                        question,
                        answer,
                        help_center_id,
                    }),
                })
                    .then((res) => res.json())
                    .then((result) => {
                        if (result.sts === true) {
                            setResponseMsg(result.msg);
                            setSuccessAlert(true);
                            setLoader(false);
                            props.onModalSuccess();
                        } else {
                            setResponseMsg(result.msg);
                            setErrorAlert(true);
                            setLoader(false);
                        }
                    })
                    .catch((err) => {
                        console.log(err);
                        setResponseMsg(
                            "There is a problem in updating help center at the moment!"
                        );
                        setErrorAlert(true);
                        setLoader(false);
                    });
            }
        }
    };

    return (
        <Modal show={props.show} onHide={props.onHide} size="xl" centered>
            <Modal.Header closeButton>FAQ Modal</Modal.Header>
            <Modal.Body>
                <Alert
                    variant="danger"
                    show={showErrorAlert}
                    onClose={() => {
                        setErrorAlert(false);
                    }}
                    dismissible
                >
                    {responseMsg}
                </Alert>
                <Alert
                    variant="success"
                    show={showSuccessAlert}
                    onClose={() => {
                        setSuccessAlert(false);
                    }}
                    dismissible
                >
                    {responseMsg}
                </Alert>

                <div className="form-group">
                    <input
                        type="text"
                        name="question"
                        id="question"
                        className="form-control form-control-lg border-secondary"
                        placeholder="Enter question here..."
                        onChange={(event) => setQuestion(event.target.value)}
                        value={question}
                        autoComplete="off"
                    />
                </div>
                <CKeditor
                    data={answer}
                    onChange={(event) => setAnswer(event.editor.getData())}
                />
            </Modal.Body>
            <Modal.Footer>
                <button
                    className="btn btn-primary btn-block shadow-none"
                    onClick={handleSubmit}
                >
                    {showLoader ? (
                        <Spinner
                            as="span"
                            animation="border"
                            size="sm"
                            role="status"
                            aria-hidden="true"
                            className="mr-2"
                        />
                    ) : (
                        ""
                    )}
                    {help_center_id ? "Update" : "Add"}
                </button>
            </Modal.Footer>
        </Modal>
    );
};

class HelpCenter extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            activeKey: "",
            data: [],
            is_active: false,

            selectedData: {},
            showModal: false,
            showDeleteModal: false,

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
        this.loadHelpCenter();
    };

    loadHelpCenter = () => {
        fetch(`${this.url}/helpcenter/`, {
            method: "GET",
            headers: this.headers,
        })
            .then((res) => res.json())
            .then((result) => {
                if (result.sts === true) {
                    this.setState({
                        data: result.data,
                        is_active: result.data && result.data.length !== 0 ? result.data[0].is_active : false,
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

    onModalSuccess = () => {
        setTimeout(() => {
            this.setState({
                selectedData: {},
                showModal: false,
                showDeleteModal: false,
            });
        }, 1000);
        this.loadHelpCenter();
    };

    handleStatus = () => {
        this.setState({
            isLoading: true,
            showSuccessAlert: false,
            showErrorAlert: false,
        });

        fetch(`${this.url}/helpcenter/`, {
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

                {this.state.showModal ? (
                    <FAQModal
                        show={this.state.showModal}
                        onHide={() =>
                            this.setState({
                                showModal: false,
                            })
                        }
                        data={this.state.selectedData}
                        onModalSuccess={this.onModalSuccess}
                    />
                ) : (
                    ""
                )}

                {this.state.showDeleteModal ? (
                    <SingleContentDeleteModal
                        show={this.state.showDeleteModal}
                        onHide={() =>
                            this.setState({
                                showDeleteModal: false,
                            })
                        }
                        formSubmission={this.onModalSuccess}
                        url={`${this.url}/helpcenter/`}
                        name=""
                        data={{
                            help_center_id:
                                this.state.selectedData.help_center_id,
                        }}
                        type="FAQ"
                    />
                ) : (
                    ""
                )}

                <div className="card-header mb-2">
                    <div className="row align-items-center">
                        <div className="col-6 h5">Help center</div>
                        <div className="col-6 d-flex align-items-center justify-content-end">
                            <span className="mr-2">Status</span>
                            <ReactSwitch
                                checked={this.state.is_active}
                                onChange={this.handleStatus}
                            />
                            <button
                                className="btn btn-primary btn-sm shadow-none ml-3"
                                onClick={() =>
                                    this.setState({
                                        showModal: true,
                                    })
                                }
                            >
                                <i className="fas fa-plus fa-sm mr-1"></i>{" "}
                                Create new
                            </button>
                        </div>
                    </div>
                </div>

                {/* card body */}
                <div className="card-body">
                    <Accordion>
                        {(this.state.data || []).map((list, index) => {
                            return (
                                <div
                                    className="bg-white rounded-lg border mb-2"
                                    key={index}
                                >
                                    <Accordion.Toggle
                                        as={Card}
                                        eventKey={index + 1}
                                        className={`${
                                            this.state.activeKey === index + 1
                                                ? "text-danger"
                                                : "text-dark"
                                        }`}
                                        style={{
                                            padding: "20px",
                                            cursor: "default",
                                        }}
                                        onClick={() => {
                                            if (
                                                this.state.activeKey ===
                                                index + 1
                                            ) {
                                                this.setState({
                                                    activeKey: "",
                                                });
                                            } else {
                                                this.setState({
                                                    activeKey: index + 1,
                                                });
                                            }
                                        }}
                                    >
                                        <div className="row align-items-center">
                                            <div className="col-11 col-md-10">
                                                {this.state.activeKey ===
                                                index + 1 ? (
                                                    <i className="fas fa-minus mr-2"></i>
                                                ) : (
                                                    <i className="fas fa-plus mr-2"></i>
                                                )}{" "}
                                                {list.question}
                                            </div>
                                            <div className="col-1 col-md-2 d-flex justify-content-end align-items-center">
                                                <Dropdown>
                                                    <Dropdown.Toggle
                                                        variant="white"
                                                        className="btn bg-white btn-sm shadow-none caret-off ml-2"
                                                    >
                                                        <i className="fas fa-ellipsis-v"></i>
                                                    </Dropdown.Toggle>

                                                    <Dropdown.Menu>
                                                        <Dropdown.Item
                                                            onClick={() =>
                                                                this.setState({
                                                                    selectedData:
                                                                        list,
                                                                    showModal: true,
                                                                })
                                                            }
                                                        >
                                                            <i className="far fa-edit mr-1"></i>{" "}
                                                            Edit
                                                        </Dropdown.Item>
                                                        <Dropdown.Item
                                                            onClick={(data) =>
                                                                this.setState({
                                                                    selectedData:
                                                                        list,
                                                                    showDeleteModal: true,
                                                                })
                                                            }
                                                        >
                                                            <i className="far fa-trash-alt mr-1"></i>{" "}
                                                            Delete
                                                        </Dropdown.Item>
                                                    </Dropdown.Menu>
                                                </Dropdown>
                                            </div>
                                        </div>
                                    </Accordion.Toggle>

                                    <Accordion.Collapse eventKey={index + 1}>
                                        <Card.Body
                                            className="text-dark pt-0"
                                            style={{
                                                fontSize: "15px",
                                                lineHeight: "25px",
                                            }}
                                            dangerouslySetInnerHTML={{
                                                __html: list.answer,
                                            }}
                                        ></Card.Body>
                                    </Accordion.Collapse>
                                </div>
                            );
                        })}
                    </Accordion>
                </div>

                {/* Loading component */}
                {this.state.isLoading ? <Loading /> : ""}
            </>
        );
    }
}

export default HelpCenter;
