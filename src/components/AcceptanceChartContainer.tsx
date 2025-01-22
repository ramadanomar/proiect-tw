import Image from "next/image";
import AcceptanceChart from "./AcceptanceChart";
import prisma from "@/lib/prisma";

const AcceptanceChartContainer = async () => {
  const today = new Date();
  const dayOfWeek = today.getDay();
  const daysSinceMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1;

  const lastMonday = new Date(today);

  lastMonday.setDate(today.getDate() - daysSinceMonday);

  const daysOfWeek = ["Mon", "Tue", "Wed", "Thu", "Fri"];

  const acceptanceMap: {
    [key: string]: { accepted: number; rejected: number };
  } = {
    Mon: { accepted: 28, rejected: 3 },
    Tue: { accepted: 14, rejected: 9 },
    Wed: { accepted: 44, rejected: 11 },
    Thu: { accepted: 8, rejected: 22 },
    Fri: { accepted: 33, rejected: 6 },
  };

  const data = daysOfWeek.map((day) => ({
    name: day,
    accepted: acceptanceMap[day].accepted,
    rejected: acceptanceMap[day].rejected,
  }));

  return (
    <div className="bg-white rounded-lg p-4 h-full">
      <div className="flex justify-between items-center">
        <h1 className="text-lg font-semibold">Registrations</h1>
        <Image src="/moreDark.png" alt="" width={20} height={20} />
      </div>
      <AcceptanceChart data={data} />
    </div>
  );
};

export default AcceptanceChartContainer;
