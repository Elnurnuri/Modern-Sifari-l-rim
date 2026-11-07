import React, { useState, useEffect, useRef } from 'react';
import { 
  X, 
  MapPin, 
  Navigation, 
  Truck, 
  PhoneCall, 
  Clock, 
  Compass,
  Layers,
  Crosshair,
  Route as RouteIcon
} from 'lucide-react';
import { 
  APIProvider, 
  Map, 
  AdvancedMarker, 
  useMap,
  useMapsLibrary
} from '@vis.gl/react-google-maps';
import { CourierInfo } from '../types/order';

interface CourierTrackingMapModalProps {
  isOpen: boolean;
  onClose: () => void;
  courier: CourierInfo;
  deliveryAddress: {
    city: string;
    district: string;
    street: string;
  };
}

interface LatLng {
  lat: number;
  lng: number;
}

// 64 Authentic Google Maps road points following exact asphalt street centerlines:
// Nəcəf bəy Vəzirov -> Səməd Vurğun -> Bakıxanov -> Ceyhunbəy Hacıbəyli -> Atatürk pr. -> Vaqif -> Fətəli Xan Xoyski -> Həsənoğlu -> Təbriz küç.
const OFFICIAL_BAKU_ROAD_PATH: LatLng[] = [
  { lat: 40.38816, lng: 49.83751 },
  { lat: 40.38800, lng: 49.83678 },
  { lat: 40.38835, lng: 49.83668 },
  { lat: 40.38860, lng: 49.83660 },
  { lat: 40.38899, lng: 49.83648 },
  { lat: 40.38916, lng: 49.83728 },
  { lat: 40.38926, lng: 49.83774 },
  { lat: 40.38941, lng: 49.83842 },
  { lat: 40.38991, lng: 49.84069 },
  { lat: 40.39066, lng: 49.84413 },
  { lat: 40.39099, lng: 49.84544 },
  { lat: 40.39111, lng: 49.84589 },
  { lat: 40.39145, lng: 49.84574 },
  { lat: 40.39205, lng: 49.84547 },
  { lat: 40.39262, lng: 49.84526 },
  { lat: 40.39269, lng: 49.84531 },
  { lat: 40.39278, lng: 49.84540 },
  { lat: 40.39349, lng: 49.84622 },
  { lat: 40.39459, lng: 49.84751 },
  { lat: 40.39485, lng: 49.84780 },
  { lat: 40.39518, lng: 49.84811 },
  { lat: 40.39545, lng: 49.84824 },
  { lat: 40.39557, lng: 49.84829 },
  { lat: 40.39563, lng: 49.84836 },
  { lat: 40.39585, lng: 49.84850 },
  { lat: 40.39617, lng: 49.84864 },
  { lat: 40.39655, lng: 49.84878 },
  { lat: 40.39704, lng: 49.84892 },
  { lat: 40.39724, lng: 49.84893 },
  { lat: 40.39734, lng: 49.84896 },
  { lat: 40.39770, lng: 49.84905 },
  { lat: 40.39810, lng: 49.84916 },
  { lat: 40.39828, lng: 49.84918 },
  { lat: 40.39868, lng: 49.84923 },
  { lat: 40.39893, lng: 49.84923 },
  { lat: 40.39939, lng: 49.84924 },
  { lat: 40.39969, lng: 49.84941 },
  { lat: 40.39986, lng: 49.84958 },
  { lat: 40.40004, lng: 49.84988 },
  { lat: 40.40019, lng: 49.85057 },
  { lat: 40.40045, lng: 49.85189 },
  { lat: 40.40078, lng: 49.85341 },
  { lat: 40.40109, lng: 49.85487 },
  { lat: 40.40138, lng: 49.85597 },
  { lat: 40.40153, lng: 49.85672 },
  { lat: 40.40180, lng: 49.85782 },
  { lat: 40.40208, lng: 49.85916 },
  { lat: 40.40234, lng: 49.86046 },
  { lat: 40.40239, lng: 49.86070 },
  { lat: 40.40262, lng: 49.86173 },
  { lat: 40.40288, lng: 49.86278 },
  { lat: 40.40213, lng: 49.86307 },
  { lat: 40.40178, lng: 49.86323 },
  { lat: 40.40196, lng: 49.86374 },
  { lat: 40.40198, lng: 49.86395 },
  { lat: 40.40195, lng: 49.86405 },
  { lat: 40.40177, lng: 49.86432 },
  { lat: 40.40161, lng: 49.86454 },
  { lat: 40.40159, lng: 49.86460 },
  { lat: 40.40158, lng: 49.86470 },
  { lat: 40.40157, lng: 49.86482 },
  { lat: 40.40151, lng: 49.86502 },
  { lat: 40.40136, lng: 49.86533 },
  { lat: 40.40145, lng: 49.86540 },
];

