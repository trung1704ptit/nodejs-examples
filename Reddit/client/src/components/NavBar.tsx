import { Box, Button, Flex, Heading, Link } from "@chakra-ui/react";
import NextLink from "next/link";
import { MeDocument, MeQuery, useLogoutMutation, useMeQuery } from "../generated/graphql";

const NavBar = () => {
    const { data, loading: useMeQueryLoading } = useMeQuery()
    const [logout, { loading: useLogoutMutationLoading, data: _, error}] = useLogoutMutation()

    const logoutUser = async () => {
        await logout({
            update (cache, { data }) {
                if (data?.logout) {
                    cache.writeQuery<MeQuery>({ query: MeDocument, data: { me: null}})
                }
            }
        })
    }

    let body

    if (useMeQueryLoading) {
        body = null
    } else if (!data?.me) {
        body = <>
            <NextLink href="/login"><Link mr={3}>Login</Link></NextLink>
            <NextLink href="/register"><Link>Register</Link></NextLink>
        </>
    } else {
        body = <><Button onClick={logoutUser} isLoading={useLogoutMutationLoading} >Logout</Button></>
    }

    return <Box bg="tan" p={4}>
        <Flex maxW={800} justifyContent="space-between" align="center" m="auto">
            <Heading>Reddit</Heading>
            <Box>
                {body}
            </Box>
        </Flex>
    </Box>
}

export default NavBar