import React, { useState } from "react"
import { FormEvent } from "react"
import { Observable, Subject } from "rxjs"
import { concatMap, filter, map, tap } from "rxjs/operators"
import { AuthenticatedApi, GetAuthorsResponse, AddBookResponse } from "../api"
import useObservable from "../hooks/useObservable"
import { Loading } from "./Loading"
import { ObservableAlert, ObservableSelect } from "./ObservableComponents"
import { Form, Input, Button, Alert, AlertProps } from "antd"
import { APIError } from "kirjasto-shared"

const AddBook = ({api$}: {api$: Observable<Pick<AuthenticatedApi, "addBook" | "getAuthors">>}) => {
    const api = useObservable(api$, [api$])
    const [form] = Form.useForm()

    if (api === undefined) {
        return <Loading />
    }

    const {addBook, getAuthors} = api

    const authors$ = getAuthors()

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

    const messageProps$ = response$.pipe(
        map(res => {
            if (!APIError.is(res)) {
                form.resetFields()
                return {message: "Book added successfully", type: "success" as AlertProps["type"]}
            } else {
                return {message: res.error, type: "error" as AlertProps["type"]}
            }
        }),
    )

    const authorOptions$ = authors$.pipe(
        filter((res): res is GetAuthorsResponse => !APIError.is(res)),
        map(authors => authors.map(
            author => ({key: author.id, value: author.id, label: author.name})
        ))
    )

    return <div>
        <h2>Add a new book</h2>
        <Form form={form} onFinish={val => submit$.next(val)}>
            <Form.Item>
                <ObservableAlert data-cy="message" message="" props$={messageProps$} />
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