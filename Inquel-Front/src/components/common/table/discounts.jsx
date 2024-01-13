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

function validFrom_dateTemplate(props) {
    return dateFormat(props.valid_from, "dd/mm/yyyy");
}

function validTo_dateTemplate(props) {
    return dateFormat(props.valid_to, "dd/mm/yyyy");
}

class DiscountTable extends Component {
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
        this.validFrom_date = {
            ...this.excel,
            itemTemplate: validFrom_dateTemplate,
        };
        this.validTo_date = {
            ...this.excel,
            itemTemplate: validTo_dateTemplate,
        };
        this.toolbarOptions = ["Search"];
    }

    dataBound() {
        this.gridInstance.autoFitColumns();
    }

    viewTemplate = (props) => {
        return (
            <div className="d-flex">
                <button
                    className="btn btn-link btn-sm shadow-none"
                    onClick={() => this.props.handleEdit(props)}
                >
                    <i className="fas fa-edit fa-sm"></i>
                </button>
                <button
                    className="btn btn-link btn-sm shadow-none"
                    onClick={() => this.props.handleDelete(props.coupon_id)}
                >
                    <i className="fas fa-trash fa-sm"></i>
                </button>
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
                                field="coupon_name"
                                headerText="Coupon ID"
                                clipMode="EllipsisWithTooltip"
                            />
                            <ColumnDirective
                                field="title"
                                headerText="Coupon Title"
                                clipMode="EllipsisWithTooltip"
                            />
                            <ColumnDirective
                                field="category"
                                headerText="Category"
                                clipMode="EllipsisWithTooltip"
                            />
                            <ColumnDirective
                                field="sub_category"
                                headerText="Sub Category"
                                clipMode="EllipsisWithTooltip"
                            />
                            <ColumnDirective
                                field="discipline"
                                headerText="Discipline"
                                clipMode="EllipsisWithTooltip"
                            />
                            <ColumnDirective
                                field="level"
                                headerText="Levels"
                                clipMode="EllipsisWithTooltip"
                            />
                            <ColumnDirective
                                field="subject"
                                headerText="Subjects"
                                clipMode="EllipsisWithTooltip"
                            />
                            <ColumnDirective
                                field="valid_from"
                                headerText="Valid From"
                                clipMode="EllipsisWithTooltip"
                                template={validFrom_dateTemplate}
                                filter={this.validFrom_date}
                            />
                            <ColumnDirective
                                field="valid_to"
                                headerText="Valid To"
                                clipMode="EllipsisWithTooltip"
                                template={validTo_dateTemplate}
                                filter={this.validTo_date}
                            />
                            <ColumnDirective
                                field="min_points"
                                headerText="Minimum points"
                                clipMode="EllipsisWithTooltip"
                            />
                            <ColumnDirective
                                field="max_points"
                                headerText="Maximum points"
                                clipMode="EllipsisWithTooltip"
                            />
                            <ColumnDirective
                                field="deduction_points"
                                headerText="Deduction points"
                                clipMode="EllipsisWithTooltip"
                            />
                            <ColumnDirective
                                field="points_in_decimal"
                                headerText="Points value (Decimal)"
                                clipMode="EllipsisWithTooltip"
                            />
                            <ColumnDirective
                                field="percentage"
                                headerText="Percentage"
                                clipMode="EllipsisWithTooltip"
                            />
                            <ColumnDirective
                                field="fixed_price"
                                headerText="Fixed Price"
                                clipMode="EllipsisWithTooltip"
                            />
                            <ColumnDirective
                                field="currency"
                                headerText="Currency"
                                clipMode="EllipsisWithTooltip"
                            />
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

export default DiscountTable;
