import React from "react";

import utils from "../utils";
import { MarkovRewardProcessState } from "../types/markovRewardProcessState";

interface RewardProps {
  mrpState: MarkovRewardProcessState;
}

const Reward: React.FC<RewardProps> = ({ mrpState }) => {
  const radius = 15;
  const vec = [0, mrpState.r - radius];
  const negPi8Vec = utils.multiply(utils.negPi4Rot, vec);
  const x = negPi8Vec[0][0];
  const y = negPi8Vec[1][0];

  return (
    <g
      className={`${mrpState.class} reward`}
      id={`reward-${mrpState.name}`}
      transform={`translate(${x},${y})`}
    >
      <circle
        r={radius}
        stroke={utils.getColor(mrpState)}
        fill="white"
      ></circle>
      <text fontSize="13px" textAnchor="middle" dominantBaseline="central">
        {Math.floor(mrpState.reward * 100) / 100}
      </text>
    </g>
  );
};

export default Reward;
