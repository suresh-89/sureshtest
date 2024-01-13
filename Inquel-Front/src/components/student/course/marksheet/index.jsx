import React, { useEffect } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { Navbar } from "react-bootstrap";
const Component = React.lazy(() => import("./component"));

const mapStateToProps = (state) => ({
    course_name: state.content.course_name,
    simulation_name: state.content.simulation_name,
    profile: state.user.profile,
});

const Marksheet = (props) => {
    const subscriptionId = props.match.params.subscriptionId;
    const courseId = props.match.params.courseId;

    useEffect(() => {
        document.title = `${props.simulation_name} - Student | IQLabs`;
    }, [props]);

    return (
        <>
            {/* Navbar */}
            <Navbar
                variant="light"
                className="shadow-sm bg-white justify-content-center py-3"
            >
                <div
                    className="row align-items-center"
                    style={{ width: "100%" }}
                >
                    <div className="col-4 d-none d-md-block pl-0">
                        <p className="small font-weight-bold-600 primary-text text-truncate mb-0">
                            {props.simulation_name}
                        </p>
                    </div>
                    <div className="col-md-4 col-10 px-0">
                        <h5 className="text-left text-md-center mb-0 primary-text font-weight-bold-600 text-truncate">
                            {props.course_name}
                        </h5>
                    </div>
                    <div className="col-md-4 col-2 text-right pr-0">
                        <Link
                            to={`/dashboard/subscription/${subscriptionId}/course/${courseId}`}
                        >
                            <button className="btn btn-light bg-white border-0 shadow-none btn-sm">
                                <i className="fas fa-times"></i>
                            </button>
                        </Link>
                    </div>
                </div>
            </Navbar>

            <React.Suspense fallback={<div>Loading...</div>}>
                <Component {...props} />
            </React.Suspense>
        </>
    );
};

export default connect(mapStateToProps)(Marksheet);
