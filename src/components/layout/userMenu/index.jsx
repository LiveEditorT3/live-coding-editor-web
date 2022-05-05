import { useState } from "react"

const UserMenu = () => {
    const [anchorEl, setAnchorEl] = useState(null)
    const open = Boolean(anchorEl)

    const handleOpen = (event) => setAnchorEl(event.currentTarget)
    const handleClose = () => setAnchorEl(null)

    return(
        <></>
    )
}
export default UserMenu