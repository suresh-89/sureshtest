import React from "react";
import { PDFViewer, PDFDownloadLink } from "@react-pdf/renderer";
import PDF from "./pdf";
import { baseUrl, studentUrl } from "../../../../shared/baseUrl";
import AlertBox from "../../../common/alert";
import Loading from "../../../common/loader";
import { ErrorBoundary } from "react-error-boundary";
import ErrorFallback from "../../../common/ErrorFallback";

class Component extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            marksheet: {},

            responseMsg: "",
            showErrorAlert: false,
            showSuccessAlert: false,
            page_loading: true,
            visible: false,
        };
        this.subscriptionId = this.props.match.params.subscriptionId;
        this.courseId = this.props.match.params.courseId;
        this.simulationId = this.props.match.params.simulationId;
    }

    componentDidMount = () => {
        fetch(
            `${baseUrl}${studentUrl}/student/sub/${this.subscriptionId}/course/${this.courseId}/simulation/${this.simulationId}/marksheet/`,
            {
                method: "GET",
                headers: {
                    Authorization: localStorage.getItem("Authorization"),
                },
            }
        )
            .then((res) => res.json())
            .then((result) => {
                if (result.sts === true) {
                    this.setState(
                        {
                            marksheet: result.data,
                        },
                        () => {
                            setTimeout(() => {
                                this.setState({
                                    visible: true,
                                    page_loading: false,
                                });
                            }, 2000);
                        }
                    );
                } else {
                    this.setState({
                        responseMsg: result.msg,
                        showErrorAlert: true,
                        page_loading: false,
                    });
                }
            })
            .catch((err) => {
                console.log(err);
                this.setState({
                    responseMsg: "There's a problem in loading marksheet data",
                    showErrorAlert: true,
                    page_loading: false,
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
                    toggleSuccessAlert={() => {
                        this.setState({
                            showSuccessAlert: false,
                        });
                    }}
                    toggleErrorAlert={() => {
                        this.setState({
                            showErrorAlert: false,
                        });
                    }}
                />

                <ErrorBoundary
                    FallbackComponent={ErrorFallback}
                    onReset={() => window.location.reload()}
                >
                    <div
                        className="container-fluid"
                        style={{
                            overflow: "hidden",
                            visibility: this.state.visible
                                ? "visible"
                                : "hidden",
                        }}
                    >
                        <div className="text-right">
                            <PDFDownloadLink
                                document={
                                    <PDF
                                        course_name={this.props.course_name}
                                        profile={this.props.profile}
                                        marksheet={this.state.marksheet}
                                    />
                                }
                                fileName={`${this.props.course_name} marksheet.pdf`}
                            >
                                {({ blob, url, loading, error }) =>
                                    loading ? (
                                        "Loading document..."
                                    ) : (
                                        <button className="btn btn-primary shadow-none my-3">
                                            <i className="fas fa-download fa-sm mr-1"></i>{" "}
                                            Download
                                        </button>
                                    )
                                }
                            </PDFDownloadLink>
                        </div>

                        <PDFViewer style={{ width: "100%", height: "200vh" }}>
                            <PDF
                                course_name={this.props.course_name}
                                profile={this.props.profile}
                                marksheet={this.state.marksheet}
                            />
                        </PDFViewer>
                    </div>
                </ErrorBoundary>

                {/* Loading component */}
                {this.state.page_loading ? <Loading /> : ""}
            </>
        );
    }
}

export default Component;
