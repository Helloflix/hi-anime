import { useState } from "react";
import { Button } from "@/components/ui/button";
import AnimeCard from "@/components/AnimeCard";

const AZList = () => {
  const [selectedLetter, setSelectedLetter] = useState("A");
  
  const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ#".split("");
  
  // Mock data - in a real app this would come from an API
  const animeList = {
    A: [
      { id: 1, title: "Attack on Titan", image: "/src/assets/anime1.jpg", rating: 9.0, episodes: "87 Episodes", status: "Completed" },
      { id: 2, title: "Akame ga Kill!", image: "/src/assets/anime2.jpg", rating: 7.5, episodes: "24 Episodes", status: "Completed" },
    ],
    // Add more letters with anime
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-glow mb-4">A-Z Anime List</h1>
        <p className="text-muted-foreground">Browse anime alphabetically</p>
      </div>

      {/* Alphabet Navigation */}
      <div className="mb-8">
        <div className="flex flex-wrap gap-2">
          {alphabet.map((letter) => (
            <Button
              key={letter}
              variant={selectedLetter === letter ? "default" : "secondary"}
              size="sm"
              onClick={() => setSelectedLetter(letter)}
              className="w-10 h-10"
            >
              {letter}
            </Button>
          ))}
        </div>
      </div>

      {/* Anime Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {(animeList[selectedLetter as keyof typeof animeList] || []).map((anime) => (
          <AnimeCard 
            key={anime.id} 
            id={anime.id.toString()} 
            title={anime.title} 
            image={anime.image} 
            rating={anime.rating} 
            status={anime.status} 
          />
        ))}
      </div>

      {/* No Results */}
      {!(animeList[selectedLetter as keyof typeof animeList]) && (
        <div className="text-center py-16">
          <p className="text-muted-foreground text-lg">
            No anime found starting with "{selectedLetter}"
          </p>
        </div>
      )}
    </div>
  );
};

export default AZList;