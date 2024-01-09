import { useEffect, useState } from "react";

import "./App.css";
import { MapContainer, TileLayer, useMap, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { DateTime } from "luxon";
import BarLoader from "react-spinners/BarLoader";

function App() {
  const [IP, setIP] = useState();
  const [country, setCountry] = useState();
  const [countrySwitch, setCountrySwitch] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchIP = async () => {
      const res = await fetch(
        `https://geo.ipify.org/api/v2/country,city?apiKey=${
          import.meta.env.VITE_IP_API_KEY
        }`
      );
      const data = await res.json();
      console.log(data);
      setIP(data);

      setCountrySwitch(true);
    };
    fetchIP();
  }, []);

  useEffect(() => {
    const fetchCountry = async () => {
      const res = await fetch(
        `http://api.countrylayer.com/v2/alpha/${
          IP?.location?.country
        }?access_key=${import.meta.env.VITE_COUNTRYLAYER_API_KEY}`
      );
      const data = await res.json();
      console.log(data);
      setCountry(data);
    };
    if (countrySwitch) {
      fetchCountry();
      setIsLoading(false);
    }
  }, [countrySwitch]);

  // const position = [IP.location.lat, IP.location.lng];
  const dt = DateTime.now();

  return (
    <>
      {isLoading ? (
        <BarLoader
          color={"#FF00FF"}
          size={150}
          aria-label="Loading Spinner"
          data-testid="loader"
        />
      ) : (
        <div className="main-container">
          <div className="bg-light p-5 rounded-lg m-3">
            <div className="container">
              <div className="title">What's My IP?</div>
            </div>
          </div>
          <div className="container" id="main-container">
            <div className="row ">
              <div className="col square border border-3" id="IP-section">
                <h1>IP Address</h1>
                <h3>Your IP address is: {IP?.ip}</h3>
              </div>
              <div className="col square border border-3" id="info-section">
                <h1>Location</h1>
                <h3>
                  You are here: {IP?.location?.postalCode}, {IP?.location?.city}
                  , {IP?.location?.region}, {IP?.location?.country}
                </h3>
                <h3>Your country: {country?.name}</h3>
                <h3>Your continent: {country?.region}</h3>
              </div>

              <div className="row square border border-3" id="time">
                <h3>
                  Current time: {dt.toLocaleString(DateTime.DATETIME_MED)}
                </h3>
              </div>
            </div>
          </div>

          <div id="map">
            <div className="row" id="time">
              <h3>Current location:</h3>
            </div>
            <MapContainer
              style={{ width: "500px", height: "500px" }}
              center={[IP?.location?.lat, IP?.location?.lng]}
              zoom={18}
              scrollWheelZoom={true}
            >
              <TileLayer
                attribution={
                  '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                }
                url={"https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"}
              />
              <Marker position={[IP?.location?.lat, IP?.location?.lng]}>
                <Popup>You are here... almost!</Popup>
              </Marker>
            </MapContainer>
          </div>
        </div>
      )}
    </>
  );
}

export default App;
