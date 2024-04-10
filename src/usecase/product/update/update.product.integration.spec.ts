import { Sequelize } from "sequelize-typescript";
import ProductRepository from "../../../infrastructure/product/repository/sequelize/product.repository";
import UpdateProductUseCase from "./update.product.usecase";
import Product from "../../../domain/product/entity/product";
import { InputUpdateProductDto } from "./update.product.dto";
import ProductModel from "../../../infrastructure/product/repository/sequelize/product.model";

describe("Integration test update product use case", () => {
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

    it("should update a product", async () => {
        const productRepository = new ProductRepository(); // Assuming the repository needs Sequelize instance
        const usecase = new UpdateProductUseCase(productRepository);

        // Create a product to update
        const initialProduct = await productRepository.create(new Product("1", "Initial Product", 100));

        const input = {
            id: "1", 
            name: "Updated Product",
            price: 150,
        };

        const output = await usecase.execute(input);

        // Assertions to verify the output matches the expected results
        expect(output.id).toEqual(input.id);
        expect(output.name).toEqual(input.name);
        expect(output.price).toEqual(input.price);

        // Optionally, verify the product was updated in the database
        const updatedProduct = await productRepository.find(input.id);
        expect(updatedProduct.name).toEqual(input.name);
        expect(updatedProduct.price).toEqual(input.price);
    });
});
