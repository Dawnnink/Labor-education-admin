import React, { useCallback, useMemo, useState } from 'react';
import {
    Stack,
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
    Divider,
    Button
} from '@mui/material';

import { ActivityStudentsProps } from '../ActivityStudents';
import { User } from '~/utils/types';

import CheckBoxIcon from '@mui/icons-material/CheckBox';
import CancelIcon from '@mui/icons-material/Cancel';
import { Button as Btn } from '@mui/material'
import { Space } from 'antd'
import dayjs from 'dayjs'

import { useSendState } from '~/store/send';
import { useEffect } from 'react'
import { Modal, Input, message } from 'antd'
import { network } from '../../utils/network'
import EmptyComponent from '../EmptyComponent';
interface FormData {
    name: string
    uid: string
    college: string
    classname: string
    participate_reason: string
    state: string
    changeNotice: boolean | null//用于确认是否收到通知
    isOperate: number//1是通过，2是打回
    user_id: number//这个不展示，只是用于发请求
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
    a: { [key in Key]: number | string | boolean | null },
    b: { [key in Key]: number | string | boolean | null },
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
        label: '姓名'
    },
    {
        id: 'uid',
        numeric: false,
        disablePadding: false,
        label: '学号',
    },
    {
        id: 'college',
        numeric: false,
        disablePadding: false,
        label: '学院',
    },
    {
        id: 'classname',
        numeric: false,
        disablePadding: false,
        label: '专业班级',
    },
    {
        id: 'participate_reason',
        numeric: false,
        disablePadding: false,
        label: '申请理由',
    },
    {
        id: 'state',
        numeric: false,
        disablePadding: false,
        label: '活动状态',
    },
    {
        id: 'isOperate',
        numeric: false,
        disablePadding: false,
        label: '操作'
    }
]

interface EnhancedTableProps {
    onRequestSort: (event: React.MouseEvent<unknown>, property: keyof FormData) => void;//当用户请求进行排序就用这个事件处理函数
    order: Order;//表示排序顺序‘asc’ 和上面那个，自己去看，我定义了的
    orderBy: string;//表示当前排序的字段，类型为字符串
    onSelectAllClick: (event: React.ChangeEvent<HTMLInputElement>) => void;//表示data对象的键之一
    rowCount: number;//表示数据行数
    numSelected: number;//表示选中的项目数量
}
function EnhancedTableHead(props: EnhancedTableProps) {
    const { order, orderBy, onRequestSort, onSelectAllClick, numSelected, rowCount } = props;
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
                            {
                                headCell.id === 'isOperate' ?
                                    <Box>
                                        {headCell.label}
                                    </Box>
                                    :
                                    <TableSortLabel
                                        active={orderBy === headCell.id}
                                        direction={orderBy === headCell.id ? order : 'asc'}
                                        onClick={createSortHandler(headCell.id)}
                                    >
                                        {headCell.label}
                                    </TableSortLabel>
                            }
                        </TableCell>
                    ))
                }
            </TableRow>
        </TableHead>
    )
}

interface EnhancedTableToolbarProps {
    students: {
        participate_time: string // ISO 8601
        participate_reason: string
        comment: string
        state: '报名成功' | '报名失败' | '报名审核中'
        check_in: string // ISO 8601
        check_out: string//签退
        notified: boolean | null //null不用通知，true已确认通知 false未确认通知
        user: User
        reject_reason: string//打回原因
    }[]
    canOperate: boolean
    canBack: boolean
}

