"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { Registration, Student } from "@prisma/client";

type RegistrationWithStudent = Registration & {
  student: Student;
};

type Props = {
  registrations: RegistrationWithStudent[];
  onAccept: (registrationId: number) => Promise<void>;
  onReject: (registrationId: number, reason: string) => Promise<void>;
};

export default function RegistrationTable({
  registrations,
  onAccept,
  onReject,
}: Props) {
  const [rejectReason, setRejectReason] = useState<string>("");

  if (registrations.length === 0) {
    return (
      <>
        <h1 className="text-xl font-semibold">No registrations found!</h1>
        <p>
          There are no registrations requests at the moment. Please check back
          later.
        </p>
      </>
    );
  }

  return (
    <section className="space-y-4">
      <h1 className="text-xl font-semibold">Registrations</h1>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Student Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {registrations.map((registration) => (
            <TableRow key={registration.id}>
              <TableCell>{`${registration.student.name} ${registration.student.surname}`}</TableCell>
              <TableCell>{registration.student.email}</TableCell>
              <TableCell>
                {registration.isFinished
                  ? registration.isApproved
                    ? "Accepted"
                    : "Rejected"
                  : "Pending"}
              </TableCell>
              <TableCell>
                {!registration.isFinished && (
                  <>
                    <Button
                      onClick={() => onAccept(registration.id)}
                      className="mr-2"
                    >
                      Accept
                    </Button>
                    <Button
                      onClick={() => {
                        const reason = prompt("Enter rejection reason:");
                        if (reason) {
                          onReject(registration.id, reason);
                        }
                      }}
                      variant="destructive"
                    >
                      Reject
                    </Button>
                  </>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </section>
  );
}
