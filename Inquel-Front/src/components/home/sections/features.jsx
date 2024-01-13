import React, { useState } from "react";
import { Link } from "react-router-dom";
import { FEATURES } from "../shared/website-management-data";

const Features = () => {
    const [currentSlide, setSlide] = useState(0);

    return (
        <section className="feature-container">
            {FEATURES.map((item, index) => {
                return currentSlide === index ? (
                    <div className="feature-section" key={index}>
                        <div className="feature-text">
                            <div className="feature-heading">{item.title}</div>
                            <div className="feature-subheading">
                                {item.text.substr(0, 140)}...
                            </div>
                            <Link to="/features" className="text-white">
                                See All Features{" "}
                                <i className="fas fa-arrow-right fa-sm ml-1"></i>
                            </Link>
                        </div>
                        <div
                            className="feature-images"
                            style={{
                                backgroundImage: `url(${item.image})`,
                                backgroundPosition: "center",
                                backgroundRepeat: "no-repeat",
                                backgroundSize: "cover",
                            }}
                        ></div>
                    </div>
                ) : (
                    ""
                );
            })}

            {/* Dot button */}
            <div className="feature-dot">
                {FEATURES.map((item, index) => {
                    return (
                        <div
                            className="feature-dot-btn"
                            key={index}
                            onClick={() => setSlide(index)}
                        >
                            <div
                                className={`feature-dot-btns ${
                                    index === currentSlide ? "active" : ""
                                }`}
                            ></div>
                        </div>
                    );
                })}
            </div>
        </section>
    );
};

export default Features;
