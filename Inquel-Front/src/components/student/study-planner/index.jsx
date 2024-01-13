import React from "react";
import Wrapper from "../wrapper";
const StudyPlannerComponent = React.lazy(() =>
    import("./StudyPlannerComponent")
);

const StudyPlanner = (props) => {
    return (
        <Wrapper
            header="Study Planner"
            activeLink="calendar"
            history={props.history}
            hideBackButton={true}
        >
            <React.Suspense fallback={<div>Loading...</div>}>
                <StudyPlannerComponent />
            </React.Suspense>
        </Wrapper>
    );
};

export default StudyPlanner;
