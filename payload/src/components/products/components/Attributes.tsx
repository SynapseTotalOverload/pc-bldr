import { ProductAttributes } from "@/services/types"

export const Attributes = (data: ProductAttributes) => {
    console.log('data', data)
    
    return (
        <div className="bg-gradient-to-br from-gray-50 to-blue-50/30 rounded-xl p-6 space-y-6">
            {/* Required fields */}
            <div className="bg-white/60 backdrop-blur-sm rounded-lg p-4 border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-800 mb-3">Basic Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-center gap-3">
                        <span className="text-sm text-muted-foreground font-medium">Brand:</span>
                        <span className="font-semibold text-gray-900">{data.brand}</span>
                    </div>
                    <div className="flex items-center gap-3">
                        <span className="text-sm text-muted-foreground font-medium">Model:</span>
                        <span className="font-semibold text-gray-900">{data.model}</span>
                    </div>
                </div>
            </div>

            {/* General optional fields */}
            {data.color && (
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
                    {data.cores && (
                        <div className="bg-gray-50 rounded-lg p-3">
                            <span className="text-sm text-muted-foreground block">Cores:</span>
                            <span className="font-semibold text-gray-900">{data.cores}</span>
                        </div>
                    )}
                    {data.threads && (
                        <div className="bg-gray-50 rounded-lg p-3">
                            <span className="text-sm text-muted-foreground block">Threads:</span>
                            <span className="font-semibold text-gray-900">{data.threads}</span>
                        </div>
                    )}
                    {data.socket_type && (
                        <div className="bg-gray-50 rounded-lg p-3">
                            <span className="text-sm text-muted-foreground block">Socket Type:</span>
                            <span className="font-semibold text-gray-900">{data.socket_type}</span>
                        </div>
                    )}
                    {data.base_speed && (
                        <div className="bg-gray-50 rounded-lg p-3">
                            <span className="text-sm text-muted-foreground block">Base Speed:</span>
                            <span className="font-semibold text-gray-900">{data.base_speed} GHz</span>
                        </div>
                    )}
                    {data.turbo_speed && (
                        <div className="bg-gray-50 rounded-lg p-3">
                            <span className="text-sm text-muted-foreground block">Turbo Speed:</span>
                            <span className="font-semibold text-gray-900">{data.turbo_speed} GHz</span>
                        </div>
                    )}
                    {data.architechture && (
                        <div className="bg-gray-50 rounded-lg p-3">
                            <span className="text-sm text-muted-foreground block">Architecture:</span>
                            <span className="font-semibold text-gray-900">{data.architechture}</span>
                        </div>
                    )}
                    {data.core_family && (
                        <div className="bg-gray-50 rounded-lg p-3">
                            <span className="text-sm text-muted-foreground block">Core Family:</span>
                            <span className="font-semibold text-gray-900">{data.core_family}</span>
                        </div>
                    )}
                    {data.generation && (
                        <div className="bg-gray-50 rounded-lg p-3">
                            <span className="text-sm text-muted-foreground block">Generation:</span>
                            <span className="font-semibold text-gray-900">{data.generation}</span>
                        </div>
                    )}
                    {data.integrated_graphics && (
                        <div className="bg-gray-50 rounded-lg p-3">
                            <span className="text-sm text-muted-foreground block">Integrated Graphics:</span>
                            <span className="font-semibold text-gray-900">{data.integrated_graphics}</span>
                        </div>
                    )}
                    {data.memory_type && (
                        <div className="bg-gray-50 rounded-lg p-3">
                            <span className="text-sm text-muted-foreground block">Memory Type:</span>
                            <span className="font-semibold text-gray-900">{data.memory_type}</span>
                        </div>
                    )}
                    {data.memory_speed && (
                        <div className="bg-gray-50 rounded-lg p-3">
                            <span className="text-sm text-muted-foreground block">Memory Speed:</span>
                            <span className="font-semibold text-gray-900">{data.memory_speed} MHz</span>
                        </div>
                    )}
                    {data.series && (
                        <div className="bg-gray-50 rounded-lg p-3">
                            <span className="text-sm text-muted-foreground block">Series:</span>
                            <span className="font-semibold text-gray-900">{data.series}</span>
                        </div>
                    )}
                    {data.fan_rpm_base && (
                        <div className="bg-gray-50 rounded-lg p-3">
                            <span className="text-sm text-muted-foreground block">Base Fan RPM:</span>
                            <span className="font-semibold text-gray-900">{data.fan_rpm_base}</span>
                        </div>
                    )}
                    {data.fan_rpm_max && (
                        <div className="bg-gray-50 rounded-lg p-3">
                            <span className="text-sm text-muted-foreground block">Max Fan RPM:</span>
                            <span className="font-semibold text-gray-900">{data.fan_rpm_max}</span>
                        </div>
                    )}
                    {data.noise_level_base && (
                        <div className="bg-gray-50 rounded-lg p-3">
                            <span className="text-sm text-muted-foreground block">Base Noise Level:</span>
                            <span className="font-semibold text-gray-900">{data.noise_level_base} dB</span>
                        </div>
                    )}
                    {data.noise_level_max && (
                        <div className="bg-gray-50 rounded-lg p-3">
                            <span className="text-sm text-muted-foreground block">Max Noise Level:</span>
                            <span className="font-semibold text-gray-900">{data.noise_level_max} dB</span>
                        </div>
                    )}
                    {data.base_clock && (
                        <div className="bg-gray-50 rounded-lg p-3">
                            <span className="text-sm text-muted-foreground block">Base Clock:</span>
                            <span className="font-semibold text-gray-900">{data.base_clock} MHz</span>
                        </div>
                    )}
                    {data.chipset && (
                        <div className="bg-gray-50 rounded-lg p-3">
                            <span className="text-sm text-muted-foreground block">Chipset:</span>
                            <span className="font-semibold text-gray-900">{data.chipset}</span>
                        </div>
                    )}
                    {data.clock_speed && (
                        <div className="bg-gray-50 rounded-lg p-3">
                            <span className="text-sm text-muted-foreground block">Clock Speed:</span>
                            <span className="font-semibold text-gray-900">{data.clock_speed} MHz</span>
                        </div>
                    )}
                    {data.frame_sync && (
                        <div className="bg-gray-50 rounded-lg p-3">
                            <span className="text-sm text-muted-foreground block">Frame Sync:</span>
                            <span className="font-semibold text-gray-900">{data.frame_sync}</span>
                        </div>
                    )}
                    {data.interface && (
                        <div className="bg-gray-50 rounded-lg p-3">
                            <span className="text-sm text-muted-foreground block">Interface:</span>
                            <span className="font-semibold text-gray-900">{data.interface}</span>
                        </div>
                    )}
                    {data.length && (
                        <div className="bg-gray-50 rounded-lg p-3">
                            <span className="text-sm text-muted-foreground block">Length:</span>
                            <span className="font-semibold text-gray-900">{data.length} mm</span>
                        </div>
                    )}
                    {data.mem_interface && (
                        <div className="bg-gray-50 rounded-lg p-3">
                            <span className="text-sm text-muted-foreground block">Memory Interface:</span>
                            <span className="font-semibold text-gray-900">{data.mem_interface}</span>
                        </div>
                    )}
                    {data.memory && (
                        <div className="bg-gray-50 rounded-lg p-3">
                            <span className="text-sm text-muted-foreground block">Memory:</span>
                            <span className="font-semibold text-gray-900">{data.memory} GB</span>
                        </div>
                    )}
                    {data.form_factor && (
                        <div className="bg-gray-50 rounded-lg p-3">
                            <span className="text-sm text-muted-foreground block">Form Factor:</span>
                            <span className="font-semibold text-gray-900">{data.form_factor}</span>
                        </div>
                    )}
                    {data.max_ram_support && (
                        <div className="bg-gray-50 rounded-lg p-3">
                            <span className="text-sm text-muted-foreground block">Max RAM Support:</span>
                            <span className="font-semibold text-gray-900">{data.max_ram_support} GB</span>
                        </div>
                    )}
                    {data.ram_slots && (
                        <div className="bg-gray-50 rounded-lg p-3">
                            <span className="text-sm text-muted-foreground block">RAM Slots:</span>
                            <span className="font-semibold text-gray-900">{data.ram_slots}</span>
                        </div>
                    )}
                    {data.cas_latency && (
                        <div className="bg-gray-50 rounded-lg p-3">
                            <span className="text-sm text-muted-foreground block">CAS Latency:</span>
                            <span className="font-semibold text-gray-900">{data.cas_latency}</span>
                        </div>
                    )}
                    {data.one_unit_memory && (
                        <div className="bg-gray-50 rounded-lg p-3">
                            <span className="text-sm text-muted-foreground block">Per Module:</span>
                            <span className="font-semibold text-gray-900">{data.one_unit_memory} GB</span>
                        </div>
                    )}
                    {data.quantity && (
                        <div className="bg-gray-50 rounded-lg p-3">
                            <span className="text-sm text-muted-foreground block">Quantity:</span>
                            <span className="font-semibold text-gray-900">{data.quantity}</span>
                        </div>
                    )}
                    {data.ram_speed && (
                        <div className="bg-gray-50 rounded-lg p-3">
                            <span className="text-sm text-muted-foreground block">RAM Speed:</span>
                            <span className="font-semibold text-gray-900">{data.ram_speed} MHz</span>
                        </div>
                    )}
                    {data.ram_type && (
                        <div className="bg-gray-50 rounded-lg p-3">
                            <span className="text-sm text-muted-foreground block">RAM Type:</span>
                            <span className="font-semibold text-gray-900">{data.ram_type}</span>
                        </div>
                    )}
                    {data.total_memory && (
                        <div className="bg-gray-50 rounded-lg p-3">
                            <span className="text-sm text-muted-foreground block">Total Memory:</span>
                            <span className="font-semibold text-gray-900">{data.total_memory} GB</span>
                        </div>
                    )}
                    {data.cache_mem && (
                        <div className="bg-gray-50 rounded-lg p-3">
                            <span className="text-sm text-muted-foreground block">Cache Memory:</span>
                            <span className="font-semibold text-gray-900">{data.cache_mem} MB</span>
                        </div>
                    )}
                    {data.capacity && (
                        <div className="bg-gray-50 rounded-lg p-3">
                            <span className="text-sm text-muted-foreground block">Capacity:</span>
                            <span className="font-semibold text-gray-900">{data.capacity} GB</span>
                        </div>
                    )}
                    {data.mem_type && (
                        <div className="bg-gray-50 rounded-lg p-3">
                            <span className="text-sm text-muted-foreground block">Memory Type:</span>
                            <span className="font-semibold text-gray-900">{data.mem_type}</span>
                        </div>
                    )}
                    {data.efficiency && (
                        <div className="bg-gray-50 rounded-lg p-3">
                            <span className="text-sm text-muted-foreground block">Efficiency:</span>
                            <span className="font-semibold text-gray-900">{data.efficiency}</span>
                        </div>
                    )}
                    {data.power && (
                        <div className="bg-gray-50 rounded-lg p-3">
                            <span className="text-sm text-muted-foreground block">Power:</span>
                            <span className="font-semibold text-gray-900">{data.power} W</span>
                        </div>
                    )}
                    {data.cabinet_type && (
                        <div className="bg-gray-50 rounded-lg p-3">
                            <span className="text-sm text-muted-foreground block">Cabinet Type:</span>
                            <span className="font-semibold text-gray-900">{data.cabinet_type}</span>
                        </div>
                    )}
                    {data.side_panel && (
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