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

function valid_from_template(props) {
    return dateFormat(props.subscription_starts_on, "dd/mm/yyyy");
}

function valid_to_template(props) {
    return dateFormat(props.subscription_ends_on, "dd/mm/yyyy");
}

function statusTemplate(props) {
    let end_date = new Date(props.subscription_ends_on);
    let current_date = new Date();
    return (
        <div id="status" className="statustemp">
            <span className="statustxt">
                {end_date.getTime() >= current_date.getTime()
                    ? "Active"
                    : "Expired"}
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
                <span className="statustxt e-inactivecolor">Expired</span>
            </div>
        );
    }
}

class StudentSubscriptionTable extends Component {
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
        this.valid_from = {
            ...this.excel,
            itemTemplate: valid_from_template,
        };
        this.valid_to = {
            ...this.excel,
            itemTemplate: valid_to_template,
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

    dataBound() {
        this.gridInstance.autoFitColumns();
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
            if (args.cell.textContent === "Expired") {
                args.cell
                    .querySelector(".statustxt")
                    .classList.add("e-inactivecolor");
                args.cell
                    .querySelector(".statustemp")
                    .classList.add("e-inactivecolor");
            }
        }
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
                                field="subscription_id"
                                headerText="Subscription ID"
                                isPrimaryKey={true}
                                visible={false}
                            />
                            <ColumnDirective
                                field="title"
                                headerText="Title"
                                clipMode="EllipsisWithTooltip"
                            />
                            <ColumnDirective
                                field="purchase_detail.coupon_applied"
                                headerText="Coupon applied"
                                clipMode="EllipsisWithTooltip"
                            />
                            <ColumnDirective
                                field="purchase_detail.coupon_price"
                                headerText="Discounted price"
                                clipMode="EllipsisWithTooltip"
                            />
                            <ColumnDirective
                                field="purchase_detail.amount_paid"
                                headerText="Amount paid"
                                clipMode="EllipsisWithTooltip"
                            />
                            <ColumnDirective
                                field="subscription_starts_on"
                                headerText="Valid from"
                                clipMode="EllipsisWithTooltip"
                                template={valid_from_template}
                                filter={this.valid_from}
                            />
                            <ColumnDirective
                                field="subscription_ends_on"
                                headerText="Valid to"
                                clipMode="EllipsisWithTooltip"
                                template={valid_to_template}
                                filter={this.valid_to}
                            />
                            <ColumnDirective
                                field="status"
                                headerText="Status"
                                filter={this.status}
                                template={statusTemplate}
                            />
                            <ColumnDirective
                                field="scored_quiz_points"
                                headerText="Quiz points"
                                clipMode="EllipsisWithTooltip"
                            />
                            <ColumnDirective
                                field="simulation_average_points"
                                headerText="Simulation Avg"
                                clipMode="EllipsisWithTooltip"
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

export default StudentSubscriptionTable;
