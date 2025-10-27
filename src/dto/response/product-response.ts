export interface ProductResponse {
    id: string;
    name: string;
    price: number;
    stock: number;
    categoryId: string;
    category?: {
        id: string;
        name: string;
    };
    created_at: Date;
    created_by: string | null;
    modified_at: Date;
    modified_by: string | null;
}

export interface ProductListResponse {
    products: ProductResponse[];
    total: number;
    page?: number;
    limit?: number;
}