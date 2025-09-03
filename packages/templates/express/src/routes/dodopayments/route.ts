import {Router} from "express";
import checkOutRoutes from "./checkout";
import customerRoutes from "./customer";
import paymentsRoutes from "./payments";
import productsRoutes from "./product";
import subscriptionsRoutes from "./subscriptions";
import webhookRoutes from "./webhook"

const router = Router();


router.use("/checkout", checkOutRoutes);
router.use("/customer", customerRoutes);
router.use("/payments", paymentsRoutes);
router.use("/products", productsRoutes);
router.use("/subscriptions", subscriptionsRoutes);
router.use("/webhook", webhookRoutes);

export default router;