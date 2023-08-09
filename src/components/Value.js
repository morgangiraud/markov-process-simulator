import React from "react";
import PropTypes from "prop-types";

import utils from "../utils";

const Value = ({ node, value }) => {
  let width = 65,
    height = 20,
    vec = [0, node.data.r - height / 2],
    x = vec[0],
    y = -vec[1];

  return (
    <g
      className={node.data.class + " reward"}
      id={"reward-" + node.data.name}
      transform={"translate(" + x + "," + y + ")"}
    >
      <rect
        x={-width / 2}
        y={-height / 2}
        width={width}
        height={height}
        stroke={utils.getColor(node.data)}
        fill="white"
      ></rect>
      <text fontSize="13px" textAnchor="middle" dominantBaseline="central">
        V(s): {value}
      </text>
    </g>
  );
};

Value.propTypes = {
  node: PropTypes.object.isRequired,
  value: PropTypes.number.isRequired,
};

export default Value;
