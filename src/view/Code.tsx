import Prism from "prismjs";
import React, { forwardRef, LegacyRef, useEffect, useRef, useState } from "react";
import { path } from ".";
import { editor } from '../editor'
Prism.highlightAll();
import "prismjs/components/prism-latex";

// @ts-ignore
window.Prism = Prism;
import "prismjs/themes/prism.css";


import { Menu } from '../component'
import { getKatexHtml } from "../utils";

// https://mermaid-js.github.io/mermaid/#/
// http://flowchart.js.org/

function useStopBeforeinput(ref){
    useEffect(() => {
        const stop = (e) => e.stopPropagation()
        ref.current.addEventListener('beforeinput', stop)
    }, [])
}

function useStopClick(ref){
  useEffect(() => {
      const stop = (e) => e.stopPropagation()
      ref.current.addEventListener('click', stop)
  }, [])
}

const Tooltip = (props) => {
    const {lang, id} = props
    const ref = useRef<HTMLDivElement>()
    const inputRef = useRef<HTMLInputElement>()
    useStopBeforeinput(ref)
    useStopClick(inputRef)
    const [showMenu, setShowMenu] = useState(false)
    // const [lang, setLang] = useState(props.lang)
    const onFocus = () => setShowMenu(true)
    const onBlur = () => setShowMenu(false)

    const opts = Object.keys(Prism.languages)//.filter(a => a.indexOf(lang) !== -1)
    useEffect(() => {
      window.addEventListener('click', onBlur)
      return () =>  window.removeEventListener('click', onBlur)
    }, [])

    return <div ref={ref} className="code-tooltip"  onFocus={onFocus} contentEditable={false} >
        <input ref={inputRef} value={lang}  placeholder={'请选择语音'} />
       {showMenu && opts.length > 0 && <Menu opts={opts} style={{ top: '35px', left: '20px'}} onEnter={(lang) => {
           console.log({lang})
           if (id)  editor.model.updateBlockById(id, { lang })
          //  setShowMenu(false)
       } } />}
    </div>
}


export const MathCode = ({ text }) => {
  const html = Prism.highlight(
    text,
    Prism.languages.latex,
    'latex'
  );

  return <>
  {/* <code style={{position: 'absolute',top: 0, pointerEvents: 'none', userSelect: 'none' }} dangerouslySetInnerHTML={{ __html: html }} ></code> */}
  <code dangerouslySetInnerHTML={{ __html: html }}></code>
  <div className="block-math" contentEditable={false} dangerouslySetInnerHTML={{__html: getKatexHtml(text) }}></div>
  {/* <Tooltip {...props} /> */}
</>
}


export const Code = forwardRef((props: any, ref: LegacyRef<HTMLDivElement>) => {
  path.push(props.id);
    const [u, update] = useState(0)
    const forceUpdate = () => update(i => i+1)
  if(props.lang === 'math') return <div className="md-code md-math-block" ref={ref} ><MathCode {...props}  /></div>

  const html = Prism.highlight(
    props.text,
    Prism.languages[props.lang] || Prism.languages.text,
    props.lang || 'text'
  );
  return (
    <div className="md-code" ref={ref} >
      {/* <code style={{position: 'absolute',top: 0, pointerEvents: 'none', userSelect: 'none' }} dangerouslySetInnerHTML={{ __html: html }} ></code> */}
      <code dangerouslySetInnerHTML={{ __html: html }}></code>
      <Tooltip {...props} />
    </div>
  );
});
