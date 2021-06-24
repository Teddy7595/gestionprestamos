import { Global, Module } from "@nestjs/common";
import {
  DateProcessService,
  FilesService,
  ProcessDataService,
  SetStatusMessageService
} from "./classes.index";

@Global()
@Module({
  imports: [],
  controllers: [],
  providers: [DateProcessService, FilesService, ProcessDataService, SetStatusMessageService],
  exports: [DateProcessService, FilesService, ProcessDataService, SetStatusMessageService],
})
export class ClassesModule {}
