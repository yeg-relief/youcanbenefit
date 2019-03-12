import { DocumentDto } from "./document.dto";

export class PageDto {
    title: string;
    documents: DocumentDto[];
    created: number;
}