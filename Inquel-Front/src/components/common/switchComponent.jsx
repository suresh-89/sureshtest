import React from "react";
import Switch from "react-switch";

function ReactSwitch(props) {
    return (
        <Switch
            checked={props.checked}
            onChange={props.onChange}
            onColor="#efd2ac"
            onHandleColor="#621012"
            handleDiameter={12}
            uncheckedIcon={false}
            checkedIcon={false}
            boxShadow="0px 1px 5px rgba(0, 0, 0, 0.6)"
            activeBoxShadow="0px 0px 1px 10px rgba(0, 0, 0, 0.2)"
            height={18}
            width={35}
            className="react-switch"
        />
    );
}

export default ReactSwitch;
