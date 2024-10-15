import React, { useEffect, useState } from "react";
import {
  MapContainer,
  TileLayer,
  useMap,
  Marker,
  Popup,
  useMapEvents,
  LayersControl,
  Tooltip,
  LayerGroup,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import axios from "axios";

import * as L from "leaflet";
import useUserStore from "../stores/userStore";




const serviceIcon = L.icon({
  iconUrl:
    "https://www.freeiconspng.com/uploads/simple-car-wheel-tire-rims-side-view-by-qubodup--just-a-wheel-side--15.png",
  iconSize: [25, 25],
});

export default function MainMap() {
  const [position, setPosition] = useState(null);
  const [landmark, setLandmark] = useState([]);
  const token = useUserStore((state) => state.token);

  const user = useUserStore(state => state.user)

  useEffect(() => {
    getDataLandmark();
  }, []);

  const getDataLandmark = async (e) => {
    try {
      const resp = await axios.get("http://localhost:5588/landmark", {
        headers: { Authorization: `Bearer ${token}` },
      });
      // console.log(resp);
      setLandmark(resp.data);
    } catch (err) {
      console.log(err);
    }
  };

  const [form, setForm] = useState({
    title: "",
    detail: "",
    lat: "",
    lng: "",
  });

  const hdlOnchange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const LocationMarker = () => {
    const map = useMapEvents({
      click: (e) => {
        console.log(e.latlng);
        setPosition(e.latlng);
        map.flyTo(e.latlng, 13);
        setForm({ ...form, lat: e.latlng.lat, lng: e.latlng.lng });
      },
    });
    return position == null ? null : <Marker position={position}></Marker>;
  };

  const hdlSubmit = async (e) => {
    console.log(form);
    e.preventDefault();
    try {
      const resp = await axios.post("http://localhost:5588/landmark", form, {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log(resp);
    } catch (err) {
      console.log(err);
    }
  };

  // console.log(token)
  return (
    <>
    {
      user
      ? <div className="flex justify-center mt-20 h-[100px] w-[100vw] ">
      <div className="bg-slate-400  h-[100vh]">
        <form onSubmit={hdlSubmit} className="flex flex-col gap-3 p-4 pt-10">
          <p>Title :</p>
          <textarea
            name="title"
            onChange={hdlOnchange}
            type="title"
            className="textarea textarea-bordered"
            placeholder="Store Name"
          ></textarea>

          <p>Detail :</p>
          <textarea
            name="detail"
            onChange={hdlOnchange}
            type="detail"
            className="textarea textarea-bordered"
            placeholder="Tel & Detail "
          ></textarea>

          <p>Latitude:{position?.lat.toFixed(2)}</p>
          <p>Longitude:{position?.lng.toFixed(2)}</p>
          <button className="btn btn-secondary text-xl text-white">
            Submit
          </button>
        </form>
      </div>

      <MapContainer
        center={[13, 100]}
        zoom={6}
        style={{ height: "100vh", width: "100vw", zIndex: "0" }}
        >
        <LayersControl>
          <LayersControl.BaseLayer name="แผนที่ 1" checked>
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
          </LayersControl.BaseLayer>

          <LayersControl.BaseLayer name="แผนที่ 2">
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://tiles.stadiamaps.com/tiles/alidade_satellite/{z}/{x}/{y}{r}.png"
            />
          </LayersControl.BaseLayer>

          <LayersControl.Overlay name="Landmark" checked>
            <LayerGroup>
              {landmark.map((item, index) => (
                <Marker
                key={index}
                icon={serviceIcon}
                  position={[item.lat, item.lng] }
                  >
                  <Popup>
                    <div className="flex flex-col gap-2">
                    <div className="flex  flex-col border border-black text-xs">
                      <div className="text-blue-300">
                      Title:
                      </div>
                      <div className="text-lg">
                        <div>{item.title}</div>
                      </div>
                    </div>
                    <div className="flex flex-col border border-black text-xs">
                      <div className="text-orange-300">
                      Detail:
                      </div>
                      <div className="text-lg">
                        <div>{item.detail}</div>
                      </div>
                    </div>

                    </div>

                  </Popup>
                  <Tooltip>{item.title}</Tooltip>
                </Marker>
              ))}
            </LayerGroup>
          </LayersControl.Overlay>
        </LayersControl>

        <LocationMarker />
      </MapContainer>
    </div>
      : <div className="flex justify-center mt-20 h-[100px] w-[100vw] ">
              <MapContainer
        center={[13, 100]}
        zoom={6}
        style={{ height: "100vh", width: "100vw", zIndex: "0" }}
        >
        <LayersControl>
          <LayersControl.BaseLayer name="แผนที่ 1" checked>
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
          </LayersControl.BaseLayer>

          <LayersControl.BaseLayer name="แผนที่ 2">
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://tiles.stadiamaps.com/tiles/alidade_satellite/{z}/{x}/{y}{r}.png"
            />
          </LayersControl.BaseLayer>

          <LayersControl.Overlay name="Landmark" checked>
            <LayerGroup>
              {landmark.map((item, index) => (
                <Marker
                key={index}
                icon={serviceIcon}
                  position={[item.lat, item.lng] }
                  >
                  <Popup>
                    <div className="flex flex-col gap-2">
                    <div className="flex  flex-col border border-black text-xs">
                      <div className="text-blue-300">
                      Title:
                      </div>
                      <div className="text-lg">
                        <div>{item.title}</div>
                      </div>
                    </div>
                    <div className="flex flex-col border border-black text-xs">
                      <div className="text-orange-300">
                      Detail:
                      </div>
                      <div className="text-lg">
                        <div>{item.detail}</div>
                      </div>
                    </div>

                    </div>

                  </Popup>
                  <Tooltip>{item.title}</Tooltip>
                </Marker>
              ))}
            </LayerGroup>
          </LayersControl.Overlay>
        </LayersControl>

        <LocationMarker />
      </MapContainer>
      </div>
    }
    
  </>
  );
}








