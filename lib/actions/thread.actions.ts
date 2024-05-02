"use server"

import { revalidatePath } from "next/cache"
import Thread from "../models/thread.model"
import User from "../models/user.model"
import { connectToDB } from "../mongoose"
import { connect } from "http2"

interface Params {
  text: string,
  author: string,
  communityId: string | null,
  path: string,
}

export async function createThread({ text, author, communityId, path }: Params)  {

  try {
    connectToDB()
    const createdThread = await Thread.create({
      text,
      author,
      community: null,
    })

    await User.findByIdAndUpdate(author, {
      $push: { threads: createdThread._id }
    })
  } catch(error: any) {
    throw new Error(`Failed to create thread: ${error.message}`)
  }

  revalidatePath(path)
}

export async function fetchThreads(pageNumber = 1, pageSize = 20) {
  try {
    connectToDB()

    const skipAmount = (pageNumber - 1) * pageSize

    const threadsQuery = Thread.find({ parentId: { $in: [null, undefined] }})
    .sort({ createdAt: 'desc' })
    .skip(skipAmount)
    .limit(pageSize)
    .populate({path: 'author', model: User})
    .populate({
      path: 'children',
      populate: {
        path: 'author',
        model: User,
        select: "_id name parentId image"
      }
    })

    const totalThreadsCount = await Thread.countDocuments({ parentId: { $in: [null, undefined] }})

    const threads = await threadsQuery.exec()

    const isNext = totalThreadsCount > (skipAmount + threads.length)

    return { threads, isNext }

  } catch(error: any) {
    throw new Error(`Failed to fetch threads: ${error.message}`)
  }
}