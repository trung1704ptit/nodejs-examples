import { Button, FormControl, Box, Spinner, Flex, useToast } from '@chakra-ui/react';
import { Formik, Form, FormikHelpers } from 'formik'
import { useRouter } from 'next/router';
import InputField from '../components/InputField';
import Wrapper from '../components/Wrapper';
import { MeDocument, MeQuery, RegisterInput, useRegisterMutation } from '../generated/graphql';
import { mapFieldError } from '../helpers/mapFieldErrors';
import { useCheckAuth } from '../utils/useCheckAuth';

const Register = () => {
    const router = useRouter()
    const { data: authData, loading: authLoading } = useCheckAuth()
    const initialValues = {
        username: '',
        email: '',
        password: ''
    }

    const toast = useToast()

    const [registerUser, { loading: _registerUserLoading, data, error }] = useRegisterMutation()

    const onRegisterSubmit = async (values: RegisterInput, { setErrors }: FormikHelpers<RegisterInput>) => {
        const res = await registerUser({
            variables: {
                registerInput: values,
            },
            update(cache, { data: cacheData }) {
                if (cacheData?.register.success) {
                    cache.writeQuery<MeQuery>({ query: MeDocument, data: { me: cacheData.register.user } })
                }
            }
        })

        if (res.data?.register?.errors) {
            setErrors(mapFieldError(res.data.register.errors))
        } else if (res.data?.register?.user) {
            toast({
                title: 'Welcome',
                description: res.data?.register?.user.username,
                status: 'success',
                duration: 6000,
                isClosable: true,
            })
            router.push('/')
        }
    }

    return <>
        {
            authLoading || (!authLoading && authData?.me) ?
                <Flex justifyContent="center" alignItems="center" height="100vh">
                    <Spinner />
                </Flex> :
                <Wrapper>
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
                </Wrapper>}
    </>
}

export default Register;