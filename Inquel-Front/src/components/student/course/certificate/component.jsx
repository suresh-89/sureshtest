import React, { useEffect, useState } from "react";
import { PDFViewer, PDFDownloadLink } from "@react-pdf/renderer";
import PDF from "./pdf";
import { baseUrl, studentUrl } from "../../../../shared/baseUrl";
import AlertBox from "../../../common/alert";
import Loading from "../../../common/loader";
import { Link } from "react-router-dom";

function Component(props) {
    const subscriptionId = props.match.params.subscriptionId;
    const courseId = props.match.params.courseId;

    const [certificate, setCertificateData] = useState({});
    const [responseMsg, setReponseMsg] = useState("");
    const [showErrorAlert, setErrorAlert] = useState(false);
    const [showSuccessAlert, setSuccessAlert] = useState(false);
    const [page_loading, setPageLoading] = useState(true);
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        fetch(
            `${baseUrl}${studentUrl}/student/sub/${subscriptionId}/course/${courseId}/certificate/`,
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
                    setCertificateData(result.data);

                    setTimeout(() => {
                        setVisible(true);
                        setPageLoading(false);
                    }, 4000);
                } else {
                    setReponseMsg(result.msg);
                    setErrorAlert(true);
                    setPageLoading(false);
                }
            })
            .catch((err) => {
                console.log(err);
                setReponseMsg("There's a problem in loading certificate data");
                setErrorAlert(true);
                setPageLoading(false);
            });

        // eslint-disable-next-line
    }, []);

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

            <Link
                to={`/dashboard/subscription/${subscriptionId}/course/${courseId}`}
            >
                <button className="btn btn-primary-invert btn-sm shadow-none">
                    <i className="fas fa-chevron-left fa-sm"></i> Back
                </button>
            </Link>

            {certificate.course_completed === true ||
            certificate.chapters_completed > 0 ? (
                <div
                    style={{
                        overflow: "hidden",
                        visibility: visible ? "visible" : "hidden",
                    }}
                >
                    <div className="text-right">
                        <PDFDownloadLink
                            document={
                                <PDF
                                    course_name={props.course_name}
                                    certificate={certificate}
                                />
                            }
                            fileName={`${props.course_name} certificate.pdf`}
                        >
                            {({ blob, url, loading, error }) =>
                                loading ? (
                                    "Loading document..."
                                ) : (
                                    <button className="btn btn-primary shadow-none mb-3">
                                        <i className="fas fa-download fa-sm mr-1"></i>{" "}
                                        Download
                                    </button>
                                )
                            }
                        </PDFDownloadLink>
                    </div>

                    <PDFViewer style={{ width: "100%", height: "150vh" }}>
                        <PDF
                            course_name={props.course_name}
                            certificate={certificate}
                        />
                    </PDFViewer>
                </div>
            ) : page_loading === false ? (
                <p className="text-center">
                    Complete your course to generate certificate
                </p>
            ) : (
                ""
            )}

            {/* Loading component */}
            {page_loading ? <Loading /> : ""}
        </>
    );
}

export default Component;
