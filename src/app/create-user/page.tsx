import CreateUserForm from "@/components/create-user-form";
import { createUser } from "./actions";

export default function CreateUser() {
  return (
    <div>
      <CreateUserForm createUser={createUser} />
    </div>
  );
}
