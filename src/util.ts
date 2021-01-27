import React from "react"
import { Observable } from "rxjs"
import useObservable from "./hooks/useObservable"

export const withObservableProps = <T, E>(componentClass: React.ComponentClass<T, E>) => ({prop$}: {prop$: Observable<T>}) => {
    const props = useObservable(prop$, [prop$])
    return (
        React.createElement(componentClass, props)
    )
}