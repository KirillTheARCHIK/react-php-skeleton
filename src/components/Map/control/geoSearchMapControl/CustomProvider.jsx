import { JsonProvider } from "leaflet-geosearch";
import { URL } from "services/catalogs/monitoring";

class CustomProvider extends JsonProvider {
  constructor(options) {
    super({
      ...options,
    });
  }

  endpoint({ query }) {
    return this.getUrl(`${URL}/search`, { text: query });
  }

  parse({ data }) {
    return data.map((item) => ({
      label: item.name,
      x: +item.lat,
      y: +item.lng,
    }));
  }
}

export default CustomProvider;
