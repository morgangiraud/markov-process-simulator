import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Row, Col, Button } from 'react-bootstrap';

import MarkovProcessSelect from './MarkovProcessSelect'
import MarkovProcessProps from './MarkovProcessProps'
import AgentDashboard from './AgentDashboard'

import * as agentActions from '../actions/agentActions';
import * as mcActions from '../actions/mcActions';
import * as rActions from '../actions/rActions';

class Dashboard extends Component {
  render() {
    let valuePanel
    if (this.props.mp.type === "mrp" || this.props.mp.type === "mdp") {
      valuePanel = (
        <Row className='panel panel-default'>
          <p>State-value function:</p>
          <Row>
            <Col xs={4} md={4}>
              <Button
                bsSize="small"
                bsStyle="primary"
                type="button"
                onClick={ (e) => { this.props.onClickResetStateValue(e, this.props.mp) } }
              >
               Reset values to 0
              </Button>
            </Col>
            <Col xs={4} md={4}>
              <Button
                bsSize="small"
                bsStyle="primary"
                type="button"
                onClick={ (e) => { this.props.onClickEvaluateStateValue(e, this.props.mp) } }
              >
               Evaluate
              </Button>
            </Col>
            <Col xs={4} md={4}>
              <Button
                bsSize="small"
                bsStyle="primary"
                type="button"
                onClick={ (e) => { this.props.onClickEvaluateStateValueStep(e, this.props.mp) } }
              >
               Evaluate step-by-step
              </Button>
            </Col>
          </Row>
          <Row>
            <Col xs={4} md={4}>
              <Button
                bsSize="small"
                bsStyle="primary"
                type="button"
                onClick={ (e) => { this.props.onSelectSwitchAgentEval(e, this.props.agent) } }
              >
               { this.props.agent.shouldEvaluate ? "Stop the agent evaluation" : "Evaluate using the agent"}
              </Button>
            </Col>
          </Row>
        </Row>
      )
    }
    return (
      <Col xs={12} md={6}>
        <MarkovProcessSelect 
          mp={this.props.mp} 
          onClickUpdateMarkovType={this.props.onClickUpdateMarkovType}
        />
        <MarkovProcessProps 
          mp={this.props.mp} 
        />
        { valuePanel }
        <AgentDashboard 
          states={this.props.mp.states}
          agent={this.props.agent} 
          onClickSwitchAgent={this.props.onClickSwitchAgent}
          onSelectChangeAgentCurrentState={this.props.onSelectChangeAgentCurrentState}
        />
      </Col>
    )
  }
}

function mapStateToProps(state, ownProps){
  return {
    agent: state.agent,
    mp: state.mc
  }
}

function mapDispatchToProps(dispatch) {
  return {
    onClickSwitchAgent: (e) => {
      e.preventDefault()
      dispatch(agentActions.switchAgent())
      return
    },
    onSelectChangeAgentCurrentState: (e) => {
      e.preventDefault()
      dispatch(agentActions.update({
        currentState: parseInt(e.target.value, 10),
        nbStep: 0,
        cumulatedReward: 0
      }))
      return
    },
    onSelectSwitchAgentEval: (e, agent) => {
      e.preventDefault()
      dispatch(agentActions.update({
        shouldEvaluate: !agent.shouldEvaluate,
      }))
      return
    },
    onClickUpdateMarkovType: (e, markovType) => {
      e.preventDefault()
      dispatch(mcActions.updateMarkovType(markovType))
    },
    onClickResetStateValue: (e, mc) => {
      e.preventDefault()
      dispatch(rActions.initValues(mc.rewards.length))
    },
    onClickEvaluateStateValue: (e, mc) => {
      e.preventDefault()
      dispatch(rActions.evalValues(mc))
    },
    onClickEvaluateStateValueStep: (e, mc) => {
      e.preventDefault()
      dispatch(rActions.evalValuesStep(mc))
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Dashboard);

