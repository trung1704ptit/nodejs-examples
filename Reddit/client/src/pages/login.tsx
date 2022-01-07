import { Box, Button, Flex, FormControl, Spinner, useToast } from '@chakra-ui/react';
import { Form, Formik, FormikHelpers } from 'formik';
import { useRouter } from 'next/router';
import InputField from '../components/InputField';
import Wrapper from '../components/Wrapper';
import { LoginInput, MeDocument, MeQuery, useLoginMutation } from '../generated/graphql';
import { mapFieldError } from '../helpers/mapFieldErrors';
import { useCheckAuth } from '../utils/useCheckAuth';

const Login = () => {
    const router = useRouter()
    const { data: authData, loading: authLoading } = useCheckAuth()

    const initialValues: LoginInput = {
        usernameOrEmail: '',
        password: ''
    }
     
    const toast = useToast()

    const [loginUser, { loading: _loginUserLoading, data, error }] = useLoginMutation()

    const onLoginSubmit = async (values: LoginInput, { setErrors }: FormikHelpers<LoginInput>) => {
        const res = await loginUser({
            variables: {
                loginInput: values,
            },
            update(cache, { data }) {
                if (data?.login.success) {
                    cache.writeQuery<MeQuery>({ query: MeDocument, data: { me: data.login.user } })
                }
            }
        })

        if (res.data?.login?.errors) {
            setErrors(mapFieldError(res.data.login.errors))
        } else if (res.data?.login?.user) {
            // Login successfully
            toast({
                title: 'Welcome to Reddit.',
                description: res.data?.login?.user.username,
                status: 'success',
                duration: 6000,
                isClosable: true,
            })
            router.push('/')
        }
    }

    return <>
        {
            authLoading || (!authLoading && authData?.me) ? <Flex justifyContent="center" alignItems="center" height="100vh"><Spinner /> </Flex> : <Wrapper>

                {error && <p>Failed to login. Internal server error!</p>}

                <Formik initialValues={initialValues} onSubmit={onLoginSubmit}>
                    {
                        ({ isSubmitting }) => (
                            <Form>
                                <FormControl>
                                    <InputField
                                        name="usernameOrEmail"
                                        label="Username or Email"
                                        placeholder='Username or Email'
                                        type="text"
                                    />
                                    <Box mt={4}>
                                        <InputField
                                            name="password"
                                            label="Password"
                                            placeholder='Password'
                                            type="password"
                                        />
                                    </Box>

                                    <Button type="submit" mt={4} colorScheme="teal" isLoading={isSubmitting}>Login</Button>
                                </FormControl>
                            </Form>
                        )
                    }
                </Formik>
            </Wrapper>
        }
    </>
}

export default Login;