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
    // await createThread({
    //   text: values.thread,
    //   author: currentUserId,
    //   communityId: null,
    //   path: pathname
    // })

    router.push("/")
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSumbit)}
        className="mt-10 flex flex-col justify-start gap-10"
      >
        <FormField
          control={form.control}
          name="thread"
          render={({ field }) => (
            <FormItem className="flex flex-col gap-3 w-full">
              <FormLabel className="text-base-semibold text-light-2">
                Content
              </FormLabel>
              <FormControl>
                <Input
                  type="text"
                  placeholder="Comment..."
                  className="no-focus text-light-1 outline-none bg-dark-2"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="bg-primary-500">Post thread</Button>
      </form>
    </Form>
  )
}

export default Comment