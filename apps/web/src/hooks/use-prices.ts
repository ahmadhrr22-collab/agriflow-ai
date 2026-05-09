'use client';

import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';

/* =========================================================
   Types
========================================================= */

export interface Commodity {
  id: string;
  name: string;
  localName: string;
}

export interface Region {
  id: string;
  name: string;
}

/* =========================================================
   Commodities
========================================================= */

export function useCommodities() {
  return useQuery<Commodity[]>({
    queryKey: ['commodities'],

    queryFn: async () => {
      const res = await api.get('/commodities');

      return res.data || [];
    },

    staleTime: 1000 * 60 * 10, // 10 menit
    refetchOnWindowFocus: false,
  });
}

/* =========================================================
   Regions
========================================================= */

export function useRegions() {
  return useQuery<Region[]>({
    queryKey: ['regions'],

    queryFn: async () => {
      const res = await api.get('/regions');

      return res.data || [];
    },

    staleTime: 1000 * 60 * 10,
    refetchOnWindowFocus: false,
  });
}

/* =========================================================
   National Summary
========================================================= */

export function useNationalSummary(
  commodityId: string,
) {
  return useQuery({
    queryKey: [
      'national-summary',
      commodityId,
    ],

    queryFn: async () => {
      const res = await api.get(
        '/prices/national-summary',
        {
          params: {
            commodityId,
          },
        },
      );

      return res.data;
    },

    enabled: Boolean(commodityId),

    staleTime: 1000 * 60 * 5,
    refetchInterval: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
  });
}

/* =========================================================
   Price History
========================================================= */

export function usePriceHistory(
  commodityId: string,
  regionId: string,
  days = 30,
) {
  return useQuery({
    queryKey: [
      'price-history',
      commodityId,
      regionId,
      days,
    ],

    queryFn: async () => {
      const res = await api.get(
        '/prices/history',
        {
          params: {
            commodityId,
            regionId,
            days,
          },
        },
      );

      return res.data || [];
    },

    enabled:
      Boolean(commodityId) &&
      Boolean(regionId),

    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
  });
}

/* =========================================================
   Heatmap
========================================================= */

export function useHeatmapData(
  commodityId: string,
) {
  return useQuery({
    queryKey: ['heatmap', commodityId],

    queryFn: async () => {
      const res = await api.get(
        '/prices/heatmap',
        {
          params: {
            commodityId,
          },
        },
      );

      return res.data || [];
    },

    enabled: Boolean(commodityId),

    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
  });
}