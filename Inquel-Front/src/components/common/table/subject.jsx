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
import storeDispatch from "../../../redux/dispatch";
import { SUBJECT } from "../../../redux/action";

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

class SubjectTable extends Component {
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

    dataBound() {
        this.gridInstance.autoFitColumns();
    }

    rowSelected() {
        if (this.gridInstance) {
            const selectedrecords = this.gridInstance.getSelectedRecords();
            let element = [];
            for (let index = 0; index < selectedrecords.length; index++) {
                element.push(selectedrecords[index].id.toString());
            }
            if (this.props.handleSubjectId) {
                this.props.handleSubjectId(element);
            }
        }
    }

    rowDeselected() {
        if (this.gridInstance) {
            const selectedrecords = this.gridInstance.getSelectedRecords();
            let element = [];
            for (let index = 0; index < selectedrecords.length; index++) {
                element.push(selectedrecords[index].id.toString());
            }
            if (this.props.handleSubjectId) {
                this.props.handleSubjectId(element);
            }
        }
    }

    viewTemplate = (props) => {
        return (
            <div className="d-flex">
                <Link to={`/${this.props.path}/subject/${props.id}`}>
                    <button
                        className="btn btn-link btn-sm shadow-none"
                        onClick={() =>
                            storeDispatch(SUBJECT, props.subject_name)
                        }
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

    render() {
        return (
            <div className="control-pane">
                <div className="control-section">
                    <GridComponent
                        id="overviewgrid"
                        dataSource={this.props.subjectItems}
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
                            {this.props.check === true ? (
                                <ColumnDirective
                                    type="checkbox"
                                    allowSorting={false}
                                    allowFiltering={false}
                                />
                            ) : null}
                            <ColumnDirective
                                field="id"
                                headerText="Subject ID"
                                isPrimaryKey={true}
                                visible={false}
                            />
                            <ColumnDirective
                                field="subject_name"
                                headerText="Subject Name"
                                clipMode="EllipsisWithTooltip"
                            />
                            {this.props.category === true ? (
                                <ColumnDirective
                                    field="category"
                                    headerText="Category"
                                    clipMode="EllipsisWithTooltip"
                                />
                            ) : null}
                            {this.props.sub_category === true ? (
                                <ColumnDirective
                                    field="sub_category"
                                    headerText="Sub category"
                                    clipMode="EllipsisWithTooltip"
                                />
                            ) : null}
                            {this.props.discipline === true ? (
                                <ColumnDirective
                                    field="discipline"
                                    headerText="Discipline"
                                    clipMode="EllipsisWithTooltip"
                                />
                            ) : null}
                            {this.props.level === true ? (
                                <ColumnDirective
                                    field="level"
                                    headerText="Level"
                                    clipMode="EllipsisWithTooltip"
                                />
                            ) : null}
                            {this.props.subject === true ? (
                                <ColumnDirective
                                    field="subject"
                                    headerText="Subject"
                                    clipMode="EllipsisWithTooltip"
                                />
                            ) : null}
                            {this.props.status === true ? (
                                <ColumnDirective
                                    field="status"
                                    headerText="Status"
                                    filter={this.status}
                                    clipMode="EllipsisWithTooltip"
                                    template={statusTemplate}
                                />
                            ) : null}
                            <ColumnDirective
                                headerText="Action"
                                allowSorting={false}
                                allowFiltering={false}
                                template={this.viewTemplate}
                                width="130"
                            />
                        </ColumnsDirective>
                        <Inject services={[Filter, Sort, Toolbar, Resize]} />
                    </GridComponent>
                </div>
                <style>@import 'src/grid/Grid/style.css';</style>
            </div>
        );
    }
}

export default SubjectTable;
