import React, { useRef } from "react";
import { ConnectedProps, connect } from "react-redux";
import { Col, Row, Button } from "react-bootstrap";

import Matrix from "./Matrix";

import * as mcActions from "../actions/mcActions";
import { Dispatch } from "redux";
import { RootState } from "../reducers";
import { MarkovRewardProcess } from "../MarkovRewardProcess";

function mapStateToProps(state: RootState) {
  return {
    mp: state.mp,
  };
}

function mapDispatchToProps(dispatch: Dispatch) {
  return {
    onClickAddState: () => {
      dispatch(mcActions.addState({}, []));
    },
    onBlurUpdateGamma: (e: React.FocusEvent<HTMLInputElement>) => {
      dispatch(mcActions.updateGamma(parseFloat(e.target.value)));
    },
    onBlurUpdateHorizon: (e: React.FocusEvent<HTMLInputElement>) => {
      dispatch(mcActions.updateHorizon(parseFloat(e.target.value)));
    },
    onBlurUpdateEpsilon: (e: React.FocusEvent<HTMLInputElement>) => {
      dispatch(mcActions.updateEpsilon(parseFloat(e.target.value)));
    },
  };
}

const connector = connect(mapStateToProps, mapDispatchToProps);

type PropsFromRedux = ConnectedProps<typeof connector>;

const MarkovProcessPropsComponent: React.FC<PropsFromRedux> = ({
  mp,
  onClickAddState,
  onBlurUpdateGamma,
  onBlurUpdateHorizon,
  onBlurUpdateEpsilon,
}) => {
  const gammaInputRef = useRef<HTMLInputElement>(null);
  const horizonInputRef = useRef<HTMLInputElement>(null);
  const epsilonInputRef = useRef<HTMLInputElement>(null);

  // useEffect(() => {
  //   if (mp instanceof MarkovRewardProcess) {
  //     if (gammaInput.current) gammaInput.current = mp.gamma;
  //     if (horizonInput.current) horizonInput.current = mp.horizon;
  //     if (epsilonInput.current) epsilonInput.current = mp.epsilon;
  //   }
  // }, [mp]);

  return (
    <Row className="m-2">
      <h3>Markov process property:</h3>
      <Col>
        <Row>
          <p>Stochastic matrix:</p>
          <Col>
            <Button
              disabled={mp.states.length >= 10}
              size="sm"
              variant="primary"
              type="button"
              onClick={onClickAddState}
            >
              Add node +
            </Button>
          </Col>
          <Col>Determinant: {Math.floor(mp.det * 100000) / 100000}</Col>
          <Col md={12}>
            <Matrix mat={mp.P} />
          </Col>
        </Row>
      </Col>
      {mp instanceof MarkovRewardProcess && (
        <Col>
          <Row>
            <Col>
              <p>Gamma:</p>
              <input
                ref={gammaInputRef}
                size={8}
                defaultValue={mp.gamma}
                onBlur={onBlurUpdateGamma}
              />
            </Col>
            <Col>
              <p>Horizon:</p>
              <input
                ref={horizonInputRef}
                size={8}
                defaultValue={mp.horizon}
                onBlur={onBlurUpdateHorizon}
              />
            </Col>
            <Col>
              <p>Epsilon:</p>
              <input
                ref={epsilonInputRef}
                size={8}
                defaultValue={mp.epsilon}
                onBlur={onBlurUpdateEpsilon}
              />
            </Col>
            {mp instanceof MarkovRewardProcess && (
              <Col>
                <div>
                  <p>Rewards:</p>
                  <Matrix mat={mp.rewards} />
                </div>
              </Col>
            )}
          </Row>
        </Col>
      )}
    </Row>
  );
};

export default connector(MarkovProcessPropsComponent);
