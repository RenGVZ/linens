"use client"

import * as z from "zod"
import { useForm } from "react-hook-form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { CommentValidation } from "@/lib/validations/thread"
import { zodResolver } from "@hookform/resolvers/zod"
import { usePathname, useRouter } from "next/navigation"
import Image from "next/image"
import { addCommentToThread } from "@/lib/actions/thread.actions"
// import { updateUser } from "@/lib/actions/user.actions"
// import { createThread } from "@/lib/actions/thread.actions"

interface Props {
  threadId: string,
  currentUserImg: string,
  currentUserId: string,
}

const Comment = ({ threadId, currentUserImg, currentUserId }: Props) => {
  const router = useRouter()
  const pathname = usePathname()

  const form = useForm({
    resolver: zodResolver(CommentValidation),
    defaultValues: {
      thread: '',
    },
  })

  const onSumbit = async (values: z.infer<typeof CommentValidation>) => {
    await addCommentToThread(
      threadId,
      values.thread,
      JSON.parse(currentUserId),
      pathname
    )

    form.reset()

    router.push("/")
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSumbit)}
        className="comment-form"
      >
        <FormField
          control={form.control}
          name="thread"
          render={({ field }) => (
            <FormItem className="flex w-full items-center gap-3">
              <FormLabel>
                <Image
                  src={currentUserImg}
                  alt="Profile Image"
                  width={48}
                  height={48}
                  className="cursor-pointer rounded-full object-cover"
                />
              </FormLabel>
              <FormControl className="border-none bg-transparent">
                <Input
                  type="text"
                  placeholder="Comment..."
                  className="no-focus text-light-1 outline-none"
                  {...field}
                />
              </FormControl>
            </FormItem>
          )}
        />

        <Button type="submit" className="comment-form_btn">
          Reply
        </Button>
      </form>
    </Form>
  )
}

export default Comment