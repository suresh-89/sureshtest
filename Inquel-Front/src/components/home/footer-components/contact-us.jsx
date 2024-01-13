import React, { useState, useEffect } from "react";
import Header from "../shared/navbar";
import Footer from "../shared/footer";
import { ErrorBoundary } from "react-error-boundary";
import ErrorFallback from "../../common/ErrorFallback";
import Loading from "../../common/loader";
import { baseUrl, homeURL } from "../../../shared/baseUrl";
import AlertBox from "../../common/alert";

const Asterik = () => {
    return <span className="text-danger">*</span>;
};

const ContactUs = () => {
    const [data, setData] = useState({
        name: "",
        mail_id: "",
        phone_number: "",
        location: "",
        qualification: "",
        subject: "",
        message: "",
    });

    const [isLoading, setLoading] = useState(false);
    const [responseMsg, setResponseMsg] = useState("");
    const [showErrorAlert, setErrorAlert] = useState(false);
    const [showSuccessAlert, setSuccessAlert] = useState(false);

    useEffect(() => {
        document.title = "Contact Us | IQ Labs Academy";
        window.scrollTo(0, 0);
    }, []);

    const handleInput = (event) => {
        let body_data = data;

        body_data[event.target.name] = event.target.value;
        setData(body_data);
    };

    const handleSend = (e) => {
        e.preventDefault();
        setLoading(true);
        setErrorAlert(false);
        setSuccessAlert(false);

        const body_data = data;

        if (
            body_data.name === "" ||
            body_data.mail_id === "" ||
            body_data.subject === "" ||
            body_data.message === ""
        ) {
            setResponseMsg("Enter all the required fields!");
            setErrorAlert(true);
            setLoading(false);
        } else {
            fetch(`${baseUrl}${homeURL}/contactus/`, {
                method: "POST",
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    ...body_data,
                }),
            })
                .then((res) => res.json())
                .then((result) => {
                    if (result.sts === true && result.mail_sent === true) {
                        setResponseMsg("Your message has been sent!");
                        setSuccessAlert(true);
                        setLoading(false);
                    } else {
                        setResponseMsg(result.msg);
                        setErrorAlert(true);
                        setLoading(false);
                    }
                })
                .catch((err) => {
                    console.log(err);
                    setResponseMsg("There is a problem in sending message!");
                    setErrorAlert(true);
                    setLoading(false);
                });
        }
    };

    return (
        <>
            <Header />

            <header className="jumbotron">
                <h1>Contact us</h1>
                <p>Get in touch and let us know how we can help!</p>
            </header>

            {/* Alert message */}
            <AlertBox
                errorMsg={responseMsg}
                successMsg={responseMsg}
                showErrorAlert={showErrorAlert}
                showSuccessAlert={showSuccessAlert}
                toggleSuccessAlert={() => setSuccessAlert(false)}
                toggleErrorAlert={() => setErrorAlert(false)}
            />

            <ErrorBoundary
                FallbackComponent={ErrorFallback}
                onReset={() => window.location.reload()}
            >
                <main className="container mb-5">
                    <div className="row justify-content-center">
                        <div className="col-lg-8 col-md-10">
                            <div className="card">
                                <div className="card-body">
                                    <form
                                        autoComplete="off"
                                        onSubmit={handleSend}
                                    >
                                        <div className="row">
                                            <div className="col-12 form-group">
                                                <label htmlFor="name">
                                                    Name <Asterik />
                                                </label>
                                                <input
                                                    type="text"
                                                    name="name"
                                                    id="name"
                                                    className="form-control form-control-lg borders"
                                                    onChange={handleInput}
                                                    required
                                                />
                                            </div>
                                            <div className="col-md-6 form-group">
                                                <label htmlFor="mail_id">
                                                    Email <Asterik />
                                                </label>
                                                <input
                                                    type="email"
                                                    name="mail_id"
                                                    id="mail_id"
                                                    className="form-control form-control-lg borders"
                                                    onChange={handleInput}
                                                    required
                                                />
                                            </div>
                                            <div className="col-md-6 form-group">
                                                <label htmlFor="phone_number">
                                                    Phone number
                                                </label>
                                                <input
                                                    type="text"
                                                    name="phone_number"
                                                    id="phone_number"
                                                    className="form-control form-control-lg borders"
                                                    onChange={handleInput}
                                                />
                                            </div>
                                            <div className="col-md-6 form-group">
                                                <label htmlFor="location">
                                                    Location
                                                </label>
                                                <input
                                                    type="text"
                                                    name="location"
                                                    id="location"
                                                    className="form-control form-control-lg borders"
                                                    onChange={handleInput}
                                                />
                                            </div>
                                            <div className="col-md-6 form-group">
                                                <label htmlFor="qualification">
                                                    Qualification
                                                </label>
                                                <input
                                                    type="text"
                                                    name="qualification"
                                                    id="qualification"
                                                    className="form-control form-control-lg borders"
                                                    onChange={handleInput}
                                                />
                                            </div>
                                            <div className="col-12 form-group">
                                                <label htmlFor="subject">
                                                    Subject <Asterik />
                                                </label>
                                                <input
                                                    type="text"
                                                    name="subject"
                                                    id="subject"
                                                    className="form-control form-control-lg borders"
                                                    onChange={handleInput}
                                                    required
                                                />
                                            </div>
                                            <div className="col-12 form-group">
                                                <label htmlFor="message">
                                                    Message <Asterik />
                                                </label>
                                                <textarea
                                                    name="message"
                                                    id="message"
                                                    rows="10"
                                                    className="form-control form-control-lg borders"
                                                    onChange={handleInput}
                                                    required
                                                ></textarea>
                                            </div>
                                            <div className="col-md-6 mb-1">
                                                <button
                                                    type="submit"
                                                    className="btn btn-primary btn-block shadow-none"
                                                >
                                                    <i className="fas fa-paper-plane mr-1"></i>{" "}
                                                    Send message
                                                </button>
                                            </div>
                                        </div>
                                        <small className="text-muted">
                                            Field marked as{" "}
                                            <span className="text-danger font-weight-bold-600">
                                                *
                                            </span>{" "}
                                            are mandatory fields
                                        </small>
                                    </form>
                                </div>
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

export default ContactUs;
