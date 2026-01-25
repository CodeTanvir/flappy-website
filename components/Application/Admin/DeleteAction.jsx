import { ListItemIcon, MenuItem } from "@mui/material"
import DeleteIcon  from "@mui/icons-material/Delete"
import Link from "next/link"

function DeleteAction({handleDelete, row, deleteType}) {
    return (
        <MenuItem key="delete" onClick={()=> handleDelete([row.original._id],deleteType)}>
            {/* <Link href={href}> */}
                <ListItemIcon>
                    <DeleteIcon/>
                </ListItemIcon>
                Delete
            {/* </Link> */}
        </MenuItem>
    )
}

export default DeleteAction
