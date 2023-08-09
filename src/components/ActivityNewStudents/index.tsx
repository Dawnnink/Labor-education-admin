import React, { useCallback, useMemo } from 'react';
import { alpha } from '@mui/material/styles';
import {
    Box,
    Table,
    TableBody,
    TableCell,
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
    numSelected: number;
    onRequestSort: (event: React.MouseEvent<unknown>, property: keyof Data) => void;
    onSelectAllClick: (event: React.ChangeEvent<HTMLInputElement>) => void;
    order: Order;
    orderBy: string;
    rowCount: number;
}
export const ActivityStudents = ({ students, id }: ActivityStudentsProps) => {
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

    console.log(students, id)
    return (
        <Box>

        </Box>
    )
}