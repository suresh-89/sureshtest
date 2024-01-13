import React, { Component } from "react";
import { Modal, Alert, Spinner } from "react-bootstrap";
import { baseUrl, inquelAdminUrl } from "../../shared/baseUrl";
import Select from "react-select";
import axios from "axios";

export default class SubscriptionModal extends Component {
    constructor() {
        super();
        this.state = {
            filter: {
                category: [],
                sub_category: [],
                discipline: [],
                levels: [],
                subjects: [],
                type: [],
                board: [],
                hod: [],
            },
            selected: {
                category: "",
                sub_category: "",
                discipline: "",
                levels: "",
                subjects: "",
                type: "",
                board: "",
                hod: "",
            },
            subscription_data: {
                title: "",
                description: "",
                months: 0,
                days: 0,
                discounted_price: "",
                courses: [],
                search_terms: [],
                recommended_course: [],
                discount_applicable: false,
                coupons: [],
            },
            total_price: 0,

            course_list: [],
            discounts: [],

            file: "",
            filename: "",

            loader: {
                category: true,
                sub_category: false,
                discipline: false,
                levels: false,
                subjects: false,
                board: false,
                type: false,
                hod: false,
                course_list: false,
                modal_loading: true,
            },
            errorMsg: "",
            successMsg: "",
            showErrorAlert: false,
            showSuccessAlert: false,
            showLoader: false,
        };
        this.url = baseUrl + inquelAdminUrl;
        this.authToken = localStorage.getItem("Inquel-Auth");
        this.headers = {
            Accept: "application/json",
            "Content-Type": "application/json",
            "Inquel-Auth": this.authToken,
        };
    }

    componentDidMount = () => {
        if (this.props.data) {
            fetch(
                `${this.url}/subscription/${this.props.data.subscription_id}/`,
                {
                    headers: this.headers,
                    method: "GET",
                }
            )
                .then((res) => res.json())
                .then((result) => {
                    if (result.sts === true) {
                        let total_price = 0;
                        let data = this.state.subscription_data;

                        data.title = result.data.title;
                        data.description = result.data.description;
                        data.months = result.data.duration_in_months;
                        data.days = result.data.duration_in_days;
                        data.discounted_price = result.data.discounted_price;
                        data.courses = result.data.courses;
                        data.search_terms = result.data.search_terms;
                        data.discount_applicable =
                            result.data.discount_applicable === true
                                ? true
                                : false;
                        data.coupons = result.data.coupons;
                        data.recommended_course =
                            result.data.recommended_course;

                        result.data.courses.forEach((data) => {
                            total_price += data.price;
                        });

                        let loader = this.state.loader;
                        loader.modal_loading = false;

                        this.setState({
                            subscription_data: data,
                            total_price: total_price,
                            loader: loader,
                        });
                    } else {
                        let loader = this.state.loader;
                        loader.modal_loading = false;
                        this.setState({
                            errorMsg: result.msg,
                            showErrorAlert: true,
                            loader: loader,
                        });
                    }
                })
                .catch((err) => {
                    console.log(err);
                    let loader = this.state.loader;
                    loader.modal_loading = false;
                    this.setState({
                        errorMsg: "Something went wrong!",
                        showErrorAlert: true,
                        loader: loader,
                    });
                });
        } else {
            let loader = this.state.loader;
            loader.modal_loading = false;
            this.setState({
                loader: loader,
            });
        }

        this.loadCategory();
    };

    // ----- Filter data -----
    loadCategory = () => {
        fetch(`${this.url}/subscription/filter/`, {
            headers: this.headers,
            method: "GET",
        })
            .then((res) => res.json())
            .then((result) => {
                if (result.sts === true) {
                    let filter = this.state.filter;
                    filter.category = result.data.category;
                    let loader = this.state.loader;
                    loader.category = false;
                    this.setState({
                        filter: filter,
                        course_list: [],
                        discounts: [],
                        loader: loader,
                    });
                } else {
                    this.setState({
                        errorMsg: result.msg,
                        showErrorAlert: true,
                    });
                }
            })
            .catch((err) => {
                console.log(err);
                this.setState({
                    errorMsg: "Something went wrong!",
                    showErrorAlert: true,
                });
            });
    };

    loadSubCategory = async (event) => {
        let data = this.state.selected;
        data.category = event.value;
        data.sub_category = "";
        data.discipline = "";
        data.levels = "";
        data.subjects = "";
        data.board = "";
        data.type = "";
        data.hod = "";
        let filter = this.state.filter;
        filter.sub_category = [];
        filter.discipline = [];
        filter.levels = [];
        filter.subjects = [];
        filter.type = [];
        filter.board = [];
        filter.hod = [];
        let loader = this.state.loader;
        loader.sub_category = true;
        await this.setState({
            selected: data,
            filter: filter,
            course_list: [],
            discounts: [],
            loader: loader,
        });

        if (event.value !== "") {
            fetch(`${this.url}/subscription/filter/?category=${event.value}`, {
                headers: this.headers,
                method: "GET",
            })
                .then((res) => res.json())
                .then((result) => {
                    if (result.sts === true) {
                        let filter = this.state.filter;
                        filter.sub_category = result.data.sub_category;
                        let loader = this.state.loader;
                        loader.sub_category = false;
                        this.setState({
                            filter: filter,
                            loader: loader,
                        });
                    } else {
                        this.setState({
                            errorMsg: result.msg,
                            showErrorAlert: true,
                        });
                    }
                })
                .catch((err) => {
                    console.log(err);
                    this.setState({
                        errorMsg: "Something went wrong!",
                        showErrorAlert: true,
                    });
                });
        }
    };

    loadDiscipline = async (event) => {
        let data = this.state.selected;
        data.sub_category = event.value;
        data.discipline = "";
        data.levels = "";
        data.subjects = "";
        data.board = "";
        data.type = "";
        data.hod = "";
        let filter = this.state.filter;
        filter.discipline = [];
        filter.levels = [];
        filter.subjects = [];
        filter.type = [];
        filter.board = [];
        filter.hod = [];
        let loader = this.state.loader;
        loader.discipline = true;
        await this.setState({
            selected: data,
            filter: filter,
            course_list: [],
            discounts: [],
            loader: loader,
        });

        if (event.value !== "") {
            fetch(
                `${this.url}/subscription/filter/?category=${data.category}&sub_category=${event.value}`,
                {
                    headers: this.headers,
                    method: "GET",
                }
            )
                .then((res) => res.json())
                .then((result) => {
                    if (result.sts === true) {
                        let filter = this.state.filter;
                        filter.discipline = result.data.discipline;
                        let loader = this.state.loader;
                        loader.discipline = false;
                        this.setState({
                            filter: filter,
                            loader: loader,
                        });
                        this.discountsAPI();
                    } else {
                        this.setState({
                            errorMsg: result.msg,
                            showErrorAlert: true,
                        });
                    }
                })
                .catch((err) => {
                    console.log(err);
                    this.setState({
                        errorMsg: "Something went wrong!",
                        showErrorAlert: true,
                    });
                });
        }
    };

