import React, { useState, useEffect } from "react";
import Dropdown from "react-multilevel-dropdown";
import { connect } from "react-redux";
import { STUDY_GUIDE } from "../../../redux/action";
import storeDispatch from "../../../redux/dispatch";
import { baseUrl, homeURL } from "../../../shared/baseUrl";

const mapStateToProps = (state) => ({
    study_guide: state.storage.study_guide,
});

const DropdownItem = (props) => {
    const nestedDropdown = (props.data.child || []).map((child, index) => {
        return <DropdownItem data={child} key={index} />;
    });

    return (
        <>
            <Dropdown.Item className="study-guide-dropdown-item">
                {props.data.guide_url !== "" ? (
                    <a
                        href={props.data.guide_url}
                        target="_blank"
                        rel="noreferrer"
                        className="text-decoration-none w-100"
                    >
                        <div className="text-wrap">{props.data.guide_name}</div>
                    </a>
                ) : (
                    <div className="text-wrap">{props.data.guide_name}</div>
                )}
                {props.data.child && props.data.child.length !== 0 ? (
                    <>
                        <i className="fas fa-caret-right ml-auto"></i>
                        <Dropdown.Submenu position="right">
                            {nestedDropdown}
                        </Dropdown.Submenu>
                    </>
                ) : null}
            </Dropdown.Item>
        </>
    );
};

const StudyGuideDropdown = (props) => {
    const [data, setData] = useState(props.study_guide);

    useEffect(() => {
        if (props.study_guide && props.study_guide.length === 0) {
            fetch(`${baseUrl}${homeURL}/studyguide/`, {
                method: "GET",
            })
                .then((res) => res.json())
                .then((result) => {
                    if (result.sts === true) {
                        storeDispatch(STUDY_GUIDE, result.data);
                        setData(result.data);
                    }
                })
                .catch((err) => {
                    console.log(err);
                });
        }
        // eslint-disable-next-line
    }, []);

    return data && data.length !== 0 ? (
        <Dropdown
            title="Study guide"
            buttonClassName="study-guide-dropdown nav-link text-dark mr-md-3"
            position="right"
        >
            {data.map((item, index) => {
                return <DropdownItem data={item} key={index} />;
            })}
        </Dropdown>
    ) : null;
};

export default connect(mapStateToProps)(StudyGuideDropdown);
