import React from "react";

function TypeOneQuestion({ q_index, data, changeImage }) {
    return (
        <div className="d-flex align-items-start mb-3">
            <button
                className="btn bg-white btn-sm shadow-sm mr-1 px-3 font-weight-bold-600 rounded-lg"
                style={{ cursor: "default" }}
            >
                {q_index <= 8 ? `0${q_index + 1}` : q_index + 1}
            </button>
            <div className="card shadow-sm w-100">
                <div className="card-body">
                    <div className="d-flex">
                        {/* Questions & options */}
                        <div className="w-100">
                            <div
                                className="pb-2"
                                dangerouslySetInnerHTML={{
                                    __html: data.question,
                                }}
                            ></div>
                            {data.content.mcq ? (
                                <div className="row">
                                    {data.content.options.map(
                                        (options, index) => {
                                            return (
                                                <div
                                                    className="col-md-6"
                                                    key={index}
                                                >
                                                    <div className="form-group">
                                                        <div
                                                            className={`card shadow-sm ${
                                                                options.correct
                                                                    ? "success-bg"
                                                                    : "bg-light"
                                                            }`}
                                                        >
                                                            <div className="card-body small font-weight-bold-600 p-3">
                                                                <div
                                                                    dangerouslySetInnerHTML={{
                                                                        __html: `<div class="remove-bottom-margin">${options.content}</div>`,
                                                                    }}
                                                                ></div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            );
                                        }
                                    )}
                                </div>
                            ) : (
                                ""
                            )}
                            {data.content.fill_in ? (
                                <div className="row">
                                    {data.content.fillin_answer.map(
                                        (fill_in, index) => {
                                            return (
                                                <div
                                                    className="col-md-6"
                                                    key={index}
                                                >
                                                    <div className="form-group">
                                                        <div className="card form-shadow">
                                                            <div className="card-body small font-weight-bold-600 p-3">
                                                                {fill_in}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            );
                                        }
                                    )}
                                </div>
                            ) : (
                                ""
                            )}
                            {data.content.boolean ? (
                                <div className="row">
                                    {data.content.boolean_question.map(
                                        (boolean, index) => {
                                            return (
                                                <div
                                                    className="col-md-6"
                                                    key={index}
                                                >
                                                    <div className="form-group">
                                                        <div
                                                            className={`card shadow-sm ${
                                                                boolean.correct
                                                                    ? "success-bg"
                                                                    : "bg-light"
                                                            }`}
                                                        >
                                                            <div className="card-body small font-weight-bold-600 p-3">
                                                                {
                                                                    boolean.content
                                                                }
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            );
                                        }
                                    )}
                                </div>
                            ) : (
                                ""
                            )}
                        </div>

                        {/* ----- image preview ----- */}
                        {data.content.images &&
                        data.content.images.length !== 0 ? (
                            <div className="ml-3">
                                {data.content.images.map((images, index) => {
                                    return images.path !== "" ? (
                                        <div
                                            key={index}
                                            className="card preview-img-circle shadow-sm"
                                            style={{
                                                backgroundImage: `url(${images.path})`,
                                            }}
                                            onClick={() =>
                                                changeImage(
                                                    data.content.images,
                                                    index
                                                )
                                            }
                                        ></div>
                                    ) : (
                                        ""
                                    );
                                })}
                            </div>
                        ) : (
                            ""
                        )}
                    </div>
                </div>

                {/* ----- Answer type tag ----- */}
                <div
                    className="secondary-bg primary-text font-weight-bold px-2 py-1 position-absolute rounded-lg shadow-sm"
                    style={{
                        bottom: "5px",
                        right: "5px",
                        fontSize: "10px",
                    }}
                >
                    {data.content.mcq
                        ? "MCQ"
                        : data.content.fill_in
                        ? "Fill in"
                        : "True / False"}
                </div>
            </div>
        </div>
    );
}

export default TypeOneQuestion;
