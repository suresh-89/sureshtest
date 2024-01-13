import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import Wrapper from "../wrapper";

const WebsiteManagement = (props) => {
    useEffect(() => {
        document.title = "Website management - Admin | IQLabs";
    }, []);

    return (
        <Wrapper
            header="Website Management"
            activeLink="website"
            history={props.history}
        >
            {/* Breadcrumb */}
            <nav aria-label="breadcrumb">
                <ol className="breadcrumb mb-3">
                    <li className="breadcrumb-item">
                        <Link to="/hod">
                            <i className="fas fa-home fa-sm"></i>
                        </Link>
                    </li>
                    <li className="breadcrumb-item active">
                        Website management
                    </li>
                </ol>
            </nav>

            <div className="row">
                {/* home card */}
                <div className="col-lg-4 col-md-6 form-group">
                    <Link
                        to="/admin/website/home"
                        className="text-decoration-none"
                    >
                        <div className="wm-card">
                            <div className="d-flex align-items-center justify-content-between flex-nowrap">
                                <div className="mr-3">
                                    <h4>Home sections</h4>
                                    <p className="text-muted mb-0">
                                        Study guide, flash news
                                    </p>
                                </div>
                                <div className="d-flex justify-content-end">
                                    <i className="fas fa-chevron-right text-muted"></i>
                                </div>
                            </div>
                        </div>
                    </Link>
                </div>

                {/* footer card */}
                <div className="col-lg-4 col-md-6 form-group">
                    <Link
                        to="/admin/website/footer"
                        className="text-decoration-none"
                    >
                        <div className="wm-card">
                            <div className="d-flex align-items-center justify-content-between flex-nowrap">
                                <div className="mr-3">
                                    <h4>Footer pages</h4>
                                    <p className="text-muted mb-0">
                                        About inquel, privacy policy, terms and
                                        conditions, legal notice, help center,
                                        copyright
                                    </p>
                                </div>
                                <div className="d-flex justify-content-end">
                                    <i className="fas fa-chevron-right text-muted"></i>
                                </div>
                            </div>
                        </div>
                    </Link>
                </div>

                {/* instruction card */}
                <div className="col-lg-4 col-md-6 form-group">
                    <Link
                        to="/admin/website/instruction"
                        className="text-decoration-none"
                    >
                        <div className="wm-card">
                            <div className="d-flex align-items-center justify-content-between flex-nowrap">
                                <div className="mr-3">
                                    <h4>Instructions</h4>
                                    <p className="text-muted mb-0">
                                        Exam instructions, study planner
                                        instruction
                                    </p>
                                </div>
                                <div className="d-flex justify-content-end">
                                    <i className="fas fa-chevron-right text-muted"></i>
                                </div>
                            </div>
                        </div>
                    </Link>
                </div>
            </div>
        </Wrapper>
    );
};

export default WebsiteManagement;
