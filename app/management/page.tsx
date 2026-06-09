import { DepartmentCreateForm } from './_components/create-dep-form';

export default function DepartmentManagementPage() {
  return (
    <div className="flex flex-col gap-4 w-sm">
      <h1>Department Management</h1>
      <DepartmentCreateForm />
    </div>
  );
}
