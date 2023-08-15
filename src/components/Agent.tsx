import React, { useRef, useEffect } from "react";
import { connect, ConnectedProps } from "react-redux";
import * as d3Selection from "d3-selection";
import { easeLinear } from "d3-ease";
import "d3-transition";

import * as agentActions from "../actions/agentActions";
import * as rActions from "../actions/rActions";
import * as historyActions from "../actions/historyActions";

import utils, { getPath, sample, getNode } from "../utils";
import rUtils from "../rUtils";
import { RootState } from "../reducers";
import { Dispatch } from "redux";
import { AgentState } from "../types/agentState";
import { HistoryEvent } from "../types/historyState";
import { MarkovRewardProcess } from "../MarkovRewardProcess";
import { MarkovRewardProcessState } from "../types/markovRewardProcessState";
import { Node } from "../types/node";

const mapStateToProps = (state: RootState) => ({
  agent: state.agent,
  mp: state.mp,
  isViewer: state.isViewer,
  values: state.r.values,
});

function mapDispatchToProps(dispatch: Dispatch) {
  return {
    updateAgentState: (newState: Partial<AgentState>) => {
      dispatch(agentActions.update(newState));
    },
    updateValue: (value: number, index: number) => {
      dispatch(rActions.updateValue(value, index));
    },
    addEventToHistory: (event: HistoryEvent) => {
      dispatch(historyActions.addEvent(event));
    },
  };
}

const connector = connect(mapStateToProps, mapDispatchToProps);

type PropsFromRedux = ConnectedProps<typeof connector>;

const Agent: React.FC<PropsFromRedux> = ({
  mp,
  agent,
  isViewer,
  values,
  updateAgentState,
  updateValue,
  addEventToHistory,
}) => {
  const agentNode = useRef<SVGCircleElement>(null);

  const startAgentRef = useRef(agent.startAgent);
  useEffect(() => {
    startAgentRef.current = agent.startAgent;
  }, [agent.startAgent]);

  useEffect(() => {
    if (isViewer && agent.startAgent === false) {
      updateAgentState({ startAgent: true });
    }
  }, [agent]);

  useEffect(() => {
    if (agent.startAgent) {
      const currentState = agent.currentState;
      const nextState = sample(mp.P[currentState]);
      const currentNodeData = getNode(mp.d3Nodes, currentState);
      if (!currentNodeData) return;
      const nextNodeData = getNode(mp.d3Nodes, nextState);
      if (!nextNodeData) return;

      // Update values
      if (agent.shouldEvaluate && mp instanceof MarkovRewardProcess) {
        const newData = rUtils.syncValueEvaluationStep(
          [...values],
          mp.P,
          mp.rewards,
          mp.gamma,
        );
        updateValue(newData[0][agent.currentState], agent.currentState);
      }

      // Update history
      addEventToHistory({
        type: "state",
        value: currentNodeData.data.name,
        stroke: utils.getColor(currentNodeData.data),
      });
      if (mp instanceof MarkovRewardProcess) {
        addEventToHistory({
          type: "reward",
          value: (currentNodeData as Node<MarkovRewardProcessState>).data
            .reward,
          stroke: utils.getColor(currentNodeData.data),
        });
      }

      const d3AgentNode = d3Selection.select(agentNode.current);
      const path = getPath(mp.d3Links, currentState, nextState);
      const pStart = path.getPointAtLength(0);
      d3AgentNode
        .transition()
        .delay(300 * agent.speedCoef)
        .duration(200 * agent.speedCoef)
        .attr("transform", `translate(${pStart.x}, ${pStart.y})`)
        .transition()
        .duration(500 * agent.speedCoef)
        .attrTween("transform", utils.translateAlong(path))
        .ease(easeLinear)
        .transition()
        .duration(200 * agent.speedCoef)
        .attr("transform", `translate(${nextNodeData.x}, ${nextNodeData.y})`)
        .on("end", () => {
          const shouldContinue =
            startAgentRef.current && currentNodeData.data.terminal === false;

          if (mp instanceof MarkovRewardProcess) {
            updateAgentState({
              currentState: nextState,
              nbStep: agent["nbStep"] + 1,
              cumulatedReward:
                Math.floor(
                  (agent["cumulatedReward"] +
                    ((currentNodeData as Node<MarkovRewardProcessState>).data
                      .reward || 0)) *
                    1000,
                ) / 1000,
              startAgent: shouldContinue,
            });
          } else {
            updateAgentState({
              currentState: nextState,
              nbStep: agent["nbStep"] + 1,
              startAgent: shouldContinue,
            });
          }
        });
    }
  }, [agent]);

  const x = mp.d3Nodes[agent.currentState].x;
  const y = mp.d3Nodes[agent.currentState].y;

  return (
    <circle
      ref={agentNode}
      fill="red"
      r="7"
      transform={`translate(${x}, ${y})`}
    ></circle>
  );
};

export default connector(Agent);
