import prisma from "@/lib/prisma";
import BigCalendar from "./BigCalender";
import { adjustScheduleToCurrentWeek } from "@/lib/utils";

const BigCalendarContainer = async ({
  type,
  id,
}: {
  type: "teacherId" | "classId";
  id: string | number;
}) => {
  // HARDCODE DATA
  const data = [
    {
      title: "Event 1",
      start: new Date(new Date().setHours(new Date().getHours() + 1)),
      end: new Date(new Date().setHours(new Date().getHours() + 2)),
    },
  ];

  const schedule = adjustScheduleToCurrentWeek(data);

  return (
    <div className="">
      <BigCalendar data={schedule} />
    </div>
  );
};

export default BigCalendarContainer;
