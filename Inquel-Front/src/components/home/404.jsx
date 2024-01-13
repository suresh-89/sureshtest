import React, { Component } from "react";
import { Link } from "react-router-dom";
import errorImg from "../../assets/error-404.svg";

class errorPage extends Component {
    componentDidMount = () => {
        document.title = "404 - Page Not Found | IQLabs";
    };
    render() {
        return (
            <div className="section py-5">
                <div className="container-fluid ">
                    <div className="row justify-content-center">
                        <div className="col-md-3 col-sm-8">
                            <img
                                src={errorImg}
                                alt="Page not found"
                                className="img-fluid mb-4"
                            />
                        </div>
                    </div>
                    <div className="text-center">
                        <h1 className="primary-text mb-2 display-3 font-weight-bold">
                            404
                        </h1>
                        <h3 className="primary-text font-weight-bold mb-3">
                            Page Not Found
                        </h3>
                        <p className="mb-4">
                            The Page You Are Looking Is Moved or Doesn't Exist
                        </p>
                        <Link to="#" onClick={this.props.history.goBack}>
                            <button className="btn btn-primary-invert">
                                Go Back
                            </button>
                        </Link>
                    </div>
                </div>
            </div>
        );
    }
}

export default errorPage;
