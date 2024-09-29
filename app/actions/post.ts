"use server"

import { redirect } from "next/navigation"

import { parseWithZod } from "@conform-to/zod"

import { requireUser } from "@/app/utils/requireUser"
import { PostSchema } from "@/app/utils/zodSchemas"
import prisma from "@/app/utils/db"

export const CreatePostAction = async (prevState: any, formData: FormData) => {
  const user = await requireUser()

  const submission = parseWithZod(formData, {
    schema: PostSchema,
  })

  if (submission.status !== "success") {
    return submission.reply()
  }

  await prisma.post.create({
    data: {
      title: submission.value.title,
      smallDescription: submission.value.smallDescription,
      slug: submission.value.slug,
      articleContent: JSON.parse(submission.value.articleContent),
      image: submission.value.coverImage,
      userId: user.id,
      siteId: formData.get("siteId") as string,
    },
  })

  return redirect(`/dashboard/sites/${formData.get("siteId")}`)
}
