import { Sequelize } from "sequelize-typescript";
import ProductRepository from "../../../infrastructure/product/repository/sequelize/product.repository";
import ListProductUseCase from "./list.product.usecase";
import Product from "../../../domain/product/entity/product";
import ProductModel from "../../../infrastructure/product/repository/sequelize/product.model";

describe("Integration test for listing product use case", () => {
    let sequelize: Sequelize;

    beforeEach(async () => {
        sequelize = new Sequelize({
            dialect: "sqlite",
            storage: ":memory:",
            logging: false,
            sync: { force: true },
        });

        await sequelize.addModels([ProductModel]);
        await sequelize.sync();
    });

    afterEach(async () => {
        await sequelize.close();
    });

    it("should list products", async () => {
        const productRepository = new ProductRepository();
        const usecase = new ListProductUseCase(productRepository);
    
        const product1 = new Product("1", "Product 1", 100);
        const product2 = new Product("2", "Product 2", 200);
    
        await productRepository.create(product1);
        await productRepository.create(product2);

        const input = {};

        const result = await usecase.execute(input);

        const expectedOutput = {
            products: [
                { id: "1", name: "Product 1", price: 100 },
                { id: "2", name: "Product 2", price: 200 },
            ],
        };

        expect(result).toEqual(expectedOutput);
    });
});