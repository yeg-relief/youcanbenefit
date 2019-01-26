import { Injectable } from '@angular/core';
import { DataService } from '../../data.service';

@Injectable()
export class KeyResolverService {

  constructor(private data: DataService) {}

  resolve() {
    return this.data.getKeys();
  }

}