    loadLevels = async (event) => {
        let data = this.state.selected;
        data.discipline = event.value;
        data.levels = "";
        data.subjects = "";
        data.board = "";
        data.type = "";
        data.hod = "";
        let filter = this.state.filter;
        filter.levels = [];
        filter.subjects = [];
        filter.type = [];
        filter.board = [];
        filter.hod = [];
        let loader = this.state.loader;
        loader.levels = true;
        loader.course_list = true;
        await this.setState({
            selected: data,
            filter: filter,
            course_list: [],
            discounts: [],
            loader: loader,
        });

        if (event.value !== "") {
            fetch(
                `${this.url}/subscription/filter/?category=${data.category}&sub_category=${data.sub_category}&discipline=${event.value}`,
                {
                    headers: this.headers,
                    method: "GET",
                }
            )
                .then((res) => res.json())
                .then((result) => {
                    if (result.sts === true) {
                        let filter = this.state.filter;
                        filter.levels = result.data.level;
                        this.setState({
                            filter: filter,
                        });
                        let URL = `${this.url}/subscription/filter/course/?category=${data.category}&sub_category=${data.sub_category}&discipline=${data.discipline}`;
                        this.courseAPI(URL);
                        this.discountsAPI();
                    } else {
                        this.setState({
                            errorMsg: result.msg,
                            showErrorAlert: true,
                        });
                    }
                })
                .catch((err) => {
                    console.log(err);
                    this.setState({
                        errorMsg: "Something went wrong!",
                        showErrorAlert: true,
                    });
                });
        }
    };

    loadSubjects = async (event) => {
        let data = this.state.selected;
        data.levels = event.value;
        data.subjects = "";
        data.board = "";
        data.type = "";
        data.hod = "";
        let filter = this.state.filter;
        filter.subjects = [];
        filter.type = [];
        filter.board = [];
        filter.hod = [];
        let loader = this.state.loader;
        loader.subjects = true;
        loader.course_list = true;
        await this.setState({
            selected: data,
            filter: filter,
            course_list: [],
            discounts: [],
            loader: loader,
        });

        if (event.value !== "") {
            fetch(
                `${this.url}/subscription/filter/?category=${data.category}&sub_category=${data.sub_category}&discipline=${data.discipline}&level=${event.value}`,
                {
                    headers: this.headers,
                    method: "GET",
                }
            )
                .then((res) => res.json())
                .then((result) => {
                    if (result.sts === true) {
                        let filter = this.state.filter;
                        filter.subjects = result.data.subject;
                        this.setState({
                            filter: filter,
                        });
                        let URL = `${this.url}/subscription/filter/course/?category=${data.category}&sub_category=${data.sub_category}&discipline=${data.discipline}&level=${data.levels}`;
                        this.courseAPI(URL);
                        this.discountsAPI();
                    } else {
                        this.setState({
                            errorMsg: result.msg,
                            showErrorAlert: true,
                        });
                    }
                })
                .catch((err) => {
                    console.log(err);
                    this.setState({
                        errorMsg: "Something went wrong!",
                        showErrorAlert: true,
                    });
                });
        }
    };

    loadBoard = async (event) => {
        let data = this.state.selected;
        data.subjects = event.value;
        data.board = "";
        data.type = "";
        data.hod = "";
        let filter = this.state.filter;
        filter.type = [];
        filter.board = [];
        filter.hod = [];
        let loader = this.state.loader;
        loader.board = true;
        loader.course_list = true;
        await this.setState({
            selected: data,
            filter: filter,
            course_list: [],
            discounts: [],
            loader: loader,
        });

        if (event.value !== "") {
            fetch(
                `${this.url}/subscription/filter/?category=${data.category}&sub_category=${data.sub_category}&discipline=${data.discipline}&level=${data.levels}&subject=${event.value}`,
                {
                    headers: this.headers,
                    method: "GET",
                }
            )
                .then((res) => res.json())
                .then((result) => {
                    if (result.sts === true) {
                        let filter = this.state.filter;
                        filter.board = result.data.board;
                        this.setState({
                            filter: filter,
                        });
                        let URL = `${this.url}/subscription/filter/course/?category=${data.category}&sub_category=${data.sub_category}&discipline=${data.discipline}&level=${data.levels}&subject=${data.subjects}`;
                        this.courseAPI(URL);
                        this.discountsAPI();
                    } else {
                        this.setState({
                            errorMsg: result.msg,
                            showErrorAlert: true,
                        });
                    }
                })
                .catch((err) => {
                    console.log(err);
                    this.setState({
                        errorMsg: "Something went wrong!",
                        showErrorAlert: true,
                    });
                });
        }
    };

    loadType = async (event) => {
        let data = this.state.selected;
        data.board = event.value;
        data.type = "";
        data.hod = "";
        let filter = this.state.filter;
        filter.type = [];
        filter.hod = [];
        let loader = this.state.loader;
        loader.type = true;
        loader.course_list = true;
        await this.setState({
            selected: data,
            filter: filter,
            course_list: [],
            discounts: [],
            loader: loader,
        });

        if (event.value !== "") {
            fetch(
                `${this.url}/subscription/filter/?category=${data.category}&sub_category=${data.sub_category}&discipline=${data.discipline}&level=${data.levels}&subject=${data.subjects}&board=${event.value}`,
                {
                    headers: this.headers,
                    method: "GET",
                }
            )
                .then((res) => res.json())
                .then((result) => {
                    if (result.sts === true) {
                        let filter = this.state.filter;
                        filter.type = result.data.type;
                        this.setState({
                            filter: filter,
                        });
                        let URL = `${this.url}/subscription/filter/course/?category=${data.category}&sub_category=${data.sub_category}&discipline=${data.discipline}&level=${data.levels}&subject=${data.subjects}&board=${data.board}`;
                        this.courseAPI(URL);
                    } else {
                        this.setState({
                            errorMsg: result.msg,
                            showErrorAlert: true,
                        });
                    }
                })
                .catch((err) => {
                    console.log(err);
                    this.setState({
                        errorMsg: "Something went wrong!",
                        showErrorAlert: true,
                    });
                });
        }
    };

