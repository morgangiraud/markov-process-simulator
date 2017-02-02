/*eslint no-unused-vars: "off"*/
import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as d3Selection from "d3-selection";
import * as d3Transition from "d3-transition";
import { easeLinear as d3EaseLinear } from "d3";

import * as agentActions from '../actions/agentActions';
import * as rActions from '../actions/rActions';
import * as historyActions from '../actions/historyActions';

import utils from '../utils'
import rUtils from '../rUtils'

class Agent extends Component {
  constructor(props){
    super(props)

    this.player = null
    this.agentNode = null
  }

  componentDidMount(){
    let { isViewer , updateAgentState} = this.props
    if (isViewer) {
      updateAgentState({startAgent: true})
    }
  }

  componentWillUpdate(nextProps){
    if(nextProps.mp !== this.props.mp && this.player){
      this.player.stop()
    }
  }

  componentDidUpdate(prevProps){
    let { agent, mp } = this.props

    if (prevProps.mp !== mp) {
      this.player = this.transition()
      if (agent.startAgent) {
        this.player.start()
      }
      return
    }

    if(prevProps.agent.startAgent !== agent.startAgent){
      if (agent.startAgent) {
        if (this.player !== null) {
          this.player.start()
        } else {
          this.player = this.transition()
          this.player.start()
        }
      } else {
        this.player.stop()
      }
    }
  }

  transition(){
    let stopAgent = true;

    // Cleaning the history
    this.props.updateHistory([])

    let doTransition = function(){
      let mp = this.props.mp
        , currentState = this.props.agent["currentState"]
        , nextState = utils.sample(mp.P[currentState])

      let [path, pathData] = utils.getPath(mp.links, currentState, nextState)
          , [currentNode, currentNodeData] = utils.getNode(mp.nodes, currentState)
          , [nextNode, nextNodeData] = utils.getNode(mp.nodes, nextState)

      let pStart = path.getPointAtLength(0);

      // Update values
      if(this.props.agent.shouldEvaluate){
        let [ newValues, _ ] = rUtils.syncValueEvaluationStep([...this.props.values], mp.P, mp.rewards, mp.gamma)
        this.props.updateValue(newValues[this.props.agent.currentState], this.props.agent.currentState)
      }

      // Update history
      this.props.addEventToHistory({
        type: 'state',
        value: currentNodeData.data.name,
        stroke: utils.getColor(currentNodeData.data)
      })
      if (mp.type === "mrp") {
        this.props.addEventToHistory({
          type: 'reward',
          value: currentNodeData.data.reward,
          stroke: utils.getColor(currentNodeData.data)
        })
      }


      let d3AgentNode = d3Selection.select(this.agentNode)
      d3AgentNode.transition()
        .delay(300)
        .duration(200)
        .attr("transform", `translate(${pStart.x}, ${pStart.y})`)
        .transition()
          .duration(500)
          .attrTween("transform", utils.translateAlong(path))
          .ease(d3EaseLinear)
          .transition()
            .duration(200)
            .attr("transform", `translate(${nextNodeData.x}, ${nextNodeData.y})`)
            .on("end", () => {
              let shouldContinue = (!stopAgent && currentNodeData.data.terminal === false)

              this.props.updateAgentState({
                currentState: nextState,
                nbStep: this.props.agent["nbStep"] + 1,
                cumulatedReward: Math.floor((this.props.agent["cumulatedReward"] + (currentNodeData.data.reward || 0)) * 1000) / 1000,
                startAgent: shouldContinue
              })
              if(shouldContinue){
                doTransition.call(this)
              }
            })
      return
    }

    return {
      agent: this,
      start: function(){ if(stopAgent){stopAgent = false; doTransition.call(this.agent);}},
      stop: function(){ stopAgent = true;}
    }
  }

  render() {
    let mp = this.props.mp
      , currentState = this.props.agent.currentState
      , x = mp.nodes[currentState].x
      , y = mp.nodes[currentState].y;
    return (
      <circle
        ref={(agentNode) => { this.agentNode = agentNode; }}
        fill="red"
        r="7"
        transform={`translate(${x}, ${y})`}
      ></circle> );
  }
}

function mapStateToProps(state, ownProps){
  return {
    agent: state.agent,
    mp: state.mc,
    isViewer: state.isViewer,
    values: state.r.values
  }
}
function mapDispatchToProps(dispatch){
  return {
    updateAgentState: (newState) => {
      dispatch(agentActions.update(newState))
    },
    updateValue: (value, index) => {
      dispatch(rActions.updateValue(value, index))
    },
    updateHistory: (history) => {
      dispatch(historyActions.updateHistory(history))
    },
    addEventToHistory: (event) => {
      dispatch(historyActions.addEvent(event))
    }
  }
}
export default connect(mapStateToProps, mapDispatchToProps)(Agent);
