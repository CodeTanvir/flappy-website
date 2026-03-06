import { RemoveRedEye } from "@mui/icons-material";
import { ListItemIcon, MenuItem } from "@mui/material";
import Link from "next/link";

function ViewAction({href}) {
    return (
        <MenuItem key="view">
            <Link className="flex items-center" href={href}>
                <ListItemIcon>
                    <RemoveRedEye/>
                </ListItemIcon>
                View
            </Link>
        </MenuItem>
    )
}

export default ViewAction;
