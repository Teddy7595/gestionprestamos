// // import dotenv from 'dotenv';

// const dotenv = require("dotenv");
// // const dotenvExpand = require('dotenv-expand');
// const envFound = dotenv.config();

// console.log("process.env", process.env.NODE_ENV);
// // Set the NODE_ENV to 'development' by default
// process.env.NODE_ENV = process.env.NODE_ENV || "development";

// if (envFound.error) {
//   // This error should crash whole process

//   throw new Error("⚠️  Couldn't find .env file  ⚠️");
// }

// export default {
//   /**
//    * Your favorite port
//    */
//   port: parseInt(process.env.PORT, 10),

//   /*
//    Origin permision CORS
//   */
//   _originCors: process.env.ALLOWEDORIGINS,

//   /**
//    * That long string from mlab
//    */
//   databaseURL: process.env.MONGODB_URI,

//   /**
//    * Your secret sauce
//    */
//   jwtSecret: process.env.JWT_SECRET,

//   /**
//    * Used by winston logger
//    */
//   logs: {
//     level: process.env.LOG_LEVEL || "silly",
//   },

//   /**
//    * Agenda.js stuff
//    */
//   // agenda: {
//   //   dbCollection: process.env.AGENDA_DB_COLLECTION,
//   //   pooltime: process.env.AGENDA_POOL_TIME,
//   //   concurrency: parseInt(process.env.AGENDA_CONCURRENCY, 10),
//   // },

//   /**
//    * Agendash config
//    */
//   // agendash: {
//   //   user: 'agendash',
//   //   password: '123456'
//   // },
//   /**
//    * API configs
//    */
//   api: {
//     prefix: "/",
//   },
//   /**
//    * Mailgun email credentials
//    */
//   // emails: {
//   //   apiKey: process.env.MAILGUN_API_KEY,
//   //   domain: process.env.MAILGUN_DOMAIN
//   // }
// };

import * as fs from "fs";
import { parse } from "dotenv";
const dotenv = require("dotenv");
dotenv.config();

export class ConfigService {
  private readonly envConfig: { [key: string]: string };

  constructor() {
    const isDevelopmentEnv = process.env.NODE_ENV !== "production";

    if (isDevelopmentEnv) {
      const envFilePath = __dirname + "/../../.env";
      const existsPath = fs.existsSync(envFilePath);

      if (!existsPath) {
        console.log(".env file does not exist");
        process.exit(0);
      }

      this.envConfig = parse(fs.readFileSync(envFilePath));
    } else {
      // caso de producción hay que arreglarlo
      // this.envConfig = {
      //   PORT: process.env.PORT,
      // };

      const envFilePath = __dirname + "/../.env";
      const existsPath = fs.existsSync(envFilePath);

      if (!existsPath) {
        console.log(".env file does not exist");
        process.exit(0);
      }

      this.envConfig = parse(fs.readFileSync(envFilePath));

    }
  }

  get(key: string): string {
    return this.envConfig[key];
  }
}
