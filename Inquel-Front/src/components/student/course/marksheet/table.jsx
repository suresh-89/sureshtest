import React, { useEffect, useState } from "react";
import { Text, View, StyleSheet } from "@react-pdf/renderer";
import dateFormat from "dateformat";
import NumericConversion from "../../../common/function/NumericConversion";

// Create styles
const styles = StyleSheet.create({
    table: {
        borderWidth: 1,
        borderStyle: "solid",
        textAlign: "center",
    },
    tableRow: {
        flexDirection: "row",
    },
    tableCol: {
        borderStyle: "solid",
        borderWidth: 1,
        borderLeftWidth: 0,
        borderBottomWidth: 0,
        flex: 1,
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
    },
    tableCell: {
        margin: 4,
        fontSize: 9,
    },
});

const Table = (props) => {
    const {
        chapter_weighted_average,
        general_course_structure,
        total_weighted_average,
    } = props.marksheet;
    const [papers, setPaper] = useState([]);
    const [showPredictedScore, togglePredictedScore] = useState(false);

    useEffect(() => {
        let temp = [];

        // only the answered paper will be push to the array
        if (props.marksheet.papers) {
            props.marksheet.papers.forEach((paper) => {
                if (paper.auto_submit === false && paper.answered === true) {
                    temp.push(paper);
                }
            });
        }

        // slicing only the latest 3 papers
        let start = temp.length > 2 ? temp.length - 3 : 0,
            end = temp.length;
        let sliceArr = temp.slice(start, end);
        setPaper(sliceArr);

        // toggle predicted score based on paper length and date comparison
        if (sliceArr.length > 2) {
            let date1 = new Date(sliceArr[0].submitted_on), // paper 01
                date2 = new Date(sliceArr[1].submitted_on), // paper 02
                date3 = new Date(sliceArr[2].submitted_on); // paper 03

            let date2_minus_date1 =
                    Math.abs(date2 - date1) / (1000 * 3600 * 24),
                date3_minus_date1 =
                    Math.abs(date3 - date1) / (1000 * 3600 * 24);

            // date2 - date1 should be in between 15 to 20 days
            // and
            // date3 - date1 should be in between 25 to 35 days
            if (
                Math.round(date2_minus_date1) >= 15 &&
                Math.round(date2_minus_date1) <= 20 &&
                Math.round(date3_minus_date1) >= 25 &&
                Math.round(date3_minus_date1) <= 35
            ) {
                togglePredictedScore(true);
            }
        }
    }, [props]);

    // predicted score range calculation
    const scoreRange = (type) => {
        if (type === "plus") {
            return NumericConversion(
                total_weighted_average + (total_weighted_average * 6) / 100
            );
        } else if (type === "minus") {
            return NumericConversion(
                total_weighted_average - (total_weighted_average * 6) / 100
            );
        }
    };

    return (
        <View
            style={{
                width: "90%",
                position: "absolute",
                top: "260px",
                left: "5%",
            }}
        >
            <View style={styles.table}>
                <Text style={{ fontSize: 12, margin: "5 0" }}>Mark Sheet</Text>
                {/* ----- Header row ----- */}
                <View style={styles.tableRow}>
                    <View style={[styles.tableCol, { flexGrow: 0.5 }]}>
                        <Text style={styles.tableCell}>Units</Text>
                    </View>
                    <View style={styles.tableCol}>
                        <Text style={styles.tableCell}>Chapters</Text>
                    </View>

                    {papers && papers.length !== 0
                        ? (papers || []).map((paper, index) => {
                              return (
                                  <View style={styles.tableCol} key={index}>
                                      <View
                                          style={{
                                              borderBottom: "1px solid black",
                                              width: "100%",
                                          }}
                                      >
                                          <Text style={styles.tableCell}>
                                              {dateFormat(
                                                  paper.submitted_on,
                                                  "dd/mm/yyyy"
                                              )}
                                          </Text>
                                      </View>
                                      <View
                                          style={{
                                              borderBottom: "1px solid black",
                                              width: "100%",
                                          }}
                                      >
                                          <Text style={styles.tableCell}>
                                              {paper.paper_name}
                                          </Text>
                                      </View>
                                      <View
                                          style={[
                                              styles.tableRow,
                                              { width: "100%" },
                                          ]}
                                      >
                                          <View
                                              style={[
                                                  styles.tableCol,
                                                  { borderTop: 0 },
                                              ]}
                                          >
                                              <Text style={styles.tableCell}>
                                                  Obtained
                                              </Text>
                                          </View>
                                          <View
                                              style={[
                                                  styles.tableCol,
                                                  {
                                                      borderTop: 0,
                                                      borderRight: 0,
                                                  },
                                              ]}
                                          >
                                              <Text style={styles.tableCell}>
                                                  Total Marks
                                              </Text>
                                          </View>
                                      </View>
                                  </View>
                              );
                          })
                        : null}

                    <View
                        style={[
                            styles.tableCol,
                            { borderRight: 0, flexGrow: 0.5 },
                        ]}
                    >
                        <Text style={styles.tableCell}>Weighted Avg (%)</Text>
                    </View>
                </View>

                {/* ----- Body row ----- */}
                {general_course_structure &&
                Object.keys(general_course_structure).length !== 0
                    ? (Object.entries(general_course_structure) || []).map(
                          ([key, value], index) => {
                              return (
                                  <View style={styles.tableRow} key={index}>
                                      <View
                                          style={[
                                              styles.tableCol,
                                              { flexGrow: 0.5 },
                                          ]}
                                      >
                                          <Text style={styles.tableCell}>
                                              {key}
                                          </Text>
                                      </View>

                                      {/* chapter column */}
                                      <View style={styles.tableCol}>
                                          {(value.chapters || []).map(
                                              (chapter, chapter_index) => {
                                                  return (
                                                      <View
                                                          style={[
                                                              styles.tableCol,
                                                              {
                                                                  width: "100%",
                                                                  borderTop: 0,
                                                                  borderRight: 0,
                                                                  borderBottom:
                                                                      value
                                                                          .chapters
                                                                          .length ===
                                                                      chapter_index +
                                                                          1
                                                                          ? 0
                                                                          : 1,
                                                              },
                                                          ]}
                                                          key={chapter_index}
                                                      >
                                                          <Text
                                                              style={
                                                                  styles.tableCell
                                                              }
                                                          >
                                                              {
                                                                  chapter.chapter_name
                                                              }
                                                          </Text>
                                                      </View>
                                                  );
                                              }
                                          )}
                                      </View>

                                      {/* paper column */}
                                      {papers && papers.length !== 0
                                          ? (papers || []).map(
                                                (paper, index) => {
                                                    return (
                                                        <View
                                                            style={
                                                                styles.tableCol
                                                            }
                                                            key={index}
                                                        >
                                                            {(
                                                                value.chapters ||
                                                                []
                                                            ).map(
                                                                (
                                                                    chapter,
                                                                    chapter_index
                                                                ) => {
                                                                    return (
                                                                        <View
                                                                            style={[
                                                                                styles.tableRow,
                                                                                {
                                                                                    width: "100%",
                                                                                    borderBottom:
                                                                                        value
                                                                                            .chapters
                                                                                            .length ===
                                                                                        chapter_index +
                                                                                            1
                                                                                            ? 0
                                                                                            : 1,
                                                                                },
                                                                            ]}
                                                                            key={
                                                                                chapter_index
                                                                            }
                                                                        >
                                                                            <View
                                                                                style={[
                                                                                    styles.tableCol,
                                                                                    {
                                                                                        borderTop: 0,
                                                                                    },
                                                                                ]}
                                                                            >
                                                                                <Text
                                                                                    style={
                                                                                        styles.tableCell
                                                                                    }
                                                                                >
                                                                                    {
                                                                                        paper
                                                                                            .course_structure[
                                                                                            key
                                                                                        ]
                                                                                            .chapters[
                                                                                            chapter_index
                                                                                        ]
                                                                                            .correct_marks
                                                                                    }
                                                                                </Text>
                                                                            </View>
                                                                            <View
                                                                                style={[
                                                                                    styles.tableCol,
                                                                                    {
                                                                                        borderTop: 0,
                                                                                        borderRight: 0,
                                                                                    },
                                                                                ]}
                                                                            >
                                                                                <Text
                                                                                    style={
                                                                                        styles.tableCell
                                                                                    }
                                                                                >
                                                                                    {
                                                                                        paper
                                                                                            .course_structure[
                                                                                            key
                                                                                        ]
                                                                                            .chapters[
                                                                                            chapter_index
                                                                                        ]
                                                                                            .total_marks
                                                                                    }
                                                                                </Text>
                                                                            </View>
                                                                        </View>
                                                                    );
                                                                }
                                                            )}
                                                        </View>
                                                    );
                                                }
                                            )
                                          : null}

                                      {/* average column */}
                                      <View
                                          style={[
                                              styles.tableCol,
                                              { borderRight: 0, flexGrow: 0.5 },
                                          ]}
                                      >
                                          {(value.chapters || []).map(
                                              (chapter, chapter_index) => {
                                                  return (
                                                      <View
                                                          style={[
                                                              styles.tableCol,
                                                              {
                                                                  width: "100%",
                                                                  borderTop: 0,
                                                                  borderRight: 0,
                                                                  borderBottom:
                                                                      value
                                                                          .chapters
                                                                          .length ===
                                                                      chapter_index +
                                                                          1
                                                                          ? 0
                                                                          : 1,
                                                              },
                                                          ]}
                                                          key={chapter_index}
                                                      >
                                                          <Text
                                                              style={
                                                                  styles.tableCell
                                                              }
                                                          >
                                                              {
                                                                  chapter_weighted_average[
                                                                      chapter
                                                                          .chapter_id
                                                                  ]
                                                                      .weighted_average
                                                              }
                                                          </Text>
                                                      </View>
                                                  );
                                              }
                                          )}
                                      </View>
                                  </View>
                              );
                          }
                      )
                    : null}

                {/* ----- Empty row ----- */}
                <View style={styles.tableRow}>
                    <View style={[styles.tableCol, { flexGrow: 0.5 }]}>
                        <Text style={[styles.tableCell, { opacity: 0 }]}>
                            -
                        </Text>
                    </View>
                    <View style={styles.tableCol}>
                        <Text style={[styles.tableCell, { opacity: 0 }]}>
                            -
                        </Text>
                    </View>

                    {papers && papers.length !== 0
                        ? (papers || []).map((paper, index) => {
                              return (
                                  <View style={styles.tableCol} key={index}>
                                      <View
                                          style={[
                                              styles.tableRow,
                                              { width: "100%" },
                                          ]}
                                      >
                                          <View
                                              style={[
                                                  styles.tableCol,
                                                  { borderTop: 0 },
                                              ]}
                                          >
                                              <Text
                                                  style={[
                                                      styles.tableCell,
                                                      { opacity: 0 },
                                                  ]}
                                              >
                                                  -
                                              </Text>
                                          </View>
                                          <View
                                              style={[
                                                  styles.tableCol,
                                                  {
                                                      borderTop: 0,
                                                      borderRight: 0,
                                                  },
                                              ]}
                                          >
                                              <Text
                                                  style={[
                                                      styles.tableCell,
                                                      { opacity: 0 },
                                                  ]}
                                              >
                                                  -
                                              </Text>
                                          </View>
                                      </View>
                                  </View>
                              );
                          })
                        : null}

                    <View
                        style={[
                            styles.tableCol,
                            { borderRight: 0, flexGrow: 0.5 },
                        ]}
                    >
                        <Text style={[styles.tableCell, { opacity: 0 }]}>
                            -
                        </Text>
                    </View>
                </View>

                {/* ----- Footer row ----- */}
                <View style={styles.tableRow}>
                    <View style={[styles.tableCol, { flexGrow: 0.5 }]}>
                        <Text style={[styles.tableCell, { fontSize: 10 }]}>
                            Total
                        </Text>
                    </View>
                    <View style={styles.tableCol}>
                        <Text style={[styles.tableCell, { opacity: 0 }]}>
                            -
                        </Text>
                    </View>

                    {papers && papers.length !== 0
                        ? (papers || []).map((paper, index) => {
                              return (
                                  <View style={styles.tableCol} key={index}>
                                      <View
                                          style={[
                                              styles.tableRow,
                                              { width: "100%" },
                                          ]}
                                      >
                                          <View
                                              style={[
                                                  styles.tableCol,
                                                  { borderTop: 0 },
                                              ]}
                                          >
                                              <Text
                                                  style={[
                                                      styles.tableCell,
                                                      { fontSize: 10 },
                                                  ]}
                                              >
                                                  {paper.scored_marks}
                                              </Text>
                                          </View>
                                          <View
                                              style={[
                                                  styles.tableCol,
                                                  {
                                                      borderTop: 0,
                                                      borderRight: 0,
                                                  },
                                              ]}
                                          >
                                              <Text
                                                  style={[
                                                      styles.tableCell,
                                                      { fontSize: 10 },
                                                  ]}
                                              >
                                                  {paper.total_marks}
                                              </Text>
                                          </View>
                                      </View>
                                  </View>
                              );
                          })
                        : null}

                    <View
                        style={[
                            styles.tableCol,
                            { borderRight: 0, flexGrow: 0.5 },
                        ]}
                    >
                        <Text style={[styles.tableCell, { fontSize: 10 }]}>
                            {total_weighted_average}
                        </Text>
                    </View>
                </View>
            </View>

            {/* Predicted score */}
            {showPredictedScore ? (
                <View style={{ marginTop: 14 }}>
                    <Text style={{ fontSize: 10, color: "#621012" }}>
                        Predicted score in the range: {scoreRange("minus")} to{" "}
                        {scoreRange("plus")} if assessed again with in next 30
                        Days from{" "}
                        {dateFormat(
                            papers[papers.length - 1].submitted_on,
                            "dd/mm/yyyy"
                        )}
                    </Text>
                </View>
            ) : null}
        </View>
    );
};

export default Table;