    loadHOD = async (event) => {
        let data = this.state.selected;
        data.type = event.value;
        data.hod = "";
        let filter = this.state.filter;
        filter.hod = [];
        let loader = this.state.loader;
        loader.hod = true;
        loader.course_list = true;
        await this.setState({
            selected: data,
            filter: filter,
            course_list: [],
            discounts: [],
            loader: loader,
        });

        if (event.value !== "") {
            fetch(
                `${this.url}/subscription/filter/?category=${data.category}&sub_category=${data.sub_category}&discipline=${data.discipline}&level=${data.levels}&subject=${data.subjects}&board=${data.board}&type=${event.value}`,
                {
                    headers: this.headers,
                    method: "GET",
                }
            )
                .then((res) => res.json())
                .then((result) => {
                    if (result.sts === true) {
                        let filter = this.state.filter;
                        filter.hod = result.data;
                        this.setState({
                            filter: filter,
                        });
                        let URL = `${this.url}/subscription/filter/course/?category=${data.category}&sub_category=${data.sub_category}&discipline=${data.discipline}&level=${data.levels}&subject=${data.subjects}&board=${data.board}&type=${data.type}`;
                        this.courseAPI(URL);
                    } else {
                        this.setState({
                            errorMsg: result.msg,
                            showErrorAlert: true,
                        });
                    }
                })
                .catch((err) => {
                    console.log(err);
                    this.setState({
                        errorMsg: "Something went wrong!",
                        showErrorAlert: true,
                    });
                });
        }
    };

    // ----- Course data -----
    loadCourseList = (event) => {
        let data = this.state.selected;
        data.hod = event.value;
        let loader = this.state.loader;
        loader.course_list = true;
        this.setState(
            {
                selected: data,
                course_list: [],
                discounts: [],
                loader: loader,
            },
            () => {
                if (event.value !== "") {
                    let URL = `${this.url}/subscription/filter/course/?category=${data.category}&sub_category=${data.sub_category}&discipline=${data.discipline}&level=${data.levels}&subject=${data.subjects}&board=${data.board}&type=${data.type}&hod_id=${data.hod}`;
                    this.courseAPI(URL);
                }
            }
        );
    };

    courseAPI = async (path) => {
        fetch(path, {
            headers: this.headers,
            method: "GET",
        })
            .then((res) => res.json())
            .then((result) => {
                if (result.sts === true) {
                    let data = this.state.course_list;
                    if (
                        result.data.results &&
                        result.data.results.length !== 0
                    ) {
                        data.push(...result.data.results);
                        this.setState(
                            {
                                course_list: data,
                            },
                            async () => {
                                if (result.data.next !== null) {
                                    let loader = this.state.loader;
                                    loader.course_list = true;
                                    await this.setState({
                                        loader: loader,
                                    });
                                    this.courseAPI(result.data.next);
                                } else {
                                    let loader = this.state.loader;
                                    loader.course_list = false;
                                    loader.levels = false;
                                    loader.subjects = false;
                                    loader.board = false;
                                    loader.type = false;
                                    loader.hod = false;
                                    this.setState({
                                        loader: loader,
                                    });
                                }
                            }
                        );
                    }
                } else {
                    this.setState({
                        errorMsg: result.msg,
                        showErrorAlert: true,
                    });
                }
            })
            .catch((err) => {
                console.log(err);
                this.setState({
                    errorMsg: "Something went wrong!",
                    showErrorAlert: true,
                });
            });
    };

    // ----- Subscription & Recommend course adding, removing -----
    handleDragStart = (event, data) => {
        event.dataTransfer.setData("data", JSON.stringify(data));
        var node = document.getElementById(event.target.id);
        if (node !== null) {
            var crt = node.cloneNode(true);
            crt.id = event.target.id + "-copy";
            crt.classList.add("ghost-card");
            document.getElementById("root").appendChild(crt);
            event.dataTransfer.setDragImage(crt, 0, 0);
        }
    };

    handleDragEnd = (event) => {
        var id = event.target.id + "-copy";
        var node = document.getElementById(id);
        if (node !== null) {
            node.parentNode.removeChild(node);
        }
    };

    handleSubscriptionDrop = (event) => {
        let data = JSON.parse(event.dataTransfer.getData("data")) || null;
        let subscription = this.state.subscription_data;

        if (data !== null) {
            // checking whether a course is already present or not
            const found = subscription.courses.some(
                (el) => el.course_id === data.course_id
            );
            if (!found) {
                subscription.courses.push({
                    course_id: data.course_id,
                    course_name: data.course_name,
                    price: "",
                });
                // remove the course from the recommend section if it is already present
                const isCourseAdded = subscription.recommended_course.some(
                    (el) => el.course_id === data.course_id
                );
                if (isCourseAdded) {
                    subscription.recommended_course.splice(
                        subscription.recommended_course
                            .map((item) => {
                                return item.course_id;
                            })
                            .indexOf(data.course_id),
                        1
                    );
                }
            } else {
                this.setState({
                    errorMsg: "Course already added!",
                    showErrorAlert: true,
                });
            }
        }

        this.setState({
            subscription_data: subscription,
        });
    };

    handleRecommendDrop = (event) => {
        let data = JSON.parse(event.dataTransfer.getData("data")) || null;
        let subscription = this.state.subscription_data;

        if (data !== null) {
            // checking if the course is already added in the subscription table
            const found = subscription.courses.some(
                (el) => el.course_id === data.course_id
            );
            if (!found) {
                // check if course is already added in the recommended section
                const isCourseAdded = subscription.recommended_course.some(
                    (el) => el.course_id === data.course_id
                );
                if (!isCourseAdded) {
                    subscription.recommended_course.push({
                        course_name: data.course_name,
                        course_id: data.course_id,
                    });
                } else {
                    this.setState({
                        errorMsg: "Course already added!",
                        showErrorAlert: true,
                    });
                }
            } else {
                this.setState({
                    errorMsg: "Course already added in the subscription!",
                    showErrorAlert: true,
                });
            }
        }

        this.setState({
            subscription_data: subscription,
        });
    };

