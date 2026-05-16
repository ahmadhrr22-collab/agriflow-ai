'use client';

import { useEffect, useState } from 'react';
import { MapContainer, GeoJSON, useMap } from 'react-leaflet';
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

function getRegionColor(deviation: number | undefined): string {
  if (deviation === undefined) return '#FFFFFF'; // Tidak Ada Data (White)
  if (deviation === null) return '#A0AEC0'; // Tidak Update (Grey)

  if (deviation > 10)  return '#8B0000'; // Dark Red
  if (deviation > 5)   return '#C53030'; // Red
  if (deviation > 0)   return '#E53E3E'; // Light Red
  
  if (deviation < -10) return '#22543D'; // Dark Green
  if (deviation < -5)  return '#2F855A'; // Green
  if (deviation <= 0)  return '#48BB78'; // Light Green
  
  return '#FFFFFF';
}

function MapController({ regions }: { regions: RegionData[] }) {
  const map = useMap();
  useEffect(() => {
    map.fitBounds([[-11.0, 95.0], [6.0, 141.0]]);
  }, [map]);
  return null;
}

export function HeatmapMap({ regions }: { regions: RegionData[] }) {
  const [geoData, setGeoData] = useState<any>(null);

  useEffect(() => {
    fetch('/indonesia-prov.geojson')
      .then(res => res.json())
      .then(data => setGeoData(data))
      .catch(err => console.error(err));
  }, []);

  const regionMap = new Map(regions.map(r => [r.regionName.toUpperCase(), r]));

  const styleFeature = (feature: any) => {
    const propinsi = feature.properties.Propinsi;
    const region = regionMap.get(propinsi);
    return {
      fillColor: getRegionColor(region?.deviation),
      weight: 0.8,
      opacity: 1,
      color: '#FFFFFF',
      fillOpacity: 1
    };
  };

  const onEachFeature = (feature: any, layer: any) => {
    const propinsi = feature.properties.Propinsi;
    const region = regionMap.get(propinsi);
    
    if (region) {
      const isHigh = region.deviation > 0;
      const popupContent = `
        <div style="font-family: sans-serif; min-width: 180px;">
          <div style="font-weight: 600; font-size: 14px; margin-bottom: 8px;">${region.regionName}</div>
          <div style="font-size: 18px; font-weight: 700; color: ${getRegionColor(region.deviation)}; margin-bottom: 4px;">
            Rp ${region.price.toLocaleString('id-ID')}
          </div>
          <div style="font-size: 12px; color: #888; margin-bottom: 8px;">
            Rata-rata nasional: Rp ${region.avgNational.toLocaleString('id-ID')}
          </div>
          <div style="display: inline-flex; align-items: center; gap: 4px; padding: 2px 8px; border-radius: 20px; font-size: 12px; font-weight: 600; background: ${isHigh ? '#FCEBEB' : '#EAF3DE'}; color: ${isHigh ? '#A32D2D' : '#27500A'};">
            ${isHigh ? '↑' : '↓'} ${Math.abs(region.deviation).toFixed(1)}% vs nasional
          </div>
        </div>
      `;
      layer.bindPopup(popupContent);
    } else {
      layer.bindPopup(`<div style="font-family: sans-serif;"><b>${propinsi}</b><br/>Tidak Ada Data</div>`);
    }
  };

  return (
    <div style={{ position: 'relative', height: '100%', width: '100%' }}>
      <MapContainer
        center={[-2.5, 118.0]}
        zoom={5}
        style={{ height: '100%', width: '100%', borderRadius: '12px', background: 'linear-gradient(to bottom, #112B47, #1A4470)' }}
        zoomControl={false}
        scrollWheelZoom={false}
        dragging={false}
        doubleClickZoom={false}
      >
        <MapController regions={regions} />
        {geoData && (
          <GeoJSON
            data={geoData}
            style={styleFeature}
            onEachFeature={onEachFeature}
          />
        )}
      </MapContainer>
    </div>
  );
}