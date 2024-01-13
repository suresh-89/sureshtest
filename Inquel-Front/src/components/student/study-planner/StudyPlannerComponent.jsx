import React, { Component } from "react";
import { baseUrl, studentUrl } from "../../../shared/baseUrl.js";
import Loading from "../../common/loader";
import AlertBox from "../../common/alert";
import {
    Inject,
    ScheduleComponent,
    Day,
    Week,
    WorkWeek,
    Month,
    Agenda,
    ViewsDirective,
    ViewDirective,
    Resize,
    DragAndDrop,
} from "@syncfusion/ej2-react-schedule";
import { createElement } from "@syncfusion/ej2-base";
import { DropDownList } from "@syncfusion/ej2-dropdowns";
import "./planner.css";
import dateFormat from "dateformat";
import { InstructionModal } from "./instructionModal";

class StudyPlannerComponent extends Component {
    constructor(props) {
        super(props);
        this.state = {
            events: [],
            instruction: {
                data: "",
                is_active: false,
            },
            showInstructionModal: false,

            errorMsg: "",
            successMsg: "",
            showErrorAlert: false,
            showSuccessAlert: false,
            page_loading: true,
        };
        this.url = baseUrl + studentUrl;
        this.authToken = localStorage.getItem("Authorization");
        this.headers = {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: this.authToken,
        };
        this.fields = {
            subject: { name: "subject", validation: { required: true } },
            description: {
                name: "description",
            },
            startTime: { name: "startTime" },
            endTime: { name: "endTime" },
            isAllDay: { name: "isAllDay" },
            recurrenceRule: { name: "recurrenceRule" },
        };
    }

    componentDidMount = () => {
        document.title = "Study Planner - Student | IQLabs";

        this.loadCalendarEvents();
        this.loadInstructions();

        var elem = document.querySelector(".e-location-container");
        elem.parentNode.removeChild(elem);
    };

    // ----- load events and instruction data -----

    loadCalendarEvents = () => {
        fetch(`${this.url}/student/studyplanner/`, {
            method: "GET",
            headers: this.headers,
        })
            .then((res) => res.json())
            .then((result) => {
                if (result.sts === true) {
                    this.setState({
                        events: result.data,
                        page_loading: false,
                    });
                } else {
                    this.setState({
                        errorMsg: result.msg,
                        showErrorAlert: true,
                        page_loading: false,
                    });
                }
            })
            .catch((err) => {
                console.log(err);
                this.setState({
                    errorMsg: "Something went wrong!",
                    showErrorAlert: true,
                    page_loading: false,
                });
            });
    };

    loadInstructions = () => {
        fetch(`${this.url}/student/plannerinstruction/`, {
            method: "GET",
            headers: this.headers,
        })
            .then((res) => res.json())
            .then((result) => {
                if (result.sts === true) {
                    let instruction = { ...this.state.instruction };
                    instruction.data = result.data.study_planner;
                    instruction.is_active = result.data.is_active;

                    this.setState({
                        instruction: instruction,
                        page_loading: false,
                    });
                } else {
                    this.setState({
                        errorMsg: result.msg,
                        showErrorAlert: true,
                        page_loading: false,
                    });
                }
            })
            .catch((err) => {
                console.log(err);
                this.setState({
                    errorMsg: "Something went wrong!",
                    showErrorAlert: true,
                    page_loading: false,
                });
            });
    };

    // ----- Scheduler handler events -----

    onPopupOpen(args) {
        if (args.type === "Editor") {
            if (!args.element.querySelector(".custom-field-row")) {
                let row = createElement("div", {
                    className: "custom-field-row",
                });
                let formElement =
                    args.element.querySelector(".e-schedule-form");
                formElement.lastChild.insertBefore(
                    row,
                    document.querySelector(".e-time-zone-row")
                );
                let container = createElement("div", {
                    className: "custom-field-container",
                });
                let inputEle = createElement("input", {
                    className: "e-field",
                    attrs: { name: "reminder" },
                });
                container.appendChild(inputEle);
                row.appendChild(container);
                let checkBox = new DropDownList({
                    dataSource: [
                        { text: "None", value: "none" },
                        { text: "0 Minutes", value: "0" },
                        { text: "5 Minutes", value: "5" },
                        { text: "15 Minutes", value: "15" },
                        { text: "30 Minutes", value: "30" },
                        { text: "60 Minutes", value: "60" },
                    ],
                    fields: { text: "text", value: "value" },
                    value: args.data.reminder,
                    floatLabelType: "Always",
                    placeholder: "Reminder",
                });
                checkBox.appendTo(inputEle);
                inputEle.setAttribute("name", "reminder");
            }
        }
    }

