import { Button, FormControl, Box } from '@chakra-ui/react';
import { Formik, Form } from 'formik'
import InputField from '../components/InputField';
import Wrapper from '../components/Wrapper';
import { registerMutation } from '../graphql-client/mutations';
import { useMutation } from '@apollo/client';

const Register = () => {

    const [registerUser, {data, error}] = useMutation(registerMutation)
    const onRegisterSubmit = values => {

    }

    return <Wrapper>
        <Formik initialValues={{ username: '', password: '', email:'' }} onSubmit={onRegisterSubmit}>
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