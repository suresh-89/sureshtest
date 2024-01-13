import React, { useState, useEffect } from "react";
import Header from "../shared/navbar";
import Footer from "../shared/footer";
import { ErrorBoundary } from "react-error-boundary";
import ErrorFallback from "../../common/ErrorFallback";
import Loading from "../../common/loader";
import { baseUrl, homeURL } from "../../../shared/baseUrl";
import { TawkTo, ToggleTawkTo } from "../../common/function/TawktoChatWidget";

const LegalNotice = () => {
    const [data, setData] = useState({});
    const [isLoading, setLoading] = useState(true);

    useEffect(() => {
        document.title = "Legal Notice | IQ Labs Academy";
        window.scrollTo(0, 0);

        fetch(`${baseUrl}${homeURL}/legalnotice/`, {
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
                <h1 className="mb-0">Legal Notice</h1>
            </header>

            <ErrorBoundary
                FallbackComponent={ErrorFallback}
                onReset={() => window.location.reload()}
            >
                <main className="container mb-5">
                    <div className="row justify-content-center">
                        <div className="col-lg-10 col-md-11">
                            <div className="card" style={{ minHeight: "50vh" }}>
                                <div
                                    className="card-body remove-bottom-margin"
                                    dangerouslySetInnerHTML={{
                                        __html: data.legal_notice,
                                    }}
                                ></div>
                            </div>
                        </div>
                    </div>
                </main>

                {/* Loading component */}
                {isLoading ? <Loading /> : ""}
            </ErrorBoundary>

            <Footer />
        </>
    );
};

export default LegalNotice;
