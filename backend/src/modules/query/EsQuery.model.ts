import { ApplicationQueryDto } from "./ApplicationQuery.dto"
import {EsQueryDto} from "./EsQuery.dto";

export class EsQueryModel {
    public applicationQueryDto: EsQueryDto = null;

    nameMap = {
        "lessThanOrEqual": "lte",
        "lessThan": "lt",
        "equal": "eq",
        "greaterThan": "gt",
        "greaterThanOrEqual": "gte"
    };

    constructor(private data: ApplicationQueryDto) {}

    buildEsQuery(): EsQueryDto {
        if (this.data === undefined || this.data === null) {
            throw new Error("EsQueryModel: unable to build query from invalid data.")
        }

        const meta = {
            program_guid: this.data.guid,
            id: this.data.id
        };

        const query = {
            bool: {
                must: this.data.conditions.map( (applicationCondition: any) => {
                    let type;

                    const isNumberOrInteger = applicationCondition.key.type === "number" || applicationCondition.key.type === "integer";

                    if (applicationCondition.key.type === "boolean") {
                        type = "term"
                    } else if (isNumberOrInteger && applicationCondition.qualifier === "equal") {
                        type = "term"
                    } else if (isNumberOrInteger && applicationCondition.qualifier !== "equal") {
                        type = "range"
                    }

                    const qualifier = this.nameMap[applicationCondition.qualifier];

                    const property = applicationCondition.key.name;

                    let inner;

                    if (type === "term") {
                        inner = { [property]: applicationCondition.value }
                    } else if (type === "range") {
                        inner = { [property]: { [qualifier]: applicationCondition.value }}
                    }


                    return {
                        [type]: {
                            ...inner
                        }
                    }
                })
            }
        };

        const retValue = {
            meta,
            query
        };

        this.applicationQueryDto = retValue;

        return retValue;
    }
}