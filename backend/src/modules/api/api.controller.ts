import { Get, Controller, Param, Body, Post } from '@nestjs/common';
import { Observable } from "rxjs/Observable"
import { ProgramService } from "../Program/program.service";
import { ScreenerService } from "../screener/screener.service"
import { ProgramDto } from "../Program/program.dto";
import { PercolateService } from "../percolate/percolate.service";

@Controller('api')
export class ApiController {
    constructor(
        private programService: ProgramService,
        private screenerService: ScreenerService,
        private percolateService: PercolateService
    ) {}

    @Get('screener')
    getScreener(): Observable<any> {
        return this.screenerService.getLatest();
    }

    @Get('program')
    getAllUserPrograms(): Observable<ProgramDto[]> {
        return this.programService.findAll();
    }

    @Get('program/:guid')
    getProgramByGuid(@Param() params): Promise<ProgramDto> {
        return this.programService.getByGuid(params.guid);
    }

    @Post('document')
    createDocument(@Body() body): Observable<any>{
        return Observable.from(Promise.resolve('hello'));
    }

    @Post('notification')
    getProgramsFromForm(@Body() body): Observable<ProgramDto[]> {
        return this.percolateService.precolate(body);
    }
}