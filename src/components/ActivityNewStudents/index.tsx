import React, { useCallback, useMemo, useState } from 'react';
import { alpha } from '@mui/material/styles';
import {
    Box,
    Table,
    TableBody,
    TableCell,
    TableSortLabel,
    TableContainer,
    TableHead,
    TablePagination,
    TableRow,
    Toolbar,
    Typography,
    Paper,
    Checkbox,
    IconButton,
    Tooltip,
    FormControlLabel,
    Switch,//用于开启密集填充
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import FilterListIcon from '@mui/icons-material/FilterList';
import { visuallyHidden } from '@mui/utils';

import { ActivityStudentsProps } from '../ActivityStudents';
// interface ActivityStudentsProps {
//     students: {
//       participate_time: string // ISO 8601
//       participate_reason: string
//       comment: string
//       state: '报名成功' | '报名失败' | '报名审核中'
//       check_in: string // ISO 8601
//       user: User
//     }[]
//     id: number
//   }

// export interface User {
//     id: number
//     name: string
//     uid: string
//     avatar: string
//     college: string
//     sex: '男' | '女'
//     class?: string
//     phone_number: string
//   }
interface FormData {
    name: string
    uid: string
    college: string
    classname: string
    participate_reason: string
    state: '报名成功' | '报名失败' | '报名审核中'
}

type Order = 'asc' | 'desc';

//排序函数
function descendingComparator<T>(a: T, b: T, orderBy: keyof T) {
    if (b[orderBy] < a[orderBy]) {
        return -1;
    }
    if (b[orderBy] > a[orderBy]) {
        return 1;
    }
    return 0;
}

function getComparator<Key extends keyof any>(
    order: Order,
    orderBy: Key,
): (
    a: { [key in Key]: number | string },
    b: { [key in Key]: number | string },
) => number {
    return order === 'desc'
        ? (a, b) => descendingComparator(a, b, orderBy)
        : (a, b) => -descendingComparator(a, b, orderBy);
}

function stableSort<T>(array: readonly T[], comparator: (a: T, b: T) => number) {
    const stabilizedThis = array.map((el, index) => [el, index] as [T, number]);
    stabilizedThis.sort((a, b) => {
        const order = comparator(a[0], b[0]);
        if (order !== 0) {
            return order;
        }
        return a[1] - b[1];
    });
    return stabilizedThis.map((el) => el[0]);
}

interface HeadCell {
    disablePadding: boolean;
    id: keyof FormData;
    label: string;
    numeric: boolean;
}

const headCells: readonly HeadCell[] = [
    {
        id: 'name',
        numeric: false,
        disablePadding: true,
        label: 'name'
    },
    {
        id: 'uid',
        numeric: true,
        disablePadding: false,
        label: 'Protein (g)',
    },
    {
        id: 'college',
        numeric: true,
        disablePadding: false,
        label: 'Protein (g)',
    },
    {
        id: 'classname',
        numeric: true,
        disablePadding: false,
        label: 'Protein (g)',
    },
    {
        id: 'participate_reason',
        numeric: true,
        disablePadding: false,
        label: 'Protein (g)',
    },
    {
        id: 'state',
        numeric: true,
        disablePadding: false,
        label: 'Protein (g)',
    },
]

interface EnhancedTableProps {
    numSelected: number;//表示选中的项目数量
    onRequestSort: (event: React.MouseEvent<unknown>, property: keyof FormData) => void;//当用户请求进行排序就用这个事件处理函数
    onSelectAllClick: (event: React.ChangeEvent<HTMLInputElement>) => void;//表示data对象的键之一
    order: Order;//表示排序顺序‘asc’ 和上面那个，自己去看，我定义了的
    orderBy: string;//表示当前排序的字段，类型为字符串
    rowCount: number;//表示数据行数
}
function EnhancedTableHead(props: EnhancedTableProps) {
    const { onSelectAllClick, order, orderBy, numSelected, rowCount, onRequestSort } = props;
    const createSortHandler = (
        property: keyof FormData
    ) => (
        event: React.MouseEvent<unknown>
    ) => {
            onRequestSort(event, property);
        }

    return (
        <TableHead>
            <TableRow>
                <TableCell padding='checkbox'>
                    <Checkbox
                        color='primary'
                        indeterminate={numSelected > 0 && numSelected < rowCount}
                        checked={rowCount > 0 && numSelected === rowCount}
                        onChange={onSelectAllClick}
                        inputProps={{
                            'aria-label': 'select all'
                        }}
                    />
                </TableCell>
                {
                    headCells.map((headCell) => (
                        <TableCell
                            key={headCell.id}
                            align={headCell.numeric ? 'right' : 'left'}
                            padding={headCell.disablePadding ? 'none' : 'normal'}
                            sortDirection={orderBy === headCell.id ? order : false}
                        >
                            <TableSortLabel
                                active={orderBy === headCell.id}
                                direction={orderBy === headCell.id ? order : 'asc'}
                                onClick={createSortHandler(headCell.id)}
                            >
                                {headCell.label}
                                {orderBy === headCell.id ?
                                    (
                                        <Box>
                                            {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                                        </Box>
                                    ) : null
                                }
                            </TableSortLabel>
                        </TableCell>
                    ))
                }
            </TableRow>
        </TableHead>
    )
}

interface EnhancedTableToolbarProps {
    numSelected: number
}

function EnhancedTableToolbar(props: EnhancedTableToolbarProps) {
    const { numSelected } = props;

    return (
        <Toolbar
            sx={{
                p1: { sm: 2 },
                pr: { xs: 1, sm: 1 },
                ...(numSelected > 0
                    &&
                {
                    bgcolor: (theme) =>
                        alpha(theme.palette.primary.main, theme.palette.action.activatedOpacity),
                }
                ),
            }}
        >
            {
                numSelected > 0 ?
                    (
                        <Typography
                            sx={{ flex: '1 1 100%' }}
                            color='inherit'
                            variant='subtitle1'
                            component='div'
                        >
                            {numSelected} selected
                        </Typography>
                    )
                    :
                    (
                        <Typography
                            sx={{ flex: '1 1 100%' }}
                            variant="h6"
                            id="tableTitle"
                            component="div"
                        >
                            Nutrition
                        </Typography>
                    )
            }
            {
                numSelected > 0 ?
                    (
                        <Tooltip title="Delete">
                            <IconButton>
                                <DeleteIcon />
                            </IconButton>
                        </Tooltip>
                    )
                    :
                    (
                        <Tooltip title="Filter list">
                            <IconButton>
                                <FilterListIcon />
                            </IconButton>
                        </Tooltip>
                    )
            }
        </Toolbar>
    )
}

export const ActivityStudents = ({ students, id }: ActivityStudentsProps) => {
    //state定义
    const [order, setOrder] = useState<Order>('asc')
    const [orderBy, setOrderBy] = useState<keyof FormData>('name')
    const [selected, setSelected] = useState<readonly string[]>([])
    const [page, setPage] = useState(0)
    const [dense, setDense] = useState(false)
    const [rowsPerPage, setRowsPerPage] = useState(5)

    const handleRequestSort = (
        event: React.MouseEvent<unknown>,
        property: keyof FormData,
    ) => {
        const isAsc = orderBy === property && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc')
        setOrderBy(property)
    }

    const handleSelectAllClick = (
        event: React.ChangeEvent<HTMLInputElement>,
    ) => {
        if (event.target.checked) {
            const newSelected = rows.map((n) => n.name)
            setSelected(newSelected);
            return;
        }
        setSelected([]);
    }

    const handleClick = (
        event: React.MouseEvent<unknown>,
        name: string,
    ) => {
        const selectedIndex = selected.indexOf(name);
        let newSelected: readonly string[] = [];

        if (selectedIndex === -1) {
            newSelected = newSelected.concat(selected, name);
        } else if (selectedIndex === 0) {
            newSelected = newSelected.concat(selected.slice(1));
        } else if (selectedIndex === selected.length - 1) {
            newSelected = newSelected.concat(selected.slice(0, -1));
        } else if (selectedIndex > 0) {
            newSelected = newSelected.concat(
                selected.slice(0, selectedIndex),
                selected.slice(selectedIndex + 1),
            )
        }
        setSelected(newSelected);
    }

    const handleChangePage = (
        event: unknown,
        newPage: number
    ) => {
        setPage(newPage);
    }

    const handleChangeRowsPerPage = (
        event: React.ChangeEvent<HTMLInputElement>
    ) => {
        setRowsPerPage(parseInt(event.target.value, 10))
        setPage(0)
    }

    const handleChangeDense = (
        event: React.ChangeEvent<HTMLInputElement>,
    ) => {
        setDense(event.target.checked)
    }

    const isSelected = (name: string) => selected.indexOf(name) !== -1;


    //mui的table组件的转化表格第一行的数据，将其作为缓存函数
    const createFormData = useCallback((
        name: string,
        uid: string,
        college: string,
        classname: string,
        participate_reason: string,
        state: '报名成功' | '报名失败' | '报名审核中',
    ): FormData => {
        return {
            name,
            uid,
            college,
            classname,
            participate_reason,
            state,
        };
    }, [])
    //将拿来的数据搞一下
    const rows = useMemo(() => {
        return students.map((item) => {
            return createFormData(
                item.user.name,
                item.user.uid,
                item.user.college,
                item.user.classname,
                item.participate_reason,
                item.state
            )
        })
    }, []);

    const emptyRows =
        page > 0 ? Math.max(0, (1 + page) * rowsPerPage - rows.length) : 0;

    const visibleRows = useMemo(
        () => {
            return stableSort(rows, getComparator(order, orderBy)).slice(
                page * rowsPerPage,
                page * rowsPerPage + rowsPerPage,
            );
        }, [order, orderBy, page, rowsPerPage])
    console.log(students, id)


    return (
        <Box sx={{ width: '100%' }}>
            <Paper sx={{ width: '100%', mb: 2 }}>
                {/* 工具栏 */}
                <EnhancedTableToolbar numSelected={selected.length} />
                <TableContainer>
                    <Table
                        sx={{ minWidth: 750 }}
                        aria-labelledby='tableTitle'
                        size={dense ? 'small' : 'medium'}
                    >
                        <EnhancedTableHead
                            numSelected={selected.length}
                            order={order}
                            orderBy={orderBy}
                            onSelectAllClick={handleSelectAllClick}
                            onRequestSort={handleRequestSort}
                            rowCount={rows.length}
                        />
                        <TableBody>
                            {
                                visibleRows.map((row, index) => {
                                    const isItemSelected = isSelected(row.name);
                                    const labelId = `enhanced-table-checkbox-${index}`
                                    return (
                                        <TableRow
                                            hover
                                            onClick={(event) => handleClick(event, row.name)}
                                            role='checkbox'
                                            aria-checked={isItemSelected}
                                            tabIndex={-1}
                                            key={row.name}
                                            selected={isItemSelected}
                                            sx={{ cursor: 'pointer' }}
                                        >
                                            <TableCell padding='checkbox'>
                                                <Checkbox
                                                    color='primary'
                                                    checked={isItemSelected}
                                                    inputProps={{
                                                        'aria-labelledby': labelId
                                                    }}
                                                />
                                            </TableCell>
                                            <TableCell
                                                component="th"
                                                id={labelId}
                                                scope='row'
                                                padding='none'
                                            >
                                                {row.name}
                                            </TableCell>
                                            <TableCell align='right'>{row.name}</TableCell>
                                            <TableCell align='right'>{row.uid}</TableCell>
                                            <TableCell align='right'>{row.college}</TableCell>
                                            <TableCell align='right'>{row.classname}</TableCell>
                                            <TableCell align='right'>{row.participate_reason}</TableCell>
                                            <TableCell align='right'>{row.state}</TableCell>
                                        </TableRow>
                                    )
                                })
                            }
                            {emptyRows > 0
                                &&
                                (
                                    <TableRow
                                        style={{
                                            height: (dense ? 33 : 53) * emptyRows,
                                        }}>
                                        <TableCell colSpan={6} />
                                    </TableRow>
                                )
                            }
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
                />
            </Paper>
            <FormControlLabel
                control={<Switch checked={dense} onChange={handleChangeDense} />}
                label='紧凑排序'
            />
        </Box>
    )
}