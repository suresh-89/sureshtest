import React, { useState, useEffect } from "react";
import Header from "../shared/navbar";
import Footer from "../shared/footer";
import { ErrorBoundary } from "react-error-boundary";
import ErrorFallback from "../../common/ErrorFallback";
import Loading from "../../common/loader";
import { Accordion, Card } from "react-bootstrap";
import { Link } from "react-router-dom";
import { baseUrl, homeURL } from "../../../shared/baseUrl";
import { TawkTo, ToggleTawkTo } from "../../common/function/TawktoChatWidget";

const HelpCenter = () => {
    const [activeKey, setActiveKey] = useState();
    const [data, setData] = useState([]);
    const [isLoading, setLoading] = useState(true);

    useEffect(() => {
        document.title = "Help center | IQ Labs Academy";
        window.scrollTo(0, 0);

        fetch(`${baseUrl}${homeURL}/helpcenter/`, {
            method: "GET",
        })
            .then((res) => res.json())
            .then((result) => {
                if (result.sts === true) {
                    setData(result.data);
                    setLoading(false);
                }
            })
            .catch((err) => {
                console.log(err);
            });

        // Initialize tawk-to chat widget
        TawkTo();
        setTimeout(() => {
            ToggleTawkTo("show");
        }, 100);

        return () => {
            // Toggle tawk-to chat widget
            ToggleTawkTo("hide");
        };
    }, []);

    return (
        <>
            <Header />

            <header className="jumbotron">
                <h1 className="mb-0">Help center</h1>
            </header>

            <ErrorBoundary
                FallbackComponent={ErrorFallback}
                onReset={() => window.location.reload()}
            >
                <main className="container mb-5">
                    <div className="row justify-content-center mb-3">
                        <div className="col-lg-10 col-md-11">
                            <Accordion>
                                {(data || []).map((list, index) => {
                                    return (
                                        <div
                                            className={`bg-white rounded-lg shadow-sm mb-2`}
                                            key={index}
                                        >
                                            <Accordion.Toggle
                                                as={Card}
                                                eventKey={index + 1}
                                                className={`${
                                                    activeKey === index + 1
                                                        ? "text-danger"
                                                        : "text-dark"
                                                }`}
                                                style={{
                                                    padding: "20px",
                                                    cursor: "default",
                                                }}
                                                onClick={() => {
                                                    if (
                                                        activeKey ===
                                                        index + 1
                                                    ) {
                                                        setActiveKey();
                                                    } else {
                                                        setActiveKey(index + 1);
                                                    }
                                                }}
                                            >
                                                <div className="d-flex align-items-center flex-nowrap">
                                                    <div className="w-100">
                                                        {list.question}
                                                    </div>
                                                    {activeKey === index + 1 ? (
                                                        <i className="fas fa-minus ml-1"></i>
                                                    ) : (
                                                        <i className="fas fa-plus ml-1"></i>
                                                    )}
                                                </div>
                                            </Accordion.Toggle>

                                            <Accordion.Collapse
                                                eventKey={index + 1}
                                            >
                                                <Card.Body
                                                    className="text-dark pt-0"
                                                    style={{
                                                        fontSize: "15px",
                                                        lineHeight: "25px",
                                                    }}
                                                    dangerouslySetInnerHTML={{
                                                        __html: list.answer,
                                                    }}
                                                ></Card.Body>
                                            </Accordion.Collapse>
                                        </div>
                                    );
                                })}
                            </Accordion>
                        </div>
                    </div>

                    <div className="text-center text-secondary">
                        Not sure what you are looking for?{" "}
                        <Link to="/contact" className="primary-text">
                            Contact Us
                        </Link>
                    </div>
                </main>

                {/* Loading component */}
                {isLoading ? <Loading /> : ""}
            </ErrorBoundary>

            <Footer />
        </>
    );
};

export default HelpCenter;
