import React, { useEffect } from "react";
import Wrapper from "../../wrapper";
import { connect } from "react-redux";
const Component = React.lazy(() => import("./component"));

const mapStateToProps = (state) => ({
    course_name: state.content.course_name,
});

const Certificate = (props) => {
    useEffect(() => {
        document.title = `${props.course_name} - Student | IQLabs`;
    }, [props]);

    return (
        <Wrapper
            header={props.course_name}
            activeLink="dashboard"
            history={props.history}
            hideBackButton={true}
        >
            <React.Suspense fallback={<div>Loading...</div>}>
                <Component {...props} />
            </React.Suspense>
        </Wrapper>
    );
};

export default connect(mapStateToProps)(Certificate);
