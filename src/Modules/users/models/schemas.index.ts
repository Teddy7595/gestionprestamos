import { MongooseModule } from "@nestjs/mongoose";



import { Users, UsersSchema } from "./schemas/userSchema";

export const _USERSCHEMA = MongooseModule.forFeature([
  {
    name: Users.name,
    schema: UsersSchema,
  },
]);
 


// export const _USERSCHEMA = MongooseModule.forFeature([
//   {
//     name: Users.name,
//     schema: UsersSchema.plugin(uniqueValidator, {
//         response: "{PATH} debe ser único",
//     })
//       // schema.plugin(require('mongoose-autopopulate'));

//     // schema: UsersSchema,
//   },
// ]);

// imports: [
//   MongooseModule.forFeatureAsync([
//     {
//       name: Cat.name,
//       useFactory: () => {
//         const schema = CatsSchema;
//         schema.plugin(require('mongoose-autopopulate'));
//         return schema;
//       },
//     },
//   ]),
// ],
// })
// export class AppModule {}
