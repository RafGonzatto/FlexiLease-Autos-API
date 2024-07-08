import 'reflect-metadata';
import request from 'supertest';
import '../../container';
import { container } from 'tsyringe';
import CarService from '../../services/car.service';
import AppDataSource from '../../database/connection';
import { ICar } from '../../interfaces/car.interface';
import { HttpStatusCode } from 'axios';

const baseUrl = 'http://localhost:3000';

let jwtToken: string;

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
        
    jwtToken = authResponse.body.token;
});

afterAll(async () => {
    await AppDataSource.dropDatabase();
    await AppDataSource.destroy();
});


describe('CarService', () => {
    let carService: CarService;

    beforeEach(() => {
        carService = container.resolve(CarService);
    });

    describe('Create Car', () => {
        it('should be possible to create a new car', async () => {
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

            const response = await request(baseUrl)
                .post('/api/v1/car')
                .set('Authorization', `Bearer ${jwtToken}`) 
                .send(createCar);

            expect(response.status).toBe(HttpStatusCode.Created);
            expect(response.body).toHaveProperty('_id');
            expect(response.body.model).toBe(createCar.model);
            expect(response.body.value_per_day).toBe(createCar.value_per_day);
        });
    });

    describe('Get Car by ID', () => {
        it('should retrieve an existing car by its ID', async () => {
            const carData: ICar = {
                model: "Corolla 1.8",
                color: "Blue",
                year: "2022",
                value_per_day: 180,
                accessories: [
                    { description: "Sunroof" },
                    { description: "Premium audio system" }
                ],
                number_of_passengers: 5
            };
      
            const createdCar = await carService.createCar(carData);

            const response = await request(baseUrl)
                .get(`/api/v1/car/${createdCar._id}`)
                .set('Authorization', `Bearer ${jwtToken}`); 

            expect(response.status).toBe(HttpStatusCode.Ok);
        });
    });

    describe('Update Car', () => {
        it('should update an existing car', async () => {
            const carData: ICar = {
                model: "Golf GTI",
                color: "Red",
                year: "2021",
                value_per_day: 200,
                accessories: [
                    { description: "Sports suspension" },
                    { description: "Performance brakes" }
                ],
                number_of_passengers: 4
            };

            const createdCar = await carService.createCar(carData);

            const updatedCarData: Partial<ICar> = {
                model: "Golf GTI",
                color: "Chrome",
                year: "2022",
                value_per_day: 300,
                accessories: [
                    { description: "Sports suspension" },
                    { description: "Performance brakes" }
                ],
                number_of_passengers: 4
            };

            const response = await request(baseUrl)
                .put(`/api/v1/car/${createdCar._id.valueOf().toString()}`)
                .set('Authorization', `Bearer ${jwtToken}`) 
                .send(updatedCarData);

            expect(response.status).toBe(HttpStatusCode.Ok);
            expect(response.body).toHaveProperty('_id', createdCar._id.valueOf().toString());
            expect(response.body.color).toBe(updatedCarData.color);
            expect(response.body.value_per_day).toBe(updatedCarData.value_per_day);
        });
    });

    describe('Delete Car', () => {
        it('should delete an existing car', async () => {
            const carData: ICar = {
                model: "Tesla Model S",
                color: "White",
                year: "2023",
                value_per_day: 300,
                accessories: [
                    { description: "Autopilot" },
                    { description: "Full self-driving capability" }
                ],
                number_of_passengers: 4
            };

            const createdCar = await carService.createCar(carData);

            const response = await request(baseUrl)
                .delete(`/api/v1/car/${createdCar._id}`)
                .set('Authorization', `Bearer ${jwtToken}`); 

            expect(response.status).toBe(HttpStatusCode.Ok);

            const deletedCar = await carService.getCarById(createdCar._id.valueOf().toString());
            expect(deletedCar).toBeNull();
        });
    });

    describe('List Cars', () => {
        it('should list all beige cars', async () => {
            const carData1: ICar = {
                model: "BMW M3",
                color: "Beige",
                year: "2022",
                value_per_day: 250,
                accessories: [
                    { description: "Carbon fiber roof" },
                    { description: "High-performance exhaust" }
                ],
                number_of_passengers: 4
            };

            const carData2: ICar = {
                model: "Audi A4",
                color: "Beige",
                year: "2021",
                value_per_day: 180,
                accessories: [
                    { description: "Bang & Olufsen audio system" },
                    { description: "Virtual cockpit" }
                ],
                number_of_passengers: 5
            };

            await carService.createCar(carData1);
            await carService.createCar(carData2);

            const response = await request(baseUrl)
                .get('/api/v1/car?color=Beige&limit=10&offset=0')
                .set('Authorization', `Bearer ${jwtToken}`); 

            expect(response.status).toBe(HttpStatusCode.Ok);
            expect(response.body.cars.length).toBe(2); 
        });
    });
    describe('Authentication Error', () => {
        it('should not create a car without authentication token', async () => {
          
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
    
                const response = await request(baseUrl)
                    .post('/api/v1/car')
                    .send(createCar);
    
                expect(response.status).toBe(HttpStatusCode.Unauthorized);
        });
    });
});
