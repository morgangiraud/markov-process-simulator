import React from "react";

import Reward from "./Reward";
import Value from "./Value";
import utils from "../utils";
import { Node } from "../types/node";
import { MarkovProcessState } from "../types/markovProcessState";
import { MarkovRewardProcessState } from "../types/markovRewardProcessState";
import { isMarkovRewardProcessState } from "../mpUtils";

interface StateProps {
  node: Node<MarkovProcessState> | Node<MarkovRewardProcessState>;
  value?: number;
}

const State: React.FC<StateProps> = ({ node, value }) => {
  node.x = node.x || 0;
  node.y = node.y || 0;

  let nodeShape;
  if (node.data.terminal === true) {
    const r = node.data.r ?? 40;
    nodeShape = (
      <rect
        stroke={utils.getColor(node.data)}
        x={-r}
        y={-r}
        width={2 * r}
        height={2 * r}
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

  let valueNode;
  if (typeof value !== "undefined" && Number.isFinite(value)) {
    valueNode = <Value mpState={node.data} value={value} />;
  }

  return (
    <g
      className={`${node.data.class} node`}
      id={node.data.name}
      transform={`translate(${node.x},${node.y})`}
    >
      {nodeShape}
      {isMarkovRewardProcessState(node.data) && <Reward mrpState={node.data} />}
      {valueNode}
      <text textAnchor="middle" dominantBaseline="central">
        {node.data.name}
      </text>
    </g>
  );
};

export default State;
