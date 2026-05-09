/** Only machinery & consumables use `/products/[id]` detail pages and card links. */
export const PRODUCT_DETAIL_CATEGORY_SLUG = "frame_machinery_consumables";

export function isProductDetailCategory(category: string | null | undefined): boolean {
  return (category || "").trim() === PRODUCT_DETAIL_CATEGORY_SLUG;
}

/** List URL for a product’s category (matches /products category filters). */
export function catalogBackHrefForCategory(category: string | null | undefined): string {
  if (category === "frame_machinery_consumables") {
    return "/products?category=frame_machinery_consumables";
  }
  if (category === "finished_products_others") {
    return "/products?category=finished_products_others";
  }
  return "/products?category=ps_moldings";
}
