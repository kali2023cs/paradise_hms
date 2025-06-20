import * as React from 'react';
import PropTypes from 'prop-types';
import {
  Box, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TablePagination,
  TableRow, TableSortLabel, Checkbox, Toolbar, Typography, Button,
  FormControlLabel, Switch, useTheme,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import { visuallyHidden } from '@mui/utils';
import { alpha } from '@mui/material/styles';

function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) return -1;
  if (b[orderBy] > a[orderBy]) return 1;
  return 0;
}

function getComparator(order, orderBy) {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

const EnhancedTableHead = ({ headCells, order, orderBy, onRequestSort, onSelectAllClick, numSelected, rowCount }) => {
  const theme = useTheme();

  const createSortHandler = (property) => (event) => onRequestSort(event, property);

  return (
    <TableHead>
      <TableRow sx={{ backgroundColor: theme.palette.primary.main }}>
        <TableCell padding="checkbox" sx={{ backgroundColor: 'inherit' }}>
          <Checkbox
            color="primary"
            indeterminate={numSelected > 0 && numSelected < rowCount}
            checked={rowCount > 0 && numSelected === rowCount}
            onChange={onSelectAllClick}
            sx={{
              color: theme.palette.primary.contrastText,
              '&.Mui-checked': { color: theme.palette.primary.contrastText },
              '&.MuiCheckbox-indeterminate': { color: theme.palette.primary.contrastText }
            }}
          />
        </TableCell>
        {headCells.map((headCell) => (
          <TableCell
            key={headCell.id}
            align={headCell.numeric ? 'right' : 'left'}
            padding={headCell.disablePadding ? 'none' : 'normal'}
            sortDirection={orderBy === headCell.id ? order : false}
            sx={{ 
              backgroundColor: 'inherit', 
              color: theme.palette.primary.contrastText, 
              fontWeight: 600, 
              fontSize: '0.875rem' 
            }}
          >
            <TableSortLabel
              active={orderBy === headCell.id}
              direction={orderBy === headCell.id ? order : 'asc'}
              onClick={createSortHandler(headCell.id)}
              sx={{
                color: `${theme.palette.primary.contrastText} !important`,
                '&:hover': { color: `${theme.palette.primary.contrastText} !important` },
                '&.Mui-active': { color: `${theme.palette.primary.contrastText} !important` },
              }}
            >
              {headCell.label}
              {orderBy === headCell.id ? (
                <Box component="span" sx={visuallyHidden}>
                  {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                </Box>
              ) : null}
            </TableSortLabel>
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
};

const EnhancedTableToolbar = ({ numSelected, title, onActionClick }) => {
  const theme = useTheme();

  return (
    <Toolbar
      sx={{
        pl: { sm: 2 },
        pr: { xs: 1, sm: 1 },
        bgcolor: numSelected > 0 
          ? alpha(theme.palette.primary.light, 0.2) 
          : theme.palette.primary.main,
        borderRadius: '12px 12px 0 0',
        color: numSelected > 0 
          ? theme.palette.text.primary 
          : theme.palette.primary.contrastText,
        minHeight: '64px',
        display: 'flex',
        justifyContent: 'space-between',
        transition: theme.transitions.create(['background-color', 'color'], {
          duration: theme.transitions.duration.standard,
        }),
      }}
    >
      <Typography
        sx={{ 
          flex: '1 1 100%', 
          fontWeight: 600, 
          color: 'inherit' 
        }}
        variant="h6"
        component="div"
      >
        {numSelected > 0 ? `${numSelected} selected` : title}
      </Typography>

      <Button
        variant={numSelected > 0 ? "contained" : "outlined"}
        color={numSelected > 0 ? "error" : "inherit"}
        startIcon={numSelected > 0 ? <DeleteIcon /> : <AddIcon />}
        onClick={onActionClick}
        sx={{
          textTransform: 'none',
          fontWeight: 600,
          fontSize: '0.75rem',
          minWidth: 160,
          ...(numSelected === 0 && {
            borderColor: theme.palette.primary.contrastText,
            color: theme.palette.primary.contrastText,
            '&:hover': {
              backgroundColor: alpha(theme.palette.primary.contrastText, 0.15),
              borderColor: theme.palette.primary.contrastText,
            },
          }),
        }}
      >
        {numSelected > 0 ? 'Delete Selected' : 'Add New'}
      </Button>
    </Toolbar>
  );
};

export default function EnhancedDataTable({
  title,
  rows,
  headCells,
  defaultOrderBy = 'name',
  onAddClick,
  onDeleteClick,
}) {
  const theme = useTheme();
  const [order, setOrder] = React.useState('asc');
  const [orderBy, setOrderBy] = React.useState(defaultOrderBy);
  const [selected, setSelected] = React.useState([]);
  const [page, setPage] = React.useState(0);
  const [dense, setDense] = React.useState(false);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelected = rows.map((n) => n.id);
      setSelected(newSelected);
    } else {
      setSelected([]);
    }
  };

  const handleClick = (event, id) => {
    const selectedIndex = selected.indexOf(id);
    let newSelected = [];

    if (selectedIndex === -1) newSelected = [...selected, id];
    else newSelected = selected.filter((item) => item !== id);

    setSelected(newSelected);
  };

  const handleChangePage = (_, newPage) => setPage(newPage);
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleChangeDense = (event) => setDense(event.target.checked);

  const handleActionClick = () => {
    if (selected.length > 0) {
      if (onDeleteClick) onDeleteClick(selected);
      setSelected([]);
    } else {
      if (onAddClick) onAddClick();
    }
  };

  const visibleRows = React.useMemo(
    () =>
      [...rows]
        .sort(getComparator(order, orderBy))
        .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage),
    [order, orderBy, page, rowsPerPage, rows]
  );

  return (
    <Box sx={{ width: '100%' }}>
      <Paper sx={{ 
        width: '100%', 
        mb: 2, 
        borderRadius: 3, 
        boxShadow: theme.shadows[2],
        overflow: 'hidden',
        border: `1px solid ${theme.palette.divider}`,
      }}>
        <EnhancedTableToolbar
          numSelected={selected.length}
          title={title}
          onActionClick={handleActionClick}
        />
        <TableContainer
          sx={{
            borderRadius: '0 0 12px 12px',
            maxHeight: 'calc(100vh - 200px)',
            '&::-webkit-scrollbar': { 
              width: '8px', 
              height: '8px' 
            },
            '&::-webkit-scrollbar-thumb': { 
              backgroundColor: theme.palette.primary.main, 
              borderRadius: '4px' 
            },
            '&::-webkit-scrollbar-track': { 
              backgroundColor: theme.palette.grey[100] 
            }
          }}
        >
          <Table
            size={dense ? 'small' : 'medium'}
            sx={{
              minWidth: 750,
              '& .MuiTableCell-root': {
                borderBottom: `1px solid ${theme.palette.divider}`
              }
            }}
          >
            <EnhancedTableHead
              headCells={headCells}
              numSelected={selected.length}
              order={order}
              orderBy={orderBy}
              onSelectAllClick={handleSelectAllClick}
              onRequestSort={handleRequestSort}
              rowCount={rows.length}
            />
            <TableBody>
              {visibleRows.length > 0 ? (
                visibleRows.map((row, index) => {
                  const isItemSelected = selected.includes(row.id);
                  const labelId = `enhanced-table-checkbox-${index}`;

                  return (
                    <TableRow
                      hover
                      onClick={(event) => handleClick(event, row.id)}
                      role="checkbox"
                      aria-checked={isItemSelected}
                      tabIndex={-1}
                      key={row.id}
                      selected={isItemSelected}
                      sx={{
                        cursor: 'pointer',
                        '&.Mui-selected': {
                          backgroundColor: alpha(theme.palette.primary.main, 0.08),
                          '&:hover': { 
                            backgroundColor: alpha(theme.palette.primary.main, 0.12) 
                          },
                        },
                        '&.Mui-selected .MuiTableCell-root': {
                          color: theme.palette.primary.dark,
                          fontWeight: 600,
                        },
                        '&.Mui-selected .MuiCheckbox-root': {
                          color: theme.palette.primary.main,
                        },
                        '&:last-child td': { borderBottom: 0 },
                        '&:hover': { 
                          backgroundColor: theme.palette.action.hover 
                        }
                      }}
                    >
                      <TableCell padding="checkbox">
                        <Checkbox
                          color="primary"
                          checked={isItemSelected}
                          inputProps={{ 'aria-labelledby': labelId }}
                          sx={{
                            color: isItemSelected 
                              ? theme.palette.primary.main 
                              : theme.palette.action.disabled,
                            '&.Mui-checked': { 
                              color: theme.palette.primary.main 
                            },
                          }}
                        />
                      </TableCell>
                      {headCells.map((cell) => (
                        <TableCell
                          key={cell.id}
                          align={cell.numeric ? 'right' : 'left'}
                          padding={cell.disablePadding ? 'none' : 'normal'}
                          sx={{ 
                            color: isItemSelected 
                              ? theme.palette.primary.dark 
                              : theme.palette.text.primary, 
                            fontWeight: isItemSelected ? 600 : 'normal' 
                          }}
                        >
                          {row[cell.id]}
                        </TableCell>
                      ))}
                    </TableRow>
                  );
                })
              ) : (
                <TableRow>
                  <TableCell 
                    colSpan={headCells.length + 1} 
                    align="center" 
                    sx={{ 
                      py: 4, 
                      fontStyle: 'italic', 
                      color: theme.palette.text.secondary 
                    }}
                  >
                    No rows found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={rows.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          sx={{ 
            borderTop: `1px solid ${theme.palette.divider}`,
            '& .MuiTablePagination-selectLabel, & .MuiTablePagination-displayedRows': {
              color: theme.palette.text.primary,
            }
          }}
        />
      </Paper>
      <FormControlLabel
        control={<Switch checked={dense} onChange={handleChangeDense} />}
        label="Dense padding"
        sx={{
          ml: 1,
          '& .MuiTypography-root': { 
            fontSize: '0.875rem',
            color: theme.palette.text.primary 
          }
        }}
      />
    </Box>
  );
}

EnhancedTableHead.propTypes = {
  headCells: PropTypes.array.isRequired,
  numSelected: PropTypes.number.isRequired,
  onRequestSort: PropTypes.func.isRequired,
  onSelectAllClick: PropTypes.func.isRequired,
  order: PropTypes.string.isRequired,
  orderBy: PropTypes.string.isRequired,
  rowCount: PropTypes.number.isRequired,
};

EnhancedTableToolbar.propTypes = {
  numSelected: PropTypes.number.isRequired,
  title: PropTypes.string.isRequired,
  onActionClick: PropTypes.func.isRequired,
};

EnhancedDataTable.propTypes = {
  title: PropTypes.string.isRequired,
  rows: PropTypes.array.isRequired,
  headCells: PropTypes.array.isRequired,
  defaultOrderBy: PropTypes.string,
  onAddClick: PropTypes.func,
  onDeleteClick: PropTypes.func,
};