import React from "react";
import Wrapper from "./wrapper";
import { baseUrl, studentUrl } from "../../shared/baseUrl";
import { NotificationPage } from "../common/modal/notification";

class StudentNotification extends React.Component {
    constructor() {
        super();
        this.state = {};
        this.url = baseUrl + studentUrl;
        this.headers = {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: localStorage.getItem("Authorization"),
        };
    }

    render() {
        return (
            <Wrapper
                header="Notification"
                activeLink="dashboard"
                history={this.props.history}
                hideBackButton={true}
            >
                <div className="row justify-content-center mt-3">
                    <div className="col-lg-8 col-md-10 col-12">
                        <NotificationPage
                            url={`${this.url}/student/notification/`}
                            headers={this.headers}
                        />
                    </div>
                </div>
            </Wrapper>
        );
    }
}

export default StudentNotification;
