import React, { PropTypes } from 'react';
import { Row, Col, Button } from 'react-bootstrap';

const AgentDashboard = ({ states, agent, onClickSwitchAgent, onSelectChangeAgentCurrentState }) => {
  let options = states.map((state, i) => {
    return (
      <option key={i} value={i}>{state.name}</option>
    )
  })
  return (
    <Row className='panel panel-default'>
      <p>Agent state:</p>
      <Col>
        <Row>
          <Col xs={6} md={6}>
            Current state: 
            <select value={agent.currentState} onChange={onSelectChangeAgentCurrentState}>
              { options }
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
            Current timestep: { agent.nbStep }
          </Col>
          <Col xs={6} md={6}>
            Current cumulated reward: { agent.cumulatedReward }
          </Col>
        </Row>
      </Col>
      <div>
        <Button
          bsSize="sm"
          bsStyle="primary"
          type="button"
          onClick={ onClickSwitchAgent }
        >
         { !agent.startAgent ? "Start Agent": "Stop Agent" }
        </Button>
      </div>
    </Row>
  )
}
AgentDashboard.propTypes = {
  states: PropTypes.array.isRequired,
  agent: PropTypes.object.isRequired,
  onClickSwitchAgent: PropTypes.func.isRequired,
  onSelectChangeAgentCurrentState: PropTypes.func.isRequired
}

export default AgentDashboard;
