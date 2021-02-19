
import { Alert, Input, Select } from "antd"
import { Form, Message, Table } from "semantic-ui-react"
import { withObservableProps, withSubjectAsOnChange } from "../util"

export const ObservableFormInput = withSubjectAsOnChange(withObservableProps(Form.Input))

export const ObservableSearch = withObservableProps(Input.Search)

export const ObservableTableBody = withObservableProps(Table.Body)

export const ObservableFormDropdown = withSubjectAsOnChange(withObservableProps(Form.Dropdown))

export const ObservableMessage = withObservableProps(Message)

export const ObservableSelect = withObservableProps(Select)

export const ObservableAlert = withObservableProps(Alert)