import { Subject } from "rxjs"

    
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