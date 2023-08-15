import React, { MouseEvent } from "react";
import { ConnectedProps, connect } from "react-redux";
import { Row, Col, Button } from "react-bootstrap";

import MarkovProcessSelect from "./MarkovProcessSelect";
import MarkovProcessProps from "./MarkovProcessProps";

import * as agentActions from "../actions/agentActions";
import * as mcActions from "../actions/mcActions";
import * as rActions from "../actions/rActions";
import { RootState } from "../reducers";
import { Dispatch } from "redux";
import { AgentState } from "../types/agentState";
import { MarkovRewardProcess } from "../MarkovRewardProcess";

function mapStateToProps(state: RootState) {
  return {
    agent: state.agent,
    mp: state.mp,
  };
}

function mapDispatchToProps(dispatch: Dispatch) {
  return {
    onClickSwitchAgentEval: (
      e: MouseEvent<HTMLButtonElement>,
      agent: Partial<AgentState>,
    ) => {
      e.preventDefault();
      dispatch(
        agentActions.update({
          shouldEvaluate: !agent.shouldEvaluate,
        }),
      );
      return;
    },
    onClickUpdateMarkovType: (
      e: MouseEvent<HTMLButtonElement>,
      markovType: "mp" | "mrp",
    ) => {
      e.preventDefault();
      dispatch(mcActions.updateMarkovType(markovType));
    },
    onClickResetStateValue: (
      e: MouseEvent<HTMLButtonElement>,
      mp: MarkovRewardProcess,
    ) => {
      e.preventDefault();
      dispatch(rActions.initValues(mp.rewards.length));
    },
    onClickEvaluateStateValue: (
      e: MouseEvent<HTMLButtonElement>,
      mp: MarkovRewardProcess,
    ) => {
      e.preventDefault();
      dispatch(rActions.evalValues(mp));
    },
    onClickEvaluateStateValueStep: (
      e: MouseEvent<HTMLButtonElement>,
      mp: MarkovRewardProcess,
    ) => {
      e.preventDefault();
      dispatch(rActions.evalValuesStep(mp));
    },
  };
}

const connector = connect(mapStateToProps, mapDispatchToProps);

type PropsFromRedux = ConnectedProps<typeof connector>;

const Dashboard: React.FC<PropsFromRedux> = ({
  mp,
  agent,
  onClickSwitchAgentEval,
  onClickUpdateMarkovType,
  onClickResetStateValue,
  onClickEvaluateStateValue,
  onClickEvaluateStateValueStep,
}) => {
  return (
    <>
      <MarkovProcessSelect
        mp={mp}
        onClickUpdateMarkovType={onClickUpdateMarkovType}
      />

      <MarkovProcessProps />

      {mp instanceof MarkovRewardProcess && (
        <Row className="m-2">
          <p>State-value function:</p>
          <Row>
            <Col>
              <Button
                size="sm"
                variant="primary"
                type="button"
                onClick={(e) => {
                  onClickResetStateValue(e, mp);
                }}
              >
                Reset values to 0
              </Button>
            </Col>
            <Col>
              <Button
                size="sm"
                variant="primary"
                type="button"
                onClick={(e) => {
                  onClickEvaluateStateValue(e, mp);
                }}
              >
                Evaluate
              </Button>
            </Col>
            <Col>
              <Button
                size="sm"
                variant="primary"
                type="button"
                onClick={(e) => {
                  onClickEvaluateStateValueStep(e, mp);
                }}
              >
                Evaluate step-by-step
              </Button>
            </Col>

            <Col>
              <Button
                size="sm"
                variant="primary"
                type="button"
                onClick={(e) => {
                  onClickSwitchAgentEval(e, agent);
                }}
              >
                {agent.shouldEvaluate
                  ? "Stop the agent evaluation"
                  : "Evaluate using the agent"}
              </Button>
            </Col>
          </Row>
        </Row>
      )}
    </>
  );
};

export default connector(Dashboard);
