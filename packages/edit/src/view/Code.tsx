import Prism from "prismjs";
import React, { forwardRef, LegacyRef, useEffect, useRef, useState } from "react";
import { path } from ".";
import { editor } from '../editor'
Prism.highlightAll();
import "prismjs/components/prism-latex";
import "prismjs/components/prism-python";
import "prismjs/components/prism-java";
import "prismjs/components/prism-typescript";
import "prismjs/components/prism-bash";
import "prismjs/components/prism-json";
import "prismjs/components/prism-flow";
import "prismjs/components/prism-markdown";


import mermaid from 'mermaid'

// mermaid.mermaidAPI.render()
// @ts-ignore
window.mermaid = mermaid;
// @ts-ignore
window.Prism = Prism;
import "prismjs/themes/prism.css";


import { Menu } from '../component'
import { getKatexHtml } from "../utils";
import flowchart from 'flowchart.js'

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
        <input ref={inputRef} readOnly value={lang}  placeholder={'请选择语音'} />
       {showMenu && opts.length > 0 && <Menu opts={opts} style={{ top: '35px', left: '20px'}} onEnter={(lang) => {
           console.log({lang})
           if (id)  editor.model.updateBlockById(id, { lang })
          //  setShowMenu(false)
       } } />}
    </div>
}


export const MathCode = ({ text }) => {
  const html = Prism.highlight(
    text || '\n',
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

export const FlowCode = (props) => {
  const { text } = props
  const html = Prism.highlight(
    text,
    Prism.languages.flow,
    'flow'
  );
  const flow = flowchart.parse(text)
  const div = document.createElement('div')
  try{
    flow.drawSVG(div)
  }catch(error){
    div.innerText = error.message
  }

  return <>
  <Tooltip {...props} />
  {/* <code style={{position: 'absolute',top: 0, pointerEvents: 'none', userSelect: 'none' }} dangerouslySetInnerHTML={{ __html: html }} ></code> */}
  <code dangerouslySetInnerHTML={{ __html: html }}></code>
  <div className="block-flow" contentEditable={false} dangerouslySetInnerHTML={{__html:  div.innerHTML }}></div>
</>
}

 
export const Code = forwardRef((props: any, ref: LegacyRef<HTMLDivElement>) => {
  path.push(props.id);
    const [u, update] = useState(0)
    const forceUpdate = () => update(i => i+1)
  if(props.lang === 'math') return <div className="md-code md-math-block" ref={ref} ><MathCode {...props}  /></div>
  if(props.lang === 'flow') return <div className="md-code md-flow-block" ref={ref} ><FlowCode {...props}  /></div>

  const html = Prism.highlight(
    props.text || '\n',
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
