
export function deleteContents(){
    window.getSelection().getRangeAt(0).deleteContents();
}






export default { deleteContents }