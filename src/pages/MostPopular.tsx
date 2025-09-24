import TrendingSection from "@/components/TrendingSection";

const MostPopular = () => {
  return (
    <div className="py-8">
      <div className="container px-4 mb-8">
        <h1 className="text-3xl md:text-4xl font-bold mb-4">Most Popular</h1>
        <p className="text-muted-foreground">
          The most watched and highest rated anime series
        </p>
      </div>
      <TrendingSection />
    </div>
  );
};

export default MostPopular;