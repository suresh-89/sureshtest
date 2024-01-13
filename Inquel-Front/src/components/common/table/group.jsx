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
import { GROUP } from "../../../redux/action";
import storeDispatch from "../../../redux/dispatch";

function valid_fromDate(props) {
    return dateFormat(props.valid_from, "dd/mm/yyyy");
}

function valid_toDate(props) {
    return dateFormat(props.valid_to, "dd/mm/yyyy");
}

function teacherView(props) {
    return (
        <>
            <span>{props.teachers.length}</span>
            <Link to={`/hod/group/${props.id}/teacher`}>
                <button
                    className="btn btn-light btn-sm ml-2 shadow-sm shadow-none"
                    onClick={() => storeDispatch(GROUP, props.group_name)}
                >
                    <i className="fas fa-eye fa-sm"></i>
                </button>
            </Link>
        </>
    );
}

function statusTemplate(props) {
    return (
        <div id="status" className="statustemp">
            <span className="statustxt">
                {props.status ? "Active" : "Inactive"}
            </span>
        </div>
    );
}

function statusdetails(props) {
    if (props.status) {
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

function studentView(props) {
    return (
        <>
            <span>{props.students.length}</span>
            <Link to={`/hod/group/${props.id}/student`}>
                <button
                    className="btn btn-light btn-sm ml-2 shadow-sm shadow-none"
                    onClick={() => storeDispatch(GROUP, props.group_name)}
                >
                    <i className="fas fa-eye fa-sm"></i>
                </button>
            </Link>
        </>
    );
}

function detailsView(props) {
    return (
        <Link to={`/hod/group/${props.id}/details`}>
            <button
                className="btn btn-light btn-sm shadow-sm shadow-none"
                onClick={() => storeDispatch(GROUP, props.group_name)}
            >
                <i className="fas fa-eye fa-sm"></i>
            </button>
        </Link>
    );
}

class GroupTable extends Component {
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
        this.select = {
            persistSelection: true,
            type: "Multiple",
            checkboxOnly: true,
        };
        this.valid_from = {
            ...this.excel,
            itemTemplate: valid_fromDate,
        };
        this.valid_to = {
            ...this.excel,
            itemTemplate: valid_toDate,
        };
        this.status = {
            ...this.check,
            itemTemplate: statusdetails,
        };
        this.toolbarOptions = ["Search"];
    }

    onQueryCellInfo(args) {
        if (args.column.field === "status") {
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

    rowSelected() {
        if (this.gridInstance) {
            const selectedrecords = this.gridInstance.getSelectedRecords();
            let element = [];
            for (let index = 0; index < selectedrecords.length; index++) {
                element.push(selectedrecords[index].id.toString());
            }
            if (this.props.handleGroupId) this.props.handleGroupId(element);
        }
    }

    rowDeselected() {
        if (this.gridInstance) {
            const selectedrecords = this.gridInstance.getSelectedRecords();
            let element = [];
            for (let index = 0; index < selectedrecords.length; index++) {
                element.push(selectedrecords[index].id.toString());
            }
            if (this.props.handleGroupId) this.props.handleGroupId(element);
        }
    }

    viewTemplate = (props) => {
        return (
            <div className="d-flex">
                <Link to={`/${this.props.path}/group/${props.id}`}>
                    <button
                        className="btn btn-link btn-sm shadow-none"
                        onClick={() => storeDispatch(GROUP, props.group_name)}
                    >
                        <i className="fas fa-eye"></i>
                    </button>
                </Link>
                {this.props.hasEdit === true ? (
                    <button
                        className="btn btn-link btn-sm shadow-none ml-1"
                        onClick={() => this.props.handleEdit(props)}
                    >
                        <i className="fas fa-edit fa-sm"></i>
                    </button>
                ) : (
                    ""
                )}
            </div>
        );
    };

    dataBound() {
        this.gridInstance.autoFitColumns();
    }

    render() {
        return (
            <div className="control-pane">
                <div className="control-section">
                    <GridComponent
                        id="overviewgrid"
                        dataSource={this.props.groupItems}
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
                                field="id"
                                headerText="Group ID"
                                isPrimaryKey={true}
                                visible={false}
                            />
                            <ColumnDirective
                                field="group_name"
                                headerText="Group Name"
                                clipMode="EllipsisWithTooltip"
                            />
                            <ColumnDirective
                                field="group_description"
                                headerText="Description"
                                clipMode="EllipsisWithTooltip"
                                allowSorting={false}
                                allowFiltering={false}
                            />
                            <ColumnDirective
                                field="level"
                                headerText="Level"
                                clipMode="EllipsisWithTooltip"
                            />
                            {this.props.status ? (
                                <ColumnDirective
                                    field="status"
                                    headerText="Status"
                                    filter={this.status}
                                    template={statusTemplate}
                                />
                            ) : (
                                ""
                            )}
                            {this.props.valid_from ? (
                                <ColumnDirective
                                    field="valid_from"
                                    headerText="Valid from"
                                    filter={this.valid_from}
                                    clipMode="EllipsisWithTooltip"
                                    template={valid_fromDate}
                                />
                            ) : (
                                ""
                            )}
                            {this.props.valid_to ? (
                                <ColumnDirective
                                    field="valid_to"
                                    headerText="Valid to"
                                    filter={this.valid_to}
                                    clipMode="EllipsisWithTooltip"
                                    template={valid_toDate}
                                />
                            ) : (
                                ""
                            )}
                            {this.props.teacher ? (
                                <ColumnDirective
                                    headerText="Teacher"
                                    allowSorting={false}
                                    allowFiltering={false}
                                    template={teacherView}
                                    width="130"
                                />
                            ) : (
                                ""
                            )}
                            {this.props.student ? (
                                <ColumnDirective
                                    headerText="Student"
                                    allowSorting={false}
                                    allowFiltering={false}
                                    template={studentView}
                                    width="130"
                                />
                            ) : (
                                ""
                            )}
                            {this.props.details ? (
                                <ColumnDirective
                                    headerText="Details"
                                    allowSorting={false}
                                    allowFiltering={false}
                                    template={detailsView}
                                    width="130"
                                />
                            ) : (
                                ""
                            )}
                            {this.props.view ? (
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

export default GroupTable;
