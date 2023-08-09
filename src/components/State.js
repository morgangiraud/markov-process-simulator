import React from "react";
import PropTypes from "prop-types";

import Reward from "./Reward";
import Value from "./Value";
import utils from "../utils";

const State = ({ node, value }) => {
  node.x = node.x || 0;
  node.y = node.y || 0;

  let nodeShape;
  if (node.data.terminal === true) {
    nodeShape = (
      <rect
        stroke={utils.getColor(node.data)}
        x={-node.data.r}
        y={-node.data.r}
        width={2 * node.data.r}
        height={2 * node.data.r}
        fill="white"
      ></rect>
    );
  } else {
    nodeShape = (
      <circle
        r={node.data.r}
        stroke={utils.getColor(node.data)}
        fill="white"
      ></circle>
    );
  }

  let reward;
  if (node.data.reward || node.data.reward === 0) {
    reward = <Reward node={node} />;
  }

  let valueNode;
  if (Number.isFinite(value)) {
    valueNode = <Value node={node} value={value} />;
  }

  return (
    <g
      className={node.data.class + " node"}
      id={node.data.name}
      transform={"translate(" + node.x + "," + node.y + ")"}
    >
      {nodeShape}
      {reward}
      {valueNode}
      <text textAnchor="middle" dominantBaseline="central">
        {node.data.name}
      </text>
    </g>
  );
};

State.propTypes = {
  node: PropTypes.object.isRequired,
  value: PropTypes.number,
};

export default State;
