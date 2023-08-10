import React from "react";
import { Row, Col, Button } from "react-bootstrap";
import { MarkovProcess } from "../MarkovProcess";
import { MarkovRewardProcess } from "../MarkovRewardProcess";

const onClickSelect = function () {
  // inspired by http://stackoverflow.com/questions/22581345/click-button-copy-to-clipboard-using-jquery
  const elem = document.getElementById("export-link") as HTMLInputElement;
  let succeed: boolean = false;

  if (elem) {
    elem.focus();
    elem.setSelectionRange(0, elem.value.length);

    try {
      succeed = document.execCommand("copy");
    } catch (e) {}
  }
  return succeed;
};

interface MarkovProcessSelectProps {
  mp: MarkovProcess | MarkovRewardProcess;
  onClickUpdateMarkovType: (
    e: React.MouseEvent<HTMLButtonElement>,
    markovType: "mp" | "mrp",
  ) => void;
}

const MarkovProcessSelect: React.FC<MarkovProcessSelectProps> = ({
  mp,
  onClickUpdateMarkovType,
}) => {
  return (
    <Row>
      <Row>
        <h3>Markov process type:</h3>
      </Row>
      <Row>
        <Col>
          <Button
            disabled={mp.type === "mp"}
            size="sm"
            variant={mp.type === "mp" ? "primary" : "info"}
            type="button"
            onClick={(e) => {
              onClickUpdateMarkovType(e, "mp");
            }}
          >
            Markov process
          </Button>
        </Col>
        <Col>
          <Button
            disabled={mp.type === "mrp"}
            size="sm"
            variant={mp.type === "mrp" ? "primary" : "info"}
            type="button"
            onClick={(e) => {
              onClickUpdateMarkovType(e, "mrp");
            }}
          >
            Markov reward process
          </Button>
        </Col>
      </Row>
      <Row className="mt-2 mb-2">
        <Col id="export">
          <span className="m-2">Share: (click to copy)</span>
          <input
            id="export-link"
            value={
              window.location.origin +
              window.location.pathname +
              "?data=" +
              mp.export()
            }
            onClick={onClickSelect}
            readOnly
          />
        </Col>
      </Row>
    </Row>
  );
};

export default MarkovProcessSelect;
