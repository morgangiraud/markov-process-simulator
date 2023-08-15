import React from "react";
import { Button, Row } from "react-bootstrap";
import { HistoryState } from "../types/historyState";
import { RootState } from "../reducers";
import { Dispatch } from "redux";
import * as historyActions from "../actions/historyActions";
import { ConnectedProps, connect } from "react-redux";

const mapStateToProps = (state: RootState) => ({
  history: state.history,
});

function mapDispatchToProps(dispatch: Dispatch) {
  return {
    updateHistory: (history: HistoryState) => {
      dispatch(historyActions.updateHistory(history));
    },
  };
}

const connector = connect(mapStateToProps, mapDispatchToProps);

type PropsFromRedux = ConnectedProps<typeof connector>;

const History: React.FC<PropsFromRedux> = ({ history, updateHistory }) => {
  return (
    <Row className="d-flex align-items-center m-2">
      <div className="d-flex align-items-center">
        <Button className="mr-3" onClick={() => updateHistory([])}>
          Clear
        </Button>
        <div className="d-flex flex-wrap flex-grow-1">
          <span className="m-2">History:</span>
          {history.map((event, key) => (
            <span key={key}>
              <span style={{ color: event.stroke }}>{event.value}</span>
              {key === history.length - 1 ? "" : ", "}
            </span>
          ))}
        </div>
      </div>
    </Row>
  );
};

export default connector(History);
