import React, { PropTypes } from 'react';
import { connect } from 'react-redux';

import { namespaces as d3Namespaces } from "d3";

import History from './History'
import State from './State'
import Link from './Link'
import Agent from './Agent'

const Graph = ({ mc, values, history }) => {
  let width = 500
    , height = 500
    , addValues = (values.length === mc.nodes.length && mc.type !== "mp")

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
      <div id="graph">
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
          <History 
            history={history} 
            transformString={`translate(${-width/2}, ${-height/2 + 20})`}
          />
          <g id="container">
            <g> { nodes } </g>
            <g> { links } </g>
            <Agent />
          </g>
        </svg>
      </div>
  );
}

Graph.propTypes = {
  mc: PropTypes.object.isRequired,
  values: PropTypes.array,
  history: PropTypes.array
}

function mapStateToProps(state, ownProps){
  return {
    mc: state.mc,
    values: state.r.values,
    history: state.history
  }
}

export default connect(mapStateToProps)(Graph);

