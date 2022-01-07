import NavBar from "../components/NavBar"
import { GetServerSideProps, GetServerSidePropsContext } from 'next'
import { PostsDocument, usePostsQuery } from "../generated/graphql"
import { addApolloState, initializeApollo } from "../lib/apolloClient"

const Index = () => {
    const { data, loading } = usePostsQuery()
    return (
        <>
            <NavBar />
            <h1>Hello world</h1>
            <ul>
                {!loading && data?.posts?.map(post => (<li>{post.title}</li>))} 
            </ul>
        </>
    )
}


export const getServerSideProps: GetServerSideProps = async (context: GetServerSidePropsContext) => {
    const apolloClient = initializeApollo({ headers: context.req.headers })

    await apolloClient.query({
        query: PostsDocument,
    })

    return addApolloState(apolloClient, {
        props: {},
    })
}

export default Index
