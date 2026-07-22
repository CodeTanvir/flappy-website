import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function QtySelector({ value, setValue }) {
  const qty = Number(value) || 0;

  return (
    <div className="flex items-center gap-2 mt-2">
      <Button
        type="button"
        variant="outline"
        size="icon"
        disabled={qty <= 0}
        onClick={() => setValue(String(Math.max(0, qty - 1)))}
      >
        -
      </Button>

      <Input
        type="number"
        min={0}
        value={value}
        onChange={(e) => {
          const val = Math.max(0, Number(e.target.value) || 0);
          setValue(String(val));
        }}
        className="text-center"
      />

      <Button
        type="button"
        variant="outline"
        size="icon"
        onClick={() => setValue(String(qty + 1))}
      >
        +
      </Button>
    </div>
  );
}