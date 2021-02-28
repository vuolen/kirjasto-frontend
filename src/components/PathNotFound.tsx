import { useLocation } from "react-router-dom"

const PathNotFound = () => (
    <h3>
        Path {useLocation().pathname} not found.
    </h3>
)

export default PathNotFound