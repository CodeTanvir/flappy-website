import { ListItemIcon, MenuItem } from "@mui/material"
import EditIcon  from "@mui/icons-material/Edit"
import Link from "next/link"

function EditAction({href}) {
    return (
        <MenuItem key="edit">
            <Link href={href}>
                <ListItemIcon>
                    <EditIcon/>
                </ListItemIcon>
                Edit
            </Link>
        </MenuItem>
    )
}

export default EditAction
