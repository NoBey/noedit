import React, { useEffect, useLayoutEffect, useState } from "react";
import styles from "./menu.module.less";

const test = [
  1, 2, 4, 5, 6, 7, 88, 8995, 5445, 1, 2, 4, 5, 6, 7, 88, 8995, 5445, 1, 2, 4,
  5, 6, 7, 88, 8995, 5445,
];
export function Menu() {
  const [list] = useState(test);
  const [index, setIndex] = useState(0);
  useEffect(() => {
    const scrollIntoView = (i) =>
      document
        .querySelectorAll(`.${styles.item}`)
        ?.[i]?.scrollIntoViewIfNeeded();
        
    scrollIntoView(index);
  }, [index]);
  useLayoutEffect(() => {
    const down = () => setIndex((i) => (i >= list.length ? 0 : i + 1));
    const up = () => setIndex((i) => i && i - 1);
    const keydown = (e) => {
      console.log(e.key);
      if (e.key === "ArrowDown") down();
      if (e.key === "ArrowUp") up();
    };
    window.addEventListener("keydown", keydown);
    return () => window.removeEventListener("keydown", keydown);
  }, []);

  return (
    <div className={styles.memu}>
      {list.map((v, i) => (
        <div
          className={
            styles.item + (i === index ? ` ${styles["item-active"]}` : "")
          }
        >
          {v}
        </div>
      ))}
    </div>
  );
}
