import React, { PureComponent } from "react";
import PropTypes from "prop-types";

import { namespaces as d3Namespaces } from "d3";

let historySize = 12;
class History extends PureComponent {
  constructor() {
    super();

    this.textElements = [];
    this.firstText = null;
  }

  componentDidUpdate() {
    let currentX = this.firstText.getComputedTextLength() + 5;
    this.textElements.forEach((textElement) => {
      if (textElement) {
        textElement.setAttribute("x", currentX);
        currentX += textElement.getComputedTextLength() + 1;
      }
    });
  }

  render() {
    this.textElements = Array(this.props.history.length);
    let width = this.props.width,
      height = this.props.height;
    return (
      <svg xmlns={d3Namespaces.svg} width={width} height={height}>
        <g transform={`translate(0, ${height / 2})`}>
          <text
            ref={(firstText) => {
              this.firstText = firstText;
            }}
            dominantBaseline="central"
            stroke="none"
          >
            H:
          </text>
          {this.props.history.slice(-historySize).map((event, key) => {
            return (
              <text
                ref={(textEl) => {
                  this.textElements[key] = textEl;
                }}
                key={key}
                dominantBaseline="central"
                stroke="none"
                fill={event.stroke}
              >
                {event.value +
                  (key === this.props.history.length - 1 ||
                  key === historySize - 1
                    ? ""
                    : ", ")}
              </text>
            );
          })}
        </g>
      </svg>
    );
  }
}

History.propTypes = {
  history: PropTypes.array.isRequired,
  width: PropTypes.number,
  height: PropTypes.number,
};

export default History;
