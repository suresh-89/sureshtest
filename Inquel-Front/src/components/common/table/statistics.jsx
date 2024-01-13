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
import dateFormat from "dateformat";

function dateTemplate(props) {
    return dateFormat(props.purchased_on, "dd/mm/yyyy");
}

function durationTemplate(props) {
    return `${props.duration_in_months} Months ${props.duration_in_days} Days`;
}

function statusTemplate(props) {
    let end_date = new Date(props.subscription_ends_on);
    let current_date = new Date();
    return (
        <div id="status" className="statustemp">
            <span className="statustxt">
                {end_date.getTime() >= current_date.getTime()
                    ? "Active"
                    : "Inactive"}
            </span>
        </div>
    );
}

function statusdetails(props) {
    let end_date = new Date(props.subscription_ends_on);
    let current_date = new Date();
    if (end_date.getTime() >= current_date.getTime()) {
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

function indexTemplate(props) {
    try {
        return Number(props.index) + 1;
    } catch (error) {
        console.log(error);
    }
}

class SubscriptionTable extends Component {
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
        this.status = {
            ...this.check,
            itemTemplate: statusdetails,
        };
        this.duration = {
            ...this.excel,
            itemTemplate: durationTemplate,
        };
        this.date = {
            ...this.excel,
            itemTemplate: dateTemplate,
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
                    >
                        <ColumnsDirective>
                            <ColumnDirective
                                field="admin_report_id"
                                headerText="Report ID"
                                isPrimaryKey={true}
                                visible={false}
                            />
                            <ColumnDirective
                                field="index"
                                headerText="Sl No"
                                clipMode="EllipsisWithTooltip"
                                template={indexTemplate}
                                allowFiltering={false}
                                allowSorting={false}
                            />
                            <ColumnDirective
                                field="subscription_name"
                                headerText="Name"
                                clipMode="EllipsisWithTooltip"
                            />
                            <ColumnDirective
                                field="duration"
                                headerText="Duration"
                                clipMode="EllipsisWithTooltip"
                                template={durationTemplate}
                                filter={this.duration}
                            />
                            <ColumnDirective
                                field="actual_price"
                                headerText="Actual price"
                                clipMode="EllipsisWithTooltip"
                            />
                            <ColumnDirective
                                field="discount_applied"
                                headerText="Discount applied"
                                clipMode="EllipsisWithTooltip"
                            />
                            <ColumnDirective
                                field="discount_amount"
                                headerText="Discount amount"
                                clipMode="EllipsisWithTooltip"
                            />
                            <ColumnDirective
                                field="purchased_price"
                                headerText="Purchased price"
                                clipMode="EllipsisWithTooltip"
                            />
                            <ColumnDirective
                                field="student.username"
                                headerText="Subscriber user ID"
                                clipMode="EllipsisWithTooltip"
                            />
                            <ColumnDirective
                                field="student.full_name"
                                headerText="Subscriber name"
                                clipMode="EllipsisWithTooltip"
                            />
                            <ColumnDirective
                                field="student.email"
                                headerText="Subscriber email"
                                clipMode="EllipsisWithTooltip"
                            />
                            <ColumnDirective
                                field="purchased_on"
                                headerText="Subscription date"
                                clipMode="EllipsisWithTooltip"
                                template={dateTemplate}
                                filter={this.date}
                            />
                            <ColumnDirective
                                field="status"
                                headerText="Status"
                                filter={this.status}
                                template={statusTemplate}
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

export default SubscriptionTable;
