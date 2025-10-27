export interface CategoryResponse {
    id: string;
    name: string;
    created_at: Date;
    created_by: string | null;
    modified_at: Date;
    modified_by: string | null;
}

export interface CategoryListResponse {
    categories: CategoryResponse[];
    total: number;
    page?: number;
    limit?: number;
}