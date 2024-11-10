import { RegexBuilder } from "../components/RegexBuilder";


export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <main className="flex-grow">
        <div className="container mx-auto py-4 mb-auto">
          <RegexBuilder />
        </div>
      </main>
    </div>
  );
}
