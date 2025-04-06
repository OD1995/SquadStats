import { withStyles } from "@mui/material";
// import MuiTableHead from "@material-ui/core/TableHead";


export const SSTableHead = withStyles(
    (_:any) => (
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