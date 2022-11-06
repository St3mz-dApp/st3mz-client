const STORAGE_BANNER_DISMISSED = "ST3MZ_banner_dismissed";

export const getBannerDismissed = (): boolean => {
  return localStorage.getItem(STORAGE_BANNER_DISMISSED) ? true : false;
};

export const setBannerDismissed = (): void => {
  localStorage.setItem(STORAGE_BANNER_DISMISSED, "true");
};
