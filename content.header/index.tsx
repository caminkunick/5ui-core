import {
  Box,
  BoxProps,
  BreadcrumbsProps,
  Link as MLink,
  Skeleton,
  Typography,
} from "@mui/material";
import { Container } from "./container";
import { BreadcrumbsStyled } from "./breadcrumbs.styled";
import React from "react";
import { Link, To } from "react-router-dom";

export type Breadcrumb = {
  label: React.ReactNode;
  to?: string | To;
  component?: React.ReactElement;
};
export interface ContentHeaderProps {
  loading?: boolean;
  label?: React.ReactNode;
  breadcrumbs?: Breadcrumb[];
  actions?: React.ReactNode;
  secondary?: React.ReactNode;
  containerProps?: BoxProps;
  breadcrumbsProps?: BreadcrumbsProps;
}

export const ContentHeader = ({
  label,
  breadcrumbs,
  actions,
  secondary,
  containerProps,
  breadcrumbsProps,
  ...props
}: ContentHeaderProps) => {
  return (
    <Container mb={4} {...containerProps}>
      <Box flex={1}>
        {props.loading ? (
          <Typography variant="caption">
            <Skeleton width={"25%"} />
          </Typography>
        ) : (
          breadcrumbs && (
            <Box mb={1}>
              <BreadcrumbsStyled separator="|" {...breadcrumbsProps}>
                {breadcrumbs.map((item, index) => {
                  if (item.component) {
                    return React.cloneElement(item.component, {
                      key: index,
                    });
                  } else if (item.to) {
                    return (
                      <MLink component={Link} to={item.to} key={index}>
                        <Typography
                          variant="caption"
                          color="inherit"
                          style={{ fontWeight: "bold" }}
                          sx={{ color: "info.main" }}
                        >
                          {item.label}
                        </Typography>
                      </MLink>
                    );
                  } else {
                    return (
                      <Typography
                        variant="caption"
                        color="textSecondary"
                        key={index}
                      >
                        {item.label || <Skeleton width={"10ch"} />}
                      </Typography>
                    );
                  }
                })}
              </BreadcrumbsStyled>
            </Box>
          )
        )}
        <Typography
          variant="h3"
          color={label ? "textPrimary" : "textSecondary"}
        >
          {props.loading ? <Skeleton width={"50%"} /> : label || "No title"}
        </Typography>
        {secondary && (
          <Typography
            variant="caption"
            color="textSecondary"
            component="div"
            style={{ paddingTop: 8 }}
          >
            {secondary}
          </Typography>
        )}
      </Box>
      {Boolean(actions) && <div>{actions}</div>}
    </Container>
  );
};
