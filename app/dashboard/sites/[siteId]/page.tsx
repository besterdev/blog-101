import React from "react"
import { redirect } from "next/navigation"
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server"

import prisma from "@/app/utils/db"

import { Book, PlusCircle, Settings } from "lucide-react"

import Link from "next/link"

import { Button } from "@/components/ui/button"
import EmptyState from "@/app/components/dashboard/EmptyState"
import { Card } from "@/components/ui/card"

const getSite = async (siteId: string, userId: string) => {
  const data = await prisma.site.findUnique({
    where: {
      id: siteId,
      userId: userId,
    },
    select: {
      subdirectory: true,
      posts: {
        select: {
          id: true,
          title: true,
          image: true,
          createdAt: true,
        },
        orderBy: {
          createdAt: "desc",
        },
      },
    },
  })

  return data
}

const SitePage = async ({ params }: { params: { siteId: string } }) => {
  const { getUser } = getKindeServerSession()

  const user = await getUser()

  if (!user || user === null || !user.id) {
    return redirect("/api/auth/login")
  }

  const site = await getSite(params.siteId, user.id)

  return (
    <>
      <div className="flex w-full justify-end gap-x-4">
        <Button asChild variant="secondary">
          <Link href="#">
            <Book className="mr-2 size-4" />
            View Blog
          </Link>
        </Button>
        <Button asChild variant="secondary">
          <Link href={`/dashboard/sites/${params.siteId}/settings`}>
            <Settings className="mr-2 size-4" />
            Settings
          </Link>
        </Button>
        <Button asChild>
          <Link href={`/dashboard/sites/${params.siteId}/create`}>
            <PlusCircle className="mr-2 size-4" />
            Create Article
          </Link>
        </Button>
      </div>

      {site?.posts === undefined || site.posts.length === 0 ? (
        <EmptyState
          title="You dont have any Articles created"
          description="You currently dont have any articles. please create some so that you can see them right here"
          buttonText="Create Article"
          href={`/dashboard/sites/${params.siteId}/create`}
        />
      ) : (
        <div>
          <Card></Card>
        </div>
      )}
    </>
  )
}

export default SitePage
