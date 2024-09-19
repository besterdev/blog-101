import Link from "next/link"
import Image from "next/image"
import { redirect } from "next/navigation"
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server"

import prisma from "@/app/utils/db"

import DefaultImage from "@/public/default.png"

import { Plus } from "lucide-react"

import { Button } from "@/components/ui/button"
import EmptyState from "@/app/components/dashboard/EmptyState"

import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

const getSites = async (userId: string) => {
  const data = await prisma.site.findMany({
    where: {
      userId: userId,
    },
    orderBy: {
      createdAt: "desc",
    },
  })

  return data
}

const SitesPage = async () => {
  const { getUser } = getKindeServerSession()

  const user = await getUser()

  if (!user || user === null || !user.id) {
    return redirect("/api/auth/login")
  }

  const sites = await getSites(user.id)

  return (
    <>
      <div className="flex w-full justify-end">
        <Button asChild>
          <Link href={"/dashboard/sites/new"}>
            <Plus className="mr-2 size-4" />
            Create Site
          </Link>
        </Button>
      </div>

      {sites.length === 0 ? (
        <EmptyState
          title="You dont have any Sites created"
          description="You currently dont have any Sites. Please create some so that you can
        see them right here!"
          buttonText="Create Site"
          href="/dashboard/sites/new"
        />
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 lg:gap-7">
          {sites.map((site) => (
            <Card key={site.id}>
              <Image
                src={site.imageUrl ?? DefaultImage}
                alt={site.name}
                className="h-[200px] w-full rounded-t-lg object-cover"
                width={400}
                height={200}
              />
              <CardHeader>
                <CardTitle className="truncate">{site.name}</CardTitle>
                <CardDescription className="line-clamp-3">
                  {site.description}
                </CardDescription>
              </CardHeader>

              <CardFooter>
                <Button asChild className="w-full">
                  <Link href={`/dashboard/sites/${site.id}`}>
                    View Articles
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </>
  )
}

export default SitesPage
