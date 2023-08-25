import { Button, Stack } from '@mui/joy'
import { useParams } from 'react-router-dom'
import { ActivityEditor } from '~/components/ActivityEditor'
import { ActivityStudents } from '~/components/ActivityNewStudents'
import { ErrorDisplay } from '~/components/ErrorDisplay'
import { OverflowWrapper } from '~/components/OverflowWrapper'
import { network } from '~/utils/network'
import FileDownloadIcon from '@mui/icons-material/FileDownload'
import style from './index.module.css'
import Menu from '~/components/Menu'
import { useMemo, useState } from 'react';
import { Box, Typography } from '@mui/material'
import { Empty } from 'antd'

const DetailsWithParams = ({ activityId }: { activityId: number }) => {
  const [now, setNow] = useState<string>('全部');//读取菜单的值

  const { data: activity, error } = network.teacher.useActivity(activityId)
  const { data: students } = network.teacher.useActivityStudents(activityId)

  const handleKind = (e: string) => {
    setNow(e);
  }
  console.log(activity)

  const filterData = useMemo(() => {
    //在每次menu的值改变的时候触发
    if (now === '待审核') {
      console.log('待审核')
      return students?.filter((item) => {
        if (item.state === '报名审核中') {
          return true;
        }
        return false
      })
    }
    if (now === '待签退') {
      console.log('待签退')
      return students?.filter((item) => {
        if (item.state === '报名成功' && item.check_in) {
          return true;
        } else {
          return false;
        }
      })
    }
    if (now === '已签退') {
      console.log('已签退')
      return students?.filter((item) => {
        if (item.state === '报名成功' && item.check_out) {
          return true;
        } else {
          return false;
        }
      })
    }
    if (now === '全部') {
      return students
    }
  }, [now, students])
  if (activity) {
    //如果说activity的状态不正确，也就是说状态不是已经报名通过的状态
    if (activity.state !== '已发布') {
      //这个情况下的活动是不能看的
      return (
        <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description={'你所观看的活动并不在已发布活动列表中'} />
      )
    }
  }
  if (!activity) {
    return (
      <div className={style.box}>
        Loading...
      </div >
    ) // 或者显示其他加载中的内容

  }

  return (
    <Stack
      spacing={2}
      sx={{
        width: '91%',
        m: '0 auto'
      }}
    >
      <Box>
        <Box
          sx={{
            backgroundColor: 'white',
            p: '16px'
          }}
        >
          <Typography variant='h6'>学生名单</Typography>
        </Box>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            width: '100%',
            backgroundColor: 'white',
          }}
        >
          <Menu handleKind={handleKind} now={now} />
          <Button
            startDecorator={<FileDownloadIcon />}
            onClick={() => {
              network.teacher.downloadActivityStudentsExcel(activityId)
            }}
            sx={{ mr: 3 }}
          >
            导出学生名单
          </Button>
        </Box>
        <ErrorDisplay error={error} />
        <OverflowWrapper>
          {filterData === undefined ? null : <ActivityStudents key={filterData.length} students={filterData} id={activity.id} activity={activity} />}
        </OverflowWrapper>
      </Box>
      {activity && <ActivityEditor initialActivity={activity} isShow={false} disabled={true} />}
    </Stack >
  )
}

const Details = () => {
  const { id } = useParams()
  const activityId = Number(id)
  if (isNaN(activityId)) {
    return <div>无效的路径参数：活动 ID</div>
  }
  return <DetailsWithParams activityId={activityId} />
}

export default Details
