import React from "react";
import { ConnectedProps, connect } from "react-redux";
import { Dispatch } from "redux";
import { Button } from "react-bootstrap";

import * as mcActions from "../actions/mcActions";
import MatrixRow from "./MatrixRow";
import { RootState } from "../reducers";

export const unitSize = 45;

interface OwnProps {
  mat: number[][] | number[];
}

function mapStateToProps(state: RootState, ownProps: OwnProps) {
  return ownProps;
}

function mapDispatchToProps(dispatch: Dispatch) {
  return {
    updateProba: (i: number, j: number, value: number) => {
      dispatch(mcActions.updateProba(i, j, value));
    },
    updateReward: (j: number, value: number) => {
      dispatch(mcActions.updateReward(j, value));
    },
    removeState: (
      e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
      i: number,
    ) => {
      e.preventDefault();
      dispatch(mcActions.removeState(i));
    },
  };
}

const connector = connect(mapStateToProps, mapDispatchToProps);

type PropsFromRedux = ConnectedProps<typeof connector>;

const Matrix: React.FC<PropsFromRedux> = ({
  mat,
  updateProba,
  updateReward,
  removeState,
}) => {
  let nbRows = mat.length,
    nbCols = Array.isArray(mat[0]) ? mat[0].length : 0,
    buttons,
    rows;

  if (nbCols === 0) {
    nbCols = mat.length;
    nbRows = 1;
    rows = (
      <MatrixRow
        rowIndex={0}
        pi={mat as number[]}
        y={0}
        cellCallback={updateReward}
      />
    );
    buttons = [];
  } else {
    rows = (mat as number[][]).map((pi, i) => (
      <MatrixRow
        key={i}
        rowIndex={i}
        pi={pi}
        y={unitSize * i}
        cellCallback={updateProba}
      />
    ));

    buttons = (
      <div style={{ float: "left" }}>
        {mat.map((pi, i) => (
          <Button
            style={{ display: "block", height: unitSize }}
            key={i}
            size="sm" // changed from "xsmall" to "sm" as "xsmall" might not be a valid size in some versions of react-bootstrap
            type="button"
            onClick={(e) => removeState(e, i)}
          >
            -
          </Button>
        ))}
      </div>
    );
  }

  return (
    <div>
      {buttons}
      <svg width={unitSize * nbCols} height={unitSize * nbRows}>
        <g className="matrix">{rows}</g>
      </svg>
    </div>
  );
};

export default connector(Matrix);
