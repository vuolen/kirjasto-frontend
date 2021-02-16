import { useEffect, useState } from "preact/compat"
import React from "react"
import { combineLatest, isObservable, merge, observable, Observable, of, Subject } from "rxjs"
import { startWith } from "rxjs/operators"
import { isArrayLiteralExpression } from "typescript"
import useObservable from "./hooks/useObservable"

export type ObservableProps<PropType> = {
    [Key in keyof PropType as `${string & Key}$`]: Observable<PropType[Key]>;
} & {prop$?: Observable<PropType>}

export type ObservedProps<PropType> = PropType & {prop?: PropType}

/*
    This HOC allows the following cases:
    1) Passing a prop normally
    2) Passing a prop as an observable
    3) Passing multiple props as an observable of a prop
    4) Any mix of the previous three

    Every normal prop gets a duplicate prop with "$" appended to the end:
    For example a component with the prop "colour" now has a new prop "colour$", which
    takes an observable of the values "colour" normally receives.

    If the same prop is defined in multiple cases, the precedence is the same as the previous list's order
*/
export const withObservableProps = <P,>(Component: React.ComponentType<P>): React.FC<P & ObservableProps<P>> => 
    (props) => {
        const {normalProps, observableProps} = Object.entries(props).reduce(
            (obj, [key, value]) => {
                if (key.endsWith("$")) {
                    return {
                        ...obj,
                        observableProps: {
                            ...obj.observableProps,
                            [key.slice(0, -1)]: value
                        }
                    }
                } else {
                    return {
                        ...obj,
                        normalProps: {
                            ...obj.normalProps,
                            [key]: value
                        }
                    }
                }
            },
            {normalProps: {} as P, observableProps: {} as ObservableProps<P> & {prop?: Observable<P>}}
        )

        const [finalProps, setFinalProps] = useState(normalProps)

        useEffect(() => {
            const subscription = combineLatest(observableProps).subscribe(
                ({prop, ...observedProps}) => {
                    setFinalProps({...normalProps, ...observedProps, ...(prop !== undefined ? prop : {})})
                }
            )

        }, Object.values(observableProps))

        return props === undefined ? null : <Component {...finalProps}></Component>
    }
    

export const withSubjectAsOnChange = <P,>(Component: React.ComponentType<P>): React.FC<Omit<P, "onChange"> & {onChange?: Subject<any>}> => 
    ({onChange, ...rest}) => (
        <Component 
            onChange={(_: any, data: any) => onChange ? onChange.next(data.value) : undefined} 
            {...rest as P}></Component>
    )