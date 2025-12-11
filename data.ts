import { CountryData } from './types';

// Helper to generate mock data
const generateData = (): CountryData[] => {
  return [
    { id: 'USA', name: 'United States', region: 'North America', electricity: 100, connectivity: 99.8, gap: 0.2, population: 331, gdp: 63 },
    { id: 'CAN', name: 'Canada', region: 'North America', electricity: 100, connectivity: 99.0, gap: 1.0, population: 38, gdp: 43 },
    
    { id: 'DEU', name: 'Germany', region: 'Europe & Central Asia', electricity: 100, connectivity: 99.5, gap: 0.5, population: 83, gdp: 46 },
    { id: 'NOR', name: 'Norway', region: 'Europe & Central Asia', electricity: 100, connectivity: 99.9, gap: 0.1, population: 5, gdp: 67 },
    { id: 'UKR', name: 'Ukraine', region: 'Europe & Central Asia', electricity: 100, connectivity: 85.0, gap: 15.0, population: 44, gdp: 3.7 },
    { id: 'GBR', name: 'United Kingdom', region: 'Europe & Central Asia', electricity: 100, connectivity: 99.0, gap: 1.0, population: 67, gdp: 40 },
    
    { id: 'CHN', name: 'China', region: 'East Asia & Pacific', electricity: 100, connectivity: 98.0, gap: 2.0, population: 1400, gdp: 10 },
    { id: 'JPN', name: 'Japan', region: 'East Asia & Pacific', electricity: 100, connectivity: 99.9, gap: 0.1, population: 125, gdp: 40 },
    { id: 'VNM', name: 'Vietnam', region: 'East Asia & Pacific', electricity: 99.4, connectivity: 95.0, gap: 4.4, population: 97, gdp: 2.7 },
    { id: 'IDN', name: 'Indonesia', region: 'East Asia & Pacific', electricity: 98.5, connectivity: 92.0, gap: 6.5, population: 273, gdp: 3.8 },
    
    { id: 'BRA', name: 'Brazil', region: 'Latin America & Caribbean', electricity: 99.8, connectivity: 88.0, gap: 11.8, population: 212, gdp: 6.7 },
    { id: 'MEX', name: 'Mexico', region: 'Latin America & Caribbean', electricity: 99.0, connectivity: 85.0, gap: 14.0, population: 128, gdp: 8.3 },
    { id: 'HTI', name: 'Haiti', region: 'Latin America & Caribbean', electricity: 45.0, connectivity: 40.0, gap: 5.0, population: 11, gdp: 1.1 },
    
    { id: 'EGY', name: 'Egypt', region: 'Middle East & North Africa', electricity: 100, connectivity: 90.0, gap: 10.0, population: 102, gdp: 3.5 },
    { id: 'SAU', name: 'Saudi Arabia', region: 'Middle East & North Africa', electricity: 100, connectivity: 98.0, gap: 2.0, population: 34, gdp: 20 },
    { id: 'UAE', name: 'UAE', region: 'Middle East & North Africa', electricity: 100, connectivity: 100, gap: 0, population: 9, gdp: 36 },

    { id: 'IND', name: 'India', region: 'South Asia', electricity: 97.0, connectivity: 98.0, gap: -1.0, population: 1380, gdp: 1.9 }, 
    { id: 'PAK', name: 'Pakistan', region: 'South Asia', electricity: 75.0, connectivity: 70.0, gap: 5.0, population: 220, gdp: 1.1 },
    { id: 'BGD', name: 'Bangladesh', region: 'South Asia', electricity: 85.0, connectivity: 95.0, gap: -10.0, population: 164, gdp: 1.9 },
    
    { id: 'ZAF', name: 'South Africa', region: 'Sub-Saharan Africa', electricity: 84.4, connectivity: 95.0, gap: -10.6, population: 59, gdp: 5 },
    { id: 'KEN', name: 'Kenya', region: 'Sub-Saharan Africa', electricity: 70.0, connectivity: 85.0, gap: -15.0, population: 53, gdp: 1.8 },
    { id: 'NGA', name: 'Nigeria', region: 'Sub-Saharan Africa', electricity: 55.4, connectivity: 75.0, gap: -19.6, population: 206, gdp: 2 },
    { id: 'ETH', name: 'Ethiopia', region: 'Sub-Saharan Africa', electricity: 48.0, connectivity: 40.0, gap: 8.0, population: 114, gdp: 0.9 },
    { id: 'COD', name: 'DR Congo', region: 'Sub-Saharan Africa', electricity: 19.0, connectivity: 35.0, gap: -16.0, population: 89, gdp: 0.5 },
    { id: 'SSD', name: 'South Sudan', region: 'Sub-Saharan Africa', electricity: 7.0, connectivity: 15.0, gap: -8.0, population: 11, gdp: 0.3 },
  ];
};

export const DATA = generateData();