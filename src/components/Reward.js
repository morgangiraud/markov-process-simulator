import React, { PropTypes } from 'react';

import utils from '../utils'

const Reward = ({ node }) => {
  let radius = 15
    , vec = [0, (node.data.r - radius)]
    , negPi8Vec = utils.multiply(utils.negPi4Rot, vec)
    , x = negPi8Vec[0][0]
    , y = negPi8Vec[1][0]

  return (
    <g 
      className={ node.data.class + " reward"}
      id={"reward-" + node.data.name}
      transform={"translate(" + x + "," + y + ")"}
    >
      <circle
        r={radius}
        stroke={utils.getColor(node.data)}
        fill="white"
      ></circle>
      <text
        fontSize="13px"
        textAnchor="middle"
        dominantBaseline="central"
      >
        { Math.floor(node.data.reward *100) / 100 }
      </text>
    </g>
  )
}

Reward.propTypes = {
  node: PropTypes.object.isRequired
}

export default Reward;
