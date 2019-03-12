import { ApplicationFacingProgram, ProgramCondition, ProgramQuery } from '../../models'
import { FormGroup, FormBuilder, AbstractControl, Validators, FormControl } from '@angular/forms';
import { UserProgram } from './user-program.class';
import { ProgramQueryClass } from './program-query.class';

export class Program {
  application: ProgramQueryClass[];
  user: UserProgram;
  guid: string;
  form: FormGroup;
  data: ApplicationFacingProgram;
  fb: FormBuilder;

  constructor(opts, fb: FormBuilder){
    this.fb = fb;
    // disgusting abuse of ternary operators incoming 
    const queries = opts ? opts.application ? opts.application : [] : [];
    const user = opts ? opts.user ? {...opts.user} : {
      guid: this.generateRandomString(),
      title: '',
      details: '',
      externalLink: '',
      created: 0,
      tags: []
    } : {
      guid: this.generateRandomString(),
      title: '',
      details: '',
      externalLink: '',
      created: 0,
      tags: []
    };

    this.guid = opts ? opts.guid ? opts.guid : user.guid : user.guid;

    this.user = new UserProgram(user, fb);
    this.application = queries.map(q => new ProgramQueryClass(q, fb));

    this.data = {
      user: user,
      application: queries,
      guid: this.guid
    };

    this._initForm();

  }

  private _initForm() {
    const queries = this.application.map(q => q.form);
    this.form = this.fb.group({
      guid: new FormControl(this.guid, Validators.required),
      user: this.user._form,
      application: new FormControl(queries)
    });
  }

  validator(programGroup: AbstractControl): {[key: string]: any} {
    return null;
  }

  _addQuery(query): void {
    const query_obj = new ProgramQueryClass(query, this.fb);
    this.data.application = [ query_obj.data, ...this.data.application ];
    this.application = [query_obj, ...this.application ];
    this._initForm();
  }

  generateRandomString(): string {
    const LENGTH = 26;
    const lowerCaseCharSet = "abcdefghijklmnopqrstuvwxyz";
    const charSet = lowerCaseCharSet
      .concat(lowerCaseCharSet.toUpperCase())
      .concat("1234567890");

    const generateCharacters = () => {
      const arr = new Array(LENGTH);
      for(let i = 0; i < arr.length; i++){
        arr[i] = charSet[Math.floor(Math.random() * charSet.length)];
      }
      return arr;
    };
    
    return generateCharacters().join('');
  }
}

