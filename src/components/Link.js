import React, { PropTypes } from 'react';

import utils from '../utils'


const Link = ({ link }) => {
  return (
    <g 
      className={ link.class }
    >
      <path
        id={`path-${link.source.data.name}-${link.target.data.name}`}
        markerEnd="url(#arrow)"
        strokeWidth={link.p * 10 + 1}
        stroke={utils.getColor(link.source.data)}
        fill="none"
        d={utils.createD(link)}
      >
      </path>
      <text
        dy="-5"
      >
        <textPath
          href={ `#path-${link.source.data.name}-${link.target.data.name}` }
          startOffset="49%"
        >
          { Math.floor(link.p * 100) / 100 }
        </textPath>
      </text>
    </g>
  )
}

Link.propTypes = {
  link: PropTypes.object.isRequired
}

export default Link;
