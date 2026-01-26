import CountOverview from "./CountOverview";
import QuickAdd from "./QuickAdd";

function AdminDashboard() {
  return (
    <div className="pt-5">
      <CountOverview />
      <QuickAdd />
    </div>
  );
}

export default AdminDashboard;
