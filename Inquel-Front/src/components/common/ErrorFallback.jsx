import React from "react";

const ErrorFallback = ({ error, resetErrorBoundary }) => {
    return (
        <div className="row justify-content-center">
            <div className="col-lg-8 col-md-10">
                <div
                    className="bg-light border-secondary rounded-lg d-flex align-items-center justify-content-center p-3"
                    style={{ height: "80px" }}
                >
                    <p className="text-dark text-center mb-0">
                        <i className="fas fa-exclamation-triangle fa-lg text-warning mr-1"></i>{" "}
                        There is a problem in showing this component! {" "}
                        <span
                            className="text-danger"
                            style={{ cursor: "pointer" }}
                            onClick={resetErrorBoundary}
                        >
                            Reload this page
                        </span>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default ErrorFallback;
