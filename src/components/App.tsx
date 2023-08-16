import React, { useEffect } from "react";
import { connect, ConnectedProps } from "react-redux";
import Row from "react-bootstrap/Row";
import Container from "react-bootstrap/Container";

import Graph from "./Graph";
import Dashboard from "./Dashboard";
import History from "./History";

import * as rActions from "../actions/rActions";
import { MarkovRewardProcess } from "../MarkovRewardProcess";
import { RootState } from "../reducers";
import { Dispatch } from "redux";
import AgentDashboard from "./AgentDashboard";

const mapStateToProps = (state: RootState) => ({
  mp: state.mp,
  isViewer: state.isViewer,
});

const mapDispatchToProps = (dispatch: Dispatch) => ({
  initValues: (rewardsLen: number) => {
    dispatch(rActions.initValues(rewardsLen));
  },
});

const connector = connect(mapStateToProps, mapDispatchToProps);

type PropsFromRedux = ConnectedProps<typeof connector>;

const App: React.FC<PropsFromRedux> = ({ mp, isViewer, initValues }) => {
  useEffect(() => {
    if (mp instanceof MarkovRewardProcess) {
      initValues(mp.rewards.length);
    }
  }, [mp]);

  return (
    <Container fluid id="App" className="m-2">
      <h1>Markov process simulator</h1>
      <Row>
        {!isViewer && <Dashboard />}
        <AgentDashboard />
        <Row className="mt-4">
          <History />
          <Graph width={800} height={800} />
        </Row>
      </Row>
    </Container>
  );
};

export default connector(App);
