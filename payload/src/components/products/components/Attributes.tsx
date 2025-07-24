import { ProductAttributes } from "@/services/types"



export const Attributes = ({ data, template, categoryId }: { data: ProductAttributes, template: any, categoryId?: number }) => {
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
                        {data.model && template.showModel && categoryId && categoryId < 9 && (
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
                    
                    {/* Mouse attributes (category 9) */}
                    {data.connectivity_technology && (template.showConnectivityTechnology !== false) && (
                        <div className="bg-gray-50 rounded-lg p-3">
                            <span className="text-sm text-muted-foreground block">Connectivity:</span>
                            <span className="font-semibold text-gray-900">{data.connectivity_technology}</span>
                        </div>
                    )}
                    {data.special_feature && (template.showSpecialFeature !== false) && (
                        <div className="bg-gray-50 rounded-lg p-3">
                            <span className="text-sm text-muted-foreground block">Special Features:</span>
                            <span className="font-semibold text-gray-900">{data.special_feature}</span>
                        </div>
                    )}
                    {data.movement_detection_technology && (template.showMovementDetectionTechnology !== false) && (
                        <div className="bg-gray-50 rounded-lg p-3">
                            <span className="text-sm text-muted-foreground block">Detection Technology:</span>
                            <span className="font-semibold text-gray-900">{data.movement_detection_technology}</span>
                        </div>
                    )}
                    {data.number_of_buttons && (template.showNumberOfButtons !== false) && (
                        <div className="bg-gray-50 rounded-lg p-3">
                            <span className="text-sm text-muted-foreground block">Number of Buttons:</span>
                            <span className="font-semibold text-gray-900">{data.number_of_buttons}</span>
                        </div>
                    )}
                    
                    {/* Monitor attributes (category 10) */}
                    {data.screen_size && (template.showScreenSize !== false) && (
                        <div className="bg-gray-50 rounded-lg p-3">
                            <span className="text-sm text-muted-foreground block">Screen Size:</span>
                            <span className="font-semibold text-gray-900">{data.screen_size}"</span>
                        </div>
                    )}
                    {data.resolution && (template.showResolution !== false) && (
                        <div className="bg-gray-50 rounded-lg p-3">
                            <span className="text-sm text-muted-foreground block">Resolution:</span>
                            <span className="font-semibold text-gray-900">{data.resolution}</span>
                        </div>
                    )}
                    {data.aspect_ratio && (template.showAspectRatio !== false) && (
                        <div className="bg-gray-50 rounded-lg p-3">
                            <span className="text-sm text-muted-foreground block">Aspect Ratio:</span>
                            <span className="font-semibold text-gray-900">{data.aspect_ratio}</span>
                        </div>
                    )}
                    {data.screen_surface_description && (template.showScreenSurfaceDescription !== false) && (
                        <div className="bg-gray-50 rounded-lg p-3">
                            <span className="text-sm text-muted-foreground block">Surface:</span>
                            <span className="font-semibold text-gray-900">{data.screen_surface_description}</span>
                        </div>
                    )}
                    {data.style && (template.showStyle !== false) && (
                        <div className="bg-gray-50 rounded-lg p-3">
                            <span className="text-sm text-muted-foreground block">Style:</span>
                            <span className="font-semibold text-gray-900">{data.style}</span>
                        </div>
                    )}
                    
                    {/* Keyboard attributes (category 11) */}
                    {data.pattern && (template.showPattern !== false) && (
                        <div className="bg-gray-50 rounded-lg p-3">
                            <span className="text-sm text-muted-foreground block">Pattern:</span>
                            <span className="font-semibold text-gray-900">{data.pattern}</span>
                        </div>
                    )}
                    {data.compatible_devices && (template.showCompatibleDevices !== false) && (
                        <div className="bg-gray-50 rounded-lg p-3">
                            <span className="text-sm text-muted-foreground block">Compatible Devices:</span>
                            <span className="font-semibold text-gray-900">{data.compatible_devices}</span>
                        </div>
                    )}
                    {data.keyboard_description && (template.showKeyboardDescription !== false) && (
                        <div className="bg-gray-50 rounded-lg p-3">
                            <span className="text-sm text-muted-foreground block">Description:</span>
                            <span className="font-semibold text-gray-900">{data.keyboard_description}</span>
                        </div>
                    )}
                    {data.recommended_uses_for_product && (template.showRecommendedUses !== false) && (
                        <div className="bg-gray-50 rounded-lg p-3">
                            <span className="text-sm text-muted-foreground block">Recommended Uses:</span>
                            <span className="font-semibold text-gray-900">{data.recommended_uses_for_product}</span>
                        </div>
                    )}
                    {data.number_of_keys && (template.showNumberOfKeys !== false) && (
                        <div className="bg-gray-50 rounded-lg p-3">
                            <span className="text-sm text-muted-foreground block">Number of Keys:</span>
                            <span className="font-semibold text-gray-900">{data.number_of_keys}</span>
                        </div>
                    )}
                    {data.keyboard_backlighting_color_support && (template.showBacklightingSupport !== false) && (
                        <div className="bg-gray-50 rounded-lg p-3">
                            <span className="text-sm text-muted-foreground block">Backlighting:</span>
                            <span className="font-semibold text-gray-900">{data.keyboard_backlighting_color_support}</span>
                        </div>
                    )}
                    {data.size && (template.showSize !== false) && (
                        <div className="bg-gray-50 rounded-lg p-3">
                            <span className="text-sm text-muted-foreground block">Size:</span>
                            <span className="font-semibold text-gray-900">{data.size}</span>
                        </div>
                    )}
                    
                    {/* Headset attributes (category 12) */}
                    {data.par_placement && (template.showParPlacement !== false) && (
                        <div className="bg-gray-50 rounded-lg p-3">
                            <span className="text-sm text-muted-foreground block">Placement:</span>
                            <span className="font-semibold text-gray-900">{data.par_placement}</span>
                        </div>
                    )}
                    {data.impedance && (template.showImpedance !== false) && (
                        <div className="bg-gray-50 rounded-lg p-3">
                            <span className="text-sm text-muted-foreground block">Impedance:</span>
                            <span className="font-semibold text-gray-900">{data.impedance} Ω</span>
                        </div>
                    )}
                    
                    {/* Mousepad attributes (category 13) */}
                    {data.material && (template.showMaterial !== false) && (
                        <div className="bg-gray-50 rounded-lg p-3">
                            <span className="text-sm text-muted-foreground block">Material:</span>
                            <span className="font-semibold text-gray-900">{data.material}</span>
                        </div>
                    )}
                    
                    {/* Chair attributes (category 14) */}
                    {data.product_dimensions && (template.showProductDimensions !== false) && (
                        <div className="bg-gray-50 rounded-lg p-3">
                            <span className="text-sm text-muted-foreground block">Dimensions:</span>
                            <span className="font-semibold text-gray-900">{data.product_dimensions}</span>
                        </div>
                    )}
                    {data.back_style && (template.showBackStyle !== false) && (
                        <div className="bg-gray-50 rounded-lg p-3">
                            <span className="text-sm text-muted-foreground block">Back Style:</span>
                            <span className="font-semibold text-gray-900">{data.back_style}</span>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}