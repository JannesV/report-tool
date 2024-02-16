export enum CategoryType {
  MAIL = "mail",
  EXTERNAL = "external",
}

export type ReportCategoryDto = {
  id: string;
  name: string;
  subCategories?: Array<ReportCategoryDto>;
  type?: CategoryType;
  /**
   * If a fallback is present the app will redirect the user to the fallback page instead of continuing the app flow.
   */
  fallback?: string;
  to?: string;
};
