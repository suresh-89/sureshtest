import React, { useEffect, useState } from "react";
import { Modal } from "react-bootstrap";

export default function ExplanationModal(props) {
    const [data, setData] = useState("");

    useEffect(() => {
        async function fetchData() {
            await setData(props.data);
        }
        fetchData();
        window.MathJax.typeset();
    });

    return (
        <Modal
            show={props.show}
            onHide={props.onHide}
            size="lg"
            aria-labelledby="contained-modal-title-vcenter"
            centered
            scrollable
        >
            <Modal.Header closeButton>Explanation</Modal.Header>
            <Modal.Body>
                <div style={{ minHeight: "50vh" }}>
                    <div
                        dangerouslySetInnerHTML={{
                            __html: data,
                        }}
                    ></div>
                </div>
            </Modal.Body>
        </Modal>
    );
}
