import { Get, Controller, Param, Body, Post } from '@nestjs/common';
import { Observable } from "rxjs/Observable"
import { ProgramService } from "../Program/program.service";
import { ScreenerService } from "../screener/screener.service"
import { ProgramDto } from "../Program/program.dto";
import { PercolateService } from "../percolate/percolate.service";
import { DocumentService } from "../document/document.service"
import { DocumentDto } from '../document/document.dto';

@Controller('api')
export class ApiController {
    constructor(
        private programService: ProgramService,
        private screenerService: ScreenerService,
        private percolateService: PercolateService,
        private documentService: DocumentService
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

    @Get('document/:title')
    getDocumentByTitle(@Param() params): Promise<string>{
        return this.documentService.getByTitle(params.title);
    }

    @Post('document')
    createDocument(@Body() body): Promise<any>{
        return this.documentService.create(body);
    }

    @Post('notification')
    getProgramsFromForm(@Body() body): Observable<ProgramDto[]> {
        return this.percolateService.precolate(body);
    }
}