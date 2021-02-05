import { useAuth0 as useAuth0Original } from "@auth0/auth0-react"


export const useAuth0 = () => {
    const auth = useAuth0Original()

    // @ts-ignore
    if (window.Cypress) {
        return {
            ...auth,
            isAuthenticated: window.localStorage.getItem("access_token") !== null ? true : auth.isAuthenticated
        }
    }

    return auth
}