import instance from "@/apis/instance";
import { CategoryResponse } from "@/types/category/categoryApi.type";

export const getCategories = async (): Promise<CategoryResponse[]> => {
  const response = await instance.get<CategoryResponse[]>("/api/categories");
  return response.data;
};
