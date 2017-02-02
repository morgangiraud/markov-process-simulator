import React, { PropTypes } from 'react';
import { Row, Button } from 'react-bootstrap';

const AgentDashboard = ({ states, agent, onClickSwitchAgent, onSelectChangeAgentCurrentState }) => {
  let options = states.map((state, i) => {
    return (
      <option key={i} value={i}>{state.name}</option>
    )
  })
  return (
    <Row className='panel panel-default'>
      <p>Agent state:</p>
      <div>
        Current state: 
        <select value={agent.currentState} onChange={onSelectChangeAgentCurrentState}>
          { options }
        </select>
      </div>
      <div>
        Number of step: { agent.nbStep }
      </div>
      <div>
        Current cumulated reward: { agent.cumulatedReward }
      </div>
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
