import { db } from "./index";
import { attributes, attrValues } from "./schema";
import { eq } from "drizzle-orm";

async function applyColors() {
  console.log("Updating attributes display type...");
  
  // Update 'Colore' attribute to display as 'color'
  await db.update(attributes)
    .set({ displayType: "color" })
    .where(eq(attributes.slug, "colore"));

  console.log("Setting hex colors for attribute values...");

  // Update 'Nero' to #000000
  await db.update(attrValues)
    .set({ hexColor: "#000000" })
    .where(eq(attrValues.slug, "nero"));

  // Update 'Bianco' to #FFFFFF
  await db.update(attrValues)
    .set({ hexColor: "#FFFFFF" })
    .where(eq(attrValues.slug, "bianco"));

  console.log("Done!");
  process.exit(0);
}

applyColors();