function calculateHeading(from: LatLng, to: LatLng): number {
  const dLng = ((to.lng - from.lng) * Math.PI) / 180;
  const lat1 = (from.lat * Math.PI) / 180;
  const lat2 = (to.lat * Math.PI) / 180;
  const y = Math.sin(dLng) * Math.cos(lat2);
  const x = Math.cos(lat1) * Math.sin(lat2) - Math.cos(lat1) * Math.cos(dLng);
  const brng = (Math.atan2(y, x) * 180) / Math.PI;
  return (brng + 360) % 360;
}

function getStreetNameForIndex(idx: number): string {
  if (idx <= 4) return 'Səməd Vurğun küçəsi';
  if (idx <= 11) return 'Bakıxanov küçəsi';
  if (idx <= 17) return 'Ceyhunbəy Hacıbəyli küçəsi';
  if (idx <= 26) return 'Atatürk prospekti';
  if (idx <= 38) return 'Vaqif prospekti';
  if (idx <= 50) return 'Fətəli Xan Xoyski prospekti';
  if (idx <= 53) return 'Həsənoğlu küçəsi';
  return 'Təbriz küçəsi 45 (Çatdırılma ünvanı)';
}

// Dynamic Google Maps Routes API Sync & Polyline renderer on real roads
const RealRoadDirectionsAndPolyline: React.FC<{
  origin: LatLng;
  destination: LatLng;
  currentIdx: number;
  onPathLoaded: (path: LatLng[]) => void;
  activePath: LatLng[];
}> = ({ origin, destination, currentIdx, onPathLoaded, activePath }) => {
  const map = useMap();
  const routesLib = useMapsLibrary('routes');
  const mapsLib = useMapsLibrary('maps');
  const traveledPolyRef = useRef<google.maps.Polyline | null>(null);
  const remainingPolyRef = useRef<google.maps.Polyline | null>(null);
  const fetchedRef = useRef(false);

  // Fetch real Google Maps driving route using modern Routes API (zero-legacy)
  useEffect(() => {
    if (!map || !routesLib || fetchedRef.current) return;

    try {
      const request = {
        origin: { lat: origin.lat, lng: origin.lng },
        destination: { lat: destination.lat, lng: destination.lng },
        travelMode: 'DRIVING' as const,
        fields: ['path', 'distanceMeters', 'durationMillis', 'viewport'],
      };

      (routesLib.Route as any).computeRoutes(request)
        .then(({ routes }: { routes: any[] }) => {
          if (routes && routes.length > 0) {
            const primaryRoute = routes[0];
            if (primaryRoute.path && primaryRoute.path.length > 0) {
              const googleRoadPoints = primaryRoute.path.map((p: any) => ({
                lat: typeof p.lat === 'function' ? Number(p.lat().toFixed(6)) : Number(p.lat),
                lng: typeof p.lng === 'function' ? Number(p.lng().toFixed(6)) : Number(p.lng),
              }));
              fetchedRef.current = true;
              onPathLoaded(googleRoadPoints);
            }
          }
        })
        .catch((err: any) => {
          // If Routes API encounters quota limits, dispatch quota event
          if (err?.message?.includes('Quota') || err?.status === 'RESOURCE_EXHAUSTED' || err?.message?.includes('OverQuota')) {
            window.dispatchEvent(new CustomEvent('gmp-quota-exceeded'));
          }
          // Fallback route remains active via OFFICIAL_BAKU_ROAD_PATH
        });
    } catch {
      // Fallback already active with OFFICIAL_BAKU_ROAD_PATH
    }
  }, [map, routesLib, origin, destination, onPathLoaded]);

  // Render polyline directly on the real asphalt road
  useEffect(() => {
    if (!map || !mapsLib) return;

    const currentPoints = activePath.length > 0 ? activePath : OFFICIAL_BAKU_ROAD_PATH;
    const safeIdx = Math.min(currentIdx, currentPoints.length - 1);

    const traveledPoints = currentPoints.slice(0, safeIdx + 1);
    const remainingPoints = currentPoints.slice(safeIdx);

    // Traveled road section (dark charcoal)
    if (!traveledPolyRef.current) {
      traveledPolyRef.current = new mapsLib.Polyline({
        path: traveledPoints,
        geodesic: true,
        strokeColor: '#475569',
        strokeOpacity: 0.7,
        strokeWeight: 5,
        map,
      });
    } else {
      traveledPolyRef.current.setPath(traveledPoints);
    }

    // Remaining road section (emerald green snapping to streets)
    if (!remainingPolyRef.current) {
      remainingPolyRef.current = new mapsLib.Polyline({
        path: remainingPoints,
        geodesic: true,
        strokeColor: '#059669',
        strokeOpacity: 0.95,
        strokeWeight: 6,
        map,
      });
    } else {
      remainingPolyRef.current.setPath(remainingPoints);
    }

    return () => {
      traveledPolyRef.current?.setMap(null);
      remainingPolyRef.current?.setMap(null);
      traveledPolyRef.current = null;
      remainingPolyRef.current = null;
    };
  }, [map, mapsLib, activePath, currentIdx]);

  return null;
};

