import 'reflect-metadata';
import request from 'supertest';
import '../../container';
import { container } from 'tsyringe';
import ReserveService from '../../services/reserve.service';
import AppDataSource from '../../database/connection';
import { ICar } from '../../interfaces/car.interface';
import { HttpStatusCode } from 'axios';

const baseUrl = 'http://localhost:3000';

let jwtToken: string;
let id_car: string;
let id_user: string;

beforeAll(async () => {
    await AppDataSource.initialize();

    const user = await request(baseUrl)
    .post('/api/v1/user')
    .send({
        name: 'John Doe',
        email: 'user@example.com',
        birth: '01/01/2000',
        cpf: '035.024.950-41',
        cep: '98801613',
        qualified: 'sim',
        password: 'password123',
    });
    const authResponse = await request(baseUrl)
        .post('/api/v1/authenticate')
        .send({
            email: 'user@example.com',
            password: 'password123'
        });
    id_user = user.body._id.valueOf();
    jwtToken = authResponse.body.token;
    
    const createCar: ICar = {
        model: "Civic S10 2.8",
        color: "Silver",
        year: "2020",
        value_per_day: 150,
        accessories: [
            { description: "GPS" },
            { description: "Leather seats" }
        ],
        number_of_passengers: 5
    };

    const car = await request(baseUrl)
        .post('/api/v1/car')
        .set('Authorization', `Bearer ${jwtToken}`) 
        .send(createCar);

    id_car = car.body._id.valueOf();

});

afterAll(async () => {
    await AppDataSource.dropDatabase();
    await AppDataSource.destroy();
});


describe('ReserveService', () => {
    let reserveService: ReserveService;

    beforeEach(() => {
        reserveService = container.resolve(ReserveService);
    });

    describe('Create a Reserve', () => {
        it('should be possible to create a new reserve', async () => {
            const response = await request(baseUrl)
                .post('/api/v1/reserve')
                .set('Authorization', `Bearer ${jwtToken}`) 
                .send({
                    id_car: id_car,
                    id_user: id_user,
                    start_date: "01/01/2022",
                    end_date: "10/01/2022"
                });

            expect(response.status).toBe(HttpStatusCode.Created);
            expect(response.body).toHaveProperty('_id');
            expect(response.body).toHaveProperty('final_value');
        });
    });
        it('should not create a reserve without authentication token', async () => {
            const response = await request(baseUrl)
                .post('/api/v1/reserve')
                .send({
                    id_car: id_car,
                    id_user: id_user,
                    start_date: "01/01/2022",
                    end_date: "10/01/2022"
                });

            expect(response.status).toBe(HttpStatusCode.Unauthorized);
        });

        it('should not create a reserve with missing fields', async () => {
            const response = await request(baseUrl)
                .post('/api/v1/reserve')
                .set('Authorization', `Bearer ${jwtToken}`)
                .send({
                    id_car: 'car_id'
                });

            expect(response.status).toBe(HttpStatusCode.BadRequest);
        });

        it('should not create a reserve with invalid data', async () => {
            const response = await request(baseUrl)
                .post('/api/v1/reserve')
                .set('Authorization', `Bearer ${jwtToken}`)
                .send({
                    id_car: id_car,
                    id_user: id_user,
                    start_date: "invalid_date_format", 
                    end_date: "2022-01-10"
                });

            expect(response.status).toBe(HttpStatusCode.BadRequest);
        });
        it('should not create a reserve with a non existing user', async () => {
            const response = await request(baseUrl)
                .post('/api/v1/reserve')
                .set('Authorization', `Bearer ${jwtToken}`)
                .send({
                    id_car: id_car,
                    id_user: '668b5507b2a5b954a52f9b8d',
                    start_date: "01/01/2022",
                    end_date: "10/01/2022"
                });

            expect(response.status).toBe(HttpStatusCode.NotFound);
        });
});
