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
import NumericConversion from "../function/NumericConversion";

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

function pointsTemplate(props) {
    return NumericConversion(props.scored_quiz_points);
}

function weightedAvgTemplate(props) {
    return NumericConversion(props.simulation_average_points);
}

class LeaderboardTable extends Component {
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
        this.toolbarOptions = ["Search"];
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
                        ref={(g) => {
                            this.gridInstance = g;
                        }}
                        dataBound={this.dataBound.bind(this)}
                        filterSettings={this.excel}
                        allowFiltering={true}
                        allowSorting={true}
                        toolbar={this.toolbarOptions}
                    >
                        <ColumnsDirective>
                            <ColumnDirective
                                field="id"
                                visible={false}
                                headerText="ID"
                                isPrimaryKey={true}
                            />
                            <ColumnDirective
                                field="sl_no"
                                headerText="Sl No"
                                clipMode="EllipsisWithTooltip"
                            />
                            <ColumnDirective
                                field="full_name"
                                headerText="Name"
                                clipMode="EllipsisWithTooltip"
                                template={nameTemplate}
                            />
                            <ColumnDirective
                                field="course_name"
                                headerText="Course Title"
                                clipMode="EllipsisWithTooltip"
                            />
                            {this.props.points ? (
                                <ColumnDirective
                                    field="scored_quiz_points"
                                    headerText="Points"
                                    clipMode="EllipsisWithTooltip"
                                    template={pointsTemplate}
                                />
                            ) : (
                                ""
                            )}
                            {this.props.average ? (
                                <ColumnDirective
                                    field="simulation_average_points"
                                    headerText="Weighted Average"
                                    clipMode="EllipsisWithTooltip"
                                    template={weightedAvgTemplate}
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

export default LeaderboardTable;
