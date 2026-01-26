import CountOverview from "./CountOverview";
import QuickAdd from "./QuickAdd";

function AdminDashboard() {
  return (
    <div className="pt-5">
      <CountOverview />
      <QuickAdd />
      <div className="mt-10 flex lg:flex-nowrap flex-warp gap-10">
        
      </div>
    </div>
  );
}

export default AdminDashboard;
