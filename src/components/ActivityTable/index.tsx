import { Activity } from '~/utils/types'
import { useNavigate } from 'react-router-dom'

import style from './index.module.css';
import { HandleData } from '../handleData';
import { Title } from '~/components/title/index';
import { Button } from 'antd';

export interface ActivityTableProps {
  activities: Activity[]
}

export const ActivityTable = () => {
  const Navigate = useNavigate();
  return (
    <div className={style.all}>
      <div className={style.title}>
        <Title name={"活动管理"} />
      </div>
      <div className={style.contain} >
        <div className={style.discribtion}>
          <p>活动列表</p>
          <Button
            type='primary'
            style={{
              width: "110px",
              height: "32px"
            }}
            onClick={() => {
              Navigate('/create')
            }}
          > + 发布活动</Button>
        </div>
      </div>
      <div className={style.excel}>
        <HandleData />
      </div>
    </div>
  )
}
