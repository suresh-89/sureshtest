import React from "react";
import { Modal } from "react-bootstrap";
import { SUBJECT_THUMBNAIL } from "../../../shared/constant";

const DetailModal = (props) => {
    return (
        <Modal
            show={props.show}
            onHide={props.onHide}
            size="md"
            aria-labelledby="contained-modal-title-vcenter"
            centered
            scrollable
        >
            <Modal.Header
                style={{
                    height: "150px",
                    backgroundImage: `linear-gradient(
                        to right,
                        #000000ef,
                        #000000aa
                    ),url(${
                        props.data.subscription_file_link.subscription_image_1
                            ? props.data.subscription_file_link
                                  .subscription_image_1
                            : SUBJECT_THUMBNAIL
                    })`,
                    backgroundPosition: "center",
                    backgroundSize: "cover",
                    backgroundRepeat: "no-repeat",
                }}
            >
                <div
                    style={{
                        height: "100%",
                        display: "flex",
                        alignItems: "flex-end",
                    }}
                >
                    <h5 className="text-white mb-0">{props.data.title}</h5>
                </div>
                <button
                    className="btn btn-sm shadow-none position-absolute"
                    style={{ right: "10px", top: "10px" }}
                    onClick={props.onHide}
                >
                    <i className="fas fa-times text-white"></i>
                </button>
            </Modal.Header>
            <Modal.Body>
                <p>{props.data.description}</p>
                <div className="d-flex align-items-center">
                    <span className="font-weight-bold light-bg primary-text rounded-pill small py-1 px-2 mr-2">
                        <i className="fas fa-rupee-sign fa-sm"></i>{" "}
                        {props.data.discounted_price}
                    </span>
                    {props.data.discounted_price < props.data.total_price ? (
                        <span
                            className="text-muted small"
                            style={{
                                textDecoration: "line-through",
                            }}
                        >
                            <i className="fas fa-rupee-sign fa-sm"></i>{" "}
                            {props.data.total_price}
                        </span>
                    ) : (
                        ""
                    )}
                </div>
            </Modal.Body>
        </Modal>
    );
};

export default DetailModal;
