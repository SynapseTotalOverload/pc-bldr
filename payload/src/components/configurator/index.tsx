'use client'

import { useEffect, useState } from "react";
import { BudgetSelector } from "./_components/BudgetSelector";
import { BuildRead, ProductRead, UseCase } from "./types";
import { useDebounce } from "@/utilities/useDebounce";
import { useBuildNearest } from "@/hooks/useBuildNearest";
import { UseCaseSelector } from "./_components/UseCaseSelector";
import { ExtrasPanel } from "./_components/ExtrasPanel";
import { PartsList } from "./_components/PartsList";
import { useEffectEvent } from "@payloadcms/ui";

const budget = 1000;
const handleBudgetChange = (newBudget: number) => {
    console.log(newBudget);
}

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
        attrs: build.cpu.attrs,
        low_image_url: build.cpu?.low_image_url,
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
        attrs: build.gpu.attrs,
        low_image_url: build.gpu?.low_image_url,
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
        attrs: build.motherboard.attrs,
        low_image_url: build.motherboard?.low_image_url,
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
        attrs: build.ram.attrs,
        low_image_url: build.ram?.low_image_url,
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
        attrs: build.storage.attrs,
        low_image_url: build.storage?.low_image_url,
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
        attrs: build.psu.attrs,
        low_image_url: build.psu?.low_image_url,
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
        attrs: build.cpu_cooler.attrs,
        low_image_url: build.cpu_cooler?.low_image_url,
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
        attrs: build.case.attrs,
        low_image_url: build.case?.low_image_url,
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
    const [components, setComponents] = useState<ProductRead[]>([]);
   
    const handleBudgetChange = async (newBudget: number) => {
        setBudget(newBudget);
        await refetchWithOptions({ budget: newBudget, buildType: useCase, limit: 1 })
    };

    const handleUseCaseChange = async (newUseCase: UseCase['key']) => {
        setUseCase(newUseCase);
        await refetchWithOptions({ budget, buildType: newUseCase, limit: 1 })
    };

    useEffect(() => {
        if(builds.length > 0) {
            setComponents(extractComponentsFromBuild(builds[0] as BuildRead))
        }
    }, [builds])
  return (
    <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 px-4 py-12 w-full max-w-7xl mx-auto">
        <div className="flex h-full flex-col gap-4">  
            <BudgetSelector budget={budget} onBudgetChange={handleBudgetChange} />
            <UseCaseSelector selectedUseCase={useCase} onUseCaseChange={handleUseCaseChange} />
            <ExtrasPanel isOpen={showExtras} onToggle={() => setShowExtras((v) => !v)} />
        </div>
        <div className="flex flex-col gap-4 w-full max-w-7xl mx-auto">
            {builds.length > 0 ? (
            <>
                <div className="w-full max-w-xl p-4 border rounded-xl">
                <h3 className="text-lg font-semibold text-card-foreground">{builds[0].name}</h3>
                <p className="text-sm text-muted-foreground">
                    Build Type: <span className="capitalize">{builds[0].build_type}</span>
                </p>
                <p className="text-lg font-bold text-foreground">
                    Total: ${builds[0].build_price?.toFixed(2) || '0.00'}
                </p>
                </div>
                <PartsList loading={loading} error={error} parts={components} />
            </>
            ) : !loading && (
            <div className="w-full max-w-xl p-6 bg-card border rounded-lg text-center rounded-xl">
                <h3 className="text-lg font-semibold text-card-foreground mb-2">No builds found</h3>
                <p className="text-sm text-muted-foreground">
                Try adjusting your budget or selecting a different use case.
                </p>
            </div>
            )}
        </div>
    </div>
  )
}