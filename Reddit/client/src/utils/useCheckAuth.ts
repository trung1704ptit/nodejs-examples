import { useEffect } from "react"
import { useRouter } from "next/router"
import { useMeQuery } from "../generated/graphql"

export const useCheckAuth = () => {
    const router = useRouter()
    const { data, loading } = useMeQuery()

    useEffect(() => {
        if (!loading && (data?.me && router.route === '/login' || data?.me && router.route === '/register')) {
            router.replace('/')
        }
    }, [router, data, loading])

    return { data, loading}
}