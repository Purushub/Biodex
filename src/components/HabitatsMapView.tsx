/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef, useMemo } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import {
  Habitat,
  StudentSession,
  SurveyRecord,
  SpeciesData,
  ChassisTheme,
  NavTab,
  GroundingChunk,
} from '../types';
import { getThemeConfig } from '../utils/theme';
import { soundFX } from '../utils/audio';
import { parseGpsString, formatGpsCoordinates } from '../utils/gpsParser';
import {
  MapPin,
  Compass,
  Navigation,
  ExternalLink,
  Sparkles,
  Crosshair,
  ArrowRight,
  Radio,
  Flame,
  Filter,
  Eye,
  Activity,
  Layers,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  X,
  Database,
  TreePine,
  Waves,
  SunMedium,
  CheckCircle2,
} from 'lucide-react';

interface HabitatsMapViewProps {
  habitats: Habitat[];
  activeHabitat: Habitat;
  onSelectHabitat: (habitat: Habitat) => void;
  onGoToHabitatAndScan: (habitat: Habitat) => void;
  session: StudentSession;
  surveyRecords?: SurveyRecord[];
  catalog?: SpeciesData[];
  theme?: ChassisTheme;
  onSelectRecordForSimulation?: (rec: SurveyRecord) => void;
  onSelectSpecies?: (species: SpeciesData) => void;
  onNavigateToTab?: (tab: NavTab) => void;
}

// Fallback field baseline records when database is freshly initialized
const BASELINE_FIELD_PINS: Array<{
  id: string;
  speciesCommon: string;
  speciesScientific: string;
  observedCount: number;
  habitatType: string;
  iucnStatus: string;
  riskPercent: number;
  gpsCoords: string;
  imageUrl: string;
  studentGuestId: string;
  timestamp: string;
}> = [
  {
    id: 'BASE-001',
    speciesCommon: 'Western Prairie Fringed Orchid',
    speciesScientific: 'Platanthera praeclara',
    observedCount: 8,
    habitatType: 'Wet-Mesic Tallgrass Prairie',
    iucnStatus: 'ENDANGERED',
    riskPercent: 68,
    gpsCoords: '44.8142° N, 93.3524° W',
    imageUrl: 'https://images.unsplash.com/photo-1508615039623-a25605d2b022?auto=format&fit=crop&w=400&q=80',
    studentGuestId: 'ECO-RANGER-01',
    timestamp: 'Today, 08:35 AM',
  },
  {
    id: 'BASE-002',
    speciesCommon: 'Monarch Butterfly',
    speciesScientific: 'Danaus plexippus',
    observedCount: 14,
    habitatType: 'Prairie Corridor North Quad',
    iucnStatus: 'ENDANGERED',
    riskPercent: 74,
    gpsCoords: '44.8188° N, 93.3490° W',
    imageUrl: 'https://images.unsplash.com/photo-1551893478-d726eaf0442c?auto=format&fit=crop&w=400&q=80',
    studentGuestId: 'FIELD-SCOUT-04',
    timestamp: 'Today, 09:12 AM',
  },
  {
    id: 'BASE-003',
    speciesCommon: "Blanding's Semi-Aquatic Turtle",
    speciesScientific: 'Emydoidea blandingii',
    observedCount: 2,
    habitatType: 'Alkaline Wetland Fen & Sedge Meadow',
    iucnStatus: 'ENDANGERED',
    riskPercent: 62,
    gpsCoords: '44.8215° N, 93.3411° W',
    imageUrl: 'https://images.unsplash.com/photo-1508817628294-5a453fa0b8fb?auto=format&fit=crop&w=400&q=80',
    studentGuestId: 'BIO-DETECTIVE-07',
    timestamp: 'Yesterday, 03:40 PM',
  },
  {
    id: 'BASE-004',
    speciesCommon: 'Karner Blue Butterfly',
    speciesScientific: 'Lycaeides melissa samuelis',
    observedCount: 6,
    habitatType: 'Bur Oak Savanna & Prairie Glade',
    iucnStatus: 'CRITICALLY ENDANGERED',
    riskPercent: 88,
    gpsCoords: '44.8051° N, 93.3688° W',
    imageUrl: 'https://images.unsplash.com/photo-1597848212624-a19eb35e2651?auto=format&fit=crop&w=400&q=80',
    studentGuestId: 'PRAIRIE-CURATOR-02',
    timestamp: '2 days ago',
  },
  {
    id: 'BASE-005',
    speciesCommon: 'Indian Leopard',
    speciesScientific: 'Panthera pardus fusca',
    observedCount: 2,
    habitatType: 'Jhalana Leopard Reserve (Jaipur, India)',
    iucnStatus: 'VULNERABLE',
    riskPercent: 44,
    gpsCoords: '26.8524° N, 75.8236° E',
    imageUrl: 'https://images.unsplash.com/photo-1456926631375-92c8ce872def?auto=format&fit=crop&w=400&q=80',
    studentGuestId: 'JAIPUR-RANGER-01',
    timestamp: 'Today, 06:40 AM',
  },
  {
    id: 'BASE-006',
    speciesCommon: 'Khejri Tree (Shami)',
    speciesScientific: 'Prosopis cineraria',
    observedCount: 15,
    habitatType: 'Nahargarh Biological Park (Jaipur, India)',
    iucnStatus: 'LEAST CONCERN',
    riskPercent: 18,
    gpsCoords: '26.9855° N, 75.8507° E',
    imageUrl: 'https://images.unsplash.com/photo-1542273917363-3b1817f69a2d?auto=format&fit=crop&w=400&q=80',
    studentGuestId: 'DESERT-BOTANIST-03',
    timestamp: 'Today, 08:15 AM',
  },
  {
    id: 'BASE-007',
    speciesCommon: 'Indian Peafowl (Mor)',
    speciesScientific: 'Pavo cristatus',
    observedCount: 9,
    habitatType: 'Amer & Sisodia Rani Ridge (Jaipur, India)',
    iucnStatus: 'LEAST CONCERN',
    riskPercent: 12,
    gpsCoords: '26.8912° N, 75.8245° E',
    imageUrl: 'https://images.unsplash.com/photo-1579202673506-ca3ce28943ef?auto=format&fit=crop&w=400&q=80',
    studentGuestId: 'PEACOCK-SURVEYOR-09',
    timestamp: 'Yesterday, 05:20 PM',
  },
  {
    id: 'BASE-008',
    speciesCommon: 'Bengal Tiger (Bagh)',
    speciesScientific: 'Panthera tigris tigris',
    observedCount: 1,
    habitatType: 'Ranthambore Tiger Reserve (Rajasthan, India)',
    iucnStatus: 'ENDANGERED',
    riskPercent: 53,
    gpsCoords: '26.0173° N, 76.5026° E',
    imageUrl: 'https://images.unsplash.com/photo-1561731216-c3a4d99437d5?auto=format&fit=crop&w=400&q=80',
    studentGuestId: 'TIGER-CORRIDOR-SCOUT',
    timestamp: 'Yesterday, 07:05 AM',
  },
];

