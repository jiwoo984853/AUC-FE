import { getCategories } from "@/apis/category/categoryApi";
import { useQuery } from "@tanstack/react-query";

export const useCategoriesApi = () =>
  useQuery({
    queryKey: ["categories"],
    queryFn: getCategories,
    staleTime: 1000 * 60 * 30,
  });
