import { Delete, Edit, HideImage } from "@mui/icons-material";
import {
  Avatar,
  Box,
  IconButton,
  Link as MuiLink,
  TextField,
  Typography,
} from "@mui/material";
import { DataGrid, DataGridProps, GridColDef } from "@mui/x-data-grid";
import merge from "lodash.merge";
import moment from "moment";
import { useState } from "react";
import { Link } from "react-router-dom";

export type ListGridProps = DataGridProps &
  Partial<{
    height: any;
  }>;

export const ListGrid = ({ height, ...props }: ListGridProps) => {
  const [q, setQ] = useState("");

  const filterRows = (rows: readonly any[]): any[] => {
    const qs = q.split(" ").map((q) => q.trim());
    return rows.filter((row) =>
      qs.every((q) => JSON.stringify(row).includes(q))
    );
  };

  return (
    <>
      <Box mb={2}>
        <TextField
          fullWidth
          label="Search"
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />
      </Box>
      <Box sx={{ height: height ?? "480px" }}>
        <DataGrid
          {...merge(
            {
              initialState: {
                pagination: {
                  paginationModel: {
                    pageSize: 25,
                  },
                },
              },
              disableRowSelectionOnClick: true,
            } as Partial<DataGridProps>,
            props
          )}
          rows={filterRows(props.rows)}
        />
      </Box>
    </>
  );
};

export const genColumns = () => {
  return {
    action: (
      func?: Partial<Record<"edit" | "remove", (row: any) => any>>
    ): GridColDef => ({
      field: "action",
      headerName: " ",
      sortable: false,
      filterable: false,
      width: 64,
      disableColumnMenu: true,
      align: "center",
      renderCell: ({ row }) => (
        <>
          {func?.edit && (
            <IconButton
              size="small"
              color="warning"
              edge="start"
              onClick={() => func.edit(row)}
            >
              <Edit fontSize="inherit" />
            </IconButton>
          )}
          {func?.remove && (
            <IconButton
              size="small"
              color="error"
              edge="end"
              onClick={() => func.remove(row)}
            >
              <Delete fontSize="inherit" />
            </IconButton>
          )}
        </>
      ),
    }),
    thumbnail: (field: string): GridColDef => ({
      field,
      headerName: " ",
      width: 64,
      align: "center",
      sortable: false,
      filterable: false,
      renderCell: ({ value }) => (
        <Avatar variant="square" src={value}>
          <HideImage fontSize="inherit" />
        </Avatar>
      ),
      disableColumnMenu: true,
    }),
    title: (field: string, toUrl: (row: any) => string): GridColDef => ({
      field,
      headerName: "Title",
      renderCell: ({ row, value }) => (
        <MuiLink
          variant="inherit"
          noWrap
          component={Link}
          to={toUrl(row)}
          target="_blank"
        >
          {value}
        </MuiLink>
      ),
      width: 360,
    }),
    date: (field: string, headerName: string): GridColDef => ({
      field,
      headerName,
      width: 160,
      renderCell: ({ value }) => (
        <Typography variant="caption">
          {moment(value).format("YYYY/MM/DD HH:mm")}
        </Typography>
      ),
    }),
  };
};
