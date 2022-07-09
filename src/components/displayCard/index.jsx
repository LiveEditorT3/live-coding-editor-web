import { Card, CardContent, CardHeader } from "@mui/material";

const DisplayCard = ({ title, children, ...rest }) => {
  return (
    <Card sx={{ ...rest }}>
      {!!title && <CardHeader title={title} />}
      <CardContent>{children}</CardContent>
    </Card>
  );
};
export default DisplayCard;
