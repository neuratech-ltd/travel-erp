import { Router } from "express";
import {
  importIurController,
  listIurImportsController,
  getIurImportController,
  scanIurDirectoryController,
  getIurConfigurationController,
  saveIurConfigurationController,
} from "./iur.controller.js";

const router = Router();

// function authenticateIurAgent(
//   req: import("express").Request,
//   res: import("express").Response,
//   next: import("express").NextFunction,
// ) {
//   const expected = process.env.IUR_IMPORT_API_KEY;
//   const authorization = req.header("authorization");

//   if (!expected || authorization !== `Bearer ${expected}`) {
//     return res.status(401).json({
//       message: "Unauthorized IUR agent",
//     });
//   }

//   next();
// }

// For initial testing, protect every IUR route with the
// integration key. Later, use separate agent and user auth.
router.post("/import", importIurController);

router.post("/scan", scanIurDirectoryController);

router.get("/configuration", getIurConfigurationController);

router.put("/configuration", saveIurConfigurationController);

router.get("/imports", listIurImportsController);

router.get("/imports/:id", getIurImportController);

export default router;
