export const WHATSAPP_NUMBER = "918778021169";
export const WHATSAPP_DISPLAY = "+91 87780 21169";
export const INSTAGRAM_URL = "https://instagram.com/westernrathi";
export const BRAND_NAME = "Western Rathi";

export const KIDS_SIZES = [
  "0-6M",
  "6-12M",
  "1-2Y",
  "2-3Y",
  "3-4Y",
  "4-5Y",
  "5-6Y",
  "6-7Y",
  "7-8Y",
  "8-9Y",
  "9-10Y",
  "10-11Y",
  "11-12Y",
];

export const SAREE_SIZES = ["Free Size (5.30m)"];

export const SIZE_CHART: { size: string; chest: string }[] = [
  { size: "0-6M", chest: "18 in" },
  { size: "6-12M", chest: "20 in" },
  { size: "1-2Y", chest: "22 in" },
  { size: "2-3Y", chest: "24 in" },
  { size: "3-4Y", chest: "26 in" },
  { size: "4-5Y", chest: "28 in" },
  { size: "5-6Y", chest: "30 in" },
  { size: "6-7Y", chest: "30 in" },
  { size: "7-8Y", chest: "32 in" },
  { size: "8-9Y", chest: "32 in" },
  { size: "9-10Y", chest: "34 in" },
  { size: "10-11Y", chest: "34 in" },
  { size: "11-12Y", chest: "36 in" },
];

export const FABRICS = [
  "Cotton",
  "Soft Cotton",
  "Cotton Blend",
  "Rayon",
  "Georgette",
  "Net",
  "Organza",
  "Satin",
  "Chiffon",
  "Velvet",
  "Denim",
  "Fleece",
  "Pure Silk / Art Silk",
  "Kanchipuram Silk",
  "Linen Blend",
];

export const STOCK_STATUSES = ["In Stock", "Out of Stock", "Pre-Order"];

export const COLOUR_OPTIONS = [
  "Black",
  "White",
  "Cream",
  "Pink",
  "Red",
  "Maroon",
  "Peach",
  "Blue",
  "Navy Blue",
  "Yellow",
  "Green",
  "Golden",
  "Silver",
  "Multicolour",
];

export const COLOUR_SWATCHES: Record<string, string> = {
  Black: "#1c1a1b",
  White: "#ffffff",
  Cream: "#f3e7d3",
  Pink: "#f0a0b8",
  Red: "#d02f3a",
  Maroon: "#7b1e3a",
  Peach: "#f6b99a",
  Blue: "#4a86c5",
  "Navy Blue": "#1f3763",
  Yellow: "#e9b83b",
  Green: "#4f9d5d",
  Golden: "#c9a227",
  Silver: "#c3c8cc",
  Multicolour: "linear-gradient(135deg,#2ba6c9,#8e3bbf,#e0378f,#f08a24,#5fc45a)",
};

export const SAREE_CATEGORY = "designer-sarees";

export const TERMS: string[] = [
  "All orders are confirmed only after final payment/confirmation via WhatsApp. No COD option available.",
  "Product colours may vary slightly due to screen/lighting differences.",
  "Sizes are approximate; please refer to the size chart before ordering.",
  "No exchange accepted unless for a product defect issue, within 3 days of delivery, unused with tags intact and a proper unboxing video.",
  "No returns on customized, sale, or clearance items.",
  "Delivery timelines are estimates and may vary due to courier delays.",
  "Prices are subject to change without prior notice.",
  "Orders once shipped cannot be cancelled.",
];

export function formatPrice(value: number): string {
  return `₹${Number(value).toLocaleString("en-IN", { maximumFractionDigits: 0 })}`;
}

export function whatsappLink(message: string): string {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}
