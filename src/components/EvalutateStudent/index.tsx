import { TextareaAutosize, Stack, Button, Typography, FormGroup, Radio, FormControlLabel, RadioGroup } from '@mui/material';

import React, { useEffect, ChangeEvent, FC, useState } from 'react';

import close from '~/assets/svg/Close.svg'
import style from './index.module.css'

import { network } from '~/utils/network'
import { useSendState } from '~/store/send';
import { useUtilsState } from '~/store/utils';
//需要默认传入一个open的boolean参数
interface IEvalutate {
    handleClose: () => void;
    activity_id: number;
    user_id: number;
}

const EvaluateStudent: FC<IEvalutate> = (props) => {
    //选择的评价
    let evaluate;
    if (props.user_id) {
        ({ data: evaluate } = network.teacher.useStudentEvaluate(props.activity_id, props.user_id));
    }
    const [selectedValue, setSelectedValue] = useState<string>('');
    const [evaluateValue, setEvaluateValue] = useState<string>('');
    const [setLevel, setTeacherSay, sendEvaluates, setActivityId, setUserId] = useSendState(state => [
        state.setState('level'),
        state.setState('teacherSay'),
        state.sendEvaluates,
        state.setState('activity_id'),
        state.setState('user_id')
    ])
    const [name] = useUtilsState(state => [
        state.name,
    ])
    const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
        setSelectedValue(event.target.value);
    }
    const handleInput = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
        setEvaluateValue(event.target.value);
        console.log(evaluateValue)
    }
    //副作用函数，在加载的时候自动刷新获取activity_id和user_id
    useEffect(() => {
        setActivityId(props.activity_id);
        setUserId(props.user_id);
    }, [])

    useEffect(() => {
        setLevel(parseInt(selectedValue));
        setTeacherSay(evaluateValue);
    }, [selectedValue, evaluateValue])
    return (
        <Stack>
            <Stack className={style.all} sx={{
                overflow: 'auto',
            }}
                onClick={(event: React.MouseEvent) => event.stopPropagation()}
            >
                <Stack className={style.popContainer}>
                    <Stack justifyContent='space-between' sx={{ pl: 2, pr: 2, pt: 1, pb: 1, position: 'sticky', top: 0, backgroundColor: 'white' }} spacing={7} className={style.titleBar} direction='row' alignItems='center'>
                        <Typography variant='h5'>
                            评价
                        </Typography>
                        <Stack sx={{ cursor: 'pointer' }} onClick={() => {
                            setUserId(0)
                            props.handleClose();
                        }
                        }>
                            <img src={close} alt="" />
                        </Stack>
                    </Stack>
                    <Stack className={style.studentsFeel} sx={{ ml: 2, mb: 1, mr: 2 }}>
                        {
                            props.user_id !== 0
                            &&
                            <Typography variant="h6">
                                {name ? name : '学生'}的心得体会
                            </Typography>
                        }

                        <Stack sx={{ fontSize: '16px' }}>
                            {evaluate?.comment}
                        </Stack>
                        <img src={evaluate?.image1} alt="" />
                        <img src={evaluate?.image2} alt="" />
                    </Stack>
                    <Stack className={style.teachersEvaluate} sx={{ ml: 2, mb: 2, mr: 2, mt: 1 }}>
                        <Typography variant='h6'>
                            教师评价
                        </Typography>
                        <Stack className={style.checkboxs} >
                            <FormGroup row >
                                <RadioGroup row aria-label='rating' name='rating' value={selectedValue} onChange={handleChange}>
                                    <FormControlLabel value={1} control={<Radio />} label="优秀" />
                                    <FormControlLabel value={2} control={<Radio />} label="合格" />
                                    <FormControlLabel value={3} control={<Radio />} label="不合格" />
                                </RadioGroup>
                            </FormGroup>
                        </Stack>
                        <Stack sx={{
                            mb: 3,
                            mt: 3
                        }} >
                            <TextareaAutosize
                                placeholder='学生的表现'
                                minRows={4}
                                maxRows={4}
                                onChange={handleInput}
                                className={style.textarea}
                            />
                        </Stack>
                        <Stack direction='row' justifyContent='center'>
                            <Button sx={{ width: '30%' }} variant='contained' onClick={async () => {
                                if (sendEvaluates()) {
                                    props.handleClose;
                                }
                            }}>确认</Button>
                        </Stack>
                    </Stack>
                </Stack>
            </Stack>
            <Stack className={style.mask} onClick={(event: React.MouseEvent) => { event.stopPropagation() }}>

            </Stack>
        </Stack >

    )
}




export default EvaluateStudent;