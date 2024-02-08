// https://react-leaflet.js.org/docs/api-map/
// https://placekit.io/blog/articles/making-react-leaflet-work-with-nextjs-493i

// o
// https://github.com/visgl/react-google-maps

import dynamic from "next/dynamic";
import Head from "next/head";
import Script from "next/script";
import { useEffect, useState } from "react";


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



export default function AddressPicker() {

    const [load_js, setLoad_js] = useState(false);

    useEffect(() => {
        console.log("useEffect");
        setTimeout(() => {
            setLoad_js(true);
        }, 1000);
    }, []);


    return (
        <>
            <style>
                {`@import url('https://unpkg.com/leaflet@1.9.4/dist/leaflet.css');`}
            </style>
            {load_js && (<Script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js" />)}
            <div id="map" className="w-full h-[300px]">
                <MapContainer center={[21.01452894921374, -101.50333037015021]} zoom={17} className="w-full h-full"
                >
                    <TileLayer
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        // detectRetina={true}
                        maxZoom={20}

                    />
                    <Marker position={[21.01452894921374, -101.50333037015021]}>
                        <Popup>
                            A pretty CSS3 popup. <br /> Easily customizable.
                        </Popup>
                    </Marker>
                </MapContainer >
            </div>
        </>

    )
}