export const HabitatsMapView: React.FC<HabitatsMapViewProps> = ({
  habitats,
  activeHabitat,
  onSelectHabitat,
  onGoToHabitatAndScan,
  session,
  surveyRecords = [],
  catalog = [],
  theme = 'ruby',
  onSelectRecordForSimulation,
  onSelectSpecies,
  onNavigateToTab,
}) => {
  const themeCfg = getThemeConfig((theme || 'ruby') as ChassisTheme);

  // Map DOM and Leaflet instance refs
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const leafletMapRef = useRef<L.Map | null>(null);
  const markersLayerGroupRef = useRef<L.LayerGroup | null>(null);
  const heatLayerGroupRef = useRef<L.LayerGroup | null>(null);

  // Live GPS state
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number }>({
    lat: 44.8142,
    lng: -93.3524,
  });
  const [isLocating, setIsLocating] = useState(false);
  const [gpsStatusText, setGpsStatusText] = useState('GPS Lock: Sector 4 Field Reserve');

  // Interactive Snapchat Map controls
  const [activeFilter, setActiveFilter] = useState<'ALL' | 'CRITICAL' | 'FLORA' | 'FAUNA'>('ALL');
  const [showHeatmapGlow, setShowHeatmapGlow] = useState(true);
  const [selectedRecord, setSelectedRecord] = useState<SurveyRecord | null>(null);
  const [selectedBaselinePin, setSelectedBaselinePin] = useState<(typeof BASELINE_FIELD_PINS)[0] | null>(null);

  // Google Maps Grounding state
  const [isSearchingMaps, setIsSearchingMaps] = useState(false);
  const [mapsGroundingAnalysis, setMapsGroundingAnalysis] = useState<string | null>(null);
  const [mapsGroundingChunks, setMapsGroundingChunks] = useState<GroundingChunk[]>([]);
  const [searchRadius, setSearchRadius] = useState<number>(25);

  // Geolocation acquisition
  useEffect(() => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const lat = pos.coords.latitude;
          const lng = pos.coords.longitude;
          setUserLocation({ lat, lng });
          setGpsStatusText(`Live GPS: ${formatGpsCoordinates(lat, lng)}`);
        },
        () => {
          setGpsStatusText('Standard Field GPS: 44.8142° N, 93.3524° W');
        },
        { timeout: 6000 }
      );
    }
  }, []);

  // Format all sightings: combine Firestore surveyRecords with baseline field observations
  const allPlottedSightings = useMemo(() => {
    const list: Array<{
      id: string;
      record?: SurveyRecord;
      speciesCommon: string;
      speciesScientific: string;
      observedCount: number;
      habitatType: string;
      iucnStatus: string;
      riskPercent: number;
      lat: number;
      lng: number;
      imageUrl: string;
      studentGuestId: string;
      timestamp: string;
      isFromDb: boolean;
    }> = [];

    // 1. Process records stored in database / PBR Register
    surveyRecords.forEach((rec, idx) => {
      const gpsRaw = rec.gpsCoordinates || rec.sectorCoord || '';
      // Parse GPS with slight offset if duplicate coordinates exist to prevent stacking
      const parsed = parseGpsString(gpsRaw, 44.8142 + (idx % 4) * 0.003, -93.3524 + (idx % 3) * 0.003);
      
      const commonName = rec.Species_Name_Common || rec.speciesCommon || 'Observed Specimen';
      const sciName = rec.Species_Name_Scientific || rec.speciesScientific || 'Taxon';
      const count = rec.Observed_Count ?? rec.observedCount ?? 1;
      const habitat = rec.Habitat_Type || rec.habitatType || 'Prairie Reserve';
      const iucn = rec.AI_Endangered_Status || rec.aiEndangeredStatus || 'ENDANGERED';
      const risk = rec.AI_Extinction_Risk_Percentage ?? rec.aiExtinctionRiskPercentage ?? 50;
      const img = rec.Image_URL || rec.imageUrl || 'https://images.unsplash.com/photo-1508615039623-a25605d2b022?auto=format&fit=crop&w=400&q=80';
      const guest = rec.Student_Guest_ID || rec.studentGuestId || 'PBR-RESEARCHER';
      const time = rec.Timestamp || rec.timestamp || 'Recorded Today';

      list.push({
        id: rec.Record_ID || rec.recordId || `survey-${idx}`,
        record: rec,
        speciesCommon: commonName,
        speciesScientific: sciName,
        observedCount: count,
        habitatType: habitat,
        iucnStatus: iucn,
        riskPercent: risk,
        lat: parsed.lat,
        lng: parsed.lng,
        imageUrl: img,
        studentGuestId: guest,
        timestamp: time,
        isFromDb: true,
      });
    });

    // 2. Add baseline field pins if fewer than 5 records exist
    BASELINE_FIELD_PINS.forEach((base) => {
      const parsed = parseGpsString(base.gpsCoords);
      list.push({
        id: base.id,
        speciesCommon: base.speciesCommon,
        speciesScientific: base.speciesScientific,
        observedCount: base.observedCount,
        habitatType: base.habitatType,
        iucnStatus: base.iucnStatus,
        riskPercent: base.riskPercent,
        lat: parsed.lat,
        lng: parsed.lng,
        imageUrl: base.imageUrl,
        studentGuestId: base.studentGuestId,
        timestamp: base.timestamp,
        isFromDb: false,
      });
    });

    return list;
  }, [surveyRecords]);

  // Filter sightings
  const filteredSightings = useMemo(() => {
    return allPlottedSightings.filter((s) => {
      if (activeFilter === 'CRITICAL') {
        const iucn = s.iucnStatus.toUpperCase();
        return iucn.includes('CRITICAL') || iucn.includes('ENDANGERED') || s.riskPercent > 60;
      }
      if (activeFilter === 'FLORA') {
        const common = s.speciesCommon.toLowerCase();
        return common.includes('orchid') || common.includes('lily') || common.includes('sunflower') || common.includes('apple') || common.includes('banana') || common.includes('marigold') || common.includes('flora');
      }
      if (activeFilter === 'FAUNA') {
        const common = s.speciesCommon.toLowerCase();
        return common.includes('butterfly') || common.includes('turtle') || common.includes('rattlesnake') || common.includes('bumblebee') || common.includes('snake') || common.includes('bee');
      }
      return true;
    });
  }, [allPlottedSightings, activeFilter]);

  // Initialize Leaflet Map
  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!leafletMapRef.current) {
      // Determine initial center
      const initialCenter: [number, number] = [userLocation.lat, userLocation.lng];

      const map = L.map(mapContainerRef.current, {
        center: initialCenter,
        zoom: 14,
        zoomControl: false, // We use custom Snapchat-style floating controls
        attributionControl: false,
      });

      // Select tile URL based on theme (Voyager for light/beige, Dark Matter for dark)
      const tileUrl = themeCfg.isLight
        ? 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png'
        : 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png';

      L.tileLayer(tileUrl, {
        maxZoom: 19,
        subdomains: 'abcd',
      }).addTo(map);

      // Layer groups for markers & heat glow
      const heatGroup = L.layerGroup().addTo(map);
      const markersGroup = L.layerGroup().addTo(map);

      heatLayerGroupRef.current = heatGroup;
      markersLayerGroupRef.current = markersGroup;
      leafletMapRef.current = map;
    }

    return () => {
      if (leafletMapRef.current) {
        leafletMapRef.current.remove();
        leafletMapRef.current = null;
      }
    };
  }, [themeCfg.isLight]);

  // Update Markers & Heatmap Circles
  useEffect(() => {
    const map = leafletMapRef.current;
    const markersGroup = markersLayerGroupRef.current;
    const heatGroup = heatLayerGroupRef.current;
    if (!map || !markersGroup || !heatGroup) return;

    markersGroup.clearLayers();
    heatGroup.clearLayers();

    // 1. Plot User / Field Researcher Bitmoji Avatar Marker
    const userBitmojiHtml = `
      <div class="relative flex flex-col items-center justify-center cursor-pointer group snap-avatar-pin">
        <div class="absolute -inset-2.5 rounded-full bg-blue-500/30 snap-pulse-ring pointer-events-none"></div>
        <div class="w-11 h-11 rounded-full bg-gradient-to-tr from-blue-600 to-cyan-400 p-0.5 shadow-xl ring-2 ring-white flex items-center justify-center">
          <div class="w-full h-full rounded-full bg-slate-900 flex items-center justify-center text-white text-base font-bold">
            🧑‍🔬
          </div>
        </div>
        <div class="w-0 h-0 border-l-[5px] border-l-transparent border-r-[5px] border-r-transparent border-t-[6px] border-t-white -mt-0.5 shadow-sm"></div>
        <div class="mt-0.5 bg-blue-600 text-white font-mono text-[8px] font-extrabold px-1.5 py-0.2 rounded-full border border-white shadow-md uppercase tracking-wider">
          YOU
        </div>
      </div>
    `;

    const userIcon = L.divIcon({
      html: userBitmojiHtml,
      className: 'snap-user-marker',
      iconSize: [44, 56],
      iconAnchor: [22, 48],
    });

    const userMarker = L.marker([userLocation.lat, userLocation.lng], { icon: userIcon });
    userMarker.on('click', () => {
      soundFX.playScanBeep();
      map.flyTo([userLocation.lat, userLocation.lng], 15, { duration: 0.8 });
    });
    markersGroup.addLayer(userMarker);

    // 2. Plot Specimen Sightings (Snapchat Bitmoji-Style Circular Avatar Pins)
    filteredSightings.forEach((sighting) => {
      const isCritical = sighting.iucnStatus.toUpperCase().includes('CRITIC') || sighting.riskPercent > 65;
      const isVulnerable = sighting.iucnStatus.toUpperCase().includes('VULNERABLE') || sighting.riskPercent > 35;
      
      const borderColor = isCritical ? '#ef4444' : isVulnerable ? '#f59e0b' : '#10b981';
      const ringPulseColor = isCritical ? 'rgba(239,68,68,0.4)' : isVulnerable ? 'rgba(245,158,11,0.4)' : 'rgba(16,185,129,0.4)';
      const badgeBg = isCritical ? 'bg-rose-600' : isVulnerable ? 'bg-amber-600' : 'bg-emerald-600';

      // Snap Map Heat Glow circle around sighting
      if (showHeatmapGlow) {
        const heatCircle = L.circle([sighting.lat, sighting.lng], {
          radius: 120 + sighting.observedCount * 10,
          stroke: false,
          fill: true,
          fillColor: borderColor,
          fillOpacity: themeCfg.isLight ? 0.22 : 0.32,
        });
        heatGroup.addLayer(heatCircle);
      }

      // Bitmoji Marker HTML
      const pinHtml = `
        <div class="relative flex flex-col items-center justify-center cursor-pointer group snap-avatar-pin" title="${sighting.speciesCommon} (${sighting.observedCount} observed)">
          <div class="absolute -inset-1.5 rounded-full snap-pulse-ring pointer-events-none" style="background-color: ${ringPulseColor}"></div>
          
          <div class="relative w-12 h-12 rounded-full overflow-hidden shadow-2xl ring-2 ring-white border-[3px]" style="border-color: ${borderColor}; background-color: #000;">
            <img src="${sighting.imageUrl}" alt="${sighting.speciesCommon}" class="w-full h-full object-cover" />
            <div class="absolute bottom-0 inset-x-0 bg-black/70 text-[8px] text-white text-center font-bold truncate px-0.5">
              ${sighting.speciesCommon.split(' ')[0]}
            </div>
          </div>
          
          <div class="w-0 h-0 border-l-[5px] border-l-transparent border-r-[5px] border-r-transparent border-t-[6px] border-t-white -mt-0.5 shadow-sm"></div>

          <!-- Count Pill Badge -->
          <div class="absolute -top-1.5 -right-1 ${badgeBg} text-white font-mono text-[9px] font-black px-1.5 py-0.2 rounded-full border border-white shadow-md">
            x${sighting.observedCount}
          </div>
        </div>
      `;

      const markerIcon = L.divIcon({
        html: pinHtml,
        className: 'snap-specimen-marker',
        iconSize: [48, 60],
        iconAnchor: [24, 52],
      });

      const marker = L.marker([sighting.lat, sighting.lng], { icon: markerIcon });

      marker.on('click', () => {
        soundFX.playClick();
        if (sighting.record) {
          setSelectedRecord(sighting.record);
          setSelectedBaselinePin(null);
        } else {
          setSelectedRecord(null);
          const foundBase = BASELINE_FIELD_PINS.find((b) => b.id === sighting.id) || null;
          setSelectedBaselinePin(foundBase);
        }
        map.flyTo([sighting.lat, sighting.lng], 15, { duration: 0.8 });
      });

      markersGroup.addLayer(marker);
    });

    // 3. Fit bounds if markers exist
    if (filteredSightings.length > 0) {
      const latLngs = filteredSightings.map((s) => L.latLng(s.lat, s.lng));
      latLngs.push(L.latLng(userLocation.lat, userLocation.lng));
      const bounds = L.latLngBounds(latLngs);
      map.fitBounds(bounds, { padding: [40, 40], maxZoom: 15 });
    }
  }, [filteredSightings, showHeatmapGlow, userLocation, themeCfg.isLight]);

  // Recenter on user
  const handleLocateMe = () => {
    soundFX.playScanBeep();
    setIsLocating(true);
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const lat = pos.coords.latitude;
          const lng = pos.coords.longitude;
          setUserLocation({ lat, lng });
          setGpsStatusText(`Live Device GPS: ${formatGpsCoordinates(lat, lng)}`);
          if (leafletMapRef.current) {
            leafletMapRef.current.flyTo([lat, lng], 15, { duration: 0.8 });
          }
          setIsLocating(false);
        },
        () => {
          if (leafletMapRef.current) {
            leafletMapRef.current.flyTo([userLocation.lat, userLocation.lng], 15, { duration: 0.8 });
          }
          setIsLocating(false);
        }
      );
    } else {
      if (leafletMapRef.current) {
        leafletMapRef.current.flyTo([userLocation.lat, userLocation.lng], 15, { duration: 0.8 });
      }
      setIsLocating(false);
    }
  };

  // Zoom controls
  const handleZoomIn = () => {
    soundFX.playClick();
    if (leafletMapRef.current) leafletMapRef.current.zoomIn();
  };

  const handleZoomOut = () => {
    soundFX.playClick();
    if (leafletMapRef.current) leafletMapRef.current.zoomOut();
  };

  const handleResetBounds = () => {
    soundFX.playClick();
    if (leafletMapRef.current && filteredSightings.length > 0) {
      const latLngs = filteredSightings.map((s) => L.latLng(s.lat, s.lng));
      latLngs.push(L.latLng(userLocation.lat, userLocation.lng));
      leafletMapRef.current.fitBounds(L.latLngBounds(latLngs), { padding: [40, 40], maxZoom: 15 });
    }
  };

  // Query Google Maps Grounding API
  const handleFetchNearbyGoogleMaps = async () => {
    try {
      soundFX.playConfirm();
      setIsSearchingMaps(true);
      setMapsGroundingAnalysis(null);
      setMapsGroundingChunks([]);

      const res = await fetch('/api/nearby-habitats', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          latitude: userLocation.lat,
          longitude: userLocation.lng,
          radiusKm: searchRadius,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setMapsGroundingAnalysis(data.analysis);
        setMapsGroundingChunks(data.groundingChunks || []);
      } else {
        setMapsGroundingAnalysis('Failed to load Google Maps data: ' + (data.error || 'Server error'));
      }
    } catch (err) {
      console.error('Error querying maps grounding:', err);
      setMapsGroundingAnalysis('Network error while querying Google Maps Grounding.');
    } finally {
      setIsSearchingMaps(false);
    }
  };

  const getHabitatIcon = (type: string) => {
    if (type.toLowerCase().includes('fen') || type.toLowerCase().includes('marsh') || type.toLowerCase().includes('wetland')) {
      return <Waves className="w-4 h-4 text-cyan-500" />;
    }
    if (type.toLowerCase().includes('savanna') || type.toLowerCase().includes('forest')) {
      return <TreePine className="w-4 h-4 text-emerald-600" />;
    }
    return <SunMedium className="w-4 h-4 text-amber-600" />;
  };

  // Currently active selected preview data (either from DB record or baseline pin)
  const activePreview = useMemo(() => {
    if (selectedRecord) {
      return {
        id: selectedRecord.Record_ID || selectedRecord.recordId,
        speciesCommon: selectedRecord.Species_Name_Common || selectedRecord.speciesCommon || 'Observation',
        speciesScientific: selectedRecord.Species_Name_Scientific || selectedRecord.speciesScientific || '',
        observedCount: selectedRecord.Observed_Count ?? selectedRecord.observedCount ?? 1,
        habitatType: selectedRecord.Habitat_Type || selectedRecord.habitatType || 'Prairie Reserve',
        iucnStatus: selectedRecord.AI_Endangered_Status || selectedRecord.aiEndangeredStatus || 'ENDANGERED',
        riskPercent: selectedRecord.AI_Extinction_Risk_Percentage ?? selectedRecord.aiExtinctionRiskPercentage ?? 50,
        gpsCoords: selectedRecord.gpsCoordinates || selectedRecord.sectorCoord || 'Field Reserve',
        imageUrl: selectedRecord.Image_URL || selectedRecord.imageUrl || '',
        studentGuestId: selectedRecord.Student_Guest_ID || selectedRecord.studentGuestId || 'PBR-RESEARCHER',
        gradeLevel: selectedRecord.Grade_Level || selectedRecord.gradeLevel || 'Secondary Level',
        timestamp: selectedRecord.Timestamp || selectedRecord.timestamp || 'Recorded Today',
        isRecord: true,
        rawRecord: selectedRecord,
      };
    }
    if (selectedBaselinePin) {
      return {
        id: selectedBaselinePin.id,
        speciesCommon: selectedBaselinePin.speciesCommon,
        speciesScientific: selectedBaselinePin.speciesScientific,
        observedCount: selectedBaselinePin.observedCount,
        habitatType: selectedBaselinePin.habitatType,
        iucnStatus: selectedBaselinePin.iucnStatus,
        riskPercent: selectedBaselinePin.riskPercent,
        gpsCoords: selectedBaselinePin.gpsCoords,
        imageUrl: selectedBaselinePin.imageUrl,
        studentGuestId: selectedBaselinePin.studentGuestId,
        gradeLevel: 'Field Baseline',
        timestamp: selectedBaselinePin.timestamp,
        isRecord: false,
        rawRecord: null,
      };
    }
    return null;
  }, [selectedRecord, selectedBaselinePin]);

  return (
    <div className="w-full flex flex-col gap-3.5 pb-20 animate-in fade-in duration-300">
      {/* 1. TOP SNAPCHAT MAP HEADER & LIVE GPS STRIP */}
      <div className="w-full bg-white rounded-2xl p-3.5 border border-slate-200/80 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2.5">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border border-emerald-100 bg-emerald-50 text-emerald-700 shadow-sm">
            <Compass className="w-5 h-5 animate-spin-slow" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping"></span>
              <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-emerald-700">
                Live Snap Biodiversity Map
              </span>
            </div>
            <h1 className="font-sans font-bold text-base text-slate-900 tracking-tight leading-tight">
              Dynamic Field Sighting Heatmap
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-2 self-stretch sm:self-auto justify-between sm:justify-end">
          <div className="px-2.5 py-1 rounded-lg border border-slate-200 bg-slate-50 text-slate-600 text-xs font-mono flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5 text-rose-500 shrink-0" />
            <span className="font-bold text-[11px] truncate max-w-[180px]">{gpsStatusText}</span>
          </div>

          <button
            type="button"
            onClick={handleLocateMe}
            disabled={isLocating}
            className="px-3 py-1.5 rounded-xl border border-emerald-700 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold font-sans flex items-center gap-1.5 cursor-pointer shadow-sm active:scale-95 transition-all"
          >
            <Radio className={`w-3.5 h-3.5 ${isLocating ? 'animate-pulse' : ''}`} />
            <span>{isLocating ? 'Syncing...' : 'Sync GPS'}</span>
          </button>
        </div>
      </div>

      {/* 2. THE INTERACTIVE SNAPCHAT-STYLE LEAFLET MAP CONTAINER */}
      <div className="relative w-full rounded-3xl overflow-hidden border border-slate-200 shadow-sm bg-slate-100">
        {/* Top Floating Snapchat Filter Pills Overlay */}
        <div className="absolute top-3 inset-x-3 z-[1000] flex flex-wrap items-center justify-between gap-1.5 pointer-events-none">
          {/* Sighting Count Pill */}
          <div className="pointer-events-auto bg-white/95 backdrop-blur-md text-slate-800 border border-slate-200/90 px-3 py-1 rounded-full shadow-sm flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span className="font-mono text-[11px] font-bold tracking-wide">
              {filteredSightings.length} Sightings Plotted
            </span>
            {surveyRecords.length > 0 && (
              <span className="bg-emerald-50 text-emerald-700 border border-emerald-100 text-[9px] font-bold px-2 py-0.2 rounded-full">
                {surveyRecords.length} from PBR
              </span>
            )}
          </div>

          {/* Filter Chips */}
          <div className="pointer-events-auto flex items-center gap-1 overflow-x-auto scrollbar-none bg-white/95 backdrop-blur-md p-1 rounded-full border border-slate-200/90 shadow-sm">
            <button
              type="button"
              onClick={() => {
                soundFX.playClick();
                setActiveFilter('ALL');
              }}
              className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold transition-all ${
                activeFilter === 'ALL' ? 'bg-emerald-600 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              ALL
            </button>
            <button
              type="button"
              onClick={() => {
                soundFX.playClick();
                setActiveFilter('CRITICAL');
              }}
              className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold transition-all ${
                activeFilter === 'CRITICAL' ? 'bg-rose-600 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              CRITICAL
            </button>
            <button
              type="button"
              onClick={() => {
                soundFX.playClick();
                setActiveFilter('FLORA');
              }}
              className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold transition-all ${
                activeFilter === 'FLORA' ? 'bg-emerald-600 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              FLORA
            </button>
            <button
              type="button"
              onClick={() => {
                soundFX.playClick();
                setActiveFilter('FAUNA');
              }}
              className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold transition-all ${
                activeFilter === 'FAUNA' ? 'bg-amber-600 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              FAUNA
            </button>
          </div>
        </div>

        {/* Right-Side Floating Snapchat Map Controls Overlay */}
        <div className="absolute right-3 top-16 z-[1000] flex flex-col gap-1.5">
          <button
            type="button"
            onClick={handleZoomIn}
            className="w-9 h-9 rounded-xl bg-white/95 hover:bg-white text-slate-700 border border-slate-200 shadow-md flex items-center justify-center cursor-pointer transition-all active:scale-95"
            title="Zoom In"
          >
            <ZoomIn className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={handleZoomOut}
            className="w-9 h-9 rounded-xl bg-white/95 hover:bg-white text-slate-700 border border-slate-200 shadow-md flex items-center justify-center cursor-pointer transition-all active:scale-95"
            title="Zoom Out"
          >
            <ZoomOut className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={handleLocateMe}
            className="w-9 h-9 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white border border-emerald-500 shadow-md flex items-center justify-center cursor-pointer transition-all active:scale-95"
            title="Recenter on My Location"
          >
            <Crosshair className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={handleResetBounds}
            className="w-9 h-9 rounded-xl bg-white/95 hover:bg-white text-slate-700 border border-slate-200 shadow-md flex items-center justify-center cursor-pointer transition-all active:scale-95"
            title="View All Sightings"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => {
              soundFX.playClick();
              setShowHeatmapGlow(!showHeatmapGlow);
            }}
            className={`w-9 h-9 rounded-xl border shadow-md flex items-center justify-center cursor-pointer transition-all active:scale-95 ${
              showHeatmapGlow ? 'bg-amber-500 text-white border-amber-400' : 'bg-white/95 text-slate-500 border-slate-200'
            }`}
            title="Toggle Snap Heatmap Glow"
          >
            <Flame className="w-4 h-4" />
          </button>
        </div>

        {/* The Actual Leaflet Map Canvas */}
        <div ref={mapContainerRef} className="w-full h-[460px] sm:h-[520px] z-0" />

        {/* 3. SNAP STORY BOTTOM CARD */}
        {activePreview && (
          <div className="absolute bottom-3 inset-x-3 z-[1001] animate-in slide-in-from-bottom-5 duration-300">
            <div className="w-full bg-white/95 backdrop-blur-xl rounded-2xl p-3.5 border border-slate-200/80 shadow-xl text-slate-900">
              <div className="flex items-start justify-between gap-2 pb-2 mb-2 border-b border-slate-100">
                <div className="flex items-center gap-2 min-w-0">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse shrink-0"></span>
                  <div className="min-w-0">
                    <span className="font-mono text-[9px] font-bold uppercase tracking-wider block leading-tight text-emerald-700">
                      {activePreview.isRecord ? 'SAVED PBR OBSERVATION' : 'FIELD HOTSPOT SIGHTING'}
                    </span>
                    <span className="font-mono text-[10px] text-slate-500 truncate block">
                      {activePreview.id} &bull; {activePreview.studentGuestId}
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    soundFX.playClick();
                    setSelectedRecord(null);
                    setSelectedBaselinePin(null);
                  }}
                  className="p-1 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-700 cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="flex items-center gap-3">
                {/* Specimen Photo */}
                <div className="relative w-20 h-20 sm:w-22 sm:h-22 rounded-xl overflow-hidden ring-1 ring-slate-200 shadow-sm shrink-0 bg-slate-100">
                  <img
                    src={activePreview.imageUrl}
                    alt={activePreview.speciesCommon}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/80 to-transparent p-0.5 text-center">
                    <span className="font-mono text-[8px] text-emerald-300 font-bold uppercase">
                      COUNT: {activePreview.observedCount}
                    </span>
                  </div>
                </div>

                {/* Description & Metadata */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <h3 className="font-sans font-bold text-sm sm:text-base leading-tight truncate text-slate-900">
                      {activePreview.speciesCommon}
                    </h3>
                    <span className="font-mono text-[9px] px-2 py-0.2 rounded-full bg-rose-50 text-rose-600 border border-rose-100 font-semibold">
                      {activePreview.iucnStatus}
                    </span>
                  </div>

                  <p className="font-mono text-xs italic text-slate-500 truncate">
                    {activePreview.speciesScientific}
                  </p>

                  <div className="mt-1 flex items-center gap-1 text-[10px] font-mono text-slate-500 truncate">
                    <MapPin className="w-3 h-3 text-emerald-600 shrink-0" />
                    <span className="truncate">{activePreview.habitatType}</span>
                    <span>&bull;</span>
                    <span className="truncate">{activePreview.gpsCoords}</span>
                  </div>

                  {/* Actions Row */}
                  <div className="mt-2.5 flex items-center gap-1.5 flex-wrap">
                    {activePreview.rawRecord && onSelectRecordForSimulation && (
                      <button
                        type="button"
                        onClick={() => {
                          soundFX.playConfirm();
                          onSelectRecordForSimulation(activePreview.rawRecord!);
                          if (onNavigateToTab) onNavigateToTab('predict');
                        }}
                        className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-[10px] shadow-sm flex items-center gap-1 cursor-pointer transition-all active:scale-95"
                      >
                        <Activity className="w-3 h-3" />
                        <span>Simulate PVA</span>
                      </button>
                    )}

                    <button
                      type="button"
                      onClick={() => {
                        soundFX.playConfirm();
                        const matched = catalog.find(
                          (c) =>
                            c.commonName.toLowerCase() === activePreview.speciesCommon.toLowerCase() ||
                            c.scientificName.toLowerCase() === activePreview.speciesScientific.toLowerCase()
                        );
                        if (matched && onSelectSpecies) {
                          onSelectSpecies(matched);
                        }
                        if (onNavigateToTab) onNavigateToTab('biodex');
                      }}
                      className="px-2.5 py-1 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-semibold text-[10px] flex items-center gap-1 cursor-pointer transition-all shadow-sm"
                    >
                      <Eye className="w-3 h-3 text-emerald-600" />
                      <span>View in BioDex</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        soundFX.playConfirm();
                        if (onNavigateToTab) onNavigateToTab('scanner');
                      }}
                      className="px-2.5 py-1 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-semibold text-[10px] flex items-center gap-1 cursor-pointer transition-all shadow-sm"
                    >
                      <Crosshair className="w-3 h-3 text-emerald-600" />
                      <span>Survey Site</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 4. GOOGLE MAPS GROUNDING DISCOVERY FEATURE */}
      <div className="w-full bg-white rounded-2xl p-4 border border-slate-200/80 shadow-sm flex flex-col gap-2.5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 mb-1">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center border border-blue-100 bg-blue-50 text-blue-600 shadow-sm">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <span className="font-mono text-[9px] font-bold uppercase text-blue-600">
                Google Maps Grounding AI
              </span>
              <h3 className="font-sans font-bold text-sm text-slate-900 leading-tight">
                Live Biosphere Discovery
              </h3>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <select
              value={searchRadius}
              onChange={(e) => setSearchRadius(Number(e.target.value))}
              className="px-2.5 py-1.5 rounded-lg text-xs font-mono font-semibold border border-slate-200 bg-slate-50 text-slate-700 focus:outline-none"
            >
              <option value={10}>Radius: 10 km</option>
              <option value={25}>Radius: 25 km</option>
              <option value={50}>Radius: 50 km</option>
            </select>
            <button
              type="button"
              onClick={handleFetchNearbyGoogleMaps}
              disabled={isSearchingMaps}
              className="flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs px-3.5 py-1.5 rounded-xl shadow-sm transition-all disabled:opacity-50 cursor-pointer active:scale-95"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>{isSearchingMaps ? 'Scanning Maps...' : 'Find Nearby Habitats'}</span>
            </button>
          </div>
        </div>

        <p className="text-xs font-mono text-slate-500 mb-1">
          Grounds with live Google Maps data to discover real nature reserves, prairies, wetlands, and bio-sanctuaries surrounding your GPS coordinates.
        </p>

        {mapsGroundingAnalysis && (
          <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50 space-y-3">
            <div className="text-xs leading-relaxed font-sans text-slate-700 whitespace-pre-line">
              {mapsGroundingAnalysis}
            </div>

            {mapsGroundingChunks && mapsGroundingChunks.length > 0 && (
              <div className="pt-2 border-t border-slate-200">
                <span className="text-[10px] font-mono uppercase tracking-wider font-bold block mb-1.5 text-blue-800">
                  Verified Google Maps Locations &amp; Sources:
                </span>
                <div className="flex flex-wrap gap-2">
                  {mapsGroundingChunks.map((chunk, idx) => {
                    const mapsData = chunk.maps;
                    if (!mapsData || !mapsData.uri) return null;
                    return (
                      <a
                        key={idx}
                        href={mapsData.uri}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-mono font-semibold border border-blue-200 bg-blue-50 text-blue-800 hover:bg-blue-100 transition-colors"
                      >
                        <MapPin className="w-3 h-3 text-red-500" />
                        <span>{mapsData.title || `Map Location #${idx + 1}`}</span>
                        <ExternalLink className="w-3 h-3 opacity-70" />
                      </a>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* 5. PRE-MAPPED SANCTUARIES CATALOG */}
      <div className="space-y-3">
        <div className="flex items-center justify-between px-1">
          <span className="font-mono text-[10px] uppercase tracking-wider font-bold text-slate-500">
            PRE-MAPPED SANCTUARIES ({habitats.length})
          </span>
          <span className="text-[10px] font-mono text-slate-400">
            Click any habitat to lock and survey
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {habitats.map((hab) => {
            const isSelected = hab.id === activeHabitat.id;
            return (
              <div
                key={hab.id}
                onClick={() => {
                  soundFX.playScanBeep();
                  onSelectHabitat(hab);
                  if (leafletMapRef.current) {
                    leafletMapRef.current.flyTo([hab.latitude, hab.longitude], 15, { duration: 0.8 });
                  }
                }}
                className={`p-4 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between ${
                  isSelected
                    ? 'bg-white border-emerald-500 ring-2 ring-emerald-500/20 shadow-md scale-[1.01]'
                    : 'bg-white border-slate-200/80 hover:border-slate-300 shadow-sm'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-1.5">
                      {getHabitatIcon(hab.type)}
                      <span className="font-mono text-[10px] font-bold uppercase text-emerald-700">
                        {hab.type.split(' ')[0]}
                      </span>
                    </div>
                    <span className="font-mono text-[10px] px-2 py-0.5 rounded-full border border-slate-200 bg-slate-50 text-slate-600 font-bold">
                      {hab.distanceKm} KM
                    </span>
                  </div>

                  <h4 className="font-sans font-bold text-sm text-slate-900 leading-tight mb-1">
                    {hab.name}
                  </h4>
                  <p className="text-xs font-mono text-slate-500 mb-2.5 line-clamp-2">
                    {hab.description}
                  </p>

                  {/* Key Protected Species */}
                  <div className="mb-3">
                    <span className="text-[9px] uppercase font-mono font-bold block mb-1 text-slate-400">
                      Key Species Monitored:
                    </span>
                    <div className="flex flex-wrap gap-1">
                      {hab.keySpecies.map((sp, i) => (
                        <span
                          key={i}
                          className="text-[9px] px-2 py-0.5 rounded-md border border-slate-200 bg-slate-50 text-slate-700 font-mono"
                        >
                          {sp}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Card Footer Actions */}
                <div className="pt-2.5 border-t border-slate-100 flex items-center justify-between">
                  <div className="flex items-center gap-1 text-[11px] font-mono text-slate-500">
                    <span>Integrity:</span>
                    <strong className="text-emerald-600 font-bold">{hab.integrityScore}%</strong>
                  </div>

                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      soundFX.playConfirm();
                      onGoToHabitatAndScan(hab);
                    }}
                    className="flex items-center gap-1 text-xs font-semibold px-3 py-1 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white transition-colors cursor-pointer shadow-sm"
                  >
                    <span>Survey Site</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
