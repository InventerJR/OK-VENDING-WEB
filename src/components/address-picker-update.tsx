import dynamic from "next/dynamic";
import Script from "next/script";
import { useEffect, useState, useImperativeHandle, forwardRef } from "react";
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
    setValue: UseFormSetValue<any>;
    initialCoords: [number, number];
};

const AddressPicker = forwardRef(({ setValue, initialCoords }: Props, ref) => {
    const [load_js, setLoad_js] = useState(false);
    const [position, setPosition] = useState<[number, number]>(initialCoords);

    useEffect(() => {
        setTimeout(() => {
            setLoad_js(true);
        }, 1000);
    }, []);

    useEffect(() => {
        setPosition(initialCoords);
    }, [initialCoords]);

    useImperativeHandle(ref, () => ({
        getPosition: () => position
    }));

    const handleDragEnd = (event: any) => {
        const latLng = event.target.getLatLng();
        const { lat, lng } = latLng;
        setPosition([lat, lng]);
        setValue("lat", lat);
        setValue("lng", lng);
    };

    return (
        <>
            <style>
                {`@import url('https://unpkg.com/leaflet@1.9.4/dist/leaflet.css');`}
            </style>
            {load_js && (<Script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js" />)}
            <div id="map" className="w-full h-[300px]">
                <MapContainer center={position} zoom={17} className="w-full h-full">
                    <TileLayer
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        maxZoom={20}
                    />
                    <Marker
                        position={position}
                        draggable={true}
                        eventHandlers={{
                            dragend: handleDragEnd,
                        }}
                    >
                        <Popup>
                            Mueve el marcador para seleccionar la ubicación.
                        </Popup>
                    </Marker>
                </MapContainer>
            </div>
        </>
    );
});

AddressPicker.displayName = "AddressPicker";

export default AddressPicker;
