import { Add } from "@mui/icons-material"
import { Avatar, ListItem, ListItemAvatar, ListItemText, MenuItem, TextField } from "@mui/material"

const Dropdown = ({ options, getOptionLabel, getOptionValue, onAdd, ...rest }) => {
    return(
        <TextField
            variant="outlined"
            select={options && options.length > 0}
            {...rest}
        >
            {
                options &&
                options.map((option, index) => {
                    const label = getOptionLabel(option)
                    const value = getOptionValue(option)

                    return(
                        <MenuItem key={index} value={value}>
                            {label}
                        </MenuItem>
                    )
                }) 
            }
            {
                onAdd &&
                <ListItem onClick={onAdd} button key={options.length} selected={false}>
                    <ListItemAvatar>
                        <Avatar>
                            <Add/>
                        </Avatar>
                    </ListItemAvatar>
                    <ListItemText><strong>Create Repo</strong></ListItemText>
                </ListItem>
            }
        </TextField>
    )
}

export default Dropdown