import { ProductAttributes } from "@/services/types"



export const Attributes = ({ data, template }: { data: ProductAttributes, template: any }) => {
    console.log('template', template)
    
    return (
        <div className="bg-gradient-to-br from-gray-50 to-blue-50/30 rounded-xl p-6 space-y-6">
            {(data.brand || data.model) && (
                <div className="bg-white/60 backdrop-blur-sm rounded-lg p-4 border border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-800 mb-3">Basic Information</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {data.brand && template.showBrand && (
                            <div className="flex items-center gap-3">
                                <span className="text-sm text-muted-foreground font-medium">Brand:</span>
                                <span className="font-semibold text-gray-900">{data.brand}</span>
                            </div>
                        )}
                        {data.model && template.showModel && (
                            <div className="flex items-center gap-3">
                                <span className="text-sm text-muted-foreground font-medium">Model:</span>
                                <span className="font-semibold text-gray-900">{data.model}</span>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {data.color && template.showColor && (
                <div className="bg-white/60 backdrop-blur-sm rounded-lg p-4 border border-gray-200">
                    <div className="flex items-center gap-3">
                        <span className="text-sm text-muted-foreground font-medium">Color:</span>
                        <span className="font-semibold text-gray-900">{data.color}</span>
                    </div>
                </div>
            )}
            
            {/* Specifications */}
            <div className="bg-white/60 backdrop-blur-sm rounded-lg p-4 border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Specifications</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {data.cores && template.showCores && (
                        <div className="bg-gray-50 rounded-lg p-3">
                            <span className="text-sm text-muted-foreground block">Cores:</span>
                            <span className="font-semibold text-gray-900">{data.cores}</span>
                        </div>
                    )}
                    {data.threads && template.showThreads && (
                        <div className="bg-gray-50 rounded-lg p-3">
                            <span className="text-sm text-muted-foreground block">Threads:</span>
                            <span className="font-semibold text-gray-900">{data.threads}</span>
                        </div>
                    )}
                    {data.socket_type && template.showSocketType && (
                        <div className="bg-gray-50 rounded-lg p-3">
                            <span className="text-sm text-muted-foreground block">Socket Type:</span>
                            <span className="font-semibold text-gray-900">{data.socket_type}</span>
                        </div>
                    )}
                    {data.base_speed && template.showBaseSpeed && (
                        <div className="bg-gray-50 rounded-lg p-3">
                            <span className="text-sm text-muted-foreground block">Base Speed:</span>
                            <span className="font-semibold text-gray-900">{data.base_speed} GHz</span>
                        </div>
                    )}
                    {data.turbo_speed && template.showTurboSpeed && (
                        <div className="bg-gray-50 rounded-lg p-3">
                            <span className="text-sm text-muted-foreground block">Turbo Speed:</span>
                            <span className="font-semibold text-gray-900">{data.turbo_speed} GHz</span>
                        </div>
                    )}
                    {data.architechture && template.showArchitecture && (
                        <div className="bg-gray-50 rounded-lg p-3">
                            <span className="text-sm text-muted-foreground block">Architecture:</span>
                            <span className="font-semibold text-gray-900">{data.architechture}</span>
                        </div>
                    )}
                    {data.core_family && template.showCoreFamily && (
                        <div className="bg-gray-50 rounded-lg p-3">
                            <span className="text-sm text-muted-foreground block">Core Family:</span>
                            <span className="font-semibold text-gray-900">{data.core_family}</span>
                        </div>
                    )}
                    {data.generation && template.showGeneration && (
                        <div className="bg-gray-50 rounded-lg p-3">
                            <span className="text-sm text-muted-foreground block">Generation:</span>
                            <span className="font-semibold text-gray-900">{data.generation}</span>
                        </div>
                    )}
                    {data.integrated_graphics && template.showIntegratedGraphics && (
                        <div className="bg-gray-50 rounded-lg p-3">
                            <span className="text-sm text-muted-foreground block">Integrated Graphics:</span>
                            <span className="font-semibold text-gray-900">{data.integrated_graphics}</span>
                        </div>
                    )}
                    {data.memory_type && template.showMemoryType && (
                        <div className="bg-gray-50 rounded-lg p-3">
                            <span className="text-sm text-muted-foreground block">Memory Type:</span>
                            <span className="font-semibold text-gray-900">{data.memory_type}</span>
                        </div>
                    )}
                    {data.memory_speed && template.showMemorySpeed && (
                        <div className="bg-gray-50 rounded-lg p-3">
                            <span className="text-sm text-muted-foreground block">Memory Speed:</span>
                            <span className="font-semibold text-gray-900">{data.memory_speed} MHz</span>
                        </div>
                    )}
                    {data.series && template.showSeries && (
                        <div className="bg-gray-50 rounded-lg p-3">
                            <span className="text-sm text-muted-foreground block">Series:</span>
                            <span className="font-semibold text-gray-900">{data.series}</span>
                        </div>
                    )}
                    {data.fan_rpm_base && template.showBaseFanRPM && (
                        <div className="bg-gray-50 rounded-lg p-3">
                            <span className="text-sm text-muted-foreground block">Base Fan RPM:</span>
                            <span className="font-semibold text-gray-900">{data.fan_rpm_base}</span>
                        </div>
                    )}
                    {data.fan_rpm_max && template.showMaxFanRPM && (
                        <div className="bg-gray-50 rounded-lg p-3">
                            <span className="text-sm text-muted-foreground block">Max Fan RPM:</span>
                            <span className="font-semibold text-gray-900">{data.fan_rpm_max}</span>
                        </div>
                    )}
                    {data.noise_level_base && template.showBaseNoiseLevel && (
                        <div className="bg-gray-50 rounded-lg p-3">
                            <span className="text-sm text-muted-foreground block">Base Noise Level:</span>
                            <span className="font-semibold text-gray-900">{data.noise_level_base} dB</span>
                        </div>
                    )}
                    {data.noise_level_max && template.showMaxNoiseLevel && (
                        <div className="bg-gray-50 rounded-lg p-3">
                            <span className="text-sm text-muted-foreground block">Max Noise Level:</span>
                            <span className="font-semibold text-gray-900">{data.noise_level_max} dB</span>
                        </div>
                    )}
                    {data.base_clock && template.showBaseClock && (
                        <div className="bg-gray-50 rounded-lg p-3">
                            <span className="text-sm text-muted-foreground block">Base Clock:</span>
                            <span className="font-semibold text-gray-900">{data.base_clock} MHz</span>
                        </div>
                    )}
                    {data.chipset && template.showChipset && (
                        <div className="bg-gray-50 rounded-lg p-3">
                            <span className="text-sm text-muted-foreground block">Chipset:</span>
                            <span className="font-semibold text-gray-900">{data.chipset}</span>
                        </div>
                    )}
                    {data.clock_speed && template.showClockSpeed && (
                        <div className="bg-gray-50 rounded-lg p-3">
                            <span className="text-sm text-muted-foreground block">Clock Speed:</span>
                            <span className="font-semibold text-gray-900">{data.clock_speed} MHz</span>
                        </div>
                    )}
                    {data.frame_sync && template.showFrameSync && (
                        <div className="bg-gray-50 rounded-lg p-3">
                            <span className="text-sm text-muted-foreground block">Frame Sync:</span>
                            <span className="font-semibold text-gray-900">{data.frame_sync}</span>
                        </div>
                    )}
                    {data.interface && template.showInterface && (
                        <div className="bg-gray-50 rounded-lg p-3">
                            <span className="text-sm text-muted-foreground block">Interface:</span>
                            <span className="font-semibold text-gray-900">{data.interface}</span>
                        </div>
                    )}
                    {data.length && template.showLength && (
                        <div className="bg-gray-50 rounded-lg p-3">
                            <span className="text-sm text-muted-foreground block">Length:</span>
                            <span className="font-semibold text-gray-900">{data.length} mm</span>
                        </div>
                    )}
                    {data.mem_interface && template.showMemoryInterface && (
                        <div className="bg-gray-50 rounded-lg p-3">
                            <span className="text-sm text-muted-foreground block">Memory Interface:</span>
                            <span className="font-semibold text-gray-900">{data.mem_interface}</span>
                        </div>
                    )}
                    {data.memory && template.showMemory && (
                        <div className="bg-gray-50 rounded-lg p-3">
                            <span className="text-sm text-muted-foreground block">Memory:</span>
                            <span className="font-semibold text-gray-900">{data.memory} GB</span>
                        </div>
                    )}
                    {data.form_factor && template.showFormFactor && (
                        <div className="bg-gray-50 rounded-lg p-3">
                            <span className="text-sm text-muted-foreground block">Form Factor:</span>
                            <span className="font-semibold text-gray-900">{data.form_factor}</span>
                        </div>
                    )}
                    {data.max_ram_support && template.showMaxRAMSupport && (
                        <div className="bg-gray-50 rounded-lg p-3">
                            <span className="text-sm text-muted-foreground block">Max RAM Support:</span>
                            <span className="font-semibold text-gray-900">{data.max_ram_support} GB</span>
                        </div>
                    )}
                    {data.ram_slots && template.showRAMSlots && (
                        <div className="bg-gray-50 rounded-lg p-3">
                            <span className="text-sm text-muted-foreground block">RAM Slots:</span>
                            <span className="font-semibold text-gray-900">{data.ram_slots}</span>
                        </div>
                    )}
                    {data.cas_latency && template.showCASLatency && (
                        <div className="bg-gray-50 rounded-lg p-3">
                            <span className="text-sm text-muted-foreground block">CAS Latency:</span>
                            <span className="font-semibold text-gray-900">{data.cas_latency}</span>
                        </div>
                    )}
                    {data.one_unit_memory && template.showOneUnitMemory && (
                        <div className="bg-gray-50 rounded-lg p-3">
                            <span className="text-sm text-muted-foreground block">Per Module:</span>
                            <span className="font-semibold text-gray-900">{data.one_unit_memory} GB</span>
                        </div>
                    )}
                    {data.quantity && template.showQuantity && (
                        <div className="bg-gray-50 rounded-lg p-3">
                            <span className="text-sm text-muted-foreground block">Quantity:</span>
                            <span className="font-semibold text-gray-900">{data.quantity}</span>
                        </div>
                    )}
                    {data.ram_speed && template.showRAMSpeed && (
                        <div className="bg-gray-50 rounded-lg p-3">
                            <span className="text-sm text-muted-foreground block">RAM Speed:</span>
                            <span className="font-semibold text-gray-900">{data.ram_speed} MHz</span>
                        </div>
                    )}
                    {data.ram_type && template.showRAMType && (
                        <div className="bg-gray-50 rounded-lg p-3">
                            <span className="text-sm text-muted-foreground block">RAM Type:</span>
                            <span className="font-semibold text-gray-900">{data.ram_type}</span>
                        </div>
                    )}
                    {data.total_memory && template.showTotalMemory && (
                        <div className="bg-gray-50 rounded-lg p-3">
                            <span className="text-sm text-muted-foreground block">Total Memory:</span>
                            <span className="font-semibold text-gray-900">{data.total_memory} GB</span>
                        </div>
                    )}
                    {data.cache_mem && template.showCacheMemory && (
                        <div className="bg-gray-50 rounded-lg p-3">
                            <span className="text-sm text-muted-foreground block">Cache Memory:</span>
                            <span className="font-semibold text-gray-900">{data.cache_mem} MB</span>
                        </div>
                    )}
                    {data.capacity && template.showCapacity && (
                        <div className="bg-gray-50 rounded-lg p-3">
                            <span className="text-sm text-muted-foreground block">Capacity:</span>
                            <span className="font-semibold text-gray-900">{data.capacity} GB</span>
                        </div>
                    )}
                    {data.efficiency && template.showEfficiency && (
                        <div className="bg-gray-50 rounded-lg p-3">
                            <span className="text-sm text-muted-foreground block">Efficiency:</span>
                            <span className="font-semibold text-gray-900">{data.efficiency}</span>
                        </div>
                    )}
                    {data.power && template.showPower && (
                        <div className="bg-gray-50 rounded-lg p-3">
                            <span className="text-sm text-muted-foreground block">Power:</span>
                            <span className="font-semibold text-gray-900">{data.power} W</span>
                        </div>
                    )}
                    {data.cabinet_type && template.showCabinetType && (
                        <div className="bg-gray-50 rounded-lg p-3">
                            <span className="text-sm text-muted-foreground block">Cabinet Type:</span>
                            <span className="font-semibold text-gray-900">{data.cabinet_type}</span>
                        </div>
                    )}
                    {data.side_panel && template.showSidePanel && (
                        <div className="bg-gray-50 rounded-lg p-3">
                            <span className="text-sm text-muted-foreground block">Side Panel:</span>
                            <span className="font-semibold text-gray-900">{data.side_panel}</span>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}