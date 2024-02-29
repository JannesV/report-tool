import { ReportCategoryDto } from "./types";

const filterCustom = (cat: ReportCategoryDto[]): ReportCategoryDto[] => {
  return cat
    .map((c) => {
      const newSubs = filterCustom(c.subCategories || []);

      if (c.isVictor && !newSubs.length) {
        return null;
      }

      return {
        ...c,
        subCategories: newSubs,
      };
    })
    .filter(Boolean) as ReportCategoryDto[];
};

const removeIsVictor = (
  categories?: ReportCategoryDto[]
): ReportCategoryDto[] | undefined =>
  categories?.map((cat) => ({
    ...cat,
    isVictor: undefined,
    subCategories: cat.subCategories?.length
      ? removeIsVictor(cat.subCategories)
      : undefined,
  }));

export const filterCustomCategories = (
  categories: ReportCategoryDto[]
): ReportCategoryDto[] | undefined => {
  return removeIsVictor(filterCustom(categories));
};
