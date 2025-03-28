import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { Container } from "inversify";
import IUserService from "./interface/userServiceInterface";
import UserService from "./services/userServices";
import UserController from "./controllers/userController";
import { userRoute } from "./routes/userRoutes";
import sequelize from "./database/dbConfig";
import { Request, Response } from "express";
import { IBookService } from "./interface/bookServiceInterface";
import BookService from "./services/bookService";
import BookController from "./controllers/bookController";
import { BookRoute } from "./routes/bookRoutes";
import { IReviewService } from "./interface/reviewServiceInterface";
import ReviewService from "./services/reviewServices";
import ReviewController from "./controllers/reviewController";
import { ReviewRoute } from "./routes/reviewRoute";
import { IOrderServices } from "./interface/orderServices";
import orderServices from "./services/orderServices";
import OrderController from "./controllers/orderController";
import OrderRoute from "./routes/orderRoute";
import PaymentServices from "./services/paymentServices";
import PaymentController from "./controllers/paymnetController";
import PaymentRoute from "./routes/paymentRoute";
import { IPaymentService } from "./interface/paymentServiceInterface";
import WebhookController from "./controllers/webhookController";
import WebhookRoute from "./routes/webhookRoutes";
// import { logger } from "./common/loggerInstance";
import { Logger } from "./common/logger";

dotenv.config();
const PORT = process.env.PORT;
const container = new Container();

const logger = new Logger();
const app = express();
app.use(express.json());

app.use(
  cors({
    exposedHeaders: ["X-Message-ID"],
  })
);

//login and registeration
container.bind<IUserService>("IUserService").to(UserService);
const userService = container.get<IUserService>("IUserService");
const userController = new UserController(userService);
const userRouteInstance = new userRoute(userController);

app.get("/", (req: Request, res: Response) => {
  res.send("API is running");
});
app.use("/user", userRouteInstance.getRouter());
app.use("/admin", userRouteInstance.getRouter());

//BookService

container.bind<IBookService>("IBookService").to(BookService);
const bookService = container.get<IBookService>("IBookService");
const bookController = new BookController(bookService);
const bookRouterInstance = new BookRoute(bookController);

app.use("/user", bookRouterInstance.getRouter());
app.use("/admin", bookRouterInstance.getRouter());

container.bind<IReviewService>("IReviewService").to(ReviewService);
const reviewService = container.get<IReviewService>("IReviewService");
const reviewController = new ReviewController(reviewService);
const reviewRouterInstance = new ReviewRoute(reviewController);

app.use("/user", reviewRouterInstance.getRouter());
app.use("/admin", reviewRouterInstance.getRouter());

container.bind<IOrderServices>("IOrderServices").to(orderServices);
const orderService = container.get<IOrderServices>("IOrderServices");
const orderController = new OrderController(orderService);
const orderRouterInstance = new OrderRoute(orderController);

app.use("/user", orderRouterInstance.getRouter());

container.bind<IPaymentService>("IPaymentServices").to(PaymentServices);
const paymentService = container.get<IPaymentService>("IPaymentServices");
const paymentController = new PaymentController(paymentService);
const paymentRouterInstance = new PaymentRoute(paymentController);
app.use("/user", paymentRouterInstance.getRouter());

//webhook
const webhookController = new WebhookController();
const webhookRouter = new WebhookRoute(webhookController);
app.use("/api", webhookRouter.getRouter());

sequelize
  .authenticate()
  .then(() => {
    console.log("Database connected");
  })
  .catch(() => {
    console.log("Error in connecting to database");
  });

sequelize
  .sync({ alter: true })
  .then(() => {
    console.log("Database synced");
  })
  .catch(() => {
    console.log("Error in database sync");
  });

if (process.env.NODE_ENV !== "test") {
  app.listen(3000, async () => {
    await logger.info({ message: `server running on port ${PORT}` });
    console.log(`Server is running on port ${PORT}`);

  });
}

export {app,container}