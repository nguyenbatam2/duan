export interface Category {
    [x: string]: Category[];
    id: number;
    name: string;
    slug: string;
}