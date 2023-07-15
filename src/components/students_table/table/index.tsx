import { FC } from "react";
import style from "./index.module.css"
import { StudentCard } from "~components/Small/student_card";
import { Pagination } from "antd";

interface Student {
    Name: string;
    College: string;
    Sex: string;
}

interface Allstudent {
    Data: Array<Student>;
}

export const StudentListTable: FC<Allstudent> = (props) => {
    return <div className={style.studentTable}>
        <div className={style.studentList}>
            {
                props.Data.map(student => {
                    return <div className={style.studentCard}>
                        <StudentCard Name={student.Name} College={student.College} Sex={student.Sex} />
                    </div>
                })
            }
        </div>
        <div >
            <Pagination defaultCurrent={1} total={50} />
        </div>
    </div>
}