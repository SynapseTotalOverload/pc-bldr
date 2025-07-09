'use client'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import React, { useState } from 'react'
import { Search, X, Sparkles } from 'lucide-react'

type SearchInputProps = {
  onSearch: (query: string) => void
}

export const SearchInput: React.FC<SearchInputProps> = ({ onSearch }) => {
  const [searchQuery, setSearchQuery] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSearch(searchQuery)
  }

  const handleClear = () => {
    setSearchQuery('')
    onSearch('')
  }

  return (
    <div className="relative mb-8">
      <div className="absolute inset-0 from-indigo-50/40 via-purple-50/30 to-pink-50/40 rounded-2xl" />
      
      <div className="relative z-10 p-6">       

        <form onSubmit={handleSubmit} className="max-w-lg mx-auto ">
          <div className="relative group">
            <div className="relative">
              <div className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10">
                <Search className="w-5 h-5 text-gray-400 group-focus-within:text-purple-500 transition-colors duration-300" />
              </div>
              
              <Input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by name, brand, or model..."
                className="pl-12 pr-20 py-4 text-lg bg-white/80 backdrop-blur-sm border-2 border-gray-200/60 focus:border-purple-400 focus:ring-4 focus:ring-purple-100 transition-all duration-300 rounded-lg shadow-lg hover:shadow-xl group-hover:border-purple-300"
              />
              
              {searchQuery && (
                <button
                  type="button"
                  onClick={handleClear}
                  className="absolute right-16 top-1/2 transform -translate-y-1/2 p-1 rounded-full bg-gray-200 hover:bg-gray-300 transition-colors duration-200 z-10"
                >
                  <X className="w-4 h-4 text-gray-600" />
                </button>
              )}
              <Button 
                type="submit"
                className="absolute right-2 top-1/2 transform -translate-y-1/2 px-6 py-2 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 z-10"
              >
                <Search className="w-4 h-4" />
            </Button>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
} 