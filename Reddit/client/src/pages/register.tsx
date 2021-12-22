import { Button, FormControl, Box } from '@chakra-ui/react';
import { Formik, Form } from 'formik'
import InputField from '../components/InputField';
import Wrapper from '../components/Wrapper';
import { registerMutation } from '../graphql-client/mutations';
import { useMutation } from '@apollo/client';

const Register = () => {
    const initialValues = {
        username: '',
        email: '',
        password: ''
    }
    interface UserMutationResponse {
        code:number
        success: boolean
        message: string
        user: string
        errors: string
    }

    interface NewUserInput {
        username: string
        email: string
        password: string
    }

    const [registerUser, {data, error}] = useMutation<{register: UserMutationResponse, registerInput: NewUserInput}>(registerMutation)

    const onRegisterSubmit = (values: NewUserInput) => {
        return registerUser({
            variables: {
                registerInput: values,
            }
        })
    }

    return <Wrapper>
        {error && <p>Failed to register</p>}
        {data && data.register.success && <p>Register successfully {JSON.stringify(data)}</p>}
        <Formik initialValues={initialValues} onSubmit={onRegisterSubmit}>
            {
                ({ isSubmitting }) => (
                    <Form>
                        <FormControl>
                            <InputField
                                name="username"
                                label="Username"
                                placeholder='Username'
                                type="text"
                            />
                            <Box mt={4}>
                                <InputField
                                    name="email"
                                    label="Email"
                                    placeholder='Email'
                                    type="text"
                                />
                            </Box>
                            <Box mt={4}>
                                <InputField
                                    name="password"
                                    label="Password"
                                    placeholder='Password'
                                    type="password"
                                />
                            </Box>

                            <Button type="submit" mt={4} colorScheme="teal" isLoading={isSubmitting}>Register</Button>
                        </FormControl>
                    </Form>
                )
            }
        </Formik>
    </Wrapper>
}

export default Register;