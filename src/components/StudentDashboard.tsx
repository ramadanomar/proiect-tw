import prisma from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { Button, buttonVariants } from "./ui/button";
import Link from "next/link";

export default async function StudentDashboard() {
  const { userId } = auth();

  const student = await prisma.student.findUnique({
    where: {
      id: userId!,
    },
    include: {
      class: {
        include: {
          supervisor: true,
        },
      },
      registrations: true,
    },
  });

  if (!student) {
    return <h1>User not found!</h1>;
  }

  const finishedRegistration = student.classId != 8;

  if (finishedRegistration) {
    return (
      <>
        <h1 className="text-xl font-semibold">Congrats 🎉 You are enrolled!</h1>
        <p>
          You are enrolled in the class {student.class.name}. You can view your
          calendar and announcements below. Your supervisor is{" "}
          {student.class.supervisor!.name}.
        </p>
      </>
    );
  }

  if (student.registrations.length === 0) {
    return (
      <section className="space-y-4">
        <h1 className="text-xl font-semibold">No registrations found!</h1>
        <p>
          You are not enrolled in any classes. Please register for a class to
          view your calendar and announcements.
        </p>
        <Link className={buttonVariants()} href="/student/register">
          Register for a class
        </Link>
      </section>
    );
  }

  return (
    <section className="space-y-4">
      <h1 className="text-xl font-semibold">
        Wait for a teacher to accept or send other requests
      </h1>
      <Link className={buttonVariants()} href="/student/register">
        Register for a class
      </Link>

      <pre className="bg-gray-100 p-4 rounded-md">
        {JSON.stringify(student.registrations, null, 2)}
      </pre>
    </section>
  );
}
