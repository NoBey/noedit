import React, { ReactPropTypes, useEffect, useState } from 'react';

const CDN_URL =  "//at.alicdn.com/t/font_3114948_h2a4tgipypo.js";

function createStyle() {
  const style = document.createElement('style');
  style.innerHTML = `.icon {
        width: 1em; height: 1em;
        vertical-align: -0.15em;
        fill: currentColor;
        overflow: hidden;
     }`;

  return style;
}

function createUrl() {
  const script = document.createElement('script');
  script.src = CDN_URL;
  return script;
}

const styleTag = createStyle();
const cdnUrlTag = createUrl();

let actives = 0;

interface Props {
  type?: string;
  size?: number;
  onClick?: (e?:any) => void;
}

export function Icon({ type, size = 16, onClick = () => {} }: Props) {
  useEffect(() => {
    if (actives === 0) {
      document.head.appendChild(styleTag);
      document.head.appendChild(cdnUrlTag);
    }
    actives++;
    return () => {
      actives--;
      if (actives === 0) {
        document.head.removeChild(styleTag);
        document.head.removeChild(cdnUrlTag);
      }
    };
  }, []);

  return (
    <span style={{ fontSize: `${size}px` }} onClick={onClick}>
      <svg className="icon" aria-hidden="true">
        <use xlinkHref={`#icon-${type}`}></use>
      </svg>
    </span>
  );
}
