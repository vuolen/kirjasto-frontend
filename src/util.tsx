import { useEffect, useState } from "preact/compat"
import React from "react"
import { combineLatest, isObservable, merge, observable, Observable, of, Subject } from "rxjs"
import { startWith } from "rxjs/operators"
import { isArrayLiteralExpression } from "typescript"
import useObservable from "./hooks/useObservable"

export type ObservableProps<PropType> = {
    [Key in keyof PropType as `${string & Key}$`]?: Observable<PropType[Key]>;
} & {props$?: Observable<PropType>}

export type ObservedProps<PropType> = PropType & {props?: PropType}

/*
    This HOC allows the following cases:
    1) Passing a prop normally
    2) Passing a prop as an observable
    3) Passing multiple props as an observable of an object
    4) Any mix of the previous three

    Every normal prop gets a duplicate prop with "$" appended to the end:
    For example a component with the prop "colour" now has a new prop "colour$", which
    takes an observable of the values "colour" normally receives.

    If for example you'd like to always update the size of the component along with the colour,
    you could pass in the prop `prop$` which takes an observable of an object,
    eg. `{colour: "blue", size: "large"}`
    PLEASE NOTE THAT AT THE MOMENT THIS DOES CLASH IF YOUR BASE COMPONENT HAS A 
    PROP NAMED "props"

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
            {normalProps: {} as P, observableProps: {} as ObservableProps<P> & {props?: Observable<P>}}
        )

        const [finalProps, setFinalProps] = useState(normalProps)

        useEffect(() => {
            const subscription = combineLatest(observableProps).subscribe(
                ({props, ...observedProps}) => {
                    setFinalProps({...normalProps, ...observedProps, ...(props !== undefined ? props : {})})
                }
            )

            return () => subscription.unsubscribe()
        }, Object.values(observableProps))

        console.log(finalProps)

        return props === undefined ? null : <Component {...finalProps}></Component>
    }
    
/*
    This HOC allows you to pass a subject as the `onChange` callback to a component.
    This subject receives a value every time the base component triggers its `onChange` event.
    Currently this overrides the original prop, which means you cannot pass in both a function
    and a subject.
*/
export const withSubjectAsOnChange = <P,>(Component: React.ComponentType<P>): React.FC<Omit<P, "onChange"> & {onChange?: Subject<any>}> => 
    ({onChange, ...rest}) => {
        return <Component 
            onChange={(...args: any[]) => onChange ? onChange.next(args) : undefined}
            {...rest as P}></Component>
    }