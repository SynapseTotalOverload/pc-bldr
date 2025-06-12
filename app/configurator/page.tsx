import { Card, CardHeader, CardTitle } from '@/components/ui/card';

export default function Configurator() {
  return (
    <div className="flex h-screen flex-col items-center justify-center gap-4">
      <Card className="">
        <CardHeader>
          <CardTitle>Configurator</CardTitle>
        </CardHeader>
      </Card>
    </div>
  );
}
