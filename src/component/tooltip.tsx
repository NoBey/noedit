import React from "react";
import { render, unmountComponentAtNode } from "react-dom";
import styles from "./tooltip.module.less";


export function Tooltip({ top = 0, left = 0, html }){
    return <span className={styles.tooltip} style={{top: `${top}px`, left: `${left}px`}} dangerouslySetInnerHTML={{__html: html}}>
    </span>
}


export function openTooltip(dom: HTMLDivElement, html){
    if(!html) return
    const div = document.createElement('div')
    document.body.appendChild(div)
    const { offsetTop: y, offsetLeft: x, offsetHeight: h, offsetWidth: w } = dom 
    // const {x, y, height, width} = dom.getBoundingClientRect()

    function close(e){
            let target = e.target as Element
            while(target){
                if(target === dom) return
                target = target.parentElement
            }
            unmountComponentAtNode(div)
            div.remove()
            window.removeEventListener('click', close)
    }
    window.addEventListener('click', close)

    
    render(<Tooltip top={y + h} left={x + w/2} html={html} />, div)
}

// @ts-ignore
window.openTooltip = openTooltip