import { AlertProps, Button, Form, Input } from "antd"
import * as O from "fp-ts-rxjs/Observable"
import * as OE from "fp-ts-rxjs/ObservableEither"
import { pipe } from "fp-ts/lib/function"
import React from "react"
import { Observable, Subject } from "rxjs"
import { concatMap } from "rxjs/operators"
import { AuthenticatedApi } from "../api"
import useObservable from "../hooks/useObservable"
import { Loading } from "./Loading"
import { ObservableAlert, ObservableSelect } from "./ObservableComponents"

const AddBook = ({api$}: {api$: Observable<Pick<AuthenticatedApi, "addBook" | "getAuthors">>}) => {
    const api = useObservable(api$, [api$])
    const [form] = Form.useForm()

    if (api === undefined) {
        return <Loading />
    }

    const {addBook, getAuthors} = api

    const submit$ = new Subject<any>()

    const response$ = submit$.pipe(
        concatMap(({title, author}) => {
            return addBook({
                title,
                // TODO: make more elegant
                author: author === undefined ? undefined : typeof author[0] === "number" ? author[0] : {name: author[0]}
            })
        }),
    )

    const messageProps$ = pipe(
        response$,
        OE.fold(
            err => O.of({message: err, type: "error" as AlertProps["type"], style: {}}),
            res => {
                form.resetFields()
                return O.of({message: "Book added successfully", type: "success" as AlertProps["type"], style: {}})
            }
        )
    )
    
    const authorOptions$ = pipe(
        getAuthors(),
        OE.fold(
            err => {
                console.log(err)
                return O.of([])
            },
            authors => O.of(authors.map(author => ({key: author.id, value: author.id, label: author.name})))
        )
    )

    return <div>
        <h2>Add a new book</h2>
        <Form form={form} onFinish={val => submit$.next(val)}>
            <Form.Item>
                <ObservableAlert data-cy="message" message="" style={{display: "none"}} props$={messageProps$} />
            </Form.Item>
            <Form.Item
                label="Title"
                name="title">
                <Input 
                    id="title" data-cy="title" />
            </Form.Item>
            <Form.Item
                label="Author"
                name="author">
                <ObservableSelect 
                    id="author"
                    mode="tags"
                    optionFilterProp="label"
                    data-cy="author"
                    options$={authorOptions$}
                    ></ObservableSelect>
            </Form.Item>
            <Form.Item>
                <Button type="primary" htmlType="submit" data-cy="submit">
                    Add
                </Button>
            </Form.Item>
        </Form>
    </div>
}

export default AddBook