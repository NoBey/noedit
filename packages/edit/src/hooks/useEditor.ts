import { createContext, useContext } from "react";
import { EditorInterface } from "../editor";


export const EditorContext = createContext<EditorInterface | null>(null)

export function useEditor() {
    const editor = useContext(EditorContext)

    if (!editor) {
        throw new Error(
            `The \`useEditor\` hook must be used inside the <Editor> component's context.`
        )
    }

    return editor
}