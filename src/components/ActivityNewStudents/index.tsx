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
    const descendingComparator = useCallback((a: any, b: any, orderBy: keyof any) => {
        if (b[orderBy] < a[orderBy]) {
            return -1;
        }
        if (b[orderBy] > a[orderBy]) {
            return 1;
        }
        return 0;
    }, []);

    console.log(students, id)
    return (
        <Box>

        </Box>
    )
}