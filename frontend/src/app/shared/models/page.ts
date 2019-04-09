import { Document } from './document';

export interface Page {
    title: string;
    documents: Document[];
    created: number;
}