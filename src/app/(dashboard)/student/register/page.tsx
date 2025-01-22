import RegistrationForm from "@/components/forms/RegisterForm";

const StudentRegisterPage = async () => {
  return (
    <div className="p-4 flex gap-4 flex-col xl:flex-row">
      {/* LEFT */}
      <div className="w-full ">
        <div className="h-full bg-white p-4 rounded-md">
          <RegistrationForm />
        </div>
      </div>
    </div>
  );
};

export default StudentRegisterPage;
