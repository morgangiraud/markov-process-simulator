import React, { MouseEventHandler } from "react";
import { unitSize } from "./Matrix";

interface MatrixRowProps {
  rowIndex: number;
  pi: number[];
  y: number;
  cellCallback: (rowIndex: number, colIndex: number, value: number) => void;
}

const MatrixRow: React.FC<MatrixRowProps> = ({
  rowIndex,
  pi,
  y,
  cellCallback,
}) => {
  const rows = pi.map((value, colIndex) => {
    const onMouseDown: MouseEventHandler<SVGElement> = (mouseDownEvent) => {
      mouseDownEvent.preventDefault();
      mouseDownEvent.stopPropagation();

      const startY = mouseDownEvent.nativeEvent.pageY;
      const onMouseMove = (mouseMoveEvent: globalThis.MouseEvent) => {
        let dy = (startY - mouseMoveEvent.pageY) / 40;
        if (isNaN(dy)) {
          dy = 0;
        }

        cellCallback(rowIndex, colIndex, value + dy);
      };

      window.addEventListener("mousemove", onMouseMove, false);
      window.addEventListener("mouseup", (mouseUpEvent) => {
        mouseUpEvent.preventDefault();
        mouseUpEvent.stopPropagation();
        window.removeEventListener("mousemove", onMouseMove);
        return;
      });
    };

    return (
      <g
        key={y + "" + colIndex}
        transform={`translate(${unitSize * colIndex + unitSize / 2}, ${
          y + unitSize / 2
        })`}
        onMouseDown={onMouseDown}
      >
        <rect
          x={-unitSize / 2}
          y={-unitSize / 2}
          width={unitSize}
          height={unitSize}
          stroke="black"
          strokeWidth="2"
          fill="white"
        ></rect>
        <text textAnchor="middle" dominantBaseline="central">
          {Math.floor(value * 1000) / 1000}
        </text>
      </g>
    );
  });

  return <g>{rows}</g>;
};

export default MatrixRow;
