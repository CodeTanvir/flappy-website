import { Button } from "@/components/ui/button";
import { useState } from "react";
import { IoIosSearch } from "react-icons/io";
import SearchModel from "./SearchModel";

function AdminMobileSearch() {
  const [open, setOpen] = useState(false);
  return (
    <div>
      <Button
        type="button"
        size="icon"
        onClick={() => setOpen(true)}
        clasName="md:hidden"
        variant="ghost"
      >
        <IoIosSearch />
      </Button>
      <SearchModel open={open} setOpen={setOpen} />
    </div>
  );
}

export default AdminMobileSearch;
