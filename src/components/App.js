import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { Grid, Col } from 'react-bootstrap';

import Graph from './Graph'
import Dashboard from './Dashboard'
import History from './History'

import * as rActions from "../actions/rActions"

class App extends PureComponent {
  componentDidMount(){
    if(this.props.mc.type !== "mp"){
      this.props.initValues(this.props.mc.rewards.length)
    } 
  }

  componentDidUpdate(prevProps){
    if(prevProps.mc !== this.props.mc && this.props.mc.type !== "mp"){
      this.props.initValues(this.props.mc.rewards.length)
    } 
  }
  
  render() {
    return (
      <Grid id="App" fluid={true}>
        { !this.props.isViewer ? <Dashboard /> : null }
        <Col id="graph" xs={12} md={ this.props.isViewer ? 12 : 6}>
          <History width={500} height={40} history={this.props.history}/>
          <Graph width={500} height={500}/>
        </Col>
      </Grid>
    );
  }
}

function mapStateToProps(state){
  return {
    mc: state.mc,
    isViewer:state.isViewer,
    history: state.history,
  }
}
function mapDispatchToProps(dispatch){
  return {
    initValues: (rewardsLen) => {
      dispatch(rActions.initValues(rewardsLen))
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(App);