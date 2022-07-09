import { ArrowBackIos, ArrowForwardIos } from "@mui/icons-material";
import { Chip } from "@mui/material";
import useStyles from "./styles";

const Tab = ({ label, open, onOpen, icon }) => {
  const classes = useStyles();
  return (
    <Chip
      className={classes.root}
      sx={{ borderRadius: 1.5 }}
      icon={icon}
      deleteIcon={open ? <ArrowBackIos /> : <ArrowForwardIos />}
      label={label}
      onDelete={onOpen}
    />
  );
};
export default Tab;
