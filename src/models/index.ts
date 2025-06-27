export async function getModelLogic(modelId: string) {
  switch (modelId) {
    case "rpr1":
      return await import("./rpr1/model");
    case "rpr0.1m":
      return await import("./rpr0.1m/model");
    case "rprn":
      return await import("./rprn/model");
    default:
      throw new Error("Unknown model");
  }
} 