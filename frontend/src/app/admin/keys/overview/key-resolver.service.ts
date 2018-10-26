import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot } from '@angular/router'
import { DataService } from '../../data.service';
import 'rxjs/add/operator/do';

@Injectable()
export class KeyResolverService {

  constructor(private data: DataService) {}

  resolve(route: ActivatedRouteSnapshot) {
    return this.data.getKeys();
  }

}
