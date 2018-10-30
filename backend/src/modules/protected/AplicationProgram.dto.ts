import { ApplicationQueryDto } from "../query/ApplicationQuery.dto";
import { ProgramDto } from "../Program/program.dto"

export class ApplicationProgramDto {
    constructor(
        readonly application: ApplicationQueryDto[],
        readonly user: ProgramDto,
        readonly guid: string
    ) {}
}