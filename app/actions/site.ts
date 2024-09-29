"use server"

import { redirect } from "next/navigation"
import { parseWithZod } from "@conform-to/zod"

import { siteSchema } from "@/app/utils/zodSchemas"
import { requireUser } from "@/app/utils/requireUser"
import prisma from "@/app/utils/db"

export const CreateSiteAction = async (prevState: any, formData: FormData) => {
  const user = await requireUser()

  const submission = parseWithZod(formData, {
    schema: siteSchema,
  })

  if (submission.status !== "success") {
    return submission.reply()
  }

  const response = await prisma.site.create({
    data: {
      name: submission.value.name,
      description: submission.value.description,
      subdirectory: submission.value.subdirectory,
      userId: user.id,
    },
  })

  return redirect(`/dashboard/sites`)
}
