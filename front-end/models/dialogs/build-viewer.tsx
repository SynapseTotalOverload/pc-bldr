"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { BuildRead } from "@/types/prodcuts-base";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ChevronDown } from "lucide-react";
import { useState } from "react";

interface BuildViewerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  build: BuildRead | null;
}

export default function BuildViewer({ open, onOpenChange, build }: BuildViewerProps) {
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({});

  if (!build) return null;

  const formatPrice = (price?: number) => {
    return price ? `$${price.toFixed(2)}` : "—";
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const toggleSection = (section: string) => {
    setOpenSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">{build.name}</DialogTitle>
          <DialogDescription>
            Build details and component specifications
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Build Overview */}
          <Card>
            <CardHeader>
              <CardTitle>Build Overview</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Build Type</p>
                <Badge variant="secondary">
                  {build.build_type ? build.build_type.charAt(0).toUpperCase() + build.build_type.slice(1) : "—"}
                </Badge>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Price</p>
                <p className="font-semibold text-lg">{formatPrice(build.build_price)}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Created</p>
                <p>{formatDate(build.created_at)}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Last Updated</p>
                <p>{formatDate(build.updated_at)}</p>
              </div>
            </CardContent>
          </Card>

          {/* Components */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* CPU */}
            {build.cpu && (
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg">CPU</h3>
                      <p className="font-medium text-sm">{build.cpu.title}</p>
                      <p className="font-semibold text-green-600">{formatPrice(build.cpu.price)}</p>
                    </div>
                  </div>
                  
                  <Collapsible open={openSections.cpu} onOpenChange={() => toggleSection('cpu')}>
                    <CollapsibleTrigger className="flex items-center gap-2 mt-2 text-sm text-muted-foreground hover:text-foreground">
                      <ChevronDown className={`h-4 w-4 transition-transform ${openSections.cpu ? 'rotate-180' : ''}`} />
                      {openSections.cpu ? 'Hide details' : 'Show details'}
                    </CollapsibleTrigger>
                    <CollapsibleContent className="mt-2">
                      <div className="space-y-1 text-sm text-muted-foreground pl-4 border-l-2 border-muted">
                        <p>Brand: {build.cpu.attrs.brand}</p>
                        <p>Model: {build.cpu.attrs.model}</p>
                        <p>Cores: {build.cpu.attrs.cores}</p>
                        <p>Threads: {build.cpu.attrs.threads}</p>
                        {build.cpu.attrs.base_speed && <p>Base Speed: {build.cpu.attrs.base_speed} GHz</p>}
                        {build.cpu.attrs.turbo_speed && <p>Turbo Speed: {build.cpu.attrs.turbo_speed} GHz</p>}
                        <p>Socket: {build.cpu.attrs.socket_type}</p>
                        <p>Architecture: {build.cpu.attrs.architechture}</p>
                        <p>Memory Type: {build.cpu.attrs.memory_type}</p>
                        <p>Memory Speed: {build.cpu.attrs.memory_speed} MHz</p>
                      </div>
                    </CollapsibleContent>
                  </Collapsible>
                </CardContent>
              </Card>
            )}

            {/* GPU */}
            {build.gpu && (
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg">Graphics Card</h3>
                      <p className="font-medium text-sm">{build.gpu.title}</p>
                      <p className="font-semibold text-green-600">{formatPrice(build.gpu.price)}</p>
                    </div>
                  </div>
                  
                  <Collapsible open={openSections.gpu} onOpenChange={() => toggleSection('gpu')}>
                    <CollapsibleTrigger className="flex items-center gap-2 mt-2 text-sm text-muted-foreground hover:text-foreground">
                      <ChevronDown className={`h-4 w-4 transition-transform ${openSections.gpu ? 'rotate-180' : ''}`} />
                      {openSections.gpu ? 'Hide details' : 'Show details'}
                    </CollapsibleTrigger>
                    <CollapsibleContent className="mt-2">
                      <div className="space-y-1 text-sm text-muted-foreground pl-4 border-l-2 border-muted">
                        <p>Brand: {build.gpu.attrs.brand}</p>
                        <p>Model: {build.gpu.attrs.model}</p>
                        {build.gpu.attrs.memory && <p>VRAM: {build.gpu.attrs.memory} GB</p>}
                        {build.gpu.attrs.clock_speed && <p>Clock Speed: {build.gpu.attrs.clock_speed} MHz</p>}
                        {build.gpu.attrs.length && <p>Length: {build.gpu.attrs.length} mm</p>}
                        <p>Chipset: {build.gpu.attrs.chipset}</p>
                        <p>Interface: {build.gpu.attrs.interface}</p>
                        <p>Memory Interface: {build.gpu.attrs.mem_interface}</p>
                        {build.gpu.attrs.base_clock && <p>Base Clock: {build.gpu.attrs.base_clock} MHz</p>}
                      </div>
                    </CollapsibleContent>
                  </Collapsible>
                </CardContent>
              </Card>
            )}

            {/* Motherboard */}
            {build.motherboard && (
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg">Motherboard</h3>
                      <p className="font-medium text-sm">{build.motherboard.title}</p>
                      <p className="font-semibold text-green-600">{formatPrice(build.motherboard.price)}</p>
                    </div>
                  </div>
                  
                  <Collapsible open={openSections.motherboard} onOpenChange={() => toggleSection('motherboard')}>
                    <CollapsibleTrigger className="flex items-center gap-2 mt-2 text-sm text-muted-foreground hover:text-foreground">
                      <ChevronDown className={`h-4 w-4 transition-transform ${openSections.motherboard ? 'rotate-180' : ''}`} />
                      {openSections.motherboard ? 'Hide details' : 'Show details'}
                    </CollapsibleTrigger>
                    <CollapsibleContent className="mt-2">
                      <div className="space-y-1 text-sm text-muted-foreground pl-4 border-l-2 border-muted">
                        <p>Brand: {build.motherboard.attrs.brand}</p>
                        <p>Model: {build.motherboard.attrs.model}</p>
                        <p>Socket: {build.motherboard.attrs.socket_type}</p>
                        <p>Form Factor: {build.motherboard.attrs.form_factor}</p>
                        <p>Chipset: {build.motherboard.attrs.chipset}</p>
                        {build.motherboard.attrs.ram_slots && <p>RAM Slots: {build.motherboard.attrs.ram_slots}</p>}
                        {build.motherboard.attrs.max_ram_support && <p>Max RAM: {build.motherboard.attrs.max_ram_support} GB</p>}
                      </div>
                    </CollapsibleContent>
                  </Collapsible>
                </CardContent>
              </Card>
            )}

            {/* RAM */}
            {build.ram && (
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg">Memory (RAM)</h3>
                      <p className="font-medium text-sm">{build.ram.title}</p>
                      <p className="font-semibold text-green-600">{formatPrice(build.ram.price)}</p>
                    </div>
                  </div>
                  
                  <Collapsible open={openSections.ram} onOpenChange={() => toggleSection('ram')}>
                    <CollapsibleTrigger className="flex items-center gap-2 mt-2 text-sm text-muted-foreground hover:text-foreground">
                      <ChevronDown className={`h-4 w-4 transition-transform ${openSections.ram ? 'rotate-180' : ''}`} />
                      {openSections.ram ? 'Hide details' : 'Show details'}
                    </CollapsibleTrigger>
                    <CollapsibleContent className="mt-2">
                      <div className="space-y-1 text-sm text-muted-foreground pl-4 border-l-2 border-muted">
                        <p>Brand: {build.ram.attrs.brand}</p>
                        <p>Model: {build.ram.attrs.model}</p>
                        <p>Type: {build.ram.attrs.ram_type}</p>
                        {build.ram.attrs.total_memory && <p>Total Memory: {build.ram.attrs.total_memory} GB</p>}
                        {build.ram.attrs.one_unit_memory && <p>Per Module: {build.ram.attrs.one_unit_memory} GB</p>}
                        {build.ram.attrs.quantity && <p>Modules: {build.ram.attrs.quantity}</p>}
                        {build.ram.attrs.ram_speed && <p>Speed: {build.ram.attrs.ram_speed} MHz</p>}
                        <p>CAS Latency: {build.ram.attrs.cas_latency}</p>
                      </div>
                    </CollapsibleContent>
                  </Collapsible>
                </CardContent>
              </Card>
            )}

                        {/* Storage */}
            {build.storage && (
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg">Storage</h3>
                      <p className="font-medium text-sm">{build.storage.title}</p>
                      <p className="font-semibold text-green-600">{formatPrice(build.storage.price)}</p>
                    </div>
                  </div>
                  
                  <Collapsible open={openSections.storage} onOpenChange={() => toggleSection('storage')}>
                    <CollapsibleTrigger className="flex items-center gap-2 mt-2 text-sm text-muted-foreground hover:text-foreground">
                      <ChevronDown className={`h-4 w-4 transition-transform ${openSections.storage ? 'rotate-180' : ''}`} />
                      {openSections.storage ? 'Hide details' : 'Show details'}
                    </CollapsibleTrigger>
                    <CollapsibleContent className="mt-2">
                      <div className="space-y-1 text-sm text-muted-foreground pl-4 border-l-2 border-muted">
                        <p>Brand: {build.storage.attrs.brand}</p>
                        <p>Model: {build.storage.attrs.model}</p>
                        {build.storage.attrs.capacity && <p>Capacity: {build.storage.attrs.capacity} GB</p>}
                        <p>Type: {build.storage.attrs.mem_type}</p>
                        <p>Interface: {build.storage.attrs.interface}</p>
                        <p>Form Factor: {build.storage.attrs.form_factor}</p>
                        {build.storage.attrs.cache_mem && <p>Cache: {build.storage.attrs.cache_mem} MB</p>}
                      </div>
                    </CollapsibleContent>
                  </Collapsible>
                </CardContent>
              </Card>
            )}

            {/* PSU */}
            {build.psu && (
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg">Power Supply</h3>
                      <p className="font-medium text-sm">{build.psu.title}</p>
                      <p className="font-semibold text-green-600">{formatPrice(build.psu.price)}</p>
                    </div>
                  </div>
                  
                  <Collapsible open={openSections.psu} onOpenChange={() => toggleSection('psu')}>
                    <CollapsibleTrigger className="flex items-center gap-2 mt-2 text-sm text-muted-foreground hover:text-foreground">
                      <ChevronDown className={`h-4 w-4 transition-transform ${openSections.psu ? 'rotate-180' : ''}`} />
                      {openSections.psu ? 'Hide details' : 'Show details'}
                    </CollapsibleTrigger>
                    <CollapsibleContent className="mt-2">
                      <div className="space-y-1 text-sm text-muted-foreground pl-4 border-l-2 border-muted">
                        <p>Brand: {build.psu.attrs.brand}</p>
                        <p>Model: {build.psu.attrs.model}</p>
                        {build.psu.attrs.power && <p>Power: {build.psu.attrs.power}W</p>}
                        <p>Efficiency: {build.psu.attrs.efficiency}</p>
                        <p>Color: {build.psu.attrs.color}</p>
                      </div>
                    </CollapsibleContent>
                  </Collapsible>
                </CardContent>
              </Card>
            )}

            {/* Case */}
            {build.case && (
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg">Case</h3>
                      <p className="font-medium text-sm">{build.case.title}</p>
                      <p className="font-semibold text-green-600">{formatPrice(build.case.price)}</p>
                    </div>
                  </div>
                  
                  <Collapsible open={openSections.case} onOpenChange={() => toggleSection('case')}>
                    <CollapsibleTrigger className="flex items-center gap-2 mt-2 text-sm text-muted-foreground hover:text-foreground">
                      <ChevronDown className={`h-4 w-4 transition-transform ${openSections.case ? 'rotate-180' : ''}`} />
                      {openSections.case ? 'Hide details' : 'Show details'}
                    </CollapsibleTrigger>
                    <CollapsibleContent className="mt-2">
                      <div className="space-y-1 text-sm text-muted-foreground pl-4 border-l-2 border-muted">
                        <p>Brand: {build.case.attrs.brand}</p>
                        <p>Model: {build.case.attrs.model}</p>
                        <p>Type: {build.case.attrs.cabinet_type}</p>
                        <p>Color: {build.case.attrs.color}</p>
                        <p>Side Panel: {build.case.attrs.side_panel}</p>
                      </div>
                    </CollapsibleContent>
                  </Collapsible>
                </CardContent>
              </Card>
            )}

            {/* CPU Cooler */}
            {build.cpu_cooler && (
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg">CPU Cooler</h3>
                      <p className="font-medium text-sm">{build.cpu_cooler.title}</p>
                      <p className="font-semibold text-green-600">{formatPrice(build.cpu_cooler.price)}</p>
                    </div>
                  </div>
                  
                  <Collapsible open={openSections.cpu_cooler} onOpenChange={() => toggleSection('cpu_cooler')}>
                    <CollapsibleTrigger className="flex items-center gap-2 mt-2 text-sm text-muted-foreground hover:text-foreground">
                      <ChevronDown className={`h-4 w-4 transition-transform ${openSections.cpu_cooler ? 'rotate-180' : ''}`} />
                      {openSections.cpu_cooler ? 'Hide details' : 'Show details'}
                    </CollapsibleTrigger>
                    <CollapsibleContent className="mt-2">
                      <div className="space-y-1 text-sm text-muted-foreground pl-4 border-l-2 border-muted">
                        <p>Brand: {build.cpu_cooler.attrs.brand}</p>
                        <p>Model: {build.cpu_cooler.attrs.model}</p>
                        <p>Color: {build.cpu_cooler.attrs.color}</p>
                        {build.cpu_cooler.attrs.fan_rpm_base && <p>Base RPM: {build.cpu_cooler.attrs.fan_rpm_base}</p>}
                        {build.cpu_cooler.attrs.fan_rpm_max && <p>Max RPM: {build.cpu_cooler.attrs.fan_rpm_max}</p>}
                        {build.cpu_cooler.attrs.noise_level_base && <p>Base Noise: {build.cpu_cooler.attrs.noise_level_base} dB</p>}
                        {build.cpu_cooler.attrs.noise_level_max && <p>Max Noise: {build.cpu_cooler.attrs.noise_level_max} dB</p>}
                      </div>
                    </CollapsibleContent>
                  </Collapsible>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}