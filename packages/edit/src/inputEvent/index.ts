import { EditorInterface } from '../editor'

export interface InputEventStrategy {
    accept(inputType: string, event?: InputEvent): boolean;
    execute(inputType: string, event?: InputEvent): boolean;
}

export * from './BaseInputEvent'
export * from './BlockquoteInputEvent'
export * from './ListInputEvent'
export * from './CodeInputEvent'
export * from './TableInputEvent'
export * from './HeadingInputEvent'
export * from './HrInputEvent'
