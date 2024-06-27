import dynamic from "next/dynamic";
import Head from "next/head";
import Script from "next/script";
import { useEffect, useState, useRef } from "react";
import { UseFormSetValue } from "react-hook-form";

// const { MapContainer, Marker, Popup, TileLayer }
const MapContainer = dynamic(
    () => import('react-leaflet').then((m) => m.MapContainer),
    { ssr: false }
);
const Marker = dynamic(
    () => import('react-leaflet').then((m) => m.Marker),
    { ssr: false }
);
const Popup = dynamic(
    () => import('react-leaflet').then((m) => m.Popup),
    { ssr: false }
);
const TileLayer = dynamic(
    () => import('react-leaflet').then((m) => m.TileLayer),
    { ssr: false }
);

type Props = {
    initialCoords: [number, number];
    setValue: UseFormSetValue<any>;
};

export default function AddressPicker({ initialCoords, setValue }: Props) {
    const [load_js, setLoad_js] = useState(false);
    const [markerPosition, setMarkerPosition] = useState<[number, number]>(initialCoords);
    const markerRef = useRef<any>(null);

    useEffect(() => {
        console.log("useEffect");
        setTimeout(() => {
            setLoad_js(true);
        }, 1000);
    }, []);

    useEffect(() => {
        setMarkerPosition(initialCoords);
    }, [initialCoords]);

    const handleDragEnd = () => {
        const marker = markerRef.current;
        if (marker != null) {
            const { lat, lng } = marker.getLatLng();
            setValue("lat", lat);
            setValue("lng", lng);
            setMarkerPosition([lat, lng]);
        }
    };

    return (
        <>
            <style>
                {`@import url('https://unpkg.com/leaflet@1.9.4/dist/leaflet.css');`}
            </style>
            {load_js && (<Script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js" />)}
            <div id="map" className="w-full h-[300px]">
                <MapContainer center={markerPosition} zoom={17} className="w-full h-full">
                    <TileLayer
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        maxZoom={20}
                    />
                    <Marker
                        position={markerPosition}
                        draggable={true}
                        eventHandlers={{
                            dragend: handleDragEnd,
                        }}
                        ref={markerRef}
                    >
                        <Popup>
                            Mueve el marcador para seleccionar la ubicación.
                        </Popup>
                    </Marker>
                </MapContainer >
            </div>
        </>
    );
}
