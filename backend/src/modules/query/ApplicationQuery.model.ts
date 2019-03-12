import {EsQueryDto} from "./EsQuery.dto";
import {ApplicationQueryDto} from "./ApplicationQuery.dto";
import {EsConditionModel} from "./EsCondition.model"

export class ApplicationQueryModel {
    public applicationQueryDto: ApplicationQueryDto = null;

    constructor(private data: EsQueryDto) {}

    buildApplicationQuery(): ApplicationQueryDto {
        if (this.data === undefined || this.data === null) {
            throw new Error("ApplicationQueryModel: unable to build query from invalid data.")
        }

        const guid = this.data.meta.program_guid;
        const id = this.data.meta.id;
        const conditions = this.data.query.bool.must
            .map( rawCondition => new EsConditionModel(rawCondition, this.data.meta.questionTexts) )
            .map( esCondition => esCondition.toApplicationModel() );

        this.applicationQueryDto = new ApplicationQueryDto({
            guid,
            id,
            conditions
        });

        return this.applicationQueryDto
    }
}