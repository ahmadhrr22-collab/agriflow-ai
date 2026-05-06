'use client';

import { useEffect } from 'react';
import { MapContainer, TileLayer, CircleMarker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

interface RegionData {
  regionId:        string;
  regionName:      string;
  province:        string;
  latitude:        number;
  longitude:       number;
  price:           number;
  avgNational:     number;
  deviation:       number;
  confidenceScore: number;
  recordedAt:      string;
}

function getMarkerColor(deviation: number): string {
  if (deviation > 10)  return '#E24B4A';
  if (deviation > 5)   return '#EF9F27';
  if (deviation < -10) return '#185FA5';
  if (deviation < -5)  return '#378ADD';
  return '#166534';
}

function getMarkerSize(deviation: number): number {
  const abs = Math.abs(deviation);
  if (abs > 15) return 22;
  if (abs > 10) return 18;
  if (abs > 5)  return 14;
  return 12;
}

function MapController({ regions }: { regions: RegionData[] }) {
  const map = useMap();

  useEffect(() => {
    if (regions.length > 0) {
      map.setView([-6.5, 107.5], 8);
    }
  }, [regions, map]);

  return null;
}

export function HeatmapMap({ regions }: { regions: RegionData[] }) {
  return (
    <MapContainer
      center={[-6.5, 107.5]}
      zoom={8}
      style={{ height: '100%', width: '100%', borderRadius: '12px' }}
      zoomControl={true}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        opacity={0.6}
      />
      <MapController regions={regions} />

      {regions.map((region) => (
        <CircleMarker
          key={region.regionId}
          center={[region.latitude, region.longitude]}
          radius={getMarkerSize(region.deviation)}
          fillColor={getMarkerColor(region.deviation)}
          color="white"
          weight={2}
          opacity={1}
          fillOpacity={0.85}
        >
          <Popup>
            <div style={{fontFamily: 'sans-serif', minWidth: '180px'}}>
              <div style={{fontWeight: 600, fontSize: '14px', marginBottom: '8px'}}>
                {region.regionName}
              </div>
              <div style={{fontSize: '12px', color: '#666', marginBottom: '4px'}}>
                {region.province}
              </div>
              <div style={{
                fontSize: '18px',
                fontWeight: 700,
                color: getMarkerColor(region.deviation),
                marginBottom: '4px',
              }}>
                Rp {region.price.toLocaleString('id-ID')}
              </div>
              <div style={{fontSize: '12px', color: '#888', marginBottom: '8px'}}>
                Rata-rata nasional: Rp {region.avgNational.toLocaleString('id-ID')}
              </div>
              <div style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px',
                padding: '2px 8px',
                borderRadius: '20px',
                fontSize: '12px',
                fontWeight: 600,
                background: region.deviation > 0 ? '#FCEBEB' : '#EAF3DE',
                color: region.deviation > 0 ? '#A32D2D' : '#27500A',
              }}>
                {region.deviation > 0 ? '↑' : '↓'} {Math.abs(region.deviation)}% vs nasional
              </div>
              <div style={{fontSize: '11px', color: '#aaa', marginTop: '8px'}}>
                Confidence: {Math.round(region.confidenceScore * 100)}%
              </div>
            </div>
          </Popup>
        </CircleMarker>
      ))}
    </MapContainer>
  );
}