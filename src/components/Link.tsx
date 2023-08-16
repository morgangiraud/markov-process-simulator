import React, { useEffect, useRef } from "react";

import utils from "../utils";
import type { Link as LinkType } from "../types/link";
import { MarkovProcessState } from "../types/markovProcessState";
import { text } from "stream/consumers";

interface LinkProps {
  link: LinkType<MarkovProcessState>;
}

const Link: React.FC<LinkProps> = ({ link }) => {
  const linkRef = useRef<SVGPathElement | null>(null);
  const textRef = useRef<SVGTextElement | null>(null);
  const circleRef = useRef<SVGCircleElement | null>(null);
  const lineRef = useRef<SVGLineElement | null>(null);

  useEffect(() => {
    if (linkRef.current && textRef.current) {
      const len = linkRef.current.getTotalLength();
      const pStart = linkRef.current.getPointAtLength(0);
      const pText = linkRef.current.getPointAtLength(Math.min(30, len));
      const pAngle = Math.atan2(pStart.y - pText.y, pStart.x - pText.x);
      const perpendicularAngle = pAngle - Math.PI / 2;

      const p = {
        x:
          pText.x +
          Math.cos(perpendicularAngle) * 20 -
          textRef.current.getBBox().width / 2,
        y: pText.y + Math.sin(perpendicularAngle) * 20,
      };
      textRef.current.setAttribute("transform", `translate(${p.x}, ${p.y})`);

      if (circleRef.current) {
        circleRef.current.setAttribute(
          "transform",
          `translate(${pText.x}, ${pText.y})`,
        );
      }
      if (lineRef.current) {
        lineRef.current.setAttribute("x1", `${pText.x}`);
        lineRef.current.setAttribute("y1", `${pText.y}`);
        lineRef.current.setAttribute(
          "x2",
          `${pText.x + Math.cos(perpendicularAngle) * 200}`,
        );
        lineRef.current.setAttribute(
          "y2",
          `${pText.y + Math.sin(perpendicularAngle) * 200}`,
        );
      }
    }
  }, [link]);

  return (
    <g className={link.class}>
      <path
        ref={linkRef}
        id={`path-${link.source.data.name}-${link.target.data.name}`}
        markerEnd="url(#arrow)"
        strokeWidth={link.p * 10 + 1}
        stroke={utils.getColor(link.source.data)}
        fill="none"
        d={utils.createD(link)}
      ></path>
      <text ref={textRef}>{Math.floor(link.p * 100) / 100}</text>
      {/* <circle ref={circleRef} fill="red" r="7"></circle>
      <line ref={lineRef} stroke="red"></line> */}
    </g>
  );
};

export default Link;
