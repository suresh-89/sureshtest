import React, { useState } from "react";

const TypeTwoQuestion = ({ q_index, data, changeImage }) => {
    const total_sub_question = data.sub_question.length;
    const [current_sub_question, setCurrentSubQuestion] = useState(0);

    return (
        <div className="d-flex align-items-start mb-3">
            <button
                className="btn bg-white btn-sm shadow-sm mr-1 px-3 font-weight-bold-600 rounded-lg"
                style={{ cursor: "default" }}
            >
                {q_index <= 8 ? `0${q_index + 1}` : q_index + 1}
            </button>
            {/* ---------- Question preview ---------- */}
            <div className="card shadow-sm w-100">
                <div className="card-body d-flex">
                    <div className="w-100">
                        <div className="row">
                            {/* ----- Main Question ----- */}
                            <div className="col-md-6">
                                <div
                                    dangerouslySetInnerHTML={{
                                        __html: data.question,
                                    }}
                                ></div>
                            </div>
                            {/* ----- Sub Question ----- */}
                            <div className="col-md-6">
                                <div className="d-flex align-items-start">
                                    <button
                                        className="btn secondary-bg btn-sm shadow-sm mr-1 px-3 font-weight-bold-600 rounded-lg"
                                        style={{ cursor: "default" }}
                                    >
                                        {current_sub_question + 1}
                                    </button>

                                    {/* ---------- Sub Question preview ---------- */}
                                    <div className="card w-100">
                                        <div className="card secondary-bg py-2 px-3 mb-2">
                                            <div
                                                dangerouslySetInnerHTML={{
                                                    __html: data.sub_question[
                                                        current_sub_question
                                                    ].question,
                                                }}
                                            ></div>
                                        </div>
                                        {data.sub_question[current_sub_question]
                                            .mcq
                                            ? data.sub_question[
                                                  current_sub_question
                                              ].options.map(
                                                  (options, index) => {
                                                      return (
                                                          <div
                                                              className={`card shadow-sm mb-2 ${
                                                                  options.correct
                                                                      ? "success-bg"
                                                                      : "bg-light"
                                                              }`}
                                                              key={index}
                                                          >
                                                              <div className="card-body small font-weight-bold-600 p-3">
                                                                  <div
                                                                      dangerouslySetInnerHTML={{
                                                                          __html: `<div class="remove-bottom-margin">${options.content}</div>`,
                                                                      }}
                                                                  ></div>
                                                              </div>
                                                          </div>
                                                      );
                                                  }
                                              )
                                            : ""}
                                        {data.sub_question[current_sub_question]
                                            .fill_in
                                            ? data.sub_question[
                                                  current_sub_question
                                              ].fillin_answer.map(
                                                  (fill_in, index) => {
                                                      return (
                                                          <div
                                                              className="card shadow-sm bg-light mb-2"
                                                              key={index}
                                                          >
                                                              <div className="card-body small font-weight-bold-600 p-3">
                                                                  {fill_in}
                                                              </div>
                                                          </div>
                                                      );
                                                  }
                                              )
                                            : ""}

                                        {/* ----- Navigation ----- */}
                                        <div className="d-flex align-items-center justify-content-center mt-2">
                                            <button
                                                className="btn btn-sm primary-text shadow-none"
                                                onClick={() => {
                                                    setCurrentSubQuestion(
                                                        current_sub_question - 1
                                                    );
                                                    window.MathJax.typeset();
                                                }}
                                                disabled={
                                                    current_sub_question === 0
                                                        ? true
                                                        : false
                                                }
                                            >
                                                <i className="fas fa-arrow-circle-left fa-lg"></i>
                                            </button>
                                            <div className="border-primary small font-weight-bold-600 rounded-lg px-3 py-1 mx-3">
                                                {current_sub_question + 1} /{" "}
                                                {total_sub_question}
                                            </div>
                                            <button
                                                className="btn btn-sm primary-text shadow-none"
                                                onClick={() => {
                                                    setCurrentSubQuestion(
                                                        current_sub_question + 1
                                                    );
                                                    window.MathJax.typeset();
                                                }}
                                                disabled={
                                                    current_sub_question + 1 <
                                                    total_sub_question
                                                        ? false
                                                        : true
                                                }
                                            >
                                                <i className="fas fa-arrow-circle-right fa-lg"></i>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* ----- image preview ----- */}
                    {data.content.images && data.content.images.length !== 0 ? (
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
        </div>
    );
};

export default TypeTwoQuestion;
