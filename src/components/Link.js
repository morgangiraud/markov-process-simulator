import React, { PureComponent, PropTypes } from 'react';

import utils from '../utils'


class Link extends PureComponent {
  constructor(){
    super()

    this.link = null
    this.text = null
  }

  componentDidMount() {
    let len = this.link.getTotalLength()
      , p = this.link.getPointAtLength(0.5 * len)
    this.text.setAttribute("transform", `translate(${p.x - 10}, ${p.y + 5})`)
  }

  componentDidUpdate() {
    let len = this.link.getTotalLength()
      , p = this.link.getPointAtLength(0.5 * len)
    this.text.setAttribute("transform", `translate(${p.x - 10}, ${p.y + 5})`)
  }

  render() {
    let link = this.props.link
    return (
      <g
        className={ link.class }
      >
        <path
          ref={ (link) => { this.link = link } }
          id={`path-${link.source.data.name}-${link.target.data.name}`}
          markerEnd="url(#arrow)"
          strokeWidth={link.p * 10 + 1}
          stroke={utils.getColor(link.source.data)}
          fill="none"
          d={utils.createD(link)}
        >
        </path>
        <text
          ref={ (text) => { this.text = text } }
        >
          { Math.floor(link.p * 100) / 100 }
          
        </text>
      </g>
    )
  }
}

Link.propTypes = {
  link: PropTypes.object.isRequired
}

export default Link;
