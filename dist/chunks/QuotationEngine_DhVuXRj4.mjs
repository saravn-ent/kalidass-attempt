import { jsxs, jsx } from 'react/jsx-runtime';
import { useState, useRef, useEffect } from 'react';
import { Car, ArrowRight, Repeat, MapPin, Users, Calendar, Plane, User, Phone, Send } from 'lucide-react';

const rates = {
  "Swift Dzire": 11,
  "Toyota Etios": 12,
  "Innova": 15,
  "Innova Crysta": 18,
  "Tempo Traveller": 21
};
const vehicleOptions = Object.keys(rates);
function QuotationEngine({ showAirportTab = true, showBookingButton = true, title = "Book Your Ride", variant = "default" }) {
  const [activeTab, setActiveTab] = useState("oneway");
  const [airportMode, setAirportMode] = useState("drop");
  const [vehicle, setVehicle] = useState("Swift Dzire");
  const [passengers, setPassengers] = useState("4");
  const [pickup, setPickup] = useState("");
  const [drop, setDrop] = useState("");
  const [distance, setDistance] = useState(null);
  const [duration, setDuration] = useState(null);
  const [estimate, setEstimate] = useState(0);
  const [loading, setLoading] = useState(false);
  const [days, setDays] = useState(1);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [date, setDate] = useState("");
  const [showResult, setShowResult] = useState(false);
  const pickupInputRef = useRef(null);
  const dropInputRef = useRef(null);
  useEffect(() => {
    const pax = parseInt(passengers);
    if (pax <= 4) setVehicle("Swift Dzire");
    else if (pax <= 6) setVehicle("Innova");
    else if (pax <= 7) setVehicle("Innova Crysta");
    else setVehicle("Tempo Traveller");
    setShowResult(false);
  }, [passengers]);
  useEffect(() => {
    const initAutocomplete = () => {
      if (!window.google || !window.google.maps || !window.google.maps.places) return;
      const options = {
        componentRestrictions: { country: "in" },
        fields: ["place_id", "geometry", "name", "formatted_address"]
      };
      if (pickupInputRef.current) {
        const pickupAutocomplete = new window.google.maps.places.Autocomplete(pickupInputRef.current, options);
        pickupAutocomplete.addListener("place_changed", () => {
          const place = pickupAutocomplete.getPlace();
          if (place.formatted_address) {
            setPickup(place.formatted_address);
            calculateDistance(place.formatted_address, drop);
            setShowResult(false);
          }
        });
      }
      if (dropInputRef.current) {
        const dropAutocomplete = new window.google.maps.places.Autocomplete(dropInputRef.current, options);
        dropAutocomplete.addListener("place_changed", () => {
          const place = dropAutocomplete.getPlace();
          if (place.formatted_address) {
            setDrop(place.formatted_address);
            calculateDistance(pickup, place.formatted_address);
            setShowResult(false);
          }
        });
      }
    };
    if (window.google && window.google.maps) {
      initAutocomplete();
    } else {
      window.addEventListener("google-maps-loaded", initAutocomplete);
      return () => window.removeEventListener("google-maps-loaded", initAutocomplete);
    }
  }, [pickup, drop, activeTab, airportMode]);
  const calculateDistance = (origin, destination) => {
    if (!origin || !destination || !window.google) return;
    setLoading(true);
    const service = new window.google.maps.DistanceMatrixService();
    service.getDistanceMatrix(
      {
        origins: [origin],
        destinations: [destination],
        travelMode: window.google.maps.TravelMode.DRIVING
      },
      (response, status) => {
        setLoading(false);
        if (status === "OK" && response.rows[0].elements[0].status === "OK") {
          const distValue = response.rows[0].elements[0].distance.value / 1e3;
          const durText = response.rows[0].elements[0].duration.text;
          setDistance(distValue);
          setDuration(durText);
        } else {
          console.error("Distance calculation failed:", status);
        }
      }
    );
  };
  useEffect(() => {
    if (distance && rates[vehicle]) {
      let rate = rates[vehicle];
      let totalCost = 0;
      if (activeTab === "round") {
        const minKm = days * 250;
        const actualRoundTripKm = distance * 2;
        const chargeableKm = Math.max(minKm, actualRoundTripKm);
        const baseFare = chargeableKm * rate;
        const driverBata = days * 300;
        totalCost = baseFare + driverBata;
      } else {
        totalCost = distance * rate;
      }
      setEstimate(Math.round(totalCost));
    } else {
      setEstimate(0);
    }
  }, [distance, vehicle, activeTab, days]);
  useEffect(() => {
    if (activeTab === "airport") {
      if (airportMode === "drop") {
        setDrop("Chennai International Airport (MAA)");
        if (pickup === "Chennai International Airport (MAA)") setPickup("");
      } else {
        setPickup("Chennai International Airport (MAA)");
        if (drop === "Chennai International Airport (MAA)") setDrop("");
      }
    } else {
      if (drop === "Chennai International Airport (MAA)") setDrop("");
      if (pickup === "Chennai International Airport (MAA)") setPickup("");
    }
  }, [activeTab, airportMode]);
  const handleWhatsApp = async () => {
    const bookingData = {
      date: (/* @__PURE__ */ new Date()).toLocaleString(),
      tripType: activeTab,
      name: name || "Anonymous",
      phone: phone || "Not Provided",
      pickup,
      drop,
      vehicle,
      passengers,
      distance: distance ? distance.toFixed(1) : "",
      estimate,
      travelDate: date
    };
    try {
      await fetch("https://script.google.com/macros/s/AKfycbwoEpKqa3Qg-DIvMe06pGUgGLlC_0vJQev61nzIh9ssh1-uHZ5VtYkGzpMVwhEyi7tvEQ/exec", {
        method: "POST",
        mode: "no-cors",
        headers: {
          "Content-Type": "text/plain"
        },
        body: JSON.stringify(bookingData)
      });
    } catch (e) {
      console.error("Error logging to sheet", e);
    }
    const message = `*New Booking Request*
    
*Customer:* ${name}
*Phone:* ${phone}
*Trip Details:*
🚗 Type: ${activeTab === "airport" ? "Airport Transfer" : activeTab === "round" ? "Round Trip" : "One Way"}
🚙 Vehicle: ${vehicle}
👥 Passengers: ${passengers}
📍 Pickup: ${pickup}
📍 Drop: ${drop}
📅 Date: ${date ? new Date(date).toLocaleString() : "Not Specified"}
📏 Distance: ${distance ? distance.toFixed(1) : "N/A"} km ${activeTab === "round" ? `(Round Trip: ${(distance * 2).toFixed(1)} km)` : ""}
⏱️ Duration: ${duration || "N/A"}
${activeTab === "round" ? `📅 Days: ${days}` : ""}
💰 Est. Cost: ₹${estimate}

_Please confirm availability._`;
    const encodedMessage = encodeURIComponent(message);
    window.open(`https://wa.me/919092303060?text=${encodedMessage}`, "_blank");
  };
  if (variant === "card") {
    return /* @__PURE__ */ jsxs("div", { className: "w-full bg-white rounded-3xl shadow-xl border border-slate-200 overflow-hidden font-sans", children: [
      /* @__PURE__ */ jsx("div", { className: "p-6 pb-2", children: /* @__PURE__ */ jsxs("div", { className: "flex flex-col items-center text-center gap-2 mb-1", children: [
        /* @__PURE__ */ jsx(Car, { className: "w-10 h-10 text-indigo-600" }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("h2", { className: "text-xl font-bold text-slate-900", children: title }),
          /* @__PURE__ */ jsx("p", { className: "text-xs text-slate-500", children: "Get Instant Quote" })
        ] })
      ] }) }),
      /* @__PURE__ */ jsx("div", { className: "px-6 mb-6", children: /* @__PURE__ */ jsxs("div", { className: "bg-slate-100 p-1 rounded-xl flex", children: [
        /* @__PURE__ */ jsxs(
          "button",
          {
            onClick: () => {
              setActiveTab("oneway");
              setShowResult(false);
            },
            className: `flex-1 py-2 text-sm font-semibold rounded-lg transition-all flex items-center justify-center gap-2 ${activeTab === "oneway" ? "bg-white text-indigo-600 shadow-sm" : "text-slate-600 hover:text-slate-900"}`,
            children: [
              /* @__PURE__ */ jsx(ArrowRight, { className: "w-4 h-4" }),
              /* @__PURE__ */ jsx("span", { children: "One Way" })
            ]
          }
        ),
        /* @__PURE__ */ jsxs(
          "button",
          {
            onClick: () => {
              setActiveTab("round");
              setShowResult(false);
            },
            className: `flex-1 py-2 text-sm font-semibold rounded-lg transition-all flex items-center justify-center gap-2 ${activeTab === "round" ? "bg-white text-indigo-600 shadow-sm" : "text-slate-600 hover:text-slate-900"}`,
            children: [
              /* @__PURE__ */ jsx(Repeat, { className: "w-4 h-4" }),
              /* @__PURE__ */ jsx("span", { children: "Round Trip" })
            ]
          }
        )
      ] }) }),
      /* @__PURE__ */ jsxs("div", { className: "px-6 pb-8 space-y-5", children: [
        /* @__PURE__ */ jsxs("div", { className: "space-y-4", children: [
          /* @__PURE__ */ jsxs("div", { className: "relative group", children: [
            /* @__PURE__ */ jsx("label", { className: "block text-[10px] font-bold text-slate-400 uppercase mb-1.5", children: "Pickup Location" }),
            /* @__PURE__ */ jsxs("div", { className: "flex items-center bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus-within:ring-2 focus-within:ring-indigo-500/20 transition-all", children: [
              /* @__PURE__ */ jsx(MapPin, { className: "text-indigo-500 mr-3 w-5 h-5" }),
              /* @__PURE__ */ jsx(
                "input",
                {
                  ref: pickupInputRef,
                  type: "text",
                  value: pickup,
                  onChange: (e) => {
                    setPickup(e.target.value);
                    setShowResult(false);
                  },
                  placeholder: "Enter City / Area",
                  className: "bg-transparent w-full outline-none text-sm text-slate-700 font-medium placeholder:text-slate-400"
                }
              )
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "relative group", children: [
            /* @__PURE__ */ jsx("label", { className: "block text-[10px] font-bold text-slate-400 uppercase mb-1.5", children: "Drop Location" }),
            /* @__PURE__ */ jsxs("div", { className: "flex items-center bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus-within:ring-2 focus-within:ring-indigo-500/20 transition-all", children: [
              /* @__PURE__ */ jsx(MapPin, { className: "text-slate-400 mr-3 w-5 h-5" }),
              /* @__PURE__ */ jsx(
                "input",
                {
                  ref: dropInputRef,
                  type: "text",
                  value: drop,
                  onChange: (e) => {
                    setDrop(e.target.value);
                    setShowResult(false);
                  },
                  placeholder: "Enter Destination",
                  className: "bg-transparent w-full outline-none text-sm text-slate-700 font-medium placeholder:text-slate-400"
                }
              )
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-2 gap-4", children: [
            /* @__PURE__ */ jsxs("div", { className: "relative group", children: [
              /* @__PURE__ */ jsx("label", { className: "block text-[10px] font-bold text-slate-400 uppercase mb-1.5", children: "Passengers" }),
              /* @__PURE__ */ jsxs("div", { className: "flex items-center bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus-within:ring-2 focus-within:ring-indigo-500/20 transition-all", children: [
                /* @__PURE__ */ jsx(Users, { className: "text-indigo-500 mr-3 w-5 h-5" }),
                /* @__PURE__ */ jsxs(
                  "select",
                  {
                    value: passengers,
                    onChange: (e) => {
                      setPassengers(e.target.value);
                      setShowResult(false);
                    },
                    className: "bg-transparent w-full outline-none text-sm text-slate-700 font-medium appearance-none cursor-pointer",
                    children: [
                      /* @__PURE__ */ jsx("option", { value: "4", children: "4+ Driver" }),
                      /* @__PURE__ */ jsx("option", { value: "6", children: "6+ Driver" }),
                      /* @__PURE__ */ jsx("option", { value: "7", children: "7+ Driver" }),
                      /* @__PURE__ */ jsx("option", { value: "12", children: "12+ Driver" })
                    ]
                  }
                )
              ] })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "relative group", children: [
              /* @__PURE__ */ jsx("label", { className: "block text-[10px] font-bold text-slate-400 uppercase mb-1.5", children: "Vehicle" }),
              /* @__PURE__ */ jsxs("div", { className: "flex items-center bg-slate-100 border border-slate-200 rounded-xl px-4 py-3", children: [
                /* @__PURE__ */ jsx(Car, { className: "text-slate-500 mr-3 w-5 h-5" }),
                /* @__PURE__ */ jsx(
                  "select",
                  {
                    value: vehicle,
                    disabled: true,
                    className: "bg-transparent w-full outline-none text-sm text-slate-700 font-medium appearance-none cursor-not-allowed",
                    children: vehicleOptions.map((v) => /* @__PURE__ */ jsx("option", { value: v, children: v }, v))
                  }
                )
              ] })
            ] })
          ] }),
          activeTab === "round" && /* @__PURE__ */ jsxs("div", { className: "relative group", children: [
            /* @__PURE__ */ jsx("label", { className: "block text-[10px] font-bold text-slate-400 uppercase mb-1.5", children: "Days" }),
            /* @__PURE__ */ jsxs("div", { className: "flex items-center bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus-within:ring-2 focus-within:ring-indigo-500/20 transition-all", children: [
              /* @__PURE__ */ jsx(Calendar, { className: "text-indigo-500 mr-3 w-5 h-5" }),
              /* @__PURE__ */ jsx(
                "input",
                {
                  type: "number",
                  min: "1",
                  value: days,
                  onChange: (e) => {
                    setDays(parseInt(e.target.value) || 1);
                    setShowResult(false);
                  },
                  className: "bg-transparent w-full outline-none text-sm text-slate-700 font-medium"
                }
              )
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsx(
          "button",
          {
            className: "w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-4 rounded-xl transition-all flex items-center justify-center shadow-lg hover:shadow-xl active:scale-[0.98]",
            onClick: () => {
              setShowResult(true);
            },
            children: /* @__PURE__ */ jsxs("span", { className: "flex items-center", children: [
              "Calculate Cost ",
              /* @__PURE__ */ jsx(ArrowRight, { className: "w-4 h-4 ml-2" })
            ] })
          }
        ),
        distance && showResult && /* @__PURE__ */ jsxs("div", { className: "flex flex-row justify-between text-xs text-slate-600 bg-slate-50 p-3 rounded-xl border border-slate-100", children: [
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("span", { className: "block text-[10px] text-slate-400 uppercase font-bold", children: "Distance" }),
            /* @__PURE__ */ jsxs("strong", { className: "text-slate-900", children: [
              distance.toFixed(1),
              " km"
            ] })
          ] }),
          activeTab === "round" && /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("span", { className: "block text-[10px] text-slate-400 uppercase font-bold", children: "Round Trip" }),
            /* @__PURE__ */ jsxs("strong", { className: "text-indigo-600", children: [
              (distance * 2).toFixed(1),
              " km"
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "text-right", children: [
            /* @__PURE__ */ jsx("span", { className: "block text-[10px] text-slate-400 uppercase font-bold", children: "Duration" }),
            /* @__PURE__ */ jsx("strong", { className: "text-slate-900", children: duration })
          ] })
        ] }),
        estimate > 0 && showResult && /* @__PURE__ */ jsx("div", { className: "bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl p-4 flex flex-col gap-2 border border-green-100", children: /* @__PURE__ */ jsxs("div", { className: "flex justify-between items-end", children: [
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("p", { className: "text-xs text-green-700 font-bold uppercase", children: "Total Estimate" }),
            /* @__PURE__ */ jsx("div", { className: "flex items-baseline gap-1", children: loading ? /* @__PURE__ */ jsx("span", { className: "text-lg text-slate-400 animate-pulse", children: "..." }) : /* @__PURE__ */ jsxs("p", { className: "text-3xl font-black text-slate-800 leading-none", children: [
              "₹ ",
              estimate > 0 ? estimate.toLocaleString() : "0"
            ] }) }),
            /* @__PURE__ */ jsx("p", { className: "text-[10px] text-slate-500 mt-1", children: "*Excludes Tolls/Parking" })
          ] }),
          estimate > 0 && /* @__PURE__ */ jsxs("div", { className: "text-[10px] text-right text-slate-500", children: [
            /* @__PURE__ */ jsxs("div", { children: [
              "Rate: ₹",
              rates[vehicle],
              "/km"
            ] }),
            activeTab === "round" && /* @__PURE__ */ jsxs("div", { children: [
              "+ Bata: ₹",
              days * 300
            ] })
          ] })
        ] }) })
      ] })
    ] });
  }
  return /* @__PURE__ */ jsxs("div", { className: "bg-white rounded-xl shadow-xl p-0 border-t-4 border-red-600 overflow-hidden", children: [
    /* @__PURE__ */ jsx("h2", { className: "text-lg font-bold text-center text-gray-800 py-2 border-b border-gray-100", children: title }),
    /* @__PURE__ */ jsxs("div", { className: "flex border-b border-gray-100", children: [
      /* @__PURE__ */ jsxs(
        "button",
        {
          onClick: () => setActiveTab("oneway"),
          className: `flex-1 py-2 text-xs text-center font-bold tracking-wide uppercase transition flex items-center justify-center gap-1 ${activeTab === "oneway" ? "text-red-600 border-b-2 border-red-600 bg-red-50" : "text-gray-500 hover:text-red-600"}`,
          children: [
            /* @__PURE__ */ jsx(ArrowRight, { className: "w-3 h-3" }),
            /* @__PURE__ */ jsx("span", { children: "One Way" })
          ]
        }
      ),
      /* @__PURE__ */ jsxs(
        "button",
        {
          onClick: () => setActiveTab("round"),
          className: `flex-1 py-2 text-xs text-center font-bold tracking-wide uppercase transition flex items-center justify-center gap-1 ${activeTab === "round" ? "text-red-600 border-b-2 border-red-600 bg-red-50" : "text-gray-500 hover:text-red-600"}`,
          children: [
            /* @__PURE__ */ jsx(Repeat, { className: "w-3 h-3" }),
            /* @__PURE__ */ jsx("span", { children: "Round Trip" })
          ]
        }
      ),
      showAirportTab && /* @__PURE__ */ jsxs(
        "button",
        {
          onClick: () => setActiveTab("airport"),
          className: `flex-1 py-2 text-xs text-center font-bold tracking-wide uppercase transition flex items-center justify-center gap-1 ${activeTab === "airport" ? "text-red-600 border-b-2 border-red-600 bg-red-50" : "text-gray-500 hover:text-red-600"}`,
          children: [
            /* @__PURE__ */ jsx(Plane, { className: "w-3 h-3" }),
            /* @__PURE__ */ jsx("span", { children: "Airport" })
          ]
        }
      )
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "p-4 space-y-3", children: [
      activeTab === "airport" && /* @__PURE__ */ jsx("div", { className: "flex justify-center mb-2", children: /* @__PURE__ */ jsxs("div", { className: "bg-gray-100 p-1 rounded-lg flex text-[10px] font-bold", children: [
        /* @__PURE__ */ jsx(
          "button",
          {
            onClick: () => setAirportMode("drop"),
            className: `px-4 py-1.5 rounded-md transition-all ${airportMode === "drop" ? "bg-white text-red-600 shadow-sm" : "text-gray-500"}`,
            children: "To Airport"
          }
        ),
        /* @__PURE__ */ jsx(
          "button",
          {
            onClick: () => setAirportMode("pickup"),
            className: `px-4 py-1.5 rounded-md transition-all ${airportMode === "pickup" ? "bg-white text-red-600 shadow-sm" : "text-gray-500"}`,
            children: "From Airport"
          }
        )
      ] }) }),
      /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-2 gap-3", children: [
        /* @__PURE__ */ jsxs("div", { className: "col-span-2 relative group", children: [
          /* @__PURE__ */ jsx("label", { className: "text-[10px] font-bold text-gray-500 uppercase mb-0.5 block", children: "Pickup Location" }),
          /* @__PURE__ */ jsxs("div", { className: "flex items-center bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 focus-within:ring-1 ring-red-500 transition", children: [
            /* @__PURE__ */ jsx(MapPin, { className: "text-red-500 mr-2 w-4 h-4" }),
            /* @__PURE__ */ jsx(
              "input",
              {
                ref: pickupInputRef,
                type: "text",
                value: pickup,
                onChange: (e) => setPickup(e.target.value),
                placeholder: "Enter City / Area",
                className: "bg-transparent w-full outline-none text-sm text-gray-700 font-medium"
              }
            )
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "col-span-2 relative group", children: [
          /* @__PURE__ */ jsx("label", { className: "text-[10px] font-bold text-gray-500 uppercase mb-0.5 block", children: "Drop Location" }),
          /* @__PURE__ */ jsxs("div", { className: "flex items-center bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 focus-within:ring-1 ring-red-500 transition", children: [
            /* @__PURE__ */ jsx(MapPin, { className: "text-gray-400 mr-2 w-4 h-4" }),
            /* @__PURE__ */ jsx(
              "input",
              {
                ref: dropInputRef,
                type: "text",
                value: drop,
                onChange: (e) => setDrop(e.target.value),
                placeholder: "Enter Destination",
                className: "bg-transparent w-full outline-none text-sm text-gray-700 font-medium"
              }
            )
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "col-span-2 relative group", children: [
          /* @__PURE__ */ jsx("label", { className: "text-[10px] font-bold text-gray-500 uppercase mb-0.5 block", children: "Pickup Date" }),
          /* @__PURE__ */ jsxs("div", { className: "flex items-center bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 focus-within:ring-1 ring-red-500 transition", children: [
            /* @__PURE__ */ jsx(Calendar, { className: "text-red-500 mr-2 w-4 h-4" }),
            /* @__PURE__ */ jsx(
              "input",
              {
                type: "datetime-local",
                value: date,
                onChange: (e) => setDate(e.target.value),
                className: "bg-transparent w-full outline-none text-sm text-gray-700 font-medium cursor-pointer"
              }
            )
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "col-span-1 relative group", children: [
          /* @__PURE__ */ jsx("label", { className: "text-[10px] font-bold text-gray-500 uppercase mb-0.5 block", children: "Passengers" }),
          /* @__PURE__ */ jsxs("div", { className: "flex items-center bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 focus-within:ring-1 ring-red-500 transition", children: [
            /* @__PURE__ */ jsx(Users, { className: "text-red-500 mr-2 w-4 h-4" }),
            /* @__PURE__ */ jsxs(
              "select",
              {
                value: passengers,
                onChange: (e) => setPassengers(e.target.value),
                className: "bg-transparent w-full outline-none text-sm text-gray-700 font-medium appearance-none cursor-pointer",
                children: [
                  /* @__PURE__ */ jsx("option", { value: "4", children: "4+ Driver" }),
                  /* @__PURE__ */ jsx("option", { value: "6", children: "6+ Driver" }),
                  /* @__PURE__ */ jsx("option", { value: "7", children: "7+ Driver" }),
                  /* @__PURE__ */ jsx("option", { value: "12", children: "12+ Driver" })
                ]
              }
            )
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "col-span-1 relative group", children: [
          /* @__PURE__ */ jsx("label", { className: "text-[10px] font-bold text-gray-500 uppercase mb-0.5 block", children: "Vehicle (Auto)" }),
          /* @__PURE__ */ jsxs("div", { className: "flex items-center bg-gray-100 border border-gray-200 rounded-lg px-3 py-2", children: [
            /* @__PURE__ */ jsx(Car, { className: "text-gray-500 mr-2 w-4 h-4" }),
            /* @__PURE__ */ jsx(
              "select",
              {
                value: vehicle,
                disabled: true,
                className: "bg-transparent w-full outline-none text-sm text-gray-700 font-medium appearance-none cursor-not-allowed",
                children: vehicleOptions.map((v) => /* @__PURE__ */ jsx("option", { value: v, children: v }, v))
              }
            )
          ] })
        ] }),
        activeTab === "round" && /* @__PURE__ */ jsxs("div", { className: "col-span-1 relative group", children: [
          /* @__PURE__ */ jsx("label", { className: "text-[10px] font-bold text-gray-500 uppercase mb-0.5 block", children: "Days" }),
          /* @__PURE__ */ jsxs("div", { className: "flex items-center bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 focus-within:ring-1 ring-red-500 transition", children: [
            /* @__PURE__ */ jsx(Calendar, { className: "text-red-500 mr-2 w-4 h-4" }),
            /* @__PURE__ */ jsx(
              "input",
              {
                type: "number",
                min: "1",
                value: days,
                onChange: (e) => setDays(parseInt(e.target.value) || 1),
                className: "bg-transparent w-full outline-none text-sm text-gray-700 font-medium"
              }
            )
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "col-span-1 relative group", children: [
          /* @__PURE__ */ jsx("label", { className: "text-[10px] font-bold text-gray-500 uppercase mb-0.5 block", children: "Name" }),
          /* @__PURE__ */ jsxs("div", { className: "flex items-center bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 focus-within:ring-1 ring-red-500 transition", children: [
            /* @__PURE__ */ jsx(User, { className: "text-gray-400 mr-2 w-4 h-4" }),
            /* @__PURE__ */ jsx(
              "input",
              {
                type: "text",
                value: name,
                onChange: (e) => setName(e.target.value),
                placeholder: "Your Name",
                className: "bg-transparent w-full outline-none text-sm text-gray-700 font-medium"
              }
            )
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "col-span-1 relative group", children: [
          /* @__PURE__ */ jsx("label", { className: "text-[10px] font-bold text-gray-500 uppercase mb-0.5 block", children: "Phone" }),
          /* @__PURE__ */ jsxs("div", { className: "flex items-center bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 focus-within:ring-1 ring-red-500 transition", children: [
            /* @__PURE__ */ jsx(Phone, { className: "text-gray-400 mr-2 w-4 h-4" }),
            /* @__PURE__ */ jsx(
              "input",
              {
                type: "tel",
                value: phone,
                onChange: (e) => setPhone(e.target.value),
                placeholder: "Mobile Number",
                className: "bg-transparent w-full outline-none text-sm text-gray-700 font-medium"
              }
            )
          ] })
        ] })
      ] }),
      distance && /* @__PURE__ */ jsxs("div", { className: "flex flex-row justify-between text-xs text-gray-600 bg-gray-50 p-2 rounded border border-gray-100", children: [
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("span", { className: "block text-[10px] text-gray-400 uppercase", children: "Distance" }),
          /* @__PURE__ */ jsxs("strong", { children: [
            distance.toFixed(1),
            " km"
          ] })
        ] }),
        activeTab === "round" && /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("span", { className: "block text-[10px] text-gray-400 uppercase", children: "Round Trip" }),
          /* @__PURE__ */ jsxs("strong", { className: "text-red-600", children: [
            (distance * 2).toFixed(1),
            " km"
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "text-right", children: [
          /* @__PURE__ */ jsx("span", { className: "block text-[10px] text-gray-400 uppercase", children: "Duration" }),
          /* @__PURE__ */ jsx("strong", { children: duration })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg p-3 flex flex-col gap-2 border border-green-100", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex justify-between items-end", children: [
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("p", { className: "text-xs text-green-700 font-bold uppercase", children: "Total Estimate" }),
            /* @__PURE__ */ jsx("div", { className: "flex items-baseline gap-1", children: loading ? /* @__PURE__ */ jsx("span", { className: "text-lg text-gray-400 animate-pulse", children: "..." }) : /* @__PURE__ */ jsxs("p", { className: "text-2xl font-black text-gray-800 leading-none", children: [
              "₹ ",
              estimate > 0 ? estimate.toLocaleString() : "0"
            ] }) }),
            /* @__PURE__ */ jsx("p", { className: "text-[10px] text-gray-500 mt-0.5", children: "*Excludes Tolls/Parking" })
          ] }),
          estimate > 0 && /* @__PURE__ */ jsxs("div", { className: "text-[10px] text-right text-gray-500", children: [
            /* @__PURE__ */ jsxs("div", { children: [
              "Rate: ₹",
              rates[vehicle],
              "/km"
            ] }),
            activeTab === "round" && /* @__PURE__ */ jsxs("div", { children: [
              "+ Bata: ₹",
              days * 300
            ] })
          ] })
        ] }),
        showBookingButton && /* @__PURE__ */ jsxs(
          "button",
          {
            onClick: handleWhatsApp,
            disabled: estimate === 0,
            className: `w-full py-2.5 rounded-lg font-bold text-sm flex items-center justify-center gap-2 transition-transform shadow-sm ${estimate > 0 ? "bg-[#25D366] hover:bg-[#20bd5a] text-white active:scale-95" : "bg-gray-300 text-gray-500 cursor-not-allowed"}`,
            children: [
              /* @__PURE__ */ jsx(Send, { className: "w-4 h-4" }),
              "Book on WhatsApp"
            ]
          }
        )
      ] })
    ] })
  ] });
}

export { QuotationEngine as Q };
