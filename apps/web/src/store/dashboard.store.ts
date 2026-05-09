import { create } from 'zustand';

interface DashboardStore {
  selectedCommodityId: string;
  selectedRegionId:    string;
  setSelectedCommodityId: (id: string) => void;
  setSelectedRegionId:    (id: string) => void;
  initializeIfEmpty: (commodityId: string, regionId: string) => void;
}

export const useDashboardStore = create<DashboardStore>((set, get) => ({
  selectedCommodityId: '',
  selectedRegionId:    '',
  setSelectedCommodityId: (id) => set({ selectedCommodityId: id }),
  setSelectedRegionId:    (id) => set({ selectedRegionId: id }),
  initializeIfEmpty: (commodityId, regionId) => {
    if (!get().selectedCommodityId) set({ selectedCommodityId: commodityId });
    if (!get().selectedRegionId)    set({ selectedRegionId: regionId });
  },
}));