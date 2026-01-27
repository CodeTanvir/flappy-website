import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import searchData from "@/lib/search";
import Fuse from "fuse.js";
import Link from "next/link";
import { Input } from "postcss";
import { useEffect, useState } from "react";

const options = {
  keys: ["label", "description", "keywords"],
  threshold: 0.3,
};

function SearchModel({ open, setOpen }) {
  const [query, setQuery] = useState("");
  const [results, setResult] = useState([]);

  useEffect(() => {
    if (query.trim() === "") {
      setResult([]);
      return;
    }
    const fuse = new Fuse(searchData, options);
    const res = fuse.search(query);
    setResult(res.map((r) => r.item));
  }, [query]);

  return (
    <div open={open} setOpenChange={() => setOpen(!open)}>
      <Dialog>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Quick Search</DialogTitle>
            <DialogDescription>
              Find and navigate to any admin section instantly. Type a keyword
              to get started
            </DialogDescription>
          </DialogHeader>

          <Input
            placeholder="search..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            autoFocus
          />
          <ul className="mt-4 max-h-60 overflow-y-auto">
            {results.map((item, index) => (
              <li key={index}>
                <Link
                  href={item.url}
                  className="block py-2 px-3 rounded hover:bg-muted"
                  onClick={()=> setOpen(false)}
                >
                  <h4 className="font-medium">{item.label}</h4>
                  <p className="text-sm text-muted-foreground">
                    {item.description}
                  </p>
                </Link>
              </li>
            ))}
            {query && results.length === 0 && 
            <div className="text-sm text-center text-red-500">
                No Result Found
            </div>
            }
          </ul>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default SearchModel;
