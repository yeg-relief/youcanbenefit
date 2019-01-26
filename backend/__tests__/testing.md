# Testing
## Unit Tests
Unit tests are housed adjacent to each file. Typically, dependancies are mocked, with only the functionality of the core module being tested. Files typically have a ${filename}.spec.ts or ${filename}.test.ts pattern.

## End to End Tests
We use the integration.runner.sh script to stand up a new Elasticsearch container, seed it with dummy data, then run tests on it. We use snapshot testing for most of these tests. POST, PUT and DELETE modify the state, so we haven't found a way to reliably use snapshot testing with these HTTP verbs.

Often times, you may want to debug your tests, so running the runner script isn't an option. In these cases, run the following Docker command:

``` bash
docker run --name ycbIntegrationES -p 9400:9200 -p 9500:9300 -e discovery.type=single-node docker.elastic.co/elasticsearch/elasticsearch:6.1.0
```

Next, run `/__tests__/seed/run.ts`. You should see confirmation certain indexes were created in Elasticsearch.

Finally, run your Jest debug command. If you're using VS Code, see this launch.json.

## Coverage
Coverage reports are generated using `jest --coverage`.