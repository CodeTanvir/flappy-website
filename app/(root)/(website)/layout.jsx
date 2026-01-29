import Footer from "@/components/Application/website/Footer";
import Header from "@/components/Application/website/Header";
import { Poppins } from "next/font/google";

const poppin = Poppins({
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
  subsets: ["latin"],
});
function layout({ children }) {
  return (
    <div className={poppin.className}>
      <Header />
      <main>{children}</main>
      <Footer />
    </div>
  );
}

export default layout;
