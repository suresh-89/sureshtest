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
    DetailRow,
} from "@syncfusion/ej2-react-grids";
import "./grid-overview.css";
import dateFormat from "dateformat";

function dateTemplate(props) {
    return dateFormat(props.created_on, "dd/mm/yyyy");
}

function statusTemplate(props) {
    return (
        <div id="status" className="statustemp">
            <span className="statustxt">
                {props.status ? "Active" : "Expired"}
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
                <span className="statustxt e-inactivecolor">Expired</span>
            </div>
        );
    }
}

class InvoiceTable extends Component {
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
        this.date = {
            ...this.excel,
            itemTemplate: dateTemplate,
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

    dataBound() {
        this.gridInstance.autoFitColumns();
    }

    render() {
        return (
            <div className="control-pane">
                <div className="control-section">
                    <GridComponent
                        dataSource={this.props.subscription_data}
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
                        toolbar={this.toolbarOptions}
                        childGrid={{
                            dataSource: this.props.purchase_data,
                            queryString: "receipt_id",
                            rowHeight: 40,
                            columns: [
                                {
                                    field: "order_id",
                                    headerText: "Order ID",
                                    clipMode: "EllipsisWithTooltip",
                                },
                                {
                                    field: "receipt_id",
                                    headerText: "Receipt ID",
                                    clipMode: "EllipsisWithTooltip",
                                },
                                {
                                    field: "coupon_applied",
                                    headerText: "Coupon",
                                },
                                {
                                    field: "coupon_price",
                                    headerText: "Discounted price",
                                },
                                {
                                    field: "amount",
                                    headerText: "Amount paid",
                                },
                                {
                                    field: "currency",
                                    headerText: "Currency",
                                },
                                {
                                    headerText: "Payment status",
                                    // eslint-disable-next-line no-template-curly-in-string
                                    template: "${success}",
                                },
                            ],
                        }}
                    >
                        <ColumnsDirective>
                            <ColumnDirective
                                field="title"
                                headerText="Subscription"
                                clipMode="EllipsisWithTooltip"
                            />
                            <ColumnDirective
                                field="duration"
                                headerText="Duration"
                                clipMode="EllipsisWithTooltip"
                                allowFiltering={false}
                                allowSorting={false}
                            />
                            <ColumnDirective
                                field="created_on"
                                headerText="Purchased on"
                                clipMode="EllipsisWithTooltip"
                                template={dateTemplate}
                                filter={this.date}
                            />
                            <ColumnDirective
                                field="valid_to"
                                headerText="Valid to"
                                clipMode="EllipsisWithTooltip"
                            />
                            <ColumnDirective
                                field="status"
                                headerText="Status"
                                filter={this.status}
                                template={statusTemplate}
                            />
                        </ColumnsDirective>
                        <Inject
                            services={[
                                DetailRow,
                                Filter,
                                Sort,
                                Toolbar,
                                Resize,
                            ]}
                        />
                    </GridComponent>
                </div>
                <style>@import 'src/grid/Grid/style.css';</style>
            </div>
        );
    }
}

export default InvoiceTable;
