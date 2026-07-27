import { Navbar } from "@/components/landing/navbar";
import { Footer } from "@/components/landing/footer";

export default function EnglishMarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar locale="en" />
      <main className="flex-1">{children}</main>
      <Footer locale="en" />
    </div>
  );
}
