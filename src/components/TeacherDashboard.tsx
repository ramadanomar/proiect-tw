import prisma from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";

import RegistrationTable from "./RegistrationTable";

export default async function TeacherDashboard() {
  const { userId } = auth();

  const teacher = await prisma.teacher.findUnique({
    where: {
      id: userId!,
    },
    include: {
      classes: {
        include: {
          registrations: {
            include: {
              student: true,
            },
          },
        },
      },
    },
  });

  if (!teacher) {
    return <h1>User not found!</h1>;
  }

  if (teacher.classes.length === 0) {
    return (
      <>
        <h1 className="text-xl font-semibold">
          No registration session found!
        </h1>
        <p>
          You dont have any registration sessions yet. Please ask for school
          admin to create a registration session so students can enroll.
        </p>
      </>
    );
  }

  const currentClass = teacher.classes[0];

  async function handleAccept(registrationId: number) {
    "use server";
    const registration = await prisma.registration.findUnique({
      where: { id: registrationId },
      include: { student: true },
    });

    if (registration) {
      await prisma.$transaction([
        // Update the accepted registration
        prisma.registration.update({
          where: { id: registrationId },
          data: { isApproved: true, isFinished: true },
        }),
        // Move the student to the new class
        prisma.student.update({
          where: { id: registration.studentId },
          data: { classId: registration.classId },
        }),
        // Delete all other registrations for this student
        prisma.registration.deleteMany({
          where: {
            studentId: registration.studentId,
            id: { not: registrationId },
          },
        }),
      ]);
    }
  }

  async function handleReject(registrationId: number, reason: string) {
    "use server";
    await prisma.registration.update({
      where: { id: registrationId },
      data: { isApproved: false, isFinished: true, reason },
    });
  }

  return (
    <RegistrationTable
      registrations={currentClass.registrations}
      onAccept={handleAccept}
      onReject={handleReject}
    />
  );
}
