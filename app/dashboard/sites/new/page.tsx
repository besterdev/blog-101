"use client"

import { useActionState } from "react"
import { useForm } from "@conform-to/react"
import { parseWithZod } from "@conform-to/zod"

import { CreateSiteAction } from "@/app/actions/site"

import { siteSchema } from "@/app/utils/zodSchemas"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

const NewSitePage = () => {
  const [lastResult, action] = useActionState(CreateSiteAction, undefined)
  const [form, fields] = useForm({
    lastResult,
    onValidate({ formData }) {
      return parseWithZod(formData, {
        schema: siteSchema,
      })
    },
    shouldValidate: "onBlur",
    shouldRevalidate: "onInput",
  })

  return (
    <div className="flex flex-1 flex-col items-center justify-center">
      <Card className="max-w-[450px]">
        <CardHeader>
          <CardTitle>Create New Site</CardTitle>
          <CardDescription>
            Create you site here. Click the button below once your done...
          </CardDescription>
        </CardHeader>
        <form id={form.id} onSubmit={form.onSubmit} action={action}>
          <CardContent>
            <div className="flex flex-col gap-y-6">
              <div className="grid gap-2">
                <Label>Site Name</Label>
                <Input
                  name={fields.name.name}
                  key={fields.name.key}
                  defaultValue={fields.name.initialValue}
                  placeholder="Site Name"
                />
                <p className="text-sm text-red-500">{fields.name.errors}</p>
              </div>
              <div className="grid gap-2">
                <Label>Subdirectory</Label>
                <Input
                  name={fields.subdirectory.name}
                  key={fields.subdirectory.key}
                  defaultValue={fields.subdirectory.initialValue}
                  placeholder="Subdirectory"
                />
                <p className="text-sm text-red-500">
                  {fields.subdirectory.errors}
                </p>
              </div>
              <div className="grid gap-2">
                <Label>Description</Label>
                <Textarea
                  name={fields.description.name}
                  key={fields.description.key}
                  defaultValue={fields.description.initialValue}
                  placeholder="Small Description of your site"
                />
                <p className="text-sm text-red-500">
                  {fields.description.errors}
                </p>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button className="w-full">Submit</Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}

export default NewSitePage
