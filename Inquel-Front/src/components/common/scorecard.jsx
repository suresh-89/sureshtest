import React from "react";

const ScoreCardTable = (props) => {
    return (
        <div className="table-responsive">
            <table className="table">
                <thead>
                    <th scope="col">Range in %</th>
                    <th scope="col">Retake Duration</th>
                    <th scope="col">Reduction %</th>
                    <th scope="col">Reduction Duration</th>
                    <th scope="col">Remarks</th>
                </thead>
                <tbody>
                    {Object.keys(props.scorecard).length !== 0
                        ? Object.entries(props.scorecard).map(
                              ([key, value], index) => {
                                  return (
                                      <tr key={index}>
                                          <td className="d-flex align-items-center">
                                              <input
                                                  type="number"
                                                  name="range1"
                                                  value={value.range[0]}
                                                  onChange={(event) =>
                                                      props.handleData(
                                                          event,
                                                          key,
                                                          "range",
                                                          0
                                                      )
                                                  }
                                                  className="form-control border-secondary"
                                              />
                                              <span className="mx-2">to</span>
                                              <input
                                                  type="number"
                                                  name="range2"
                                                  value={value.range[1]}
                                                  onChange={(event) =>
                                                      props.handleData(
                                                          event,
                                                          key,
                                                          "range",
                                                          1
                                                      )
                                                  }
                                                  className="form-control border-secondary"
                                              />
                                          </td>
                                          <td>
                                              <div className="input-group input-group-sm border-secondary rounded-lg overflow-hidden">
                                                  <input
                                                      type="text"
                                                      name="retake"
                                                      value={
                                                          value.retake.split(
                                                              " "
                                                          )[0]
                                                      }
                                                      className="form-control"
                                                      onChange={(event) =>
                                                          props.handleData(
                                                              event,
                                                              key,
                                                              "retake"
                                                          )
                                                      }
                                                  />
                                                  <div className="input-group-prepend">
                                                      <span className="input-group-text border-0">
                                                          Week
                                                      </span>
                                                  </div>
                                              </div>
                                          </td>
                                          <td>
                                              <div className="input-group input-group-sm border-secondary rounded-lg overflow-hidden">
                                                  <input
                                                      type="text"
                                                      name="reduction"
                                                      value={
                                                          value.reduction.split(
                                                              "%"
                                                          )[0]
                                                      }
                                                      className="form-control"
                                                      onChange={(event) =>
                                                          props.handleData(
                                                              event,
                                                              key,
                                                              "reduction"
                                                          )
                                                      }
                                                  />
                                                  <div className="input-group-prepend">
                                                      <span className="input-group-text border-0">
                                                          %
                                                      </span>
                                                  </div>
                                              </div>
                                          </td>
                                          <td>
                                              <div className="input-group input-group-sm border-secondary rounded-lg overflow-hidden">
                                                  <input
                                                      type="text"
                                                      name="duration"
                                                      value={
                                                          value.reduction_duration.split(
                                                              " "
                                                          )[0]
                                                      }
                                                      className="form-control"
                                                      onChange={(event) =>
                                                          props.handleData(
                                                              event,
                                                              key,
                                                              "reduction_duration"
                                                          )
                                                      }
                                                  />
                                                  <div className="input-group-prepend">
                                                      <span className="input-group-text border-0">
                                                          Week
                                                      </span>
                                                  </div>
                                              </div>
                                          </td>
                                          <td>
                                              <input
                                                  type="text"
                                                  name="remarks"
                                                  className="form-control"
                                                  style={{
                                                      borderColor: value.color,
                                                      borderWidth: "2px",
                                                  }}
                                                  value={key}
                                                  onChange={(event) =>
                                                      props.handleData(
                                                          event,
                                                          key,
                                                          "remarks"
                                                      )
                                                  }
                                              />
                                          </td>
                                      </tr>
                                  );
                              }
                          )
                        : null}
                </tbody>
            </table>
        </div>
    );
};

export default ScoreCardTable;