function EnhancedTableToolbar(props: EnhancedTableToolbarProps) {
    const [showModal, setShowModal] = useState(false);//控制打回审核输入原因的Modal.
    const [reason, sendPass, sendReject, sendBack] = useSendState(state => [
        state.reason,
        state.sendPass,
        state.sendReject,
        state.sendBack
    ])
    const [setReason] = useSendState(state => [
        state.setState('reason'),
    ])
    const handleOk = () => {
        if (reason === '暂无原因') {
            message.info('请输入打回原因')
            return;
        }
        setShowModal(false);
        setTimeout(sendReject, 500)
    }
    const handleCancel = () => {
        setShowModal(false);
    }
    const handlePut = (e: React.ChangeEvent<HTMLInputElement>) => {
        setReason(e.target.value)
    }
    return (
        <Toolbar
            sx={{
                p1: { sm: 2 },
                pr: { xs: 1, sm: 1 },
            }}
        >
            <Stack
                direction='row'
                alignItems='center'
                justifyContent='flex-end'
                sx={{
                    width: '100%',
                    mr: 4
                }}
            >
                <Button
                    onClick={() => {
                        setShowModal(true);
                    }}
                    disabled={props.canOperate}
                >拒绝审核</Button>
                <Divider orientation='vertical' flexItem />
                <Button
                    onClick={sendPass}
                    disabled={props.canOperate}
                >通过审核</Button>
                <Divider orientation='vertical' flexItem />
                <Button
                    onClick={sendBack}
                    disabled={props.canBack}
                >签退</Button>
            </Stack>
            <Modal
                title="请输入打回理由"
                open={showModal}
                onOk={handleOk}
                onCancel={handleCancel}
            >
                <Input onChange={handlePut} max={30} />
            </Modal>
        </Toolbar>
    )
}

