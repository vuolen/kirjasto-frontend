
import { Form, Input, Message, Table } from "semantic-ui-react"
import { withObservableProps, withSubjectAsOnChange } from "../util"

export const ObservableFormInput = withSubjectAsOnChange(withObservableProps(Form.Input))

export const ObservableInput = withSubjectAsOnChange(withObservableProps(Input))

export const ObservableTableBody = withObservableProps(Table.Body)

export const ObservableMessage = withObservableProps(Message)
