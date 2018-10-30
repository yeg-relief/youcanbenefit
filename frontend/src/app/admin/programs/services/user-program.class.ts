import { UserFacingProgram } from '../../../shared/models'
import {
    FormGroup,
    FormBuilder,
    Validators,
    FormControl,
    FormArray
} from '@angular/forms';

export class UserProgram {
    data: UserFacingProgram;
    _form: FormGroup;

    constructor(opts, fb: FormBuilder){

        const obj = {
            guid:  opts.guid ? opts.guid : '',
            title: opts.title ? opts.title : '',
            description: opts.description ? opts.description : '',
            details: opts.details ? opts.details : '',
            detailLinks: opts.detailLinks ? [...opts.detailLinks] : [],
            externalLink: opts.externalLink ? opts.externalLink : '',
            created: opts.created ? opts.created : 0,
            tags: opts.tags && Array.isArray(opts.tags) ? [...opts.tags] : []
        };

        this.data = Object.assign({}, obj);

        this._initForm(fb);

    }

    private _initForm(fb: FormBuilder) {
        this._form = fb.group({
            guid: new FormControl(this.data.guid, Validators.required),
            title: new FormControl(this.data.title, Validators.required),
            description: new FormControl(this.data.description, Validators.required),
            details: new FormControl(this.data.details, Validators.required),
            detailLinks: new FormArray(this.data.detailLinks.map(link => new FormControl(link))),
            externalLink: new FormControl(this.data.externalLink),
            created: new FormControl(this.data.created),
            tags: new FormArray(this.data.tags.map(tag => new FormControl(tag)))
        })

    }

    commit() {
        this.data = {...this._form.value};
    }
}

