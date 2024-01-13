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
    return dateFormat(props.created_on, "dd/mm/yyyy");
}

function durationTemplate(props) {
    return `${props.duration_in_months} Months ${props.duration_in_days} Days`;
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
        this.Filter = {
            type: "Menu",
        };
        this.date = {
            ...this.excel,
            itemTemplate: dateTemplate,
        };
        this.duration = {
            ...this.excel,
            itemTemplate: durationTemplate,
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

    rowSelected() {
        if (this.gridInstance) {
            const selectedrecords = this.gridInstance.getSelectedRecords();
            let element = [];
            for (let index = 0; index < selectedrecords.length; index++) {
                element.push(selectedrecords[index].subscription_id.toString());
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
                element.push(selectedrecords[index].subscription_id.toString());
            }
            if (this.props.handleID) {
                this.props.handleID(element);
            }
        }
    }

    viewTemplate = (props) => {
        return (
            <div className="d-flex">
                <button
                    className="btn btn-link btn-sm shadow-none"
                    onClick={() => this.props.toggleEdit(props)}
                >
                    <i className="fas fa-edit fa-sm"></i>
                </button>
                <button
                    className="btn btn-link btn-sm shadow-none"
                    onClick={() => this.props.toggleDelete(props)}
                >
                    <i className="far fa-trash-alt fa-sm"></i>
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
                                field="search_id"
                                headerText="Subscription ID"
                                clipMode="EllipsisWithTooltip"
                            />
                            <ColumnDirective
                                field="discounted_price"
                                headerText="Pricing"
                                clipMode="EllipsisWithTooltip"
                            />
                            <ColumnDirective
                                field="discount_applicable"
                                headerText="Discount applicable"
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
                                field="created_on"
                                headerText="Created On"
                                clipMode="EllipsisWithTooltip"
                                template={dateTemplate}
                                filter={this.date}
                            />
                            {this.props.showAction ? (
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

export default SubscriptionTable;
