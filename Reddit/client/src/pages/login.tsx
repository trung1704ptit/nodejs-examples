import { Button, FormControl, Box } from '@chakra-ui/react';
import { Formik, Form, FormikHelpers } from 'formik'
import { useRouter } from 'next/router';
import InputField from '../components/InputField';
import Wrapper from '../components/Wrapper';
import { RegisterInput, useRegisterMutation } from '../generated/graphql';
import { mapFieldError } from '../helpers/mapFieldErrors';

const Login = () => {
    const router = useRouter()
    const initialValues = {
        username: '',
        email: '',
        password: ''
    }

    const [registerUser, {loading: _registerUserLoading, data, error }] = useRegisterMutation()

    const onRegisterSubmit = async (values: RegisterInput, { setErrors }: FormikHelpers<RegisterInput>) => {
        const res = await registerUser({
            variables: {
                registerInput: values,
            }
        })
        
        if(res.data?.register?.errors) {
            setErrors(mapFieldError(res.data.register.errors))
        } else if (res.data?.register?.user){
            router.push('/')
        }
    }

    return <Wrapper>
        {error && <p>Failed to register</p>}
        {data && data.register && data.register.success && <p>Register successfully {JSON.stringify(data)}</p>}
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

export default Login;