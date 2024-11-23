import axios from "axios";
import express from "express";
import dotenv from "dotenv";
import { Driver } from "./interfaces/interfaces";
import { readDatabase } from "./db/jsonDatabase";

const app = express();
const PORT = 8080;
const dotenvtest = dotenv.config();
console.log(dotenvtest);
const arrayDrivers = readDatabase();
console.log(arrayDrivers.drivers);

// Middleware para json
app.use(express.json());

// Rota inicial
app.get("/", (req, res) => {
  res.send("API com TS");
});

// Inicialização do servidor
app.listen(PORT, () => {
  console.log(`Server rodando em http://localhost:${PORT}`);
});

app.post("/ride/estimate/", async (req, res) => {
  const originWaypoint = { address: req.body.origin };
  const destinationWaypoint = { address: req.body.destination };
  const request = {
    origin: originWaypoint,
    destination: destinationWaypoint,
    units: "METRIC",
  };
  const axiosConfig = {
    "Content-Type": "application/json",
    "X-Goog-FieldMask": "*",
    "X-Goog-Api-Key": process.env.GOOGLE_API_KEY,
  };

  if (
    req.body.origin != "" ||
    req.body.destination != "" ||
    req.body.customerId != "" ||
    req.body.origin != req.body.destination
  ) {
    try {
      // URL da API externa
      const apiUrl =
        "https://routes.googleapis.com/directions/v2:computeRoutes";

      // Faz a requisição para a API
      const response = await axios.post(apiUrl, request, {
        headers: axiosConfig,
      });

      // Calcula a distancia em km
      const distanceKm = response.data.routes[0].legs[0].distanceMeters / 1000;
      const driverOptions = arrayDrivers.drivers.filter(
        (driver: Driver) => distanceKm >= driver.km_minimo
      );
      const responseComplete = {
        origin: {
          latitude:
            response.data.routes[0].legs[0].startLocation.latLng.latitude,
          longitude:
            response.data.routes[0].legs[0].startLocation.latLng.longitude,
        },
        destination: {
          latitude: response.data.routes[0].legs[0].endLocation.latLng.latitude,
          longitude:
            response.data.routes[0].legs[0].endLocation.latLng.longitude,
        },
        distance: response.data.routes[0].legs[0].distanceMeters,
        duration: response.data.routes[0].legs[0].duration,
        options: driverOptions,
        routeResponse: response.data,
      };
      res.send(responseComplete);
    } catch (error) {
      res.status(400).send({
        error_code: "INVALID_DATA",
        error_description: error,
      });
    }
  }
});
