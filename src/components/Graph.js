import React, { PropTypes } from 'react';
import { connect } from 'react-redux';

import { namespaces as d3Namespaces } from "d3";

import State from './State'
import Link from './Link'
import Agent from './Agent'

const Graph = ({ width, height, mc, values }) => {
  let addValues = (values.length === mc.nodes.length && mc.type !== "mp")

  const nodes = mc.nodes.map((node, i) =>
    <State 
      key={i} 
      node={node}
      value={addValues ? values[i] : null}
    ></State>
  );

  const links = mc.links.map((link, i) =>
    <Link 
      key={i} 
      link={link}
    ></Link>
  );

  return (
      <svg 
        xmlns={d3Namespaces.svg} 
        viewBox={-width/2 + " " + -height/2 + " " + width + " " + height}
        width={ width }
        height={ height }
      >
        <defs>
          <marker id="arrow"
             markerWidth="3"
             markerHeight="3"
             refX="1"
             refY="1"
             orient="auto"
             markerUnits="strokeWidth">
             <path d="M0,0 L0,2 L3,1 z"></path>
          </marker> 
        </defs>
        <g id="container">
          <g> { nodes } </g>
          <g> { links } </g>
          <Agent />
        </g>
      </svg>
  );
}

Graph.propTypes = {
  mc: PropTypes.object.isRequired,
  values: PropTypes.array,
  width: PropTypes.number,
  height: PropTypes.number,
}

function mapStateToProps(state, ownProps){
  return {
    mc: state.mc,
    values: state.r.values,
    width: ownProps.width,
    height: ownProps.height,
  }
}

export default connect(mapStateToProps)(Graph);