    actionBegin(args) {
        if (args.requestType === "eventCreate") {
            try {
                let data = {
                    subject: args.data[0].subject,
                    startTime: dateFormat(
                        args.data[0].startTime,
                        "yyyy-mm-dd HH:MM:ss"
                    ),
                    endTime: dateFormat(
                        args.data[0].endTime,
                        "yyyy-mm-dd HH:MM:ss"
                    ),
                    isAllDay: args.data[0].isAllDay,
                    reminder: args.data[0].reminder || "none",
                    recurrenceRule: args.data[0].recurrenceRule || "",
                    description: args.data[0].description || "",
                };
                this.handlePOST(data, args);
            } catch (error) {
                console.log(error);
                this.setState({
                    errorMsg: "Something went wrong!",
                    showErrorAlert: true,
                    page_loading: false,
                });
            }
        } else if (args.requestType === "eventRemove") {
            this.handleDelete(args.data[0]);
        } else if (args.requestType === "eventChange") {
            try {
                let data = {
                    subject: args.changedRecords[0].subject,
                    startTime: dateFormat(
                        args.changedRecords[0].startTime,
                        "yyyy-mm-dd HH:MM:ss"
                    ),
                    endTime: dateFormat(
                        args.changedRecords[0].endTime,
                        "yyyy-mm-dd HH:MM:ss"
                    ),
                    isAllDay: args.changedRecords[0].isAllDay,
                    reminder: args.changedRecords[0].reminder || "none",
                    recurrenceRule: args.changedRecords[0].recurrenceRule || "",
                    description: args.changedRecords[0].description || "",
                };
                this.handlePATCH(data, args.changedRecords[0]);
            } catch (error) {
                console.log(error);
                this.setState({
                    errorMsg: "Something went wrong!",
                    showErrorAlert: true,
                    page_loading: false,
                });
            }
        }
    }

    onEventRendered(args) {
        let data = args.data;

        if (
            data.startTime.getTime() < new Date().getTime() &&
            data.endTime.getTime() < new Date().getTime()
        ) {
            args.element.style.backgroundColor = "grey";
        }
        // else if (
        //     data.startTime.getTime() < new Date().getTime() &&
        //     data.endTime.getTime() > new Date().getTime()
        // ) {
        //     args.element.style.backgroundColor = "blue";
        // } else if (
        //     data.startTime.getTime() > new Date().getTime() &&
        //     data.endTime.getTime() > new Date().getTime()
        // ) {
        //     args.element.style.backgroundColor = "green";
        // }
    }

    // ----- API calls -----

    handlePOST = (data, args) => {
        this.setState({
            page_loading: true,
        });

        fetch(`${this.url}/student/studyplanner/`, {
            method: "POST",
            headers: this.headers,
            body: JSON.stringify(data),
        })
            .then((res) => res.json())
            .then((result) => {
                if (result.sts === true) {
                    this.setState({
                        successMsg: result.msg,
                        showSuccessAlert: true,
                        page_loading: false,
                    });
                    this.loadCalendarEvents();
                } else {
                    this.scheduleObj.deleteEvent(args.data[0].id);
                    this.setState({
                        errorMsg: result.msg,
                        showErrorAlert: true,
                        page_loading: false,
                    });
                }
            })
            .catch((err) => {
                console.log(err);
                this.scheduleObj.deleteEvent(args.data[0].id);
                this.setState({
                    errorMsg: "Something went wrong!",
                    showErrorAlert: true,
                    page_loading: false,
                });
            });
    };

