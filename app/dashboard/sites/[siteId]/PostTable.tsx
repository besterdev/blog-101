import { MoreHorizontal } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

interface Post {
  id: string
  image: string
  title: string
  createdAt: Date
}

interface PostsTableProps {
  posts: Post[]
  siteId: string
}

export const PostsTable = ({ posts, siteId }: PostsTableProps) => {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Image</TableHead>
          <TableHead>Title</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Created At</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {posts.map((post) => (
          <TableRow key={post.id}>
            <TableCell>
              <Image
                src={post.image}
                width={64}
                height={64}
                alt="Article Cover Image"
                className="size-16 rounded-md object-cover"
              />
            </TableCell>
            <TableCell className="font-medium">{post.title}</TableCell>
            <TableCell>
              <Badge
                variant="outline"
                className="bg-green-500/10 px-3 py-1 text-green-500"
              >
                Published
              </Badge>
            </TableCell>
            <TableCell>
              {new Intl.DateTimeFormat("en-US", {
                dateStyle: "medium",
              }).format(post.createdAt)}
            </TableCell>
            <TableCell className="text-end">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button size="icon" variant="ghost">
                    <MoreHorizontal className="size-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>Actions</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="cursor-pointer" asChild>
                    <Link href={`/dashboard/sites/${siteId}/${post.id}`}>
                      Edit
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="cursor-pointer" asChild>
                    <Link href={`/dashboard/sites/${siteId}/${post.id}/delete`}>
                      Delete
                    </Link>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
