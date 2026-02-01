import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import useFetch from "@/hooks/useFetch";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { ButtonLoading } from "../ButtonLoading";
function Filter() {
  const searchParams = useSearchParams();
  const [priceFilter, setPriceFilter] = useState({ minPrice: 0, maxPrice: 0 });
  const [selectedCategory, setSelectedCategory] = useState([]);
  const [selectedColor, setSelectedColor] = useState([]);
  const [selectedSize, setSelectedSize] = useState([]);
  const { data: categoryData } = useFetch("/api/category/get-category");
  const { data: colorData } = useFetch("/api/product-variant/colors");
  const { data: sizeData } = useFetch("/api/product-variant/sizes");

  const handlePriceChange = (value) => {
    setPriceFilter({ minPrice: value[0], maxPrice: value[1] });
  };

  const handleCategoryFilter = (categorySlug) => {
    let newSelectedCategory = [...selectedCategory];
    if (newSelectedCategory.includes(categorySlug)) {
      newSelectedCategory = newSelectedCategory.filter(
        (cat) => cat !== categorySlug,
      );
    } else {
      newSelectedCategory.push(categorySlug);
    }
  };

  return (
    <div>
      <Accordion type="multiple" defaultValue={["1", "2", "3", "4"]}>
        <AccordionItem value="1">
          <AccordionTrigger
            className="uppercase font-semibold
           hover:no-underline"
          >
            Category
          </AccordionTrigger>
          <AccordionContent>
            <div className="max-h-48 overflow-auto">
              <ul>
                {categoryData &&
                  categoryData.success &&
                  categoryData.data.map((category) => (
                    <li key={category._id} className="mb-3">
                      <label className="flex items-center space-x-3 cursor-pointer">
                        <Checkbox
                          onCheckedChange={() =>
                            handleCategoryFilter(category.slug)
                          }
                          checked={selectedCategory.includes(category.slug)}
                        />
                        <span>{category.name}</span>
                      </label>
                    </li>
                  ))}
              </ul>
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="2">
          <AccordionTrigger
            className="uppercase font-semibold
           hover:no-underline"
          >
            Color
          </AccordionTrigger>
          <AccordionContent>
            <div className="max-h-48 overflow-auto">
              <ul>
                {colorData &&
                  colorData.success &&
                  colorData.data.map((color) => (
                    <li key={color} className="mb-3">
                      <label className="flex items-center space-x-3 cursor-pointer">
                        <Checkbox />
                        <span>{color}</span>
                      </label>
                    </li>
                  ))}
              </ul>
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="3">
          <AccordionTrigger
            className="uppercase font-semibold
           hover:no-underline"
          >
            Sizes
          </AccordionTrigger>
          <AccordionContent>
            <div className="max-h-48 overflow-auto">
              <ul>
                {sizeData &&
                  sizeData.success &&
                  sizeData.data.map((size) => (
                    <li key={size} className="mb-3">
                      <label className="flex items-center space-x-3 cursor-pointer">
                        <Checkbox />
                        <span>{size}</span>
                      </label>
                    </li>
                  ))}
              </ul>
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="4">
          <AccordionTrigger className="uppercase font-semibold hover:no-underline">
            Price
          </AccordionTrigger>

          <AccordionContent className="overflow-visible">
            <div className="px-6">
              <Slider
                defaultValue={[0, 3000]}
                max={3000}
                step={2}
                onValueChange={handlePriceChange}
                className="w-full overflow-visible"
              />
              <div className="flex justify-between items-center pt-2">
                <span>
                  {priceFilter.minPrice.toLocaleString("en-BD", {
                    style: "currency",
                    currency: "BDT",
                  })}
                </span>
                <span>
                  {priceFilter.maxPrice.toLocaleString("en-BD", {
                    style: "currency",
                    currency: "BDT",
                  })}
                </span>
              </div>
              <div className="mt-4">
                <ButtonLoading
                  type="button"
                  text="Filter Price"
                  className="rounded-full"
                />
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
}

export default Filter;
