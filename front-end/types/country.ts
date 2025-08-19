export interface Country {
  id: number;
  name: string;
  iso_code: string;
}

export interface Pagination {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
}

export interface CountriesResponse {
  items: Country[];
  pagination: Pagination;
}
