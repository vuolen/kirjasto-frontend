
import { Alert, Input, Select, Table } from "antd"
import { withObservableProps } from "../hocs/withObservableProps"

export const ObservableSearch = withObservableProps(Input.Search)

export const ObservableTable = withObservableProps(Table)

export const ObservableSelect = withObservableProps(Select)

export const ObservableAlert = withObservableProps(Alert)