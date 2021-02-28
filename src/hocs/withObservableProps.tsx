import { useState, useEffect } from "preact/hooks"
import { Observable, combineLatest } from "rxjs"

export type ObservableProps<PropType> = {
    [Key in keyof PropType as `${string & Key}$`]?: Observable<PropType[Key]>;
} & {props$?: Observable<PropType>}

export type ObservedProps<PropType> = PropType & {props?: PropType}

/*
    This HOC allows for the following cases:
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

        return props === undefined ? null : <Component {...finalProps}></Component>
    }