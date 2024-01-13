import React, { useState, useEffect } from "react";
import Header from "./shared/navbar";
import Footer from "./shared/footer";
import { ErrorBoundary } from "react-error-boundary";
import ErrorFallback from "../common/ErrorFallback";
import { baseUrl, studentUrl } from "../../shared/baseUrl";
import Loading from "../common/loader";
import AlertBox from "../common/alert";
import { connect } from "react-redux";
import { SUBJECT_THUMBNAIL } from "../../shared/constant";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import { TawkTo, ToggleTawkTo } from "../common/function/TawktoChatWidget";

const mapStateToProps = (state) => ({
    profile: state.user.profile,
});

const url = baseUrl + studentUrl;
const headers = {
    Accept: "application/json",
    "Content-Type": "application/json",
};

const Checkout = (props) => {
    const [subscription, setSubscription] = useState({});
    const [coupon, setCoupon] = useState("");
    const [discount_amount, setDiscountAmount] = useState(0);
    const [total, setTotal] = useState(0);

    const [isLoading, setLoading] = useState(true);
    const [responseMsg, setResponseMsg] = useState("");
    const [showErrorAlert, setErrorAlert] = useState(false);
    const [showSuccessAlert, setSuccessAlert] = useState(false);
    const [isCouponApplied, setCouponStatus] = useState(false);

    useEffect(() => {
        document.title = "Checkout | IQ Labs Academy";

        if (
            localStorage.getItem("Authorization") &&
            localStorage.getItem("is_student")
        ) {
            headers["Authorization"] = localStorage.getItem("Authorization");
        }

        window.scrollTo(0, 0);
        loadSubscriptionData();

        // Initialize tawk-to chat widget
        TawkTo();
        setTimeout(() => {
            ToggleTawkTo("show");
        }, 100);

        return () => {
            // Toggle tawk-to chat widget
            ToggleTawkTo("hide");
        };
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    const loadSubscriptionData = () => {
        fetch(`${url}/student/buy/${props.match.params.subscriptionId}/`, {
            headers: headers,
            method: "POST",
        })
            .then((res) => res.json())
            .then((result) => {
                if (result.sts === true) {
                    setSubscription(result.data);
                    setTotal(result.data.discounted_price);
                    setLoading(false);
                } else {
                    setResponseMsg(result.msg);
                    setErrorAlert(true);
                    setLoading(false);
                }
            })
            .catch((err) => {
                console.log(err);
                setResponseMsg("Something went wrong!");
                setErrorAlert(true);
                setLoading(false);
            });
    };

    const handleCoupon = () => {
        setErrorAlert(false);

        fetch(
            `${url}/student/buy/${props.match.params.subscriptionId}/discount/`,
            {
                headers: headers,
                method: "POST",
                body: JSON.stringify({
                    coupon_name: coupon,
                }),
            }
        )
            .then((res) => res.json())
            .then((result) => {
                if (result.sts === true) {
                    setDiscountAmount(result.data.buy_now_coupon_price);
                    setTotal(result.data.buy_now_price);
                    setCouponStatus(true);
                } else {
                    setResponseMsg(result.msg);
                    setErrorAlert(true);
                    setLoading(false);
                }
            })
            .catch((err) => {
                console.log(err);
                setResponseMsg("Something went wrong!");
                setErrorAlert(true);
                setLoading(false);
            });
    };

    const returnImage = (list) => {
        let URL = "";
        if (list.subscription_file_link) {
            if (list.subscription_file_link.subscription_image_1) {
                URL = list.subscription_file_link.subscription_image_1;
            } else {
                URL = SUBJECT_THUMBNAIL;
            }
        } else {
            URL = SUBJECT_THUMBNAIL;
        }

        return URL;
    };

    const handleCheckout = () => {
        setLoading(true);
        setErrorAlert(false);
        setSuccessAlert(false);

        fetch(
            `${url}/student/buy/${props.match.params.subscriptionId}/checkout/`,
            {
                headers: headers,
                method: "POST",
            }
        )
            .then((res) => res.json())
            .then((result) => {
                if (result.sts === true) {
                    try {
                        setLoading(false);
                        const rzp = new window.Razorpay(
                            JSON.parse(window.atob(result.data))
                        );
                        rzp.open();
                    } catch (error) {
                        console.log(error);
                        setResponseMsg(
                            "Something went wrong in initializing payment!"
                        );
                        setErrorAlert(true);
                        setLoading(false);
                    }
                } else {
                    setResponseMsg(result.msg);
                    setErrorAlert(true);
                    setLoading(false);
                }
            })
            .catch((err) => {
                console.log(err);
                setResponseMsg("Something went wrong!");
                setErrorAlert(true);
                setLoading(false);
            });
    };

    return (
        <>
            <Header activeLink="cart" />

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

            <ErrorBoundary
                FallbackComponent={ErrorFallback}
                onReset={() => window.location.reload()}
            >
                <main className="container">
                    <div className="cart position-relative shadow-sm">
                        <div
                            className="borders rounded-lg primary-text position-absolute px-4 py-2"
                            style={{ right: "15px", top: "15px" }}
                        >
                            <i className="fas fa-wallet mr-1"></i> Wallet:{" "}
                            {props.profile.wallet ? props.profile.wallet : 0}
                        </div>
                        <h1 className="section-heading text-left text-md-center">
                            Checkout
                        </h1>
                        <div className="cart-header">
                            <div className="row justify-content-md-center justify-content-between mb-2">
                                <div className="col-8">Courses</div>
                                <div className="col-3 pl-0">Price</div>
                            </div>
                        </div>
                        <div className="cart-body">
                            <div className="cart-row">
                                <div className="row align-items-center justify-content-md-center justify-content-between">
                                    <div className="col-8 row align-items-center px-0">
                                        <div className="col-2 d-none d-md-block">
                                            <div
                                                className="rounded-lg shadow"
                                                style={{
                                                    width: "100%",
                                                    height: "60px",
                                                    backgroundImage: `url(${returnImage(
                                                        subscription
                                                    )})`,
                                                    backgroundSize: "cover",
                                                    backgroundPosition:
                                                        "center",
                                                }}
                                            ></div>
                                        </div>
                                        <div className="col-md-10 col-12">
                                            <p className="title text-truncate">
                                                {subscription.title}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="col-md-3 col-4">
                                        <i className="fas fa-rupee-sign fa-sm"></i>{" "}
                                        {subscription.discounted_price}
                                        {subscription.discounted_price <
                                        subscription.total_price ? (
                                            <span
                                                className="text-muted ml-2"
                                                style={{
                                                    textDecoration:
                                                        "line-through",
                                                }}
                                            >
                                                <i className="fas fa-rupee-sign fa-sm"></i>{" "}
                                                {subscription.total_price}
                                            </span>
                                        ) : (
                                            ""
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="cart-footer">
                            <div className="row align-items-center justify-content-end">
                                <div className="col-md-5 col-12">
                                    <div className="form-row align-items-center justify-content-center">
                                        <div className="col-6">Subtotal</div>
                                        <div className="col-6 text-right text-md-left">
                                            <i className="fas fa-rupee-sign fa-sm"></i>{" "}
                                            {subscription.discounted_price}
                                        </div>
                                    </div>
                                    <div className="form-row align-items-center justify-content-center">
                                        <div className="col-6">Coupon</div>
                                        <div className="col-6 text-right text-md-left">
                                            <div className="input-group input-group-sm border-secondary rounded-lg overflow-hidden">
                                                <input
                                                    type="text"
                                                    name="coupon"
                                                    className="form-control"
                                                    placeholder="Enter coupon code"
                                                    onChange={(e) =>
                                                        setCoupon(
                                                            e.target.value
                                                        )
                                                    }
                                                    value={coupon}
                                                    autoComplete="off"
                                                    disabled={isCouponApplied}
                                                />
                                                <div className="input-group-prepend">
                                                    {isCouponApplied ? (
                                                        <OverlayTrigger
                                                            key="top2"
                                                            placement="top"
                                                            overlay={
                                                                <Tooltip
                                                                    id="tooltip"
                                                                    className="text-left"
                                                                >
                                                                    Remove
                                                                    coupon
                                                                </Tooltip>
                                                            }
                                                        >
                                                            <button
                                                                className="btn btn-light btn-sm shadow-none"
                                                                onClick={() => {
                                                                    setCoupon(
                                                                        ""
                                                                    );
                                                                    setCouponStatus(
                                                                        false
                                                                    );
                                                                    setDiscountAmount(
                                                                        0
                                                                    );
                                                                    loadSubscriptionData();
                                                                }}
                                                            >
                                                                <i className="far fa-times-circle text-danger"></i>
                                                            </button>
                                                        </OverlayTrigger>
                                                    ) : (
                                                        <OverlayTrigger
                                                            key="top2"
                                                            placement="top"
                                                            overlay={
                                                                <Tooltip
                                                                    id="tooltip"
                                                                    className="text-left"
                                                                >
                                                                    Apply coupon
                                                                </Tooltip>
                                                            }
                                                        >
                                                            <button
                                                                className="btn btn-light btn-sm shadow-none"
                                                                onClick={
                                                                    handleCoupon
                                                                }
                                                            >
                                                                <i className="far fa-check-circle"></i>
                                                            </button>
                                                        </OverlayTrigger>
                                                    )}
                                                </div>
                                            </div>
                                            {isCouponApplied && (
                                                <p className="small text-success mb-0">
                                                    Coupon applied successfully!
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                    <div className="form-row align-items-center justify-content-center">
                                        <div className="col-6">
                                            Discount Amount
                                        </div>
                                        <div className="col-6 text-right text-md-left">
                                            <i className="fas fa-rupee-sign fa-sm"></i>{" "}
                                            {discount_amount}
                                        </div>
                                    </div>
                                    <div className="form-row align-items-center justify-content-center primary-text h5">
                                        <div className="col-6">
                                            Total Amount
                                        </div>
                                        <div className="col-6 text-right text-md-left">
                                            <i className="fas fa-rupee-sign fa-sm"></i>{" "}
                                            {total}
                                        </div>
                                    </div>
                                    <div className="form-row align-items-center justify-content-center mt-4 mb-0">
                                        <div className="col-md-6 d-none d-md-block"></div>
                                        <div className="col-md-6 col-12">
                                            <button
                                                className="btn btn-primary btn-block shadow-none"
                                                onClick={handleCheckout}
                                            >
                                                Make Payment
                                            </button>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-1 d-none d-md-block"></div>
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

export default connect(mapStateToProps)(Checkout);
