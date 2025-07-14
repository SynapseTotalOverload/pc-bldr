'use client';

import { useEffect, useState } from 'react';
import { BudgetSelector, UseCaseSelector, PartsList, ExtrasPanel } from '@/models/configurator/components';
import { UseCase } from '@/models/configurator/types';
import { BuildRead, ProductRead } from '@/types/prodcuts-base';
import useDebounce from '@/hooks/useDebounce';
import { useBuildNearest } from '@/hooks/useBuildNearest';
import { Button } from '@/components/ui/button';
import { ArrowLeftIcon } from 'lucide-react';
import Link from 'next/link';

// Function to extract components from build as ProductRead array
const extractComponentsFromBuild = (build: BuildRead): ProductRead[] => {
  const components: ProductRead[] = [];
  
  if (build.cpu) {
    components.push({
      id: build.cpu.id,
      asin: build.cpu.asin,
      title: build.cpu.title,
      price: build.cpu.price,
      rating: build.cpu.rating,
      created_at: build.cpu.created_at,
      category: build.cpu.category,
      attrs: build.cpu.attrs
    });
  }
  
  if (build.gpu) {
    components.push({
      id: build.gpu.id,
      asin: build.gpu.asin,
      title: build.gpu.title,
      price: build.gpu.price,
      rating: build.gpu.rating,
      created_at: build.gpu.created_at,
      category: build.gpu.category,
      attrs: build.gpu.attrs
    });
  }
  
  if (build.motherboard) {
    components.push({
      id: build.motherboard.id,
      asin: build.motherboard.asin,
      title: build.motherboard.title,
      price: build.motherboard.price,
      rating: build.motherboard.rating,
      created_at: build.motherboard.created_at,
      category: build.motherboard.category,
      attrs: build.motherboard.attrs
    });
  }
  
  if (build.ram) {
    components.push({
      id: build.ram.id,
      asin: build.ram.asin,
      title: build.ram.title,
      price: build.ram.price,
      rating: build.ram.rating,
      created_at: build.ram.created_at,
      category: build.ram.category,
      attrs: build.ram.attrs
    });
  }
  
  if (build.storage) {
    components.push({
      id: build.storage.id,
      asin: build.storage.asin,
      title: build.storage.title,
      price: build.storage.price,
      rating: build.storage.rating,
      created_at: build.storage.created_at,
      category: build.storage.category,
      attrs: build.storage.attrs
    });
  }
  
  if (build.psu) {
    components.push({
      id: build.psu.id,
      asin: build.psu.asin,
      title: build.psu.title,
      price: build.psu.price,
      rating: build.psu.rating,
      created_at: build.psu.created_at,
      category: build.psu.category,
      attrs: build.psu.attrs
    });
  }
  
  if (build.cpu_cooler) {
    components.push({
      id: build.cpu_cooler.id,
      asin: build.cpu_cooler.asin,
      title: build.cpu_cooler.title,
      price: build.cpu_cooler.price,
      rating: build.cpu_cooler.rating,
      created_at: build.cpu_cooler.created_at,
      category: build.cpu_cooler.category,
      attrs: build.cpu_cooler.attrs
    });
  }
  
  if (build.case) {
    components.push({
      id: build.case.id,
      asin: build.case.asin,
      title: build.case.title,
      price: build.case.price,
      rating: build.case.rating,
      created_at: build.case.created_at,
      category: build.case.category,
      attrs: build.case.attrs
    });
  }
  
  return components;
};

export default function Configurator() {
  const [budget, setBudget] = useState(1400);
  const [useCase, setUseCase] = useState<UseCase['key']>('budget');
  const [showExtras, setShowExtras] = useState(false);
  const { builds, loading, error, refetchWithOptions } = useBuildNearest({
    budget,
    buildType: useCase,
    limit: 1
  });
  const debouncedRefetch = useDebounce(() => refetchWithOptions({ budget, buildType: useCase }), 1000);
  
  // Extract components from the first build found (since limit=1)
  const components = builds.length > 0 ? extractComponentsFromBuild(builds[0]) : [];
  
  const handleBudgetChange = async (newBudget: number) => {
    setBudget(newBudget);
    await debouncedRefetch(); // Fetch new builds nearest to budget
  };

  return (
    <div className="depth-bg flex h-screen flex-col items-center justify-center gap-4">
      <Button>
        <Link href="/">
          <ArrowLeftIcon className="h-4 w-4" />
        </Link>
      </Button>
      <div className="grid h-screen grid-cols-2 gap-4 px-4 py-12">
        <div className="flex h-full flex-col gap-4">
          <BudgetSelector budget={budget} onBudgetChange={handleBudgetChange} />
          <UseCaseSelector selectedUseCase={useCase} onUseCaseChange={setUseCase} />
          <ExtrasPanel isOpen={showExtras} onToggle={() => setShowExtras((v) => !v)} />
        </div>
        <div className="flex flex-col gap-4">
          {builds.length > 0 ? (
            <>
              <div className="w-full max-w-xl p-4 bg-muted/20 rounded-lg backdrop-blur-sm">
                <h3 className="text-lg font-semibold text-white">{builds[0].name}</h3>
                <p className="text-sm text-muted-foreground">
                  Build Type: <span className="capitalize">{builds[0].build_type}</span>
                </p>
                <p className="text-lg font-bold text-main-accent">
                  Total: ${builds[0].build_price?.toFixed(2) || '0.00'}
                </p>
              </div>
              <PartsList loading={loading} error={error} parts={components} />
            </>
          ) : !loading && (
            <div className="w-full max-w-xl p-6 bg-muted/20 rounded-lg backdrop-blur-sm text-center">
              <h3 className="text-lg font-semibold text-white mb-2">No builds found</h3>
              <p className="text-sm text-muted-foreground">
                Try adjusting your budget or selecting a different use case.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
