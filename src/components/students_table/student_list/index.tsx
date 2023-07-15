import { FC } from "react";
// import { StudentCard } from "~/components/Small/student_card";
import style from "./index.module.css"
// import { StudentCheckInfoCard } from "../student_check_info_card";

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

export const StudentList: FC<Allstudent> = () => {
    return <div className={style.studentTable}>
        <div className={style.studentList}>
        </div>
        <div >
        </div>
    </div >
} 