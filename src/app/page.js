import Banner from "./components/mainLayout/Banner";
import FeatureSection from "./components/mainLayout/FeatureSection";
import ContactUs from "./components/mainLayout/ContactUs";

export const metadata = {
  title: "ErythroShare — Connect. Donate. Save Lives.",
  description:
    "ErythroShare connects blood donors with those in need across Bangladesh. Search donors, post requests, and save lives — all in one platform.",
};

export default function Home() {
  return (
    <main>
      <Banner />
      <FeatureSection />
      <ContactUs />
    </main>
  );
}
