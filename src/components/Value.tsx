import React from "react";
import utils from "../utils";
import { MarkovProcessState } from "../types/markovProcessState";
import { MarkovRewardProcessState } from "../types/markovRewardProcessState";

interface ValueProps {
  mpState: MarkovProcessState | MarkovRewardProcessState;
  value: number;
}

const Value: React.FC<ValueProps> = ({ mpState, value }) => {
  const width = 65;
  const height = 20;
  const vec = [0, mpState.r - height / 2];
  const x = vec[0];
  const y = -vec[1];

  return (
    <g
      className={`${mpState.class} reward`}
      id={`reward-${mpState.name}`}
      transform={`translate(${x},${y})`}
    >
      <rect
        x={-width / 2}
        y={-height / 2}
        width={width}
        height={height}
        stroke={utils.getColor(mpState)}
        fill="white"
      ></rect>
      <text fontSize="13px" textAnchor="middle" dominantBaseline="central">
        V(s): {value}
      </text>
    </g>
  );
};

export default Value;
