import passport from "passport";
import express from "express";
import { isAuthenticated } from "../middleware/auth";
import {
  analyzeContract,
  detectAndConfirmContractType,
  getContractById,
  getUserContracts,
  uploadMiddleware,
} from "../controllers/contract.controller";
import { handleError } from "../middleware/error";

const router = express.Router();

router.post(
  "/detect-type",
  isAuthenticated,
  uploadMiddleware,
  handleError(detectAndConfirmContractType)
);

router.post(
  "/analyze",
  isAuthenticated,
  uploadMiddleware,
  handleError(analyzeContract)
);

router.get("/user-contracts", isAuthenticated, handleError(getUserContracts));
router.get("/:id",   isAuthenticated, handleError(getContractById));

export default router;
