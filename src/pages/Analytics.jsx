import Card from '../components/ui/Card';

export default function Analytics() {
  return (
    <div className="p-6 max-w-md mx-auto">
      <header className="mb-8 mt-4">
        <h1 className="text-2xl font-semibold">Analytics</h1>
      </header>

      <Card className="flex flex-col items-center justify-center py-12 text-center">
        <div className="w-16 h-16 bg-cream rounded-full flex items-center justify-center mb-4">
          <span className="text-sage text-2xl">📊</span>
        </div>
        <h3 className="font-medium text-lg mb-1">Coming soon</h3>
        <p className="text-sm text-text-secondary">Fitur analitik sedang dalam pengembangan.</p>
      </Card>
    </div>
  );
}
