import { Search } from "@/assets/svgs/search";
import LoadingSpinner from "@/components/common/LoadingSpinner";
import { categoryImageByName } from "@/constants/category";
import { useCategoriesApi } from "@/hooks/category/useCategoriesApi";
import React from "react";
import { useNavigate } from "react-router-dom";

const CategorySelectPage: React.FC = () => {
  const navigate = useNavigate();
  const { data: categories = [], isLoading, isError } = useCategoriesApi();

  const handleCategoryClick = (categoryName: string, id: number) =>
    navigate("/search/category-result", {
      state: { category: categoryName, categoryId: id },
    });

  const handleSearchClick = () => navigate("/search");

  if (isLoading) return <LoadingSpinner />;

  if (isError) {
    return (
      <div className="flex min-h-[812px] items-center justify-center text-reg14 text-grey10">
        카테고리 목록을 불러오지 못했습니다.
      </div>
    );
  }

  return (
    <div className="w-full max-w-[375px] mx-auto bg-white min-h-[812px] px-[34px] py-6">
      {/* 검색창 */}
      <div className="mb-[21px]">
        <div
          className="flex items-center bg-white rounded-xl px-4 py-3 border border-grey09 cursor-pointer"
          onClick={handleSearchClick}
        >
          <Search className="w-4 h-4 mr-2" />
          <span className="text-med16 text-darkgrey02 placeholder-bluegrey04">
            검색어를 입력하세요
          </span>
        </div>
      </div>

      {/* 구분선 */}
      <div className="w-full border-t border-grey02 mb-[19px]" />

      {/* 카테고리 */}
      <h2 className="mb-[15px] text-med16 text-darkgrey05">카테고리 선택</h2>

      <div className="flex justify-center">
        <div className="grid grid-cols-3 gap-x-[21px] gap-y-[12px]">
          {categories.map(({ categoryId, categoryName }) => (
            <button
              key={categoryId}
              onClick={() => handleCategoryClick(categoryName, categoryId)}
              className="flex flex-col items-center cursor-pointer"
            >
              <div className="w-[88px] aspect-square flex items-center justify-center overflow-hidden">
                {categoryImageByName[categoryName] && (
                  <img
                    src={categoryImageByName[categoryName]}
                    alt={categoryName}
                    className="max-w-[70%] max-h-[70%] object-contain"
                  />
                )}
              </div>
              <span className="mt-2 text-med14 text-darkgrey05 text-center">
                {categoryName}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CategorySelectPage;
