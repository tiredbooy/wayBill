package models

type Pagination struct {
	TotalItems int64 `json:"total_items"`
	TotalPage  int64 `json:"total_page"`
	HasNext    bool  `json:"has_next"`
	HasPrev    bool  `json:"has_prev"`
}

type Page[T any] struct {
	Pagination
	Results []T `json:"results"`
}

/* To Use this we call it like this

Page[Type] For Example
	Page[DriverDataresponse]

and we add data there

*/
