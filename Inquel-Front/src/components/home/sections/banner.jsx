import React from "react";

const Banner = () => {
    return (
        <section className="banner-container">
            <div className="container">
                <a
                    href="https://www.google.com/" // change the redirect URL here
                    target="_blank"
                    rel="noreferrer"
                    aria-label="banner link"
                >
                    <img
                        // replace the banner image URl below
                        src="https://mk0bannerflowss888vj.kinstacdn.com/app/uploads/blogpost_header_display_ad-1536x429.jpg"
                        alt="Banner"
                        className="img-fluid img-responsive"
                    />
                </a>
            </div>
        </section>
    );
};

export default Banner;
