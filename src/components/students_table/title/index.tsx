import { FC } from "react"
import style from "./index.module.css"

export const TableTitle: FC = () => {
    return <div style={{ width: "100%" }}>
        <span className={style.tilteName}>学生名单</span>
        <span className={style.tilteClick}>点击查看学生详情</span>
    </div>
}