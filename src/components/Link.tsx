import React, { useEffect, useRef } from "react";

import utils from "../utils";
import type { Link as LinkType } from "../types/link";
import { MarkovProcessState } from "../types/markovProcessState";

interface LinkProps {
  link: LinkType<MarkovProcessState>;
}

const Link: React.FC<LinkProps> = ({ link }) => {
  const linkRef = useRef<SVGPathElement | null>(null);
  const textRef = useRef<SVGTextElement | null>(null);

  useEffect(() => {
    if (linkRef.current && textRef.current) {
      const len = linkRef.current.getTotalLength();
      const p = linkRef.current.getPointAtLength(0.5 * len);
      textRef.current.setAttribute(
        "transform",
        `translate(${p.x - 10}, ${p.y + 5})`,
      );
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
    </g>
  );
};

export default Link;
