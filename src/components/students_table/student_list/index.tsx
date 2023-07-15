import { FC } from "react";
import { StudentCard } from "~components/Small/student_card";
import style from "./index.module.css"
import { Pagination } from "antd";
import { StudentCheckInfoCard } from "../student_check_info_card";

interface Student {
    Name: string;
    College: string;
    Sex: string;
    Status: StatusType;
}

enum StatusType {
    Unknown,
    Registered,
    ToBeReviewed,
    SignedIn,
}


interface Allstudent {
    Data: Array<Student>;
}

export const StudentList: FC<Allstudent> = (props) => {
    return <div className={style.studentTable}>
        <div className={style.studentList}>
            {
                props.Data.map(student => {
                    return <>
                        {
                            student.Status === StatusType.Registered ? <div className={style.studentCard} key={student.Name}>
                                <StudentCard Name={student.Name} College={student.College} Sex={student.Sex} />
                            </div> : <StudentCheckInfoCard Name={student.Name} College={student.College} Sex={student.Sex} />
                        }
                    </>
                })
            }
        </div>
        <div >
            <Pagination defaultCurrent={1} total={50} />
        </div>
    </div >
} 