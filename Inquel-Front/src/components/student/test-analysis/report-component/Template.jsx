import React from "react";
import dateFormat from "dateformat";
import NumericConversion from "../../../common/function/NumericConversion";

const primaryColor = "#621012";
const secondaryColor = "#efd2ac";
// const lightPink = "#fff9f0";
const successBG = "#ccffcc";
const successText = "#008000";
const dangerBG = "#ffd7cc";
const dangerText = "#e60000";

const TypeOneQuestion = (props) => {
    return (
        <>
            <div
                style={{
                    padding: "10px",
                    borderRadius: "6px",
                    marginBottom: "12px",
                }}
            >
                {/* Question */}
                <table>
                    <tbody>
                        <tr>
                            <td valign="top">{props.question_index + 1}.</td>
                            <td
                                dangerouslySetInnerHTML={{
                                    __html: props.question.question,
                                }}
                            ></td>
                        </tr>
                    </tbody>
                </table>

                {/* options */}
                <ol type="A">
                    {(props.question.proper_answer || []).map(
                        (option, option_index) => {
                            return (
                                <li
                                    key={option_index}
                                    style={{
                                        // check if it is a unanswered or choice question
                                        color:
                                            props.question.choice === false &&
                                            props.question.unanswered === false
                                                ? // check if the option is same as student answer
                                                  (props.question.answer || [])
                                                      .map((data) =>
                                                          option.content
                                                              ? data
                                                              : data.toLowerCase()
                                                      )
                                                      .includes(
                                                          option.content
                                                              ? option.content
                                                              : option.toLowerCase()
                                                      )
                                                    ? // if the marks is greater than 0, then it is a correct answer
                                                      props.question.marks > 0
                                                        ? successText
                                                        : option.correct
                                                        ? successText
                                                        : dangerText
                                                    : option.correct === true
                                                    ? successText
                                                    : "black"
                                                : "black",
                                    }}
                                    dangerouslySetInnerHTML={{
                                        __html:
                                            option.content !== undefined
                                                ? option.content
                                                : option,
                                    }}
                                ></li>
                            );
                        }
                    )}
                </ol>

                {/* Student answers */}
                {/* showing this section only for fill in question */}
                {props.question.proper_answer &&
                props.question.proper_answer[0] ? (
                    // if the marks is 0 and it is a fill in question, show the student answer
                    props.question.marks === 0 &&
                    props.question.proper_answer[0].content === undefined ? (
                        <table
                            style={{
                                maxWidth: "400px",
                                width: "100%",
                                backgroundColor: dangerBG,
                                borderRadius: "6px",
                            }}
                        >
                            <tbody>
                                <tr>
                                    <td
                                        style={{
                                            padding: "8px",
                                            color: dangerText,
                                            fontSize: "14px",
                                        }}
                                    >
                                        Student answer(s):
                                    </td>
                                </tr>
                                {(props.question.answer || []).map(
                                    (answer, answer_index) => {
                                        return (
                                            <tr key={answer_index}>
                                                <td
                                                    style={{
                                                        padding:
                                                            "0 8px 8px 8px",
                                                        color: dangerText,
                                                        fontSize: "12px",
                                                    }}
                                                    dangerouslySetInnerHTML={{
                                                        __html: answer,
                                                    }}
                                                ></td>
                                            </tr>
                                        );
                                    }
                                )}
                            </tbody>
                        </table>
                    ) : (
                        ""
                    )
                ) : (
                    ""
                )}
            </div>
            <hr />
        </>
    );
};

