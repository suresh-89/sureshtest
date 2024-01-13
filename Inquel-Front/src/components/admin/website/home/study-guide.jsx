import React, { useState } from "react";
import { baseUrl, inquelAdminUrl } from "../../../../shared/baseUrl.js";
import Loading from "../../../common/loader";
import AlertBox from "../../../common/alert";
import {
    Accordion,
    Card,
    Dropdown,
    Modal,
    Spinner,
    Alert,
} from "react-bootstrap";
import { SingleContentDeleteModal } from "../../../common/modal/contentManagementModal";
import storeDispatch from "../../../../redux/dispatch/index.js";
import { STUDY_GUIDE } from "../../../../redux/action/index.js";

const StudyGuideModal = (props) => {
    const [title, setTitle] = useState(props.data.guide_name || "");
    const [url, setURL] = useState(props.data.guide_url || "");
    const guide_id = props.data.guide_id || "";
    const parent_id = props.parent_id || "";
    const ancestor = props.ancestor || "";

    const [responseMsg, setResponseMsg] = useState("");
    const [showErrorAlert, setErrorAlert] = useState(false);
    const [showSuccessAlert, setSuccessAlert] = useState(false);
    const [showLoader, setLoader] = useState(false);

    const handleSubmit = () => {
        setLoader(true);
        setErrorAlert(false);
        setSuccessAlert(false);

        if (title === "") {
            setResponseMsg("Title is required!");
            setErrorAlert(true);
            setLoader(false);
        } else {
            if (guide_id === "") {
                fetch(`${baseUrl}${inquelAdminUrl}/studyguide/`, {
                    method: "POST",
                    headers: {
                        Accept: "application/json",
                        "Content-Type": "application/json",
                        "Inquel-Auth": localStorage.getItem("Inquel-Auth"),
                    },
                    body: JSON.stringify({
                        guide_name: title,
                        guide_url: url,
                        parent_id: parent_id,
                        ancestor: ancestor,
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
                            "There is a problem in adding study guide at the moment!"
                        );
                        setErrorAlert(true);
                        setLoader(false);
                    });
            } else {
                fetch(`${baseUrl}${inquelAdminUrl}/studyguide/`, {
                    method: "PUT",
                    headers: {
                        Accept: "application/json",
                        "Content-Type": "application/json",
                        "Inquel-Auth": localStorage.getItem("Inquel-Auth"),
                    },
                    body: JSON.stringify({
                        guide_name: title,
                        guide_url: url,
                        guide_id: guide_id,
                        parent_id: parent_id,
                        ancestor: ancestor,
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
                            "There is a problem in updating study guide at the moment!"
                        );
                        setErrorAlert(true);
                        setLoader(false);
                    });
            }
        }
    };

    return (
        <Modal show={props.show} onHide={props.onHide} size="md" centered>
            <Modal.Header closeButton>Study guide</Modal.Header>
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
                    <label htmlFor="title">Title</label>
                    <input
                        type="text"
                        name="title"
                        id="title"
                        className="form-control form-control-lg border-secondary"
                        placeholder="Enter title here..."
                        onChange={(event) => setTitle(event.target.value)}
                        value={title}
                        autoComplete="off"
                    />
                </div>
                <label htmlFor="url">URL</label>
                <input
                    type="text"
                    name="url"
                    id="url"
                    className="form-control form-control-lg border-secondary"
                    placeholder="Enter url here..."
                    onChange={(event) => setURL(event.target.value)}
                    value={url}
                    autoComplete="off"
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
                    {guide_id ? "Update" : "Add"}
                </button>
            </Modal.Footer>
        </Modal>
    );
};

const StudyGuideAccordion = (props) => {
    const [isCollapsed, toggleCollapse] = useState(false);

    const nestedTopics = (props.data.child || []).map((child, index) => {
        return (
            <Accordion key={index}>
                <StudyGuideAccordion
                    data={child}
                    handleAdd={props.handleAdd}
                    handleEdit={props.handleEdit}
                    handleDelete={props.handleDelete}
                />
            </Accordion>
        );
    });

    return (
        <>
            <div className="border rounded py-2 px-3 mb-2">
                <Accordion.Toggle
                    as={Card}
                    eventKey={`${props.data.guide_id}`}
                    onClick={() => {
                        if (props.data.child.length !== 0) {
                            toggleCollapse(!isCollapsed);
                        }
                    }}
                >
                    <div className="row align-items-center justify-content-between">
                        <div className="col-10">
                            <div className="d-flex align-items-center">
                                <div className="mr-3">
                                    {props.data.child.length !== 0 ? (
                                        <div>
                                            <i
                                                className={`fas fa-chevron-down ${
                                                    isCollapsed
                                                        ? "fa-rotate-360"
                                                        : "fa-rotate-270"
                                                }`}
                                            ></i>
                                        </div>
                                    ) : (
                                        ""
                                    )}
                                </div>
                                <div className="w-100">
                                    <p
                                        className="font-weight-bold-600 mr-2 mb-0"
                                        style={{ fontSize: "14px" }}
                                    >
                                        {props.data.guide_name}
                                    </p>
                                    {props.data.guide_url ? (
                                        <p className="text-truncate w-100 mb-0">
                                            <a
                                                href={props.data.guide_url}
                                                target="_blank"
                                                rel="noreferrer"
                                                className="small text-secondary"
                                                onClick={(e) =>
                                                    e.stopPropagation()
                                                }
                                                title={props.data.guide_url}
                                            >
                                                {props.data.guide_url}
                                            </a>
                                        </p>
                                    ) : (
                                        ""
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="col-2 d-flex justify-content-end align-items-center">
                            <Dropdown
                                drop="left"
                                key="left"
                                onClick={(e) => e.stopPropagation()}
                            >
                                <Dropdown.Toggle
                                    variant="white"
                                    className="btn btn-light btn-sm shadow-none caret-off ml-2"
                                >
                                    <i className="fas fa-ellipsis-v"></i>
                                </Dropdown.Toggle>

                                <Dropdown.Menu>
                                    <Dropdown.Item
                                        onClick={() =>
                                            props.handleAdd(
                                                props.data.ancestor,
                                                props.data.guide_id
                                            )
                                        }
                                    >
                                        <i className="fas fa-plus fa-sm mr-1"></i>{" "}
                                        Add
                                    </Dropdown.Item>
                                    <Dropdown.Item
                                        onClick={() =>
                                            props.handleEdit(
                                                props.data,
                                                props.data.ancestor,
                                                props.data.parent_id
                                            )
                                        }
                                    >
                                        <i className="far fa-edit fa-sm mr-1"></i>{" "}
                                        Edit
                                    </Dropdown.Item>
                                    <Dropdown.Item
                                        onClick={() =>
                                            props.handleDelete(props.data)
                                        }
                                    >
                                        <i className="far fa-trash-alt fa-sm mr-1"></i>{" "}
                                        Delete
                                    </Dropdown.Item>
                                </Dropdown.Menu>
                            </Dropdown>
                        </div>
                    </div>
                </Accordion.Toggle>
            </div>

            <Accordion.Collapse
                eventKey={`${props.data.guide_id}`}
                className="ml-2"
            >
                <div>{nestedTopics}</div>
            </Accordion.Collapse>
        </>
    );
};

class StudyGuide extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            study_guide: [],
            selectedData: {},
            ancestor: "",
            parent_id: "",
            showModal: false,
            showDeleteModal: false,

            isLoading: true,
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
        this.loadStudyGuide();
    };

    loadStudyGuide = () => {
        fetch(`${this.url}/studyguide/`, {
            method: "GET",
            headers: this.headers,
        })
            .then((res) => res.json())
            .then((result) => {
                if (result.sts === true) {
                    this.setState({
                        study_guide: result.data,
                        isLoading: false,
                    });
                    storeDispatch(STUDY_GUIDE, result.data);
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
                ancestor: "",
                parent_id: "",
                selectedData: {},
                showModal: false,
                showDeleteModal: false,
            });
        }, 1000);
        this.loadStudyGuide();
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
                    <StudyGuideModal
                        show={this.state.showModal}
                        onHide={() =>
                            this.setState({
                                showModal: false,
                            })
                        }
                        data={this.state.selectedData}
                        ancestor={this.state.ancestor}
                        parent_id={this.state.parent_id}
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
                        url={`${this.url}/studyguide/`}
                        name={this.state.selectedData.guide_name}
                        data={{
                            guide_id: this.state.selectedData.guide_id,
                            ancestor: this.state.selectedData.ancestor,
                        }}
                        type="study guide"
                    />
                ) : (
                    ""
                )}

                <div className="card-header h5 mb-2">
                    <div className="row">
                        <div className="col-6">Study guide</div>
                        <div className="col-6 text-right">
                            <button
                                className="btn btn-primary btn-sm shadow-none"
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
                    {(this.state.study_guide || []).map((item, index) => {
                        return (
                            <Accordion key={index}>
                                <StudyGuideAccordion
                                    data={item}
                                    handleAdd={(ancestor, guide_id) =>
                                        this.setState({
                                            ancestor: ancestor,
                                            parent_id: guide_id,
                                            showModal: true,
                                        })
                                    }
                                    handleEdit={(data, ancestor, parent_id) =>
                                        this.setState({
                                            ancestor: ancestor,
                                            parent_id: parent_id,
                                            selectedData: data,
                                            showModal: true,
                                        })
                                    }
                                    handleDelete={(data) =>
                                        this.setState({
                                            selectedData: data,
                                            showDeleteModal: true,
                                        })
                                    }
                                />
                            </Accordion>
                        );
                    })}
                </div>

                {/* Loading component */}
                {this.state.isLoading ? <Loading /> : ""}
            </>
        );
    }
}

export default StudyGuide;
