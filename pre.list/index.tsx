import {
  Divider,
  List as L,
  ListItem,
  ListItemText,
  ListProps as LP,
  Skeleton,
} from "@mui/material";

export interface PreListProps extends LP {
  divider?: boolean;
  length?: number;
  loading?: boolean;
}
export const PreList = ({
  divider,
  children,
  length,
  loading,
  ...props
}: PreListProps) => {
  return (
    <L {...props}>
      {divider && <Divider />}
      {loading ? (
        <ListItem divider={divider}>
          <ListItemText
            primary={<Skeleton width="50%" />}
            secondary={<Skeleton width="35%" height={16} />}
          />
        </ListItem>
      ) : Boolean(length) === false ? (
        <ListItem divider={divider}>
          <ListItemText
            primary="No Data"
            primaryTypographyProps={{
              color: "textSecondary",
              variant: "body2",
            }}
          />
        </ListItem>
      ) : (
        children
      )}
    </L>
  );
};
