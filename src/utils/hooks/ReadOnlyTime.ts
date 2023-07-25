function formatTime(timeString: string): string {
    const inputDate = new Date(timeString);
    const year = inputDate.getUTCFullYear().toString().padStart(4, '0');
    const month = (inputDate.getUTCMonth() + 1).toString().padStart(2, '0');
    const day = inputDate.getUTCDate().toString().padStart(2, '0');
    const hours = inputDate.getUTCHours().toString().padStart(2, '0');
    const minutes = inputDate.getUTCMinutes().toString().padStart(2, '0');
    const seconds = inputDate.getUTCSeconds().toString().padStart(2, '0');

    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}
import { IAdActivity } from "~/pages/Check/CheckTable";
export default function ReadOnlyTime(data: IAdActivity) {
    const formattedData: IAdActivity = { ...data };

    formattedData.registration_start_time = formatTime(data.registration_start_time);
    formattedData.registration_end_time = formatTime(data.registration_end_time);
    formattedData.activity_start_time = formatTime(data.activity_start_time);
    formattedData.activity_end_time = formatTime(data.activity_end_time);

    return formattedData;
}