import React from "react";
import PropTypes from "prop-types";

import { Row, Col, Button } from "react-bootstrap";

let onClickSelect = function (e) {
  // inspired by http://stackoverflow.com/questions/22581345/click-button-copy-to-clipboard-using-jquery
  let elem = document.getElementById("exportLink"),
    succeed;

  elem.focus();
  elem.setSelectionRange(0, elem.value.length);

  try {
    succeed = document.execCommand("copy");
  } catch (e) {
    succeed = false;
  }
  return succeed;
};

const MarkovProcessSelect = ({ mp, onClickUpdateMarkovType }) => {
  return (
    <Row className="panel panel-default">
      <p>Markov process type:</p>
      <Col md={6}>
        <Button
          disabled={mp.type === "mp"}
          size="small"
          variant={mp.type === "mp" ? "primary" : "info"}
          type="button"
          onClick={(e) => {
            onClickUpdateMarkovType(e, "mp");
          }}
        >
          Markov process (or chain)
        </Button>
      </Col>
      <Col md={6}>
        <Button
          disabled={mp.type === "mrp"}
          size="small"
          variant={mp.type === "mrp" ? "primary" : "info"}
          type="button"
          onClick={(e) => {
            onClickUpdateMarkovType(e, "mrp");
          }}
        >
          Markov reward process
        </Button>
      </Col>
      <Col md={12} id="export">
        Share:
        <input
          id="exportLink"
          value={
            window.location.origin +
            window.location.pathname +
            "?data=" +
            mp.export()
          }
          onClick={onClickSelect}
          readOnly
        />
        (click to copy)
      </Col>
    </Row>
  );
};
MarkovProcessSelect.propTypes = {
  mp: PropTypes.object.isRequired,
  onClickUpdateMarkovType: PropTypes.func.isRequired,
};

export default MarkovProcessSelect;
