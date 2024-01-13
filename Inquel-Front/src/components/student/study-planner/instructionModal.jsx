import React from "react";
import { Modal } from "react-bootstrap";

export function InstructionModal(props) {
    return (
        <Modal
            show={props.show}
            onHide={props.onHide}
            size="lg"
            aria-labelledby="contained-modal-title-vcenter"
            centered
            scrollable
        >
            <Modal.Header closeButton>Instructions</Modal.Header>
            <Modal.Body>
                <div style={{ minHeight: "50vh" }}>
                    <div dangerouslySetInnerHTML={{ __html: props.data }}></div>
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
}
