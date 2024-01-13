import React, { Component } from "react";
import { Modal, Tab, Nav } from "react-bootstrap";
const ReactPlayer = React.lazy(() => import("react-player"));

class FileModal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            image: this.props.image,
            video: this.props.video,
            audio: this.props.audio,
            selectedImage: 0,
            selectedImageData: this.props.image[0],
            activeTab: "image",
        };
    }

    changeImage = (index) => {
        const image = this.state.image;
        this.setState({
            selectedImage: index,
            selectedImageData: image[index],
        });
    };

    toggleNav = (type) => {
        this.setState({
            activeTab: type,
        });
    };

    render() {
        return (
            <Modal
                show={this.props.show}
                onHide={this.props.onHide}
                backdrop="static"
                size="lg"
                aria-labelledby="contained-modal-title-vcenter"
                centered
            >
                <Modal.Header closeButton>Uploaded Files</Modal.Header>
                <Modal.Body className="py-0">
                    <Tab.Container
                        id="left-tabs-example"
                        defaultActiveKey="image"
                    >
                        <div className="row">
                            <div
                                className="col-md-3 py-3 mb-3 mb-md-0"
                                style={{ borderRight: "1px solid #ccc" }}
                            >
                                <Nav variant="pills" className="flex-column">
                                    <Nav.Item
                                        className="primary-nav-item"
                                        onClick={() => this.toggleNav("image")}
                                    >
                                        <Nav.Link eventKey="image">
                                            Image
                                        </Nav.Link>
                                    </Nav.Item>
                                    <Nav.Item
                                        className="primary-nav-item"
                                        onClick={() => this.toggleNav("video")}
                                    >
                                        <Nav.Link eventKey="video">
                                            Video
                                        </Nav.Link>
                                    </Nav.Item>
                                    <Nav.Item
                                        className="primary-nav-item"
                                        onClick={() => this.toggleNav("audio")}
                                    >
                                        <Nav.Link eventKey="audio">
                                            Audio
                                        </Nav.Link>
                                    </Nav.Item>
                                </Nav>
                            </div>
                            <div className="col-md-9 py-3">
                                {/* Image tab */}
                                {this.state.activeTab === "image" ? (
                                    <div className="row justify-content-center">
                                        <div className="col-md-10">
                                            <div className="card">
                                                {/* Single image view */}
                                                <div className="card-body text-center p-0">
                                                    <img
                                                        src={
                                                            this.state
                                                                .selectedImageData
                                                                .path
                                                        }
                                                        alt={
                                                            this.state
                                                                .selectedImageData
                                                                .file_name
                                                        }
                                                        className="img-fluid rounded-lg"
                                                    />
                                                    <div className="card-body primary-text font-weight-bold-600 text-center small p-2">
                                                        {
                                                            this.state
                                                                .selectedImageData
                                                                .title
                                                        }
                                                    </div>
                                                </div>
                                                {/* Thumbnails */}
                                                <div className="card-footer px-0">
                                                    <div className="row justify-content-center">
                                                        {this.state.image.map(
                                                            (images, index) => {
                                                                return images.path !==
                                                                    "" ? (
                                                                    <div
                                                                        key={
                                                                            index
                                                                        }
                                                                        className="col-md-3"
                                                                    >
                                                                        <div
                                                                            className={`card preview-img-sm shadow-sm ${
                                                                                this
                                                                                    .state
                                                                                    .selectedImage ===
                                                                                index
                                                                                    ? "border-primary"
                                                                                    : ""
                                                                            }`}
                                                                            style={{
                                                                                backgroundImage: `url(${images.path})`,
                                                                            }}
                                                                            onClick={() =>
                                                                                this.changeImage(
                                                                                    index
                                                                                )
                                                                            }
                                                                        ></div>
                                                                    </div>
                                                                ) : null;
                                                            }
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ) : null}

                                {/* Video tab */}
                                {this.state.activeTab === "video" ? (
                                    <div className="card">
                                        {this.state.video.path !== "" ? (
                                            <React.Suspense
                                                fallback={<div>Loading...</div>}
                                            >
                                                <ReactPlayer
                                                    url={this.state.video.path}
                                                    controls={true}
                                                    className="react-player"
                                                    width="100%"
                                                />
                                                <p className="mt-3">
                                                    If video doesn't start
                                                    playing,{" "}
                                                    <a
                                                        href={
                                                            this.state.video
                                                                .path
                                                        }
                                                        target="_blank"
                                                        rel="noreferrer"
                                                    >
                                                        Click here
                                                    </a>{" "}
                                                    to view the video in a
                                                    seperate tab
                                                </p>
                                            </React.Suspense>
                                        ) : (
                                            "Video not uploaded..."
                                        )}
                                    </div>
                                ) : null}

                                {/* Audio tab */}
                                {this.state.activeTab === "audio"
                                    ? this.state.audio.map((item, index) => {
                                          return item.path !== "" ? (
                                              <audio
                                                  key={index}
                                                  src={item.path}
                                                  controls
                                                  controlsList="nodownload"
                                              ></audio>
                                          ) : (
                                              ""
                                          );
                                      })
                                    : null}
                            </div>
                        </div>
                    </Tab.Container>
                </Modal.Body>
            </Modal>
        );
    }
}

export default FileModal;
