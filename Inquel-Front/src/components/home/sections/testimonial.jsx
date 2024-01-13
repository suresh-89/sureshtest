import React from "react";
import Slider from "react-slick";
import { TESTIMONIAL } from "../shared/website-management-data";

const settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    initialSlide: 0,
    autoplay: true,
    autoplaySpeed: 3000,
    pauseOnHover: true,
    responsive: [
        {
            breakpoint: 1024,
            settings: {
                slidesToShow: 2,
                slidesToScroll: 2,
            },
        },
        {
            breakpoint: 600,
            settings: {
                slidesToShow: 1,
                slidesToScroll: 1,
            },
        },
        {
            breakpoint: 480,
            settings: {
                slidesToShow: 1,
                slidesToScroll: 1,
            },
        },
    ],
};

const Testimonial = () => {
    return TESTIMONIAL.length !== 0 ? (
        <section className="testimonial-container">
            <h1 className="section-heading">Testimonials</h1>
            <div className="container position-relative" style={{ zIndex: 1 }}>
                <Slider {...settings}>
                    {TESTIMONIAL.map((data, index) => {
                        return (
                            <div
                                className="px-md-4 px-2"
                                data-index={index}
                                key={index}
                            >
                                <div className="card card-body border-primary">
                                    <div className="d-flex align-items-center mb-3">
                                        <img
                                            src={data.image}
                                            alt="testimonial users"
                                            className="testimonial-user-img shadow"
                                        />
                                        <div className="ml-3">
                                            <p className="testimonial-name">
                                                {data.name}
                                            </p>
                                        </div>
                                    </div>
                                    <p className="testimonial-text">
                                        <q>{data.text}</q>
                                    </p>
                                </div>
                            </div>
                        );
                    })}
                </Slider>
            </div>
            <div className="testimonial-circle testimonial-top-left-circle"></div>
            <div className="testimonial-circle testimonial-bottom-right-circle"></div>
        </section>
    ) : (
        <></>
    );
};

export default Testimonial;