const TypeTwoQuestion = (props) => {
    return (
        <>
            <div
                style={{
                    padding: "10px",
                    borderRadius: "6px",
                    marginBottom: "12px",
                }}
            >
                {/* Question */}
                <table>
                    <tbody>
                        <tr>
                            <td valign="top">{props.question_index + 1}.</td>
                            <td
                                dangerouslySetInnerHTML={{
                                    __html: props.question.question,
                                }}
                            ></td>
                        </tr>
                    </tbody>
                </table>

                {/* Sub question */}
                <ol type="1">
                    {(props.question.sub_question || []).map(
                        (sub_question, sub_question_index) => {
                            return (
                                <li key={sub_question_index}>
                                    <p
                                        dangerouslySetInnerHTML={{
                                            __html: sub_question.question,
                                        }}
                                    ></p>

                                    {/* options */}
                                    <ol type="A">
                                        {(sub_question.proper_answer || []).map(
                                            (option, option_index) => {
                                                return (
                                                    <li
                                                        key={option_index}
                                                        style={{
                                                            // check if it is a unanswered or choice question
                                                            color:
                                                                props.question
                                                                    .choice ===
                                                                    false &&
                                                                props.question
                                                                    .unanswered ===
                                                                    false
                                                                    ? option.correct !==
                                                                      undefined
                                                                        ? option.correct
                                                                            ? successText
                                                                            : "black"
                                                                        : "black"
                                                                    : "black",
                                                        }}
                                                        dangerouslySetInnerHTML={{
                                                            __html:
                                                                option.content !==
                                                                undefined
                                                                    ? option.content
                                                                    : option,
                                                        }}
                                                    ></li>
                                                );
                                            }
                                        )}
                                    </ol>

                                    {/* Student answers */}
                                    <table
                                        style={{
                                            maxWidth: "400px",
                                            width: "100%",
                                            borderRadius: "6px",
                                            overflow: "hidden",
                                            marginTop: "15px",
                                            marginBottom: "15px",
                                        }}
                                    >
                                        <tbody>
                                            <tr>
                                                <td
                                                    style={{
                                                        padding: "8px",
                                                        color:
                                                            sub_question.marks ===
                                                            0
                                                                ? dangerText
                                                                : successText,
                                                        backgroundColor:
                                                            sub_question.marks ===
                                                            0
                                                                ? dangerBG
                                                                : successBG,
                                                        fontSize: "14px",
                                                    }}
                                                >
                                                    Student answer(s):
                                                </td>
                                            </tr>
                                            {sub_question.answer[0] ? (
                                                <tr>
                                                    <td
                                                        style={{
                                                            padding:
                                                                "0 8px 8px 8px",
                                                            color:
                                                                sub_question.marks ===
                                                                0
                                                                    ? dangerText
                                                                    : successText,
                                                            backgroundColor:
                                                                sub_question.marks ===
                                                                0
                                                                    ? dangerBG
                                                                    : successBG,
                                                            fontSize: "12px",
                                                        }}
                                                        dangerouslySetInnerHTML={{
                                                            __html: sub_question
                                                                .answer[0],
                                                        }}
                                                    ></td>
                                                </tr>
                                            ) : null}
                                        </tbody>
                                    </table>
                                </li>
                            );
                        }
                    )}
                </ol>
            </div>
            <hr />
        </>
    );
};

