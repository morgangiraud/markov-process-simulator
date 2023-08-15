import React from "react";
import { ConnectedProps, connect } from "react-redux";
import { Dispatch } from "redux";
import { Button } from "react-bootstrap";

import * as mcActions from "../actions/mcActions";
import MatrixRow from "./MatrixRow";
import { RootState } from "../reducers";
import { isVec } from "../utils";

export const unitSize = 45;

interface OwnProps {
  vecOrMat: number[][] | number[];
}

function mapStateToProps(state: RootState, ownProps: OwnProps) {
  return ownProps;
}

function mapDispatchToProps(dispatch: Dispatch) {
  return {
    updateProba: (i: number, j: number, value: number) => {
      dispatch(mcActions.updateProba(i, j, value));
    },
    updateReward: (i: number, j: number, value: number) => {
      if (i !== 0) {
        throw new Error("i must be 0");
      }
      dispatch(mcActions.updateReward(j, value));
    },
    removeMarkovState: (
      e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
      i: number,
    ) => {
      e.preventDefault();
      dispatch(mcActions.removeMarkovState(i));
    },
  };
}

const connector = connect(mapStateToProps, mapDispatchToProps);

type PropsFromRedux = ConnectedProps<typeof connector>;

const Matrix: React.FC<PropsFromRedux> = ({
  vecOrMat,
  updateProba,
  updateReward,
  removeMarkovState,
}) => {
  let nbCols: number, nbRows: number, rows;
  if (isVec(vecOrMat)) {
    nbRows = 1;
    nbCols = vecOrMat.length;
    rows = (
      <MatrixRow rowIndex={0} pi={vecOrMat} y={0} cellCallback={updateReward} />
    );
  } else {
    nbRows = vecOrMat.length;
    nbCols = vecOrMat[0].length;
    rows = vecOrMat.map((pi, i) => (
      <MatrixRow
        key={i}
        rowIndex={i}
        pi={pi}
        y={unitSize * i}
        cellCallback={updateProba}
      />
    ));
  }

  return (
    <div>
      {nbRows > 1 && vecOrMat.length > 1 && (
        <div style={{ float: "left" }}>
          {vecOrMat.map((pi, i) => (
            <Button
              style={{ display: "block", height: unitSize }}
              key={i}
              size="sm"
              type="button"
              onClick={(e) => removeMarkovState(e, i)}
            >
              -
            </Button>
          ))}
        </div>
      )}
      <svg width={unitSize * nbCols} height={unitSize * nbRows}>
        <g className="matrix">{rows}</g>
      </svg>
    </div>
  );
};

export default connector(Matrix);
