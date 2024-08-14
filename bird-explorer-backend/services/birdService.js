// services/birdService.js
import axios from "axios";
import Bird from "../models/birdModel.js";
import Papa from "papaparse";

export const fetchAndStoreBirdData = async () => {
  try {
    // Verification de l'existance des données en bdd
    const birdCount = await Bird.count();
    if (birdCount > 0) {
      console.log(
        "Les données existent déjà dans la base de données, pas besoin de fetch !"
      );
      return;
    }
    const response = await axios.get(
      "https://api.ebird.org/v2/ref/taxonomy/ebird",
      {
        headers: {
          "X-eBirdApiToken": process.env.EBIRD_API_KEY,
        },
        responseType: "text",
      }
    );

    const csvData = response.data;

    // console.log(parsedData.data);
    // Un log de birds => la donnée envoyée par l'api n'est pas en json, il faut la parser => papaparse
    // => on s'appreçois que le nom dans le tableau est en majuscule alors que dans la bdd ce n'est pas le cas, on map dessus pour tout bien intégrer

    // Ici on va parsezr la donnée reçue :
    const parsedData = Papa.parse(csvData, {
      header: true, // obtient un tableau
      skipEmptyLines: true,
    });
    // On s'assure de la correspondance des noms de colonnes
    const birds = parsedData.data.map((bird) => ({
      species_code: bird.SPECIES_CODE,
      com_name: bird.COMMON_NAME,
      sci_name: bird.SCIENTIFIC_NAME,
      family_com_name: bird.FAMILY_COM_NAME,
      order: bird.ORDER,
    }));

    // On parcours les espèces d'oiseaux récupérées et on les insère dans la bdd
    for (const bird of birds) {
      // Si on ne reçoit pas ces infos là, on met un warning
      if (!bird.species_code || !bird.com_name || !bird.sci_name) {
        console.warn("Skipping bird with missing data:", bird);
        continue;
      }
      await Bird.findOrCreate({
        where: { species_code: bird.species_code },
        defaults: {
          com_name: bird.com_name,
          sci_name: bird.sci_name,
          family_com_name: bird.family_com_name,
          order: bird.order,
        },
      });
    }

    console.log("Bird data successfully stored");
  } catch (error) {
    console.error("Error fetching bird data:", error);
    throw error;
  }
};