export const ActivityStudents = ({ students, id, activity }: ActivityStudentsProps) => {
    //state定义
    const [canOperate, setCanOperate] = useState(true);//控制能否进行操作，假设没有选中学生则无法进行操作
    const [canBack, setCanBack] = useState(true);//控制能否进行签退
    const [order, setOrder] = useState<Order>('asc')
    const [orderBy, setOrderBy] = useState<keyof FormData>('name')
    const [selected, setSelected] = useState<readonly string[]>([])
    const [page, setPage] = useState(0)
    const [rowsPerPage, setRowsPerPage] = useState(10)
    const [isOperate, setIsOperate] = useState(0);//0代表没有操作，1代表可以学生的通过和打回，2代表可以签退，3代表无法签退
    const [showModal, setShowModal] = useState(false)
    const [activity_id, setAcitvityId] = useSendState(state => [
        state.activity_id,
        state.setState('activity_id')
    ])
    const [reason, setReason, sendPass, sendReject, sendBack, setStudents, setUserId] = useSendState(state => [
        state.reason,
        state.setState('reason'),
        state.sendPass,
        state.sendReject,
        state.sendBack,
        state.setState('students'),
        state.setState('user_id')
    ])
    const handleOk = () => {
        if (reason === '暂无原因') {
            message.info('请输入打回原因')
            return;
        }
        setShowModal(false);
        setTimeout(sendReject, 500)
    }
    const handleCancel = () => {
        setShowModal(false);
    }
    const handlePut = (e: React.ChangeEvent<HTMLInputElement>) => {
        setReason(e.target.value)
    }
    const handleRequestSort = (
        event: React.MouseEvent<unknown>,
        property: keyof FormData,
    ) => {
        const isAsc = orderBy === property && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc')
        setOrderBy(property)
        console.log(event)
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
        console.log(event)
    }

    const handleChangePage = (
        event: unknown,
        newPage: number
    ) => {
        setPage(newPage);
        console.log(event)
    }
    const handleChangeRowsPerPage = (
        event: React.ChangeEvent<HTMLInputElement>
    ) => {
        setRowsPerPage(parseInt(event.target.value, 10))
        setPage(0)
    }

    const isSelected = (name: string) => selected.indexOf(name) !== -1;


    //mui的table组件的转化表格第一行的数据，将其作为缓存函数
    const createFormData = useCallback((
        name: string,
        uid: string,
        college: string,
        classname: string,
        participate_reason: string,
        state: string,
        changeNotice: boolean | null,
        isOperate: number,
        user_id: number
    ): FormData => {
        return {
            name,
            uid,
            college,
            classname,
            participate_reason,
            state,
            changeNotice,
            isOperate,
            user_id,
        };
    }, [])
    //将拿来的数据搞一下
    const rows = useMemo(() => {
        return students.map((item) => {
            //如果正在审核中，则显示操作按钮，可以打回或者通过
            if (item.state === '报名审核中') {
                setIsOperate(1);
            }
            //判断状态,首先判断是否开始活动
            const date = dayjs();//获取现在的时间
            let State = '';//设置一个状态值作为最后return值/
            //已知item.state只会为审核成功,审核失败，报名审核中
            if (item.state === '报名审核中') {
                State = '等待审核中'
            }
            else {
                State = item.state
            }
            //假设还没有报名成功，那么他该是什么就是什么
            if (item.state === '报名成功' && date.isAfter(dayjs(activity.activity_start_time))) {
                if (!item.check_in) {
                    //还没有进行签到
                    State = '未签到'
                } else if (item.check_in && !item.check_out) {
                    State = '待签退'
                } else if (item.check_out && item.check_out) {
                    State = '已签退'
                } else {
                    State = '报名成功'
                }
            }
            //如果说已经签到了，应该就可以签退了
            if (State === '待签退') {
                setIsOperate(2)
            } else if (State === '未签到' || State === '已签退') {
                setIsOperate(3)
            }

            return createFormData(
                item.user.name,
                item.user.uid,
                item.user.college,
                item.user.class,
                item.participate_reason,
                State,
                item.notified,
                isOperate,
                item.user.id
            )
        })
    }, []);
    const emptyRows =
        page > 0 ? Math.max(0, (1 + page) * rowsPerPage - rows.length) : 0;
    //可以看到的表格的数据
    const visibleRows = useMemo(
        () => {
            return stableSort(rows, getComparator(order, orderBy)).slice(
                page * rowsPerPage,
                page * rowsPerPage + rowsPerPage,
            );
        }, [order, orderBy, page, rowsPerPage])
    //对选中的人的数据进行一个筛选，传给tableTool用来对选中的学生的信息进行操作
    const filterStudents = useMemo(() => {
        return students.filter((item) => {
            return selected.includes(item.user.name)
        })
    }, [selected, students])
    useEffect(() => {
        setCanOperate(true);
        setCanBack(true);
        setStudents(filterStudents);//将选中的学生庶几乎放入
        if (filterStudents.length > 0) {
            //如果选中的学生大于0
            if (dayjs().isAfter(dayjs(activity.registration_start_time)) && dayjs().isBefore(dayjs(activity.activity_start_time))) {
                //如果是在报名开始时间和活动结束时间 范围内
                //这个时间范围内是可以操控进行报名通过和报名打回的
                let flag = false;
                filterStudents.map((item) => {
                    if (item.state === '报名审核中') {
                        flag = true;
                    }
                })
                if (flag) setCanOperate(false);
            }
            if (dayjs().isAfter(dayjs(activity.activity_start_time))) {
                //活动开始之后可以进行签退
                //这个时间范围内是可以进行操控是否进行签退的
                let flag = false;//判断是否可进行签退
                filterStudents.map((item) => {
                    if (
                        //只有这三种才能签退
                        item.state === '报名成功'
                        &&
                        item.check_in
                        &&
                        !item.check_out
                    ) flag = true;
                })
                if (flag) {
                    setCanBack(false);
                }
            }
        }
    }, [filterStudents])

    useEffect(() => {
        //在组件最初渲染的时候将activity_id加入状态存储库
        setAcitvityId(id)
    }, [id, setAcitvityId, ...students.map(item => item.notified)])
    return (
        <Box sx={{ width: '100%' }}>
            <Paper sx={{ width: '100%', mb: 2 }}>
                {/* 工具栏 */}
                <EnhancedTableToolbar students={filterStudents} canOperate={canOperate} canBack={canBack} />
                {
                    visibleRows.length === 0 ?
                        <EmptyComponent message="暂无学生" />
                        :
                        <TableContainer>
                            <Table
                                sx={{ minWidth: 750 }}
                                aria-labelledby='tableTitle'
                            >
                                <EnhancedTableHead
                                    numSelected={selected.length}
                                    rowCount={rows.length}
                                    onSelectAllClick={handleSelectAllClick}
                                    order={order}
                                    orderBy={orderBy}
                                    onRequestSort={handleRequestSort}
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
                                                    <TableCell align='left'>{row.uid}</TableCell>
                                                    <TableCell align='left'>{row.college}</TableCell>
                                                    <TableCell align='left'>{row.classname}</TableCell>
                                                    <TableCell align='left'>{row.participate_reason}</TableCell>
                                                    <TableCell align='left'>{row.state}</TableCell>
                                                    {isOperate === 1 ?
                                                        <TableCell align='left' >
                                                            <Box
                                                                sx={{
                                                                    zIndex: 10000
                                                                }}
                                                            >
                                                                <Space>
                                                                    <Btn

                                                                        variant='outlined'
                                                                        startIcon={<CheckBoxIcon />}
                                                                        color='success'
                                                                        onClick={(event: React.MouseEvent) => {
                                                                            event.stopPropagation();//防止点击穿透
                                                                            setUserId(row.user_id)
                                                                            sendPass();
                                                                        }}
                                                                    >
                                                                        通过
                                                                    </Btn>
                                                                    <Btn
                                                                        variant='outlined'
                                                                        startIcon={<CancelIcon />}
                                                                        color='error'
                                                                        onClick={(event: React.MouseEvent) => {
                                                                            event.stopPropagation();//防止点击穿透
                                                                            setUserId(row.user_id)
                                                                            setShowModal(true)
                                                                        }}
                                                                    >
                                                                        打回
                                                                    </Btn>
                                                                </Space>

                                                            </Box>
                                                        </TableCell>
                                                        :
                                                        (
                                                            (isOperate === 2 || row.isOperate === 3) ?
                                                                <TableCell align='left' >
                                                                    <Box
                                                                        sx={{
                                                                            zIndex: 10000
                                                                        }}
                                                                    >
                                                                        <Btn
                                                                            variant='outlined'
                                                                            startIcon={<CheckBoxIcon />}
                                                                            color='success'
                                                                            onClick={(event: React.MouseEvent) => {
                                                                                event.stopPropagation();//防止点击穿透
                                                                                setUserId(row.user_id)
                                                                                sendBack();
                                                                            }}
                                                                            disabled={isOperate === 3 ? true : false}
                                                                        >
                                                                            签退
                                                                        </Btn>
                                                                    </Box>
                                                                </TableCell>
                                                                :
                                                                null
                                                        )
                                                    }
                                                    {
                                                        row.changeNotice === true || row.changeNotice === false
                                                        &&
                                                        <TableCell align='left'>
                                                            <Box
                                                                sx={{
                                                                    display: 'flex',
                                                                    flexDirection: 'row',
                                                                    justifyContent: 'center',
                                                                    alignItems: 'center',
                                                                }}
                                                            >
                                                                <Typography>{row.changeNotice ? "已确认" : "未确认"}</Typography>
                                                                <Button
                                                                    onClick={async () => {
                                                                        await network.teacher.useNotice(activity_id, row.user_id)
                                                                            .then(() => {
                                                                                message.success('成功发送')
                                                                            })
                                                                            .catch(() => {
                                                                                message.error('网络故障')
                                                                            })
                                                                    }}
                                                                >
                                                                    再次发送
                                                                </Button>
                                                            </Box>
                                                        </TableCell>
                                                    }
                                                </TableRow>
                                            )
                                        })
                                    }
                                    {emptyRows > 0
                                        &&
                                        (
                                            <TableRow>
                                                <TableCell colSpan={6} />
                                            </TableRow>
                                        )
                                    }
                                </TableBody>
                            </Table>
                        </TableContainer>
                }

                <Stack
                    direction='row'
                    alignItems='center'
                    justifyContent='flex-end'
                >
                    <TablePagination
                        component='div'
                        count={rows.length}
                        rowsPerPage={rowsPerPage}
                        page={page}
                        onPageChange={handleChangePage}
                        onRowsPerPageChange={handleChangeRowsPerPage}
                    />
                    <Box sx={{ mr: 3 }}>{page + 1} / {Math.floor(rows.length / rowsPerPage + 1)}</Box>
                </Stack>
            </Paper>
            <Modal
                title="请输入打回理由"
                open={showModal}
                onOk={handleOk}
                onCancel={handleCancel}
            >
                <Input onChange={handlePut} max={30} />
            </Modal>
        </Box>
    )
}