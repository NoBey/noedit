
declare module '*.module.css' {
  const content: { [key: string]: any };
  export default content;
}
declare module '*.module.less' {
  const content: { [key: string]: any };
  export default content;
}

declare module '*.css' {
  const content: { [key: string]: any };
  export = content;
}
declare module '*.less' {
  const content: { [key: string]: any };
  export default content;
}

declare module '*.md' {
  const content: string;
  export default content;
}
