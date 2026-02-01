"use client";
import Filter from "@/components/Application/website/Filter";
import WebsiteBreadcrumb from "@/components/Application/website/WebsiteBreadcrumb";
import { WEBSITE_SHOP } from "@/routes/WebsiteRoute";

const breadcrumb = {
  title: "Shop",
  links: [{ label: "Shop", href: WEBSITE_SHOP }],
};

function Shop() {
  return (
    <div>
      <WebsiteBreadcrumb props={breadcrumb} />
      <section className="w-72 me-4">
        <div>
          <div className="sticky top-0 bg-gray-50 p-4 rounded">
            <Filter />
          </div>
        </div>
      </section>
    </div>
  );
}

export default Shop;
