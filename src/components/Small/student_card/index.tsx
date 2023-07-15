import { Avatar } from "antd";
import { FC } from "react";
import style from './index.module.css'

interface Student {
    Name: string;
    College: string;
    Sex: string;
}


export const StudentCard: FC<Student> = (props) => {
    const avatarStype = props.Sex === "女" ?
        { backgroundColor: '#F86D9B', color: '#FFFFFF' } :
        { backgroundColor: '#6EA2EB', color: '#FFFFFF' }

    return <div className={style.studentCard}>
        <Avatar size="large" style={avatarStype}>{props.Sex}</Avatar>
        <div className={style.studentInfo}>
            <div className={style.studnetName}>{props.Name}</div>
            <div className={style.stundetCollege}>{props.College}</div>
        </div>
    </div>

}