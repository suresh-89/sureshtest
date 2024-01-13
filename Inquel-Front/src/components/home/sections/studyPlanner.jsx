import React from "react";
import { Link } from "react-router-dom";
import calendar from "../../../assets/events.svg";
import playButton from "../../../assets/google-play-badge.png";

const StudyPlanner = () => {
    return (
        <section className="calendar-container">
            <div className="container">
                <div className="row justify-content-between">
                    <div className="col-md-6 img-section">
                        <img
                            src={calendar}
                            alt="calendar scheduler event"
                            className="img-fluid"
                        />
                    </div>
                    <div className="col-md-5 text-section">
                        <h1>Study Calendar</h1>
                        <h2>
                            The more you learn,
                            <br />
                            the less you pay.
                        </h2>
                        <h3>Designed for your busy life</h3>
                        <div className="row">
                            <div className="col-md-5 col-6 pl-md-2 pl-0">
                                <Link to="/">
                                    <img
                                        src={playButton}
                                        alt="Google play button for study calendar app"
                                        className="img-fluid"
                                    />
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default StudyPlanner;
