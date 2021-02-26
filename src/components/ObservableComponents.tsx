
import { Alert, Input, Select, Table } from "antd"
import { Form, Message } from "semantic-ui-react"
import { withObservableProps, withSubjectAsOnChange } from "../util"

export const ObservableFormInput = withSubjectAsOnChange(withObservableProps(Form.Input))

export const ObservableSearch = withObservableProps(Input.Search)

export const ObservableTable = withObservableProps(Table)

export const ObservableFormDropdown = withSubjectAsOnChange(withObservableProps(Form.Dropdown))

export const ObservableMessage = withObservableProps(Message)

export const ObservableSelect = withObservableProps(Select)

export const ObservableAlert = withObservableProps(Alert)