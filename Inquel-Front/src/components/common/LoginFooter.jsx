import React, { useState, useEffect } from "react";
import { baseUrl, homeURL } from "../../shared/baseUrl";
import { SOCIAL_LINKS } from "../home/shared/website-management-data";

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
                    <a
                        key={index}
                        href={value}
                        target="_blank"
                        rel="noreferrer"
                        className="text-light ml-4"
                        title={key}
                        aria-label={`${key} link`}
                    >
                        <i className={FontAwesomeIcons[key]}></i>
                    </a>
                );
            })}
        </>
    );
};

function LoginFooter() {
    const [copyright, setCopyright] = useState({});

    useEffect(() => {
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
        <footer className="primary-bg py-4">
            <div className="container-fluid">
                <div className="row">
                    <div className="col-md-6">
                        {copyright.is_active && (
                            <div
                                className="text-white text-center text-md-left remove-bottom-margin mb-3 mb-md-0"
                                dangerouslySetInnerHTML={{
                                    __html: copyright.copy_right,
                                }}
                            ></div>
                        )}
                    </div>
                    <div className="col-md-6 ">
                        <div className="d-flex justify-content-center justify-content-md-end">
                            <SocialLinks />
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
}

export default LoginFooter;
