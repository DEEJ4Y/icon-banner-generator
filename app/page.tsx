import Hero from "@/components/Hero";
import BannerApp from "@/components/BannerApp";

export default function Home() {
  return (
    <div className="flex flex-col h-screen">
      <Hero />
      <BannerApp />
    </div>
  );
}
