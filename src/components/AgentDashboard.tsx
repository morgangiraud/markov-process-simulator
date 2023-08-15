import React, { ChangeEvent, MouseEvent } from "react";
import { Row, Col, Button } from "react-bootstrap";
import * as agentActions from "../actions/agentActions";
import { Dispatch } from "redux";
import { RootState } from "../reducers";
import { ConnectedProps, connect } from "react-redux";

function mapStateToProps(state: RootState) {
  return {
    agent: state.agent,
    mp: state.mp,
  };
}

function mapDispatchToProps(dispatch: Dispatch) {
  return {
    onClickSwitchAgent: (e: MouseEvent<HTMLButtonElement>) => {
      e.preventDefault();
      dispatch(agentActions.switchAgent());
      return;
    },
    onSelectChangeAgentCurrentState: (e: ChangeEvent<HTMLSelectElement>) => {
      e.preventDefault();
      dispatch(
        agentActions.update({
          currentState: parseInt(e.target.value, 10),
          nbStep: 0,
          cumulatedReward: 0,
        }),
      );
      return;
    },
  };
}

const connector = connect(mapStateToProps, mapDispatchToProps);

type PropsFromRedux = ConnectedProps<typeof connector>;

const AgentDashboard: React.FC<PropsFromRedux> = ({
  mp,
  agent,
  onClickSwitchAgent,
  onSelectChangeAgentCurrentState,
}) => {
  return (
    <Col className="m-2">
      <h3>Agent state:</h3>
      <Col>
        <Row>
          <Col xs={6} md={6}>
            Current state:
            <select
              value={agent.currentState}
              onChange={onSelectChangeAgentCurrentState}
            >
              {mp.states.map((state, i) => (
                <option key={i} value={i}>
                  {state.name}
                </option>
              ))}
            </select>
          </Col>
          <Col xs={6} md={6}>
            Agent speed:
          </Col>
        </Row>
      </Col>
      <Col>
        <Row>
          <Col xs={6} md={6}>
            Current timestep: {agent.nbStep}
          </Col>
          <Col xs={6} md={6}>
            Current cumulated reward: {agent.cumulatedReward}
          </Col>
        </Row>
      </Col>
      <div>
        <Button
          size="sm"
          variant="primary"
          type="button"
          onClick={onClickSwitchAgent}
        >
          {!agent.startAgent ? "Start Agent" : "Stop Agent"}
        </Button>
      </div>
    </Col>
  );
};

export default connector(AgentDashboard);
