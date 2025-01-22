import prisma from "@/lib/prisma";

const StudentAcceptanceCard = async ({ id }: { id: string }) => {
  return (
    <div className="">
      <h1 className="text-xl font-semibold">{"88"}%</h1>
      <span className="text-sm text-gray-400">Attendance</span>
    </div>
  );
};

export default StudentAcceptanceCard;
