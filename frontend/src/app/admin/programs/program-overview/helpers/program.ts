import { ProgramQuery, ApplicationFacingProgram } from '../../../models/program';

export function deepCopyQueries(program: ApplicationFacingProgram): ProgramQuery[] {
  const queries = []
  for(const query of program.application) {
    const q: ProgramQuery = {
      id: query.id,
      guid: query.guid,
      conditions: query.conditions.map(condition => (<any>Object).assign({}, condition))
    }

    queries.push(q);
  }

  return queries;
}