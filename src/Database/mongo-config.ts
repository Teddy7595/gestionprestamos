import { MongooseModule } from "@nestjs/mongoose";
import { ConfigService } from "src/Config";

const config = new ConfigService();
export const _MONGOOSEMODULE = MongooseModule.forRoot(
  config.get("MONGODB_URI")
);
