import { seedCategories, seedProducts } from "./src/services/mock/seed";
import * as fs from "fs";
import * as path from "path";

const data = {
  categories: seedCategories,
  products: seedProducts,
};

fs.writeFileSync(
  path.join(process.cwd(), "../shoppersend-backend/src/main/resources/seed.json"),
  JSON.stringify(data, null, 2)
);
console.log("Seed data written to backend resources.");
