import express from "express";
import dotenv from "dotenv";
import {Container} from "inversify";
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
// import { logger } from "./common/loggerInstance";

dotenv.config();
const PORT = process.env.PORT;
const container = new Container();

const app = express();
app.use(express.json());

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

container.bind<IReviewService>("IReviewService").to(ReviewService);
const reviewService = container.get<IReviewService>("IReviewService");
const reviewController = new ReviewController(reviewService);
const reviewRouterInstance = new ReviewRoute(reviewController);

app.use("/user", reviewRouterInstance.getRouter());
app.use("/admin", reviewRouterInstance.getRouter());

app.use("/user", bookRouterInstance.getRouter());
app.use("/admin", bookRouterInstance.getRouter());

sequelize
  .authenticate()
  .then(() => {
    console.log("Database connected");
  })
  .catch(() => {
    console.log("Error in connecting to database");
  });

sequelize
  .sync()
  .then(() => {
    console.log("Database synced");
  })
  .catch(() => {
    console.log("Error in database sync");
  });

  if(process.env.NODE_ENV!=="test")
  {
    app.listen(3000, async () => {
      // await logger.info({ message: `server running on port ${PORT}` });
      console.log(`Server is running on port ${PORT}`);
    });
  }

export {app,container}