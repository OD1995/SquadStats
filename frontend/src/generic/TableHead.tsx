import { withStyles } from "@mui/material";
// import MuiTableHead from "@material-ui/core/TableHead";


export const SSTableHead = withStyles(
    (theme:any) => (
        {
            root: {
                "& .MuiTableCell-head": {
                    color: "white",
                    backgroundColor: "blue"
                },
            }
        }
    )
)