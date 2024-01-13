import React, { Component } from "react";
import Wrapper from "../wrapper";
import { Link } from "react-router-dom";
import { baseUrl, adminPathUrl } from "../../../shared/baseUrl.js";
import Loading from "../../common/loader";
import AlertBox from "../../common/alert";
import { connect } from "react-redux";
import Slider from "react-slick";
import { SUBJECT_THUMBNAIL } from "../../../shared/constant";

const mapStateToProps = (state) => ({
    hod_data: state.storage.temp,
    group_name: state.content.group_name,
});

class AdminHODGroup extends Component {
    constructor(props) {
        super(props);
        this.state = {
            subjectItems: [],

            errorMsg: "",
            successMsg: "",
            showErrorAlert: false,
            showSuccessAlert: false,
            page_loading: true,
        };
        this.hodId = this.props.match.params.hodId;
        this.groupId = this.props.match.params.groupId;
        this.url = baseUrl + adminPathUrl;
        this.authToken = localStorage.getItem("Inquel-Auth");
        this.headers = {
            Accept: "application/json",
            "Content-Type": "application/json",
            "Inquel-Auth": this.authToken,
        };
    }

    loadSubjectData = () => {
        fetch(`${this.url}/hod/${this.hodId}/group/${this.groupId}/`, {
            headers: this.headers,
            method: "GET",
        })
            .then((res) => res.json())
            .then((result) => {
                if (result.sts === true) {
                    this.setState({
                        subjectItems: result.data.subjects,
                        totalSubjectCount: result.data.subjects.length,
                        page_loading: false,
                    });
                } else {
                    this.setState({
                        errorMsg: result.msg,
                        showErrorAlert: true,
                        page_loading: false,
                    });
                }
            })
            .catch((err) => {
                console.log(err);
                this.setState({
                    errorMsg: "Something went wrong!",
                    showErrorAlert: true,
                    page_loading: false,
                });
            });
    };

    componentDidMount = () => {
        document.title = `${this.props.group_name} - Admin | IQLabs`;

        this.loadSubjectData();
    };

    render() {
        var settings = {
            dots: true,
            infinite: false,
            speed: 500,
            slidesToShow: 4,
            slidesToScroll: 4,
            initialSlide: 0,
            responsive: [
                {
                    breakpoint: 1024,
                    settings: {
                        slidesToShow: 2,
                        slidesToScroll: 2,
                        dots: true,
                    },
                },
                {
                    breakpoint: 600,
                    settings: {
                        slidesToShow: 1,
                        slidesToScroll: 1,
                        dots: false,
                    },
                },
            ],
        };
        return (
            <Wrapper
                header={this.props.group_name}
                activeLink="dashboard"
                history={this.props.history}
            >
                {/* Alert message */}
                <AlertBox
                    errorMsg={this.state.errorMsg}
                    successMsg={this.state.successMsg}
                    showErrorAlert={this.state.showErrorAlert}
                    showSuccessAlert={this.state.showSuccessAlert}
                    toggleSuccessAlert={() => {
                        this.setState({
                            showSuccessAlert: false,
                        });
                    }}
                    toggleErrorAlert={() => {
                        this.setState({
                            showErrorAlert: false,
                        });
                    }}
                />

                {/* ----- Breadcrumb ----- */}
                <nav aria-label="breadcrumb">
                    <ol className="breadcrumb mb-3">
                        <li className="breadcrumb-item">
                            <Link to="/admin">
                                <i className="fas fa-home fa-sm"></i>
                            </Link>
                        </li>
                        <li className="breadcrumb-item">
                            <Link to="#" onClick={this.props.history.goBack}>
                                HOD
                            </Link>
                        </li>
                        <li className="breadcrumb-item active">
                            <span>Group:</span>
                            {this.props.group_name}
                        </li>
                    </ol>
                </nav>

                <div className="card shadow-sm mb-4">
                    <div className="card-header">
                        <h5 className="mb-0">Subjects</h5>
                    </div>
                    <div className="card-body p-3">
                        {this.state.subjectItems &&
                        this.state.subjectItems.length > 0 ? (
                            <Slider {...settings}>
                                {(this.state.subjectItems || []).map(
                                    (data, index) => {
                                        return (
                                            <div
                                                className="px-3"
                                                data-index={index}
                                                key={index}
                                            >
                                                <div className="card">
                                                    <img
                                                        src={SUBJECT_THUMBNAIL}
                                                        className="card-img-top"
                                                        alt={data.subject_name}
                                                    />
                                                    <div className="card-body primary-bg text-white p-2">
                                                        {data.subject_name}
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    }
                                )}
                            </Slider>
                        ) : null}
                    </div>
                </div>
                {/* Loading component */}
                {this.state.page_loading ? <Loading /> : ""}
            </Wrapper>
        );
    }
}

export default connect(mapStateToProps)(AdminHODGroup);
