"use client";

import { useState, useEffect } from "react";
import { useFormState, useFormStatus } from "react-dom";
import { getAvailableClasses, registerForClass } from "@/actions/registration";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type Class = {
  id: number;
  name: string;
  capacity: number;
  _count: { students: number };
};

export default function RegistrationForm() {
  const [classes, setClasses] = useState<Class[]>([]);
  const [selectedClass, setSelectedClass] = useState<string>("");
  const [reason, setReason] = useState<string>("");
  const [state, formAction] = useFormState(registerForClass, null);

  useEffect(() => {
    getAvailableClasses().then(setClasses);
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    formData.set("classId", selectedClass);

    formAction(formData);
  };

  function SubmitButton() {
    const { pending } = useFormStatus();
    return (
      <Button type="submit" disabled={pending || !selectedClass}>
        {pending ? "Registering..." : "Register"}
      </Button>
    );
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Registration</CardTitle>
        <CardDescription>Find your dissertation supervisor</CardDescription>
        {JSON.stringify(selectedClass)}
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="class">Select a Class</Label>
            <Select onValueChange={setSelectedClass} value={selectedClass}>
              <SelectTrigger id="class">
                <SelectValue placeholder="Select a class" />
              </SelectTrigger>
              <SelectContent>
                {classes.map((c) => (
                  <SelectItem key={c.id} value={c.id.toString()}>
                    {c.name} ({c._count.students}/{c.capacity})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="reason">Reason (optional)</Label>
            <Input
              id="reason"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Why do you want to join this class?"
            />
          </div>
        </CardContent>
        <CardFooter>
          <SubmitButton />
        </CardFooter>
      </form>
      {state && (
        <CardContent>
          <p className="text-green-600">
            Registration successful! Your registration is pending approval.
          </p>
        </CardContent>
      )}
    </Card>
  );
}
