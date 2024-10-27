import { RegexBuilder } from "../src/components/RegexBuilder";


export default function Home() {
  return (
    <main className="min-h-screen bg-background">
      <div className="container mx-auto py-4">
        <RegexBuilder />
      </div>
    </main>
  );
}
