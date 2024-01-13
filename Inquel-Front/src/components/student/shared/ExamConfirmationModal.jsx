import React from "react";
import { Modal } from "react-bootstrap";

const ConfirmationModal = (props) => {
    return (
        <Modal
            show={props.show}
            onHide={props.onHide}
            size="md"
            backdrop="static"
        >
            <Modal.Header
                className="border-0 pb-0 pt-1"
                closeButton
            ></Modal.Header>
            <Modal.Body className="pt-0">
                <h1 className="text-center text-warning display-4 mb-3">
                    <i className="fas fa-exclamation-triangle"></i>
                </h1>
                <p
                    className="text-center font-weight-bold-600 mb-2"
                    style={{ fontSize: "22px" }}
                >
                    Leave page?
                </p>
                <p className="text-center mb-0">
                    You cannot leave the page without submitting the exam,
                    please submit before leaving...
                </p>
            </Modal.Body>
            <Modal.Footer className="w-100 border-0 mb-2">
                <div className="form-row w-100">
                    <div className="col-6">
                        <button
                            className="btn btn-outline-secondary btn-block shadow-none"
                            onClick={props.onHide}
                        >
                            No, continue
                        </button>
                    </div>
                    <div className="col-6">
                        <button
                            className="btn btn-primary btn-block shadow-none"
                            onClick={props.submit}
                        >
                            <i className="far fa-check-circle mr-1"></i> Yes,
                            submit
                        </button>
                    </div>
                </div>
            </Modal.Footer>
        </Modal>
    );
};

export default ConfirmationModal;
