import React, { PureComponent } from "react";
import { connect } from "react-redux";
import { Col, Row, Button } from "react-bootstrap";

import Matrix from "./Matrix";

import * as mcActions from "../actions/mcActions";

class MarkovProcessProps extends PureComponent {
  componentDidUpdate() {
    if (this.props.mp.type === "mrp" || this.props.mp.type === "mdp") {
      this.gammaInput.value = this.props.mp.gamma;
      this.horizonInput.value = this.props.mp.horizon;
      this.epsilonInput.value = this.props.mp.epsilon;
    }
  }

  render() {
    let rewards, gamma, horizon, epsilon;
    if (this.props.mp.type === "mrp" || this.props.mp.type === "mdp") {
      rewards = (
        <div>
          <p>Rewards:</p>
          <Matrix mat={this.props.mp.rewards} />
        </div>
      );
      gamma = (
        <Col md={4}>
          Gamma:
          <input
            ref={(input) => {
              this.gammaInput = input;
            }}
            size="8"
            defaultValue={this.props.mp.gamma}
            onBlur={this.props.onBlurUpdateGamma}
          />
        </Col>
      );
      horizon = (
        <Col md={4}>
          Horizon:
          <input
            ref={(input) => {
              this.horizonInput = input;
            }}
            size="8"
            defaultValue={this.props.mp.horizon}
            onBlur={this.props.onBlurUpdateHorizon}
          />
        </Col>
      );
      epsilon = (
        <Col md={4}>
          Epsilon:
          <input
            ref={(input) => {
              this.epsilonInput = input;
            }}
            size="8"
            defaultValue={this.props.mp.epsilon}
            onBlur={this.props.onBlurUpdateEpsilon}
          />
        </Col>
      );
    }

    return (
      <Row className="panel panel-default">
        <p>Markov process property:</p>
        <Col md={12}>
          <Row>
            {gamma}
            {horizon}
            {epsilon}
          </Row>
        </Col>
        <Col md={12}>
          <Row>
            <p>Stochastic matrix:</p>
            <Col md={6}>
              <Button
                disabled={this.props.mp.nodes.length >= 10}
                size="sm"
                variant="primary"
                type="button"
                onClick={this.props.onClickAddState}
              >
                Add node +
              </Button>
            </Col>
            <Col md={6}>
              Determinant: {Math.floor(this.props.mp.det * 100000) / 100000}
            </Col>
            <Col md={12}>
              <Matrix mat={this.props.mp.P} />
            </Col>
          </Row>
        </Col>
        <Col md={12}>{rewards}</Col>
      </Row>
    );
  }
}

function mapStateToProps(state, ownProps) {
  return ownProps;
}
function mapDispatchToProps(dispatch) {
  return {
    onClickAddState: (e) => {
      dispatch(mcActions.addState());
    },
    onBlurUpdateGamma: (e) => {
      dispatch(mcActions.updateGamma(e.target.value));
    },
    onBlurUpdateHorizon: (e) => {
      dispatch(mcActions.updateHorizon(e.target.value));
    },
    onBlurUpdateEpsilon: (e) => {
      dispatch(mcActions.updateEpsilon(e.target.value));
    },
  };
}
export default connect(mapStateToProps, mapDispatchToProps)(MarkovProcessProps);
