import { InputCreateProductDto } from "./create.product.dto";
import CreateProductUseCase from "./create.product.usecase";
import ProductRepositoryInterface from "../../../domain/product/repository/product-repository.interface";

describe("Unit test create product use case", () => {
    let input: InputCreateProductDto;
    let productRepository: ProductRepositoryInterface;

    beforeEach(() => {
        input = {
            name: "Product 1",
            price: 10.5,
        };

        productRepository = {
            create: jest.fn(),
            update: jest.fn(),
            find: jest.fn(),
            findAll: jest.fn(),
        };
    });

    it("should create a product", async () => {
        const createProductUseCase = new CreateProductUseCase(productRepository);

        const output = await createProductUseCase.execute(input);

        expect(output).toEqual({
            id: expect.any(String),
            name: input.name,
            price: input.price,
        });
    });

    it("should thrown an error when name is missing", async () => {
        const createProductUseCase = new CreateProductUseCase(productRepository);

        input.name = "";

        await expect(createProductUseCase.execute(input)).rejects.toThrow(
            "Name is required"
        );
    });
});