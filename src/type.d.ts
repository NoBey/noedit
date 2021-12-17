declare module '*.modules.css' {
    const content: {[key: string]: any}
    export = content
  }
  // less模块声明
  declare module '*.modules.less' {
    const content: { [key: string]: any }
    export default content
  }