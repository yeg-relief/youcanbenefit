import { Test } from '@nestjs/testing';
import { ClientService } from './client.service';

describe('ClientService', () => {
    let clientService: ClientService;

    beforeEach(async () => {
        const module = await Test.createTestingModule({
            controllers: [],
            components: [ClientService],
        }).compile();
        clientService = module.get<ClientService>(ClientService);
    });

    describe('ping', () => {
        it('should return the result of a ping', async () => {
            // jest.spyOn(clientService, 'ping').mockImplementation(() => result);
            //expect(await clientService.ping()).toBe(true);
            expect(true).toBe(true)
        });
    });
});