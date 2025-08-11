'use client'
import React, { useState, useEffect } from 'react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip } from 'recharts'

interface DiagramProps {
    data: any;
    onStartDateChange?: (date: string) => void;
    onEndDateChange?: (date: string) => void;
}

const transformData = (serverData: any) => {
    if (!serverData?.data) return [];
    
    return serverData.data.map((item: any) => {
        const productName = Object.keys(item.products)[0];
        const userCount = item.products[productName] || 0;
        
        return {
            date: new Date(item.date).toLocaleDateString('uk-UA', { 
                month: 'short', 
                day: 'numeric' 
            }),
            users: userCount,
            fullDate: item.date
        };
    });
};

const Diagram = ({ data, onStartDateChange, onEndDateChange }: DiagramProps) => {
    const [isHovered, setIsHovered] = useState(false);
    const [startDate, setStartDate] = useState<string>('2025-07-01');
    const [endDate, setEndDate] = useState<string>(new Date().toISOString().split('T')[0]);
    const [chartData, setChartData] = useState(transformData(data));

    useEffect(() => {
        setChartData(transformData(data));
    }, [data]);

    const handleStartDateChange = (date: string) => {
        if(date > endDate) {
            setStartDate(endDate);
            onStartDateChange?.(endDate);
            return;
        }
        if(date > new Date().toISOString().split('T')[0]) {
            setStartDate(new Date().toISOString().split('T')[0]);
            onStartDateChange?.(new Date().toISOString().split('T')[0]);
            return;
        }
        setStartDate(date);
        onStartDateChange?.(date);
    };
    const handleEndDateChange = (date: string) => {
        if(date < startDate) {
            setEndDate(startDate);
            onEndDateChange?.(startDate);
            return;
        }
        if(date > new Date().toISOString().split('T')[0]) {
            setEndDate(new Date().toISOString().split('T')[0]);
            onEndDateChange?.(new Date().toISOString().split('T')[0]);
            return;
        }
        setEndDate(date);
        onEndDateChange?.(date);
    };

    const CustomTooltip = ({ active, payload, label }: any) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
                    <p className="text-sm text-gray-600">{label}</p>
                    <p className="text-lg font-semibold text-blue-600">
                        Users: {payload[0].value}
                    </p>
                </div>
            );
        }
        return null;
    };

    if (!data || !data.data || data.data.length === 0) {
        return (
            <div className="flex items-center justify-center h-[300px] bg-gray-50 rounded-lg">
                <p className="text-gray-500">No data to display</p>
            </div>
        );
    }

    return (
        <div className="w-full">
            <ResponsiveContainer width="100%" height={300}>
                <LineChart data={chartData}>
                    <Tooltip content={<CustomTooltip />} />
                    <CartesianGrid stroke="#e6e6e6" strokeDasharray="3 3" vertical={false} />
                    <XAxis 
                        dataKey="date"
                        stroke="#999"
                        tick={{ fill: '#555', fontSize: 12 }}
                        axisLine={{ stroke: '#ddd' }}
                        tickLine={{ stroke: '#ddd' }}
                    />
                    <YAxis 
                        tick={{ fill: '#555', fontSize: 12 }}
                        axisLine={{ stroke: '#ddd' }}
                        tickLine={{ stroke: '#ddd' }}
                        label={{ value: 'Users', angle: -90, position: 'insideLeft' }}
                    />
                    <Line 
                        type="monotone"
                        dataKey="users" 
                        stroke={isHovered ? '#ff7e5f' : '#3b82f6'}
                        strokeWidth={2}
                        dot={{ fill: '#3b82f6', strokeWidth: 2, r: 4 }}
                        activeDot={{ r: 6, stroke: '#ff7e5f', strokeWidth: 2 }}
                        onMouseEnter={() => setIsHovered(true)}
                        onMouseLeave={() => setIsHovered(false)}
                    />
                </LineChart>
            </ResponsiveContainer>

            <div className="mt-4 p-4 bg-gray-50 rounded-lg flex gap-4">
                <div className=''>
                    <label className="pr-2" htmlFor="start_date">Start date</label>
                    <input type="date" className='border border-gray-300 rounded-md p-2' value={startDate} onChange={(e) => {
                        handleStartDateChange(e.target.value);
                    }} />
                </div>
                <div className=''>
                    <label className="pr-2" htmlFor="end_date">End date</label>
                    <input type="date" className='border border-gray-300 rounded-md p-2' value={endDate} onChange={(e) => {
                        handleEndDateChange(e.target.value);
                    }} />
                </div>
            </div>
            
            {/* Product info */}
            {data.product_info && (
                <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">
                        {data.product_info.name}
                    </h3>
                    <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
                        <div>
                            <span className="font-medium">Brand:</span> {data.product_info.brand}
                        </div>
                        <div>
                            <span className="font-medium">Category:</span> {data.product_info.category}
                        </div>
                        <div>
                            <span className="font-medium">Total users:</span> {data.total_users}
                        </div>
                        <div>
                            <span className="font-medium">Period:</span> {data.date_range?.start_date} - {data.date_range?.end_date}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Diagram; 