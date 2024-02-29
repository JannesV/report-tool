import { ReportCategoryDto } from "./types";

export const mergeCategories = (
  categories1: ReportCategoryDto[],
  categories2: ReportCategoryDto[]
): ReportCategoryDto[] => {
  const mergedCategories: ReportCategoryDto[] = [];

  // Combine categories from categories1 and categories2
  categories1.forEach((cat1) => {
    const matchingCat2 = categories2.find((cat2) => cat2.id === cat1.id);

    if (matchingCat2) {
      // Merge the two categories
      const mergedCategory: ReportCategoryDto = {
        ...cat1,
        subCategories: mergeCategories(
          cat1.subCategories || [],
          matchingCat2.subCategories || []
        ),
      };
      mergedCategories.push(mergedCategory);
    } else {
      mergedCategories.push(cat1);
    }
  });

  // Add categories from categories2 that are not already present
  categories2.forEach((cat2) => {
    const existingCategory = mergedCategories.find((cat) => cat.id === cat2.id);
    if (!existingCategory) {
      mergedCategories.push(cat2);
    }
  });

  return mergedCategories;
};
