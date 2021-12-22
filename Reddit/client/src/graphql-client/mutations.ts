import { gql } from "@apollo/client";

export const registerMutation = gql`
    mutation register($registerInput: RegisterInput!) {
        register(
            registerInput: $registerInput
        )
        {
            code
            success
            message
            user {
                id
                email
                username
            }
            errors {
                field
                message
            }
        }
    }
`