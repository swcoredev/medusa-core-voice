import { Medusa } from "@medusajs/medusa";

const start = async () => {
  const medusa = await Medusa.create();
  await medusa.start();
};

start();
