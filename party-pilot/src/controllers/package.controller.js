import Package from "../models/Package.js";

export const listPackages = async (_req, res) => {
  const pkgs = await Package.find().sort({ createdAt: -1 });
  res.json(pkgs);
};

export const createPackage = async (req, res) => {
  const pkg = await Package.create(req.body);
  res.status(201).json(pkg);
};
