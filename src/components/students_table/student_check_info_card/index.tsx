import { FC } from "react";
import { StudentCard } from "~/components/Small/student_card";
import style from "./index.module.css"
import { Button } from "antd";
import { Student } from "../tab";


export const StudentCheckInfoCard: FC<Student> = (props) => {
    return <div className={style.studentCard}>
        <div className={style.studentInfo}>
            <StudentCard Name={props.Name} College={props.College} Sex={props.Sex} />
            <div >
                <Button size="small" type="primary">通过</Button>
                <Button size="small" type="primary" danger style={{ marginLeft: "9px" }}>拒绝</Button>
            </div>
        </div>
    </div>
} 