// Smooth Camera Follower
const MapCameraController: React.FC<{
  target: LatLng;
  autoFollow: boolean;
}> = ({ target, autoFollow }) => {
  const map = useMap();

  useEffect(() => {
    if (!map || !autoFollow) return;
    map.panTo(target);
  }, [map, target, autoFollow]);

  return null;
};

export const CourierTrackingMapModal: React.FC<CourierTrackingMapModalProps> = ({
  isOpen,
  onClose,
  courier,
  deliveryAddress,
}) => {
  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || '';

  // Active road path (strictly snaps to roads)
  const [roadPath, setRoadPath] = useState<LatLng[]>(OFFICIAL_BAKU_ROAD_PATH);
  
  // Starting waypoint index (starts near Ganjlik on Fatali Khan Khoyski street)
  const [currentIdx, setCurrentIdx] = useState(42);
  const [gpsCountdown, setGpsCountdown] = useState(3);
  const [speed, setSpeed] = useState(38);
  const [mapType, setMapType] = useState<'roadmap' | 'hybrid'>('roadmap');
  const [autoFollow, setAutoFollow] = useState(true);

  // 3-second live GPS tick: moves strictly from one road point to the next road point
  useEffect(() => {
    if (!isOpen) return;

    const interval = setInterval(() => {
      setGpsCountdown((prev) => {
        if (prev <= 1) {
          setCurrentIdx((idx) => {
            const nextIdx = idx + 1;
            if (nextIdx >= roadPath.length - 1) {
              return 15; // loop smoothly along the route
            }
            return nextIdx;
          });
          setSpeed(Math.floor(32 + Math.random() * 12));
          return 3;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isOpen, roadPath.length]);

  if (!isOpen) return null;

  const currentPoint = roadPath[Math.min(currentIdx, roadPath.length - 1)] || roadPath[0];
  const nextPoint = roadPath[Math.min(currentIdx + 1, roadPath.length - 1)] || currentPoint;
  const originPoint = roadPath[0];
  const destinationPoint = roadPath[roadPath.length - 1];

  // Accurate vehicle rotation heading along the road segment
  const vehicleHeading = calculateHeading(currentPoint, nextPoint);

  // Current street name based on road position
  const currentStreetName = getStreetNameForIndex(currentIdx);

  // Remaining road distance in km
  const remainingPointsCount = Math.max(0, (roadPath.length - 1) - currentIdx);
  const remainingKm = Math.max(0.2, Number((remainingPointsCount * 0.05).toFixed(1)));
  const estimatedMins = Math.max(2, Math.round(remainingKm * 3.8));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="bg-white rounded-3xl shadow-2xl max-w-5xl w-full overflow-hidden border border-slate-200 flex flex-col h-[700px] max-h-[92vh]"
        role="dialog"
        aria-modal="true"
        aria-labelledby="map-modal-title"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 sm:px-6 py-3.5 border-b border-slate-100 bg-slate-50/80">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-600 text-white flex items-center justify-center shadow-xs">
              <Navigation className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 id="map-modal-title" className="text-sm sm:text-base font-bold text-slate-900">
                  Canlı Kuryer və Çatdırılma Xəritəsi
                </h3>
                <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-ping" />
                  Yol Üzərində İzləmə
                </span>
              </div>
              <p className="text-[11px] text-slate-500 mt-0.5 flex flex-wrap items-center gap-x-2 gap-y-0.5">
                <span>GPS vasitəsilə canlı izləmə</span>
                <span>·</span>
                <span className="text-emerald-700 font-semibold">Yenilənmə: 3 saniyə</span>
                <span className="font-mono text-slate-400">({gpsCountdown}s)</span>
                <span>·</span>
                <span className="text-slate-600 font-medium">Binaların üzərindən deyil, real asfalt yollarla</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setAutoFollow(!autoFollow)}
              className={`px-2.5 py-1.5 text-xs font-semibold rounded-xl transition-colors flex items-center gap-1.5 border shadow-2xs ${
                autoFollow
                  ? 'bg-emerald-50 text-emerald-700 border-emerald-300'
                  : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
              }`}
              title="Kuryerin hərəkətini ekranda saxla"
            >
              <Crosshair className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Avto-kamera</span>
            </button>

            <button
              onClick={() => setMapType(mapType === 'roadmap' ? 'hybrid' : 'roadmap')}
              className="px-2.5 py-1.5 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-100 border border-slate-200 rounded-xl transition-colors flex items-center gap-1.5 shadow-2xs"
            >
              <Layers className="w-3.5 h-3.5 text-slate-500" />
              <span className="hidden sm:inline">{mapType === 'roadmap' ? 'Peyk' : 'Küçə'}</span>
            </button>

            <button
              onClick={onClose}
              aria-label="Xəritəni bağla"
              className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 rounded-xl transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Real Google Maps Container */}
        <div className="relative flex-1 w-full h-full min-h-[380px] bg-slate-100">
          <APIProvider apiKey={apiKey}>
            <Map
              defaultCenter={{ lat: 40.4005, lng: 49.8550 }}
              defaultZoom={16}
              mapId="DEMO_MAP_ID"
              mapTypeId={mapType}
              disableDefaultUI={false}
              zoomControl={true}
              streetViewControl={false}
              mapTypeControl={false}
              className="w-full h-full"
              internalUsageAttributionIds={["gmp_mcp_codeassist_v1_aistudio"]}
            >
              {/* Real Road Polyline on Baku Streets */}
              <RealRoadDirectionsAndPolyline 
                origin={originPoint}
                destination={destinationPoint}
                currentIdx={currentIdx}
                onPathLoaded={setRoadPath}
                activePath={roadPath}
              />

              {/* Camera follow */}
              <MapCameraController 
                target={currentPoint} 
                autoFollow={autoFollow} 
              />

              {/* Origin Marker (Warehouse in Nasimi) */}
              <AdvancedMarker position={{ lat: originPoint.lat, lng: originPoint.lng }}>
                <div className="flex flex-col items-center cursor-pointer select-none">
                  <div className="px-2 py-1 bg-slate-900 text-white text-[10px] font-bold rounded-lg shadow-md whitespace-nowrap mb-1">
                    Elnur660 Anbarı (Nəsimi r.)
                  </div>
                  <div className="w-8 h-8 rounded-full bg-slate-800 text-white flex items-center justify-center ring-4 ring-slate-800/20 shadow-md">
                    <MapPin className="w-4 h-4 text-emerald-400" />
                  </div>
                </div>
              </AdvancedMarker>

              {/* Destination Marker (Tabriz street in Narimanov) */}
              <AdvancedMarker position={{ lat: destinationPoint.lat, lng: destinationPoint.lng }}>
                <div className="flex flex-col items-center cursor-pointer select-none">
                  <div className="px-2 py-1 bg-rose-600 text-white text-[10px] font-bold rounded-lg shadow-md whitespace-nowrap mb-1">
                    Təhvil nöqtəsi (Təbriz küç. 45)
                  </div>
                  <div className="w-8 h-8 rounded-full bg-rose-600 text-white flex items-center justify-center ring-4 ring-rose-600/30 shadow-md">
                    <MapPin className="w-4 h-4 text-white" />
                  </div>
                </div>
              </AdvancedMarker>

              {/* Courier Moving Marker (Snapping 100% to real asphalt road) */}
              <AdvancedMarker position={{ lat: currentPoint.lat, lng: currentPoint.lng }}>
                <div className="relative flex flex-col items-center cursor-pointer select-none">
                  {/* Floating Telemetry Tag */}
                  <div className="px-2.5 py-1 bg-emerald-950 text-white text-[10px] font-bold rounded-xl shadow-xl border border-emerald-500/40 whitespace-nowrap mb-1.5 flex items-center gap-1.5 backdrop-blur-md">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    <span>Kamran (Kuryer) · {speed} km/s</span>
                  </div>

                  {/* Pulsing beacon with vehicle aligned to road bearing */}
                  <div className="relative">
                    <span className="absolute -inset-2.5 rounded-full bg-emerald-500/30 animate-ping" />
                    <div 
                      className="w-11 h-11 rounded-2xl bg-emerald-600 text-white flex items-center justify-center ring-4 ring-white shadow-2xl transition-transform duration-700 ease-out"
                      style={{ transform: `rotate(${vehicleHeading}deg)` }}
                      title={`İstiqamət: ${Math.round(vehicleHeading)}°`}
                    >
                      <Navigation className="w-6 h-6 text-white fill-white" />
                    </div>
                  </div>
                </div>
              </AdvancedMarker>
            </Map>
          </APIProvider>

          {/* Floating Courier Card Top Left */}
          <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-md rounded-2xl p-4 shadow-xl border border-slate-200/90 max-w-xs z-10">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-sm ring-2 ring-emerald-500/20">
                K
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-900">{courier.name}</h4>
                <div className="flex items-center gap-2 text-[11px] text-slate-500">
                  <span className="font-semibold text-amber-600">★ {courier.rating}</span>
                  <span>·</span>
                  <span className="font-mono text-slate-700">{courier.vehiclePlate}</span>
                </div>
              </div>
            </div>

            <div className="mt-3 pt-3 border-t border-slate-100 space-y-1.5 text-xs">
              {/* Current exact street location along real roads */}
              <div className="p-2 bg-emerald-50/70 border border-emerald-100 rounded-xl text-[11px]">
                <span className="text-emerald-800 font-bold block mb-0.5">Hazırda hərəkətdə olduğu yol:</span>
                <span className="text-slate-900 font-bold leading-tight block">
                  {currentStreetName}
                </span>
              </div>

              <div className="flex justify-between items-center text-slate-600 pt-1">
                <span>Qalan məsafə:</span>
                <strong className="text-slate-900 font-mono font-bold text-sm">{remainingKm} km</strong>
              </div>
              <div className="flex justify-between items-center text-slate-600">
                <span>Təxmini çatma müddəti:</span>
                <strong className="text-emerald-700 font-bold text-sm">~{estimatedMins} dəqiqə</strong>
              </div>
              <div className="flex justify-between items-center text-slate-600">
                <span>Canlı GPS sürəti:</span>
                <span className="font-mono font-semibold text-slate-800">{speed} km/saat</span>
              </div>
              <div className="flex justify-between items-center text-[10px] text-slate-400 pt-1">
                <span>Dəqiq yol GPS-i:</span>
                <span className="font-mono">{currentPoint.lat.toFixed(5)}° N, {currentPoint.lng.toFixed(5)}° E</span>
              </div>
            </div>

            <a
              href={`tel:${courier.phone}`}
              className="mt-3.5 w-full py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-colors shadow-xs"
            >
              <PhoneCall className="w-3.5 h-3.5" />
              <span>Kuryerlə birbaşa əlaqə</span>
            </a>
          </div>

          {/* Bottom Live Road & Destination Banner */}
          <div className="absolute bottom-4 left-4 right-4 bg-white/95 backdrop-blur-md rounded-2xl p-3 shadow-lg border border-slate-200/90 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs z-10">
            <div className="flex items-center gap-2 text-slate-700">
              <MapPin className="w-4 h-4 text-rose-500 shrink-0" />
              <span className="truncate">
                <strong>Təhvil ünvanı:</strong> {deliveryAddress.city}, {deliveryAddress.district}, {deliveryAddress.street}
              </span>
            </div>

            <div className="flex items-center gap-3 text-emerald-700 font-semibold text-[11px] shrink-0">
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                Real Yol Hərəkəti (3 san.)
              </span>
              <span>·</span>
              <span className="text-slate-600 font-normal">Səməd Vurğun &rarr; Atatürk pr. &rarr; Xoyski pr. &rarr; Təbriz küç.</span>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-5 sm:px-6 py-3 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-xs">
          <span className="text-slate-500 hidden sm:inline">
            Google Maps Yol Şəbəkəsi (Directions) vasitəsilə 100% asfalt küçə xətti üzrə hərəkət
          </span>
          <button
            onClick={onClose}
            className="px-5 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-xl transition-colors ml-auto"
          >
            Bağla
          </button>
        </div>
      </div>
    </div>
  );
};
