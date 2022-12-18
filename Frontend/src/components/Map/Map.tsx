import React, { ComponentProps, useState } from 'react';
import ReactMapGL, { Marker } from 'react-map-gl';
import { getCenter } from 'geolib';
import 'mapbox-gl/dist/mapbox-gl.css';

type MapProps = {
  coords?: { latitude: number; longitude: number }[];
} & ComponentProps<typeof ReactMapGL>;

const Map: React.FC<MapProps> = ({ coords, ...props }) => {
  const center = coords && getCenter(coords);

  const [viewport, setViewport] = useState({
    longitude: center ? center.longitude : -6.266155,
    latitude: center ? center.latitude : 53.35014,
    zoom: 10,
  });

  return (
    <ReactMapGL
      mapStyle={'mapbox://styles/dayang1234/clb5nret7000f14p55v2eu0ff'}
      style={{ width: '100%', height: '100%' }}
      mapboxAccessToken={process.env.REACT_APP_MAPBOX_KEY}
      {...viewport}
      onMove={(e) => setViewport(e.viewState)}
      {...props}
    >
      {coords?.map((coord) => {
        const { latitude, longitude } = coord;

        return (
          <Marker
            key={`${latitude} ${longitude}`}
            latitude={latitude}
            longitude={longitude}
            anchor="bottom"
          >
            <p role={'img'} className="block animate-bounce cursor-pointer">
              📌
            </p>
          </Marker>
        );
      })}
    </ReactMapGL>
  );
};

export default Map;
