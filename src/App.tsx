import { useEffect, useState, FormEvent } from "react";
import { getData } from "./api/axios";
import { Data } from "./api/axios";
import markerIcon from "./assets/images/icon-location.svg";
import { APIProvider, Map, Marker } from '@vis.gl/react-google-maps';
import "./App.scss";



function App() {
  const [coordinates, setCoordinates] = useState<{ lat: number, lng: number }>({ lat: 0, lng: 0 });

  const [data, setData] = useState<Data | null>(null);
  const [inputValue, setInputValue] = useState('');
  const [inputType, setInputType] = useState('');


  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    const target = event.target as typeof event.target & {
      input: { value: string };
    };
    const input = target.input.value; // Accessing input value
    const ipPattern = new RegExp(
      '^((25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\\.){3}(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$'
    );
    const domainPattern = new RegExp(
      '^(?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\\.)+[a-z0-9][a-z0-9-]{0,61}[a-z0-9]$'
    );

    if (ipPattern.test(input)) {
      setInputType('ipAddress');
    } else if (domainPattern.test(input)) {
      setInputType('domain');
    } else {
      alert('Please enter a valid IP address or domain');
      return;
    }
    setInputValue(input);
  };
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = (await getData(inputValue, inputType)) as Data;
        setData(response);
        console.log(response)
        setCoordinates({ lat: response.location.lat, lng: response.location.lng })

      } catch (error) {
        if (typeof error === "string") {
          console.log(error)
          alert("Please enter a valid IP address or domain");
        } else {
          console.log("An unexpected error occurred");
          alert("Please enter a valid IP address or domain");

        }
        window.location.reload();
      }
    };

    fetchData();
  }, [inputValue, inputType]);

  return (
    <>
      <div className="container">
        <div className="input-container">
          <h1>IP Address Tracker</h1>


          <form onSubmit={handleSubmit}>
            <input role="input" name="input" placeholder="Search for any IP address or domain" />
            <button type="submit" >
              <svg xmlns="http://www.w3.org/2000/svg" width="11" height="14">
                <path fill="none" stroke="#FFF" strokeWidth="3" d="M2 1l6 6-6 6" />
              </svg>
            </button>
          </form>
        </div>

        <div className="map-container">
          <APIProvider apiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY}>
            <Map center={coordinates} zoom={13} streetViewControl={false}
              mapTypeControl={false}
              zoomControl={false}
              fullscreenControl={false}
              gestureHandling="none"
            >
              <Marker position={coordinates}
                icon={{
                  url: markerIcon,

                }}
              />
            </Map>
          </APIProvider>
        </div>
        <div className="data-display">
          <div>
            <span>IP ADDRESS</span>
            <p>{data?.ip}</p>
          </div>
          <div>
            <span>LOCATION</span>
            <p>{data?.location.region}, {data?.location.city}</p>
          </div>

          <div>
            <span>TIMEZONE</span>
            <p>UTC {data?.location.timezone}</p>
          </div>
          <div>
            <span>ISP</span>
            <p>{data?.as.name}</p>
          </div>
        </div>

      </div>




    </>
  );
}

export default App;
// useEffect(() => {
//   if (navigator.geolocation) {
//     navigator.geolocation.getCurrentPosition(
//       ({ coords: { latitude, longitude } }) => {
//         setCoordinates({ lat: latitude, lng: longitude });
//       },
//       (error) => {
//         // Handle geolocation error
//         switch (error.code) {
//           case error.PERMISSION_DENIED:
//             console.error("User denied Geolocation request.");
//             break;
//           case error.POSITION_UNAVAILABLE:
//             console.error("Location information is unavailable.");
//             break;
//           case error.TIMEOUT:
//             console.error("Geolocation request timed out.");
//             break;
//           default:
//             console.error("Error while fetching Geolocation:", error);
//         }
//         setCoordinates({ lat: 48.858093, lng: 2.294694 });
//       }
//     );
//   } else {
//     setCoordinates({ lat: 48.858093, lng: 2.294694 })
//   }

// }, []);