"use server"

import { redirect } from "next/navigation"
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server"
import { parseWithZod } from "@conform-to/zod"

import { siteSchema } from "@/app/utils/zodSchemas"
import prisma from "@/app/utils/db"

export const CreateSiteAction = async (prevState: any, formData: FormData) => {
  const { getUser } = getKindeServerSession()

  const user = await getUser()

  if (!user || user === null || !user.id) {
    return redirect("/api/auth/login")
  }

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
