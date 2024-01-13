import React, { Component } from "react";
import {
    GridComponent,
    ColumnsDirective,
    ColumnDirective,
    Filter,
    Inject,
    Sort,
    Toolbar,
    Resize,
} from "@syncfusion/ej2-react-grids";
import "./grid-overview.css";
import { Link } from "react-router-dom";
import dateFormat from "dateformat";
import storeDispatch from "../../../redux/dispatch";
import { COURSE } from "../../../redux/action";
import { OverlayTrigger, Tooltip } from "react-bootstrap";

function dateTemplate(props) {
    return dateFormat(props.created_on, "dd/mm/yyyy");
}

function statusTemplate(props) {
    return (
        <div id="status" className="statustemp">
            <span className="statustxt">
                {props.is_active ? "Active" : "Inactive"}
            </span>
        </div>
    );
}

function statusdetails(props) {
    if (props.is_active) {
        return (
            <div className="statustemp e-activecolor">
                <span className="statustxt e-activecolor">Active</span>
            </div>
        );
    } else {
        return (
            <div className="statustemp e-inactivecolor">
                <span className="statustxt e-inactivecolor">Inactive</span>
            </div>
        );
    }
}

class CourseTable extends Component {
    constructor() {
        super(...arguments);
        this.check = {
            type: "CheckBox",
        };
        this.excel = {
            type: "Excel",
        };
        this.Filter = {
            type: "Menu",
        };
        this.date = {
            ...this.excel,
            itemTemplate: dateTemplate,
        };
        this.status = {
            ...this.check,
            itemTemplate: statusdetails,
        };
        this.select = {
            persistSelection: true,
            type: "Multiple",
            checkboxOnly: true,
        };
        this.toolbarOptions = ["Search"];
    }

    onQueryCellInfo(args) {
        if (args.column.field === "is_active") {
            if (args.cell.textContent === "Active") {
                args.cell
                    .querySelector(".statustxt")
                    .classList.add("e-activecolor");
                args.cell
                    .querySelector(".statustemp")
                    .classList.add("e-activecolor");
            }
            if (args.cell.textContent === "Inactive") {
                args.cell
                    .querySelector(".statustxt")
                    .classList.add("e-inactivecolor");
                args.cell
                    .querySelector(".statustemp")
                    .classList.add("e-inactivecolor");
            }
        }
    }

    dataBound() {
        this.gridInstance.autoFitColumns();
    }

    rowSelected() {
        if (this.gridInstance) {
            const selectedrecords = this.gridInstance.getSelectedRecords();
            let element = [];
            for (let index = 0; index < selectedrecords.length; index++) {
                element.push(selectedrecords[index].course_id);
            }
            if (this.props.handleID) {
                this.props.handleID(element);
            }
        }
    }

    rowDeselected() {
        if (this.gridInstance) {
            const selectedrecords = this.gridInstance.getSelectedRecords();
            let element = [];
            for (let index = 0; index < selectedrecords.length; index++) {
                element.push(selectedrecords[index].course_id);
            }
            if (this.props.handleID) {
                this.props.handleID(element);
            }
        }
    }

    viewTemplate = (props) => {
        return (
            <div className="d-flex">
                <OverlayTrigger
                    key="view"
                    placement="top"
                    overlay={
                        <Tooltip id="tooltip" className="text-left">
                            View
                        </Tooltip>
                    }
                >
                    <Link to={`${this.props.path}/course/${props.course_id}`}>
                        <button
                            className="btn btn-link btn-sm shadow-none"
                            onClick={() =>
                                storeDispatch(COURSE, props.course_name)
                            }
                        >
                            <i className="far fa-eye"></i>
                        </button>
                    </Link>
                </OverlayTrigger>
                <OverlayTrigger
                    key="delete"
                    placement="top"
                    overlay={
                        <Tooltip id="tooltip" className="text-left">
                            Delete
                        </Tooltip>
                    }
                >
                    <button
                        className="btn btn-link btn-sm shadow-none"
                        onClick={() => this.props.handleCRUD(props, "DELETE")}
                    >
                        <i className="far fa-trash-alt fa-sm"></i>
                    </button>
                </OverlayTrigger>
                <OverlayTrigger
                    key="enable/disable"
                    placement="top"
                    overlay={
                        <Tooltip id="tooltip" className="text-left">
                            Enable / Disable
                        </Tooltip>
                    }
                >
                    <button
                        className="btn btn-link btn-sm shadow-none"
                        onClick={() =>
                            this.props.handleCRUD(props, "Enable/Disable")
                        }
                    >
                        <i className="fas fa-ban fa-sm"></i>
                    </button>
                </OverlayTrigger>
            </div>
        );
    };

    render() {
        return (
            <div className="control-pane">
                <div className="control-section">
                    <GridComponent
                        id="overviewgrid"
                        dataSource={this.props.data}
                        enableHover={true}
                        rowHeight={50}
                        width={"100%"}
                        ref={(g) => {
                            this.gridInstance = g;
                        }}
                        queryCellInfo={this.onQueryCellInfo.bind(this)}
                        dataBound={this.dataBound.bind(this)}
                        filterSettings={this.excel}
                        allowFiltering={true}
                        allowSorting={true}
                        allowSelection={true}
                        selectionSettings={this.select}
                        toolbar={this.toolbarOptions}
                        rowSelected={this.rowSelected.bind(this)}
                        rowDeselected={this.rowDeselected.bind(this)}
                    >
                        <ColumnsDirective>
                            {this.props.check ? (
                                <ColumnDirective
                                    type="checkbox"
                                    allowSorting={false}
                                    allowFiltering={false}
                                />
                            ) : (
                                ""
                            )}
                            <ColumnDirective
                                field="course_id"
                                headerText="Course ID"
                                isPrimaryKey={true}
                                visible={false}
                            />
                            <ColumnDirective
                                field="course_name"
                                headerText="Course title"
                                clipMode="EllipsisWithTooltip"
                            />
                            <ColumnDirective
                                field="search_id"
                                headerText="Course key"
                                clipMode="EllipsisWithTooltip"
                            />
                            <ColumnDirective
                                field="board"
                                headerText="Board"
                                clipMode="EllipsisWithTooltip"
                            />
                            <ColumnDirective
                                field="type"
                                headerText="Type"
                                clipMode="EllipsisWithTooltip"
                            />
                            {this.props.created_by ? (
                                <ColumnDirective
                                    field="hod.hod_username"
                                    headerText="Created By"
                                    clipMode="EllipsisWithTooltip"
                                />
                            ) : (
                                ""
                            )}
                            {this.props.created_on ? (
                                <ColumnDirective
                                    field="created_on"
                                    headerText="Created On"
                                    clipMode="EllipsisWithTooltip"
                                    template={dateTemplate}
                                    filter={this.date}
                                />
                            ) : (
                                ""
                            )}
                            {this.props.status ? (
                                <ColumnDirective
                                    field="is_active"
                                    headerText="Status"
                                    filter={this.status}
                                    clipMode="EllipsisWithTooltip"
                                    template={statusTemplate}
                                />
                            ) : (
                                ""
                            )}
                            {this.props.action ? (
                                <ColumnDirective
                                    headerText="Action"
                                    allowSorting={false}
                                    allowFiltering={false}
                                    template={this.viewTemplate}
                                    width="130"
                                />
                            ) : (
                                ""
                            )}
                        </ColumnsDirective>
                        <Inject services={[Filter, Sort, Toolbar, Resize]} />
                    </GridComponent>
                </div>
                <style>@import 'src/grid/Grid/style.css';</style>
            </div>
        );
    }
}

export default CourseTable;
