import { Mutation, Arg, Resolver, Query, ID, UseMiddleware } from "type-graphql";
import { PostMutationResponse } from '../types/PostMutationResponse';
import { CreatePostInput, UpdatePostInput } from '../types/PostTypes';
import { Post } from '../entities/Post';
import { checkAuth } from "../middleware/checkAuth";

@Resolver()
export class PostResolver {
    @Mutation(() => PostMutationResponse)
    @UseMiddleware(checkAuth)
    async createPost(
        @Arg('createPostInput') createPostInput: CreatePostInput,
    ): Promise<PostMutationResponse> {
        try {
            const { title, text } = createPostInput
            let newPost = Post.create({
                title, text
            })

            await Post.save(newPost)

            return {
                code: 200,
                success: true,
                message: 'Post created successfully',
                post: newPost
            }

        } catch (error) {
            return {
                code: 500,
                success: false,
                message: `Interal server error ${error.message}`
            }
        }
    }

    @Query(() => [Post], { nullable: true })
    @UseMiddleware(checkAuth)
    async posts(): Promise<Post[] | null> {
        try {
            return await Post.find()
        } catch (error) {
            return null
        }
    }

    @Query(() => Post, { nullable: true })
    @UseMiddleware(checkAuth)
    async post(
        @Arg('id', () => ID) id: number
    ): Promise<Post | undefined> {
        try {
            return await Post.findOne(id)
        } catch (error) {
            return undefined
        }

    }


    @Mutation(() => PostMutationResponse)
    @UseMiddleware(checkAuth)
    async updatePost(
        @Arg('updatePostInput') updatePostInput: UpdatePostInput
    ): Promise<PostMutationResponse> {
        try {
            const { id, title, text } = updatePostInput
            const existingPost = await Post.findOne(id)
            if (!existingPost) {
                return {
                    code: 400,
                    success: false,
                    message: 'Post not found'
                }
            }

            existingPost.title = title
            existingPost.text = text
            await Post.save(existingPost)

            return {
                code: 200,
                success: true,
                message: 'Updated post successfully',
                post: existingPost
            }
        } catch (error) {
            return {
                code: 500,
                success: false,
                message: `Interal server error ${error.message}`
            }
        }
    }

    @Mutation(() => PostMutationResponse)
    @UseMiddleware(checkAuth)
    async deletePost(
        @Arg('id', () => ID) id: number,
    ): Promise<PostMutationResponse> {
        const existingPost = await Post.findOne(id)
        if (!existingPost) {
            return {
                code: 400,
                success: false,
                message: 'Post not found'
            }
        }

        await Post.delete(id)

        return {
            code: 200,
            success: true,
            message: "Post deleted successfully"
        }
    }
}