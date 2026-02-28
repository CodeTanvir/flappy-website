import Footer from "@/components/Application/website/Footer";
import Header from "@/components/Application/website/Header";
import { Poppins } from "next/font/google";
import Script from "next/script";

export const metadata = {
  viewport: "width=device-width, initial-scale=1",
};
const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  variable: "--font-poppins",
});

function layout({ children }) {
  return (
    <div className={poppins.variable}>
      <Header />
      <main>{children}</main>
       <Script
          id="tawk-to"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              var Tawk_API=Tawk_API||{}, Tawk_LoadStart=new Date();
              (function(){
              var s1=document.createElement("script"),
              s0=document.getElementsByTagName("script")[0];
              s1.async=true;
              s1.src='https://embed.tawk.to/69a014c8650cdf1c39fca434/1jicl2c53';
              s1.charset='UTF-8';
              s1.setAttribute('crossorigin','*');
              s0.parentNode.insertBefore(s1,s0);
              })();
            `,
          }}
        />
      <Footer />
    </div>
  );
}

export default layout;
