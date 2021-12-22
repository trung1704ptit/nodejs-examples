import { Field, ID, InputType } from "type-graphql";

@InputType()
export class CreatePostInput{
    @Field()
    title: string

    @Field()
    text: string
}

@InputType()
export class UpdatePostInput {
    @Field(() => ID)
    id: number

    @Field()
    title: string

    @Field()
    text: string
}