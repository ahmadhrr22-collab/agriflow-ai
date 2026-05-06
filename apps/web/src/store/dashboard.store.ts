import { create } from 'zustand';

interface DashboardStore {
  selectedCommodityId: string;
  selectedRegionId:    string;
  setSelectedCommodityId: (id: string) => void;
  setSelectedRegionId:    (id: string) => void;
}

export const useDashboardStore = create<DashboardStore>((set) => ({
  selectedCommodityId: 'cmotsnfqt0000ix1oqixddl65', // cabai merah default
  selectedRegionId:    'cmotsnfsj0003ix1o3g2vp8h2', // jakarta pusat default
  setSelectedCommodityId: (id) => set({ selectedCommodityId: id }),
  setSelectedRegionId:    (id) => set({ selectedRegionId: id }),
}));