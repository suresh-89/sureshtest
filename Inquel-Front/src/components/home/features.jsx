import React, { useEffect } from "react";
import Header from "./shared/navbar";
import Footer from "./shared/footer";
import { ErrorBoundary } from "react-error-boundary";
import ErrorFallback from "../common/ErrorFallback";
import { FEATURES } from "./shared/website-management-data";
import { TawkTo, ToggleTawkTo } from "../common/function/TawktoChatWidget";

const Features = () => {
    useEffect(() => {
        document.title = "Features | IQ Labs Academy";
        window.scrollTo(0, 0);

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

    const getTextOrderClass = (index) => {
        let className = "";

        if (index === 0) {
            className = "order-md-1";
        } else if (index % 2 === 0) {
            className = "order-md-1";
        } else {
            className = "order-md-2";
        }

        return className;
    };

    const getImageOrderClass = (index) => {
        let className = "";

        if (index === 0) {
            className = "order-md-2";
        } else if (index % 2 === 0) {
            className = "order-md-2";
        } else {
            className = "order-md-1";
        }

        return className;
    };

    return (
        <>
            <Header activeLink="features" />

            <header className="jumbotron">
                <h1>Feature Listing</h1>
                <p>Achieve your goals with Inquel</p>
            </header>

            <ErrorBoundary
                FallbackComponent={ErrorFallback}
                onReset={() => window.location.reload()}
            >
                <main className="container mb-5">
                    {FEATURES.map((item, index) => {
                        return (
                            <div
                                className="features-section shadow-sm"
                                key={index}
                            >
                                <div
                                    className={`features-text ${getTextOrderClass(
                                        index
                                    )}`}
                                >
                                    <div className="features-heading">
                                        {item.title}
                                    </div>
                                    <div className="features-subheading">
                                        {item.text}
                                    </div>
                                </div>
                                <div
                                    className={`feature-images ${getImageOrderClass(
                                        index
                                    )}`}
                                    style={{
                                        backgroundImage: `url(${item.image})`,
                                        backgroundPosition: "center",
                                        backgroundRepeat: "no-repeat",
                                        backgroundSize: "cover",
                                    }}
                                ></div>
                            </div>
                        );
                    })}
                </main>
            </ErrorBoundary>

            <Footer />
        </>
    );
};

export default Features;
