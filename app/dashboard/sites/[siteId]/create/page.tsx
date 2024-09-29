"use client"

import React, { useActionState, useState } from "react"
import { toast } from "sonner"
import { useForm } from "@conform-to/react"
import slugify from "react-slugify"
import { parseWithZod } from "@conform-to/zod"

import { CreatePostAction } from "@/app/actions/post"

import { PostSchema } from "@/app/utils/zodSchemas"

import { JSONContent } from "novel"

import { ArrowLeft, Atom } from "lucide-react"

import Link from "next/link"
import Image from "next/image"
import TailwindEditor from "@/app/components/dashboard/editor/TailwindEditor"
import SubmitButton from "@/app/components/dashboard/SubmitButtons"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { UploadDropzone } from "@/app/utils/uploadthing"

const ArticleCreationPage = ({ params }: { params: { siteId: string } }) => {
  const [imageUrl, setImageUrl] = useState<undefined | string>(undefined)
  const [value, setValue] = useState<JSONContent | undefined>(undefined)
  const [slug, setSlugValue] = useState<undefined | string>(undefined)
  const [title, setTitle] = useState<undefined | string>(undefined)

  const [lastResult, action] = useActionState(CreatePostAction, undefined)

  const [form, fields] = useForm({
    lastResult,
    onValidate({ formData }) {
      return parseWithZod(formData, { schema: PostSchema })
    },
    shouldValidate: "onBlur",
    shouldRevalidate: "onInput",
  })

  const handleSlugGeneration = () => {
    if (title?.length === 0 || title === undefined) {
      return toast.error("Please create a title first")
    }

    setSlugValue(slugify(title))

    return toast.success("Slug has been created")
  }

  return (
    <>
      <div className="flex items-center">
        <Button size="icon" variant="outline" className="mr-3" asChild>
          <Link href={`/dashboard/sites/${params.siteId}`}>
            <ArrowLeft className="size-4" />
          </Link>
        </Button>
        <h1 className="text-xl font-semibold">Create Article</h1>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Article Details</CardTitle>
          <CardDescription>
            Lipsum dolor sit amet, consectetur adipiscing elit
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form
            className="flex flex-col gap-6"
            id={form.id}
            onSubmit={form.onSubmit}
            action={action}
          >
            <input type="hidden" name="siteId" value={params.siteId} />
            <div className="grid gap-2">
              <Label>Title</Label>
              <Input
                key={fields.title.key}
                name={fields.title.name}
                defaultValue={fields.title.initialValue}
                placeholder="Nextjs blogging application"
                onChange={(e) => setTitle(e.target.value)}
                value={title}
              />
              <p className="text-sm text-red-500">{fields.title.errors}</p>
            </div>

            <div className="grid gap-2">
              <Label>Slug</Label>
              <Input
                key={fields.slug.key}
                name={fields.slug.name}
                defaultValue={fields.slug.initialValue}
                placeholder="Article Slug"
                onChange={(e) => setSlugValue(e.target.value)}
                value={slug}
              />
              <Button
                onClick={handleSlugGeneration}
                className="w-fit"
                variant="secondary"
                type="button"
              >
                <Atom className="mr-2 size-4" /> Generate Slug
              </Button>
              <p className="text-sm text-red-500">{fields.slug.errors}</p>
            </div>

            <div className="grid gap-2">
              <Label>Small Description</Label>
              <Textarea
                key={fields.smallDescription.key}
                name={fields.smallDescription.name}
                defaultValue={fields.smallDescription.initialValue}
                placeholder="Small Description for your blog article..."
                className="h-32"
              />
              <p className="text-sm text-red-500">
                {fields.smallDescription.errors}
              </p>
            </div>

            <div className="grid gap-2">
              <Label>Cover Image</Label>
              <input
                type="hidden"
                name={fields.coverImage.name}
                key={fields.coverImage.key}
                defaultValue={fields.coverImage.initialValue}
                value={imageUrl}
              />
              {imageUrl ? (
                <Image
                  src={imageUrl}
                  alt="Uploaded Image"
                  width={200}
                  height={200}
                  className="h-[200px] w-[200px] rounded-lg object-cover"
                />
              ) : (
                <UploadDropzone
                  onClientUploadComplete={(res) => {
                    setImageUrl(res[0].url)
                    toast.success("Image has been uploaded")
                  }}
                  endpoint="imageUploader"
                  onUploadError={(error) => {
                    console.log(error)

                    toast.error("Something went wrong...")
                  }}
                  appearance={{
                    button: "bg-primary",
                  }}
                />
              )}

              <p className="text-sm text-red-500">{fields.coverImage.errors}</p>
            </div>

            <div className="grid gap-2">
              <Label>Article Content</Label>
              <input
                type="hidden"
                name={fields.articleContent.name}
                key={fields.articleContent.key}
                defaultValue={fields.articleContent.initialValue}
                value={JSON.stringify(value)}
              />
              <TailwindEditor onChange={setValue} initialValue={value} />
              <p className="text-sm text-red-500">
                {fields.articleContent.errors}
              </p>
            </div>

            <SubmitButton text="Create Article" />
          </form>
        </CardContent>
      </Card>
    </>
  )
}
export default ArticleCreationPage
