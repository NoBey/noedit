import React, { Children, cloneElement, ReactNode, useEffect, useLayoutEffect, useState } from 'react';
import styles from './popper.module.less';

interface Props {
  children: JSX.Element;
  content: JSX.Element;
}

export function Popper({ children, content }) {
  const click = () => {};


  return (
    <span>
       {Children.map(children, child => {
          return cloneElement(child, {onClick: click})
       } ) }
    <div className={styles.content}>{content}</div>  
    </span>
  );
}
