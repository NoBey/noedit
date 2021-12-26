import React, { useEffect, useLayoutEffect, useState } from "react";
import styles from "./menu.module.less";

export function Menu({ style = {}, onEnter = (value) => {}, opts = [] }) {
  // const [list] = useState(test);
  // const [index, setIndex] = useState(0);
  // useEffect(() => {
  //   const scrollIntoView = (i) =>
  //     document
  //       .querySelectorAll(`.${styles.item}`)
  //       ?.[i]?.scrollIntoViewIfNeeded();

  //   scrollIntoView(index);
  // }, [index]);
  // useLayoutEffect(() => {
  //   const down = () => setIndex((i) => (i >= opts.length ? 0 : i + 1));
  //   const up = () => setIndex((i) => i && i - 1);
  //   const keydown = (e) => {
  //     if (e.key === "ArrowDown") down();
  //     if (e.key === "ArrowUp") up();
  //     if (e.key === 'Enter') onEnter((document.querySelector(`.${styles["item-active"]}`) as HTMLDivElement)?.innerText )
  //   };
  //   window.addEventListener("keydown", keydown);
  //   return () => window.removeEventListener("keydown", keydown);
  // }, []);

  return (
    <div className={styles.memu} style={style}>
      {opts.map((v, i) => (
        <div
          key={i}
          onClick={() => {
            console.log(v);
            onEnter(v);
          }}
          className={styles.item}
          // className={
          //   styles.item + (i === index ? ` ${styles["item-active"]}` : "")
          // }
        >
          {v}
        </div>
      ))}
    </div>
  );
}
