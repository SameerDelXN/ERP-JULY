// app/students/[id]/fee/installments/page.jsx

import InstallmentTable from '@/components/InstallmentTable';

export default function StudentInstallmentPage({ params }) {
  return (
    <div className="max-w-3xl mx-auto mt-10">
      <h1 className="text-2xl font-bold mb-4">Installment Plan</h1>
      <InstallmentTable studentId={params.id} />
    </div>
  );
}
