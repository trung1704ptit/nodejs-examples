import { FieldError } from "../generated/graphql";

export const mapFieldError = (errors: FieldError[]) => {
    return errors.reduce((accumulatedErrorObject, error) => ({
        ...accumulatedErrorObject,
        [error.field]: error.message
    }), {})
}