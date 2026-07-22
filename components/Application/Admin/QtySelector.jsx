import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function QtySelector({
  value,
  setValue,
  max = Infinity, // optional
}) {
  const qty = Number(value) || 0;

  const increase = () => {
    if (qty >= max) return;
    setValue(String(qty + 1));
  };

  const decrease = () => {
    setValue(String(Math.max(0, qty - 1)));
  };

  return (
    <div className="flex items-center gap-2 mt-2">
      <Button
        type="button"
        variant="outline"
        size="icon"
        disabled={qty <= 0}
        onClick={decrease}
      >
        -
      </Button>

      <Input
        type="number"
        min={0}
        max={max === Infinity ? undefined : max}
        value={value}
        onChange={(e) => {
          let val = Number(e.target.value) || 0;

          if (val < 0) val = 0;
          if (val > max) val = max;

          setValue(String(val));
        }}
        className="text-center"
      />

      <Button
        type="button"
        variant="outline"
        size="icon"
        disabled={qty >= max}
        onClick={increase}
      >
        +
      </Button>
    </div>
  );
}