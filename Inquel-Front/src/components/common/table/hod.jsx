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
import userimage from "../../../assets/user-v1.png";
import { Link } from "react-router-dom";
import dateFormat from "dateformat";

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

function nameTemplate(props) {
    return (
        <div className="d-flex align-items-center">
            <div className="empimg">
                <img
                    src={
                        props.profile_link !== null
                            ? props.profile_link
                            : userimage
                    }
                    alt={props.full_name ? props.full_name : props.username}
                    className="profile-pic"
                />
            </div>
            <span id="Emptext">
                {props.full_name ? props.full_name : props.username}
            </span>
        </div>
    );
}

function dateTemplate(props) {
    return dateFormat(props.date_joined, "dd/mm/yyyy");
}

function viewTemplate(props) {
    return (
        <Link to={`/admin/hod/${props.id}`}>
            <button className="btn btn-link btn-sm shadow-none">
                <i className="fas fa-eye"></i>
            </button>
        </Link>
    );
}

class HODTable extends Component {
    constructor() {
        super(...arguments);
        this.check = {
            type: "CheckBox",
        };
        this.excel = {
            type: "Excel",
        };
        this.menu = {
            type: "Menu",
        };
        this.select = {
            persistSelection: true,
            type: "Multiple",
            checkboxOnly: true,
        };
        this.status = {
            ...this.check,
            itemTemplate: statusdetails,
        };
        this.date = {
            ...this.excel,
            itemTemplate: dateTemplate,
        };
        this.formatOption = { type: "date", format: "dd/MM/yyyy" };
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
                element.push(selectedrecords[index].id.toString());
            }
            if (this.props.handleHODId) this.props.handleHODId(element);
        }
    }

    rowDeselected() {
        if (this.gridInstance) {
            const selectedrecords = this.gridInstance.getSelectedRecords();
            let element = [];
            for (let index = 0; index < selectedrecords.length; index++) {
                element.push(selectedrecords[index].id.toString());
            }
            if (this.props.handleHODId) this.props.handleHODId(element);
        }
    }

    render() {
        return (
            <div className="control-pane">
                <div className="control-section">
                    <GridComponent
                        id="overviewgrid"
                        dataSource={this.props.hodItems}
                        enableHover={true}
                        rowHeight={50}
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
                            <ColumnDirective
                                type="checkbox"
                                allowSorting={false}
                                allowFiltering={false}
                            />
                            <ColumnDirective
                                field="id"
                                visible={false}
                                headerText="HOD ID"
                                isPrimaryKey={true}
                            />
                            <ColumnDirective
                                field="full_name"
                                headerText="Name"
                                clipMode="EllipsisWithTooltip"
                                template={nameTemplate}
                            />
                            <ColumnDirective
                                field="username"
                                headerText="Username"
                                clipMode="EllipsisWithTooltip"
                            />
                            <ColumnDirective
                                field="category"
                                headerText="Category"
                                clipMode="EllipsisWithTooltip"
                            />
                            <ColumnDirective
                                field="sub_category"
                                headerText="Sub category"
                                clipMode="EllipsisWithTooltip"
                            />
                            <ColumnDirective
                                field="discipline"
                                headerText="Discipline"
                                clipMode="EllipsisWithTooltip"
                            />
                            <ColumnDirective
                                field="board"
                                headerText="Board University"
                                clipMode="EllipsisWithTooltip"
                            />
                            <ColumnDirective
                                field="date_joined"
                                filter={this.date}
                                headerText="Registered On"
                                clipMode="EllipsisWithTooltip"
                                template={dateTemplate}
                            />
                            <ColumnDirective
                                field="is_active"
                                headerText="Status"
                                filter={this.status}
                                clipMode="EllipsisWithTooltip"
                                template={statusTemplate}
                            />
                            <ColumnDirective
                                headerText="Action"
                                allowSorting={false}
                                allowFiltering={false}
                                template={viewTemplate}
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

export default HODTable;
