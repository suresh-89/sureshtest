import React, { useState } from "react";
import { baseUrl, studentUrl } from "../../../../shared/baseUrl";
import AlertBox from "../../../common/alert";
import Loading from "../../../common/loader";
import { renderToString } from "react-dom/server";
import Template from "./Template";
import { Modal, Spinner, Alert } from "react-bootstrap";
import { connect } from "react-redux";

const mapStateToProps = (state) => ({
    profile: state.user.profile,
});

const ReportModal = (props) => {
    const [mentor_email, setMentorEmail] = useState(props.mentor_email);
    const markup = props.html;

    const [showLoader, setLoader] = useState(false);
    const [responseMsg, setResponseMsg] = useState("");
    const [showErrorAlert, setErrorAlert] = useState(false);
    const [showSuccessAlert, setSuccessAlert] = useState(false);

    const handleSend = () => {
        setLoader(true);
        setErrorAlert(false);
        setSuccessAlert(false);

        if (mentor_email === "") {
            setResponseMsg("Mentor email ID is required!");
            setErrorAlert(true);
            setLoader(false);
        } else {
            fetch(`${baseUrl}${studentUrl}/student/testanalysisreport/`, {
                method: "POST",
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json",
                    Authorization: localStorage.getItem("Authorization"),
                },
                body: JSON.stringify({
                    mentor_email,
                    data: markup,
                }),
            })
                .then((res) => res.json())
                .then((result) => {
                    if (result.sts === true && result.mail_sent === true) {
                        setResponseMsg("Report send to mentor successfully!");
                        setSuccessAlert(true);
                        setLoader(false);
                        setTimeout(() => {
                            props.onHide();
                        }, 1500);
                    } else if (result.sts === false) {
                        setResponseMsg(result.msg);
                        setErrorAlert(true);
                        setLoader(false);
                    }
                })
                .catch((err) => {
                    console.log(err);
                    setResponseMsg("Something went wrong!");
                    setErrorAlert(true);
                    setLoader(false);
                });
        }
    };

    return (
        <Modal
            show={props.show}
            onHide={props.onHide}
            size="md"
            aria-labelledby="contained-modal-title-vcenter"
            centered
        >
            <Modal.Header closeButton>Send report</Modal.Header>
            <Modal.Body>
                <Alert
                    variant="danger"
                    show={showErrorAlert}
                    onClose={() => setErrorAlert(false)}
                    dismissible
                >
                    {responseMsg}
                </Alert>
                <Alert
                    variant="success"
                    show={showSuccessAlert}
                    onClose={() => setSuccessAlert(false)}
                    dismissible
                >
                    {responseMsg}
                </Alert>

                <label htmlFor="mentor_email">Mentor email ID</label>
                <input
                    type="text"
                    name="mentor_email"
                    id="mentor_email"
                    placeholder="Enter mentor email"
                    className="form-control borders"
                    onChange={(event) => setMentorEmail(event.target.value)}
                    value={mentor_email}
                    autoComplete="off"
                />
            </Modal.Body>
            <Modal.Footer>
                <button
                    className="btn btn-primary btn-block shadow-none"
                    onClick={handleSend}
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
                        <i className="far fa-paper-plane mr-2"></i>
                    )}{" "}
                    Send report
                </button>
            </Modal.Footer>
        </Modal>
    );
};

function TestReport(props) {
    const [responseMsg, setResponseMsg] = useState("");
    const [showErrorAlert, setErrorAlert] = useState(false);
    const [showSuccessAlert, setSuccessAlert] = useState(false);
    const [page_loading, setPageLoading] = useState(false);
    const [showModal, toggleModal] = useState(false);
    const [markup, setMarkup] = useState();

    const sendReport = () => {
        setPageLoading(true);
        setErrorAlert(false);
        setSuccessAlert(false);

        try {
            const html = renderToString(<Template {...props} />);
            setMarkup(html);

            toggleModal(true);
            setPageLoading(false);
        } catch (error) {
            console.log(error);
            setResponseMsg("Cannot generate report at the moment!");
            setErrorAlert(true);
            setPageLoading(false);
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
                toggleSuccessAlert={() => {
                    setSuccessAlert(false);
                }}
                toggleErrorAlert={() => {
                    setErrorAlert(false);
                }}
            />

            {showModal && (
                <ReportModal
                    show={showModal}
                    onHide={() => toggleModal(false)}
                    html={markup}
                    mentor_email={props.profile.mentor_email}
                />
            )}

            <div className="text-right mb-3">
                <button
                    className="btn btn-primary shadow-none"
                    onClick={sendReport}
                >
                    <i className="fas fa-file-alt mr-1"></i> Generate report
                </button>
            </div>

            {/* Loading component */}
            {page_loading ? <Loading /> : ""}
        </>
    );
}

export default connect(mapStateToProps)(TestReport);