    handleRemoveCourse = (index) => {
        let data = this.state.subscription_data;
        let total_price = 0;

        data.courses.splice(index, 1);

        this.setState(
            {
                subscription_data: data,
            },
            () => {
                data.courses.forEach((data) => {
                    total_price += data.price;
                });

                this.setState({
                    total_price: total_price,
                });
            }
        );
    };

    handleRemoveRecommendCourse = (index) => {
        let data = this.state.subscription_data;
        data.recommended_course.splice(index, 1);

        this.setState({
            subscription_data: data,
        });
    };

    // ----- Subscription user inputs -----
    handleInput = (event, type) => {
        let data = this.state.subscription_data;
        if (type === "months" || type === "days") {
            data[event.target.name] = Number(event.target.value);
        } else if (type === "discounted_price") {
            data[event.target.name] = parseFloat(event.target.value);
        } else {
            data[event.target.name] = event.target.value;
        }

        this.setState({
            subscription_data: data,
        });
    };

    handleCoursePrice = (event, index) => {
        let data = this.state.subscription_data;
        data.courses[index].price = parseFloat(event.target.value);
        let total_price = 0;

        this.setState(
            {
                subscription_data: data,
            },
            () => {
                data.courses.forEach((data) => {
                    total_price += data.price;
                });

                this.setState({
                    total_price: total_price,
                });
            }
        );
    };

    // ----- Image upload -----
    handleImageFile = (event) => {
        let extension = event.target.files[0].name.split(".");
        let format = ["jpg", "jpeg", "png", "webp"];

        if (!format.includes(extension[extension.length - 1].toLowerCase())) {
            this.setState({
                errorMsg: "Invalid file format!",
                showErrorAlert: true,
            });
        } else if (event.target.files[0].size > 5242880) {
            this.setState({
                errorMsg: "File size exceeds more then 5MB!",
                showErrorAlert: true,
            });
        } else {
            this.setState({
                file: event.target.files[0],
                filename: event.target.files[0].name,
            });
        }
    };

    // ----- Discounts -----
    discountsAPI = (path) => {
        let selected = this.state.selected;
        let URL = path
            ? path
            : `${this.url}/subscription/filter/coupon/?category=${
                  selected.category
              }&sub_category=${selected.sub_category}&discipline=${returnValue(
                  selected.discipline
              )}&level=${returnValue(selected.levels)}&subject=${returnValue(
                  selected.subjects
              )}`;

        function returnValue(data) {
            let value = "";

            if (data !== "") {
                value = data;
            } else {
                value = "ALL";
            }

            return value;
        }

        fetch(URL, {
            headers: this.headers,
            method: "GET",
        })
            .then((res) => res.json())
            .then((result) => {
                if (result.sts === true) {
                    let data = [...this.state.discounts];
                    if (
                        result.data.results &&
                        result.data.results.length !== 0
                    ) {
                        data.push(...result.data.results);
                        this.setState(
                            {
                                discounts: data,
                            },
                            () => {
                                if (result.data.next !== null) {
                                    this.discountsAPI(result.data.next);
                                }
                            }
                        );
                    }
                } else {
                    this.setState({
                        errorMsg: result.msg,
                        showErrorAlert: true,
                    });
                }
            })
            .catch((err) => {
                console.log(err);
                this.setState({
                    errorMsg: "Something went wrong!",
                    showErrorAlert: true,
                });
            });
    };

    loadDiscounts = (event) => {
        let data = this.state.subscription_data;

        if (event.target.checked) {
            data.discount_applicable = true;
        } else {
            data.discount_applicable = false;
        }

        this.setState({
            subscription_data: data,
        });
    };

    handleCouponSelect = (index, list) => {
        let data = this.state.subscription_data;
        let isCouponAvailable = data.coupons.some(
            (el) => el.coupon_id === list.coupon_id
        );
        if (!isCouponAvailable) {
            data.coupons.push({
                coupon_name: list.coupon_name,
                coupon_id: list.coupon_id,
            });
        } else {
            data.coupons.splice(
                data.coupons
                    .map((item) => {
                        return item.coupon_id;
                    })
                    .indexOf(list.coupon_id),
                1
            );
        }

        this.setState({
            subscription_data: data,
        });
    };

    // ----- Search terms -----
    handleSearchTerms = (event) => {
        let data = this.state.subscription_data;
        if (event.key === "Enter") {
            if (event.target.value !== "") {
                data.search_terms.push(event.target.value.trim());
                this.setState(
                    {
                        subscription_data: data,
                    },
                    () => (document.getElementById("search_terms").value = "")
                );
            }
        }
    };

    handleRemoveSearchTerms = (index) => {
        let data = this.state.subscription_data;
        data.search_terms.splice(index, 1);

        this.setState({
            subscription_data: data,
        });
    };

    // ----- Handle Submit -----
    handleSubmit = () => {
        this.setState({
            showLoader: true,
            showErrorAlert: false,
            showSuccessAlert: false,
        });

        const options = {
            headers: {
                Accept: "application/json",
                "Content-Type": "multipart/form-data",
                "Inquel-Auth": this.authToken,
            },
        };

        let subscription = this.state.subscription_data;
        if (subscription.title === "") {
            this.setState({
                errorMsg: "Subscription title is required",
                showErrorAlert: true,
                showLoader: false,
            });
        } else if (subscription.description === "") {
            this.setState({
                errorMsg: "Subscription description is required",
                showErrorAlert: true,
                showLoader: false,
            });
        } else if (subscription.months === 0 && subscription.days === 0) {
            this.setState({
                errorMsg: "Select duration month and days",
                showErrorAlert: true,
                showLoader: false,
            });
        } else if (subscription.discounted_price === "") {
            this.setState({
                errorMsg: "Pricing is required",
                showErrorAlert: true,
                showLoader: false,
            });
        } else {
            let form_data = new FormData();
            if (this.state.file !== "") {
                form_data.append("subscription_image_1", this.state.file);
            }
            form_data.append(
                "subscription_data",
                JSON.stringify({
                    subscription_data: subscription,
                })
            );

            if (this.props.data) {
                axios
                    .put(
                        `${this.url}/subscription/${this.props.data.subscription_id}/`,
                        form_data,
                        options
                    )
                    .then((result) => {
                        if (result.data.sts === true) {
                            this.setState({
                                successMsg: result.data.msg,
                                showSuccessAlert: true,
                                showLoader: false,
                            });
                            this.props.formSubmission();
                        } else {
                            this.setState({
                                errorMsg: result.data.msg,
                                showErrorAlert: true,
                                showLoader: false,
                            });
                        }
                    })
                    .catch((err) => {
                        console.log(err);
                        this.setState({
                            errorMsg: "Something went wrong!",
                            showErrorAlert: true,
                            showLoader: false,
                        });
                    });
            } else {
                axios
                    .post(`${this.url}/subscription/`, form_data, options)
                    .then((result) => {
                        if (result.data.sts === true) {
                            this.setState({
                                successMsg: result.data.msg,
                                showSuccessAlert: true,
                                showLoader: false,
                            });
                            this.props.formSubmission();
                        } else {
                            this.setState({
                                errorMsg: result.data.msg,
                                showErrorAlert: true,
                                showLoader: false,
                            });
                        }
                    })
                    .catch((err) => {
                        console.log(err);
                        this.setState({
                            errorMsg: "Something went wrong!",
                            showErrorAlert: true,
                            showLoader: false,
                        });
                    });
            }
        }
    };

