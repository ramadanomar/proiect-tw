"use server";

import prisma from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";

export async function getAvailableClasses() {
  const user = auth();

  if (!user || !user.userId) {
    throw new Error("You must be logged in to view available classes");
  }

  const classes = await prisma.class.findMany({
    select: {
      id: true,
      name: true,
      capacity: true,
      _count: {
        select: { students: true },
      },
    },
    // Where class is not the temporary class and where a registration for the class is not already made
    where: {
      AND: [
        { id: { not: 8 } },
        { registrations: { none: { studentId: user.userId } } },
      ],
    },
  });

  console.log(classes);

  return classes.filter((c) => c._count.students < c.capacity);
}

export async function registerForClass(prevState: any, formData: FormData) {
  const user = auth();

  if (!user || !user.userId || !formData)
    throw new Error("You must be logged in to register for a class");

  const classId = Number.parseInt(formData.get("classId") as string);
  const reason = formData.get("reason") as string;

  if (!classId) {
    throw new Error("Class ID is required");
  }

  try {
    const registration = await prisma.registration.create({
      data: {
        studentId: user.userId,
        classId: classId,
        reason: reason || undefined,
      },
    });
    return { success: true, registration };
  } catch (error) {
    return { error: "Failed to register for the class" };
  }
}
