import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import logo from "../../../assets/logo-white.png";
import { baseUrl, homeURL } from "../../../shared/baseUrl";
import { SOCIAL_LINKS } from "./website-management-data";

const FontAwesomeIcons = {
    facebook: "fab fa-facebook-f",
    instagram: "fab fa-instagram",
    linkedin: "fab fa-linkedin-in",
    twitter: "fab fa-twitter",
};

const SocialLinks = () => {
    return (
        <>
            {Object.entries(SOCIAL_LINKS).map(([key, value], index) => {
                return (
                    <p style={{ fontSize: "20px" }} key={index}>
                        <a
                            href={value}
                            target="_blank"
                            rel="noreferrer"
                            className="text-light"
                            title={key}
                            aria-label={`${key} link`}
                        >
                            <i className={FontAwesomeIcons[key]}></i>
                        </a>
                    </p>
                );
            })}
        </>
    );
};

export default function Footer() {
    const [checkup, setCheckup] = useState({});
    const [copyright, setCopyright] = useState({});

    useEffect(() => {
        // checkup API
        fetch(`${baseUrl}${homeURL}/contentcheckup/`, {
            method: "GET",
        })
            .then((res) => res.json())
            .then((result) => {
                if (result.sts === true) {
                    setCheckup(result.data);
                }
            })
            .catch((err) => {
                console.log(err);
            });

        // copyright API
        fetch(`${baseUrl}${homeURL}/copyright/`, {
            method: "GET",
        })
            .then((res) => res.json())
            .then((result) => {
                if (result.sts === true) {
                    setCopyright(result.data);
                }
            })
            .catch((err) => {
                console.log(err);
            });
    }, []);

    return (
        <footer className="primary-bg pt-5 pb-4">
            <div className="container">
                {/* quick links */}
                <div className="row justify-content-between mb-3">
                    <div className="col-lg-3 col-md-4 mb-3 mb-md-0 d-none d-md-block">
                        <img
                            src={logo}
                            alt="IQ Labs Academy"
                            className="img-fluid mb-4"
                        />
                        <div className="d-flex justify-content-around">
                            <SocialLinks />
                        </div>
                    </div>
                    <div className="col-lg-8 col-md-8">
                        <div className="row justify-content-end">
                            <div className="col-md-4 mb-3 mb-md-0">
                                <h1 className="h5 font-weight-bold text-light mb-4">
                                    QUICK LINKS
                                </h1>
                                <p className="mb-2">
                                    <Link to="/features" className="text-light">
                                        Features
                                    </Link>
                                </p>
                                <p className="mb-2">
                                    <Link to="/catalog" className="text-light">
                                        Buy a Course
                                    </Link>
                                </p>
                                <p className="mb-2">
                                    <Link
                                        to="/leaderboard"
                                        className="text-light"
                                    >
                                        Leader Board
                                    </Link>
                                </p>
                                <p className="mb-2">
                                    <Link to="/cart" className="text-light">
                                        Cart
                                    </Link>
                                </p>
                            </div>
                            <div className="col-md-4 mb-3 mb-md-0">
                                <h1 className="h5 font-weight-bold text-light mb-4">
                                    HELP
                                </h1>
                                <p className="mb-2">
                                    <Link to="/register" className="text-light">
                                        Sign Up
                                    </Link>
                                </p>
                                <p className="mb-2">
                                    <Link to="/login" className="text-light">
                                        Log In
                                    </Link>
                                </p>
                                {checkup.help_center && (
                                    <p className="mb-2">
                                        <Link to="/help" className="text-light">
                                            Help Center
                                        </Link>
                                    </p>
                                )}
                                <p>
                                    <Link to="/contact" className="text-light">
                                        Contact Us
                                    </Link>
                                </p>
                            </div>
                            <div className="col-md-4 mb-3 mb-md-0">
                                <h1 className="h5 font-weight-bold text-light mb-4">
                                    ABOUT
                                </h1>
                                {checkup.about_inquel && (
                                    <p className="mb-2">
                                        <Link
                                            to="/about"
                                            className="text-light"
                                        >
                                            Company
                                        </Link>
                                    </p>
                                )}
                                {checkup.privacy_policy && (
                                    <p className="mb-2">
                                        <Link
                                            to="/privacy-policy"
                                            className="text-light"
                                        >
                                            Privacy Policy
                                        </Link>
                                    </p>
                                )}
                                {checkup.terms_condition && (
                                    <p className="mb-2">
                                        <Link
                                            to="/terms-and-conditions"
                                            className="text-light"
                                        >
                                            Terms & Conditions
                                        </Link>
                                    </p>
                                )}
                                {checkup.legal_notice && (
                                    <p className="mb-0">
                                        <Link
                                            to="/legal-notice"
                                            className="text-light"
                                        >
                                            Legal Notice
                                        </Link>
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* social links for mobile devices */}
                <div className="row justify-content-center d-md-none d-block">
                    <div className="col-md-4 d-flex justify-content-around">
                        <SocialLinks />
                    </div>
                </div>

                {/* copyright */}
                {checkup.copy_right && (
                    <>
                        <div className="dropdown-divider mb-4"></div>
                        <div
                            className="text-white text-center remove-bottom-margin"
                            dangerouslySetInnerHTML={{
                                __html: copyright.copy_right,
                            }}
                        ></div>
                    </>
                )}
            </div>
        </footer>
    );
}