    render() {
        const data = this.state.subscription_data;
        return (
            <Modal
                show={this.props.show}
                onHide={this.props.onHide}
                size="xl"
                aria-labelledby="contained-modal-title-vcenter"
                centered
                scrollable
                backdrop="static"
            >
                <Modal.Header closeButton className="d-flex align-items-center">
                    {this.props.data ? "Update" : "Create"} subscription{" "}
                    {this.state.loader.modal_loading ? (
                        <Spinner
                            as="span"
                            animation="border"
                            size="sm"
                            role="status"
                            aria-hidden="true"
                            className="ml-3"
                        />
                    ) : (
                        ""
                    )}
                </Modal.Header>
                <Modal.Body>
                    <Alert
                        variant="danger"
                        show={this.state.showErrorAlert}
                        onClose={() => {
                            this.setState({
                                showErrorAlert: false,
                            });
                        }}
                        className="sticky-top"
                        dismissible
                    >
                        {this.state.errorMsg}
                    </Alert>
                    <Alert
                        variant="success"
                        show={this.state.showSuccessAlert}
                        onClose={() => {
                            this.setState({
                                showSuccessAlert: false,
                            });
                        }}
                        className="sticky-top"
                        dismissible
                    >
                        {this.state.successMsg}
                    </Alert>

                    <div className="row">
                        {/* ---------- Left column ---------- */}
                        <div className="col-md-6">
                            <h6 className="primary-text mb-3">Configuration</h6>
                            <div className="row">
                                <div className="col-md-6 mb-4">
                                    <div className="form-row align-items-center mb-3">
                                        <div className="col-md-4 mb-2 mb-md-0">
                                            <p className="small mb-0">
                                                Category ID
                                            </p>
                                        </div>
                                        <div className="col-md-8">
                                            <Select
                                                className="basic-single border-secondary"
                                                placeholder="Select"
                                                isSearchable={true}
                                                name="category"
                                                id="category"
                                                options={(
                                                    this.state.filter
                                                        .category || []
                                                ).map((list) => {
                                                    return {
                                                        value: list.code,
                                                        label: list.title,
                                                    };
                                                })}
                                                value={(
                                                    this.state.filter
                                                        .category || []
                                                ).map((list) => {
                                                    return this.state.selected
                                                        .category === list.code
                                                        ? {
                                                              value: list.code,
                                                              label: list.title,
                                                          }
                                                        : "";
                                                })}
                                                isLoading={
                                                    this.state.loader.category
                                                }
                                                onChange={this.loadSubCategory}
                                                required
                                            />
                                        </div>
                                    </div>
                                    <div className="form-row align-items-center mb-3">
                                        <div className="col-md-4 mb-2 mb-md-0">
                                            <p className="small mb-0">
                                                Discipline
                                            </p>
                                        </div>
                                        <div className="col-md-8">
                                            <Select
                                                className="basic-single border-secondary"
                                                placeholder="Select"
                                                isSearchable={true}
                                                name="discipline"
                                                id="discipline"
                                                options={(
                                                    this.state.filter
                                                        .discipline || []
                                                ).map((list) => {
                                                    return {
                                                        value: list.code,
                                                        label: list.title,
                                                    };
                                                })}
                                                value={(
                                                    this.state.filter
                                                        .discipline || []
                                                ).map((list) => {
                                                    return this.state.selected
                                                        .discipline ===
                                                        list.code
                                                        ? {
                                                              value: list.code,
                                                              label: list.title,
                                                          }
                                                        : "";
                                                })}
                                                isDisabled={
                                                    this.state.selected
                                                        .sub_category === ""
                                                        ? true
                                                        : false
                                                }
                                                isLoading={
                                                    this.state.loader.discipline
                                                }
                                                onChange={this.loadLevels}
                                                required
                                            />
                                        </div>
                                    </div>
                                    <div className="form-row align-items-center mb-3">
                                        <div className="col-md-4 mb-2 mb-md-0">
                                            <p className="small mb-0">
                                                Subjects
                                            </p>
                                        </div>
                                        <div className="col-md-8">
                                            <Select
                                                className="basic-single border-secondary"
                                                placeholder="Select"
                                                isSearchable={true}
                                                name="subject"
                                                id="subject"
                                                options={(
                                                    this.state.filter
                                                        .subjects || []
                                                ).map((list) => {
                                                    return {
                                                        value: list.code,
                                                        label: list.title,
                                                    };
                                                })}
                                                value={(
                                                    this.state.filter
                                                        .subjects || []
                                                ).map((list) => {
                                                    return this.state.selected
                                                        .subjects === list.code
                                                        ? {
                                                              value: list.code,
                                                              label: list.title,
                                                          }
                                                        : "";
                                                })}
                                                isDisabled={
                                                    this.state.selected
                                                        .levels === "" ||
                                                    this.state.loader
                                                        .course_list
                                                        ? true
                                                        : false
                                                }
                                                isLoading={
                                                    this.state.loader.subjects
                                                }
                                                onChange={this.loadBoard}
                                                required
                                            />
                                        </div>
                                    </div>
                                    <div className="form-row align-items-center">
                                        <div className="col-md-4 mb-2 mb-md-0">
                                            <p className="small mb-0">Type</p>
                                        </div>
                                        <div className="col-md-8">
                                            <Select
                                                className="basic-single border-secondary"
                                                placeholder="Select"
                                                isSearchable={true}
                                                name="type"
                                                id="type"
                                                options={(
                                                    this.state.filter.type || []
                                                ).map((list) => {
                                                    return {
                                                        value: list.code,
                                                        label: list.title,
                                                    };
                                                })}
                                                value={(
                                                    this.state.filter.type || []
                                                ).map((list) => {
                                                    return this.state.selected
                                                        .type === list.code
                                                        ? {
                                                              value: list.code,
                                                              label: list.title,
                                                          }
                                                        : "";
                                                })}
                                                isDisabled={
                                                    this.state.selected
                                                        .board === "" ||
                                                    this.state.loader
                                                        .course_list
                                                        ? true
                                                        : false
                                                }
                                                isLoading={
                                                    this.state.loader.type
                                                }
                                                onChange={this.loadHOD}
                                                required
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div className="col-md-6 mb-4">
                                    <div className="form-row align-items-center mb-3">
                                        <div className="col-md-4 mb-2 mb-md-0">
                                            <p className="small mb-0">
                                                Sub Category
                                            </p>
                                        </div>
                                        <div className="col-md-8">
                                            <Select
                                                className="basic-single border-secondary"
                                                placeholder="Select"
                                                isSearchable={true}
                                                name="sub_category"
                                                id="sub_category"
                                                options={this.state.filter.sub_category.map(
                                                    (list) => {
                                                        return {
                                                            value: list.code,
                                                            label: list.title,
                                                        };
                                                    }
                                                )}
                                                value={(
                                                    this.state.filter
                                                        .sub_category || []
                                                ).map((list) => {
                                                    return this.state.selected
                                                        .sub_category ===
                                                        list.code
                                                        ? {
                                                              value: list.code,
                                                              label: list.title,
                                                          }
                                                        : "";
                                                })}
                                                isDisabled={
                                                    this.state.selected
                                                        .category === ""
                                                        ? true
                                                        : false
                                                }
                                                isLoading={
                                                    this.state.loader
                                                        .sub_category
                                                }
                                                onChange={this.loadDiscipline}
                                                required
                                            />
                                        </div>
                                    </div>
                                    <div className="form-row align-items-center mb-3">
                                        <div className="col-md-4 mb-2 mb-md-0">
                                            <p className="small mb-0">Levels</p>
                                        </div>
                                        <div className="col-md-8">
                                            <Select
                                                className="basic-single border-secondary"
                                                placeholder="Select"
                                                isSearchable={true}
                                                name="level"
                                                id="level"
                                                options={(
                                                    this.state.filter.levels ||
                                                    []
                                                ).map((list) => {
                                                    return {
                                                        value: list.code,
                                                        label: list.title,
                                                    };
                                                })}
                                                value={(
                                                    this.state.filter.levels ||
                                                    []
                                                ).map((list) => {
                                                    return this.state.selected
                                                        .levels === list.code
                                                        ? {
                                                              value: list.code,
                                                              label: list.title,
                                                          }
                                                        : "";
                                                })}
                                                isDisabled={
                                                    this.state.selected
                                                        .discipline === "" ||
                                                    this.state.loader
                                                        .course_list
                                                        ? true
                                                        : false
                                                }
                                                isLoading={
                                                    this.state.loader.levels
                                                }
                                                onChange={this.loadSubjects}
                                                required
                                            />
                                        </div>
                                    </div>
                                    <div className="form-row align-items-center mb-3">
                                        <div className="col-md-4 mb-2 mb-md-0">
                                            <p className="small mb-0">
                                                Board / University
                                            </p>
                                        </div>
                                        <div className="col-md-8">
                                            <Select
                                                className="basic-single border-secondary"
                                                placeholder="Select"
                                                isSearchable={true}
                                                name="board"
                                                id="board"
                                                options={(
                                                    this.state.filter.board ||
                                                    []
                                                ).map((list) => {
                                                    return {
                                                        value: list.code,
                                                        label: list.title,
                                                    };
                                                })}
                                                value={(
                                                    this.state.filter.board ||
                                                    []
                                                ).map((list) => {
                                                    return this.state.selected
                                                        .board === list.code
                                                        ? {
                                                              value: list.code,
                                                              label: list.title,
                                                          }
                                                        : "";
                                                })}
                                                isDisabled={
                                                    this.state.selected
                                                        .subjects === "" ||
                                                    this.state.loader
                                                        .course_list
                                                        ? true
                                                        : false
                                                }
                                                isLoading={
                                                    this.state.loader.board
                                                }
                                                onChange={this.loadType}
                                                required
                                            />
                                        </div>
                                    </div>
                                    <div className="form-row align-items-center">
                                        <div className="col-md-4 mb-2 mb-md-0">
                                            <p className="small mb-0">HOD</p>
                                        </div>
                                        <div className="col-md-8">
                                            <Select
                                                className="basic-single border-secondary"
                                                placeholder="Select"
                                                isSearchable={true}
                                                name="hod"
                                                id="hod"
                                                options={(
                                                    this.state.filter.hod || []
                                                ).map((list) => {
                                                    return {
                                                        value: list.id,
                                                        label: list.full_name
                                                            ? list.full_name
                                                            : list.username,
                                                    };
                                                })}
                                                value={(
                                                    this.state.filter.hod || []
                                                ).map((list) => {
                                                    return this.state.selected
                                                        .hod === list.id
                                                        ? {
                                                              value: list.id,
                                                              label: list.full_name
                                                                  ? list.full_name
                                                                  : list.username,
                                                          }
                                                        : "";
                                                })}
                                                isDisabled={
                                                    this.state.selected.type ===
                                                        "" ||
                                                    this.state.loader
                                                        .course_list
                                                        ? true
                                                        : false
                                                }
                                                isLoading={
                                                    this.state.loader.hod
                                                }
                                                onChange={this.loadCourseList}
                                                required
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* ----- Course list ----- */}
                            <div
                                className="card border-secondary"
                                style={{
                                    minHeight: "150px",
                                    maxHeight: "200px",
                                    overflowY: "auto",
                                }}
                            >
                                <div className="card-header p-2 font-weight-bold-600">
                                    Course List
                                </div>
                                <div className="card-body px-2 pb-2 pt-0">
                                    {!this.state.loader.course_list
                                        ? (this.state.course_list || []).map(
                                              (list, index) => {
                                                  return (
                                                      <div
                                                          key={index}
                                                          className="p-1 rounded-lg"
                                                          id={list.course_id}
                                                          style={{
                                                              cursor: "move",
                                                          }}
                                                          onDragStart={(e) =>
                                                              this.handleDragStart(
                                                                  e,
                                                                  list
                                                              )
                                                          }
                                                          onDragEnd={(e) =>
                                                              this.handleDragEnd(
                                                                  e
                                                              )
                                                          }
                                                          draggable
                                                      >
                                                          <p className="small font-weight-bold-600 w-100 mb-0">
                                                              {list.course_name}
                                                          </p>
                                                      </div>
                                                  );
                                              }
                                          )
                                        : "Loading..."}
                                </div>
                            </div>

                            <div className="row mt-3">
                                {/* ----- Image upload ----- */}
                                <div className="col-md-6">
                                    <p className="primary-text font-weight-bold-600 small">
                                        Upload image
                                    </p>
                                    <div className="custom-file mb-3">
                                        <input
                                            type="file"
                                            className="custom-file-input"
                                            id="img1"
                                            accept="image/*"
                                            aria-describedby="inputGroupFileAddon01"
                                            onChange={(event) =>
                                                this.handleImageFile(event)
                                            }
                                        />
                                        <label
                                            className="custom-file-label"
                                            htmlFor="img1"
                                        >
                                            {this.state.filename
                                                ? this.state.filename
                                                : "Choose file"}
                                        </label>
                                    </div>
                                </div>

                                {/* ----- Search terms ----- */}
                                <div className="col-md-6">
                                    <div className="form-group">
                                        <label htmlFor="searchterms">
                                            Search terms
                                        </label>
                                        <div className="border-secondary rounded-lg p-1">
                                            <div className="d-flex flex-wrap font-weight-bold-600">
                                                {data.search_terms.map(
                                                    (list, index) => {
                                                        return (
                                                            <div
                                                                className="d-flex align-items-center light-bg borders primary-text mr-1 mb-1 p-1 rounded-lg"
                                                                key={index}
                                                                style={{
                                                                    fontSize:
                                                                        "11px",
                                                                }}
                                                            >
                                                                <span>
                                                                    {list}
                                                                </span>
                                                                <span
                                                                    style={{
                                                                        cursor: "pointer",
                                                                    }}
                                                                    onClick={() =>
                                                                        this.handleRemoveSearchTerms(
                                                                            index
                                                                        )
                                                                    }
                                                                >
                                                                    <i className="fas fa-times ml-2"></i>
                                                                </span>
                                                            </div>
                                                        );
                                                    }
                                                )}
                                            </div>
                                            <input
                                                type="text"
                                                name="search_terms"
                                                id="search_terms"
                                                className="form-control form-control-sm w-100 p-0"
                                                onKeyUp={this.handleSearchTerms}
                                                placeholder="Type here..."
                                            />
                                        </div>
                                        <small className="text-muted">
                                            Press Enter to create search terms
                                        </small>
                                    </div>
                                </div>
                            </div>

                            <div className="form-row">
                                {/* ----- Discounts ----- */}
                                <div className="col-md-5">
                                    <div className="custom-control custom-checkbox mb-2">
                                        <input
                                            type="checkbox"
                                            className="custom-control-input"
                                            id="discounts"
                                            checked={
                                                data.discount_applicable ===
                                                true
                                                    ? true
                                                    : false
                                            }
                                            onChange={this.loadDiscounts}
                                        />
                                        <label
                                            className="custom-control-label"
                                            htmlFor="discounts"
                                        >
                                            Discounts applicable
                                        </label>
                                    </div>
                                    {/* coupons */}
                                    <div className="d-flex flex-wrap small">
                                        {data.discount_applicable
                                            ? (data.coupons || []).map(
                                                  (list, index) => {
                                                      return (
                                                          <span
                                                              className="primary-bg text-white border-primary small m-1 px-2 py-1 rounded-lg"
                                                              key={index}
                                                              onClick={() =>
                                                                  this.handleCouponSelect(
                                                                      index,
                                                                      list
                                                                  )
                                                              }
                                                              style={{
                                                                  cursor: "pointer",
                                                              }}
                                                          >
                                                              {list.coupon_name}
                                                          </span>
                                                      );
                                                  }
                                              )
                                            : ""}
                                    </div>
                                    {/* all discounts */}
                                    <div className="d-flex flex-wrap small">
                                        {data.discount_applicable
                                            ? (this.state.discounts || []).map(
                                                  (list, index) => {
                                                      return !data.coupons.some(
                                                          (el) =>
                                                              el.coupon_id ===
                                                              list.coupon_id
                                                      ) ? (
                                                          <span
                                                              className="bg-light border-secondary text-dark small m-1 px-2 py-1 rounded-lg"
                                                              key={index}
                                                              onClick={() =>
                                                                  this.handleCouponSelect(
                                                                      index,
                                                                      list
                                                                  )
                                                              }
                                                              style={{
                                                                  cursor: "pointer",
                                                              }}
                                                          >
                                                              {list.coupon_name}
                                                          </span>
                                                      ) : (
                                                          ""
                                                      );
                                                  }
                                              )
                                            : ""}
                                    </div>
                                </div>

                                {/* ----- Recommend course ----- */}
                                <div className="col-md-7">
                                    <div className="form-group">
                                        <div
                                            className="card border-secondary"
                                            style={{ minHeight: "100px" }}
                                            onDragOver={(e) =>
                                                e.preventDefault()
                                            }
                                            onDrop={(e) =>
                                                this.handleRecommendDrop(e)
                                            }
                                        >
                                            <div className="card-header small font-weight-bold-600 p-2">
                                                Recommend courses
                                            </div>
                                            <div className="card-body pt-0 px-2">
                                                {(
                                                    data.recommended_course ||
                                                    []
                                                ).map((list, index) => {
                                                    return (
                                                        <div
                                                            key={index}
                                                            className="d-flex align-items-center mb-1"
                                                        >
                                                            <p className="small font-weight-bold-600 w-100 mr-2 mb-0">
                                                                {
                                                                    list.course_name
                                                                }
                                                            </p>
                                                            <span
                                                                style={{
                                                                    cursor: "pointer",
                                                                }}
                                                                onClick={() => {
                                                                    this.handleRemoveRecommendCourse(
                                                                        index
                                                                    );
                                                                }}
                                                            >
                                                                <i className="fas fa-minus-circle fa-sm"></i>
                                                            </span>
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* ---------- Right column ---------- */}
                        <div className="col-md-6">
                            <h6 className="primary-text mb-3">Subscription</h6>
                            <div className="form-row form-group">
                                <div className="col-md-4 mb-2 mb-md-0">
                                    <p className="mb-0 small">
                                        Subscription Title
                                    </p>
                                </div>
                                <div className="col-md-8">
                                    <input
                                        type="text"
                                        name="title"
                                        id="title"
                                        placeholder="Enter title"
                                        value={data.title}
                                        className="form-control border-secondary"
                                        onChange={(event) =>
                                            this.handleInput(event, "title")
                                        }
                                        autoComplete="off"
                                    />
                                </div>
                            </div>
                            <div className="form-row form-group">
                                <div className="col-md-4 mb-2 mb-md-0">
                                    <p className="mb-0 small">
                                        Subscription Description
                                    </p>
                                </div>
                                <div className="col-md-8">
                                    <textarea
                                        name="description"
                                        id="description"
                                        rows="4"
                                        placeholder="Enter description"
                                        className="form-control border-secondary"
                                        value={data.description}
                                        onChange={(event) =>
                                            this.handleInput(
                                                event,
                                                "description"
                                            )
                                        }
                                        autoComplete="off"
                                    ></textarea>
                                </div>
                            </div>
                            <div className="form-row form-group">
                                <div className="col-md-4 mb-2 mb-md-0">
                                    <p className="mb-0 small">Duration</p>
                                </div>
                                <div className="col-md-8">
                                    <div className="form-row align-items-center">
                                        <div className="col-md-4 col-6">
                                            <select
                                                name="months"
                                                id="months"
                                                className="form-control border-secondary"
                                                onChange={(event) =>
                                                    this.handleInput(
                                                        event,
                                                        "months"
                                                    )
                                                }
                                                value={data.months}
                                            >
                                                <option value="">Months</option>
                                                {Array(13)
                                                    .fill()
                                                    .map((element, index) => {
                                                        return (
                                                            <option
                                                                key={index}
                                                                value={index}
                                                            >
                                                                {index}
                                                            </option>
                                                        );
                                                    })}
                                            </select>
                                        </div>
                                        <div className="col-md-3 col-6">
                                            <select
                                                name="days"
                                                id="days"
                                                className="form-control border-secondary"
                                                onChange={(event) =>
                                                    this.handleInput(
                                                        event,
                                                        "days"
                                                    )
                                                }
                                                value={data.days}
                                            >
                                                <option value="">Days</option>
                                                {Array(32)
                                                    .fill()
                                                    .map((element, index) => {
                                                        return (
                                                            <option
                                                                key={index}
                                                                value={index}
                                                            >
                                                                {index}
                                                            </option>
                                                        );
                                                    })}
                                            </select>
                                        </div>
                                        <div className="col-5 mt-2 mt-md-0">
                                            <p className="mb-0">
                                                {`${data.months} Months ${data.days} Days`}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="form-row form-group">
                                <div className="col-md-4 mb-2 mb-md-0">
                                    <p className="mb-0 small">Pricing</p>
                                </div>
                                <div className="col-md-8">
                                    <form action="">
                                        <input
                                            type="number"
                                            name="discounted_price"
                                            id="discounted_price"
                                            placeholder="Enter pricing"
                                            value={data.discounted_price}
                                            className="form-control border-secondary"
                                            onChange={(event) =>
                                                this.handleInput(
                                                    event,
                                                    "discounted_price"
                                                )
                                            }
                                            autoComplete="off"
                                        />
                                    </form>
                                </div>
                            </div>

                            <div
                                className="card border-secondary"
                                style={{ minHeight: "180px" }}
                                onDragOver={(e) => e.preventDefault()}
                                onDrop={(e) => this.handleSubscriptionDrop(e)}
                            >
                                <div className="table-responsive">
                                    <table className="table">
                                        <thead className="primary-text">
                                            <tr
                                                style={{ whiteSpace: "nowrap" }}
                                            >
                                                <th scope="col">Sl.No</th>
                                                <th scope="col">Course name</th>
                                                <th scope="col">Price(INR)</th>
                                                <th></th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {data.courses &&
                                            data.courses.length !== 0
                                                ? (data.courses || []).map(
                                                      (list, index) => {
                                                          return (
                                                              <tr
                                                                  key={index}
                                                                  style={{
                                                                      whiteSpace:
                                                                          "nowrap",
                                                                  }}
                                                              >
                                                                  <td>
                                                                      {index +
                                                                          1}
                                                                  </td>
                                                                  <td>
                                                                      {
                                                                          list.course_name
                                                                      }
                                                                  </td>
                                                                  <td>
                                                                      <input
                                                                          type="number"
                                                                          name="price"
                                                                          id="price"
                                                                          className="form-control form-control-sm border-secondary"
                                                                          value={
                                                                              list.price
                                                                          }
                                                                          onChange={(
                                                                              event
                                                                          ) =>
                                                                              this.handleCoursePrice(
                                                                                  event,
                                                                                  index
                                                                              )
                                                                          }
                                                                          autoComplete="off"
                                                                      />
                                                                  </td>
                                                                  <td>
                                                                      <span
                                                                          style={{
                                                                              cursor: "pointer",
                                                                          }}
                                                                          onClick={() =>
                                                                              this.handleRemoveCourse(
                                                                                  index
                                                                              )
                                                                          }
                                                                      >
                                                                          <i className="fas fa-minus-circle"></i>
                                                                      </span>
                                                                  </td>
                                                              </tr>
                                                          );
                                                      }
                                                  )
                                                : null}
                                        </tbody>
                                    </table>
                                </div>
                                <div className="card-footer text-right mt-auto">
                                    <span className="primary-text font-weight-bold mr-3">
                                        Total:
                                    </span>
                                    {this.state.total_price}
                                </div>
                            </div>
                        </div>
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <div className="d-flex justify-content-end flex-wrap">
                        <button
                            className="btn btn-link btn-sm shadow-none mr-2"
                            onClick={this.props.onHide}
                        >
                            Cancel
                        </button>
                        <button
                            className="btn btn-primary btn-sm shadow-none"
                            onClick={this.handleSubmit}
                        >
                            {this.state.showLoader ? (
                                <Spinner
                                    as="span"
                                    animation="border"
                                    size="sm"
                                    role="status"
                                    aria-hidden="true"
                                    className="mr-2"
                                />
                            ) : (
                                ""
                            )}
                            {this.props.data ? "Update" : "Save"}
                        </button>
                    </div>
                </Modal.Footer>
            </Modal>
        );
    }
}
