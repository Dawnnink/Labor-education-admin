import { Stack, Button, Typography, FormGroup, Radio, FormControlLabel, RadioGroup } from '@mui/material';
import { Textarea } from '@mui/joy'

import { ChangeEvent, FC, useState } from 'react';

import close from '~/assets/svg/Close.svg'
import style from './index.module.css'
//需要默认传入一个open的boolean参数
interface IEvalutate {
    open: boolean;
}

const EvaluateStudent: FC<IEvalutate> = (props) => {
    //选择的评价
    const [selectedValue, setSelectedValue] = useState('');
    //设置弹窗的打开或者关闭，默认关闭
    const [open, setOpen] = useState<boolean>(props.open);

    const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
        setSelectedValue(event.target.value);
        console.log(selectedValue);
    }

    const handleClose = () => {
        setOpen(false);
    }
    if (open) {
        return (
            <Stack>
                <Stack className={style.all} sx={{
                    overflow: 'auto',
                }}>
                    <Stack className={style.popContainer}>
                        <Stack justifyContent='space-between' sx={{ pl: 2, pr: 2, pt: 1, pb: 1, position: 'sticky', top: 0, backgroundColor: 'white' }} spacing={7} className={style.titleBar} direction='row' alignItems='center'>
                            <Typography variant='h5'>
                                评价
                            </Typography>
                            <Stack sx={{ cursor: 'pointer' }} onClick={handleClose}>
                                <img src={close} alt="" />
                            </Stack>
                        </Stack>
                        <Stack className={style.studentsFeel} sx={{ ml: 2, mb: 1, mr: 2 }}>
                            <Typography variant="h6">
                                学生心得体会
                            </Typography>
                            <Stack sx={{ fontSize: '12px' }}>
                                感觉很好感觉很好感觉很好，感觉很好，很好很好很好
                                感觉很好感觉很好感觉很好，感觉很好，很好很好很好
                                感觉很好感觉很好感觉很好，感觉很好，很好很好很好
                                感觉很好感觉很好感觉很好，感觉很好，很好很好很好
                                感觉很好感觉很好感觉很好，感觉很好，很好很好很好
                                感觉很好感觉很好感觉很好，感觉很好，很好很好很好
                                感觉很好感觉很好感觉很好，感觉很好，很好很好很好
                                感觉很好感觉很好感觉很好，感觉很好，很好很好很好
                                感觉很好感觉很好感觉很好，感觉很好，很好很好很好
                                感觉很好感觉很好感觉很好，感觉很好，很好很好很好
                                感觉很好感觉很好感觉很好，感觉很好，很好很好很好
                            </Stack>
                            <img src="" alt="" />
                        </Stack>
                        <Stack className={style.teachersEvaluate} sx={{ ml: 2, mb: 2, mr: 2 }}>
                            <Typography variant='h6' sx={{ mt: 2, mb: 2 }}>
                                教师评价
                            </Typography>
                            <Stack className={style.checkboxs} >
                                <FormGroup row >
                                    <RadioGroup row aria-label='rating' name='rating' value={selectedValue} onChange={handleChange}>
                                        <FormControlLabel value='excellent' control={<Radio />} label="优秀" />
                                        <FormControlLabel value='qualified' control={<Radio />} label="合格" />
                                        <FormControlLabel value='unqualified' control={<Radio />} label="不合格" />
                                    </RadioGroup>
                                </FormGroup>
                            </Stack>
                            <Stack sx={{
                                mb: 3,
                                mt: 3
                            }} >
                                <Textarea
                                    placeholder='学生的表现'
                                    minRows={4}
                                    maxRows={4}
                                >

                                </Textarea>
                            </Stack>
                            <Stack direction='row' justifyContent='center'>
                                <Button sx={{ width: '30%' }} variant='contained'>确认</Button>
                            </Stack>
                        </Stack>
                    </Stack>
                </Stack>

            </Stack>

        )
    }
    return (
        <></>
    )

}

export default EvaluateStudent;