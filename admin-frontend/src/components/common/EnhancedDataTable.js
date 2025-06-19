import * as React from 'react';
import PropTypes from 'prop-types';
import {
  Box, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TablePagination,
  TableRow, TableSortLabel, Checkbox, Toolbar, Typography, Button,
  FormControlLabel, Switch,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import { visuallyHidden } from '@mui/utils';

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
  const createSortHandler = (property) => (event) => onRequestSort(event, property);

  return (
    <TableHead>
      <TableRow sx={{ backgroundColor: '#1976d2' }}>
        <TableCell padding="checkbox" sx={{ backgroundColor: 'inherit' }}>
          <Checkbox
            color="primary"
            indeterminate={numSelected > 0 && numSelected < rowCount}
            checked={rowCount > 0 && numSelected === rowCount}
            onChange={onSelectAllClick}
            sx={{
              color: 'white',
              '&.Mui-checked': { color: 'white' },
              '&.MuiCheckbox-indeterminate': { color: 'white' }
            }}
          />
        </TableCell>
        {headCells.map((headCell) => (
          <TableCell
            key={headCell.id}
            align={headCell.numeric ? 'right' : 'left'}
            padding={headCell.disablePadding ? 'none' : 'normal'}
            sortDirection={orderBy === headCell.id ? order : false}
            sx={{ backgroundColor: 'inherit', color: 'white', fontWeight: 600, fontSize: '0.875rem' }}
          >
            <TableSortLabel
              active={orderBy === headCell.id}
              direction={orderBy === headCell.id ? order : 'asc'}
              onClick={createSortHandler(headCell.id)}
              sx={{
                color: 'white !important',
                '&:hover': { color: 'white !important' },
                '&.Mui-active': { color: 'white !important' },
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
  return (
    <Toolbar
      sx={{
        pl: { sm: 2 },
        pr: { xs: 1, sm: 1 },
        bgcolor: numSelected > 0 ? '#e3f2fd' : '#1976d2',
        borderRadius: '12px 12px 0 0',
        color: numSelected > 0 ? 'black' : 'white',
        minHeight: '64px',
        display: 'flex',
        justifyContent: 'space-between',
        transition: 'all 0.3s ease',
      }}
    >
      <Typography
        sx={{ flex: '1 1 100%', fontWeight: 600, color: 'inherit' }}
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
          fontSize: '0.75rem', // reduced text size
          minWidth: 160, // increased width
          ...(numSelected === 0 && {
            borderColor: 'white',
            color: 'white',
            '&:hover': {
              backgroundColor: 'rgba(255,255,255,0.15)',
              borderColor: 'white',
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
      setSelected([]); // clear selection after delete
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
      <Paper sx={{ width: '100%', mb: 2, borderRadius: 3, boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.1)', overflow: 'hidden' }}>
        <EnhancedTableToolbar
          numSelected={selected.length}
          title={title}
          onActionClick={handleActionClick}
        />
        <TableContainer
          sx={{
            borderRadius: '0 0 12px 12px',
            maxHeight: 'calc(100vh - 200px)',
            '&::-webkit-scrollbar': { width: '8px', height: '8px' },
            '&::-webkit-scrollbar-thumb': { backgroundColor: '#1976d2', borderRadius: '4px' },
            '&::-webkit-scrollbar-track': { backgroundColor: '#f1f1f1' }
          }}
        >
          <Table
            size={dense ? 'small' : 'medium'}
            sx={{
              minWidth: 750,
              '& .MuiTableCell-root': {
                borderBottom: '1px solid rgba(224, 224, 224, 0.5)'
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
                          backgroundColor: '#e3f2fd',
                          '&:hover': { backgroundColor: '#bbdefb' },
                        },
                        '&.Mui-selected .MuiTableCell-root': {
                          color: '#1976d2',
                          fontWeight: 600,
                        },
                        '&.Mui-selected .MuiCheckbox-root': {
                          color: '#1976d2',
                        },
                        '&:last-child td': { borderBottom: 0 },
                        '&:hover': { backgroundColor: '#f5f5f5' }
                      }}
                    >
                      <TableCell padding="checkbox">
                        <Checkbox
                          color="primary"
                          checked={isItemSelected}
                          inputProps={{ 'aria-labelledby': labelId }}
                          sx={{
                            color: isItemSelected ? '#1976d2' : 'rgba(0, 0, 0, 0.54)',
                            '&.Mui-checked': { color: '#1976d2' },
                          }}
                        />
                      </TableCell>
                      {headCells.map((cell) => (
                        <TableCell
                          key={cell.id}
                          align={cell.numeric ? 'right' : 'left'}
                          padding={cell.disablePadding ? 'none' : 'normal'}
                          sx={{ color: isItemSelected ? '#1976d2' : 'inherit', fontWeight: isItemSelected ? 600 : 'normal' }}
                        >
                          {row[cell.id]}
                        </TableCell>
                      ))}
                    </TableRow>
                  );
                })
              ) : (
                <TableRow>
                  <TableCell colSpan={headCells.length + 1} align="center" sx={{ py: 4, fontStyle: 'italic', color: 'gray' }}>
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
          sx={{ borderTop: '1px solid rgba(224, 224, 224, 1)' }}
        />
      </Paper>
      <FormControlLabel
        control={<Switch checked={dense} onChange={handleChangeDense} />}
        label="Dense padding"
        sx={{
          ml: 1,
          '& .MuiTypography-root': { fontSize: '0.875rem' }
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
