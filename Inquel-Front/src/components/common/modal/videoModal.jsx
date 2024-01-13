import React from "react";
import { Modal } from "react-bootstrap";
const ReactPlayer = React.lazy(() => import("react-player"));

export default function VideoModal(props) {
    return (
        <Modal
            show={props.show}
            onHide={props.onHide}
            size="lg"
            aria-labelledby="contained-modal-title-vcenter"
            centered
        >
            <Modal.Header closeButton>{props.video.title}</Modal.Header>
            <Modal.Body>
                <React.Suspense fallback={<div>Loading...</div>}>
                    <div className="card">
                        <ReactPlayer
                            url={props.video.path}
                            controls={true}
                            className="react-player"
                            width="100%"
                        />
                        <p className="mt-3 mb-0">
                            If video doesn't start playing,{" "}
                            <a
                                href={props.video.path}
                                target="_blank"
                                rel="noreferrer"
                            >
                                Click here
                            </a>{" "}
                            to view the video in a seperate tab
                        </p>
                    </div>
                </React.Suspense>
            </Modal.Body>
        </Modal>
    );
}
