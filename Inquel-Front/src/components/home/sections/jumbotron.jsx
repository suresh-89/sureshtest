import React from "react";
import { Link } from "react-router-dom";
import { CAROUSEL } from "../shared/website-management-data";

class Jumbotron extends React.Component {
    constructor() {
        super();
        this.state = { currentSlide: 0 };
        this.intervel = "";
        this.seconds = 10000;
    }

    componentDidMount = () => {
        if (CAROUSEL.length > 1) {
            this.intervel = setInterval(this.countdownTimer, this.seconds);
        }
    };

    componentWillUnmount = () => {
        clearInterval(this.intervel);
    };

    handleNext = async () => {
        await clearInterval(this.intervel);
        await this.setState({
            currentSlide:
                this.state.currentSlide === CAROUSEL.length - 1
                    ? 0
                    : this.state.currentSlide + 1,
        });
        this.intervel = setInterval(this.countdownTimer, this.seconds);
    };

    handlePrev = async () => {
        await clearInterval(this.intervel);
        await this.setState({
            currentSlide:
                this.state.currentSlide === 0
                    ? CAROUSEL.length - 1
                    : this.state.currentSlide - 1,
        });
        this.intervel = setInterval(this.countdownTimer, this.seconds);
    };

    countdownTimer = () => {
        this.setState({
            currentSlide:
                this.state.currentSlide === CAROUSEL.length - 1
                    ? 0
                    : this.state.currentSlide + 1,
        });
    };

    render() {
        return (
            <section className="jumbotron-container">
                {CAROUSEL.map((item, index) => {
                    return index === this.state.currentSlide ? (
                        <div
                            key={index}
                            className="jumbotron-slide"
                            style={{
                                backgroundImage: `url(${item.image})`,
                                backgroundPosition: "center",
                                backgroundRepeat: "no-repeat",
                                backgroundSize: "cover",
                                width: "100%",
                                height: "90vh",
                            }}
                        >
                            <div className="jumbotron-text">
                                <div className="jumbotron-heading">
                                    {item.title}
                                </div>
                                <p className="jumbotron-subheading">
                                    {item.description}
                                </p>
                                <div className="d-flex justify-content-start w-100">
                                    <Link to="/catalog">
                                        <button className="btn btn-outline-primary shadow-none mr-2">
                                            Get Started
                                        </button>
                                    </Link>
                                    <Link to="/catalog/free">
                                        <button className="btn btn-primary shadow-none px-4">
                                            Free Trial
                                        </button>
                                    </Link>
                                </div>
                            </div>
                        </div>
                    ) : (
                        ""
                    );
                })}

                {CAROUSEL.length > 1 ? (
                    <>
                        {/* ----- Arrow button ----- */}
                        <button
                            className="jumbotron-arrow jumbotron-left-arrow"
                            onClick={this.handlePrev}
                            aria-label="Left arrow"
                        >
                            <i className="fas fa-arrow-left"></i>
                        </button>
                        <button
                            className="jumbotron-arrow jumbotron-right-arrow"
                            onClick={this.handleNext}
                            aria-label="Right arrow"
                        >
                            <i className="fas fa-arrow-right"></i>
                        </button>

                        {/* ----- Dot button ----- */}
                        <div className="jumbotron-dot">
                            {CAROUSEL.map((item, index) => {
                                return (
                                    <div
                                        key={index}
                                        className={`jumbotron-dot-btn ${
                                            index === this.state.currentSlide
                                                ? "active"
                                                : ""
                                        }`}
                                        onClick={async () => {
                                            await clearInterval(this.intervel);
                                            await this.setState({
                                                currentSlide: index,
                                            });
                                            this.intervel = setInterval(
                                                this.countdownTimer,
                                                this.seconds
                                            );
                                        }}
                                    ></div>
                                );
                            })}
                        </div>
                    </>
                ) : (
                    ""
                )}
            </section>
        );
    }
}

export default Jumbotron;
