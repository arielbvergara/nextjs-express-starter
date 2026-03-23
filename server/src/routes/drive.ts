import { Router, IRouter } from "express";
import { listFiles, downloadFile } from "../controllers/drive";

const router: IRouter = Router();

router.get("/files", listFiles);
router.get("/files/:fileId", downloadFile);

export default router;