    handlePATCH = (data, args) => {
        this.setState({
            page_loading: true,
        });

        fetch(`${this.url}/student/studyplanner/${args.event_id}/`, {
            method: "PATCH",
            headers: this.headers,
            body: JSON.stringify(data),
        })
            .then((res) => res.json())
            .then((result) => {
                if (result.sts === true) {
                    this.setState({
                        successMsg: result.msg,
                        showSuccessAlert: true,
                        page_loading: false,
                    });
                    this.loadCalendarEvents();
                } else {
                    this.setState({
                        errorMsg: result.msg,
                        showErrorAlert: true,
                        page_loading: false,
                    });
                }
            })
            .catch((err) => {
                console.log(err);
                this.setState({
                    errorMsg: "Something went wrong!",
                    showErrorAlert: true,
                    page_loading: false,
                });
            });
    };

    handleDelete = (data) => {
        this.setState({
            page_loading: true,
        });

        fetch(`${this.url}/student/studyplanner/${data.event_id}/`, {
            method: "DELETE",
            headers: this.headers,
        })
            .then((res) => res.json())
            .then((result) => {
                if (result.sts === true) {
                    this.setState({
                        successMsg: result.msg,
                        showSuccessAlert: true,
                        page_loading: false,
                    });
                    this.loadCalendarEvents();
                } else {
                    this.setState({
                        errorMsg: result.msg,
                        showErrorAlert: true,
                        page_loading: false,
                    });
                }
            })
            .catch((err) => {
                console.log(err);
                this.setState({
                    errorMsg: "Something went wrong!",
                    showErrorAlert: true,
                    page_loading: false,
                });
            });
    };

    render() {
        return (
            <>
                {/* Alert message */}
                <AlertBox
                    errorMsg={this.state.errorMsg}
                    successMsg={this.state.successMsg}
                    showErrorAlert={this.state.showErrorAlert}
                    showSuccessAlert={this.state.showSuccessAlert}
                    toggleSuccessAlert={() => {
                        this.setState({
                            showSuccessAlert: false,
                        });
                    }}
                    toggleErrorAlert={() => {
                        this.setState({
                            showErrorAlert: false,
                        });
                    }}
                />

                {/* Instruction modal */}
                <InstructionModal
                    show={this.state.showInstructionModal}
                    onHide={() =>
                        this.setState({
                            showInstructionModal: false,
                        })
                    }
                    data={this.state.instruction.data}
                />

                <ScheduleComponent
                    currentView="Month"
                    height="90vh"
                    rowAutoHeight={true}
                    ref={(schedule) => (this.scheduleObj = schedule)}
                    popupOpen={this.onPopupOpen.bind(this)}
                    eventSettings={{
                        dataSource: this.state.events,
                        fields: this.fields,
                        enableTooltip: true,
                    }}
                    quickInfoOnSelectionEnd={true}
                    actionBegin={this.actionBegin.bind(this)}
                    eventRendered={this.onEventRendered.bind(this)}
                >
                    <ViewsDirective>
                        <ViewDirective option="Day" />
                        <ViewDirective option="Week" />
                        <ViewDirective option="Month" />
                        <ViewDirective option="Agenda" />
                    </ViewsDirective>
                    <Inject
                        services={[
                            Day,
                            Week,
                            WorkWeek,
                            Month,
                            Agenda,
                            Resize,
                            DragAndDrop,
                        ]}
                    />
                </ScheduleComponent>

                {/* instruction button */}
                {this.state.instruction.is_active && (
                    <div className="d-flex justify-content-end mt-3">
                        <button
                            className="btn btn-primary rounded-pill shadow-none"
                            onClick={() =>
                                this.setState({
                                    showInstructionModal: true,
                                })
                            }
                        >
                            <i className="fas fa-info-circle mr-1"></i>{" "}
                            Instructions
                        </button>
                    </div>
                )}

                {/* Loading component */}
                {this.state.page_loading ? <Loading /> : ""}
            </>
        );
    }
}

export default StudyPlannerComponent;
