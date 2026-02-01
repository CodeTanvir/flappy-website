import { WEBSITE_HOME } from "@/routes/WebsiteRoute";
import Link from "next/link";

function WebsiteBreadcrumb({ props }) {
  return (
    <div className="py-10 flex justify-center items-center bg-[url('/assets/images/page-title.png')] bg-cover bg-center">
      <div>
        <h1 className="flex gap-2 justify-center">{props.title}</h1>
        <ul className="flex gap-2 justify-center">
          <li>
            <Link href={WEBSITE_HOME}>Home</Link>
          </li>
          {props.links.map((item, index) => (
            <li key={index}>
              <span className="me-1">/</span>
              {item.href ? (
                <Link href={item.href}>{item.label}</Link>
              ) : (
                <span>{item.label}</span>
              )}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default WebsiteBreadcrumb;
