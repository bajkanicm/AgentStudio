import { Navbar } from "@/components/landing/navbar";
import { Footer } from "@/components/landing/footer";

export default function GermanMarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar locale="de" />
      <main className="flex-1">{children}</main>
      <Footer locale="de" />
    </div>
  );
}
