import React from "react";
import { ConnectedProps, connect } from "react-redux";
import { namespaces as d3Namespaces } from "d3-selection";

import State from "./State";
import Link from "./Link";
import Agent from "./Agent";
import { MarkovProcess } from "../MarkovProcess";
import { RootState } from "../reducers";

interface OwnProps {
  width: number;
  height: number;
}

function mapStateToProps(state: RootState, ownProps: OwnProps) {
  return {
    mp: state.mp,
    values: state.r.values,
    width: ownProps.width,
    height: ownProps.height,
  };
}

const connector = connect(mapStateToProps);

type PropsFromRedux = ConnectedProps<typeof connector>;

const Graph: React.FC<PropsFromRedux> = ({ width, height, mp, values }) => {
  const shouldAddValues =
    values.length === mp.states.length && !(mp instanceof MarkovProcess);

  // TODO: might need a context for this?
  // const { d3Nodes, d3Links } = useMemo(() => {
  //   let { d3Nodes, d3Links } = initializeForceSimulation<MarkovProcessState>(
  //     mp.states,
  //     mp.P,
  //   );

  //   if (mp instanceof MarkovRewardProcess) {
  //     d3Nodes = addRewardsToStates(d3Nodes, mp.rewards);
  //   }
  //   return { d3Nodes, d3Links };
  // }, [mp.states, mp.P]);

  const nodes = mp.d3Nodes.map((node, i) => (
    <State
      key={i}
      node={node}
      value={shouldAddValues ? values[i] : undefined}
    />
  ));

  const links = mp.d3Links.map((link, i) => <Link key={i} link={link} />);

  return (
    <svg
      xmlns={d3Namespaces.svg}
      viewBox={-width / 2 + " " + -height / 2 + " " + width + " " + height}
      width={width}
      height={height}
    >
      <defs>
        <marker
          id="arrow"
          markerWidth="3"
          markerHeight="3"
          refX="1"
          refY="1"
          orient="auto"
          markerUnits="strokeWidth"
        >
          <path d="M0,0 L0,2 L3,1 z"></path>
        </marker>
      </defs>
      <g id="container">
        <g>{nodes}</g>
        <g>{links}</g>
        <Agent />
      </g>
    </svg>
  );
};

export default connector(Graph);