const Template = (props) => {
    return (
        <>
            <div
                style={{
                    textAlign: "center",
                    color: primaryColor,
                    marginBottom: "20px",
                }}
            >
                <h1
                    style={{
                        textDecoration: "underline",
                        textTransform: "capitalize",
                    }}
                >
                    Test analysis report
                </h1>
            </div>

            {/* Course details */}
            <table
                style={{
                    width: "100%",
                    fontSize: "18px",
                    color: primaryColor,
                    fontWeight: "600",
                    marginBottom: "20px",
                }}
            >
                <tbody>
                    <tr>
                        <td>Subject: {props.course_name}</td>
                        <td style={{ textAlign: "right" }}>
                            Assessment: {props.exam_name}
                        </td>
                    </tr>
                </tbody>
            </table>

            {/* Student details */}
            <table
                style={{
                    width: "100%",
                    fontSize: "16px",
                    marginBottom: "24px",
                }}
            >
                <thead style={{ fontWeight: 500 }}>
                    <tr>
                        <td>Name</td>
                        <td>Username</td>
                        <td>Email</td>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>{props.profile.full_name}</td>
                        <td>{props.profile.username}</td>
                        <td>{props.profile.email}</td>
                    </tr>
                </tbody>
            </table>

            {/* Header info */}
            <table
                style={{
                    width: "100%",
                    marginBottom: "25px",
                    borderCollapse: "collapse",
                    border: "1px solid black",
                    textAlign: "center",
                }}
            >
                <thead style={{ border: "1px solid black" }}>
                    <tr>
                        <th style={{ border: "1px solid black" }}>Attempt</th>
                        <th style={{ border: "1px solid black" }}>
                            Total questions
                        </th>
                        <th style={{ border: "1px solid black" }}>
                            Scored marks
                        </th>
                        <th style={{ border: "1px solid black" }}>
                            Percentage
                        </th>
                        <th style={{ border: "1px solid black" }}>
                            Submitted on
                        </th>
                        <th>Remarks</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td style={{ border: "1px solid black" }}>
                            {props.temp.attempt + 1}
                        </td>
                        <td style={{ border: "1px solid black" }}>
                            {props.totalQuestion <= 9
                                ? `0${props.totalQuestion}`
                                : props.totalQuestion}
                        </td>
                        <td style={{ border: "1px solid black" }}>
                            {props.temp.data[0].student_scored_marks}/
                            {props.temp.data[0].total_marks}
                        </td>
                        <td style={{ border: "1px solid black" }}>
                            {NumericConversion(
                                props.temp.data[0].student_percentage
                            )}
                            %
                        </td>
                        <td style={{ border: "1px solid black" }}>
                            {dateFormat(props.temp.submit_time, "dd-mm-yyyy")}
                        </td>
                        <td>
                            <div
                                style={{
                                    backgroundColor: props.temp.data[0].color,
                                    textTransform: "capitalize",
                                    textAlign: "center",
                                    padding: "8px",
                                    borderRadius: "4px",
                                    fontSize: "12px",
                                    color: "white",
                                    fontWeight: 500,
                                }}
                            >
                                {props.temp.data[0].remarks}
                            </div>
                        </td>
                    </tr>
                </tbody>
            </table>

            {/* Section description and question render */}
            {props.temp.data[0].sections.map((section, section_index) => {
                return (
                    <React.Fragment key={section_index}>
                        <table
                            style={{
                                width: "100%",
                                marginBottom: "12px",
                                fontSize: "14px",
                                fontWeight: 500,
                            }}
                        >
                            <tbody>
                                <tr>
                                    <td align="center">
                                        <table
                                            style={{
                                                maxWidth: "400px",
                                                width: "100%",
                                                backgroundColor: secondaryColor,
                                                borderRadius: "6px",
                                            }}
                                        >
                                            <tbody>
                                                <tr>
                                                    <td
                                                        style={{
                                                            padding: "8px",
                                                        }}
                                                    >
                                                        {
                                                            section.section_description
                                                        }
                                                    </td>
                                                    <td
                                                        style={{
                                                            textAlign: "right",
                                                            padding: "8px",
                                                        }}
                                                    >
                                                        Scored marks:{" "}
                                                        {
                                                            props.section_marks[
                                                                section_index
                                                            ]
                                                        }
                                                        /
                                                        {
                                                            section.section_total_marks
                                                        }
                                                    </td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </td>
                                </tr>
                            </tbody>
                        </table>

                        {props.questions[section_index].map(
                            (question, question_index) => {
                                return question.type === "type_1" ? (
                                    // type one question
                                    <TypeOneQuestion
                                        key={question_index}
                                        question_index={question_index}
                                        question={question}
                                    />
                                ) : (
                                    // type two questions
                                    <TypeTwoQuestion
                                        key={question_index}
                                        question_index={question_index}
                                        question={question}
                                    />
                                );
                            }
                        )}
                    </React.Fragment>
                );
            })}

            {/* Remarks table info */}
            <table
                style={{
                    width: "100%",
                    marginTop: "10px",
                    borderCollapse: "collapse",
                    border: "1px solid black",
                    textAlign: "center",
                }}
            >
                <thead style={{ border: "1px solid black" }}>
                    <tr>
                        <th style={{ border: "1px solid black" }}>
                            {props.semesterId ? "Chapter" : "Topic number"}
                        </th>
                        <th style={{ border: "1px solid black" }}>
                            Total marks
                        </th>
                        <th style={{ border: "1px solid black" }}>
                            Secured marks
                        </th>
                        <th style={{ border: "1px solid black" }}>
                            Percentage %
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {Object.entries(props.chapter_topic_remarks).map(
                        ([key, value], index) => {
                            return (
                                <tr key={index}>
                                    <td style={{ border: "1px solid black" }}>
                                        {props.semesterId
                                            ? props.returnChapterName(key)
                                            : key}
                                    </td>
                                    <td style={{ border: "1px solid black" }}>
                                        {value.total_marks}
                                    </td>
                                    <td style={{ border: "1px solid black" }}>
                                        {value.correct_marks}
                                    </td>
                                    <td style={{ border: "1px solid black" }}>
                                        {NumericConversion(
                                            (value.correct_marks /
                                                value.total_marks) *
                                                100
                                        )}
                                    </td>
                                </tr>
                            );
                        }
                    )}
                </tbody>
            </table>
        </>
    );
};

export default Template;
